"""
RAG (Retrieval Augmented Generation) engine.
Retrieves relevant context from multiple collections.
"""

from typing import List, Dict, Optional
from vectorstore import VectorStore
import re


class RAGEngine:
    """RAG engine for context retrieval."""

    def __init__(self, vectorstore: VectorStore, config):
        """
        Initialize RAG engine.

        Args:
            vectorstore: VectorStore instance
            config: Configuration object
        """
        self.vectorstore = vectorstore
        self.config = config

        # Load collections
        self._ensure_collections_loaded()

    def _ensure_collections_loaded(self):
        """Ensure all collections are loaded."""
        for collection_name in self.config.collections.keys():
            if self.vectorstore.collection_exists(collection_name):
                if collection_name not in self.vectorstore.collections:
                    self.vectorstore.collections[collection_name] = \
                        self.vectorstore.client.get_collection(collection_name)

    def retrieve_context(
        self,
        query: str,
        user_state: Optional[str] = None,
        max_chunks: int = None
    ) -> str:
        """
        Retrieve relevant context from multiple collections.

        Args:
            query: User's query
            user_state: Detected user state (fatigue, energie, resistance)
            max_chunks: Maximum number of chunks to retrieve per collection

        Returns:
            Formatted context string
        """
        if max_chunks is None:
            max_chunks = self.config.rag_top_k

        # Determine which collections to search
        search_strategy = self._determine_search_strategy(query, user_state)

        # Retrieve from each collection
        all_results = []

        for collection_name, num_results in search_strategy.items():
            if num_results == 0:
                continue

            results = self.vectorstore.search(
                collection_name,
                query,
                n_results=num_results
            )

            # Add collection name to each result
            for result in results:
                result["collection"] = collection_name

            all_results.extend(results)

        # Sort by relevance (distance)
        all_results.sort(key=lambda x: x.get("distance", float('inf')))

        # Build context string
        context = self._format_context(all_results)

        return context

    def _determine_search_strategy(self, query: str, user_state: Optional[str]) -> Dict[str, int]:
        """
        Determine how many results to retrieve from each collection.

        Args:
            query: User's query
            user_state: User's current state

        Returns:
            Dictionary of collection_name -> num_results
        """
        strategy = {
            "dev_personnel": 3,
            "patterns": 2,
            "historique_coach": 2,
            "parcours": 0,
            "textes_creatifs": 0
        }

        query_lower = query.lower()

        # Adjust based on query content
        career_keywords = ["travail", "job", "carrière", "emploi", "entretien", "cv"]
        if any(keyword in query_lower for keyword in career_keywords):
            strategy["parcours"] = 2
            strategy["dev_personnel"] = 2  # Reduce dev_personnel

        objective_keywords = ["objectif", "goal", "projet", "ambition"]
        if any(keyword in query_lower for keyword in objective_keywords):
            strategy["parcours"] = 2

        creative_keywords = ["créativité", "écrire", "rap", "texte", "script"]
        if any(keyword in query_lower for keyword in creative_keywords):
            strategy["textes_creatifs"] = 2
            strategy["dev_personnel"] = 2

        # Adjust based on user state
        if user_state == "fatigue":
            # More focus on patterns and past strategies
            strategy["patterns"] = 3
            strategy["historique_coach"] = 3

        elif user_state == "energie":
            # More ambitious, look at objectives
            strategy["parcours"] = 1
            strategy["dev_personnel"] = 3

        elif user_state == "resistance":
            # Focus heavily on patterns
            strategy["patterns"] = 4
            strategy["historique_coach"] = 2
            strategy["dev_personnel"] = 2

        return strategy

    def _format_context(self, results: List[Dict]) -> str:
        """
        Format results into a context string.

        Args:
            results: List of search results

        Returns:
            Formatted context string
        """
        if not results:
            return "Aucun contexte pertinent trouvé."

        context_parts = []

        for i, result in enumerate(results[:10], 1):  # Limit to top 10
            collection = result.get("collection", "unknown")
            text = result["text"]

            # Truncate if too long
            if len(text) > 500:
                text = text[:500] + "..."

            source = result.get("metadata", {}).get("source_source", "Unknown")

            context_parts.append(
                f"[{i}] Source: {collection} - {source}\n{text}\n"
            )

        return "\n---\n".join(context_parts)

    def detect_user_state(self, user_message: str) -> str:
        """
        Detect user's current state from their message.

        Args:
            user_message: User's message

        Returns:
            Detected state: 'fatigue', 'energie', 'resistance', or 'normal'
        """
        message_lower = user_message.lower()

        # Fatigue indicators
        fatigue_keywords = [
            "fatigué", "crevé", "épuisé", "pas d'énergie",
            "je ne sais pas", "perdu", "confus"
        ]
        if any(keyword in message_lower for keyword in fatigue_keywords):
            return "fatigue"

        # Resistance/procrastination indicators
        resistance_keywords = [
            "je vais réfléchir", "peut-être", "plus tard",
            "je ne suis pas sûr", "hésit", "peur"
        ]
        if any(keyword in message_lower for keyword in resistance_keywords):
            return "resistance"

        # Energy indicators
        energy_keywords = [
            "motivé", "prêt", "en forme", "go",
            "let's go", "c'est parti", "allons-y"
        ]
        if any(keyword in message_lower for keyword in energy_keywords):
            return "energie"

        return "normal"
