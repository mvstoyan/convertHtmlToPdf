import fs from "fs";

const LOGFILE = "./logs.json"; // Путь к файлу журнала

function addLog(functionName, logText, executionTime = null) {
  // Определение функции addLog с параметрами functionName, logText и executionTime
  let logEntries = []; // Инициализация массива записей журнала

  if (fs.existsSync(LOGFILE)) {
    // Проверка существования файла журнала
    try {
      const content = fs.readFileSync(LOGFILE, "utf8"); // Чтение содержимого файла журнала
      logEntries = content ? JSON.parse(content) : []; // Попытка парсинга содержимого файла в виде JSON
    } catch (error) {
      console.error("Error writing log", error); // Вывод сообщения об ошибке в консоль при возникновении ошибки чтения файла
    }
  }

  const logData = {
    // Создание объекта с данными для записи в журнал
    functionName, // Имя функции
    timestamp: new Date().toISOString(), // Временная метка в формате ISO
    logText, // Текст журнала
    memory: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, // Используемая память в мегабайтах
    executionTime, // Время выполнения операции
  };

  logEntries.push(logData); // Добавление объекта с данными в массив записей журнала

  try {
    fs.writeFileSync(LOGFILE, JSON.stringify(logEntries, null, 2)); // Запись массива записей журнала в файл JSON
  } catch (error) {
    console.error("Error writing log", error); // Вывод сообщения об ошибке в консоль при возникновении ошибки записи файла
  }
}

export default addLog;
