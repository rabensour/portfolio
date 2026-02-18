from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class SearchRequest(BaseModel):
    """Request model for text search"""
    query: str = Field(..., min_length=1, description="Search query")
    filters: Optional[dict] = Field(default=None, description="Optional filters (category, etc.)")


class Commentary(BaseModel):
    """Commentary on a text"""
    commentator: str
    hebrew: Optional[str] = None
    translation: Optional[str] = None
    reference: str


class TextResponse(BaseModel):
    """Response model for a single text"""
    reference: str = Field(..., description="Exact reference (e.g., 'Bereshit 1:1')")
    hebrew: str = Field(..., description="Complete Hebrew text")
    translation: Optional[str] = Field(None, description="Complete translation")
    category: str = Field(..., description="Category (Torah, Nevi'im, etc.)")
    source: str = Field(default="Sefaria API", description="Source of the text")
    source_url: str = Field(..., description="Link to original source")
    fetched_at: datetime = Field(default_factory=datetime.now)
    commentaries: Optional[List[Commentary]] = None


class SearchResults(BaseModel):
    """Response model for search results"""
    results: List[TextResponse]
    total: int
    query: str


class HealthCheck(BaseModel):
    """Health check response"""
    status: str
    sefaria_available: bool
    database_available: bool
