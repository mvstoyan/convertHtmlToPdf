import express from "express";
import router from "./routes/convertRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import createDirectory from "./utils/createDirectory.js";
import createFile from "./utils/createFile.js";

/* 
when use this:
import swaggerFile from "./../swagger-output.json" assert { type: "json" };
get:
(node: 6456) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
*/

// solution
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const swaggerFile = require("./../swagger-output.json"); // use the require method

const app = express();

const port = 5000; // Порт, на котором будет работать сервер
const DESTINATION_PATH = "./uploads"; // Путь к директории для загрузки файлов
const EXTRACT_PATH = "./output"; // Путь к директории для извлечения файлов
const LOGFILE = "./logs.json"; // Путь к файлу журнала

// Настройка пути для доступа к документации Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Middleware для создания необходимых директорий и файла журнала перед обработкой запроса
app.use((req, res, next) => {
  createFile(LOGFILE); // Создание файла журнала
  createDirectory(DESTINATION_PATH); // Создание директории для загрузки файлов
  createDirectory(EXTRACT_PATH); // Создание директории для извлечения файлов
  next(); // Переход к следующему обработчику
});

app.use(express.json()); // Middleware для парсинга тела запроса в формате JSON
app.use(router /* #swagger.tags = ['Convert'] */); // Middleware для обработки маршрутов конвертации
app.use(errorHandler); // Middleware для обработки ошибок

export { app, port, DESTINATION_PATH, EXTRACT_PATH };
