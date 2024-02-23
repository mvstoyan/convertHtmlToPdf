import AdmZip from "adm-zip";
import path from "path";
import createDirectory from "./createDirectory.js";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";
import { FileNotFoundError } from "../errors/customErrors.js";

function extractFiles(zipPath, outputPath) {
  const start = Date.now(); // Запись времени начала выполнения функции
  let message = ""; // Переменная для сообщения о статусе операции

  if (!zipPath) {
    addLog("extractFiles", "Path not found"); // Журналирование события о том, что путь к архиву не найден
    return; // Возврат из функции, если путь к архиву не указан
  }

  const pathObj = path.parse(zipPath); // Разбор пути к архиву
  if (!outputPath) {
    outputPath = pathObj.dir; // Если не указан путь для извлечения файлов, используем директорию архива
  }
  const outputFolder = `${outputPath}/${pathObj.name}`; // Формирование пути к выходной директории для извлеченных файлов

  try {
    const zip = new AdmZip(zipPath); // Создание нового объекта AdmZip для работы с архивом
    createDirectory(outputFolder); // Создание выходной директории
    zip.extractAllTo(outputFolder, true); // Извлечение всех файлов из архива в указанную директорию
    message = "Files extracted successfully"; // Сообщение об успешном извлечении файлов
    return outputFolder; // Возвращаем путь к директории с извлеченными файлами
  } catch (err) {
    message = `Error: ${err.message}`; // Сообщение об ошибке при извлечении файлов
    throw new FileNotFoundError(message); // Выброс исключения FileNotFoundError
  } finally {
    const executionTime = countExecutionTime(start); // Подсчет времени выполнения операции
    addLog("extractFiles", message, executionTime); // Журналирование события
  }
}


export default extractFiles;
