//src/pages/TextTranslator.jsx
import React, { useState } from "react";
import {
  translateText,
  translateImage,
  translateDocument,
  translateAudio,
} from "../services/translationService";

const TextTranslator = () => {
  const [mode, setMode] = useState("text");
  const [text, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("French");
  const [customLang, setCustomLang] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const languageOptions = ["French", "Spanish", "German", "Chinese", "Japanese", "Other"];
  const getFinalLanguage = () => (language === "Other" ? customLang : language);
  const getAcceptType = () => {
    if (mode === "image") return "image/*";
    if (mode === "document") return ".pdf";
    if (mode === "audio") return "audio/*";
    return "*/*";
  };

    const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
        setFile(selected);
    }
    };


  const handleTranslate = async () => {
    setLoading(true);
    setResult("");
    try {
      const targetLang = getFinalLanguage();
      if (!targetLang) throw new Error("Please specify a target language.");

      let output = "";
      if (mode === "text") {
        output = await translateText(text, targetLang);
      } else if (mode === "image") {
        output = await translateImage(file, targetLang);
      } else if (mode === "document") {
        output = await translateDocument(file, targetLang);
      } else if (mode === "audio") {
        output = await translateAudio(file, targetLang);
      }

      setResult(output);
    } catch (err) {
      setResult("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center gap-6 text-gray-800">
      <div className="flex w-full max-w-4xl gap-4">
        <div className="w-1/2">
          {mode === "text" ? (
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none"
              placeholder="Enter text to translate"
              value={text}
              onChange={(e) => setInput(e.target.value)}
            />
          ) : (
            <div className="h-64 flex flex-col justify-center items-center border border-gray-300 rounded-lg p-4 bg-white">
              <input
                type="file"
                accept={getAcceptType()}
                onChange={handleFileChange}
              />
                {file && <p className="text-sm mt-2">Selected: {file.name}</p>}
            </div>
          )}
        </div>

        <div className="w-1/2 border border-gray-300 bg-white p-4 rounded-lg h-64 overflow-y-auto">
          <h2 className="font-semibold mb-2">Output</h2>
          <p className="whitespace-pre-wrap">{result || "Translation will appear here..."}</p>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-4xl">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Input Type</label>
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setInput("");
              setFile(null);
              setResult("");
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="document">Document</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block font-semibold mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              if (e.target.value !== "Other") setCustomLang("");
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          {language === "Other" && (
            <input
              type="text"
              placeholder="Custom language"
              value={customLang}
              onChange={(e) => setCustomLang(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
            />
          )}
        </div>

        <div className="flex-1 flex items-end">
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Translating..." : "Translate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextTranslator;
