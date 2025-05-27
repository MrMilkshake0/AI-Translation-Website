const TranslationControls = ({
  mode, setMode, setInput, setFile, setResult,
  language, setLanguage, customLang, setCustomLang,
  languageOptions, handleTranslate, loading
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-[#2a2a2a] rounded-xl px-4 py-4 shadow-md flex flex-row flex-wrap gap-4 items-end justify-between">

      {/* Input Type Selector */}
      <div className="flex flex-col w-[160px]">
        <label htmlFor="inputType" className="text-sm text-gray-300 mb-1">
          Input Type
        </label>
        <select
          id="inputType"
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            setInput("");
            setFile(null);
            setResult("");
          }}
          className="bg-white text-black p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="document">Document</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      {/* Language Selector */}
      <div className="flex flex-col w-[180px]">
        <label htmlFor="language" className="text-sm text-gray-300 mb-1">
          Target Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            if (e.target.value !== "Other") setCustomLang("");
          }}
          className="bg-white text-black p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            className="mt-2 bg-[#1e1e1e] text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        )}
      </div>

      {/* Translate Button */}
      <div className="flex">
        <button
          onClick={handleTranslate}
          disabled={loading}
          className="min-w-[120px] h-[42px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-4 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Translating..." : "Translate"}
        </button>
      </div>
    </div>
  );
};

export default TranslationControls;
