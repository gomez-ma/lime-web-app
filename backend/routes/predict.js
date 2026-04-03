import express from "express";
import multer from "multer";
import { predictImage } from "../services/predictService.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  const result = await predictImage(req.file.path);
  res.json(result);
});

export default router;