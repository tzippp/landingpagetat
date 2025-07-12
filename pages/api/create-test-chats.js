import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "YOUR_MONGODB_URI_HERE";
const dbName = "tattooLanding";
const collectionName = "chats";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Create test chat data
    const testChats = [
      {
        userId: "test-user-1",
        userName: "John Doe",
        email: "john@example.com",
        phone: "555-1234",
        landingPage: "/",
        adSource: "google",
        consent: true,
        messages: [
          {
            from: "user",
            text: "Hi! I'm interested in getting a tattoo. What services do you offer?",
            createdAt: new Date(Date.now() - 3600000), // 1 hour ago
          },
          {
            from: "bot",
            text: "Hello! We offer a variety of tattoo services including custom designs, traditional tattoos, and fine line work. What type of tattoo are you looking for?",
            createdAt: new Date(Date.now() - 3500000), // 58 minutes ago
          },
          {
            from: "user",
            text: "I want a small flower tattoo on my wrist. How much would that cost?",
            createdAt: new Date(Date.now() - 3400000), // 56 minutes ago
          },
        ],
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3400000),
      },
      {
        userId: "test-user-2",
        userName: "Jane Smith",
        email: "jane@example.com",
        phone: "555-5678",
        landingPage: "/spray-tan-a",
        adSource: "facebook",
        consent: true,
        messages: [
          {
            from: "user",
            text: "Do you offer spray tanning services?",
            createdAt: new Date(Date.now() - 7200000), // 2 hours ago
          },
          {
            from: "bot",
            text: "Yes! We offer professional spray tanning services. Our sessions typically last 5-7 days and we use premium solutions.",
            createdAt: new Date(Date.now() - 7100000), // 1 hour 58 minutes ago
          },
        ],
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7100000),
      },
      {
        userId: "test-user-3",
        userName: "Mike Johnson",
        email: "mike@example.com",
        phone: "555-9012",
        landingPage: "/pmu-brows-a",
        adSource: "instagram",
        consent: true,
        messages: [
          {
            from: "user",
            text: "I'm interested in permanent makeup for my eyebrows. What's the process like?",
            createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
          },
        ],
        createdAt: new Date(Date.now() - 1800000),
        updatedAt: new Date(Date.now() - 1800000),
      },
      {
        userId: "test-user-4",
        userName: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "555-3456",
        landingPage: "/smp-a",
        adSource: "web",
        consent: true,
        messages: [
          {
            from: "user",
            text: "Can you tell me more about scalp micropigmentation?",
            createdAt: new Date(Date.now() - 900000), // 15 minutes ago
          },
          {
            from: "bot",
            text: "Scalp micropigmentation is a non-surgical hair loss solution that creates the appearance of a full head of hair using micro-pigments.",
            createdAt: new Date(Date.now() - 800000), // 13 minutes ago
          },
        ],
        createdAt: new Date(Date.now() - 900000),
        updatedAt: new Date(Date.now() - 800000),
      },
    ];

    // Insert test chats
    for (const chat of testChats) {
      await collection.insertOne(chat);
    }

    client.close();
    res.status(200).json({
      success: true,
      message: "Test chats created successfully",
      count: testChats.length,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to create test chats",
      details: err.message,
    });
  }
}
