"""
Main entry point for AI Coach.
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from config import get_config
from vectorstore import VectorStore
from rag_engine import RAGEngine
from conversation_manager import ConversationManager
from coach import AICoach
from cli import CoachCLI
from rich.console import Console


def main():
    """Main function."""
    console = Console()

    try:
        # Load configuration
        console.print("[dim]Chargement de la configuration...[/dim]")
        config = get_config()

        # Initialize vectorstore
        console.print("[dim]Connexion à la base vectorielle...[/dim]")
        vectorstore = VectorStore(str(config.get_chroma_path()))

        # Check if database has been initialized
        collections = vectorstore.list_collections()
        if not collections or len(collections) == 0:
            console.print("\n[bold red]❌ Base vectorielle vide![/bold red]\n")
            console.print("[yellow]Veuillez d'abord ingérer vos documents:[/yellow]")
            console.print("[cyan]  python scripts/ingest_all.py[/cyan]\n")
            sys.exit(1)

        # Initialize RAG engine
        console.print("[dim]Initialisation du moteur RAG...[/dim]")
        rag_engine = RAGEngine(vectorstore, config)

        # Initialize conversation manager
        console.print("[dim]Préparation du gestionnaire de conversations...[/dim]")
        conversation_manager = ConversationManager(
            str(config.get_conversation_history_path()),
            auto_ingest_every=config.auto_ingest_history_every
        )

        # Start new session
        conversation_manager.start_new_session()

        # Initialize coach
        console.print("[dim]Initialisation du coach IA...[/dim]")
        coach = AICoach(rag_engine, conversation_manager, config)

        # Start CLI
        console.print("[dim]Démarrage de l'interface...[/dim]\n")
        cli = CoachCLI(coach)
        cli.run()

    except FileNotFoundError as e:
        console.print(f"\n[bold red]❌ Fichier non trouvé: {e}[/bold red]\n")
        sys.exit(1)

    except ValueError as e:
        console.print(f"\n[bold red]❌ Erreur de configuration: {e}[/bold red]\n")
        sys.exit(1)

    except Exception as e:
        console.print(f"\n[bold red]❌ Erreur: {e}[/bold red]\n")
        import traceback
        console.print(f"[dim]{traceback.format_exc()}[/dim]")
        sys.exit(1)


if __name__ == "__main__":
    main()
