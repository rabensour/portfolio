"""
Search endpoint
Handles text search requests
"""

from fastapi import APIRouter, HTTPException
from api.models.schemas import SearchRequest, SearchResults, TextResponse
from src.sefaria_client import get_sefaria_client
from src.cache_manager import get_cache_manager
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/search", response_model=SearchResults)
async def search_texts(request: SearchRequest):
    """
    Search texts according to user query

    CRITICAL: Never generates content
    - Finds relevant passages via Sefaria API
    - Returns COMPLETE text of each passage
    - Includes exact reference (book, chapter, verse)
    - All content comes directly from Sefaria

    Args:
        request: SearchRequest with query and optional filters

    Returns:
        SearchResults with list of complete texts and references

    Example:
        POST /api/search
        {
            "query": "Qu'est-ce que la Torah dit sur la création ?",
            "filters": {"category": "Torah"}
        }

        Response:
        {
            "results": [
                {
                    "reference": "Bereshit 1:1",
                    "hebrew": "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
                    "translation": "Au commencement, Dieu créa le ciel et la terre.",
                    "category": "Torah",
                    "source": "Sefaria API",
                    "source_url": "https://www.sefaria.org/Genesis.1.1"
                }
            ],
            "total": 1,
            "query": "création"
        }
    """
    try:
        # Get Sefaria client
        sefaria = await get_sefaria_client()
        cache = await get_cache_manager()

        # Search via Sefaria
        logger.info(f"Processing search: {request.query}")
        search_results = await sefaria.search_texts(
            query=request.query,
            filters=request.filters
        )

        # Process results
        results = []
        for item in search_results.get("results", [])[:10]:  # Limit to 10 results
            ref = item.get("ref", "")

            # Try cache first
            cached = await cache.get_cached_text(ref)

            if cached:
                text_data = {
                    "reference": cached["reference"],
                    "hebrew": cached["hebrew"],
                    "translation": cached["translation"],
                    "category": cached["category"],
                    "source": cached["source"],
                    "source_url": cached["source_url"],
                    "fetched_at": cached["cached_at"],
                }
            else:
                # Fetch full text from Sefaria
                try:
                    text = await sefaria.get_text(ref)

                    # Cache it
                    await cache.cache_text(
                        reference=text["reference"],
                        hebrew=text["hebrew"],
                        translation=text["translation"],
                        category=text["category"],
                        source="Sefaria",
                        source_url=text["source_url"],
                    )

                    text_data = {
                        **text,
                        "fetched_at": datetime.now(),
                    }

                except Exception as e:
                    logger.error(f"Error fetching text {ref}: {e}")
                    continue

            results.append(TextResponse(**text_data))

        # Log search
        await cache.log_search(
            query=request.query,
            results_count=len(results),
            filters=request.filters
        )

        return SearchResults(
            results=results,
            total=len(results),
            query=request.query,
        )

    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Search failed: {str(e)}"
        )
