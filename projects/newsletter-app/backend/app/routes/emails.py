from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from ..database import db
from ..models.email import Email, EmailListResponse, Category


router = APIRouter()


@router.get("/emails", response_model=EmailListResponse)
async def get_emails(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    action_required: Optional[bool] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Get paginated list of emails with optional filters."""

    emails = await db.get_emails(
        category=category,
        search=search,
        action_required=action_required,
        limit=limit,
        offset=offset,
    )

    total = await db.get_total_count(
        category=category,
        search=search,
        action_required=action_required,
    )

    return EmailListResponse(emails=emails, total=total)


@router.get("/emails/{email_id}", response_model=Email)
async def get_email(email_id: str):
    """Get single email by ID."""

    email = await db.get_email_by_id(email_id)

    if not email:
        raise HTTPException(status_code=404, detail="Email not found")

    return email


@router.delete("/emails/{email_id}")
async def delete_email(email_id: str):
    """Delete email by ID."""

    success = await db.delete_email(email_id)

    if not success:
        raise HTTPException(status_code=404, detail="Email not found")

    return {"status": "success", "message": "Email deleted"}


@router.get("/categories", response_model=list[Category])
async def get_categories():
    """Get list of categories with counts."""

    categories = await db.get_categories()
    return categories
