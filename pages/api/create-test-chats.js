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

    // Create test chats with A/B testing data
    const testChats = [
      {
        userId: "user_google_ads_variant_a",
        userName: "Sarah M.",
        email: "sarah@example.com",
        phone: "555-0101",
        landingPage: "/",
        landingPageVariant: "A",
        sourceType: "google",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "fine_line_tattoos",
        utmContent: "variant_a",
        utmTerm: "tattoo artist",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        referrer: "https://www.google.com/search?q=fine+line+tattoo+artist",
        ip: "192.168.1.100",
        consent: true,
        messages: [
          {
            from: "user",
            text: "Hi! I'm looking for a fine line tattoo artist. Do you have any availability this week?",
            createdAt: new Date(Date.now() - 3600000),
          },
          {
            from: "bot",
            text: "Hello! 😊 We'd love to help you with your fine line tattoo! Our artists specialize in delicate, detailed work. What kind of design are you thinking about?",
            createdAt: new Date(Date.now() - 3500000),
          },
          {
            from: "user",
            text: "I want a small flower design on my wrist. How much would that cost?",
            createdAt: new Date(Date.now() - 3400000),
          },
          {
            from: "bot",
            text: "Perfect! Fine line flower tattoos typically start at $80-120 depending on size and detail. We have availability this Thursday and Friday. Would you like to see some examples?",
            createdAt: new Date(Date.now() - 3300000),
          },
        ],
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3300000),
      },
      {
        userId: "user_facebook_ads_variant_b",
        userName: "Mike R.",
        email: "mike@example.com",
        phone: "555-0202",
        landingPage: "/",
        landingPageVariant: "B",
        sourceType: "facebook",
        utmSource: "facebook",
        utmMedium: "social",
        utmCampaign: "summer_tattoo_special",
        utmContent: "variant_b",
        utmTerm: null,
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        referrer: "https://www.facebook.com/ads/click",
        ip: "192.168.1.101",
        consent: true,
        messages: [
          {
            from: "user",
            text: "I saw your ad about the summer tattoo special. What's included?",
            createdAt: new Date(Date.now() - 7200000),
          },
          {
            from: "bot",
            text: "Great question! Our summer special includes 15% off all fine line tattoos and a free consultation. We're running this until August 31st. What style are you interested in?",
            createdAt: new Date(Date.now() - 7100000),
          },
          {
            from: "user",
            text: "I'm thinking about a minimalist design. Do you have examples?",
            createdAt: new Date(Date.now() - 7000000),
          },
          {
            from: "bot",
            text: "Absolutely! We have a great portfolio of minimalist designs. Would you like to see some examples? We can also do custom designs based on your ideas.",
            createdAt: new Date(Date.now() - 6900000),
          },
        ],
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 6900000),
      },
      {
        userId: "user_instagram_organic_variant_c",
        userName: "Emma L.",
        email: "emma@example.com",
        phone: "555-0303",
        landingPage: "/",
        landingPageVariant: "C",
        sourceType: "instagram",
        utmSource: "instagram",
        utmMedium: "social",
        utmCampaign: "organic_traffic",
        utmContent: "variant_c",
        utmTerm: null,
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
        referrer: "https://www.instagram.com/p/example",
        ip: "192.168.1.102",
        consent: true,
        messages: [
          {
            from: "user",
            text: "I love your work! I saw your Instagram post about the butterfly tattoo. Is that still available?",
            createdAt: new Date(Date.now() - 10800000),
          },
          {
            from: "bot",
            text: "Thank you! 🦋 Yes, that butterfly design is still available and it's one of our most popular pieces. It's perfect for a delicate, feminine look. Would you like to book a consultation?",
            createdAt: new Date(Date.now() - 10700000),
          },
          {
            from: "user",
            text: "Yes, I'd love to! What are your rates for that design?",
            createdAt: new Date(Date.now() - 10600000),
          },
          {
            from: "bot",
            text: "The butterfly design starts at $120 and takes about 1-1.5 hours. We have availability next week. Would you like to see our calendar?",
            createdAt: new Date(Date.now() - 10500000),
          },
        ],
        createdAt: new Date(Date.now() - 10800000),
        updatedAt: new Date(Date.now() - 10500000),
      },
      {
        userId: "user_direct_traffic_variant_a",
        userName: "Alex K.",
        email: "alex@example.com",
        phone: "555-0404",
        landingPage: "/",
        landingPageVariant: "A",
        sourceType: "web",
        utmSource: null,
        utmMedium: null,
        utmCampaign: null,
        utmContent: null,
        utmTerm: null,
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        referrer: null,
        ip: "192.168.1.103",
        consent: true,
        messages: [
          {
            from: "user",
            text: "Hi there! I'm interested in getting a tattoo. What's your process like?",
            createdAt: new Date(Date.now() - 14400000),
          },
          {
            from: "bot",
            text: "Hello! 👋 Our process is simple: consultation, design approval, and then your tattoo session. We specialize in fine line work and take pride in creating beautiful, lasting pieces. What kind of design are you thinking about?",
            createdAt: new Date(Date.now() - 14300000),
          },
          {
            from: "user",
            text: "I want something small and meaningful. Maybe a heart or star?",
            createdAt: new Date(Date.now() - 14200000),
          },
          {
            from: "bot",
            text: "Perfect! We have some beautiful minimalist heart and star designs. These typically start at $80 and take about 30-45 minutes. Would you like to see some examples?",
            createdAt: new Date(Date.now() - 14100000),
          },
        ],
        createdAt: new Date(Date.now() - 14400000),
        updatedAt: new Date(Date.now() - 14100000),
      },
    ];

    // Insert test chats
    for (const chat of testChats) {
      await collection.insertOne(chat);
    }

    client.close();
    res.status(200).json({
      success: true,
      message: `Created ${testChats.length} test chats with A/B testing data`,
      chats: testChats.map((c) => ({
        userId: c.userId,
        variant: c.landingPageVariant,
        source: c.sourceType,
      })),
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to create test chats",
      details: err.message,
    });
  }
}
