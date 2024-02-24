import { mkdir } from "fs/promises";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";

async function createDirectory(path) {
  const start = Date.now(); // время начала выполнения

  try {
    await mkdir(path, { recursive: true }); // Асин создание директории с указанным путем
    const createTime = countExecutionTime(start); // время выполнения
    addLog("createDirectory", `Folder created. Path: ${path}`, createTime); // добавим запись в журнал - ок
    console.log(`Directory created at ${path}`); // директория создана- ок
  } catch (err) {
    const createTime = countExecutionTime(start); // время выполнения
    addLog("createDirectory", `Error: ${err.message}`, createTime); // добавим запись в журнал - ошибка
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

