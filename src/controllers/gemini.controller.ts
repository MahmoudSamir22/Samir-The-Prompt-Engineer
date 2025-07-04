import { NextFunction, Request, Response } from "express";
import geminiService from "../services/gemini.service";
import response from "../utils/response";

class GeminiController {
  async generateContent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await geminiService.generateContent();
      response(res, 200, data);
    } catch (error) {
      next(error);
    }
  }

  async generateZeroThinking(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await geminiService.generateZeroThinking();
      response(res, 200, data);
    } catch (error) {
      next(error);
    }
  }

  async streamingResponse(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await geminiService.streamingResponse();
      response(res, 200, data);
    } catch (error) {
      next(error);
    }
  }

  async imageGenerate(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await geminiService.imageGenerate();
      response(res, 200, data);
    } catch (error) {
      next(error);
    }
  }

  async imagen3(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await geminiService.imagen3();
      response(res, 200, data);
    } catch (error) {
      next(error);
    }
  }

  async videoGenerate(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await geminiService.videoGenerate();
      response(res, 200, data);
    } catch (error) {
      next(error);
    }
  }

  async audioGenerate(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await geminiService.audioGenerate();
      response(res, 200, data);
    } catch (error) {
      next(error);
    }
  }
}

const geminiController = new GeminiController();
export default geminiController;
