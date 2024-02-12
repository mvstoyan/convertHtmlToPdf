import express from "express";
import { convertToPDF } from "../controllers/convertController.js";

const router = express.Router();

router.post("/html-pdf", convertToPDF);

export default router;
