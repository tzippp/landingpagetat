import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "YOUR_MONGODB_URI_HERE";
const dbName = "tattooLanding";
const collectionName = "chats";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { business } = req.query;
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    let query = {};
    if (business && business !== "all") {
      query.business = business;
    }
    const chats = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();
    client.close();
    res.status(200).json({ chats });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch chats", details: err.message });
  }
}
