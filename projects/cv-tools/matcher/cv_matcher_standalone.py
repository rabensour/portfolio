#!/usr/bin/env python3
"""
CV Matcher - Analyse et adapte un CV pour une offre d'emploi
Utilise Claude API avec maximum 2 appels pour tout le workflow
"""

import os
import sys
import json
import re
from datetime import datetime
from pathlib import Path

from pypdf import PdfReader
from anthropic import Anthropic
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY


# Couleurs du design - Modern palette
DARK_BLUE = colors.HexColor("#1A365D")  # Deep navy
ACCENT_BLUE = colors.HexColor("#2B6CB0")  # Accent blue
MEDIUM_GREY = colors.HexColor("#4A5568")  # Dark grey for text
LIGHT_GREY = colors.HexColor("#E2E8F0")  # Light separator
VERY_LIGHT = colors.HexColor("#F7FAFC")  # Background accent
WHITE = colors.white


def extract_pdf_text(pdf_path: str) -> str:
    """Extrait le texte d'un fichier PDF."""
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"Erreur lecture PDF: {e}")
        sys.exit(1)


def get_multiline_input(prompt: str) -> str:
    """Récupère une entrée multiligne de l'utilisateur."""
    print(prompt)
    print("(Entrez votre texte, puis tapez 'FIN' sur une nouvelle ligne pour terminer)")
    lines = []
    while True:
        line = input()
        if line.strip().upper() == "FIN":
            break
        lines.append(line)
    return "\n".join(lines)


def call_claude_scoring(client: Anthropic, cv_text: str, objectives: str, job_offer: str) -> dict:
    """
    APPEL API 1: Analyse et scoring
    Retourne les scores de matching profil et objectifs
    """
    system_prompt = """You are a tech recruitment expert. Analyze the CV, career objectives and job offer.
Reply ONLY with valid JSON, no text before or after."""

    user_prompt = f"""Analyze this CV against this job offer and career objectives.

=== CV ===
{cv_text}

=== CAREER OBJECTIVES ===
{objectives}

=== JOB OFFER ===
{job_offer}

=== INSTRUCTIONS ===
Evaluate the matching and respond with this exact JSON (nothing else):
{{
    "score_profil": <int 0-100>,
    "score_objectifs": <int 0-100>,
    "analyse_profil": "<2 sentences max on profile/offer fit, in English>",
    "analyse_objectifs": "<2 sentences max on alignment with objectives, in English>",
    "go_adapt": <true if both scores > 50, false otherwise>
}}"""

    response = client.messages.create(
        model="claude-opus-4-20250514",
        max_tokens=1500,
        messages=[{"role": "user", "content": user_prompt}],
        system=system_prompt
    )

    response_text = response.content[0].text.strip()

    # Extraction du JSON (gère les cas avec backticks markdown)
    json_match = re.search(r'\{[\s\S]*\}', response_text)
    if json_match:
        response_text = json_match.group()

    try:
        return json.loads(response_text)
    except json.JSONDecodeError as e:
        print(f"Erreur parsing JSON scoring: {e}")
        print(f"Réponse brute: {response_text}")
        sys.exit(1)


