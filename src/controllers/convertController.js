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


const GIGABYTE = Math.pow(1024, 3); // Определение константы для размера гигабайта в байтах
const MAX_SIZE = 2 * GIGABYTE; // Определение максимального размера файла в байтах
const FILE_TYPE = "zip"; // Определение типа файла, ожидаемого в загрузке

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

  const convertStart = Date.now(); // Запись времени начала выполнения операции конвертации
  const upload = multer({
    // Настройка multer для загрузки файлов
    storage: multer.diskStorage({
      destination: DESTINATION_PATH, // Указание директории назначения для сохранения файла
      filename: function (req, file, cb) {
        // Функция для генерации имени файла
        cb(null, file.originalname); // Используется оригинальное имя файла
      },
    }),
    limits: {
      fileSize: MAX_SIZE, // Ограничение размера файла
    },
    fileFilter(req, file, cb) {
      // Функция фильтрации загружаемых файлов
      const extension = path.extname(file.originalname) === `.${FILE_TYPE}`; // Проверка расширения файла
      if (extension) {
        // Если расширение соответствует ожидаемому типу
        return cb(null, true); // Пропуск файла
      } else {
        // Если расширение не соответствует ожидаемому типу
        const message = `Upload a file with the .${FILE_TYPE} extension`; // Формирование сообщения об ошибке
        return cb(new InvalidFileTypeError(message), false); // Отклонение файла и генерация ошибки
      }
    },
  }).single("file"); // Загрузка только одного файла

  upload(req, res, async function (err) {
    // Запуск middleware для обработки загруженного файла
    if (err instanceof multer.MulterError) {
      // Обработка ошибок multer
      if (err.code === "LIMIT_FILE_SIZE") {
        // Если превышен лимит размера файла
        const message = `File size should be less than ${
          MAX_SIZE / GIGABYTE
        }GB.`; // Формирование сообщения об ошибке
        return next(new FileSizeError(message)); // Передача ошибки дальше по middleware
      }
      return next(err); // Обработка остальных ошибок multer
    } else if (err) {
      // Если возникла другая ошибка
      return next(err); // Обработка ошибки
    }

    const zipArch = req.file; // Получение загруженного архива
    if (!zipArch) {
      // Если архив не загружен
      return next(new InvalidFileTypeError("Upload an archive")); // Генерация ошибки
    }

    const zipPath = zipArch.path; // Получение пути к загруженному архиву
    const extractedFilesFolder = extractFiles(zipPath, EXTRACT_PATH); // Извлечение файлов из архива
    if (!extractedFilesFolder) {
      // Если файлы не были извлечены
      return next(new FileNotFoundError("Files not found")); // Генерация ошибки
    }

    const html = findHtml(extractedFilesFolder); // Поиск HTML-файла в извлеченных файлах
    if (!html) {
      // Если HTML-файл не найден
      return next(
        new FileNotFoundError("Archive must contain the index.html file")
      ); // Генерация ошибки
    }

    const pdf = await htmlToPdf(html); // Конвертация HTML в PDF
    if (!pdf) {
      // Если PDF не был создан
      return next(new ConversionError("Something went wrong...")); // Генерация ошибки
    }

    const pdfName = path.parse(zipArch.originalname).name + ".pdf"; // Формирование имени PDF-файла
    fs.writeFileSync(`${EXTRACT_PATH}/${pdfName}`, pdf); // Запись PDF-файла на диск

    res.setHeader("Content-Type", "application/pdf"); // Установка заголовка Content-Type
    res.setHeader("Content-Disposition", `attachment; filename=${pdfName}`); // Установка заголовка Content-Disposition
    res.contentType("application/pdf"); // Установка типа контента
    res.status(OK).send(pdf); // Отправка PDF-файла в ответ на запрос

    const finalExecutionTime = countExecutionTime(convertStart); // Подсчет времени выполнения операции
    addLog(
      "handleConversion",
      "Conversion completed successfully",
      finalExecutionTime
    ); // Журналирование успешного завершения операции
  });
};