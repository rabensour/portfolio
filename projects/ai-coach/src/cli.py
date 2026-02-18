"""
Command-line interface for AI Coach.
Interactive chat interface with special commands.
"""

from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from rich.table import Table
from typing import Optional
from coach import AICoach


class CoachCLI:
    """CLI interface for AI Coach."""

    def __init__(self, coach: AICoach):
        """
        Initialize CLI.

        Args:
            coach: AICoach instance
        """
        self.coach = coach
        self.console = Console()
        self.running = False

    def display_welcome(self):
        """Display welcome message."""
        welcome_text = """
# 🤖 Coach IA Personnel

Bienvenue ! Je suis votre coach personnel. Je connais votre histoire, vos patterns, et vos objectifs.

**Commandes disponibles:**
- `/help` - Afficher l'aide
- `/new` - Nouvelle session
- `/history` - Voir les sessions récentes
- `/status` - État de la base vectorielle
- `/exit` - Quitter

Posez-moi une question ou décrivez votre état actuel.
        """
        self.console.print(Panel(Markdown(welcome_text), border_style="cyan"))

        # Display session info
        session_id = self.coach.conversation_manager.current_session_id
        self.console.print(f"[dim]Session: {session_id}[/dim]\n")

    def display_help(self):
        """Display help message."""
        help_text = """
## Aide - Coach IA

**Commandes:**
- `/help` - Afficher cette aide
- `/new` - Démarrer une nouvelle session
- `/history` - Voir les 5 dernières sessions
- `/status` - Voir l'état de la base vectorielle
- `/exit` - Quitter le coach

**Utilisation:**
Parlez simplement au coach comme si vous parliez à un ami. Le coach:
- Connaît votre histoire et vos patterns
- Détecte votre état (fatigue, énergie, résistance)
- Vous donne UNE directive claire, pas 10 options
- Challenge vos patterns d'auto-sabotage

**Exemples:**
- "Je suis fatigué, je ne sais pas quoi faire"
- "J'ai de l'énergie, c'est quoi la prochaine étape?"
- "Je procrastine sur ce projet, aide-moi"
        """
        self.console.print(Panel(Markdown(help_text), border_style="yellow"))

    def display_history(self):
        """Display recent sessions."""
        sessions = self.coach.conversation_manager.get_recent_sessions(5)

        if not sessions:
            self.console.print("[yellow]Aucune session précédente.[/yellow]\n")
            return

        table = Table(title="Sessions récentes")
        table.add_column("Date", style="cyan")
        table.add_column("Session ID", style="magenta")
        table.add_column("Échanges", justify="right", style="green")
        table.add_column("Résumé", style="white")

        for session in sessions:
            table.add_row(
                session.get("date", "Unknown"),
                session.get("session_id", "Unknown"),
                str(len(session.get("exchanges", []))),
                session.get("summary", "")[:60] + "..." if len(session.get("summary", "")) > 60 else session.get("summary", "")
            )

        self.console.print(table)
        self.console.print()

    def display_status(self):
        """Display vectorstore status."""
        try:
            collections = self.coach.rag_engine.vectorstore.list_collections()

            if not collections:
                self.console.print("[yellow]Aucune collection trouvée.[/yellow]\n")
                return

            table = Table(title="État de la base vectorielle")
            table.add_column("Collection", style="cyan")
            table.add_column("Documents", justify="right", style="green")

            total = 0
            for collection_name in sorted(collections):
                count = self.coach.rag_engine.vectorstore.get_collection_count(collection_name)
                table.add_row(collection_name, str(count))
                total += count

            table.add_row("[bold]TOTAL[/bold]", f"[bold]{total}[/bold]", style="bold")

            self.console.print(table)
            self.console.print()

        except Exception as e:
            self.console.print(f"[red]Erreur lors de la récupération du statut: {e}[/red]\n")

    def process_command(self, user_input: str) -> bool:
        """
        Process special commands.

        Args:
            user_input: User's input

        Returns:
            True if command was processed, False otherwise
        """
        command = user_input.strip().lower()

        if command == "/help":
            self.display_help()
            return True

        elif command == "/new":
            self.coach.save_session()
            session_id = self.coach.conversation_manager.start_new_session()
            self.console.print(f"[green]✓ Nouvelle session créée: {session_id}[/green]\n")
            return True

        elif command == "/history":
            self.display_history()
            return True

        elif command == "/status":
            self.display_status()
            return True

        elif command == "/exit":
            self.console.print("\n[cyan]Sauvegarde de la session...[/cyan]")
            self.coach.save_session()
            self.console.print("[green]✓ Session sauvegardée. À bientôt ![/green]\n")
            self.running = False
            return True

        return False

    def run(self):
        """Run the interactive CLI."""
        self.running = True
        self.display_welcome()

        while self.running:
            try:
                # Get user input
                user_input = self.console.input("[bold cyan]Vous:[/bold cyan] ").strip()

                if not user_input:
                    continue

                # Check for commands
                if self.process_command(user_input):
                    continue

                # Get coach response
                self.console.print("\n[dim]Coach réfléchit...[/dim]")
                response = self.coach.get_response(user_input)

                # Display response
                self.console.print(f"\n[bold green]Coach:[/bold green] {response}\n")

            except KeyboardInterrupt:
                self.console.print("\n\n[yellow]Session interrompue.[/yellow]")
                self.process_command("/exit")
                break

            except Exception as e:
                self.console.print(f"\n[bold red]Erreur: {e}[/bold red]\n")
                import traceback
                self.console.print(f"[dim]{traceback.format_exc()}[/dim]")