def call_claude_adaptation(client: Anthropic, cv_text: str, objectives: str, job_offer: str) -> dict:
    """
    APPEL API 2: Adaptation CV + Cover Letter
    Génère le CV adapté et la lettre de motivation en un seul appel
    """
    system_prompt = """You are an expert CV and cover letter writer for the tech industry.
Reply ONLY with valid JSON, no text before or after. ALL content must be in ENGLISH."""

    user_prompt = f"""Adapt this CV for the job offer below and generate a cover letter. ALL OUTPUT MUST BE IN ENGLISH.

=== ORIGINAL CV ===
{cv_text}

=== CANDIDATE OBJECTIVES ===
{objectives}

=== JOB OFFER ===
{job_offer}

=== CV ADAPTATION RULES ===
- Never invent experiences or fictional companies
- Can rephrase/reorganize existing skills to match the offer
- Can add adjacent skills ONLY if logically deducible from background
- Every addition must be defensible in a technical interview

=== COVER LETTER RULES ===
- 150-200 words MAX (3 short paragraphs)
- Professional but human tone, no corporate bullshit
- NO generic phrases like "I am passionate and motivated"
- Structure: direct hook → 2-3 concrete points → simple closing
- Must sound human, can include a touch of personality

=== REQUIRED JSON FORMAT ===
{{
    "cv_adapte": {{
        "nom": "<full name>",
        "titre": "<professional title adapted to the offer>",
        "contact": {{
            "email": "<email>",
            "telephone": "<phone>",
            "localisation": "<city/country>",
            "linkedin": "<linkedin url if present>"
        }},
        "resume": "<3-4 sentence profile adapted to the offer, in English>",
        "competences": {{
            "principales": ["<skill1>", "<skill2>", ...],
            "outils": ["<tool1>", "<tool2>", ...],
            "langues": ["<language1>", "<language2>", ...]
        }},
        "experiences": [
            {{
                "poste": "<job title in English>",
                "entreprise": "<company name>",
                "periode": "<dates>",
                "description": "<description rephrased to match offer, in English>",
                "realisations": ["<achievement1>", "<achievement2>", ...]
            }}
        ],
        "formations": [
            {{
                "diplome": "<degree name>",
                "etablissement": "<school>",
                "annee": "<year>"
            }}
        ],
        "certifications": ["<cert1>", "<cert2>", ...],
        "projets": [
            {{
                "nom": "<project name>",
                "description": "<short description in English>"
            }}
        ]
    }},
    "cover_letter": {{
        "entreprise": "<company name from offer, or 'Company' if not mentioned>",
        "poste": "<job title>",
        "contenu": "<full cover letter text, 150-200 words, in ENGLISH>"
    }}
}}

Reply ONLY with this JSON, nothing else. EVERYTHING must be in ENGLISH."""

    response = client.messages.create(
        model="claude-opus-4-20250514",
        max_tokens=3000,
        messages=[{"role": "user", "content": user_prompt}],
        system=system_prompt
    )

    response_text = response.content[0].text.strip()

    # Extraction du JSON
    json_match = re.search(r'\{[\s\S]*\}', response_text)
    if json_match:
        response_text = json_match.group()

    try:
        return json.loads(response_text)
    except json.JSONDecodeError as e:
        print(f"Erreur parsing JSON adaptation: {e}")
        print(f"Réponse brute: {response_text[:500]}...")
        sys.exit(1)


