import puppeteer from "puppeteer";
import path from "path";
import url from "url";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";
import { ConversionError } from "../errors/customErrors.js"; // Importing custom error for conversion

// Обьект - который содержит настройки по умолчанию для создания PDF
const defaultOptions = {
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
};

// Функция принимает HTML-код в качестве входных данных и дополнительные параметры, 
// такие как опции для создания PDF. Также выполняет конвертацию HTML в PDF.
async function htmlToPdf(html, options = defaultOptions) {
  const start = Date.now(); // время начала выполнения функции
  let message = ""; // Переменная message - тут будет храниться сообщение о статусе операции.

  try {
    // Попытка выполнить конвертацию HTML в PDF
    const browser = await puppeteer.launch({ headless: "new" }); // Запуск браузера в режиме "без графического интерфейса"
    const page = await browser.newPage(); // Создание новой страницы в браузере

    // Преобразование относительного пути HTML-файла в абсолютный и получение URL
    const absolutePath = path.resolve(html).replace(/\\/g, "/");
    const pathToUrl = url.pathToFileURL(absolutePath).href;

    // Настройка страницы и переход к URL
    page.setJavaScriptEnabled(false); // Отключение выполнения JavaScript на странице
    await page.goto(pathToUrl, { waitUntil: "networkidle0" }); // Ожидание завершения загрузки страницы

    // Установка параметров и создание PDF
    await page.emulateMediaType("screen"); // Эмуляция медиа-типа "экран"
    const pdfBuffer = await page.pdf(options); // Создание PDF-файла из страницы

    // Успешное завершение операции
    message = "Successful. Server returned the file after conversion"; 
    await page.close(); // Закрытие страницы
    return pdfBuffer; // Возврат буфера PDF
  } catch (err) {
    // Обработка ошибки при конвертации
    message = `Conversion error: ${err.message}`; // Формирование сообщения об ошибке
    throw new ConversionError(message); // Выброс исключения ConversionError
  } finally {
    // Завершение операции: подсчет времени выполнения и журналирование
    const executionTime = countExecutionTime(start); // Подсчет времени выполнения
    addLog("htmlToPdf", message, executionTime); // Журналирование события
  }
}
export default htmlToPdf;