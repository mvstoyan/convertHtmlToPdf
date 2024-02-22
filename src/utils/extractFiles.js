import AdmZip from "adm-zip";
import path from "path";
import createDirectory from "./createDirectory.js";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";

function extractFiles(zipPath, outputPath) {
  const start = Date.now();
  let message = "";
  if (!zipPath) {
    addLog("extractFiles", "Path not found");
    return;
  }
  const pathObj = path.parse(zipPath);
  if (!outputPath) {
    outputPath = pathObj.dir;
  }
  const outputFolder = `${outputPath}/${pathObj.name}`;

  try {
    const zip = new AdmZip(zipPath);
    createDirectory(outputFolder);
    zip.extractAllTo(outputFolder, true);
    message = "Files extracted successfully";
    return outputFolder;
  } catch (err) {
    message = `Error: ${err.message}`;
  } finally {
    const executionTime = countExecutionTime(start);
    addLog("extractFiles", message, executionTime);
  }
}

export default extractFiles;
