import { mkdir } from "fs/promises";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";

async function createDirectory(path) {
  const start = Date.now();

  try {
    await mkdir(path, { recursive: true }); // Create directory with the specified path
    const createTime = countExecutionTime(start);
    addLog("createDirectory", `Folder created. Path: ${path}`, createTime); // Add log entry
    console.log(`Directory created at ${path}`); // Directory created
  } catch (err) {
    const createTime = countExecutionTime(start);
    addLog("createDirectory", `Error: ${err.message}`, createTime); // Add log entry for error
    console.error(`Error creating directory at ${path}: ${err.message}`);
    throw err;
  }
}

export default createDirectory;

// or sync 

// function createDirectory(path) {
//   const start = Date.now();
//   if (fs.existsSync(path)) {
//     const createTime = countExecutionTime(start);
//     addLog(
//       "createDirectory",
//       `Folder already exists. Path: ${path}`,
//       createTime
//     );
//     return;
//   }
//   let message = "";
//   fs.mkdir(path, { recursive: true }, (err) => {
//     message = err ? `Error: ${err.message}` : `Folder created. Path: ${path}`;
//     const createTime = countExecutionTime(start);
//     addLog("createDirectory", message, createTime);
//     if (err) {
//       throw err;
//     }
//   });
// }

