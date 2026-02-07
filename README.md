# Echo - Tavus AI Integration

Echo is a web application that integrates with Tavus AI to create interactive AI-powered conversations using knowledge from the HalOOcom website.

## Features

- 🤖 **Automatic Conversation Initialization**: Automatically creates and starts a Tavus conversation on page load
- 📚 **Knowledge Base Crawling**: Crawls haloocom.com (depth 6, 20 pages) to create a comprehensive knowledge base
- 🔒 **Secure API Key Management**: Backend server handles API keys securely
- 🎨 **Beautiful UI**: Loading states and error handling with modern design

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Tavus API key:

```
TAVUS_API_KEY=your_actual_tavus_api_key_here
PORT=3000
```

### 3. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 4. Open in Browser

Navigate to `http://localhost:3000` in your web browser. The application will automatically:

1. Create a knowledge base document by crawling https://haloocom.com/
2. Create a Tavus conversation with the specified persona and replica
3. Load the conversation into the iframe

## Configuration

The conversation is configured with:

- **Replica ID**: `r6ca16dbe104`
- **Persona ID**: `pb4c79d4e4c8`
- **Conversation Name**: "explainer"
- **Context**: "Detail explainer about the company haloocom"
- **Greeting**: "Hi, My name is Echo, and welcome to HalOOcom. How can I assist you today?"
- **Web Crawl**: https://haloocom.com/ (depth: 6, max pages: 20)

## API Endpoints

### POST `/api/create-document`

Creates a knowledge base document by crawling a web URL.

**Request Body:**
```json
{
  "webUrl": "https://haloocom.com/"
}
```

**Response:**
```json
{
  "success": true,
  "documentId": "kb_xxxxx",
  "data": { ... }
}
```

### POST `/api/create-conversation`

Creates a Tavus conversation with the specified document.

**Request Body:**
```json
{
  "documentId": "kb_xxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "conversationId": "conv_xxxxx",
  "conversationUrl": "https://...",
  "data": { ... }
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "apiKeyConfigured": true
}
```

## Project Structure

```
echo_fb/
├── server.js           # Express backend server
├── main.js             # Frontend JavaScript
├── main.html           # HTML page
├── main.css            # Styles
├── package.json        # Dependencies
├── .env                # Environment variables (not in git)
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Troubleshooting

### "TAVUS_API_KEY is not set"

Make sure you've created a `.env` file with your Tavus API key.

### CORS Errors

The server is configured with CORS enabled. Make sure you're accessing the app through `http://localhost:3000` and not opening the HTML file directly.

### API Errors

Check the browser console and server logs for detailed error messages. Common issues:
- Invalid API key
- Network connectivity
- Tavus API rate limits

## Security Notes

- ✅ API key is stored in `.env` file (not committed to git)
- ✅ Backend server handles all API calls
- ✅ Frontend never exposes the API key
- ✅ `.gitignore` prevents accidental API key commits

## License

Proprietary - HalOOcom
