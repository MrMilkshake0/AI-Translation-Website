// src/components/inputOutputBox.jsx

export const InputBox = ({ mode, input, setInput, file, setFile, accept }) => {
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  return (
    <div style={{ paddingTop: "10px", paddingBottom: "1px" }} className="w-full md:w-1/2 p-2">
      {mode === "text" ? (
        <textarea
          style={{ height: "75px" }}
          className="w-full p-4 bg-white text-white border border-gray-700 rounded-2xl shadow-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          placeholder="Enter text to translate..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      ) : (
        <div style={{ padding: "10px" }} className="flex flex-col justify-center items-center border border-gray-700 bg-[#2a2a2a] rounded-2xl p-6 shadow-md text-center text-white">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
          />
          {file && (
            <p className="text-sm text-gray-300 mt-3">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}

          {/* 👇 Solution 1 goes here: Transcribed text display */}
          {mode === "audio" && input && (
            <div className="mt-4 text-left w-full">
              <h3 className="text-sm font-semibold text-white mb-1">Transcribed Text</h3>
              <div className="bg-gray-800 text-gray-200 p-3 rounded-lg text-sm whitespace-pre-wrap">
                {input}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export const OutputBox = ({ result }) => {
  return (
    <div style={{height: "500px"}} className="w-full md:w-1/2 p-2">
      <div className="bg-[#2a2a2a] border border-gray-700 p-6 rounded-2xl h-full overflow-y-auto shadow-md text-white">
        <h2 style={{paddingLeft: "10px"}} className="font-semibold text-lg mb-2">Output</h2>
        <p style={{paddingLeft: "10px"}} className="whitespace-pre-wrap text-gray-200">
          {result || "Translation will appear here..."}
        </p>
      </div>
    </div>
  );
};
