"""
Sefaria API Client
Handles all interactions with the Sefaria API v3
Documentation: https://developers.sefaria.org/
"""

import httpx
from typing import Optional, List, Dict, Any
from src.config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()


class SefariaClient:
    """Client for interacting with Sefaria API"""

    def __init__(self):
        self.base_url = settings.sefaria_base_url
        self.headers = {
            "User-Agent": settings.sefaria_user_agent,
            "Accept": "application/json",
        }
        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            headers=self.headers,
            timeout=30.0,
        )

    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()

    async def search_texts(
        self,
        query: str,
        filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Search texts via Sefaria API

        Args:
            query: Search query string
            filters: Optional filters (category, language, etc.)

        Returns:
            Dictionary with search results

        Note: NEVER generates content - only returns exact text from Sefaria
        """
        try:
            params = {
                "q": query,
                "type": "text",
            }

            if filters:
                if "category" in filters:
                    params["category"] = filters["category"]

            logger.info(f"Searching Sefaria: {query}")
            response = await self.client.get("/search", params=params)
            response.raise_for_status()

            data = response.json()
            return data

        except httpx.HTTPError as e:
            logger.error(f"Sefaria API error: {e}")
            raise Exception(f"Failed to search Sefaria: {str(e)}")

    async def get_text(
        self,
        ref: str,
        lang: str = "he",
        include_translation: bool = True
    ) -> Dict[str, Any]:
        """
        Retrieve a specific text by reference

        Args:
            ref: Text reference (e.g., "Genesis 1:1", "Bereshit 1:1")
            lang: Language code (he, en)
            include_translation: Whether to include translation

        Returns:
            Dictionary with text data including:
            - hebrew: Complete Hebrew text
            - translation: Complete translation (if requested)
            - reference: Exact reference
            - category: Text category

        Example:
            text = await client.get_text("Genesis 1:1")
            print(text["hebrew"])  # בְּרֵאשִׁית בָּרָא...
        """
        try:
            # Normalize reference (spaces to dots)
            ref_encoded = ref.replace(" ", ".")

            logger.info(f"Fetching text: {ref_encoded}")
            response = await self.client.get(f"/texts/{ref_encoded}")
            response.raise_for_status()

            data = response.json()

            # Extract the actual text content
            result = {
                "reference": ref,
                "hebrew": self._extract_text(data, "he"),
                "translation": self._extract_text(data, "en") if include_translation else None,
                "category": data.get("categories", ["Unknown"])[0] if data.get("categories") else "Unknown",
                "source_url": f"https://www.sefaria.org/{ref_encoded}",
            }

            return result

        except httpx.HTTPError as e:
            logger.error(f"Sefaria API error for ref '{ref}': {e}")
            raise Exception(f"Failed to fetch text '{ref}': {str(e)}")

    async def get_links(
        self,
        ref: str,
        link_type: str = "commentary"
    ) -> List[Dict[str, Any]]:
        """
        Retrieve commentary and related texts for a reference

        Args:
            ref: Text reference
            link_type: Type of links to retrieve (commentary, quotation, etc.)

        Returns:
            List of related texts with full content (NEVER generated)
        """
        try:
            ref_encoded = ref.replace(" ", ".")

            logger.info(f"Fetching links for: {ref_encoded}")
            response = await self.client.get(f"/related/{ref_encoded}")
            response.raise_for_status()

            data = response.json()

            # Extract commentary links
            commentaries = []
            links = data.get("links", [])

            for link in links:
                if link.get("category") == "Commentary" or link_type in link.get("type", "").lower():
                    commentary = {
                        "commentator": link.get("collectiveTitle", {}).get("en", "Unknown"),
                        "reference": link.get("ref", ""),
                        "hebrew": link.get("he", ""),
                        "translation": link.get("text", ""),
                    }
                    commentaries.append(commentary)

            return commentaries[:10]  # Limit to 10 commentaries

        except httpx.HTTPError as e:
            logger.error(f"Sefaria API error for links '{ref}': {e}")
            return []  # Return empty list on error, don't fail

    def _extract_text(self, data: Dict[str, Any], lang: str) -> str:
        """
        Extract text from Sefaria response

        Sefaria can return text as:
        - String (single verse)
        - List (multiple verses)
        - Nested lists (chapters with verses)
        """
        key = "he" if lang == "he" else "text"
        text = data.get(key, "")

        if isinstance(text, str):
            return text
        elif isinstance(text, list):
            # Flatten nested lists and join
            return self._flatten_text(text)
        else:
            return ""

    def _flatten_text(self, text: Any) -> str:
        """Recursively flatten nested text structures"""
        if isinstance(text, str):
            return text
        elif isinstance(text, list):
            return " ".join(self._flatten_text(item) for item in text if item)
        else:
            return ""


# Global client instance
_sefaria_client: Optional[SefariaClient] = None


async def get_sefaria_client() -> SefariaClient:
    """Get or create the global Sefaria client"""
    global _sefaria_client
    if _sefaria_client is None:
        _sefaria_client = SefariaClient()
    return _sefaria_client


async def close_sefaria_client():
    """Close the global Sefaria client"""
    global _sefaria_client
    if _sefaria_client is not None:
        await _sefaria_client.close()
        _sefaria_client = None
