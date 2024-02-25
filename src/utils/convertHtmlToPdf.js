import puppeteer from "puppeteer";
import path from "path";
import url from "url";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";
import { ConversionError } from "../errors/customErrors.js"; 

// Object with default settings for creating PDF
const defaultOptions = {
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
};

async function convertHtmlToPdf(html, options = defaultOptions) {
  const start = Date.now(); // Record the start time of the function execution
  let message = ""; // Variable to store the status message of the operation

  try {
    // Attempt to convert HTML to PDF
    const browser = await puppeteer.launch({ headless: "new" }); // Launch the browser in "headless" mode
    const page = await browser.newPage(); // Create a new page in the browser

    // Convert the relative path of the HTML file to an absolute path and get the URL
    const absolutePath = path.resolve(html).replace(/\\/g, "/");
    const pathToUrl = url.pathToFileURL(absolutePath).href;

    page.setJavaScriptEnabled(false); // Disable JavaScript execution on the page
    await page.goto(pathToUrl, { waitUntil: "networkidle0" }); // Wait for the page to finish loading

    await page.emulateMediaType("screen"); // Emulate "screen" media type
    const pdfBuffer = await page.pdf(options); // Create a PDF file from the page

    message = "Successful. Server returned the file after conversion";
    await page.close();
    return pdfBuffer;
  } catch (err) {
    message = `Conversion error: ${err.message}`;
    throw new ConversionError(message);
  } finally {
    // End of the operation: calculate execution time and log
    const executionTime = countExecutionTime(start);
    addLog("convertHtmlToPdf", message, executionTime);
  }
}
export default convertHtmlToPdf;