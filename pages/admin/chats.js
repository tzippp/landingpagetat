import React, { useState } from "react";

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [landingPage, setLandingPage] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    setLoading(true);
    const res = await fetch(`/api/get-chats?landingPage=${landingPage}`);
    const data = await res.json();
    setChats(data.chats || []);
    setLoading(false);
  };

  // Fetch chats on initial load
  React.useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, []);

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        fontFamily: "Montserrat, Arial, sans-serif",
      }}
    >
      <div>
        <h2>Chats (by User)</h2>
        <div style={{ marginBottom: 16 }}>
          <label>Filter by landing page: </label>
          <select
            value={landingPage}
            onChange={(e) => setLandingPage(e.target.value)}
          >
            <option value="all">All</option>
            <option value="fine-line-tattoo">Fine Line Tattoo</option>
            {/* Add more as needed */}
          </select>
          <button
            onClick={fetchChats}
            style={{
              marginLeft: 12,
              padding: "0.4rem 1rem",
              borderRadius: 8,
              background: "#a3bffa",
              border: "none",
              color: "#232323",
              cursor: "pointer",
            }}
          >
            Load
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div
            style={{
              background: "#f7f6f3",
              borderRadius: 12,
              padding: 16,
              minHeight: 300,
              maxHeight: 600,
              overflowY: "auto",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {chats.length === 0 && (
              <div style={{ color: "#888", textAlign: "center" }}>
                No chats found.
              </div>
            )}
            {chats.map((chat, idx) => (
              <div
                key={chat.userId}
                style={{
                  borderBottom: "1px solid #e6d3b3",
                  marginBottom: 10,
                  paddingBottom: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>
                    User: {chat.userId}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#888",
                      marginLeft: 12,
                      flex: 1,
                      textAlign: "right",
                    }}
                  >
                    {chat.updatedAt
                      ? new Date(chat.updatedAt).toLocaleString()
                      : ""}
                  </div>
                </div>
                <div style={{ margin: "6px 0 0 0", fontSize: "1rem" }}>
                  <span style={{ color: "#400006" }}>
                    {chat.latestMessage?.text || "(No messages)"}
                  </span>
                </div>
                <button
                  style={{
                    marginTop: 6,
                    fontSize: "0.95rem",
                    borderRadius: 8,
                    background:
                      expanded === chat.userId ? "#e6d3b3" : "#fff6f9",
                    border: "1px solid #e6d3b3",
                    color: "#400006",
                    cursor: "pointer",
                    padding: "0.3rem 0.9rem",
                  }}
                  onClick={() =>
                    setExpanded(expanded === chat.userId ? null : chat.userId)
                  }
                >
                  {expanded === chat.userId ? "Hide" : "Expand"}
                </button>
                {expanded === chat.userId && (
                  <ChatDetail userId={chat.userId} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChatDetail({ userId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch full chat for this user
  React.useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      const res = await fetch(`/api/get-chat-detail?userId=${userId}`);
      const data = await res.json();
      setMessages(data.messages || []);
      setLoading(false);
    }
    fetchDetail();
  }, [userId]);

  return (
    <div
      style={{
        marginTop: 10,
        background: "#fff",
        borderRadius: 8,
        padding: 10,
      }}
    >
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {messages.length === 0 && <div>No messages.</div>}
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontWeight: 500,
                  color: msg.from === "bot" ? "#a3bffa" : "#400006",
                }}
              >
                {msg.from === "bot" ? "Bot" : "User"}
              </div>
              <div>{msg.text}</div>
              <div style={{ fontSize: "0.8rem", color: "#888" }}>
                {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
