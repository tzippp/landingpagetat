import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

const initialMessages = [
  {
    from: "bot",
    text: "Hi! 👋 Need a price or design idea? Tell me what you want and I'll help you get a quote fast.",
  },
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [showTooltip, setShowTooltip] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [userId, setUserId] = useState("");

  // Generate unique userId on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("chatUserId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId =
        "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("chatUserId", newUserId);
      setUserId(newUserId);
    }
  }, []);

  // Auto-open chat after 5 seconds for first-time visitors
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
      setShowTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Hide tooltip when chat is opened
  useEffect(() => {
    if (open) setShowTooltip(false);
  }, [open]);

  // Save message to MongoDB
  const saveMessage = async (msg) => {
    if (!userId) return;

    try {
      const landingPage = window.location.pathname || "/";
      await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: { ...msg, business: "tattoo" },
          landingPage,
          consent: true,
        }),
      });
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    const newMessages = [...messages, userMsg];
    let botReply = "";
    if (/price|cost|how much|estimate/i.test(input)) {
      botReply =
        "Tattoo pricing depends on size, placement, and detail. Most fine line tattoos start at $80. Want a quote? Tell me your idea!";
    } else if (/idea|design|recommend|suggest/i.test(input)) {
      botReply =
        "Popular fine line ideas: minimalist flowers, tiny hearts, stars, waves, or custom script. What style are you thinking?";
    } else if (/placement|where/i.test(input)) {
      botReply =
        "Common placements: wrist, ankle, behind the ear, collarbone, or finger. Where do you want yours?";
    } else if (/hi|hello|hey/i.test(input)) {
      botReply = "Hello! 😊 How can I help you with your tattoo today?";
    } else {
      botReply =
        "I can help with pricing, design ideas, and placement! Ask me anything about fine line tattoos.";
    }
    setMessages([...newMessages, { from: "bot", text: botReply }]);
    setInput("");
    await saveMessage(userMsg);
    await saveMessage({ from: "bot", text: botReply });
  };

  return (
    <>
      <div
        className={styles["chatbot-bubble"]}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke={hovered ? "#CBB890" : "#E6D3B3"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 15s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
        {showTooltip && (
          <div className={styles["chatbot-tooltip"]}>
            Need a price? Chat with us!
          </div>
        )}
      </div>
      {open && (
        <div className={styles["chatbot-window"]}>
          <div
            className={styles["chatbot-header"]}
            style={{ background: "#E6D3B3", color: "#400006" }}
          >
            Tattoo Chat
            <span
              style={{ float: "right", cursor: "pointer" }}
              onClick={() => setOpen(false)}
            >
              &times;
            </span>
          </div>
          <div className={styles["chatbot-messages"]}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.from === "bot" ? "left" : "right",
                  margin: "0.5rem 0",
                }}
              >
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <div className={styles["chatbot-input"]}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
