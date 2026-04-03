import express from "express";
import { train, stop, status } from "../controllers/trainController.js";

const router = express.Router();

router.post("/start", train);
router.post("/stop", stop);
router.get("/status", status);

export default router;