import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "YOUR_MONGODB_URI_HERE";
const dbName = "tattooLanding";
const collectionName = "chats";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Testing MongoDB connection...");
    console.log("URI:", uri);

    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Count total documents
    const totalChats = await collection.countDocuments();

    // Get recent chats
    const recentChats = await collection
      .find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .toArray();

    client.close();

    res.status(200).json({
      success: true,
      totalChats,
      recentChats: recentChats.map((chat) => ({
        userId: chat.userId,
        messageCount: chat.messages ? chat.messages.length : 0,
        updatedAt: chat.updatedAt,
        landingPage: chat.landingPage,
      })),
    });
  } catch (err) {
    console.error("MongoDB test failed:", err);
    res.status(500).json({
      error: "MongoDB connection failed",
      details: err.message,
      uri: uri,
    });
  }
}
