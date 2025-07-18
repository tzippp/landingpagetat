import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "YOUR_MONGODB_URI_HERE";
const dbName = "tattooLanding";
const collectionName = "chats";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { landingPage } = req.query;
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // For admin panel, get ALL chats and let the frontend handle filtering
    let query = {};
    if (landingPage && landingPage !== "all") {
      query.landingPage = landingPage;
    }

    // Fetch all chat sessions (one per user)
    const chats = await collection
      .find(query)
      .sort({ updatedAt: -1 })
      .limit(200)
      .toArray();

    // For admin listing: show userId, latest message, and all relevant fields
    const chatSummaries = chats.map((chat) => ({
      userId: chat.userId,
      latestMessage:
        Array.isArray(chat.messages) && chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1]
          : null,
      messages: chat.messages || [],
      updatedAt: chat.updatedAt,
      createdAt: chat.createdAt,
      landingPage: chat.landingPage || null,
      landingPageVariant: chat.landingPageVariant || "A",
      sourceType: chat.sourceType || "web",
      utmSource: chat.utmSource || null,
      utmMedium: chat.utmMedium || null,
      utmCampaign: chat.utmCampaign || null,
      utmContent: chat.utmContent || null,
      utmTerm: chat.utmTerm || null,
      userAgent: chat.userAgent || null,
      referrer: chat.referrer || null,
      ip: chat.ip || null,
      adSource: chat.adSource || null,
      archived: chat.archived || false,
      deleted: chat.deleted || false,
      userName: chat.userName || null,
      email: chat.email || null,
      phone: chat.phone || null,
    }));

    client.close();
    res.status(200).json({ chats: chatSummaries });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch chats", details: err.message });
  }
}
