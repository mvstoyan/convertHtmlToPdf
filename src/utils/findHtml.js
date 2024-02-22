import { globSync } from "glob";
import addLog from "./addLog.js";
import countExecutionTime from "./countExecutionTime.js";

const fileName = "index.html";

function findHtml(folder) {
  const start = Date.now();
  let message = "";

  const pathNormalize = (str) => str.replace(/\\/g, "/");

  let [html] = globSync(`${folder}/**/${fileName}`);
  try {
    html = pathNormalize(html);
    message = "The index.html file is found";
    return html;
  } catch (err) {
    message = `The index.html file is not found`;
  } finally {
    const executionTime = countExecutionTime(start);
    addLog("findHtml", message, executionTime);
  }
}

export default findHtml;
