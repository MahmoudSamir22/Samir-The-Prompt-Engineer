import { Router } from "express";
import geminiController from "../controllers/gemini.controller";

const router = Router();

router.get("/generate-content", geminiController.generateContent);
router.get("/generate-zero-thinking", geminiController.generateZeroThinking);
router.get("/streaming-response", geminiController.streamingResponse);
router.get("/image-generate", geminiController.imageGenerate);
router.get("/imagen-3", geminiController.imagen3);
router.get("/video-generate", geminiController.videoGenerate);

export default router;
