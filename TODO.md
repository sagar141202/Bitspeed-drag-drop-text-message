# BiteSpeed Full Stack Task Plan

## Project Structure
```
/Users/sagarmaddi/Desktop/Bitspeed
├── chatbot-flow/          # Frontend - Chatbot Flow Builder
│   ├── src/
│   │   ├── components/
│   │   │   ├── nodes/
│   │   │   │   └── TextNode.jsx
│   │   │   ├── NodesPanel.jsx
│   │   │   ├── SettingsPanel.jsx
│   │   │   └── SaveButton.jsx
│   │   ├── store/
│   │   │   └── flowStore.js
│   │   ├── utils/
│   │   │   └── validation.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── bitespeed-api/         # Backend - Identity Reconciliation
    ├── src/
    │   ├── controllers/
    │   │   └── identifyController.ts
    │   ├── services/
    │   │   └── contactService.ts
    │   ├── prisma/
    │   │   └── schema.prisma
    │   ├── routes/
    │   │   └── index.ts
    │   ├── app.ts
    │   └── index.ts
    └── package.json
```

## Frontend Task - Chatbot Flow Builder

### Step 1: Setup React Project
- [x] Create Vite React project
- [x] Install dependencies: reactflow, uuid, zustand

### Step 2: Basic React Flow Setup
- [x] Configure ReactFlow with default settings
- [x] Add minimap, controls, and background

### Step 3: Create Text Node Component
- [x] Implement TextNode with source/target handles
- [x] Apply custom styling

### Step 4: Implement Nodes Panel (Drag & Drop)
- [x] Create draggable message node
- [x] Implement drop handling on canvas

### Step 5: Implement Edge Connections
- [x] Restrict source handle to single edge
- [x] Allow multiple target edges

### Step 6: Settings Panel
- [x] Replace NodesPanel when node selected
- [x] Add text editing functionality

### Step 7: Save Button with Validation
- [x] Validate nodes have connections
- [x] Show error for disconnected nodes

---

## Backend Task - Identity Reconciliation

### Step 1: Setup Node.js Project
- [x] Initialize TypeScript project
- [x] Install dependencies: express, prisma, cors

### Step 2: Configure Prisma
- [x] Define Contact schema
- [x] Set up PostgreSQL database

### Step 3: Implement /identify Endpoint
- [x] Find existing contacts by email/phone
- [x] Handle no existing contacts (create primary)
- [x] Handle new info found (create secondary)
- [x] Handle two primaries merging

### Step 4: Implement Contact Linking Logic
- [x] Link contacts by common email/phone
- [x] Convert newer primary to secondary when needed

### Step 5: Return Consolidated Response
- [x] Build response with primaryContactId, emails, phoneNumbers, secondaryContactIds

---

## Deployment

### Frontend
- [ ] Deploy to Vercel
- [ ] Update README with live URL

### Backend
- [ ] Deploy to Render.com
- [ ] Update README with endpoint URL
