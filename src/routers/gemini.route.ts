import { Router } from "express";
import geminiController from "../controllers/gemini.controller";

const router = Router();

router.get("/generate-content", geminiController.generateContent);
router.get("/generate-zero-thinking", geminiController.generateZeroThinking);
router.get("/streaming-response", geminiController.streamingResponse);

export default router;
