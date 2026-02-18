"""
Health check endpoint
"""

from fastapi import APIRouter
from api.models.schemas import HealthCheck
from src.sefaria_client import get_sefaria_client
from src.cache_manager import get_cache_manager

router = APIRouter()


@router.get("/health", response_model=HealthCheck)
async def health_check():
    """
    Health check endpoint

    Returns system status and availability of dependencies
    """
    sefaria_available = True
    database_available = True

    # Check Sefaria API
    try:
        client = await get_sefaria_client()
        # Quick test - get Genesis 1:1
        await client.get_text("Genesis.1.1")
    except Exception:
        sefaria_available = False

    # Check database
    try:
        cache = await get_cache_manager()
        await cache.get_cache_stats()
    except Exception:
        database_available = False

    status = "healthy" if (sefaria_available and database_available) else "degraded"

    return HealthCheck(
        status=status,
        sefaria_available=sefaria_available,
        database_available=database_available,
    )
