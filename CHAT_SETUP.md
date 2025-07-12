# Chat System Setup Guide

## **Quick Setup Steps:**

### 1. **MongoDB Setup**

• Create a MongoDB database (local or Atlas)
• Get your connection string
• Create `.env.local` file in project root:

```
MONGODB_URI=your_mongodb_connection_string_here
```

### 2. **Database Structure**

The system will automatically create:
• Database: `tattooLanding`
• Collection: `chats`

### 3. **Test the System**

• Start your Next.js app: `npm run dev`
• Visit your landing page and chat with the bot
• Check admin panel: `http://localhost:3000/admin/chats`

## **What's Fixed:**

✅ **Unique User IDs** - Each visitor gets a unique ID stored in localStorage
✅ **Message Storage** - All chat messages saved to MongoDB
✅ **Landing Page Tracking** - Knows which page user came from
✅ **Admin Interface** - View all chats, reply to users, filter by page
✅ **Better UX** - Improved admin layout with emojis and better styling

## **Admin Features:**

• View all chat conversations
• Filter by landing page
• Reply to users directly
• See full conversation history
• Real-time message updates

## **Troubleshooting:**

• If no chats appear, check your MongoDB connection
• Make sure `.env.local` has correct MONGODB_URI
• Check browser console for errors
