import { globSync } from "glob";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";
import { FileNotFoundError } from "../errors/customErrors.js";

const fileName = "index.html";

/**
 * This function searches for the "index.html" file within a specified folder.
 * 
 * @param {string} folder - The path to the folder where index.html file is expected.
 * @returns {string} - The path to the found index.html file.
 * @throws {FileNotFoundError} - Throws an error if index.html file is not found in specified folder.
 */

function findHtml(folder) {
  const start = Date.now();
  let message = "";

  const pathNormalize = (str) => str.replace(/\\/g, "/"); // Normalize the path

  let [html] = globSync(`${folder}/**/${fileName}`); // Search for index.html in specified directory
  try {
    html = pathNormalize(html); // Normalize the found path
    message = "The index.html file is found";
    return html;
  } catch (err) {
    message = `The index.html file is not found`;
    throw new FileNotFoundError(message);
  } finally {
    const executionTime = countExecutionTime(start);
    addLog("findHtml", message, executionTime);
  }
}

export default findHtml;
