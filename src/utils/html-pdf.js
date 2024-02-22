import puppeteer from "puppeteer";
import path from "path";
import url from "url";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";
import { ConversionError } from "../errors/customErrors.js"; // Importing custom error for conversion

const defaultOptions = {
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
};

async function htmlToPdf(html, options = defaultOptions) {
  const start = Date.now();
  let message = "";
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    const absolutePath = path.resolve(html).replace(/\\/g, "/");
    const pathToUrl = url.pathToFileURL(absolutePath).href;
    page.setJavaScriptEnabled(false);
    await page.goto(pathToUrl, {
      waitUntil: "networkidle0",
    });
    await page.emulateMediaType("screen");
    const pdfBuffer = await page.pdf(options);
    message = "Successful. Server returned the file after conversion";
    await page.close();
    return pdfBuffer;
  } catch (err) {
    message = `Conversion error: ${err.message}`;
    throw new ConversionError(message); // Throwing custom ConversionError
  } finally {
    const executionTime = countExecutionTime(start);
    addLog("htmlToPdf", message, executionTime);
  }
}

export default htmlToPdf;
