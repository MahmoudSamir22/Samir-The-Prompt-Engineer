# Samir-The-Prompt-Engineer
Gemini/OpenAI Integration Playground

# Gemini API

## What is Gemini

Gemini is an AI models developed by google designed to understand and generate text, code, images, audio, and video

## What Is Tokens ?

Like the Currency for Gemini to calculate your bill

You're charged for:

- **Input tokens** (your prompt)
- **Output tokens** (the model's response)

## Requirements

- [API Key](https://aistudio.google.com/app/apikey)

## How To Install

You can install the **Google GenAI SDK** using this command
`npm install @google/genai` 

## How to use

Google has provided  SDK to use Gemini 

### SDK

Import `GoogleGenAI`  then we create an Instance with the Api Key we got before
`const ai = new GoogleGenAI({ apiKey: "**YOUR_API_KEY**" });` 

You can use `ai.models` and use different models

**Request Example**

```tsx
const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
```

**Response Example**

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "AI learns patterns from data to make predictions or decisions."
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ],
  "modelVersion": "gemini-2.5-flash",
  "usageMetadata": {
    "promptTokenCount": 9,
    "candidatesTokenCount": 11,
    "totalTokenCount": 1129,
    "promptTokensDetails": [
      {
        "modality": "TEXT",
        "tokenCount": 9
      }
    ],
    "thoughtsTokenCount": 1109
  }
}
```

By default [Gemini 2.5 Flash](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-flash)  has thinking featured enabled
this affect the response time - quality - token usage

to close it we set the `thinkingBudget` to 0

```jsx
const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
```

**NOTE:** Thinking is only available on Gemini 2.5 series models and can't be disabled on Gemini 2.5 Pro.

## What is Gemini Thinking ?

Improves the way that Gemini process and reasoning the tasks which is effective for complex tasks like (coding, advanced mathematics, and data analysis)
but take longer to run and cost more tokens
- 2.5 Pro ⇒ Activated By Default And can’t be disabled

-2.5 Flash ⇒ Activated By Default And can be disabled if `thinkingBudget` is set to 0

both use Dynamic thinking which decides when and how much to think

to turn on dynamic thinking `thinkingBudget = -1`

and alot more here [thinking guide](https://ai.google.dev/gemini-api/docs/thinking#set-budget).

## What Can Gemini Does ?

### **Text generation**

This can be done through diff things ( text, images, video, and audio )

You can change the behavior of the Gemini model by pass a value to 

`systemInstruction` in `config` 

```tsx
const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Hello there",
    config: {
      systemInstruction: "You are a cat. Your name is Neko.",
    },
  });
```

### Multimodal inputs

Gemini supports multimodal inputs like u can send a text and image in one message and Gemini will start to process 

```tsx
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

async function main() {
  const image = await ai.files.upload({
    file: "/path/to/organ.png",
  });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      createUserContent([
        "Tell me about this instrument",
        createPartFromUri(image.uri, image.mimeType),
      ]),
    ],
  });
  console.log(response.text);
}

await main();
```

more on images and advanced image processing  [image understanding guide](https://ai.google.dev/gemini-api/docs/image-understanding).

### **Streaming responses**

You can stream the response instead of sending one big message all at once

```tsx
const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works",
  });

  for await (const chunk of response) {
    console.log(chunk.text);
  }
