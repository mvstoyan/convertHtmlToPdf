import { globSync } from "glob";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";
import { FileNotFoundError } from "../errors/customErrors.js";

const fileName = "index.html";

function findHtml(folder) {
  const start = Date.now();
  let message = "";

  const pathNormalize = (str) => str.replace(/\\/g, "/"); // Normalize the path

  let [html] = globSync(`${folder}/**/${fileName}`); // Search for index.html in the specified directory
  try {
    html = pathNormalize(html); // Normalize the found path
    message = "The index.html file is found";
    return html; // Return the path to the found file
  } catch (err) {
    message = `The index.html file is not found`;
    throw new FileNotFoundError(message);
  } finally {
    const executionTime = countExecutionTime(start);
    addLog("findHtml", message, executionTime);
  }
}

export default findHtml;
