"""
Ingestion script to load all documents into ChromaDB.
Creates collections and processes all source documents.
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from config import get_config
from document_loader import DocumentLoader
from text_chunker import TextChunker
from vectorstore import VectorStore
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn
from rich.table import Table


def main():
    """Main ingestion function."""
    console = Console()

    console.print("\n[bold cyan]🤖 AI Coach - Ingestion de documents[/bold cyan]\n")

    try:
        # Load configuration
        console.print("[yellow]Chargement de la configuration...[/yellow]")
        config = get_config()

        # Initialize vectorstore
        console.print("[yellow]Initialisation de ChromaDB...[/yellow]")
        vectorstore = VectorStore(str(config.get_chroma_path()))

        # Initialize chunker
        chunker = TextChunker(
            chunk_size=config.chunk_size,
            chunk_overlap=config.chunk_overlap
        )

        # Initialize document loader
        loader = DocumentLoader()

        # Statistics
        stats = {}

        # Process each collection
        collections = config.collections

        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
            console=console
        ) as progress:

            for collection_name, collection_config in collections.items():
                # Skip historique_coach (will be populated by conversations)
                if collection_name == "historique_coach":
                    console.print(f"[dim]Skipping {collection_name} (populated by conversations)[/dim]")
                    stats[collection_name] = {"chunks": 0, "documents": 0}
                    continue

                task = progress.add_task(
                    f"Processing {collection_name}...",
                    total=100
                )

                # Get source path
                source_path = config.get_collection_path(collection_name)

                if not source_path.exists():
                    console.print(f"[red]⚠ Source path not found: {source_path}[/red]")
                    stats[collection_name] = {"chunks": 0, "documents": 0}
                    continue

                # Load documents
                progress.update(task, advance=20, description=f"Loading {collection_name}...")
                documents = loader.load_directory(str(source_path))

                if not documents:
                    console.print(f"[yellow]⚠ No documents found in {collection_name}[/yellow]")
                    stats[collection_name] = {"chunks": 0, "documents": 0}
                    progress.update(task, completed=100)
                    continue

                # Chunk documents
                progress.update(task, advance=30, description=f"Chunking {collection_name}...")
                chunks = chunker.chunk_documents(documents)

                # Add collection type to metadata
                for chunk in chunks:
                    chunk["collection"] = collection_name
                    chunk["type"] = collection_config.get("description", "")

                # Create collection
                progress.update(task, advance=20, description=f"Creating collection {collection_name}...")
                vectorstore.create_collection(
                    collection_name,
                    metadata={"description": collection_config.get("description", "")}
                )

                # Add chunks
                progress.update(task, advance=20, description=f"Adding chunks to {collection_name}...")
                num_added = vectorstore.add_chunks(collection_name, chunks)

                # Update stats
                stats[collection_name] = {
                    "documents": len(documents),
                    "chunks": num_added
                }

                progress.update(task, completed=100)

        # Display statistics
        console.print("\n[bold green]✓ Ingestion terminée![/bold green]\n")

        table = Table(title="Statistiques d'ingestion")
        table.add_column("Collection", style="cyan")
        table.add_column("Documents", justify="right", style="magenta")
        table.add_column("Chunks", justify="right", style="green")

        total_docs = 0
        total_chunks = 0

        for collection_name, stat in stats.items():
            table.add_row(
                collection_name,
                str(stat["documents"]),
                str(stat["chunks"])
            )
            total_docs += stat["documents"]
            total_chunks += stat["chunks"]

        table.add_row(
            "[bold]TOTAL[/bold]",
            f"[bold]{total_docs}[/bold]",
            f"[bold]{total_chunks}[/bold]",
            style="bold"
        )

        console.print(table)
        console.print(f"\n[green]Base vectorielle créée dans: {config.get_chroma_path()}[/green]\n")

    except Exception as e:
        console.print(f"\n[bold red]❌ Erreur: {e}[/bold red]\n")
        import traceback
        console.print(f"[dim]{traceback.format_exc()}[/dim]")
        sys.exit(1)


if __name__ == "__main__":
    main()
