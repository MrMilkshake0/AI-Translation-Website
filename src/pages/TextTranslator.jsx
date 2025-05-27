// src/pages/TextTranslator.jsx
import React, { useState } from "react";
import {
  translateText,
  translateImage,
  translateDocument,
  translateAudio,
} from "../services/translationService";
import { InputBox, OutputBox } from "../components/inputOutputBox";
import TranslationControls from "../components/translationControls";

const TextTranslator = () => {
  const [mode, setMode] = useState("text");
  const [text, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("French");
  const [customLang, setCustomLang] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const languageOptions = [
    "French", "Spanish", "German", "Chinese", "Japanese", "Other"
  ];

  const getFinalLanguage = () =>
    language === "Other" ? customLang.trim() : language;

  const getAcceptType = () => {
    switch (mode) {
      case "image": return "image/*";
      case "document": return ".pdf";
      case "audio": return "audio/*";
      default: return "*/*";
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
        if (!text.trim()) throw new Error("Please enter some text.");
        output = await translateText(text, targetLang);
      } else {
        if (!file) throw new Error("Please upload a file.");
        if (mode === "image") output = await translateImage(file, targetLang);
        else if (mode === "document") output = await translateDocument(file, targetLang);
        else if (mode === "audio") output = await translateAudio(file, targetLang);
      }

      setResult(output);
    } catch (err) {
      setResult("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white px-6 py-10 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-10 text-white tracking-tight">
        🌐 Multilingual Translator
      </h1>

      {/* Input + Output Container */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl flex-1">
        <InputBox
          mode={mode}
          text={text}
          setInput={setInput}
          file={file}
          setFile={setFile}
          getAcceptType={getAcceptType}
        />
        <OutputBox result={result} />
      </div>

      {/* Controls */}
      <div className="mt-8 w-full max-w-5xl">
        <TranslationControls
          mode={mode}
          setMode={setMode}
          setInput={setInput}
          setFile={setFile}
          setResult={setResult}
          language={language}
          setLanguage={setLanguage}
          customLang={customLang}
          setCustomLang={setCustomLang}
          languageOptions={languageOptions}
          handleTranslate={handleTranslate}
          loading={loading}
        />
      </div>

      {/* Spacer for visual padding on large screens */}
      <div className="flex-grow" />
    </div>
  );
};

export default TextTranslator;
