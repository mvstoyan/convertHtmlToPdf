import fs from "fs";

function createFile(path) {
  // Определение функции createFile с параметром path, представляющим путь к файлу
  if (fs.existsSync(path)) {
    // Проверка существования файла по указанному пути
    return; // Если файл уже существует, выход из функции
  }
  fs.writeFile(path, "", (err) => {
    // Создание файла по указанному пути
    if (err) {
      // Если произошла ошибка при создании файла
      throw err; // Генерация исключения
    }
  });
}

export default createFile;
