# CodeMate

CodeMate is a full-stack AI chat application built with React, Vite, Node.js, Express, and MongoDB. It allows users to start conversations, manage chat threads, and receive AI-generated responses through a clean and responsive interface.

## Features

- Modern chat UI with a polished experience
- Thread-based conversation history
- AI-powered responses using Google Gemini
- Copy assistant replies to the clipboard
- Auto-scroll for new messages
- Clear chat option for a fresh conversation
- Backend fallback support when MongoDB is unavailable

## Tech Stack

### Frontend
- React
- Vite
- CSS
- React Markdown

### Backend
- Node.js
- Express
- MongoDB / Mongoose
- Google GenAI SDK

## Project Structure

```bash
CodeMate/
├── Backend/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

Before running the project, make sure you have:
- Node.js installed
- npm installed
- A Google API key
- A MongoDB connection string (optional for local testing if fallback mode is used)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/CodeMate.git
cd CodeMate
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder with:

```env
PORT=8080
GOOGLE_API_KEY=your_google_api_key
MONGODB_URI=your_mongodb_connection_string
```

Start the backend:

```bash
npm start
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

## Usage

1. Open the frontend in your browser.
2. Start a new chat.
3. Enter a message and receive an AI response.
4. Use the clear chat option or copy replies as needed.

## Future Improvements

Possible upgrades for the project include:
- User authentication
- Message streaming
- Dark/light mode toggle
- Export chat history
- Better AI prompt handling

## Author

Payel Mallick
