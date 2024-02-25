import AdmZip from "adm-zip";
import path from "path";
import createDirectory from "./createDirectory.js";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";
import { FileNotFoundError } from "../errors/customErrors.js";

function extractFiles(zipPath, outputPath) {
  const start = Date.now();
  let message = "";

  if (!zipPath) {
    addLog("extractFiles", "Path not found"); // Log event that the path to the archive is not found
    return; // Return from the function if the path to the archive is not provided
  }

  const pathObj = path.parse(zipPath); // Parse the path to zip file
  if (!outputPath) {
    outputPath = pathObj.dir; // If no path is specified to extract files, use the directory of archive
  }
  const outputFolder = `${outputPath}/${pathObj.name}`; // Form output folder path for extracted files

  try {
    const zip = new AdmZip(zipPath); // Create a new AdmZip object to work with the archive
    createDirectory(outputFolder); // Create output directory
    zip.extractAllTo(outputFolder, true); // Extract all files from archive to the specified directory
    message = "Files extracted successfully";
    return outputFolder; // Return the path to the directory with extracted files
  } catch (err) {
    message = `Error: ${err.message}`;
    throw new FileNotFoundError(message);
  } finally {
    const executionTime = countExecutionTime(start);
    addLog("extractFiles", message, executionTime);
  }
}


export default extractFiles;
