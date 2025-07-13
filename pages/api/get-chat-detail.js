import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "YOUR_MONGODB_URI_HERE";
const dbName = "tattooLanding";
const collectionName = "chats";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const chat = await collection.findOne({ userId });
    client.close();
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(200).json({ 
      messages: chat.messages || [],
      botPausedUntil: chat.botPausedUntil || null
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch chat detail", details: err.message });
  }
}
