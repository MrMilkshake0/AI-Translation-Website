import React from "react";
import useTranslationHistory from "../hooks/useTranslationHistory";

const TranslationHistory = () => {
  const {
    user, email, password, isLogin, setEmail, setPassword, setIsLogin,
    history, loading, selectedItem, setSelectedItem, handleAuth
  } = useTranslationHistory();

  const truncateWords = (text, wordLimit = 10) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");
  };

  const formatDateTime = (date) =>
    date?.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <aside className="w-72 min-h-screen bg-[#1f1f1f] text-white border-r border-gray-800 p-4 flex flex-col justify-between">
        <div>
          {!user ? (
            <>
              <h2 className="text-base font-semibold mb-4">Login to Save History</h2>
              <form onSubmit={handleAuth} className="space-y-2 text-sm">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded text-black"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded text-black"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-teal-500 py-2 rounded hover:bg-teal-600"
                >
                  {isLogin ? "Login" : "Register"}
                </button>
                <p
                  className="text-teal-300 cursor-pointer"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Need an account? Register here" : "Already have an account? Login"}
                </p>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-base font-semibold mb-4">Your Translation History</h2>
              {loading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : history.length === 0 ? (
                <p className="text-gray-400 text-sm">No history found.</p>
              ) : (
                <ul className="space-y-2">
                  {history.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="bg-[#2a2a2a] hover:bg-[#333] transition rounded-lg p-3 cursor-pointer"
                    >
                      <p className="text-sm font-medium truncate">
                        {truncateWords(item.original)}
                      </p>
                      <p className="text-sm text-teal-400 font-semibold mt-1">
                        → {item.targetLang || "Unknown"}
                      </p>
                      {item.timestamp && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDateTime(item.timestamp)}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {user && (
          <div className="mt-6 text-xs text-gray-400 border-t border-gray-700 pt-4">
            Signed in as <span className="text-white">{user.email}</span>
          </div>
        )}
      </aside>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-[#1e1e1e] text-white rounded-lg shadow-xl max-w-xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Translation Details</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 text-sm">
              {selectedItem.timestamp && (
                <p><span className="text-gray-400">Time:</span> {selectedItem.timestamp.toLocaleString()}</p>
              )}
              <p><span className="text-gray-400">Target Language:</span> {selectedItem.targetLang}</p>
              <p><span className="text-gray-400">Original Input:</span><br />{selectedItem.original}</p>
              <p><span className="text-gray-400">Translated Output:</span><br />{selectedItem.translated}</p>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TranslationHistory;
