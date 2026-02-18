"""
AI Coach - Main coaching logic using Claude API.
Combines RAG context with conversation history.
"""

import os
from anthropic import Anthropic
from typing import Optional
from rag_engine import RAGEngine
from conversation_manager import ConversationManager


class AICoach:
    """AI Coach using Claude API with RAG."""

    def __init__(
        self,
        rag_engine: RAGEngine,
        conversation_manager: ConversationManager,
        config
    ):
        """
        Initialize AI Coach.

        Args:
            rag_engine: RAG engine instance
            conversation_manager: Conversation manager instance
            config: Configuration object
        """
        self.rag_engine = rag_engine
        self.conversation_manager = conversation_manager
        self.config = config

        # Initialize Anthropic client
        self.client = Anthropic(api_key=config.anthropic_api_key)

        # Load system prompt template
        self.system_prompt_template = config.get_prompt_template()

    def get_response(self, user_message: str) -> str:
        """
        Get coach response to user message.

        Args:
            user_message: User's message

        Returns:
            Coach's response
        """
        # Detect user state
        user_state = self.rag_engine.detect_user_state(user_message)

        # Retrieve relevant context via RAG
        rag_context = self.rag_engine.retrieve_context(user_message, user_state)

        # Get recent conversation history
        conversation_history = self.conversation_manager.get_formatted_history(n_exchanges=3)

        # Build system prompt with context
        system_prompt = self.system_prompt_template.format(
            rag_context=rag_context,
            conversation_history=conversation_history
        )

        # Call Claude API
        try:
            response = self.client.messages.create(
                model=self.config.claude_model,
                max_tokens=self.config.max_tokens,
                temperature=self.config.temperature,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_message}
                ]
            )

            coach_response = response.content[0].text

        except Exception as e:
            coach_response = f"Erreur lors de l'appel à l'API Claude: {e}"

        # Save exchange
        self.conversation_manager.add_exchange(user_message, coach_response, user_state)

        # Auto-ingest if needed
        if self.conversation_manager.should_auto_ingest():
            self._auto_ingest_conversation()

        return coach_response

    def _auto_ingest_conversation(self):
        """Auto-ingest conversation history into vector database."""
        try:
            # Get session data for ingestion
            session_data = self.conversation_manager.get_session_for_ingestion()

            if not session_data:
                return

            # Prepare for vectorstore
            from text_chunker import TextChunker
            chunker = TextChunker(
                chunk_size=self.config.chunk_size,
                chunk_overlap=self.config.chunk_overlap
            )

            chunks = chunker.chunk_text(session_data["text"], session_data["metadata"])

            # Add collection metadata
            for chunk in chunks:
                chunk["collection"] = "historique_coach"
                chunk["type"] = "Conversations passées avec le coach"

            # Ensure collection exists
            if not self.rag_engine.vectorstore.collection_exists("historique_coach"):
                self.rag_engine.vectorstore.create_collection(
                    "historique_coach",
                    metadata={"description": "Conversations passées avec le coach"}
                )

            # Add to vectorstore
            self.rag_engine.vectorstore.add_chunks("historique_coach", chunks)

            # Reset counter
            self.conversation_manager.reset_auto_ingest_counter()

            print(f"\n[Auto-ingestion] Session {session_data['metadata']['session_id']} ingérée dans la base vectorielle.\n")

        except Exception as e:
            print(f"\n[Erreur auto-ingestion] {e}\n")

    def save_session(self):
        """Save current conversation session."""
        self.conversation_manager.save_session()
