from fastapi import APIRouter, Form, HTTPException
from typing import Optional
from ..services.email_service import email_service


router = APIRouter()


@router.post("/webhook/email")
async def receive_email(
    sender: str = Form(alias="from"),
    subject: str = Form(),
    body_plain: str = Form(alias="body-plain"),
    body_html: Optional[str] = Form(None, alias="body-html"),
):
    """Receive email from Mailgun webhook."""

    try:
        form_data = {
            "from": sender,
            "subject": subject,
            "body-plain": body_plain,
        }

        if body_html:
            form_data["body-html"] = body_html

        email_id = await email_service.process_incoming_email(form_data)

        return {"status": "success", "email_id": email_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
