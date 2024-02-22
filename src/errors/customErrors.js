class CustomError {
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

// The size of the uploaded file exceeds the set limit
class FileSizeError extends CustomError {
  constructor(message = "File size exceeds the limit", statusCode = 400) {
    super(message, statusCode);
  }
}

// The uploaded file has an invalid format
class InvalidFileTypeError extends CustomError {
  constructor(message = "Invalid file type", statusCode = 400) {
    super(message, statusCode);
  }
}

// The requested file was not found
class FileNotFoundError extends CustomError {
  constructor(message = "File not found", statusCode = 404) {
    super(message, statusCode);
  }
}

// An error occurred during the process of converting the file to PDF
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
