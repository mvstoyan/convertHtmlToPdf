class CustomError {
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

// размер загружаемого файла превышает установленный лимит
class FileSizeError extends CustomError {
  constructor(message = "File size exceeds the limit", statusCode = 400) {
    super(message, statusCode);
  }
}

// загруженный файл имеет недопустимый формат
class InvalidFileTypeError extends CustomError {
  constructor(message = "Invalid file type", statusCode = 400) {
    super(message, statusCode);
  }
}

// запрашиваемый файл не найден
class FileNotFoundError extends CustomError {
  constructor(message = "File not found", statusCode = 404) {
    super(message, statusCode);
  }
}

// произошла ошибка в процессе конвертации файла в PDF
class ConversionError extends CustomError {
  constructor(message = "Error occurred during conversion", statusCode = 500) {
    super(message, statusCode);
  }
}

export {
  CustomError,
  FileSizeError,
  InvalidFileTypeError,
  FileNotFoundError,
  ConversionError,
};




// произошла ошибка в процессе конвертации файла в PDF
