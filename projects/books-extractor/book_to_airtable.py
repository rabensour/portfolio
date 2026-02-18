"""
📚 Book Essence Extractor → Airtable
=====================================
Extrait l'essence d'un livre via Claude Opus + sources textuelles,
puis envoie le tout dans Airtable.

Prérequis:
    pip install anthropic requests pyairtable ebooklib beautifulsoup4 PyPDF2

Configuration:
    Crée un fichier .env ou exporte ces variables:
    - ANTHROPIC_API_KEY=sk-ant-...
    - AIRTABLE_API_KEY=pat...
"""

import os
import sys
import json
import re
import requests
from pathlib import Path

try:
    from anthropic import Anthropic
except ImportError:
    sys.exit("❌ Installe anthropic: pip install anthropic")

try:
    from pyairtable import Api as AirtableApi
except ImportError:
    sys.exit("❌ Installe pyairtable: pip install pyairtable")

# ── Configuration ──────────────────────────────────────────────
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
AIRTABLE_API_KEY = os.environ.get("AIRTABLE_API_KEY", "")
AIRTABLE_BASE_ID = "appIdoa73xYGYMaJi"
AIRTABLE_TABLE_ID = "tblLnTMGAiJvdaue9"
CLAUDE_MODEL = "claude-opus-4-20250514"

# ── Extraction de texte depuis PDF/EPUB ────────────────────────

def extract_text_from_pdf(filepath: str) -> str:
    """Extrait le texte d'un fichier PDF."""
    try:
        from PyPDF2 import PdfReader
        reader = PdfReader(filepath)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except ImportError:
        print("⚠️  PyPDF2 non installé, impossible de lire le PDF")
        return ""
    except Exception as e:
        print(f"⚠️  Erreur lecture PDF: {e}")
        return ""


def extract_text_from_epub(filepath: str) -> str:
    """Extrait le texte d'un fichier EPUB."""
    try:
        import ebooklib
        from ebooklib import epub
        from bs4 import BeautifulSoup
        book = epub.read_epub(filepath)
        text = ""
        for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
            soup = BeautifulSoup(item.get_content(), "html.parser")
            text += soup.get_text() + "\n"
        return text
    except ImportError:
        print("⚠️  ebooklib/bs4 non installés, impossible de lire l'EPUB")
        return ""
    except Exception as e:
        print(f"⚠️  Erreur lecture EPUB: {e}")
        return ""


def extract_text_from_file(filepath: str) -> str:
    """Détecte le format et extrait le texte."""
    filepath = filepath.strip().strip('"').strip("'")
    p = Path(filepath)
    if not p.exists():
        print(f"⚠️  Fichier introuvable: {filepath}")
        return ""
    ext = p.suffix.lower()
    if ext == ".pdf":
        return extract_text_from_pdf(filepath)
    elif ext == ".epub":
        return extract_text_from_epub(filepath)
    elif ext == ".txt":
        return p.read_text(encoding="utf-8", errors="ignore")
    else:
        print(f"⚠️  Format non supporté: {ext}")
        return ""


# ── Recherche de texte en ligne (Gutenberg, Open Library) ──────

def search_gutenberg(title: str, author: str) -> str:
    """Cherche le texte sur Project Gutenberg."""
    try:
        query = f"{title} {author}".strip()
        url = f"https://gutendex.com/books/?search={requests.utils.quote(query)}"
        resp = requests.get(url, timeout=10)
        data = resp.json()
        if data.get("results"):
            book = data["results"][0]
            # Chercher le format texte
            formats = book.get("formats", {})
            for fmt_key in ["text/plain; charset=utf-8", "text/plain", "text/plain; charset=us-ascii"]:
                if fmt_key in formats:
                    text_url = formats[fmt_key]
                    text_resp = requests.get(text_url, timeout=30)
                    if text_resp.ok:
                        print(f"✅ Texte trouvé sur Gutenberg: {book.get('title')}")
                        return text_resp.text[:500_000]  # Limiter à ~500K chars
        print("ℹ️  Livre non trouvé sur Gutenberg")
        return ""
    except Exception as e:
        print(f"⚠️  Erreur Gutenberg: {e}")
        return ""


