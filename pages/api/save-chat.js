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
    restore,
    restoreFromArchive,
    permanentDelete,
  } = req.body;

  // Enhanced data collection
  const userAgent = req.headers["user-agent"] || "";
  const referrer = req.headers["referer"] || "";
  const ip =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress || "";

  // Extract campaign data from URL parameters
  const url = new URL(req.headers["referer"] || "http://localhost");
  const utmSource = url.searchParams.get("utm_source");
  const utmMedium = url.searchParams.get("utm_medium");
  const utmCampaign = url.searchParams.get("utm_campaign");
  const utmContent = url.searchParams.get("utm_content");
  const utmTerm = url.searchParams.get("utm_term");

  // Determine landing page variant (A/B testing)
  const landingPageVariant = url.searchParams.get("variant") || "A";

  // Determine source type
  let sourceType = "web";
  if (utmSource) {
    if (utmSource.includes("google")) sourceType = "google";
    else if (utmSource.includes("facebook") || utmSource.includes("fb"))
      sourceType = "facebook";
    else if (utmSource.includes("instagram") || utmSource.includes("ig"))
      sourceType = "instagram";
    else if (utmSource.includes("tiktok")) sourceType = "tiktok";
    else sourceType = utmSource;
  } else if (referrer) {
    if (referrer.includes("google.com")) sourceType = "google";
    else if (referrer.includes("facebook.com") || referrer.includes("fb.com"))
      sourceType = "facebook";
    else if (referrer.includes("instagram.com")) sourceType = "instagram";
    else if (referrer.includes("tiktok.com")) sourceType = "tiktok";
    else sourceType = "referral";
  }

  if (
    !userId ||
    (!message &&
      !archive &&
      !deleteChat &&
      !restore &&
      !restoreFromArchive &&
      !permanentDelete) ||
    !consent
  ) {
    return res.status(400).json({
      error:
        "userId, message, and consent are required (unless archiving, deleting, restoring, restoring from archive, or permanently deleting)",
    });
  }
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    if (permanentDelete) {
      await collection.deleteOne({ userId });
      client.close();
      return res.status(200).json({ success: true, permanentlyDeleted: true });
    }
    if (restore) {
      await collection.updateOne(
        { userId },
        {
          $unset: { deleted: "", deletedAt: "" },
          $set: { updatedAt: new Date() },
        }
      );
      client.close();
      return res.status(200).json({ success: true, restored: true });
    }
    if (restoreFromArchive) {
      await collection.updateOne(
        { userId },
        {
          $unset: { archived: "" },
          $set: { updatedAt: new Date() },
        }
      );
      client.close();
      return res.status(200).json({ success: true, restoredFromArchive: true });
    }
    if (deleteChat) {
      await collection.updateOne(
        { userId },
        {
          $set: { deleted: true, deletedAt: new Date(), updatedAt: new Date() },
        }
      );
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
            landingPageVariant:
              landingPageVariant || existing.landingPageVariant,
            sourceType: sourceType || existing.sourceType,
            utmSource: utmSource || existing.utmSource,
            utmMedium: utmMedium || existing.utmMedium,
            utmCampaign: utmCampaign || existing.utmCampaign,
            utmContent: utmContent || existing.utmContent,
            utmTerm: utmTerm || existing.utmTerm,
            userAgent: userAgent || existing.userAgent,
            referrer: referrer || existing.referrer,
            ip: ip || existing.ip,
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
        landingPageVariant: landingPageVariant || "A",
        sourceType: sourceType || "web",
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        utmContent: utmContent || null,
        utmTerm: utmTerm || null,
        userAgent: userAgent || null,
        referrer: referrer || null,
        ip: ip || null,
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
