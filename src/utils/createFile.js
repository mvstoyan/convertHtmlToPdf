import { writeFile } from "fs/promises";

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