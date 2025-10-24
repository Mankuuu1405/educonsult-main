import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { X, MessageCircle, Send } from "lucide-react"; // Imported all needed icons
//import "./ChatBot.css"; // Optional: if you want to separate styles

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = input;
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/custom-chat", {
        message: messageToSend,
      });
      const botReply = res.data.reply || "Sorry, I couldn’t understand that.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Please try again later." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      {isOpen ? (
        <div
          style={{
            position: "relative",
            width: "380px",
            height: "500px",
            background: "linear-gradient(145deg, #8e44ad, #3498db)", // Fancy gradient
            borderRadius: "20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            <X size={22} color="#fff" />
          </button>

          {/* Chat messages */}
          <div
            style={{
              flex: 1,
              padding: "15px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  background:
                    msg.sender === "user" ? "#2ecc71" : "rgba(255,255,255,0.85)",
                  color: msg.sender === "user" ? "#fff" : "#333",
                  padding: "10px 14px",
                  borderRadius: "20px",
                  maxWidth: "75%",
                  wordBreak: "break-word",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input field */}
          <div
            style={{
              display: "flex",
              padding: "10px",
              background: "rgba(0,0,0,0.1)",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              style={{
                flex: 1,
                borderRadius: "20px",
                border: "none",
                padding: "10px 15px",
                outline: "none",
                fontSize: "14px",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "8px",
                border: "none",
                background: "#4F46E5",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Send color="#fff" size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: "#4F46E5",
            borderRadius: "50%",
            border: "none",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            cursor: "pointer",
          }}
        >
          <MessageCircle color="#fff" size={28} />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
