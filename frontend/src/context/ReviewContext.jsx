import { createContext, useContext, useState, useCallback, useEffect } from "react";

const ReviewContext = createContext(null);

const DEFAULT_CODE = `// Paste your code here and click "Review with AI"\n`;

export function ReviewProvider({ children }) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("javascript");
  const [problemName, setProblemName] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [apiKey, setApiKeyState] = useState(() => {
    return localStorage.getItem("groqApiKey") || "";
  });

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("groqApiKey", apiKey);
    } else {
      localStorage.removeItem("groqApiKey");
    }
  }, [apiKey]);

  const setApiKey = useCallback((key) => {
    setApiKeyState(key);
  }, []);

  const clearReview = useCallback(() => {
    setCode(DEFAULT_CODE);
    setLanguage("javascript");
    setProblemName("");
    setFeedback(null);
  }, []);

  return (
    <ReviewContext.Provider
      value={{
        code, setCode,
        language, setLanguage,
        problemName, setProblemName,
        feedback, setFeedback,
        apiKey, setApiKey,
        clearReview,
        DEFAULT_CODE,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error("useReview must be used within ReviewProvider");
  return ctx;
}