def create_cv_styles():
    """Create styles for the CV PDF - Modern design."""
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        name='CVName',
        fontName='Helvetica-Bold',
        fontSize=26,
        textColor=DARK_BLUE,
        alignment=TA_LEFT,
        spaceAfter=3*mm,
        leading=30
    ))

    styles.add(ParagraphStyle(
        name='CVTitle',
        fontName='Helvetica',
        fontSize=13,
        textColor=ACCENT_BLUE,
        alignment=TA_LEFT,
        spaceAfter=4*mm,
        leading=16
    ))

    styles.add(ParagraphStyle(
        name='CVContact',
        fontName='Helvetica',
        fontSize=9,
        textColor=MEDIUM_GREY,
        alignment=TA_LEFT,
        spaceAfter=2*mm,
        leading=12
    ))

    styles.add(ParagraphStyle(
        name='CVSectionTitle',
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=DARK_BLUE,
        alignment=TA_LEFT,
        spaceBefore=6*mm,
        spaceAfter=3*mm,
        borderPadding=0,
        textTransform='uppercase',
        letterSpacing=1
    ))

    styles.add(ParagraphStyle(
        name='CVResume',
        fontName='Helvetica',
        fontSize=10,
        textColor=MEDIUM_GREY,
        alignment=TA_JUSTIFY,
        spaceAfter=4*mm,
        leading=14
    ))

    styles.add(ParagraphStyle(
        name='CVJobTitle',
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=DARK_BLUE,
        alignment=TA_LEFT,
        spaceBefore=4*mm,
        spaceAfter=1*mm,
        leading=13
    ))

    styles.add(ParagraphStyle(
        name='CVCompany',
        fontName='Helvetica-Oblique',
        fontSize=10,
        textColor=ACCENT_BLUE,
        alignment=TA_LEFT,
        spaceAfter=2*mm,
        leading=12
    ))

    styles.add(ParagraphStyle(
        name='CVText',
        fontName='Helvetica',
        fontSize=10,
        textColor=MEDIUM_GREY,
        alignment=TA_JUSTIFY,
        leading=13,
        spaceAfter=2*mm
    ))

    styles.add(ParagraphStyle(
        name='CVBullet',
        fontName='Helvetica',
        fontSize=9,
        textColor=MEDIUM_GREY,
        alignment=TA_LEFT,
        leftIndent=8*mm,
        bulletIndent=4*mm,
        leading=12,
        spaceBefore=1*mm
    ))

    styles.add(ParagraphStyle(
        name='CVSkillCategory',
        fontName='Helvetica-Bold',
        fontSize=9,
        textColor=ACCENT_BLUE,
        alignment=TA_LEFT,
        spaceAfter=1*mm,
        spaceBefore=2*mm
    ))

    styles.add(ParagraphStyle(
        name='CVSkills',
        fontName='Helvetica',
        fontSize=9,
        textColor=MEDIUM_GREY,
        alignment=TA_LEFT,
        spaceAfter=2*mm,
        leading=12
    ))

    return styles


def create_cover_letter_styles():
    """Create styles for the cover letter PDF - Modern design."""
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        name='CLHeader',
        fontName='Helvetica-Bold',
        fontSize=16,
        textColor=DARK_BLUE,
        alignment=TA_LEFT,
        spaceAfter=2*mm,
        leading=20
    ))

    styles.add(ParagraphStyle(
        name='CLContact',
        fontName='Helvetica',
        fontSize=9,
        textColor=MEDIUM_GREY,
        alignment=TA_LEFT,
        spaceAfter=1*mm,
        leading=11
    ))

    styles.add(ParagraphStyle(
        name='CLDate',
        fontName='Helvetica',
        fontSize=10,
        textColor=MEDIUM_GREY,
        alignment=TA_LEFT,
        spaceBefore=8*mm,
        spaceAfter=8*mm
    ))

    styles.add(ParagraphStyle(
        name='CLSubject',
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=ACCENT_BLUE,
        alignment=TA_LEFT,
        spaceBefore=4*mm,
        spaceAfter=6*mm,
        leading=14
    ))

    styles.add(ParagraphStyle(
        name='CLBody',
        fontName='Helvetica',
        fontSize=11,
        textColor=MEDIUM_GREY,
        alignment=TA_JUSTIFY,
        leading=16,
        spaceAfter=4*mm
    ))

    styles.add(ParagraphStyle(
        name='CLSignature',
        fontName='Helvetica',
        fontSize=11,
        textColor=DARK_BLUE,
        alignment=TA_LEFT,
        spaceBefore=8*mm,
        leading=14
    ))

    return styles


