import express from "express";
import { handleConversion } from "../controllers/convertController.js";

const router = express.Router();

router.post("/html-pdf", handleConversion);

export default router;
