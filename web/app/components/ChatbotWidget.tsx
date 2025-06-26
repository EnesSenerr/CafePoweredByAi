"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  message: string;
  timestamp: Date;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && messages.length === 0) handleInitialMessage();
  }, [isOpen]);

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
    } catch (error) {
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

  return (
    <>
      {/* Chatbot Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 z-50"
      >
        {isOpen ? <span className="text-2xl">✕</span> : <span className="text-2xl">☕</span>}
      </button>
      {/* Chatbot Arayüzü */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">☕</span>
                <div>
                  <h3 className="font-semibold">AI Barista</h3>
                  <p className="text-sm text-blue-100">Kafe Sohbet Asistanı</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                <span className="text-xl">✕</span>
              </button>
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${message.type === "user" ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Bir şey sor..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
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