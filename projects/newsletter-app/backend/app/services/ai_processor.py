from anthropic import Anthropic
from ..config import settings
from ..models.email import AIExtractedData
import json


class AIProcessor:
    def __init__(self):
        self.client = Anthropic(api_key=settings.anthropic_api_key)
        self.model = settings.claude_model

    async def extract_email_data(
        self, from_address: str, subject: str, body: str
    ) -> AIExtractedData:
        """Extract structured data from email using Claude AI."""

        prompt = f"""Analyse cet email et extrait les informations essentielles.

Email:
From: {from_address}
Subject: {subject}
Body: {body}

Retourne un JSON avec:
{{
  "title": "Titre lisible et propre (max 80 chars)",
  "summary": "Résumé en 2-3 phrases des infos clés",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "category": "Work | Personal | Newsletter | Finance | Shopping | Social | Travel | Health | Other",
  "sentiment": "positive | neutral | negative",
  "action_required": true/false,
  "tags": ["tag1", "tag2"]
}}

Sois concis et focus sur l'actionnable."""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )

            # Extract JSON from response
            content = response.content[0].text
            # Find JSON in response (handle markdown code blocks)
            json_start = content.find("{")
            json_end = content.rfind("}") + 1

            if json_start == -1 or json_end == 0:
                raise ValueError("No JSON found in response")

            json_str = content[json_start:json_end]
            data = json.loads(json_str)

            return AIExtractedData(**data)

        except Exception as e:
            # Fallback to basic extraction if AI fails
            return AIExtractedData(
                title=subject[:80] if subject else "No Subject",
                summary=body[:200] if body else "No content",
                key_points=[],
                category="Other",
                sentiment="neutral",
                action_required=False,
                tags=[],
            )


ai_processor = AIProcessor()
