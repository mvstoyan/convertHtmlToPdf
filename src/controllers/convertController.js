import multer from "multer";
import path from "path";
import fs from "fs";
import extractFiles from "../utils/extractFiles.js";
import htmlToPdf from "../utils/html-pdf.js";
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


const GIGABYTE = Math.pow(1024, 3);
const MAX_SIZE = 2 * GIGABYTE;
const FILE_TYPE = "zip";

export const handleConversion = async (req, res, next) => {
  /* 
        #swagger.tags = ['Convert']
        #swagger.description = 'Convert HTML to PDF' 
    */

  /*    
        #swagger.parameters['singleFile'] = {
            in: 'formData',
            type: 'file',
            name: 'file',
            description: 'zip archive containing index.html'
        } 
    */

  /*
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
    storage: multer.diskStorage({
      destination: DESTINATION_PATH,
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    }),
    limits: {
      fileSize: MAX_SIZE,
    },
    fileFilter(req, file, cb) {
      const extension = path.extname(file.originalname) === `.${FILE_TYPE}`;
      if (extension) {
        return cb(null, true);
      } else {
        const message = `Upload a file with the .${FILE_TYPE} extension`;
        return cb(new InvalidFileTypeError(message), false);
      }
    },
  }).single("file");

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        const message = `File size should be less than ${
          MAX_SIZE / GIGABYTE
        }GB.`;
        return next(new FileSizeError(message));
      }
      return next(err);
    } else if (err) {
      return next(err);
    }

    const zipArch = req.file;
    if (!zipArch) {
      return next(new InvalidFileTypeError("Upload an archive"));
    }

    const zipPath = zipArch.path;
    const extractedFilesFolder = extractFiles(zipPath, EXTRACT_PATH);
    if (!extractedFilesFolder) {
      return next(new FileNotFoundError("Files not found"));
    }

    const html = findHtml(extractedFilesFolder);
    if (!html) {
      return next(
        new FileNotFoundError("Archive must contain the index.html file")
      );
    }

    const pdf = await htmlToPdf(html);
    if (!pdf) {
      return next(new ConversionError("Something went wrong..."));
    }

    const pdfName = path.parse(zipArch.originalname).name + ".pdf";
    fs.writeFileSync(`${EXTRACT_PATH}/${pdfName}`, pdf);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${pdfName}`);
    res.contentType("application/pdf");
    res.status(OK).send(pdf);

    const finalExecutionTime = countExecutionTime(convertStart);
    addLog(
      "handleConversion",
      "Conversion completed successfully",
      finalExecutionTime
    );
  });
};