```

We can use a socket connection and emit the chunks instead of doing the `console.log`  if we wanna do an interactive chat

### **Multi-turn conversations**

A way to keep history of old prompts and responses so Gemini knows what r u talking about in future 

```tsx
async function main() {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

  const response1 = await chat.sendMessage({
    message: "I have 2 dogs in my house.",
  });
  console.log("Chat response 1:", response1.text);

  const response2 = await chat.sendMessage({
    message: "How many paws are in my house?",
  });
  console.log("Chat response 2:", response2.text);
}
```

and u still can use the streaming in this chat as well 

```tsx
async function main() {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

  const stream1 = await chat.sendMessageStream({
    message: "I have 2 dogs in my house.",
  });
  for await (const chunk of stream1) {
    console.log(chunk.text);
    console.log("_".repeat(80));
  }

  const stream2 = await chat.sendMessageStream({
    message: "How many paws are in my house?",
  });
  for await (const chunk of stream2) {
    console.log(chunk.text);
    console.log("_".repeat(80));
  }
}
```

for basic text generation we use something called **zero-shot**  prompt which is the basic request

for a better generation we use the `System Instructions` to guide the model and provide some inputs and outputs to guide the model and this called **few-shots** prompting

### **Image generation**

You can generate images using the built in **Gemini API** or **Image** Which is a google specialized image generation model that’s used when the image quality is critical in that use

**Supported Models**

- For **Gemini**, Gemini 2.0 Flash
- For **Imagen**, Imagen 3

**Note:** Image generation may not be available in all regions and countries

Same as Text generation you can generate Images using more than one method 
You can prompt Gemini with text, images, or a combination of both but unlike the text generation it doesn't support audio and video inputs

You must include **`responseModalities**: **["TEXT", "IMAGE"]**` in your configuration. Image-only output is not supported with these models

here is excremental code for generating images which i’m not sure about yet because i’m using free API Key 

```tsx
async function main() {

  const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

  const contents =
    "Hi, can you create a 3d rendered image of a pig " +
    "with wings and a top hat flying over a happy " +
    "futuristic scifi city with lots of greenery?";

  // Set responseModalities to include "Image" so the model can generate  an image
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: contents,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });
  for (const part of response.candidates[0].content.parts) {
    // Based on the part type, either show the text or save the image
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
      console.log("Image saved as gemini-native-image.png");
    }
  }
}
```

You can also make Image editing u need to provide image and text on what u want to do to that image 

### Image Generating modes

**Text to image(s) :** Which outputs images depends on text input

**Image(s) and text to image(s):** Which outputs images depends on text and image input
**Multi-turn image editing:** Which outputs image depends on old images and old prompts in the same chat

### Image Generation Limitations

- For best performance, use the following languages: EN, es-MX, ja-JP, zh-CN, hi-IN.
- There are some regions/countries where Image generation is not available.
- Image generation does not support audio or video inputs.

### Generate With Imagen 3

Imagen 3 is one of the models that Gemini use to generate images

**NOTE:** Imagen supports English only prompts at this time and it’s Paid Service

**Imagen Model Parameters**

**`numberOfImages`:** The number of images to generate, from 1 to 4 (inclusive). The default is 4.

**`aspectRatio` :** Changes the aspect ratio of the generated image. Supported values are **`"1:1"`**, **`"3:4"`**, **`"4:3"`**, **`"9:16"`**, and **`"16:9"`**. The default is **`"1:1"`** 

**`personGeneration` :**Allow the model to generate images of people. The following values are supported

- **`dont_allow` : Block generation of images of people.**
- **`allow_adult` : Generate images of adults, but not children. This is the default.**
- **`allow_all` :  Generate images that include adults and children.**

**Note:** The `"allow_all"` parameter value is not allowed in EU, UK, CH, MENA locations.

### When to use Gemini and When to use Imagen ?

**Gemini:** 

- You need contextually relevant images that leverage world knowledge and reasoning.
- Seamlessly blending text and images is important.
- You want accurate visuals embedded within long text sequences.
- You want to edit images conversationally while maintaining context.

**Imagen 3:**

- Image quality, photorealism, artistic detail, or specific styles (e.g., impressionism, anime) are top priorities.
- Performing specialized editing tasks like product background updates or image upscaling.
- Infusing branding, style, or generating logos and product designs.

## Video Generation

In this case we will be using `Veo 2` model which is google most capable video generation model to date

**Note:** Veo is a paid service which cost `$0.35` per second in video

```tsx
import { GoogleGenAI } from "@google/genai";
import { createWriteStream } from "fs";
import { Readable } from "stream";

const ai = new GoogleGenAI({ apiKey: "GOOGLE_API_KEY" });

