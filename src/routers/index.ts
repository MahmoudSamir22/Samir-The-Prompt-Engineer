import { Router } from "express";
import geminiRouter from "./gemini.route";

const router = Router();

router.use("/gemini", geminiRouter);

export default router;