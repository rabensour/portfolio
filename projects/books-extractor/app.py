"""
📚 Book Essence Extractor — Web Interface
==========================================
Lance avec: python3 app.py
Puis ouvre: http://localhost:5000
"""

import os
import sys
import json
import re
import requests
from pathlib import Path
from flask import Flask, render_template, request, jsonify, send_from_directory
import threading

app = Flask(__name__, template_folder=".", static_folder="static")

# ── Configuration ──────────────────────────────────────────────
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
AIRTABLE_API_KEY = os.environ.get("AIRTABLE_API_KEY", "")
AIRTABLE_BASE_ID = "appIdoa73xYGYMaJi"
AIRTABLE_TABLE_ID = "tblLnTMGAiJvdaue9"
CLAUDE_MODEL = "claude-opus-4-20250514"

# ── Fonctions de recherche ─────────────────────────────────────

def search_gutenberg(title, author):
    try:
        query = f"{title} {author}".strip()
        url = f"https://gutendex.com/books/?search={requests.utils.quote(query)}"
        resp = requests.get(url, timeout=10)
        data = resp.json()
        if data.get("results"):
            book = data["results"][0]
            formats = book.get("formats", {})
            for fmt_key in ["text/plain; charset=utf-8", "text/plain", "text/plain; charset=us-ascii"]:
                if fmt_key in formats:
                    text_resp = requests.get(formats[fmt_key], timeout=30)
                    if text_resp.ok:
                        return text_resp.text[:500_000], f"✅ Texte trouvé sur Gutenberg: {book.get('title')}"
        return "", "ℹ️ Livre non trouvé sur Gutenberg"
    except Exception as e:
        return "", f"⚠️ Erreur Gutenberg: {e}"


def search_openlibrary(title, author):
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
            return info, "✅ Métadonnées Open Library trouvées"
        return "", "ℹ️ Rien trouvé sur Open Library"
    except Exception as e:
        return "", f"⚠️ Erreur Open Library: {e}"


def search_wikiquote(title, author):
    citations = ""
    logs = []
    for lang, base_url in [("fr", "https://fr.wikiquote.org"), ("en", "https://en.wikiquote.org")]:
        try:
            for search_term in [title, author]:
                url = f"{base_url}/w/api.php?action=query&list=search&srsearch={requests.utils.quote(search_term)}&format=json&srlimit=3"
                resp = requests.get(url, timeout=10)
                data = resp.json()
                results = data.get("query", {}).get("search", [])
                if results:
                    page_title = results[0]["title"]
                    content_url = f"{base_url}/w/api.php?action=query&titles={requests.utils.quote(page_title)}&prop=extracts&explaintext=true&format=json"
                    content_resp = requests.get(content_url, timeout=10)
                    pages = content_resp.json().get("query", {}).get("pages", {})
                    for page in pages.values():
                        extract = page.get("extract", "")
                        if extract:
                            citations += f"\n--- Wikiquote ({lang}) - {page_title} ---\n{extract[:5000]}\n"
                            logs.append(f"✅ Citations Wikiquote ({lang}): {page_title}")
        except Exception as e:
            logs.append(f"⚠️ Erreur Wikiquote ({lang}): {e}")
    return citations, logs


def extract_text_from_pdf(filepath):
    try:
        from PyPDF2 import PdfReader
        reader = PdfReader(filepath)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        return ""


def extract_text_from_epub(filepath):
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
    except Exception as e:
        return ""


# ── Claude Opus ────────────────────────────────────────────────

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


def analyze_with_claude(title, author, source_text, wikiquotes, ol_info):
    from anthropic import Anthropic
    client = Anthropic(api_key=ANTHROPIC_API_KEY)

    user_message = f"Analyse ce livre: **{title}** de **{author}**\n\n"

    if source_text:
        max_chars = 600_000
        if len(source_text) > max_chars:
            source_text = source_text[:max_chars] + "\n\n[... texte tronqué ...]"
        user_message += f"=== TEXTE SOURCE DU LIVRE ===\n{source_text}\n\n"

    if wikiquotes:
        user_message += f"=== CITATIONS WIKIQUOTE ===\n{wikiquotes}\n\n"

    if ol_info:
        user_message += f"=== MÉTADONNÉES OPEN LIBRARY ===\n{ol_info}\n\n"

    if not source_text:
        user_message += "⚠️ AUCUN TEXTE SOURCE DISPONIBLE. Utilise uniquement tes connaissances mais sois TRÈS prudent avec les citations — indique '[citation approximative]' si tu n'es pas certain à 100%.\n\n"

    user_message += "Réponds en JSON valide uniquement."

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}]
    )

    text = response.content[0].text.strip()
    text = re.sub(r'^```json\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    return json.loads(text)


def push_to_airtable(data):
    from pyairtable import Api as AirtableApi
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
    return result["id"]


# ── Routes Flask ───────────────────────────────────────────────

@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    title = data.get("title", "").strip()
    author = data.get("author", "").strip()

    if not title or not author:
        return jsonify({"error": "Titre et auteur requis"}), 400

    logs = []
    source_text = ""

    # 1. Fichier uploadé
    # (géré séparément via /upload)

    # 2. Gutenberg
    logs.append("🔍 Recherche sur Project Gutenberg...")
    gt_text, gt_log = search_gutenberg(title, author)
    source_text = gt_text
    logs.append(gt_log)

    # 3. Open Library
    logs.append("🔍 Recherche sur Open Library...")
    ol_info, ol_log = search_openlibrary(title, author)
    logs.append(ol_log)

    # 4. Wikiquote
    logs.append("🔍 Recherche sur Wikiquote...")
    wq_text, wq_logs = search_wikiquote(title, author)
    logs.extend(wq_logs)

    # 5. Claude
    logs.append(f"🤖 Envoi à Claude Opus... (~{len(source_text + wq_text + ol_info) // 4:,} tokens)")
    try:
        result = analyze_with_claude(title, author, source_text, wq_text, ol_info)
        logs.append("✅ Analyse terminée!")
    except Exception as e:
        logs.append(f"❌ Erreur Claude: {e}")
        return jsonify({"error": str(e), "logs": logs}), 500

    return jsonify({"result": result, "logs": logs})


@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "Pas de fichier"}), 400

    file = request.files["file"]
    filename = file.filename.lower()
    
    # Sauvegarder temporairement
    tmp_path = f"/tmp/{file.filename}"
    file.save(tmp_path)

    text = ""
    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(tmp_path)
    elif filename.endswith(".epub"):
        text = extract_text_from_epub(tmp_path)
    elif filename.endswith(".txt"):
        text = Path(tmp_path).read_text(encoding="utf-8", errors="ignore")

    os.remove(tmp_path)
    return jsonify({"text": text[:500_000], "chars": len(text)})


@app.route("/push", methods=["POST"])
def push():
    data = request.json
    try:
        record_id = push_to_airtable(data)
        return jsonify({"success": True, "id": record_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    if not ANTHROPIC_API_KEY:
        sys.exit("❌ Configure ANTHROPIC_API_KEY")
    if not AIRTABLE_API_KEY:
        sys.exit("❌ Configure AIRTABLE_API_KEY")

    print("\n📚 Book Essence Extractor")
    print("   Ouvre http://localhost:5000\n")
    app.run(debug=True, port=5000)
