import React, { useState } from "react";

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [landingPage, setLandingPage] = useState("all");
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [readChats, setReadChats] = useState({});
  const [archivedChats, setArchivedChats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const chatsPerPage = 10;

  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/get-chats?landingPage=${landingPage}`);
      const data = await res.json();
      setChats(data.chats || []);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
    setLoading(false);
  };

  // Fetch chats on initial load
  React.useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, []);

  const sendAdminReply = async (userId) => {
    if (!replyText.trim()) return;

    try {
      await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: { from: "admin", text: replyText },
          consent: true,
        }),
      });
      setReplyText("");
      setReplyingTo(null);
      fetchChats(); // Refresh the list
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  };

  // Add hover effect to chat cards
  const chatCardStyle = {
    borderBottom: "1px solid #e6d3b3",
    marginBottom: 16,
    paddingBottom: 16,
    background: "#fff",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "box-shadow 0.2s, background 0.2s, transform 0.2s",
  };

  // Helper functions
  const toggleRead = (userId) => {
    setReadChats((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };
  const toggleArchive = async (userId) => {
    await fetch("/api/save-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, archive: true, consent: true }),
    });
    fetchChats();
  };
  const handleDelete = async (userId) => {
    await fetch("/api/save-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, delete: true, consent: true }),
    });
    fetchChats();
  };

  const filteredChats = chats.filter((chat) => {
    const user = chat.userId ? chat.userId.toLowerCase() : "guest user";
    const msg = chat.latestMessage?.text?.toLowerCase() || "";
    return (
      user.includes(searchTerm.toLowerCase()) ||
      msg.includes(searchTerm.toLowerCase())
    );
  });
  const totalPages = Math.ceil(filteredChats.length / chatsPerPage);
  const paginatedChats = filteredChats.slice(
    (currentPage - 1) * chatsPerPage,
    currentPage * chatsPerPage
  );

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "2rem auto",
        fontFamily: "Montserrat, Arial, sans-serif",
        padding: "0 1rem",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <div>
        <h1 style={{ color: "#400006", marginBottom: "1rem" }}>
          💬 Chat Management
        </h1>

        <div
          style={{
            marginBottom: 16,
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
            position: "sticky",
            top: 0,
            zIndex: 2,
            background: "#f7f6f3",
            padding: "12px 0 12px 0",
            borderBottom: "1px solid #e6d3b3",
          }}
        >
          <div>
            <label style={{ marginRight: "0.5rem" }}>Filter by page: </label>
            <select
              value={landingPage}
              onChange={(e) => setLandingPage(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #e6d3b3",
              }}
            >
              <option value="all">All Pages</option>
              <option value="/">Home Page</option>
              <option value="/fine-line-tattoo">Fine Line Tattoo</option>
            </select>
          </div>

          <button
            onClick={fetchChats}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              background: "#fff6f9",
              border: "1px solid #e6d3b3",
              color: "#400006",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            🔄 Refresh
          </button>

          <div style={{ color: "#666", fontSize: "0.9rem" }}>
            {chats.length} chat{chats.length !== 1 ? "s" : ""} found
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user or message..."
            style={{
              width: "100%",
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              border: "1px solid #e6d3b3",
              fontSize: "1rem",
              background: "#fff6f9",
              color: "#400006",
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            Loading chats...
          </div>
        ) : (
          <div
            style={{
              background: "#f7f6f3",
              borderRadius: 12,
              padding: 16,
              minHeight: 400,
              maxHeight: 700,
              overflowY: "auto",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              width: "100%",
            }}
          >
            {chats.length === 0 ? (
              <div
                style={{
                  color: "#888",
                  textAlign: "center",
                  padding: "2rem",
                  fontSize: "1.1rem",
                }}
              >
                No chats found. Try refreshing or check your MongoDB connection.
              </div>
            ) : (
              paginatedChats.map((chat, idx) => (
                <div
                  key={chat.userId}
                  style={{ ...chatCardStyle, position: "relative" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(64,0,6,0.10)";
                    e.currentTarget.style.background = "#fff6f9";
                    e.currentTarget.style.transform =
                      "translateY(-2px) scale(1.01)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = chatCardStyle.boxShadow;
                    e.currentTarget.style.background = chatCardStyle.background;
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <span
                    onClick={() => toggleRead(chat.userId)}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 16,
                      fontSize: "1.4rem",
                      color: readChats[chat.userId] ? "#e6d3b3" : "#ccc",
                      cursor: "pointer",
                      userSelect: "none",
                      zIndex: 1,
                    }}
                    title={
                      readChats[chat.userId]
                        ? "All messages read"
                        : "Unread messages"
                    }
                  >
                    {readChats[chat.userId] ? "★" : "☆"}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        color: "#400006",
                      }}
                    >
                      User:{" "}
                      {chat.userId ? chat.userId.slice(0, 20) : "Guest User"}
                      ...
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

                  {chat.landingPage && (
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#888",
                        marginTop: "2px",
                      }}
                    >
                      Source:{" "}
                      {chat.landingPage === "/"
                        ? "Home Page"
                        : chat.landingPage
                        ? chat.landingPage
                        : "Unknown"}
                    </div>
                  )}

                  <div style={{ margin: "8px 0", fontSize: "1rem" }}>
                    <span style={{ color: "#400006" }}>
                      💬 {chat.latestMessage?.text || "(No messages)"}
                    </span>
                  </div>

                  <div
                    style={{ display: "flex", gap: "8px", marginTop: "12px" }}
                  >
                    <button
                      style={{
                        fontSize: "0.95rem",
                        borderRadius: 8,
                        background: "#fff0f0",
                        border: "1px solid #e6d3b3",
                        color: "#400006",
                        cursor: "pointer",
                        padding: "0.4rem 0.9rem",
                      }}
                      onClick={() => toggleArchive(chat.userId)}
                    >
                      Archive
                    </button>
                    <button
                      style={{
                        fontSize: "0.95rem",
                        borderRadius: 8,
                        background:
                          expanded === chat.userId ? "#e6d3b3" : "#fff6f9",
                        border: "1px solid #e6d3b3",
                        color: "#400006",
                        cursor: "pointer",
                        padding: "0.4rem 0.9rem",
                      }}
                      onClick={() =>
                        setExpanded(
                          expanded === chat.userId ? null : chat.userId
                        )
                      }
                    >
                      {expanded === chat.userId ? "👁️ Hide" : "👁️ View Chat"}
                    </button>

                    <button
                      style={{
                        fontSize: "0.95rem",
                        borderRadius: 8,
                        background: "#fff6f9",
                        border: "1px solid #e6d3b3",
                        color: "#400006",
                        cursor: "pointer",
                        padding: "0.4rem 0.9rem",
                      }}
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === chat.userId ? null : chat.userId
                        )
                      }
                    >
                      {replyingTo === chat.userId ? "❌ Cancel" : "💬 Reply"}
                    </button>

                    <button
                      style={{
                        fontSize: "0.95rem",
                        borderRadius: 8,
                        background: "#f7f6f3",
                        border: "1px solid #e6d3b3",
                        color: "#400006",
                        cursor: "pointer",
                        padding: "0.4rem 0.9rem",
                        marginLeft: 0,
                        marginTop: 8,
                        width: "100%",
                        maxWidth: 120,
                        boxSizing: "border-box",
                      }}
                      onClick={() => handleDelete(chat.userId)}
                    >
                      Delete
                    </button>
                  </div>

                  {replyingTo === chat.userId && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "12px",
                        background: "#fff6f9",
                        borderRadius: "8px",
                      }}
                    >
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        style={{
                          width: "100%",
                          minHeight: "60px",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #e6d3b3",
                          resize: "vertical",
                        }}
                      />
                      <div
                        style={{
                          marginTop: "8px",
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={() => sendAdminReply(chat.userId)}
                          style={{
                            padding: "0.4rem 1rem",
                            borderRadius: "4px",
                            background: "#400006",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Send Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyText("");
                            setReplyingTo(null);
                          }}
                          style={{
                            padding: "0.4rem 1rem",
                            borderRadius: "4px",
                            background: "#666",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {expanded === chat.userId && (
                    <ChatDetail userId={chat.userId} />
                  )}
                </div>
              ))
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                margin: "16px 0",
              }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "4px",
                  background: "#fff6f9",
                  border: "1px solid #e6d3b3",
                  color: "#400006",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === 1 ? 0.5 : 1,
                  fontSize: "1rem",
                }}
              >
                Previous
              </button>
              <span
                style={{
                  alignSelf: "center",
                  color: "#400006",
                  fontWeight: 500,
                }}
              >
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "4px",
                  background: "#fff6f9",
                  border: "1px solid #e6d3b3",
                  color: "#400006",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  fontSize: "1rem",
                }}
              >
                Next
              </button>
            </div>
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
      try {
        const res = await fetch(`/api/get-chat-detail?userId=${userId}`);
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Failed to fetch chat detail:", error);
      }
      setLoading(false);
    }
    fetchDetail();
  }, [userId]);

  return (
    <div
      style={{
        marginTop: 12,
        background: "#fff",
        borderRadius: 8,
        padding: 12,
        border: "1px solid #e6d3b3",
      }}
    >
      <h4 style={{ margin: "0 0 12px 0", color: "#400006" }}>
        📋 Full Conversation
      </h4>

      {loading ? (
        <div style={{ textAlign: "center", padding: "1rem", color: "#666" }}>
          Loading messages...
        </div>
      ) : (
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {messages.length === 0 ? (
            <div
              style={{ color: "#666", textAlign: "center", padding: "1rem" }}
            >
              No messages found.
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 12,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background:
                    msg.from === "bot"
                      ? "#fff6f9"
                      : msg.from === "admin"
                      ? "#fff0f0"
                      : "#f7f6f3",
                  borderLeft: `4px solid ${
                    msg.from === "bot"
                      ? "#e6d3b3"
                      : msg.from === "admin"
                      ? "#ff6b6b"
                      : "#e6d3b3"
                  }`,
                  color:
                    msg.from === "bot"
                      ? "#400006"
                      : msg.from === "admin"
                      ? "#ff6b6b"
                      : "#400006",
                  maxWidth: "80%",
                  alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                  marginLeft: msg.from === "user" ? "auto" : 0,
                  marginRight: msg.from === "user" ? 0 : "auto",
                  textAlign: msg.from === "user" ? "right" : "left",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontWeight: 500,
                    color:
                      msg.from === "bot"
                        ? "#400006"
                        : msg.from === "admin"
                        ? "#ff6b6b"
                        : "#400006",
                    marginBottom: "4px",
                  }}
                >
                  {msg.from === "bot"
                    ? "🤖 Bot"
                    : msg.from === "admin"
                    ? "👨‍💼 Admin"
                    : "👤 User"}
                </div>
                <div style={{ marginBottom: "4px" }}>{msg.text}</div>
                <div style={{ fontSize: "0.8rem", color: "#888" }}>
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleString()
                    : ""}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
