"""
Text retrieval endpoint
Handles fetching specific texts by reference
"""

from fastapi import APIRouter, HTTPException, Query
from api.models.schemas import TextResponse, Commentary
from src.sefaria_client import get_sefaria_client
from src.cache_manager import get_cache_manager
from datetime import datetime
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/texts/{ref:path}", response_model=TextResponse)
async def get_text(
    ref: str,
    include_commentaries: bool = Query(default=False, description="Include commentaries")
):
    """
    Retrieve a specific text by reference with optional commentaries

    Args:
        ref: Text reference (e.g., "Genesis.1.1", "Bereshit.1.1")
        include_commentaries: Whether to fetch commentary texts

    Returns:
        TextResponse with complete text and optional commentaries

    Example:
        GET /api/texts/Genesis.1.1?include_commentaries=true

        Response:
        {
            "reference": "Genesis 1:1",
            "hebrew": "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
            "translation": "In the beginning God created heaven and earth.",
            "category": "Torah",
            "source": "Sefaria API",
            "source_url": "https://www.sefaria.org/Genesis.1.1",
            "commentaries": [
                {
                    "commentator": "Rashi",
                    "hebrew": "...",
                    "translation": "...",
                    "reference": "Rashi on Genesis 1:1:1"
                }
            ]
        }
    """
    try:
        sefaria = await get_sefaria_client()
        cache = await get_cache_manager()

        # Normalize reference
        ref_normalized = ref.replace(".", " ")

        # Check cache
        cached = await cache.get_cached_text(ref_normalized)

        if cached:
            logger.info(f"Cache hit for: {ref_normalized}")
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
            # Fetch from Sefaria
            logger.info(f"Fetching from Sefaria: {ref_normalized}")
            text = await sefaria.get_text(ref_normalized)

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

        # Fetch commentaries if requested
        commentaries = None
        if include_commentaries:
            try:
                logger.info(f"Fetching commentaries for: {ref_normalized}")
                commentary_list = await sefaria.get_links(ref_normalized)
                commentaries = [Commentary(**c) for c in commentary_list]
            except Exception as e:
                logger.error(f"Error fetching commentaries: {e}")
                # Don't fail the whole request if commentaries fail
                commentaries = []

        return TextResponse(
            **text_data,
            commentaries=commentaries
        )

    except Exception as e:
        logger.error(f"Error retrieving text '{ref}': {e}")
        raise HTTPException(
            status_code=404,
            detail=f"Text not found: {ref}"
        )


@router.get("/texts/{ref:path}/commentaries", response_model=List[Commentary])
async def get_commentaries(ref: str):
    """
    Get only commentaries for a specific reference

    Args:
        ref: Text reference

    Returns:
        List of commentaries
    """
    try:
        sefaria = await get_sefaria_client()
        ref_normalized = ref.replace(".", " ")

        logger.info(f"Fetching commentaries for: {ref_normalized}")
        commentary_list = await sefaria.get_links(ref_normalized)

        return [Commentary(**c) for c in commentary_list]

    except Exception as e:
        logger.error(f"Error retrieving commentaries for '{ref}': {e}")
        raise HTTPException(
            status_code=404,
            detail=f"Commentaries not found: {ref}"
        )