def generate_cv_pdf(cv_data: dict, output_path: str):
    """Génère le PDF du CV adapté."""
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=1.5*cm,
        leftMargin=1.5*cm,
        topMargin=1.5*cm,
        bottomMargin=1.5*cm
    )

    styles = create_cv_styles()
    story = []

    # En-tête: Nom
    story.append(Paragraph(cv_data.get('nom', 'Nom'), styles['CVName']))

    # Titre professionnel
    story.append(Paragraph(cv_data.get('titre', 'Professionnel'), styles['CVTitle']))

    # Contact
    contact = cv_data.get('contact', {})
    contact_parts = []
    if contact.get('email'):
        contact_parts.append(contact['email'])
    if contact.get('telephone'):
        contact_parts.append(contact['telephone'])
    if contact.get('localisation'):
        contact_parts.append(contact['localisation'])
    if contact.get('linkedin'):
        contact_parts.append(contact['linkedin'])

    if contact_parts:
        story.append(Paragraph(" | ".join(contact_parts), styles['CVContact']))

    # Separator line
    story.append(HRFlowable(width="100%", thickness=2, color=ACCENT_BLUE, spaceAfter=5*mm))

    # Profile Summary
    if cv_data.get('resume'):
        story.append(Paragraph("PROFILE", styles['CVSectionTitle']))
        story.append(Paragraph(cv_data['resume'], styles['CVResume']))

    # Skills
    competences = cv_data.get('competences', {})
    if competences:
        story.append(Paragraph("SKILLS", styles['CVSectionTitle']))

        if competences.get('principales'):
            story.append(Paragraph("Core Competencies", styles['CVSkillCategory']))
            story.append(Paragraph(" • ".join(competences['principales']), styles['CVSkills']))

        if competences.get('outils'):
            story.append(Paragraph("Tools & Technologies", styles['CVSkillCategory']))
            story.append(Paragraph(" • ".join(competences['outils']), styles['CVSkills']))

        if competences.get('langues'):
            story.append(Paragraph("Languages", styles['CVSkillCategory']))
            story.append(Paragraph(" • ".join(competences['langues']), styles['CVSkills']))

    # Experience
    experiences = cv_data.get('experiences', [])
    if experiences:
        story.append(Paragraph("PROFESSIONAL EXPERIENCE", styles['CVSectionTitle']))

        for exp in experiences:
            # Titre du poste
            story.append(Paragraph(exp.get('poste', ''), styles['CVJobTitle']))

            # Entreprise et période
            company_line = exp.get('entreprise', '')
            if exp.get('periode'):
                company_line += f" | {exp['periode']}"
            story.append(Paragraph(company_line, styles['CVCompany']))

            # Description
            if exp.get('description'):
                story.append(Paragraph(exp['description'], styles['CVText']))

            # Réalisations
            realisations = exp.get('realisations', [])
            for real in realisations:
                story.append(Paragraph(f"• {real}", styles['CVBullet']))

            story.append(Spacer(1, 3*mm))

    # Education
    formations = cv_data.get('formations', [])
    if formations:
        story.append(Paragraph("EDUCATION", styles['CVSectionTitle']))

        for form in formations:
            line = form.get('diplome', '')
            if form.get('etablissement'):
                line += f" - {form['etablissement']}"
            if form.get('annee'):
                line += f" ({form['annee']})"
            story.append(Paragraph(line, styles['CVText']))

    # Certifications
    certifications = cv_data.get('certifications', [])
    if certifications:
        story.append(Paragraph("CERTIFICATIONS", styles['CVSectionTitle']))
        story.append(Paragraph(" • ".join(certifications), styles['CVSkills']))

    # Projects
    projets = cv_data.get('projets', [])
    if projets:
        story.append(Paragraph("PROJECTS", styles['CVSectionTitle']))

        for projet in projets:
            story.append(Paragraph(f"<b>{projet.get('nom', '')}</b>", styles['CVText']))
            if projet.get('description'):
                story.append(Paragraph(projet['description'], styles['CVBullet']))

    doc.build(story)
    print(f"CV généré: {output_path}")


