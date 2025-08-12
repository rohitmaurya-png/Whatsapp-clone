# WhatsApp Web Clone

A full-stack WhatsApp Web clone built with Next.js, MongoDB, and Socket.IO that processes WhatsApp Business API webhook data and provides a real-time chat interface.

## Features

- 📱 **WhatsApp Web-like Interface**: Responsive design that closely mimics the original WhatsApp Web
- 🔄 **Real-time Messaging**: Live updates using WebSocket connections
- 📨 **Webhook Processing**: Handles WhatsApp Business API webhook payloads
- 💾 **Message Storage**: Persistent storage with MongoDB
- 📊 **Status Tracking**: Message status indicators (sent, delivered, read)
- 📱 **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas
- **Real-time**: Socket.IO
- **Deployment**: Ready for Vercel, Heroku, or any hosting platform

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd whatsapp-chat
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Update the following variables in `.env.local`:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `WEBHOOK_VERIFY_TOKEN`: Token for webhook verification
- `NEXTAUTH_SECRET`: Secret for NextAuth (generate a random string)

### 3. MongoDB Setup

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

### 4. Initialize Sample Data

```bash
npm run process-payloads
```

This will create sample conversations and messages for demonstration.

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
whatsapp-chat/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── webhook/       # WhatsApp webhook endpoint
│   │   ├── conversations/ # Get conversations
│   │   └── messages/      # Message operations
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Main chat interface
├── components/            # React components
│   ├── ConversationList.js
│   └── ChatArea.js
├── lib/                   # Utility libraries
│   ├── mongodb.js         # MongoDB connection
│   ├── messageProcessor.js # Webhook processing logic
│   └── utils.js           # Helper functions
├── pages/api/             # Legacy API routes (for Socket.IO)
│   └── socket.js          # Socket.IO configuration
├── scripts/               # Utility scripts
│   └── processPayloads.js # Process webhook payloads
└── public/                # Static assets
```

## API Endpoints

### Webhook Processing
- `POST /api/webhook` - Process WhatsApp webhook payloads
- `GET /api/webhook` - Webhook verification

### Chat Operations
- `GET /api/conversations` - Fetch all conversations
- `GET /api/messages/[wa_id]` - Fetch messages for a conversation
- `POST /api/messages/[wa_id]` - Send a new message

## Database Schema

### Collection: `processed_messages`

```javascript
{
  id: String,              // Message ID
  wa_id: String,           // WhatsApp ID
  from: String,            // Sender
  timestamp: Date,         // Message timestamp
  type: String,            // Message type (text, image, etc.)
  text: String,            // Message content
  contact_name: String,    // Contact display name
  status: String,          // sent, delivered, read
  direction: String,       // incoming, outgoing
  created_at: Date,        // Database creation time
  updated_at: Date         // Last update time
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp
WEBHOOK_VERIFY_TOKEN=your_production_token
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.com
```

## Features Implemented

✅ **Task 1: Webhook Payload Processor**
- MongoDB integration with `whatsapp.processed_messages` collection
- Message processing from webhook payloads
- Status update handling (sent, delivered, read)

✅ **Task 2: WhatsApp Web Interface**
- Responsive design matching WhatsApp Web
- Conversation list with user grouping
- Message bubbles with timestamps
- Status indicators
- Mobile-friendly layout

✅ **Task 3: Send Message Demo**
- Message input interface
- Real-time UI updates
- Database storage
- No external message sending (demo only)

✅ **Task 4: Deployment Ready**
- Configured for Vercel deployment
- Environment variable setup
- Production-ready MongoDB connection

✅ **Bonus: Real-time Interface**
- Socket.IO integration
- Live message updates
- Real-time status updates
