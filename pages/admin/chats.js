import React, { useState } from "react";

const adSourceLabels = {
  facebook: "Facebook",
  google: "Google",
  instagram: "Instagram",
  unknown: "Unknown Source",
};

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
  const [chatDetailCache, setChatDetailCache] = useState({});
  const [deletingChats, setDeletingChats] = useState({});
  const [archivingChats, setArchivingChats] = useState({});
  const [activeTab, setActiveTab] = useState("active");
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // Define services and landing pages
  const serviceLandingPages = {
    Tattoo: [{ path: "/", label: "Tattoo" }],
    "Spray Tanning": [
      { path: "/spray-tan-a", label: "Spray Tanning" },
      { path: "/spray-tan-b", label: "Spray Tanning" },
    ],
    "Scalp Micro Pigmentation": [
      { path: "/smp-a", label: "Scalp Micro Pigmentation" },
    ],
    "Temporary Tattoos": [
      { path: "/temp-tattoo-a", label: "Temporary Tattoos" },
    ],
    "Permanent Makeup Eyebrows": [
      { path: "/pmu-brows-a", label: "Permanent Makeup Eyebrows" },
    ],
    "Permanent Makeup Eyeliner": [
      { path: "/pmu-eyeliner-a", label: "Permanent Makeup Eyeliner" },
    ],
    "Permanent Makeup Lips": [
      { path: "/pmu-lips-a", label: "Permanent Makeup Lips" },
    ],
  };
  const allServices = Object.keys(serviceLandingPages);

  // Add filter state for landing page and source
  const [landingPageFilter, setLandingPageFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  // Define source options
  const sourceOptions = [
    { value: "", label: "All Sources (show all chats)" },
    { value: "web", label: "Web Chat" },
    { value: "google", label: "Google" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "unknown", label: "Unknown Source" },
  ];

  // Gather all landing pages for the dropdown
  const allLandingPages = Object.values(serviceLandingPages).flat();

  // Define colors for landing pages
  const landingPageColors = {
    "/": "#e6d3b3",
    "/tattoo-b": "#f7b2ad",
    "/tattoo-c": "#b3e6d3",
    "/spray-tan-a": "#ffe4b3",
    "/spray-tan-b": "#b3d1e6",
    "/smp-a": "#d1b3e6",
    "/temp-tattoo-a": "#e6b3d1",
    "/pmu-brows-a": "#b3e6e0",
    "/pmu-eyeliner-a": "#e6cbb3",
    "/pmu-lips-a": "#e6b3b3",
  };
  const landingPageLabelsMap = {};
  allLandingPages.forEach((lp) => {
    landingPageLabelsMap[lp.path] = lp.label;
  });

  const landingPageDropdownOptions = [
    { value: "", label: "All Services (show all chats)" },
    ...allServices.map((service) => ({ value: service, label: service })),
  ];

  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/get-chats?landingPage=${landingPage}`);
      const data = await res.json();
      setChats(data.chats || []);
      setLastUpdateTime(new Date());
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
    setLoading(false);
  };

  // Fetch chats on initial load
  React.useEffect(() => {
    fetchChats();
  }, []);

  // Auto-refresh every 5 seconds for real-time updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchChats();
    }, 5000);
    return () => clearInterval(interval);
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
      // Immediately refresh to show the new message
      await fetchChats();
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  };

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

  const toggleRead = (userId) => {
    setReadChats((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const toggleArchive = async (userId) => {
    if (!confirm("Are you sure you want to archive this chat?")) return;

    setArchivingChats((prev) => ({ ...prev, [userId]: true }));
    try {
      const response = await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, archive: true, consent: true }),
      });

      if (response.ok) {
        alert("Chat archived successfully!");
      } else {
        alert("Failed to archive chat. Please try again.");
      }
    } catch (error) {
      console.error("Failed to archive chat:", error);
      alert("Failed to archive chat. Please try again.");
    } finally {
      setArchivingChats((prev) => ({ ...prev, [userId]: false }));
      fetchChats();
    }
  };

  const handleDelete = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to move this chat to trash? It will be permanently deleted in 30 days."
      )
    )
      return;

    setDeletingChats((prev) => ({ ...prev, [userId]: true }));
    try {
      const response = await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, delete: true, consent: true }),
      });

      if (response.ok) {
        alert("Chat moved to trash successfully!");
      } else {
        alert("Failed to delete chat. Please try again.");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert("Failed to delete chat. Please try again.");
    } finally {
      setDeletingChats((prev) => ({ ...prev, [userId]: false }));
      fetchChats();
    }
  };

  const restoreFromTrash = async (userId) => {
    try {
      const response = await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, restore: true, consent: true }),
      });

      if (response.ok) {
        alert("Chat restored successfully!");
        fetchChats();
      } else {
        alert("Failed to restore chat. Please try again.");
      }
    } catch (error) {
      console.error("Failed to restore chat:", error);
      alert("Failed to restore chat. Please try again.");
    }
  };

  const permanentlyDelete = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this chat? This action cannot be undone."
      )
    )
      return;

    try {
      const response = await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, permanentDelete: true, consent: true }),
      });

      if (response.ok) {
        alert("Chat permanently deleted!");
        fetchChats();
      } else {
        alert("Failed to delete chat. Please try again.");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert("Failed to delete chat. Please try again.");
    }
  };

  // Filter chats based on active tab
  const filteredChats = chats
    .filter((chat) => {
      // Filter by tab
      if (activeTab === "active" && (chat.archived || chat.deleted))
        return false;
      if (activeTab === "archive" && !chat.archived) return false;
      if (activeTab === "trash" && !chat.deleted) return false;

      // Only apply landing page filter if user selected something
      if (landingPageFilter) {
        const allowedPaths =
          serviceLandingPages[landingPageFilter]?.map((lp) => lp.path) || [];
        if (!allowedPaths.includes(chat.landingPage)) return false;
      }

      // Only apply source filter if user selected something
      if (sourceFilter) {
        if ((chat.adSource || "unknown") !== sourceFilter) return false;
      }

      // Search filter (always applies if user types something)
      if (searchTerm) {
        const user = chat.userId ? chat.userId.toLowerCase() : "guest user";
        const msg = chat.latestMessage?.text?.toLowerCase() || "";
        if (
          !user.includes(searchTerm.toLowerCase()) &&
          !msg.includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by most recent first (updatedAt or createdAt)
      const dateA = new Date(a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || 0);
      return dateB - dateA;
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h1 style={{ color: "#400006", margin: 0 }}>💬 Chat Management</h1>
          <div style={{ fontSize: "0.8rem", color: "#888" }}>
            🔄 Auto-refresh every 5s • Last update:{" "}
            {lastUpdateTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setActiveTab("active")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              background: activeTab === "active" ? "#400006" : "#fff6f9",
              color: activeTab === "active" ? "white" : "#400006",
              border: "1px solid #e6d3b3",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Active ({chats.filter((c) => !c.archived && !c.deleted).length})
          </button>
          <button
            onClick={() => setActiveTab("archive")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              background: activeTab === "archive" ? "#400006" : "#fff6f9",
              color: activeTab === "archive" ? "white" : "#400006",
              border: "1px solid #e6d3b3",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Archive ({chats.filter((c) => c.archived).length})
          </button>
          <button
            onClick={() => setActiveTab("trash")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              background: activeTab === "trash" ? "#400006" : "#fff6f9",
              color: activeTab === "trash" ? "white" : "#400006",
              border: "1px solid #e6d3b3",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Trash ({chats.filter((c) => c.deleted).length})
          </button>
        </div>

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
            <label style={{ marginRight: "0.5rem" }}>
              Filter by Landing Page:{" "}
            </label>
            <select
              value={landingPageFilter}
              onChange={(e) => setLandingPageFilter(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #e6d3b3",
              }}
            >
              {landingPageDropdownOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ marginRight: "0.5rem" }}>Filter by Source: </label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #e6d3b3",
              }}
            >
              {sourceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ color: "#666", fontSize: "0.9rem" }}>
            {filteredChats.length} chat{filteredChats.length !== 1 ? "s" : ""}{" "}
            found
            {!landingPageFilter && !sourceFilter && !searchTerm && (
              <span style={{ color: "#400006", fontWeight: "500" }}>
                {" "}
                (showing all {chats.length} total chats)
              </span>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user or message... (leave empty to show all chats)"
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
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: landingPageColors[chat.landingPage] || "#eee",
                      color: "#400006",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      border: "1.5px solid #e6d3b3",
                    }}
                    title={
                      landingPageLabelsMap[chat.landingPage] || chat.landingPage
                    }
                  >
                    {(() => {
                      if (chat.landingPage === "/") return "A";
                      if (
                        typeof chat.landingPage === "string" &&
                        chat.landingPage.endsWith("-b")
                      )
                        return "B";
                      if (
                        typeof chat.landingPage === "string" &&
                        chat.landingPage.endsWith("-c")
                      )
                        return "C";
                      if (
                        typeof chat.landingPage === "string" &&
                        chat.landingPage.includes("brows")
                      )
                        return "B";
                      if (
                        typeof chat.landingPage === "string" &&
                        chat.landingPage.includes("eyeliner")
                      )
                        return "E";
                      if (
                        typeof chat.landingPage === "string" &&
                        chat.landingPage.includes("lips")
                      )
                        return "L";
                      if (
                        typeof chat.landingPage === "string" &&
                        chat.landingPage.includes("smp")
                      )
                        return "S";
                      if (
                        typeof chat.landingPage === "string" &&
                        chat.landingPage.includes("temp")
                      )
                        return "T";
                      return "?";
                    })()}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "1.05rem",
                      color: "#400006",
                    }}
                  >
                    User:{" "}
                    {chat.userId ? chat.userId.slice(0, 20) : "Guest User"}...
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#888",
                        fontWeight: "normal",
                        marginTop: "2px",
                      }}
                    >
                      {chat.updatedAt
                        ? new Date(chat.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                          }) +
                          " • Date: " +
                          new Date(chat.updatedAt).toLocaleDateString()
                        : chat.createdAt
                        ? new Date(chat.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                          }) +
                          " • Date: " +
                          new Date(chat.createdAt).toLocaleDateString()
                        : "Unknown time"}
                    </div>
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
                    Landing Page:{" "}
                    {landingPageLabelsMap[chat.landingPage] ||
                      chat.landingPage ||
                      "Unknown"}
                    <br />
                    Source: {chat.adSource || "Unknown Source"}
                  </div>
                )}

                <div style={{ margin: "8px 0", fontSize: "1rem" }}>
                  <span style={{ color: "#400006" }}>
                    {chat.latestMessage?.text || "No messages yet"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
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
                    💬 Reply
                  </button>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#aaa",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                      padding: 0,
                      marginRight: 8,
                      verticalAlign: "middle",
                    }}
                    onClick={() =>
                      setExpanded(expanded === chat.userId ? null : chat.userId)
                    }
                    title={expanded === chat.userId ? "Hide" : "View"}
                  >
                    {expanded === chat.userId ? "▲" : "▼"}
                  </button>
                  {activeTab === "active" && (
                    <>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: deletingChats[chat.userId] ? "#999" : "#bbb",
                          fontSize: "0.9rem",
                          cursor: deletingChats[chat.userId]
                            ? "not-allowed"
                            : "pointer",
                          padding: 0,
                          marginRight: 12,
                          textDecoration: "underline",
                        }}
                        onClick={() => handleDelete(chat.userId)}
                        disabled={deletingChats[chat.userId]}
                      >
                        {deletingChats[chat.userId]
                          ? "Moving to trash..."
                          : "Delete"}
                      </button>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: archivingChats[chat.userId] ? "#999" : "#bbb",
                          fontSize: "0.9rem",
                          cursor: archivingChats[chat.userId]
                            ? "not-allowed"
                            : "pointer",
                          padding: 0,
                          marginRight: 12,
                          textDecoration: "underline",
                        }}
                        onClick={() => toggleArchive(chat.userId)}
                        disabled={archivingChats[chat.userId]}
                      >
                        {archivingChats[chat.userId]
                          ? "Archiving..."
                          : "Archive"}
                      </button>
                    </>
                  )}
                  {activeTab === "archive" && (
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: "#bbb",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        padding: 0,
                        marginRight: 12,
                        textDecoration: "underline",
                      }}
                      onClick={() => handleDelete(chat.userId)}
                    >
                      Move to Trash
                    </button>
                  )}
                  {activeTab === "trash" && (
                    <>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#bbb",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          padding: 0,
                          marginRight: 12,
                          textDecoration: "underline",
                        }}
                        onClick={() => restoreFromTrash(chat.userId)}
                      >
                        Restore
                      </button>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ff4444",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          padding: 0,
                          marginRight: 12,
                          textDecoration: "underline",
                        }}
                        onClick={() => permanentlyDelete(chat.userId)}
                      >
                        Delete Forever
                      </button>
                    </>
                  )}
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendAdminReply(chat.userId);
                        }
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
        </div>

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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "4px",
              background: "#fff6f9",
              border: "1px solid #e6d3b3",
              color: "#400006",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.5 : 1,
              fontSize: "1rem",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatDetail({ userId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/get-chat-detail?userId=${userId}`);
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (error) {
        setMessages([]);
      }
      setLoading(false);
    }
    fetchDetail();

    // Auto-refresh conversation every 3 seconds
    const interval = setInterval(fetchDetail, 3000);
    return () => clearInterval(interval);
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
        <div style={{ maxHeight: "300px", overflowY: "auto", padding: "8px" }}>
          {messages.length === 0 ? (
            <div
              style={{ color: "#666", textAlign: "center", padding: "1rem" }}
            >
              No messages found.
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  title={
                    msg.createdAt
                      ? new Date(msg.createdAt).toLocaleString()
                      : ""
                  }
                  style={{
                    padding: "8px 12px",
                    borderRadius: "12px",
                    background:
                      msg.from === "bot"
                        ? "#fff6f9"
                        : msg.from === "admin"
                        ? "#400006"
                        : "#f7f6f3",
                    color:
                      msg.from === "bot"
                        ? "#400006"
                        : msg.from === "admin"
                        ? "white"
                        : "#400006",
                    maxWidth: "70%",
                    alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                    marginLeft: msg.from === "user" ? "auto" : 0,
                    marginRight: msg.from === "user" ? 0 : "auto",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    position: "relative",
                    fontSize: "0.9rem",
                    lineHeight: 1.4,
                    cursor: msg.createdAt ? "pointer" : "default",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      opacity: 0.7,
                      marginBottom: "4px",
                    }}
                  >
                    {msg.from === "bot"
                      ? "🤖 Bot"
                      : msg.from === "admin"
                      ? "👨‍💼 Admin"
                      : "👤 User"}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
