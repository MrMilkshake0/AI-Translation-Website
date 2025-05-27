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
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: `You are a translator. Translate into ${targetLang}, preserving tone and meaning.` },
      { role: "user", content: text },
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
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a translator. Translate into ${targetLang}, preserving tone and meaning.`,
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

  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a translator. Translate into ${targetLang}, preserving tone and meaning.`,
          },
          {
            type: "file",
            file: {
              name: file.name,
              mime_type: "application/pdf",
              data: `data:application/pdf;base64,${base64Doc}`,
            },
          },
        ],
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content.trim();
}

// Audio Translation (Whisper)
export async function translateAudio(file, targetLang) {
  const openai = getOpenAIClient();

  const response = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    response_format: "text",
    language: targetLang || undefined,
  });

  return response.text.trim();
}
