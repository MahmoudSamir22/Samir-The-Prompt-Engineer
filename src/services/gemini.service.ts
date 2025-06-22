import geminiAi from "../utils/GeminiAI";
import { Modality } from "@google/genai";
import fs, { createWriteStream } from "fs";
import { Readable } from "stream";
import fetch from "node-fetch";

class GeminiService {
  async generateContent() {
    const response = await geminiAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Explain how AI works in a few words",
    });
    return response;
  }

  async generateZeroThinking() {
    const response = await geminiAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Explain how AI works in a few words",
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      },
    });
    return response;
  }

  async streamingResponse() {
    const response = await geminiAi.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: "Explain how AI works",
    });

    for await (const chunk of response) {
      console.log(chunk.text);
    }
    return response;
  }

  async imageGenerate() {
    const contents =
      "Hi, can you create a 3d rendered image of a cat " +
      "with wings and a top hat flying over a happy " +
      "futuristic scifi city with lots of greenery?";
    // Set responseModalities to include "Image" so the model can generate  an image
    const response = await geminiAi.models.generateContent({
      model: "imagen-3.0-generate-002",
      contents: contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    if (
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts
    ) {
      for (const part of response.candidates[0].content.parts) {
        // Based on the part type, either show the text or save the image
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          if (typeof imageData === "string") {
            const buffer = Buffer.from(imageData, "base64");
            fs.writeFileSync("gemini-native-image.png", buffer);
            console.log("Image saved as gemini-native-image.png");
          } else {
            console.error("Image data is undefined or not a string.");
          }
        }
      }
    } else {
      console.error(
        "Response does not contain expected candidates or content parts."
      );
    }
  }

  async imagen3() {
    const response = await geminiAi.models.generateImages({
      model: "imagen-3.0-generate-002",
      prompt: "Robot holding a red skateboard",
      config: {
        numberOfImages: 4,
      },
    });

    let idx = 1;
    if (response.generatedImages && Array.isArray(response.generatedImages)) {
      for (const generatedImage of response.generatedImages) {
        if (generatedImage.image && generatedImage.image.imageBytes) {
          let imgBytes = generatedImage.image.imageBytes;
          const buffer = Buffer.from(imgBytes, "base64");
          fs.writeFileSync(`imagen-${idx}.png`, buffer);
          idx++;
        } else {
          console.error("generatedImage.image or imageBytes is undefined.");
        }
      }
    } else {
      console.error("No generated images found in the response.");
    }
  }

  async videoGenerate() {
    let operation = await geminiAi.models.generateVideos({
      model: "veo-2.0-generate-001",
      prompt: "Panning wide shot of a calico kitten sleeping in the sunshine",
      config: {
        personGeneration: "dont_allow",
        aspectRatio: "16:9",
      },
    });

    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await geminiAi.operations.getVideosOperation({
        operation: operation,
      });
    }

    if (!operation.response?.generatedVideos) return;

    for (const [
      n,
      generatedVideo,
    ] of operation.response.generatedVideos.entries()) {
      const resp = await fetch(
        `${generatedVideo.video?.uri}&key=GOOGLE_API_KEY`
      );

      if (resp.body) {
        const writer = createWriteStream(`video${n}.mp4`);

        // Convert Web ReadableStream to Node.js stream and pipe
        const nodeStream = Readable.fromWeb(resp.body as any); // cast if needed
        nodeStream.pipe(writer);
      }
    }
  }
}

const geminiService = new GeminiService();
export default geminiService;
