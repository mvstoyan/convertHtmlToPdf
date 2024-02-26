import { writeFile } from "fs/promises";

/**
 * Function creates a new file at specified path.
 * 
 * @param {string} path - path where the new file will be created.
 * @throws {Error} - Throws an error if there problem creating file.
 */

const createFile = async (path) => {
  try {
    await writeFile(path, "");
    console.log(`File created at ${path}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default createFile;