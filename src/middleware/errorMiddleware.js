import { CustomError } from "../errors/customErrors.js";

const errorHandler = (err, req, res, next) => {
  if (
    err instanceof CustomError ||
    err instanceof FileSizeError ||
    err instanceof InvalidFileTypeError ||
    err instanceof FileNotFoundError ||
    err instanceof ConversionError
  ) {
    // Если пользовательская ошибка, отправляем статус и сообщение об ошибке
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Если не пользовательская ошибка, отправляем общий статус 500 и сообщение об ошибке
  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "Internal Server Error" });
};

export { errorHandler };
