import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Loading from "./Loading";

export default function App() {
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loadingStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = { role: "user", text: question.trim() };
    setMessages((m) => [...m, userMsg]);
    setQuestion("");
    setLoadingStatus(true);

    try {
      const resp = await axios.post(
        "http://localhost:8000/ask",
        { question: userMsg.text },
        { headers: { "Content-Type": "application/json" } }
      );

      if (resp.data?._status) {
        const aiMsg = { role: "ai", text: resp.data.finalData };
        setMessages((m) => [...m, aiMsg]);
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "Network error: Could not reach the server." },
      ]);
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <div className="w-full max-w-4xl rounded-2xl shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-0 overflow-hidden">
        <div className="px-6 py-5 border-b border-white/20 bg-white/10 backdrop-blur-lg">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-md tracking-wide">
            Israin ChatBot
          </h1>
          <p className="text-sm text-gray-200">
            Ask anything — Powered by Gemini AI
          </p>
        </div>

        <div className="flex flex-col h-[550px] md:flex-row">
          <div className="flex-1 p-4 flex flex-col">
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-3 space-y-4 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20"
            >
              {messages.length === 0 && (
                <div className="text-center text-gray-200 mt-10 animate-pulse">
                  Start chatting with Gemini ✨
                </div>
              )}

              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-lg backdrop-blur-lg border
                      ${m.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-white/20"
                        : "bg-black/20 text-white border-white/30"
                      }
                    `}
                  >
                    {m.role === "ai" ? (
                      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {m.text}
                      </ReactMarkdown>
                    ) : (
                      <div className="whitespace-pre-wrap">{m.text}</div>
                    )}
                  </div>
                </div>
              ))}

              {loadingStatus && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-white/20 text-white border border-white/30 backdrop-blur-lg">
                    <Loading />
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex gap-3">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  type="text"
                  placeholder="Ask something..."
                  className="flex-1 px-5 py-3 rounded-full bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none backdrop-blur-lg focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg hover:opacity-90 transition font-bold"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
