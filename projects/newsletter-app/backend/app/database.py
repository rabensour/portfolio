import aiosqlite
import json
from typing import List, Optional, Dict, Any
from datetime import datetime
from pathlib import Path
from .config import settings
from .models.email import Email, Category


class Database:
    def __init__(self, db_path: str = settings.database_path):
        self.db_path = db_path
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)

    async def create_tables(self):
        async with aiosqlite.connect(self.db_path) as conn:
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS emails (
                    id TEXT PRIMARY KEY,
                    raw_subject TEXT NOT NULL,
                    raw_from TEXT NOT NULL,
                    raw_body TEXT NOT NULL,
                    raw_html TEXT,
                    received_at TIMESTAMP NOT NULL,

                    title TEXT NOT NULL,
                    summary TEXT NOT NULL,
                    key_points TEXT,
                    category TEXT,
                    sentiment TEXT,
                    action_required BOOLEAN DEFAULT 0,
                    tags TEXT,

                    processed_at TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            await conn.execute("""
                CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    color TEXT,
                    icon TEXT,
                    count INTEGER DEFAULT 0
                )
            """)

            await conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_emails_received_at
                ON emails(received_at DESC)
            """)

            await conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_emails_category
                ON emails(category)
            """)

            await conn.commit()

    async def insert_email(self, email_data: Dict[str, Any]) -> str:
        async with aiosqlite.connect(self.db_path) as conn:
            await conn.execute("""
                INSERT INTO emails (
                    id, raw_subject, raw_from, raw_body, raw_html, received_at,
                    title, summary, key_points, category, sentiment,
                    action_required, tags, processed_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                email_data["id"],
                email_data["raw_subject"],
                email_data["raw_from"],
                email_data["raw_body"],
                email_data.get("raw_html"),
                email_data["received_at"],
                email_data["title"],
                email_data["summary"],
                json.dumps(email_data["key_points"]),
                email_data["category"],
                email_data["sentiment"],
                email_data["action_required"],
                json.dumps(email_data["tags"]),
                email_data["processed_at"],
            ))
            await conn.commit()

            # Update category count
            await self._update_category_count(conn, email_data["category"])

        return email_data["id"]

    async def _update_category_count(self, conn, category_name: str):
        # Insert or update category count
        await conn.execute("""
            INSERT INTO categories (name, color, icon, count)
            VALUES (?, ?, ?, 1)
            ON CONFLICT(name) DO UPDATE SET count = count + 1
        """, (category_name, self._get_category_color(category_name), self._get_category_icon(category_name)))
        await conn.commit()

    def _get_category_color(self, category: str) -> str:
        colors = {
            "Work": "blue-600",
            "Personal": "green-600",
            "Newsletter": "purple-600",
            "Finance": "emerald-600",
            "Shopping": "pink-600",
            "Social": "orange-600",
            "Travel": "cyan-600",
            "Health": "red-600",
            "Other": "gray-600",
        }
        return colors.get(category, "gray-600")

    def _get_category_icon(self, category: str) -> str:
        icons = {
            "Work": "💼",
            "Personal": "👤",
            "Newsletter": "📰",
            "Finance": "💰",
            "Shopping": "🛒",
            "Social": "💬",
            "Travel": "✈️",
            "Health": "❤️",
            "Other": "📁",
        }
        return icons.get(category, "📁")

    async def get_emails(
        self,
        category: Optional[str] = None,
        search: Optional[str] = None,
        action_required: Optional[bool] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[Email]:
        query = "SELECT * FROM emails WHERE 1=1"
        params = []

        if category:
            query += " AND category = ?"
            params.append(category)

        if search:
            query += " AND (title LIKE ? OR summary LIKE ? OR raw_subject LIKE ?)"
            search_param = f"%{search}%"
            params.extend([search_param, search_param, search_param])

        if action_required is not None:
            query += " AND action_required = ?"
            params.append(1 if action_required else 0)

        query += " ORDER BY received_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        async with aiosqlite.connect(self.db_path) as conn:
            conn.row_factory = aiosqlite.Row
            cursor = await conn.execute(query, params)
            rows = await cursor.fetchall()

        return [self._row_to_email(row) for row in rows]

    async def get_email_by_id(self, email_id: str) -> Optional[Email]:
        async with aiosqlite.connect(self.db_path) as conn:
            conn.row_factory = aiosqlite.Row
            cursor = await conn.execute("SELECT * FROM emails WHERE id = ?", (email_id,))
            row = await cursor.fetchone()

        return self._row_to_email(row) if row else None

    async def delete_email(self, email_id: str) -> bool:
        async with aiosqlite.connect(self.db_path) as conn:
            conn.row_factory = aiosqlite.Row
            # Get category before deleting
            cursor = await conn.execute("SELECT category FROM emails WHERE id = ?", (email_id,))
            row = await cursor.fetchone()
            if not row:
                return False

            category = row["category"]

            # Delete email
            await conn.execute("DELETE FROM emails WHERE id = ?", (email_id,))

            # Decrement category count
            await conn.execute(
                "UPDATE categories SET count = count - 1 WHERE name = ?",
                (category,)
            )
            await conn.commit()

        return True

    async def get_categories(self) -> List[Category]:
        async with aiosqlite.connect(self.db_path) as conn:
            conn.row_factory = aiosqlite.Row
            cursor = await conn.execute(
                "SELECT * FROM categories WHERE count > 0 ORDER BY name"
            )
            rows = await cursor.fetchall()

        return [
            Category(
                id=row["id"],
                name=row["name"],
                color=row["color"],
                icon=row["icon"],
                count=row["count"],
            )
            for row in rows
        ]

    async def get_total_count(
        self,
        category: Optional[str] = None,
        search: Optional[str] = None,
        action_required: Optional[bool] = None,
    ) -> int:
        query = "SELECT COUNT(*) as count FROM emails WHERE 1=1"
        params = []

        if category:
            query += " AND category = ?"
            params.append(category)

        if search:
            query += " AND (title LIKE ? OR summary LIKE ? OR raw_subject LIKE ?)"
            search_param = f"%{search}%"
            params.extend([search_param, search_param, search_param])

        if action_required is not None:
            query += " AND action_required = ?"
            params.append(1 if action_required else 0)

        async with aiosqlite.connect(self.db_path) as conn:
            conn.row_factory = aiosqlite.Row
            cursor = await conn.execute(query, params)
            row = await cursor.fetchone()

        return row["count"] if row else 0

    def _row_to_email(self, row) -> Email:
        return Email(
            id=row["id"],
            raw_subject=row["raw_subject"],
            raw_from=row["raw_from"],
            raw_body=row["raw_body"],
            raw_html=row["raw_html"],
            received_at=datetime.fromisoformat(row["received_at"]),
            title=row["title"],
            summary=row["summary"],
            key_points=json.loads(row["key_points"]) if row["key_points"] else [],
            category=row["category"],
            sentiment=row["sentiment"],
            action_required=bool(row["action_required"]),
            tags=json.loads(row["tags"]) if row["tags"] else [],
            processed_at=datetime.fromisoformat(row["processed_at"]) if row["processed_at"] else None,
            created_at=datetime.fromisoformat(row["created_at"]),
        )


db = Database()
