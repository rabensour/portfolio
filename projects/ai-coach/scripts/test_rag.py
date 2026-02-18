"""
Test script for RAG (Retrieval Augmented Generation) system.
Tests semantic search across collections.
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from config import get_config
from vectorstore import VectorStore
from rich.console import Console
from rich.table import Table
from rich.panel import Panel


def test_search(vectorstore: VectorStore, collection_name: str, query: str, console: Console):
    """Test a search query."""
    console.print(f"\n[bold cyan]🔍 Searching in '{collection_name}' for: \"{query}\"[/bold cyan]\n")

    results = vectorstore.search(collection_name, query, n_results=3)

    if not results:
        console.print("[yellow]No results found.[/yellow]\n")
        return

    for i, result in enumerate(results, 1):
        # Create panel for each result
        text = result["text"]
        if len(text) > 300:
            text = text[:300] + "..."

        metadata = result.get("metadata", {})
        source = metadata.get("source_source", "Unknown")
        distance = result.get("distance", 0)

        panel = Panel(
            text,
            title=f"[bold]Result {i}[/bold] - {source} (distance: {distance:.4f})",
            border_style="green"
        )
        console.print(panel)


def main():
    """Main test function."""
    console = Console()

    console.print("\n[bold cyan]🧪 AI Coach - Test RAG System[/bold cyan]\n")

    try:
        # Load configuration
        config = get_config()

        # Initialize vectorstore
        vectorstore = VectorStore(str(config.get_chroma_path()))

        # Check if database exists
        collections = vectorstore.list_collections()

        if not collections:
            console.print("[red]❌ No collections found. Run 'python scripts/ingest_all.py' first.[/red]\n")
            sys.exit(1)

        # Display collection stats
        table = Table(title="Collections Overview")
        table.add_column("Collection", style="cyan")
        table.add_column("Documents", justify="right", style="green")

        for collection_name in collections:
            count = vectorstore.get_collection_count(collection_name)
            table.add_row(collection_name, str(count))

        console.print(table)

        # Test queries
        test_queries = [
            ("dev_personnel", "Comment gérer la fatigue et le stress?"),
            ("dev_personnel", "Quels sont mes patterns d'auto-sabotage?"),
            ("parcours", "Expérience professionnelle et compétences"),
        ]

        for collection, query in test_queries:
            if collection in collections:
                test_search(vectorstore, collection, query, console)

        console.print("\n[bold green]✓ Test completed![/bold green]\n")

    except Exception as e:
        console.print(f"\n[bold red]❌ Error: {e}[/bold red]\n")
        import traceback
        console.print(f"[dim]{traceback.format_exc()}[/dim]")
        sys.exit(1)


if __name__ == "__main__":
    main()
