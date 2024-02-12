import express from "express";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

const port = 5000;
app.get("/", (req, res) => {
  res.send('<h1>Project</h1><a href="/api-docs">API Docs</a>');
});

app.use(errorHandler);

export { app, port };
