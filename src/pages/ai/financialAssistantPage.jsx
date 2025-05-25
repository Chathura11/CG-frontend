import { useState } from "react";
import axios from "axios";

export default function FinancialAssistant() {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!question) {
      setError("Please enter your financial question.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/financial-assistant`,
        { question, userEmail: localStorage.getItem("email") }, // Ensure email is passed
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAiResponse(result.data.advice);
    } catch (err) {
      setError("Failed to get financial advice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-accent mb-6">
        Financial Assistant
      </h2>

      {/* Input */}
      <div className="space-y-4">
        <textarea
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Ask something like: How can I save to buy a new bike in one year?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition"
        >
          Get Advice
        </button>
      </div>

      {/* AI Response */}
      {loading ? (
        <div className="flex justify-center items-center mt-6">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : aiResponse ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">AI Advice</h3>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md text-gray-800">
            {aiResponse}
          </pre>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          Ask your question to receive personalized financial guidance.
        </p>
      )}
    </div>
  );
}
