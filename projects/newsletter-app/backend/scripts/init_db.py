import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import db


async def main():
    print("Initializing database...")
    await db.create_tables()
    print(f"Database initialized at: {db.db_path}")


if __name__ == "__main__":
    asyncio.run(main())
