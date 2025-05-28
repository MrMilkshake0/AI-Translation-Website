import React from "react";
import TextTranslator from "./pages/TextTranslator";
import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <AuthProvider>
      <TextTranslator />
    </AuthProvider>
  );
}

export default App;
