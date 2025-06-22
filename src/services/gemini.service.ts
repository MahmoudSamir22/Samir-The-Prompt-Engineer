import geminiAi from "../utils/GeminiAI";

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
}

const geminiService = new GeminiService();
export default geminiService;
