import { useState } from "react";

export default function AdminChats() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [chats, setChats] = useState([]);
  const [business, setBusiness] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    setLoading(true);
    const res = await fetch(`/api/get-chats?business=${business}`);
    const data = await res.json();
    setChats(data.chats || []);
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") setAuthed(true);
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "2rem auto",
        fontFamily: "Montserrat, Arial, sans-serif",
      }}
    >
      {!authed ? (
        <form
          onSubmit={handleLogin}
          style={{ textAlign: "center", marginTop: "5rem" }}
        >
          <h2>Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "0.7rem",
              fontSize: "1.1rem",
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              marginLeft: 12,
              padding: "0.7rem 1.5rem",
              fontSize: "1.1rem",
              borderRadius: 8,
              background: "#a3bffa",
              border: "none",
              color: "#232323",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      ) : (
        <div>
          <h2>Chats (Text Message View)</h2>
          <div style={{ marginBottom: 16 }}>
            <label>Filter by business: </label>
            <select
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            >
              <option value="all">All</option>
              <option value="tattoo">Tattoo</option>
              <option value="spraytan">Spray Tan</option>
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
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent:
                      chat.from === "bot" ? "flex-start" : "flex-end",
                    margin: "8px 0",
                  }}
                >
                  <div
                    style={{
                      background: chat.from === "bot" ? "#fff" : "#a3bffa",
                      color: chat.from === "bot" ? "#232323" : "#232323",
                      borderRadius: 16,
                      padding: "10px 16px",
                      maxWidth: "75%",
                      fontSize: "1rem",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{chat.text}</div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#888",
                        marginTop: 4,
                      }}
                    >
                      {chat.createdAt
                        ? new Date(chat.createdAt).toLocaleString()
                        : ""}
                    </div>
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
