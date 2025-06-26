"use client";
import React, { useState, useRef, useEffect } from "react";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  message: string;
  timestamp: Date;
}

const LOCAL_STORAGE_KEY = "ai-cafe-chat-messages";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mesajları localStorage'dan yükle
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch {
        setMessages([]);
      }
    } else {
      handleInitialMessage();
    }
  }, []);

  // Mesajlar değişince localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => { scrollToBottom(); }, [messages]);
  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };

  const handleInitialMessage = () => {
    setMessages([
      {
        id: "1",
        type: "bot",
        message:
          "Merhaba! Ben AI Barista. Sana kafe atmosferinde, sıcak ve samimi bir şekilde yardımcı olabilirim. Kahve önerisi, menü, ödüller veya kafe hakkında her şeyi sorabilirsin!",
        timestamp: new Date(),
      },
    ]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/chatbot/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ message: userMessage.message }),
      });
      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: "bot",
            message: data.data.reply,
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: "bot",
            message: "Üzgünüm, şu anda yardımcı olamıyorum.",
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "bot",
          message: "Bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Responsive ve modern UI
  return (
    <>
      {/* Chatbot Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-50 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label={isOpen ? "Sohbeti Kapat" : "AI Barista ile Sohbet Et"}
      >
        {isOpen ? (
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><text x="12" y="16" textAnchor="middle" fontSize="14" fill="#7c3aed">☕</text></svg>
        )}
      </button>
      {/* Chatbot Arayüzü */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 w-full max-w-md h-[70vh] sm:h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">☕</span>
              <div>
                <h3 className="font-semibold text-lg">AI Barista</h3>
                <p className="text-xs text-blue-100">Kafe Sohbet Asistanı</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 focus:outline-none">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800 transition-colors">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm whitespace-pre-wrap break-words transition-colors duration-200 ${message.type === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-600"}`}
                >
                  {message.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-2xl flex items-center gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Bir şey sor..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              autoFocus
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold disabled:opacity-50"
              disabled={isLoading || !inputMessage.trim()}
            >
              Gönder
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget; 