def search_openlibrary(title: str, author: str) -> str:
    """Cherche des infos sur Open Library (métadonnées + extraits)."""
    try:
        query = f"{title} {author}".strip()
        url = f"https://openlibrary.org/search.json?q={requests.utils.quote(query)}&limit=1"
        resp = requests.get(url, timeout=10)
        data = resp.json()
        if data.get("docs"):
            doc = data["docs"][0]
            info = f"Titre: {doc.get('title', 'N/A')}\n"
            info += f"Auteur: {', '.join(doc.get('author_name', ['N/A']))}\n"
            info += f"Première publication: {doc.get('first_publish_year', 'N/A')}\n"
            info += f"Sujets: {', '.join(doc.get('subject', [])[:10])}\n"
            if doc.get('first_sentence'):
                sentences = doc['first_sentence']
                if isinstance(sentences, list):
                    info += f"Première phrase: {sentences[0]}\n"
                else:
                    info += f"Première phrase: {sentences}\n"
            print(f"✅ Métadonnées trouvées sur Open Library")
            return info
        return ""
    except Exception as e:
        print(f"⚠️  Erreur Open Library: {e}")
        return ""


def search_wikiquote(title: str, author: str) -> str:
    """Cherche des citations vérifiées sur Wikiquote."""
    citations = ""
    for lang, base_url in [("fr", "https://fr.wikiquote.org"), ("en", "https://en.wikiquote.org")]:
        try:
            # Chercher par titre du livre puis par auteur
            for search_term in [title, author]:
                url = f"{base_url}/w/api.php?action=query&list=search&srsearch={requests.utils.quote(search_term)}&format=json&srlimit=3"
                resp = requests.get(url, timeout=10)
                data = resp.json()
                results = data.get("query", {}).get("search", [])
                if results:
                    page_title = results[0]["title"]
                    # Récupérer le contenu
                    content_url = f"{base_url}/w/api.php?action=query&titles={requests.utils.quote(page_title)}&prop=extracts&explaintext=true&format=json"
                    content_resp = requests.get(content_url, timeout=10)
                    pages = content_resp.json().get("query", {}).get("pages", {})
                    for page in pages.values():
                        extract = page.get("extract", "")
                        if extract:
                            citations += f"\n--- Wikiquote ({lang}) - {page_title} ---\n{extract[:5000]}\n"
                            print(f"✅ Citations trouvées sur Wikiquote ({lang}): {page_title}")
        except Exception as e:
            print(f"⚠️  Erreur Wikiquote ({lang}): {e}")
    return citations


# ── Appel à Claude Opus ────────────────────────────────────────

SYSTEM_PROMPT = """Tu es un expert en analyse littéraire et philosophique. Tu dois extraire l'essence d'un livre avec une précision absolue.

RÈGLES CRITIQUES:
1. CITATIONS: Extrais UNIQUEMENT des citations qui apparaissent VERBATIM dans le texte source fourni. Si aucun texte source n'est fourni, utilise uniquement des citations que tu connais avec CERTITUDE comme étant exactes. Si tu n'es pas sûr à 100%, indique "[citation approximative]" à côté.
2. Donne les citations en langue originale ET traduites en français.
3. RÉSUMÉ: Sois précis et substantiel, pas vague. Donne les idées centrales, la thèse principale, la structure argumentative.
4. ENSEIGNEMENTS: Les leçons profondes et pratiques qu'on peut tirer du livre.
5. Tout en français SAUF les citations originales.

Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
    "livre": "Titre (Année)",
    "auteur": "Nom complet",
    "sujet": "Description concise du sujet principal (1-2 phrases)",
    "resume": "Résumé substantiel du livre (3-5 paragraphes)",
    "enseignements": "Les 5-7 enseignements majeurs du livre, numérotés",
    "citations": "5 citations exactes, chacune avec: citation originale + traduction française si nécessaire + contexte/chapitre si connu"
}"""


def analyze_book(title: str, author: str, source_text: str, wikiquotes: str, openlibrary_info: str) -> dict:
    """Envoie le tout à Claude Opus pour analyse."""
    client = Anthropic(api_key=ANTHROPIC_API_KEY)

    user_message = f"Analyse ce livre: **{title}** de **{author}**\n\n"

    if source_text:
        # Tronquer si trop long (laisser de la place pour le reste)
        max_chars = 600_000  # ~150K tokens
        if len(source_text) > max_chars:
            source_text = source_text[:max_chars] + "\n\n[... texte tronqué ...]"
        user_message += f"=== TEXTE SOURCE DU LIVRE ===\n{source_text}\n\n"

    if wikiquotes:
        user_message += f"=== CITATIONS WIKIQUOTE (pour vérification) ===\n{wikiquotes}\n\n"

    if openlibrary_info:
        user_message += f"=== MÉTADONNÉES OPEN LIBRARY ===\n{openlibrary_info}\n\n"

    if not source_text:
        user_message += "⚠️ AUCUN TEXTE SOURCE DISPONIBLE. Utilise uniquement tes connaissances mais sois TRÈS prudent avec les citations — indique '[citation approximative]' si tu n'es pas certain à 100%.\n\n"

    user_message += "Réponds en JSON valide uniquement."

    print(f"\n🤖 Envoi à Claude Opus ({CLAUDE_MODEL})...")
    print(f"   Taille du contexte: ~{len(user_message) // 4:,} tokens")

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}]
    )

    text = response.content[0].text.strip()

    # Nettoyer le JSON (enlever ```json ... ``` si présent)
    text = re.sub(r'^```json\s*', '', text)
    text = re.sub(r'\s*```$', '', text)

    try:
        data = json.loads(text)
        print("✅ Analyse terminée avec succès")
        return data
    except json.JSONDecodeError as e:
        print(f"⚠️  Erreur parsing JSON: {e}")
        print(f"Réponse brute:\n{text[:500]}")
        return {}


