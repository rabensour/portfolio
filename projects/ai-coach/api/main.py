"""
FastAPI server for AI Coach web interface.
WebSocket chat + REST API for sessions.
"""

import sys
from pathlib import Path
from datetime import datetime
from typing import Optional

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from config import get_config
from vectorstore import VectorStore
from rag_engine import RAGEngine
from conversation_manager import ConversationManager
from coach import AICoach
from api.models.schemas import (
    ChatMessage,
    ChatResponse,
    SessionList,
    Session,
    NewSessionResponse,
    SessionDetail
)

# Initialize FastAPI app
app = FastAPI(title="AI Coach API", version="1.0.0")

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances (initialized on startup)
coach: Optional[AICoach] = None
conversation_manager: Optional[ConversationManager] = None


@app.on_event("startup")
async def startup_event():
    """Initialize AI Coach components on startup."""
    global coach, conversation_manager

    # Load configuration
    config = get_config()

    # Initialize vectorstore
    vectorstore = VectorStore(str(config.get_chroma_path()))

    # Initialize RAG engine
    rag_engine = RAGEngine(vectorstore, config)

    # Initialize conversation manager
    conversation_manager = ConversationManager(
        str(config.get_conversation_history_path()),
        auto_ingest_every=config.auto_ingest_history_every
    )

    # Start new session
    conversation_manager.start_new_session()

    # Initialize coach
    coach = AICoach(rag_engine, conversation_manager, config)

    print("✅ AI Coach API initialized successfully")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "AI Coach API is running"}


@app.websocket("/ws/chat")
async def chat_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time chat.

    Receives: {"message": "user message"}
    Sends: {"response": "coach response", "state": "fatigue|energie|resistance", "timestamp": "ISO8601"}
    """
    await websocket.accept()

    try:
        while True:
            # Receive user message
            data = await websocket.receive_json()
            user_message = data.get("message", "")

            if not user_message:
                await websocket.send_json({
                    "error": "Empty message",
                    "timestamp": datetime.now().isoformat()
                })
                continue

            # Get coach response
            coach_response = coach.get_response(user_message)

            # Detect state from last exchange
            last_exchange = conversation_manager.get_current_session()["exchanges"][-1]
            user_state = last_exchange.get("user_state", "normal")

            # Map state names to frontend format
            state_mapping = {
                "fatigue": "tired",
                "energie": "energetic",
                "resistance": "resistance",
                "normal": None
            }

            # Send response
            await websocket.send_json({
                "response": coach_response,
                "state": state_mapping.get(user_state, None),
                "timestamp": datetime.now().isoformat()
            })

    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        try:
            await websocket.send_json({
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            })
        except:
            pass


@app.get("/api/sessions", response_model=SessionList)
async def get_sessions():
    """Get list of all conversation sessions."""
    sessions_data = conversation_manager.get_all_sessions()

    sessions = [
        Session(
            id=session["session_id"],
            title=session.get("title", f"Session {session['session_id'][:8]}"),
            created_at=session["start_time"],
            updated_at=session["end_time"] or session["start_time"],
            message_count=len(session["exchanges"])
        )
        for session in sessions_data
    ]

    return SessionList(sessions=sessions)


@app.post("/api/sessions/new", response_model=NewSessionResponse)
async def create_new_session():
    """Create a new conversation session."""
    session_id = conversation_manager.start_new_session()

    return NewSessionResponse(
        session_id=session_id,
        message="New session created successfully"
    )


@app.get("/api/sessions/{session_id}", response_model=SessionDetail)
async def get_session_detail(session_id: str):
    """Get detailed session information with messages."""
    sessions_data = conversation_manager.get_all_sessions()

    # Find the session
    session = next((s for s in sessions_data if s["session_id"] == session_id), None)

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Format messages
    messages = []
    for exchange in session["exchanges"]:
        # User message
        messages.append({
            "role": "user",
            "content": exchange["user_message"],
            "timestamp": exchange.get("timestamp", "")
        })
        # Coach message
        messages.append({
            "role": "coach",
            "content": exchange["coach_response"],
            "state": exchange.get("user_state", "normal"),
            "timestamp": exchange.get("timestamp", "")
        })

    return SessionDetail(
        id=session["session_id"],
        title=session.get("title", f"Session {session_id[:8]}"),
        created_at=session["start_time"],
        updated_at=session["end_time"] or session["start_time"],
        messages=messages
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
