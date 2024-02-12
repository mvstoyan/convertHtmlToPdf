import { StatusCodes } from "http-status-codes";

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: "Something went wrong!" });
};

export default errorHandler;