# ── Push vers Airtable ─────────────────────────────────────────

def push_to_airtable(data: dict):
    """Envoie les données dans Airtable."""
    api = AirtableApi(AIRTABLE_API_KEY)
    table = api.table(AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID)

    record = {
        "Livre": data.get("livre", ""),
        "Auteur": data.get("auteur", ""),
        "Sujet": data.get("sujet", ""),
        "Résumé": data.get("resume", ""),
        "Enseignements": data.get("enseignements", ""),
        "Citations": data.get("citations", ""),
    }

    result = table.create(record)
    print(f"✅ Enregistré dans Airtable! (ID: {result['id']})")
    return result


# ── Programme principal ────────────────────────────────────────

def process_book(title: str, author: str, file_path: str = None):
    """Pipeline complet pour un livre."""
    print(f"\n{'='*60}")
    print(f"📚 {title} — {author}")
    print(f"{'='*60}")

    # 1. Texte source
    source_text = ""
    if file_path:
        print(f"\n📄 Extraction du texte depuis: {file_path}")
        source_text = extract_text_from_file(file_path)
        if source_text:
            print(f"   → {len(source_text):,} caractères extraits")

    if not source_text:
        print(f"\n🔍 Recherche sur Gutenberg...")
        source_text = search_gutenberg(title, author)

    # 2. Sources complémentaires
    print(f"\n🔍 Recherche sur Open Library...")
    ol_info = search_openlibrary(title, author)

    print(f"\n🔍 Recherche de citations sur Wikiquote...")
    wikiquotes = search_wikiquote(title, author)

    # 3. Analyse par Claude
    data = analyze_book(title, author, source_text, wikiquotes, ol_info)
    if not data:
        print("❌ Échec de l'analyse")
        return

    # 4. Aperçu avant envoi
    print(f"\n{'─'*60}")
    print(f"📖 APERÇU:")
    print(f"{'─'*60}")
    print(f"Livre: {data.get('livre', 'N/A')}")
    print(f"Auteur: {data.get('auteur', 'N/A')}")
    print(f"Sujet: {data.get('sujet', 'N/A')[:100]}...")
    print(f"Résumé: {data.get('resume', 'N/A')[:200]}...")
    print(f"Enseignements: {data.get('enseignements', 'N/A')[:200]}...")
    print(f"Citations: {data.get('citations', 'N/A')[:200]}...")
    print(f"{'─'*60}")

    confirm = input("\n✅ Envoyer dans Airtable ? (o/n): ").strip().lower()
    if confirm in ("o", "oui", "y", "yes", ""):
        push_to_airtable(data)
    else:
        # Sauvegarder en local
        filename = f"book_{title.replace(' ', '_')[:30]}.json"
        Path(filename).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"💾 Sauvegardé localement: {filename}")


def main():
    # Vérification des clés
    if not ANTHROPIC_API_KEY:
        sys.exit("❌ Configure ANTHROPIC_API_KEY (export ANTHROPIC_API_KEY=sk-ant-...)")
    if not AIRTABLE_API_KEY:
        sys.exit("❌ Configure AIRTABLE_API_KEY (export AIRTABLE_API_KEY=pat...)")

    print("""
╔══════════════════════════════════════════╗
║   📚 Book Essence Extractor → Airtable  ║
╠══════════════════════════════════════════╣
║  Extrais l'essence d'un livre et        ║
║  envoie-la directement dans Airtable.   ║
╚══════════════════════════════════════════╝
    """)

    while True:
        print("\n" + "─" * 40)
        title = input("📕 Titre du livre (ou 'q' pour quitter): ").strip()
        if title.lower() in ("q", "quit", "exit"):
            print("👋 À bientôt!")
            break

        author = input("✍️  Auteur: ").strip()

        file_path = input("📄 Chemin vers PDF/EPUB/TXT (Entrée pour passer): ").strip()
        if not file_path:
            file_path = None

        process_book(title, author, file_path)


if __name__ == "__main__":
    main()
