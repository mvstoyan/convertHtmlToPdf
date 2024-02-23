import { globSync } from "glob";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";
import { FileNotFoundError } from "../errors/customErrors.js";

const fileName = "index.html"; // Имя файла, который ищем в указанной директории

function findHtml(folder) {
  const start = Date.now(); // Запись времени начала выполнения функции
  let message = ""; // Переменная для сообщения о статусе операции

  const pathNormalize = (str) => str.replace(/\\/g, "/"); // Функция для нормализации пути (замена обратных слешей на прямые)

  let [html] = globSync(`${folder}/**/${fileName}`); // Поиск файла index.html в указанной директории
  try {
    html = pathNormalize(html); // Нормализация найденного пути
    message = "The index.html file is found"; // Сообщение об успешном нахождении файла
    return html; // Возвращаем путь к найденному файлу
  } catch (err) {
    message = `The index.html file is not found`; // Сообщение об ошибке при поиске файла
    throw new FileNotFoundError(message); // Выброс исключения FileNotFoundError
  } finally {
    const executionTime = countExecutionTime(start); // Подсчет времени выполнения операции
    addLog("findHtml", message, executionTime); // Журналирование события
  }
}


export default findHtml;
