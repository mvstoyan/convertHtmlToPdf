import { CustomError } from "../errors/customErrors.js";
import {
  FileSizeError,
  InvalidFileTypeError,
  FileNotFoundError,
  ConversionError,
} from "../errors/customErrors.js";
import HttpStatus from "http-status-codes";

// Middleware function for error handling
const errorHandler = (err, req, res, next) => {
  // Check if the error is a custom error type
  if (
    err instanceof CustomError ||
    err instanceof FileSizeError ||
    err instanceof InvalidFileTypeError ||
    err instanceof FileNotFoundError ||
    err instanceof ConversionError
  ) {
    // If it's a known error type, return the corresponding status and message
    return res
      .status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }

  // If the error is not a known type, log it and return a generic server error
  console.error("Unhandled error:", err);
  return res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal Server Error" });
};

export { errorHandler };