async function main() {
  let operation = await ai.models.generateVideos({
    model: "veo-2.0-generate-001",
    prompt: "Panning wide shot of a calico kitten sleeping in the sunshine",
    config: {
      personGeneration: "dont_allow",
      aspectRatio: "16:9",
    },
  });

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({
      operation: operation,
    });
  }

  operation.response?.generatedVideos?.forEach(async (generatedVideo, n) => {
    const resp = await fetch(`${generatedVideo.video?.uri}&key=GOOGLE_API_KEY`); // append your API key
    const writer = createWriteStream(`video${n}.mp4`);
    Readable.fromWeb(resp.body).pipe(writer);
  });
}
```

**Note:** Video Generation takes several minutes to be done depends on the size and details of the video

**Note:** Videos are stored on the server for 2 days and will be removed after if you want to save a copy you must run **`result()`** and **`save()`** within 2 days of generation.

You can also generate from images

**Veo model parameters**

**`prompt`**: The text prompt for the video. When present, the **`image`** parameter is optional.

**`image`**: The image to use as the first frame for the video. When present, the **`prompt`** parameter is optional.

**`negativePrompt`**: Text string that describes anything you want to *discourage* the model from generating

**`aspectRatio`**: Changes the aspect ratio of the generated video. Supported values are **`"16:9"`** and **`"9:16"`**. The default is **`"16:9"`**.

**`personGeneration`**: Allow the model to generate videos of people. The following values are supported:

- **`"dont_allow"`**: Don't allow the inclusion of people or faces.
- **`"allow_adult"`**: Generate videos that include adults, but not children.
- **`"allow_all"`**: Generate videos that include adults and children

**`numberOfVideos`**: Output videos requested, either **`1`** or **`2`**.

**`durationSeconds`**: Length of each output video in seconds, between **`5`** and **`8`**.

**`enhance_prompt`**: Enable or disable the prompt rewriter. Enabled by default.

**NOTE:** Videos created by Veo are watermarked using [SynthID](https://deepmind.google/technologies/synthid/), Google tool for watermarking and identifying AI-generated content, and are passed through safety filters and memorization checking processes that help mitigate privacy, copyright and bias risks

## Speech Generation

Gemini can transform text into single speaker or multi speaker using the text-to-speech (TTS) so you can control the *style*, *accent*, *pace*, and *tone* of the audio

**Supported models:** 

- [Gemini 2.5 Flash Preview TTS](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-flash-preview-tts)
- [Gemini 2.5 Pro Preview TTS](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-pro-preview-tts)

Flash Preview TTS is free to use

You can choose the speakers in the audio by config the **`SpeechConfig`** object with **`VoiceConfig`** 

and here is a [prebuilt voices](https://ai.google.dev/gemini-api/docs/speech-generation#voices)

### Single Speaker

```tsx
import {GoogleGenAI} from '@google/genai';
import wav from 'wav';

async function saveWaveFile(
   filename,
   pcmData,
   channels = 1,
   rate = 24000,
   sampleWidth = 2,
) {
   return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
      });

      writer.on('finish', resolve);
      writer.on('error', reject);

      writer.write(pcmData);
      writer.end();
   });
}

async function main() {
   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: 'Say cheerfully: Have a wonderful day!' }] }],
      config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
               voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
               },
            },
      },
   });

   const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
   const audioBuffer = Buffer.from(data, 'base64');

   const fileName = 'out.wav';
   await saveWaveFile(fileName, audioBuffer);
}
await main();
```

### **Multi-speaker**

```tsx
import {GoogleGenAI} from '@google/genai';
import wav from 'wav';

async function saveWaveFile(
   filename,
   pcmData,
   channels = 1,
   rate = 24000,
   sampleWidth = 2,
) {
   return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
      });

      writer.on('finish', resolve);
      writer.on('error', reject);

      writer.write(pcmData);
      writer.end();
   });
}

async function main() {
   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

   const prompt = `TTS the following conversation between Joe and Jane:
         Joe: How's it going today Jane?
         Jane: Not too bad, how about you?`;

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
               multiSpeakerVoiceConfig: {
                  speakerVoiceConfigs: [
                        {
                           speaker: 'Joe',
                           voiceConfig: {
                              prebuiltVoiceConfig: { voiceName: 'Kore' }
                           }
                        },
                        {
                           speaker: 'Jane',
                           voiceConfig: {
                              prebuiltVoiceConfig: { voiceName: 'Puck' }
                           }
                        }
                  ]
               }
            }
      }
   });

   const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
   const audioBuffer = Buffer.from(data, 'base64');

   const fileName = 'out.wav';
   await saveWaveFile(fileName, audioBuffer);
}

await main();
```

You can Also use streaming instead of saving to wave files 

You can Control speech style with prompts

```
Say in an spooky whisper:
"By the pricking of my thumbs...
Something wicked this way comes"
```

```
Make Speaker1 sound tired and bored, and Speaker2 sound excited and happy:

Speaker1: So... what's on the agenda today?
Speaker2: You're never going to guess!
```

## Models

Will cover the current versions of Gemini Models

- 2.5 Pro
- 2.5 Flash
- 2.5 Flash-Lite

|  | 2.5 Pro | 2.5 Flash | 2.5 Flash-Lite |
| --- | --- | --- | --- |
| Thinking | Default | Default | Can work |
| Disable Thinking | Can’t be done | Can be done using thinkingBudget : 0 | Can be done using thinkingBudget : 0 |
| Dynamic Thinking | Can’t be done using thinkingBudget : -1 | Can’t be done using thinkingBudget : -1 | Can’t be done using thinkingBudget : -1 |
| Text Generation | supported | supported | supported |
| Image Generation | supported | not supported | not supported |

There is Way more to explore in Gemini Docs but this models in my opinion is going to be the common used models by every one.