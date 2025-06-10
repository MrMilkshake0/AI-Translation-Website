//src/services/translationService.js
import OpenAI from "openai";

// Create OpenAI client (browser-safe)
function getOpenAIClient() {
  return new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // Required for browser usage
  });
}

// Text Translation
export async function translateText(text, targetLang) {
  if (!text || !targetLang) throw new Error("Both text and targetLang are required");

  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      { role: "system", content: `You are a translator. Translate into ${targetLang}, preserving tone and meaning. Respond with the translated text only.` },
      { role: "user", content: 'Translate this text: ' + text },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content.trim();
}

// Helper: Read File to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Image Translation
export async function translateImage(file, targetLang) {
  const base64Image = await fileToBase64(file);
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a translator. Translate into ${targetLang}, preserving tone and meaning. Respond with the translated text only.`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content.trim();
}

// Document Translation (PDF)
export async function translateDocument(file, targetLang) {
  const base64Doc = await fileToBase64(file);
  const openai = getOpenAIClient();

  const response = await openai.responses.create({
    model: "gpt-4o-mini-2024-07-18", // or "gpt-4.1" if you're using that
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_file",
            filename: file.name,
            file_data: `data:${file.type};base64,${base64Doc}`,
          },
          {
            type: "input_text",
            text: `You are a translator. Translate this document into ${targetLang}. Preserve tone and structure. Respond with the translated text only.`,
          },
        ],
      },
    ],
  });

  return response.output_text;
}

export async function translateAudio(file, targetLang) {
  const openai = getOpenAIClient();

  const audioBlob = new Blob([file], { type: file.type });
  const audioFile = new File([audioBlob], file.name || "audio.webm", { type: file.type });

  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "gpt-4o-transcribe",
    response_format: "text", // This returns raw string!
  });

  // transcription is already a string
  if (!transcription || typeof transcription !== "string") {
    throw new Error("Transcription failed or returned no text.");
  }

  const originalText = transcription.trim();
  const translatedText = await translateText(originalText, targetLang);

  return { originalText, translatedText };
}
