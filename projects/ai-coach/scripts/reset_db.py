"""
Script to reset (delete) the ChromaDB database.
Use with caution - this will delete all data!
"""

import sys
import shutil
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from config import get_config
from rich.console import Console
from rich.prompt import Confirm


def main():
    """Main function."""
    console = Console()

    console.print("\n[bold red]⚠️  RESET CHROMADB DATABASE[/bold red]\n")
    console.print("[yellow]This will DELETE all ingested documents and collections.[/yellow]")
    console.print("[yellow]This action cannot be undone.[/yellow]\n")

    # Confirm
    confirm = Confirm.ask("Are you sure you want to continue?", default=False)

    if not confirm:
        console.print("\n[green]Cancelled.[/green]\n")
        return

    # Double confirm
    confirm2 = Confirm.ask(
        "[bold red]FINAL WARNING: This will delete EVERYTHING. Continue?[/bold red]",
        default=False
    )

    if not confirm2:
        console.print("\n[green]Cancelled.[/green]\n")
        return

    try:
        # Load configuration
        config = get_config()
        chroma_path = config.get_chroma_path()

        if not chroma_path.exists():
            console.print(f"\n[yellow]No database found at {chroma_path}[/yellow]\n")
            return

        # Delete the directory
        console.print(f"\n[yellow]Deleting {chroma_path}...[/yellow]")
        shutil.rmtree(chroma_path)

        console.print(f"[bold green]✓ Database deleted successfully![/bold green]\n")
        console.print(f"Run 'python scripts/ingest_all.py' to rebuild the database.\n")

    except Exception as e:
        console.print(f"\n[bold red]❌ Error: {e}[/bold red]\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
