import fs from "fs/promises";

const LOGFILE = "./logs.json";

/**
 * function adds a log entry to the specified log file.
 * 
 * @param {string} functionName - function name where log entry is added.
 * @param {string} logText - text content of the log entry.
 */

async function addLog(functionName, logText, executionTime = null) {
  let logEntries = [];

  try {
    if (await fs.access(LOGFILE, fs.constants.F_OK)) {
      const content = await fs.readFile(LOGFILE, "utf8");
      logEntries = content ? JSON.parse(content) : [];
    }
  } catch (error) {
    console.error("Error reading log file", error);
  }

  // or sync

  // function addLog(functionName, logText, executionTime = null) {
  //   let logEntries = [];

  //   if (fs.existsSync(LOGFILE)) {
  //     try {
  //       const content = fs.readFileSync(LOGFILE, "utf8");
  //       logEntries = content ? JSON.parse(content) : [];
  //     } catch (error) {
  //       console.error("Error writing log", error);
  //     }
  //   }

  const logData = {
    functionName,
    timestamp: new Date().toISOString(),
    logText,
    memory: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`,
    executionTime,
  };

  logEntries.push(logData);

  try {
    await fs.writeFile(LOGFILE, JSON.stringify(logEntries, null, 2));
  } catch (error) {
    console.error("Error writing log file", error);
  }
}

// or sync

//   try {
//     fs.writeFileSync(LOGFILE, JSON.stringify(logEntries, null, 2));
//   } catch (error) {
//     console.error("Error writing log", error);
//   }
// }

export default addLog;