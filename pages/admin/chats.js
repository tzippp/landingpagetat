import React, { useState } from "react";

export async function getServerSideProps() {
  // Use absolute URL for SSR
  const res = await fetch("http://localhost:3001/api/get-chats");
  const data = await res.json();
  return { props: { initialChats: data.chats || [] } };
}

const adSourceLabels = {
  facebook: "Facebook",
  google: "Google",
  instagram: "Instagram",
  unknown: "Unknown Source",
};

export default function AdminChats({ initialChats }) {
  const [chats, setChats] = useState(initialChats);
  const [expanded, setExpanded] = useState(null);
  const [landingPage, setLandingPage] = useState("all");
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyImage, setReplyImage] = useState(null);
  const [readChats, setReadChats] = useState({});
  const [archivedChats, setArchivedChats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [chatDetailCache, setChatDetailCache] = useState({});
  const [deletingChats, setDeletingChats] = useState({});
  const [archivingChats, setArchivingChats] = useState({});
  const [activeTab, setActiveTab] = useState("active");
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  // Sound notification function
  const playNotificationSound = () => {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Create a cute notification sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log("Sound notification failed:", error);
    }
  };

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
    { value: "", label: "All Sources" },
    { value: "web", label: "Web Chat" },
    { value: "google", label: "Google" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "referral", label: "Referral" },
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
    { value: "", label: "All Services" },
    ...allServices.map((service) => ({ value: service, label: service })),
  ];

  // Add variant filter
  const [variantFilter, setVariantFilter] = useState("");

  const variantOptions = [
    { value: "", label: "All Variants" },
    { value: "A", label: "Variant A" },
    { value: "B", label: "Variant B" },
    { value: "C", label: "Variant C" },
  ];

  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/get-chats?landingPage=${landingPage}`);
      const data = await res.json();
      const newChats = data.chats || [];
      setChats(newChats);
      setLastUpdateTime(new Date());

      // Check for new messages and play sound if enabled
      const totalMessages = newChats.reduce(
        (total, chat) => total + (chat.messages?.length || 0),
        0
      );
      if (
        soundEnabled &&
        totalMessages > lastMessageCount &&
        lastMessageCount > 0
      ) {
        playNotificationSound();
      }
      setLastMessageCount(totalMessages);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
    setLoading(false);
  };

  // Fetch chats on initial load (client-side refresh)
  React.useEffect(() => {
    // Only auto-refresh, don't set loading to true on mount
    const interval = setInterval(() => {
      fetchChats();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAdminImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReplyImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendAdminReply = async (userId) => {
    if (!replyText.trim() && !replyImage) return;

    try {
      await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: { from: "admin", text: replyText, image: replyImage },
          consent: true,
        }),
      });
      setReplyText("");
      setReplyImage(null);
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

  const restoreFromArchive = async (userId) => {
    try {
      const response = await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          restoreFromArchive: true,
          consent: true,
        }),
      });

      if (response.ok) {
        alert("Chat restored from archive successfully!");
        fetchChats();
      } else {
        alert("Failed to restore chat from archive. Please try again.");
      }
    } catch (error) {
      console.error("Failed to restore chat from archive:", error);
      alert("Failed to restore chat from archive. Please try again.");
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

  // Enhanced filtering logic
  const filteredChats = chats
    .filter((chat) => {
      // Filter by tab
      if (activeTab === "active" && (chat.archived || chat.deleted))
        return false;
      if (activeTab === "archive" && !chat.archived) return false;
      if (activeTab === "trash" && !chat.deleted) return false;

      // Enhanced filters
      const matchesLandingPage =
        !landingPageFilter || chat.landingPage === landingPageFilter;
      const matchesSource = !sourceFilter || chat.sourceType === sourceFilter;
      const matchesVariant =
        !variantFilter || chat.landingPageVariant === variantFilter;
      const matchesSearch =
        !searchTerm ||
        chat.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (chat.messages &&
          chat.messages.some((msg) =>
            msg.text.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      return (
        matchesLandingPage && matchesSource && matchesVariant && matchesSearch
      );
    })
    .sort((a, b) => {
      // Sort by most recent first (updatedAt or createdAt)
      const dateA = new Date(a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || 0);
      return dateB - dateA;
    });

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
          <h1 style={{ color: "#400006", margin: 0, fontSize: "1rem" }}>
            💬 Chat Management
          </h1>
          <div
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "4px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span
              style={{
                fontSize: "1rem",
                color: soundEnabled ? "#400006" : "#ccc",
              }}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </span>
            <div
              style={{
                width: "24px",
                height: "12px",
                background: soundEnabled ? "#400006" : "#ccc",
                borderRadius: "6px",
                position: "relative",
                transition: "background 0.2s",
                marginTop: "2px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  background: "white",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "2px",
                  left: soundEnabled ? "14px" : "2px",
                  transition: "left 0.2s",
                }}
              />
            </div>
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
            New ({chats.filter((c) => !c.archived && !c.deleted).length})
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

        {/* Analytics Dashboard */}
        <div
          style={{
            background: "#fff6f9",
            borderRadius: "6px",
            padding: "8px",
            marginBottom: "8px",
            border: "1px solid #e6d3b3",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div style={{ minWidth: "60px", textAlign: "center" }}>
              <div
                style={{ fontSize: "0.6rem", color: "#666", fontWeight: "500" }}
              >
                Total
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#400006",
                }}
              >
                {chats.length}
              </div>
            </div>
            <div style={{ minWidth: "60px", textAlign: "center" }}>
              <div
                style={{ fontSize: "0.6rem", color: "#666", fontWeight: "500" }}
              >
                Today
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#400006",
                }}
              >
                {
                  chats.filter((c) => {
                    const today = new Date();
                    const chatDate = new Date(c.createdAt);
                    return chatDate.toDateString() === today.toDateString();
                  }).length
                }
              </div>
            </div>
            <div style={{ minWidth: "60px", textAlign: "center" }}>
              <div
                style={{ fontSize: "0.6rem", color: "#666", fontWeight: "500" }}
              >
                Source
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#400006",
                }}
              >
                {(() => {
                  const sources = chats.map((c) => c.sourceType || "web");
                  const sourceCount = {};
                  sources.forEach(
                    (s) => (sourceCount[s] = (sourceCount[s] || 0) + 1)
                  );
                  const topSource = Object.entries(sourceCount).sort(
                    (a, b) => b[1] - a[1]
                  )[0];
                  return topSource ? topSource[0] : "N/A";
                })()}
              </div>
            </div>
            <div style={{ minWidth: "60px", textAlign: "center" }}>
              <div
                style={{ fontSize: "0.6rem", color: "#666", fontWeight: "500" }}
              >
                Variant
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#400006",
                }}
              >
                {(() => {
                  const variants = chats.map(
                    (c) => c.landingPageVariant || "A"
                  );
                  const variantCount = {};
                  variants.forEach(
                    (v) => (variantCount[v] = (variantCount[v] || 0) + 1)
                  );
                  const topVariant = Object.entries(variantCount).sort(
                    (a, b) => b[1] - a[1]
                  )[0];
                  return topVariant ? `${topVariant[0]}` : "N/A";
                })()}
              </div>
            </div>
          </div>
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
          <div>
            <label style={{ marginRight: "0.5rem" }}>Filter by Variant: </label>
            <select
              value={variantFilter}
              onChange={(e) => setVariantFilter(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #e6d3b3",
              }}
            >
              {variantOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 12, position: "relative" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search chats..."
            style={{
              width: "100%",
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              border: "1px solid #e6d3b3",
              fontSize: "1rem",
              background: "#fff6f9",
              color: "#400006",
              paddingLeft: "2.5rem",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#999",
              fontSize: "1rem",
            }}
          >
            🔍
          </span>
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
          {loading ? (
            <div
              style={{
                color: "#400006",
                textAlign: "center",
                padding: "2rem",
                fontSize: "1.1rem",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>🔄 Loading chats...</div>
              <div style={{ fontSize: "0.9rem", color: "#666" }}>
                Fetching latest conversations...
              </div>
            </div>
          ) : chats.length === 0 ? (
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
            filteredChats.map((chat, idx) => (
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
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>
                      User: {chat.userId ? chat.userId.slice(0, 8) : "Guest"}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "#888",
                        fontWeight: "normal",
                      }}
                    >
                      {chat.updatedAt
                        ? new Date(chat.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : chat.createdAt
                        ? new Date(chat.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : ""}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "#888",
                        fontWeight: "normal",
                      }}
                    >
                      • {chat.adSource || "Unknown"}
                    </span>
                  </div>
                </div>

                <div style={{ margin: "8px 0", fontSize: "0.9rem" }}>
                  {chat.messages && chat.messages.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      {chat.messages.slice(-2).map((msg, idx) => (
                        <div
                          key={idx}
                          style={{
                            color: "#400006",
                            opacity: idx === chat.messages.length - 1 ? 1 : 0.7,
                            fontSize:
                              idx === chat.messages.length - 1
                                ? "0.9rem"
                                : "0.8rem",
                          }}
                        >
                          <span style={{ fontWeight: "500" }}>
                            {msg.from === "user"
                              ? "👤"
                              : msg.from === "admin"
                              ? "👤"
                              : "🤖"}
                          </span>{" "}
                          {msg.text.length > 60
                            ? msg.text.slice(0, 60) + "..."
                            : msg.text}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: "#400006" }}>No messages yet</span>
                  )}
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
                        onClick={() => handleDelete(chat.userId)}
                      >
                        Move to Trash
                      </button>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#400006",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          padding: 0,
                          marginRight: 12,
                          textDecoration: "underline",
                        }}
                        onClick={() => restoreFromArchive(chat.userId)}
                      >
                        Restore
                      </button>
                    </>
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
                    {/* Quick Reply Buttons */}
                    <div
                      style={{
                        marginBottom: "8px",
                        display: "flex",
                        gap: "4px",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() =>
                          setReplyText(
                            "Hi! Thanks for reaching out. How can I help you today?"
                          )
                        }
                        style={{
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                          background: "#e6d3b3",
                          color: "#400006",
                          border: "1px solid #d1c0a0",
                          cursor: "pointer",
                          fontSize: "0.7rem",
                        }}
                      >
                        👋 Greeting
                      </button>
                      <button
                        onClick={() =>
                          setReplyText(
                            "Great question! Let me get back to you with more details."
                          )
                        }
                        style={{
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                          background: "#e6d3b3",
                          color: "#400006",
                          border: "1px solid #d1c0a0",
                          cursor: "pointer",
                          fontSize: "0.7rem",
                        }}
                      >
                        🤔 Follow up
                      </button>
                      <button
                        onClick={() =>
                          setReplyText(
                            "Perfect! I'll send you our pricing and availability."
                          )
                        }
                        style={{
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                          background: "#e6d3b3",
                          color: "#400006",
                          border: "1px solid #d1c0a0",
                          cursor: "pointer",
                          fontSize: "0.7rem",
                        }}
                      >
                        💰 Pricing
                      </button>
                      <button
                        onClick={() =>
                          setReplyText(
                            "Thanks! I'll schedule your appointment right away."
                          )
                        }
                        style={{
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                          background: "#e6d3b3",
                          color: "#400006",
                          border: "1px solid #d1c0a0",
                          cursor: "pointer",
                          fontSize: "0.7rem",
                        }}
                      >
                        📅 Book
                      </button>
                    </div>

                    {replyImage && (
                      <div
                        style={{
                          padding: "8px",
                          background: "#f0f0f0",
                          borderRadius: "4px",
                          marginBottom: "8px",
                          position: "relative",
                        }}
                      >
                        <img
                          src={replyImage}
                          alt="Selected"
                          style={{
                            maxWidth: "150px",
                            maxHeight: "100px",
                            borderRadius: "4px",
                          }}
                        />
                        <button
                          onClick={() => setReplyImage(null)}
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            background: "#ff4444",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply or use quick replies above..."
                      style={{
                        width: "100%",
                        minHeight: "60px",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #e6d3b3",
                        resize: "vertical",
                        fontSize: "0.9rem",
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
                        alignItems: "center",
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
                          fontSize: "0.9rem",
                        }}
                      >
                        💬 Send Reply
                      </button>
                      <label
                        style={{
                          cursor: "pointer",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "4px",
                          background: "#e6d3b3",
                          color: "#400006",
                          border: "1px solid #d1c0a0",
                          fontSize: "0.9rem",
                        }}
                      >
                        📷 Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAdminImageUpload}
                          style={{ display: "none" }}
                        />
                      </label>
                      <button
                        onClick={() => {
                          setReplyText("");
                          setReplyImage(null);
                          setReplyingTo(null);
                        }}
                        style={{
                          padding: "0.4rem 1rem",
                          borderRadius: "4px",
                          background: "#666",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        ❌ Cancel
                      </button>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#666",
                          marginLeft: "auto",
                        }}
                      >
                        💡 Tip: Press Enter to send, Shift+Enter for new line
                      </span>
                    </div>
                  </div>
                )}

                {expanded === chat.userId && (
                  <ChatDetail userId={chat.userId} />
                )}

                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#666",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ marginRight: "8px" }}>
                    📍 {chat.landingPage || "Unknown"}
                  </span>
                  <span style={{ marginRight: "8px" }}>
                    🎯 {chat.sourceType || "web"}
                  </span>
                  <span style={{ marginRight: "8px" }}>
                    {chat.landingPageVariant
                      ? `📊 Variant ${chat.landingPageVariant}`
                      : ""}
                  </span>
                  {chat.utmCampaign && (
                    <span style={{ marginRight: "8px" }}>
                      📢 {chat.utmCampaign}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
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
                    alignSelf: msg.from === "user" ? "flex-start" : "flex-end",
                    marginLeft: msg.from === "user" ? 0 : "auto",
                    marginRight: msg.from === "user" ? "auto" : 0,
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
                      ? "👤 Admin"
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
