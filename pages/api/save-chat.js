import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "YOUR_MONGODB_URI_HERE";
const dbName = "tattooLanding";
const collectionName = "chats";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.insertOne({ ...message, createdAt: new Date() });
    client.close();
    res.status(200).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to save message", details: err.message });
  }
}
