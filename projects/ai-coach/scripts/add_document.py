"""
Script to add a new document to an existing collection.
"""

import sys
import argparse
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from config import get_config
from document_loader import DocumentLoader
from text_chunker import TextChunker
from vectorstore import VectorStore
from rich.console import Console


def main():
    """Main function."""
    console = Console()

    # Parse arguments
    parser = argparse.ArgumentParser(description="Add a document to an AI Coach collection")
    parser.add_argument("--collection", required=True, help="Collection name")
    parser.add_argument("--file", required=True, help="Path to the document file")

    args = parser.parse_args()

    console.print(f"\n[bold cyan]📄 Adding document to collection: {args.collection}[/bold cyan]\n")

    try:
        # Validate file
        file_path = Path(args.file)
        if not file_path.exists():
            console.print(f"[red]❌ File not found: {args.file}[/red]")
            sys.exit(1)

        # Load configuration
        config = get_config()

        # Validate collection
        if args.collection not in config.collections:
            console.print(f"[red]❌ Unknown collection: {args.collection}[/red]")
            console.print(f"Available collections: {', '.join(config.collections.keys())}")
            sys.exit(1)

        # Initialize components
        vectorstore = VectorStore(str(config.get_chroma_path()))
        chunker = TextChunker(
            chunk_size=config.chunk_size,
            chunk_overlap=config.chunk_overlap
        )
        loader = DocumentLoader()

        # Load document
        console.print(f"[yellow]Loading document: {file_path.name}...[/yellow]")
        content, metadata = loader.load_document(str(file_path))

        # Chunk document
        console.print("[yellow]Chunking document...[/yellow]")
        chunks = chunker.chunk_text(content, metadata)

        # Add collection metadata
        collection_config = config.collections[args.collection]
        for chunk in chunks:
            chunk["collection"] = args.collection
            chunk["type"] = collection_config.get("description", "")

        # Ensure collection exists
        if not vectorstore.collection_exists(args.collection):
            console.print(f"[yellow]Creating collection: {args.collection}...[/yellow]")
            vectorstore.create_collection(
                args.collection,
                metadata={"description": collection_config.get("description", "")}
            )
        else:
            vectorstore.collections[args.collection] = vectorstore.client.get_collection(args.collection)

        # Add chunks
        console.print(f"[yellow]Adding {len(chunks)} chunks to {args.collection}...[/yellow]")
        num_added = vectorstore.add_chunks(args.collection, chunks)

        console.print(f"\n[bold green]✓ Document added successfully![/bold green]")
        console.print(f"  File: {file_path.name}")
        console.print(f"  Collection: {args.collection}")
        console.print(f"  Chunks added: {num_added}\n")

    except Exception as e:
        console.print(f"\n[bold red]❌ Error: {e}[/bold red]\n")
        import traceback
        console.print(f"[dim]{traceback.format_exc()}[/dim]")
        sys.exit(1)


if __name__ == "__main__":
    main()