def generate_cover_letter_pdf(cl_data: dict, cv_data: dict, output_path: str):
    """Génère le PDF de la cover letter."""
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )

    styles = create_cover_letter_styles()
    story = []

    # En-tête avec coordonnées du candidat
    story.append(Paragraph(cv_data.get('nom', 'Candidat'), styles['CLHeader']))

    contact = cv_data.get('contact', {})
    if contact.get('email'):
        story.append(Paragraph(contact['email'], styles['CLContact']))
    if contact.get('telephone'):
        story.append(Paragraph(contact['telephone'], styles['CLContact']))
    if contact.get('localisation'):
        story.append(Paragraph(contact['localisation'], styles['CLContact']))

    # Separator line
    story.append(HRFlowable(width="100%", thickness=2, color=ACCENT_BLUE, spaceBefore=5*mm, spaceAfter=5*mm))

    # Date (English format)
    date_str = datetime.now().strftime("%B %d, %Y")
    story.append(Paragraph(date_str, styles['CLDate']))

    # Subject
    poste = cl_data.get('poste', 'the position')
    story.append(Paragraph(f"Re: Application for {poste}", styles['CLSubject']))

    # Corps de la lettre
    contenu = cl_data.get('contenu', '')
    # Séparer en paragraphes
    paragraphes = [p.strip() for p in contenu.split('\n\n') if p.strip()]
    if len(paragraphes) == 1:
        # Si pas de double saut de ligne, essayer avec simple
        paragraphes = [p.strip() for p in contenu.split('\n') if p.strip()]

    for para in paragraphes:
        story.append(Paragraph(para, styles['CLBody']))

    # Signature
    story.append(Paragraph("Best regards,", styles['CLSignature']))
    story.append(Spacer(1, 5*mm))
    story.append(Paragraph(cv_data.get('nom', ''), styles['CLSignature']))

    doc.build(story)
    print(f"Cover letter générée: {output_path}")


def sanitize_filename(name: str) -> str:
    """Nettoie un nom pour l'utiliser comme nom de fichier."""
    # Remplace les caractères non autorisés
    sanitized = re.sub(r'[<>:"/\\|?*]', '_', name)
    # Limite la longueur
    return sanitized[:50]


