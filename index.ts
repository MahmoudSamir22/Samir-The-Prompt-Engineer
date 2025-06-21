import express from "express";
import { config } from "dotenv";
import cors from "cors";

config();


const app = express();
const PORT = process.env.PORT || 3000;

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
  return response;
}

app.get("/", async (req, res) => {
  try {
    const response = await main();
    res.json(response);
  } catch (error) {
    console.error("Error generating content:", error);
  }
});


app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
