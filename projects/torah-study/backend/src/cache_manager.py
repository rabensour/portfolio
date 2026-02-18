"""
Cache Manager
Manages PostgreSQL cache for Sefaria texts to reduce API calls
"""

import asyncpg
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from src.config import get_settings
import logging
import json

logger = logging.getLogger(__name__)
settings = get_settings()


class CacheManager:
    """Manages text caching in PostgreSQL"""

    def __init__(self, database_url: Optional[str] = None):
        self.database_url = database_url or settings.database_url
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        """Initialize database connection pool"""
        if self.pool is None:
            try:
                self.pool = await asyncpg.create_pool(
                    self.database_url,
                    min_size=2,
                    max_size=10,
                    command_timeout=60,
                )
                logger.info("Database connection pool created")
            except Exception as e:
                logger.error(f"Failed to connect to database: {e}")
                raise

    async def close(self):
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()
            self.pool = None
            logger.info("Database connection pool closed")

    async def get_cached_text(self, reference: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve cached text by reference

        Args:
            reference: Text reference (e.g., "Genesis 1:1")

        Returns:
            Cached text data or None if not found
        """
        if not self.pool:
            await self.connect()

        try:
            async with self.pool.acquire() as conn:
                row = await conn.fetchrow(
                    """
                    SELECT
                        reference,
                        hebrew,
                        translation,
                        category,
                        source,
                        source_url,
                        metadata,
                        cached_at,
                        last_accessed
                    FROM cached_texts
                    WHERE reference = $1
                    """,
                    reference
                )

                if row:
                    # Update last_accessed timestamp
                    await conn.execute(
                        """
                        UPDATE cached_texts
                        SET last_accessed = NOW(),
                            access_count = access_count + 1
                        WHERE reference = $1
                        """,
                        reference
                    )

                    logger.info(f"Cache hit: {reference}")
                    return dict(row)

                logger.info(f"Cache miss: {reference}")
                return None

        except Exception as e:
            logger.error(f"Error retrieving from cache: {e}")
            return None

    async def cache_text(
        self,
        reference: str,
        hebrew: str,
        translation: Optional[str] = None,
        category: str = "Unknown",
        source: str = "Sefaria",
        source_url: str = "",
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Cache a text in the database

        Args:
            reference: Text reference
            hebrew: Complete Hebrew text
            translation: Complete translation (optional)
            category: Text category
            source: Source name (default: Sefaria)
            source_url: URL to original source
            metadata: Additional metadata (commentaries, etc.)

        Returns:
            True if cached successfully, False otherwise
        """
        if not self.pool:
            await self.connect()

        try:
            async with self.pool.acquire() as conn:
                await conn.execute(
                    """
                    INSERT INTO cached_texts
                        (reference, hebrew, translation, category, source, source_url, metadata)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    ON CONFLICT (reference)
                    DO UPDATE SET
                        hebrew = EXCLUDED.hebrew,
                        translation = EXCLUDED.translation,
                        category = EXCLUDED.category,
                        source = EXCLUDED.source,
                        source_url = EXCLUDED.source_url,
                        metadata = EXCLUDED.metadata,
                        cached_at = NOW()
                    """,
                    reference,
                    hebrew,
                    translation,
                    category,
                    source,
                    source_url,
                    json.dumps(metadata) if metadata else None
                )

                logger.info(f"Cached text: {reference}")
                return True

        except Exception as e:
            logger.error(f"Error caching text: {e}")
            return False

    async def invalidate_old_cache(self, days: int = 30) -> int:
        """
        Remove cache entries older than specified days with low access count

        Args:
            days: Number of days to keep cache

        Returns:
            Number of entries deleted
        """
        if not self.pool:
            await self.connect()

        try:
            async with self.pool.acquire() as conn:
                result = await conn.fetchval(
                    "SELECT clean_old_cache($1)",
                    days
                )
                logger.info(f"Cleaned {result} old cache entries")
                return result or 0

        except Exception as e:
            logger.error(f"Error cleaning cache: {e}")
            return 0

    async def get_cache_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics

        Returns:
            Dictionary with cache statistics
        """
        if not self.pool:
            await self.connect()

        try:
            async with self.pool.acquire() as conn:
                # Total entries
                total = await conn.fetchval("SELECT COUNT(*) FROM cached_texts")

                # By category
                categories = await conn.fetch(
                    """
                    SELECT category, COUNT(*) as count
                    FROM cached_texts
                    GROUP BY category
                    ORDER BY count DESC
                    """
                )

                # Recent activity
                recent = await conn.fetchval(
                    """
                    SELECT COUNT(*) FROM cached_texts
                    WHERE last_accessed > NOW() - INTERVAL '7 days'
                    """
                )

                return {
                    "total_entries": total,
                    "by_category": {row["category"]: row["count"] for row in categories},
                    "recently_accessed": recent,
                }

        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {}

    async def log_search(self, query: str, results_count: int, filters: Optional[Dict] = None):
        """
        Log a search query for analytics

        Args:
            query: Search query string
            results_count: Number of results returned
            filters: Optional search filters
        """
        if not self.pool:
            await self.connect()

        try:
            async with self.pool.acquire() as conn:
                await conn.execute(
                    """
                    INSERT INTO search_history (query, results_count, filters)
                    VALUES ($1, $2, $3)
                    """,
                    query,
                    results_count,
                    json.dumps(filters) if filters else None
                )

        except Exception as e:
            logger.error(f"Error logging search: {e}")


# Global cache manager instance
_cache_manager: Optional[CacheManager] = None


async def get_cache_manager() -> CacheManager:
    """Get or create the global cache manager"""
    global _cache_manager
    if _cache_manager is None:
        _cache_manager = CacheManager()
        await _cache_manager.connect()
    return _cache_manager


async def close_cache_manager():
    """Close the global cache manager"""
    global _cache_manager
    if _cache_manager is not None:
        await _cache_manager.close()
        _cache_manager = None