def main():
    print("=" * 60)
    print("CV MATCHER - Analyse et Adaptation de CV")
    print("=" * 60)
    print()

    # Vérification de la clé API
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Erreur: Variable d'environnement ANTHROPIC_API_KEY non définie")
        print("Définissez-la avec: export ANTHROPIC_API_KEY='votre-clé'")
        sys.exit(1)

    client = Anthropic()

    # Étape 1: Chemin du CV
    default_cv_path = r"C:\Users\Admin\Desktop\MyDocs\CVs\The CV"
    cv_path = input(f"Chemin du CV PDF [{default_cv_path}]: ").strip()
    if not cv_path:
        cv_path = default_cv_path

    # Normaliser le chemin selon le système
    import platform
    if platform.system() == "Windows":
        # Sous Windows, garder le chemin tel quel
        cv_path = os.path.normpath(cv_path)
    elif cv_path.startswith("C:"):
        # Sous WSL, convertir les chemins Windows
        cv_path = "/mnt/c" + cv_path[2:].replace("\\", "/")

    # Vérifier si c'est un dossier ou un fichier
    if os.path.isdir(cv_path):
        # Chercher un fichier PDF dans le dossier
        pdf_files = [f for f in os.listdir(cv_path) if f.lower().endswith('.pdf')]
        if pdf_files:
            cv_path = os.path.join(cv_path, pdf_files[0])
            print(f"Fichier PDF trouvé: {cv_path}")
        else:
            print(f"Aucun fichier PDF trouvé dans {cv_path}")
            sys.exit(1)

    if not os.path.exists(cv_path):
        print(f"Fichier non trouvé: {cv_path}")
        sys.exit(1)

    print(f"\nExtraction du CV: {cv_path}")
    cv_text = extract_pdf_text(cv_path)
    print(f"CV extrait ({len(cv_text)} caractères)")

    # Étape 2: Objectifs de carrière
    print("\n" + "-" * 40)
    default_objectives = """Postes orientés AI/Automation - type AI Engineer, Automation Engineer, ou LLM Integration Specialist. Je veux transitionner de Salesforce Dev vers des rôles où je construis des workflows intelligents avec des LLMs (OpenAI, Claude API), des outils no-code (n8n, Make), et de l'automatisation backend. Ce que je sais vraiment faire : intégrer des APIs, builder des workflows, scripter en Python/JS, me débrouiller pour faire marcher des trucs. Ce que j'apprends activement : prompt engineering, agents AI, orchestration de LLMs."""

    print("Objectifs de carrière (défaut: AI/Automation transition)")
    use_default = input("Utiliser les objectifs par défaut? [O/n]: ").strip().lower()

    if use_default in ['', 'o', 'oui', 'y', 'yes']:
        objectives = default_objectives
        print("Objectifs par défaut utilisés.")
    else:
        objectives = get_multiline_input("Décrivez vos objectifs de carrière:")

    # Étape 3: Offre d'emploi
    print("\n" + "-" * 40)
    job_offer = get_multiline_input("Collez l'offre d'emploi:")

    if not job_offer.strip():
        print("Erreur: Offre d'emploi vide")
        sys.exit(1)

    # Étape 4: APPEL API 1 - Scoring
    print("\n" + "=" * 40)
    print("ANALYSE EN COURS...")
    print("=" * 40)

    scoring_result = call_claude_scoring(client, cv_text, objectives, job_offer)

    score_profil = scoring_result.get('score_profil', 0)
    score_objectifs = scoring_result.get('score_objectifs', 0)
    analyse_profil = scoring_result.get('analyse_profil', '')
    analyse_objectifs = scoring_result.get('analyse_objectifs', '')
    go_adapt = scoring_result.get('go_adapt', False)

    print(f"\n{'─' * 40}")
    print(f"SCORE MATCHING PROFIL:    {score_profil}%")
    print(f"SCORE MATCHING OBJECTIFS: {score_objectifs}%")
    print(f"{'─' * 40}")
    print(f"\nAnalyse profil: {analyse_profil}")
    print(f"\nAnalyse objectifs: {analyse_objectifs}")
    print(f"{'─' * 40}")

    if not go_adapt:
        print("\n❌ Scores insuffisants (< 50%). Pas d'adaptation recommandée.")
        print("Conseil: Cherchez des offres plus alignées avec votre profil et objectifs.")
        return

    print("\n✓ Scores suffisants! Adaptation du CV et génération de la cover letter...")

    # Étape 5: APPEL API 2 - Adaptation
    adaptation_result = call_claude_adaptation(client, cv_text, objectives, job_offer)

    cv_adapte = adaptation_result.get('cv_adapte', {})
    cover_letter = adaptation_result.get('cover_letter', {})

    # Déterminer le dossier de sortie
    output_dir = os.path.dirname(cv_path)

    # Nom de l'entreprise pour les fichiers
    entreprise = cover_letter.get('entreprise', 'Entreprise')
    entreprise_clean = sanitize_filename(entreprise)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M")

    # Étape 6: Génération des PDFs
    print("\n" + "=" * 40)
    print("GÉNÉRATION DES DOCUMENTS...")
    print("=" * 40)

    # CV PDF
    cv_output_path = os.path.join(output_dir, f"CV_adapte_{entreprise_clean}_{timestamp}.pdf")
    generate_cv_pdf(cv_adapte, cv_output_path)

    # Cover Letter PDF
    cl_output_path = os.path.join(output_dir, f"cover_letter_{entreprise_clean}_{timestamp}.pdf")
    generate_cover_letter_pdf(cover_letter, cv_adapte, cl_output_path)

    # Résumé final
    print("\n" + "=" * 60)
    print("TERMINÉ!")
    print("=" * 60)
    print(f"\nFichiers générés:")
    print(f"  📄 CV adapté:      {cv_output_path}")
    print(f"  📄 Cover letter:   {cl_output_path}")
    print(f"\nScores obtenus:")
    print(f"  • Matching profil:    {score_profil}%")
    print(f"  • Matching objectifs: {score_objectifs}%")
    print("\nBonne chance pour votre candidature! 🍀")


if __name__ == "__main__":
    main()
