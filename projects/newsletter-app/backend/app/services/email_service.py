import uuid
from datetime import datetime
from typing import Dict, Any
from .ai_processor import ai_processor
from .email_parser import email_parser
from ..database import db


class EmailService:
    async def process_incoming_email(self, form_data: Dict[str, str]) -> str:
        """Process incoming email from webhook."""

        # Parse email
        parsed = email_parser.parse_webhook_payload(form_data)

        # Extract AI data
        ai_data = await ai_processor.extract_email_data(
            from_address=parsed["from"],
            subject=parsed["subject"],
            body=parsed["body_plain"],
        )

        # Prepare email data for database
        email_data = {
            "id": str(uuid.uuid4()),
            "raw_subject": parsed["subject"],
            "raw_from": parsed["from"],
            "raw_body": parsed["body_plain"],
            "raw_html": parsed.get("body_html"),
            "received_at": datetime.utcnow().isoformat(),
            "title": ai_data.title,
            "summary": ai_data.summary,
            "key_points": ai_data.key_points,
            "category": ai_data.category,
            "sentiment": ai_data.sentiment,
            "action_required": ai_data.action_required,
            "tags": ai_data.tags,
            "processed_at": datetime.utcnow().isoformat(),
        }

        # Insert into database
        email_id = await db.insert_email(email_data)

        return email_id


email_service = EmailService()
