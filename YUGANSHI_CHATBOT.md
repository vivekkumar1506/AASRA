# Yuganshi Chatbot Integration

## Current phase
- Frontend floating chatbot UI integrated into the existing AASRA `index.html`.
- `js/chatbot.js` calls the existing AASRA API client.
- FastAPI endpoint: `POST /api/chat`
- MySQL tables: `chat_sessions`, `chat_messages`
- Conversation history endpoint: `GET /api/chat/history/{session_id}`.
- No external LLM is required yet.

## Future AI phase
The same `/api/chat` endpoint will be extended with:
1. LLM provider/model
2. Embeddings
3. Vector database
4. AASRA knowledge documents
5. RAG retrieval
6. Safe backend tools for application-status information
7. Authentication/authorization for private application data

The existing AASRA application APIs and database tables are kept separate from chatbot conversation storage.
