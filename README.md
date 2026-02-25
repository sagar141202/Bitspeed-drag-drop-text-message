# BiteSpeed - Full Stack Implementation

A full-stack application consisting of:
1. **Chatbot Flow Builder** (Frontend) - Visual flow editor for building chatbot conversation flows
2. **Identity Reconciliation API** (Backend) - Contact identification and linking service

---

## 🚀 Chatbot Flow Builder (Frontend)

A powerful visual flow builder built with React Flow for creating chatbot conversation flows.

### Features Implemented

✅ **Drag & Drop** - Drag message nodes from the sidebar to the canvas  
✅ **Edge Connections** - Connect nodes with smooth animated edges  
✅ **Node Selection** - Click any node to edit its properties  
✅ **Settings Panel** - Replaces Nodes Panel when node is selected  
✅ **Text Editing** - Edit message text directly in the settings panel  
✅ **Source Handle Restriction** - Only one edge allowed from source handle  
✅ **Save Validation** - Validates flow for disconnected nodes before saving  
✅ **Extensible Design** - Easy to add new node types in the future  
✅ **Professional UI** - MiniMap, Controls, and Background grid  

### Architecture

```
chatbot-flow/src/
├── components/
│   ├── nodes/
│   │   └── TextNode.jsx       # Custom Text Message Node
│   ├── NodesPanel.jsx        # Sidebar with draggable nodes
│   ├── SettingsPanel.jsx     # Node editing panel
│   └── SaveButton.jsx        # Save with validation
├── store/
│   └── flowStore.js           # Zustand state management
├── utils/
│   └── validation.js          # Flow validation utilities
├── App.jsx                    # Main application
└── main.jsx                   # Entry point
```

### How Validation Works

The save button validates the flow with these rules:
1. If no nodes exist → Error: "No nodes in the flow to save"
2. If only 1 node → Valid (single node is OK)
3. If more than 1 node → Check that NOT MORE THAN ONE node has an empty target handle
   - This means it's OK to have one starting node (disconnected target)
   - But multiple disconnected nodes will show an error

### Tech Stack
- **React** with Vite
- **React Flow** - Flow diagram library
- **Zustand** - State management
- **UUID** - Unique ID generation

---

## 🔗 Identity Reconciliation API (Backend)

A REST API for identifying and linking contacts based on email and phone number.

### Features Implemented

✅ **POST /identify** - Identify or create contacts  
✅ **Email & Phone Matching** - Find contacts by email or phone  
✅ **Contact Linking** - Link related contacts together  
✅ **Primary/Secondary Hierarchy** - Proper contact hierarchy management  
✅ **Consolidated Response** - Returns all related contact information  

### API Endpoint

```
POST /api/identify
Content-Type: application/json

{
  "email": "john@example.com",
  "phoneNumber": "+1234567890"
}
```

### Response Format

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["john@example.com", "jane@example.com"],
    "phoneNumbers": ["+1234567890"],
    "secondaryContactIds": [2, 3]
  }
}
```

### Tech Stack
- **Node.js** with Express
- **TypeScript**
- **Prisma** ORM
- **PostgreSQL** Database

### Database Schema

```prisma
model Contact {
  id           Int       @id @default(autoincrement())
  email        String?   @unique
  phoneNumber  String?   @unique
  linkedId     Int?      // Reference to primary contact
  linkPrecedence String  // "primary" or "secondary"
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  @@index([linkedId])
  @@index([linkPrecedence])
}
```

---

## 🛠️ Installation & Setup

### Frontend

```bash
cd chatbot-flow
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Backend

```bash
cd bitespeed-api
npm install

# Set up PostgreSQL and update .env
# DATABASE_URL=postgresql://user:password@localhost:5432/bitespeed

# Run migrations
npx prisma migrate dev

# Start server
npm run dev
```

The API will be available at `http://localhost:3000`

---

## 📦 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import repository in Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

### Backend (Render/Railway)

1. Push code to GitHub
2. Create new Web Service
3. Configure environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
4. Deploy

---

## 📝 License

MIT License

