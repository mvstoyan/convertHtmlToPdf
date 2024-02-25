import multer from "multer";
import path from "path";
import fs from "fs";
import extractFiles from "../utils/extractFiles.js";
import convertHtmlToPdf from "../utils/convertHtmlToPdf.js";
import findHtml from "../utils/findHtml.js";
import addLog from "../utils/addLog.js";
import countExecutionTime from "../utils/countExecutionTime.js";
import { DESTINATION_PATH, EXTRACT_PATH } from "../expressServer.js";
import { OK } from "http-status-codes";
import {
  FileSizeError,
  InvalidFileTypeError,
  FileNotFoundError,
  ConversionError,
} from "../errors/customErrors.js";


const GIGABYTE = Math.pow(1024, 3); // Constant defining size of gigabyte in bytes
const MAX_SIZE = 2 * GIGABYTE; // Maximum file size in bytes
const FILE_TYPE = "zip"; // Expected file type for upload

export const handleConversion = async (req, res, next) => {
  /* 
        #swagger.tags = ['Convert']
        #swagger.description = 'Convert HTML to PDF' 
        #swagger.parameters['singleFile'] = {
            in: 'formData',
            type: 'file',
            name: 'file',
            description: 'zip archive containing index.html'
        }
        #swagger.responses[200] = {
            description: "Conversion completed successfully",
            content: {
                'application/pdf': {
                    schema: {
                        type: 'file',
                        format: 'binary',
                    }
                }
            }
        }
        #swagger.responses[400] = {
            description: "• Upload a file with the .zip extension\n • File size should be less than 2GB\n • Upload an archive\n • Archive must contain the index.html file\n • Something went wrong..."
        }
    */

  const convertStart = Date.now();
  const upload = multer({
    // Configure multer for file upload
    storage: multer.diskStorage({
      destination: DESTINATION_PATH, // Specify destination directory to save file
      filename: function (req, file, cb) {
        // Function to generate file name
        cb(null, file.originalname); // Use original file name
      },
    }),
    limits: {
      fileSize: MAX_SIZE, // Limit size
    },
    fileFilter(req, file, cb) {
      // Function to filter uploaded files
      const extension = path.extname(file.originalname) === `.${FILE_TYPE}`; // Check file extension
      if (extension) {
        // If extension matches expected type
        return cb(null, true); // Allow file
      } else {
        // If the extension does not match the expected type
        const message = `Upload a file with the .${FILE_TYPE} extension`; // Formulate an error message
        return cb(new InvalidFileTypeError(message), false); // Reject file and generate an error
      }
    },
  }).single("file"); // Upload only one file

  upload(req, res, async function (err) {
    // Run middleware to handle uploaded file
    try {
      if (err instanceof multer.MulterError) {
        // Handle multer errors
        if (err.code === "LIMIT_FILE_SIZE") {
          // If the file size limit is exceeded
          const message = `File size should be less than ${
            MAX_SIZE / GIGABYTE
          }GB.`; // Formulate an error message
          return next(new FileSizeError(message)); // Pass error to the next middleware
        }
        return next(err); // Handle other multer errors
      } else if (err) {
        // If there is another error
        return next(err); // Handle error
      }

      const zipArch = req.file; // Get uploaded archive
      if (!zipArch) {
        // If archive is not uploaded
        return next(new InvalidFileTypeError("Upload an archive"));
      }

      const zipPath = zipArch.path; // Get path to the uploaded archive
      let extractedFilesFolder;
      try {
        extractedFilesFolder = extractFiles(zipPath, EXTRACT_PATH);
      } catch (extractionError) {
        return next(extractionError);
      }

      if (!extractedFilesFolder) {
        return next(new FileNotFoundError("Files not found"));
      }

      const html = findHtml(extractedFilesFolder);
      if (!html) {
        return next(
          new FileNotFoundError("Archive must contain the index.html file")
        );
      }

      let pdf;
      try {
        pdf = await convertHtmlToPdf(html);
      } catch (conversionError) {
        return next(conversionError);
      }

      if (!pdf) {
        return next(new ConversionError("Something went wrong..."));
      }

      const pdfName = path.parse(zipArch.originalname).name + ".pdf"; // Formulate the name of the PDF file
      fs.writeFileSync(`${EXTRACT_PATH}/${pdfName}`, pdf); // Write the PDF file to disk

      res.setHeader("Content-Type", "application/pdf"); // Set the Content-Type header
      res.setHeader("Content-Disposition", `attachment; filename=${pdfName}`); // Set the Content-Disposition header
      res.contentType("application/pdf"); // Set the content type
      res.status(OK).send(pdf); // Send the PDF file in response to the request

      const finalExecutionTime = countExecutionTime(convertStart);
      addLog(
        "handleConversion",
        "Conversion completed successfully",
        finalExecutionTime
      );
    } catch (error) {
      return next(error);
    }
  });
};