import express from "express";
import multer from "multer"; // Для обработки загрузки файлов
import extract from "extract-zip"; // Для извлечения содержимого zip-файла
import puppeteer from "puppeteer"; // Для конвертации HTML в PDF



const app = express();

// /* 
// when use this:
// import swaggerFile from "./../swagger-output.json" assert { type: "json" };
// get:
// (node: 6456) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
// */

// // solution
// import { createRequire } from "module"; // Bring in the ability to create the 'require' method
// const require = createRequire(import.meta.url); // construct the require method
// const swaggerFile = require("./../swagger-output.json"); // use the require method


const port = 5000;

app.get("/", (req, res) => {
  /* #swagger.ignore = true */
  res.send('<h1>Project</h1><a href="/api-docs">API Docs</a>');
});

// Настройка multer для загрузки файлов
const upload = multer({ dest: 'uploads/' });

// Эндпоинт для загрузки zip-файла
app.post('/upload', upload.single('file'), (req, res) => {
  // Обработка загруженного файла
});

// Эндпоинт для конвертации HTML в PDF
app.post('/convert', async (req, res) => {
  const htmlFileName = req.body.htmlFileName;
  const resources = req.body.resources;

  // Логика конвертации HTML в PDF с использованием puppeteer
});

export { app, port };