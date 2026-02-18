"""
Conversation manager for maintaining chat history.
Handles session persistence and auto-ingestion into vector database.
"""

import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional


class ConversationManager:
    """Manages conversation history and sessions."""

    def __init__(self, history_path: str, auto_ingest_every: int = 5):
        """
        Initialize conversation manager.

        Args:
            history_path: Path to store conversation history
            auto_ingest_every: Auto-ingest into vectorstore every N conversations
        """
        self.history_path = Path(history_path)
        self.history_path.mkdir(parents=True, exist_ok=True)

        self.auto_ingest_every = auto_ingest_every
        self.current_session_id = None
        self.current_session = None
        self.conversation_count = 0

    def start_new_session(self) -> str:
        """
        Start a new conversation session.

        Returns:
            Session ID
        """
        session_id = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

        self.current_session_id = session_id
        self.current_session = {
            "session_id": session_id,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "start_time": datetime.now().isoformat(),
            "exchanges": [],
            "summary": ""
        }

        return session_id

    def add_exchange(self, user_message: str, coach_response: str, user_state: str = "normal"):
        """
        Add an exchange to the current session.

        Args:
            user_message: User's message
            coach_response: Coach's response
            user_state: Detected user state
        """
        if self.current_session is None:
            self.start_new_session()

        exchange = {
            "timestamp": datetime.now().isoformat(),
            "user_message": user_message,
            "coach_response": coach_response,
            "user_state": user_state
        }

        self.current_session["exchanges"].append(exchange)
        self.conversation_count += 1

    def save_session(self):
        """Save current session to file."""
        if self.current_session is None or not self.current_session["exchanges"]:
            return

        # Generate summary
        self.current_session["summary"] = self._generate_summary()

        # Save to file
        session_file = self.history_path / f"{self.current_session_id}.json"

        with open(session_file, 'w', encoding='utf-8') as f:
            json.dump(self.current_session, f, ensure_ascii=False, indent=2)

    def load_session(self, session_id: str) -> Optional[Dict]:
        """
        Load a session from file.

        Args:
            session_id: Session ID to load

        Returns:
            Session data or None if not found
        """
        session_file = self.history_path / f"{session_id}.json"

        if not session_file.exists():
            return None

        with open(session_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def get_recent_sessions(self, n: int = 5) -> List[Dict]:
        """
        Get N most recent sessions.

        Args:
            n: Number of sessions to retrieve

        Returns:
            List of session dictionaries
        """
        session_files = sorted(
            self.history_path.glob("*.json"),
            key=lambda x: x.stat().st_mtime,
            reverse=True
        )

        sessions = []
        for session_file in session_files[:n]:
            try:
                with open(session_file, 'r', encoding='utf-8') as f:
                    sessions.append(json.load(f))
            except Exception as e:
                print(f"Error loading session {session_file}: {e}")

        return sessions

    def get_all_sessions(self) -> List[Dict]:
        """
        Get all sessions.

        Returns:
            List of all session dictionaries
        """
        session_files = sorted(
            self.history_path.glob("*.json"),
            key=lambda x: x.stat().st_mtime,
            reverse=True
        )

        sessions = []
        for session_file in session_files:
            try:
                with open(session_file, 'r', encoding='utf-8') as f:
                    session_data = json.load(f)
                    # Add end_time if missing
                    if "end_time" not in session_data:
                        session_data["end_time"] = None
                    # Fix key names for API
                    if "user" in session_data.get("exchanges", [{}])[0]:
                        for exchange in session_data["exchanges"]:
                            exchange["user_message"] = exchange.pop("user", "")
                            exchange["coach_response"] = exchange.pop("coach", "")
                    sessions.append(session_data)
            except Exception as e:
                print(f"Error loading session {session_file}: {e}")

        return sessions

    def get_current_session(self) -> Dict:
        """
        Get current session data.

        Returns:
            Current session dictionary
        """
        return self.current_session or {
            "session_id": None,
            "exchanges": []
        }

    def get_formatted_history(self, n_exchanges: int = 5) -> str:
        """
        Get formatted recent conversation history.

        Args:
            n_exchanges: Number of recent exchanges to include

        Returns:
            Formatted history string
        """
        if not self.current_session or not self.current_session["exchanges"]:
            return "Aucun historique dans cette session."

        exchanges = self.current_session["exchanges"][-n_exchanges:]

        history_parts = []
        for exchange in exchanges:
            timestamp = exchange["timestamp"].split("T")[1][:5]  # HH:MM
            user_msg = exchange.get('user_message', exchange.get('user', ''))
            coach_msg = exchange.get('coach_response', exchange.get('coach', ''))
            history_parts.append(
                f"[{timestamp}] Vous: {user_msg}\n"
                f"[{timestamp}] Coach: {coach_msg}\n"
            )

        return "\n".join(history_parts)

    def should_auto_ingest(self) -> bool:
        """Check if we should auto-ingest conversation history."""
        return self.conversation_count >= self.auto_ingest_every

    def reset_auto_ingest_counter(self):
        """Reset the auto-ingest counter."""
        self.conversation_count = 0

    def _generate_summary(self) -> str:
        """Generate a summary of the current session."""
        if not self.current_session or not self.current_session["exchanges"]:
            return ""

        exchanges = self.current_session["exchanges"]

        # Extract user states
        states = [ex.get("user_state", "normal") for ex in exchanges]
        dominant_state = max(set(states), key=states.count)

        # Extract key topics (simple approach)
        all_text = " ".join([
            ex.get('user_message', ex.get('user', '')) + " " +
            ex.get('coach_response', ex.get('coach', ''))
            for ex in exchanges
        ])
        summary = (
            f"Session du {self.current_session['date']} avec {len(exchanges)} échanges. "
            f"État dominant: {dominant_state}."
        )

        return summary

    def get_session_for_ingestion(self) -> Optional[Dict]:
        """
        Get current session formatted for ingestion into vector database.

        Returns:
            Dictionary with text and metadata for ingestion
        """
        if not self.current_session or not self.current_session["exchanges"]:
            return None

        # Build comprehensive text from all exchanges
        exchanges_text = []
        for exchange in self.current_session["exchanges"]:
            user_msg = exchange.get('user_message', exchange.get('user', ''))
            coach_msg = exchange.get('coach_response', exchange.get('coach', ''))
            exchanges_text.append(
                f"Utilisateur: {user_msg}\n"
                f"Coach: {coach_msg}"
            )

        full_text = "\n\n".join(exchanges_text)

        # Add summary at the beginning
        summary = self._generate_summary()
        full_text = f"{summary}\n\n---\n\n{full_text}"

        metadata = {
            "session_id": self.current_session_id,
            "date": self.current_session["date"],
            "num_exchanges": len(self.current_session["exchanges"]),
            "summary": summary
        }

        return {
            "text": full_text,
            "metadata": metadata
        }
