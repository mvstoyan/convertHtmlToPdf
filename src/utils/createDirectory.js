import fs from "fs";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";

function createDirectory(path) {
  // Определение функции createDirectory с параметром path
  const start = Date.now(); // Запись времени начала выполнения функции
  if (fs.existsSync(path)) {
    // Проверка существования директории по указанному пути
    const createTime = countExecutionTime(start); // Подсчет времени выполнения
    addLog(
      // Добавление записи в журнал
      "createDirectory", // Имя функции для журнала
      `Folder already exists. Path: ${path}`, // Сообщение о существующей директории
      createTime // Время выполнения
    );
    return; // Возврат из функции, так как директория уже существует
  }
  let message = ""; // Инициализация сообщения
  fs.mkdir(path, { recursive: true }, (err) => {
    // Создание директории с указанным путем
    message = err ? `Error: ${err.message}` : `Folder created. Path: ${path}`; // Формирование сообщения об успешном создании или об ошибке
    const createTime = countExecutionTime(start); // Подсчет времени выполнения
    addLog("createDirectory", message, createTime); // Добавление записи в журнал
    if (err) {
      // Если произошла ошибка при создании директории
      throw err; // Генерация исключения
    }
  });
}


export default createDirectory;
