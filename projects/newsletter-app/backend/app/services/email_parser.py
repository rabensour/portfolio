from typing import Dict, Any


class EmailParser:
    @staticmethod
    def parse_webhook_payload(form_data: Dict[str, str]) -> Dict[str, Any]:
        """Parse Mailgun webhook form data into structured format."""

        return {
            "from": form_data.get("from", form_data.get("sender", "")),
            "subject": form_data.get("subject", ""),
            "body_plain": form_data.get("body-plain", ""),
            "body_html": form_data.get("body-html"),
        }


email_parser = EmailParser()
