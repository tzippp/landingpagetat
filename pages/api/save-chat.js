import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "YOUR_MONGODB_URI_HERE";
const dbName = "tattooLanding";
const collectionName = "chats";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const {
    userId,
    message,
    userName,
    email,
    phone,
    landingPage,
    consent,
    archive,
    delete: deleteChat,
  } = req.body;
  if (!userId || (!message && !archive && !deleteChat) || !consent) {
    return res
      .status(400)
      .json({
        error:
          "userId, message, and consent are required (unless archiving or deleting)",
      });
  }
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    if (deleteChat) {
      await collection.deleteOne({ userId });
      client.close();
      return res.status(200).json({ success: true, deleted: true });
    }
    if (archive) {
      await collection.updateOne(
        { userId },
        { $set: { archived: true, updatedAt: new Date() } }
      );
      client.close();
      return res.status(200).json({ success: true, archived: true });
    }
    // Try to find an existing chat session for this user
    const existing = await collection.findOne({ userId });
    if (existing) {
      // Update the session: append message, update info if provided
      await collection.updateOne(
        { userId },
        {
          $push: { messages: { ...message, createdAt: new Date() } },
          $set: {
            userName: userName || existing.userName,
            email: email || existing.email,
            phone: phone || existing.phone,
            landingPage: landingPage || existing.landingPage,
            consent: true,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      // Create a new session
      await collection.insertOne({
        userId,
        userName: userName || null,
        email: email || null,
        phone: phone || null,
        landingPage: landingPage || null,
        consent: true,
        messages: [{ ...message, createdAt: new Date() }],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    client.close();
    res.status(200).json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to save chat", details: err.message });
  }
}
