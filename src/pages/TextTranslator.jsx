import React, { useState } from "react";
import {
  translateText,
  translateImage,
  translateDocument,
  translateAudio,
} from "../services/translationService";

import { auth } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

import TranslationControls from "../components/TranslationControls";
import { InputBox, OutputBox } from "../components/inputOutputBox";
import TranslationHistory from "../components/translationHistory"; // Sidebar

const TextTranslator = () => {
  const [mode, setMode] = useState("text");
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("French");
  const [customLang, setCustomLang] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const languageOptions = [
    "French",
    "Spanish",
    "German",
    "Chinese",
    "Japanese",
    "Other",
  ];

  const getFinalLanguage = () =>
    language === "Other" ? customLang.trim() : language;

  const getAcceptType = () => {
    if (mode === "image") return "image/*";
    if (mode === "document") return ".pdf,.doc,.docx";
    if (mode === "audio") return "audio/*";
    return "text/plain";
  };

  const handleTranslate = async () => {
    setLoading(true);
    try {
      let translation = "";
      const targetLang = getFinalLanguage();

      if (!targetLang) {
        alert("Please select or enter a target language.");
        setLoading(false);
        return;
      }

      switch (mode) {
        case "text":
          translation = await translateText(input, targetLang);
          break;
        case "image":
          translation = await translateImage(file, targetLang);
          break;
        case "document":
          translation = await translateDocument(file, targetLang);
          break;
        case "audio":
          translation = await translateAudio(file, targetLang);
          break;
        default:
          throw new Error("Invalid translation mode");
      }

      setResult(translation);

      // Save to Firestore if logged in
      if (auth.currentUser) {
        await addDoc(collection(db, "translations"), {
          original: mode === "text" ? input : `[${mode} file]`,
          translated: translation,
          targetLang,
          mode,
          userId: auth.currentUser.uid,
          timestamp: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error(err);
      alert("Translation failed. Check your input and try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      {/* Sidebar */}
      <TranslationHistory />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">AI Translator</h1>

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

        <div className="mt-6 flex flex-col md:flex-row gap-6">
          <InputBox
            mode={mode}
            input={input}
            setInput={setInput}
            file={file}
            setFile={setFile}
            accept={getAcceptType()}
            loading={loading}
          />
          <OutputBox result={result} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default TextTranslator;
