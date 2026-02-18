#!/usr/bin/env python3
"""
CV Matcher - Analyse automatique de matching CV/annonces d'emploi
Usage: python matcher.py
"""

import json
import os
from datetime import datetime
from anthropic import Anthropic

# Couleurs pour l'affichage terminal
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def load_cv():
    """Charge le CV source depuis cv_source.json"""
    with open('cv_source.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def load_config():
    """Charge la configuration depuis config.json"""
    with open('config.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def analyze_job_matching(cv_data, config, job_description, client):
    """
    Analyse le matching entre le CV et l'annonce via Claude API
    Retourne: (matching_percentage, analysis, has_deal_breakers)
    """

    prompt = f"""Tu es un expert en recrutement et matching CV/offres d'emploi.

PROFIL DU CANDIDAT:
{json.dumps(cv_data, indent=2, ensure_ascii=False)}

CRITÈRES DE RECHERCHE:
- Postes ciblés: {', '.join(config['target_positions'])}
- Technologies préférées: {', '.join(config['preferred_technologies'])}
- Deal-breakers (à éviter): {', '.join(config['deal_breakers']['avoid_keywords'])}

ANNONCE D'EMPLOI À ANALYSER:
{job_description}

TÂCHES:
1. Calcule un pourcentage de matching (0-100%) entre le profil et l'annonce
2. Justifie ce pourcentage avec des points précis
3. Identifie si l'annonce contient des deal-breakers (postes chronophages, heures excessives, etc.)
4. Liste les compétences manquantes importantes si < 50%
5. Liste les points forts qui matchent

Réponds UNIQUEMENT au format JSON suivant:
{{
  "matching_percentage": <nombre entre 0 et 100>,
  "has_deal_breakers": <true ou false>,
  "deal_breaker_details": "<explication si deal breakers trouvés>",
  "strengths": ["<point fort 1>", "<point fort 2>", ...],
  "missing_skills": ["<compétence manquante 1>", ...],
  "recommendation": "<recommandation globale>",
  "justification": "<explication détaillée du matching>"
}}
"""

    message = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    response_text = message.content[0].text

    # Extraire le JSON de la réponse
    try:
        # Chercher le JSON dans la réponse
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        json_str = response_text[start_idx:end_idx]
        analysis = json.loads(json_str)
        return analysis
    except Exception as e:
        print(f"{Colors.RED}Erreur de parsing JSON: {e}{Colors.END}")
        print(f"Réponse brute: {response_text}")
        raise

def optimize_cv(cv_data, config, job_description, analysis, client):
    """
    Génère une version optimisée du CV pour l'annonce spécifique
    """

    prompt = f"""Tu es un expert en rédaction de CV et optimisation pour les ATS (Applicant Tracking Systems).

CV ORIGINAL:
{json.dumps(cv_data, indent=2, ensure_ascii=False)}

ANNONCE D'EMPLOI:
{job_description}

ANALYSE DE MATCHING:
{json.dumps(analysis, indent=2, ensure_ascii=False)}

TÂCHE:
Génère une version optimisée du CV qui:
1. Met en avant les compétences et expériences pertinentes pour cette annonce
2. Réorganise les bullet points pour mettre en avant ce qui matche le plus
3. Ajuste le résumé pour refléter le poste ciblé
4. Utilise les mots-clés de l'annonce de manière naturelle
5. Garde le même format professionnel

Génère le CV optimisé au format texte (pas JSON), prêt à être converti en PDF.
Utilise le même style que le CV original mais optimisé pour cette offre.
"""

    message = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}]
    )

    return message.content[0].text

def save_results(job_name, analysis, optimized_cv=None):
    """Sauvegarde les résultats de l'analyse"""
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    base_filename = f"{timestamp}_{job_name}"

    # Sauvegarder l'analyse
    analysis_path = f"results/{base_filename}_analysis.json"
    with open(analysis_path, 'w', encoding='utf-8') as f:
        json.dump(analysis, f, indent=2, ensure_ascii=False)

    # Sauvegarder le CV optimisé si disponible
    if optimized_cv:
        cv_path = f"results/{base_filename}_cv_optimise.txt"
        with open(cv_path, 'w', encoding='utf-8') as f:
            f.write(optimized_cv)
        return analysis_path, cv_path

    return analysis_path, None

def display_results(analysis, matching_percentage):
    """Affiche les résultats de manière formatée"""

    print(f"\n{'='*60}")
    print(f"{Colors.BOLD}RÉSULTATS DE L'ANALYSE{Colors.END}")
    print(f"{'='*60}\n")

    # Pourcentage de matching avec couleur
    if matching_percentage >= 75:
        color = Colors.GREEN
        emoji = "✓✓✓"
    elif matching_percentage >= 50:
        color = Colors.YELLOW
        emoji = "✓✓"
    else:
        color = Colors.RED
        emoji = "✗"

    print(f"{Colors.BOLD}MATCHING: {color}{matching_percentage}%{Colors.END} {emoji}\n")

    # Deal breakers
    if analysis.get('has_deal_breakers'):
        print(f"{Colors.RED}⚠ DEAL BREAKERS DÉTECTÉS:{Colors.END}")
        print(f"  {analysis.get('deal_breaker_details', 'Non spécifié')}\n")
    else:
        print(f"{Colors.GREEN}✓ Pas de deal breakers détectés{Colors.END}\n")

    # Points forts
    if analysis.get('strengths'):
        print(f"{Colors.BOLD}POINTS FORTS:{Colors.END}")
        for strength in analysis['strengths']:
            print(f"  • {strength}")
        print()

    # Compétences manquantes
    if analysis.get('missing_skills'):
        print(f"{Colors.BOLD}COMPÉTENCES MANQUANTES:{Colors.END}")
        for skill in analysis['missing_skills']:
            print(f"  • {skill}")
        print()

    # Recommandation
    print(f"{Colors.BOLD}RECOMMANDATION:{Colors.END}")
    print(f"  {analysis.get('recommendation', 'N/A')}\n")

    # Justification
    print(f"{Colors.BOLD}JUSTIFICATION:{Colors.END}")
    print(f"  {analysis.get('justification', 'N/A')}\n")

    print(f"{'='*60}\n")

def main():
    """Fonction principale"""

    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}")
    print("CV MATCHER - Analyse de Matching CV/Annonce")
    print(f"{'='*60}{Colors.END}\n")

    # Charger le CV et la config
    try:
        cv_data = load_cv()
        config = load_config()

        # Vérifier la clé API
        api_key = config.get('anthropic_api_key')
        if not api_key or api_key == "VOTRE_CLE_API_ANTHROPIC":
            api_key = os.environ.get('ANTHROPIC_API_KEY')
            if not api_key:
                print(f"{Colors.RED}Erreur: Clé API Anthropic non configurée{Colors.END}")
                print("Veuillez définir ANTHROPIC_API_KEY dans config.json ou comme variable d'environnement")
                return

        client = Anthropic(api_key=api_key)

    except FileNotFoundError as e:
        print(f"{Colors.RED}Erreur: Fichier non trouvé - {e}{Colors.END}")
        return
    except json.JSONDecodeError as e:
        print(f"{Colors.RED}Erreur: Fichier JSON invalide - {e}{Colors.END}")
        return

    # Demander l'annonce d'emploi
    print(f"{Colors.BOLD}Collez l'annonce d'emploi ci-dessous:{Colors.END}")
    print(f"{Colors.YELLOW}(Terminez par une ligne vide puis Ctrl+D sur Linux/Mac ou Ctrl+Z puis Entrée sur Windows){Colors.END}\n")

    job_description_lines = []
    try:
        while True:
            line = input()
            job_description_lines.append(line)
    except EOFError:
        pass

    job_description = '\n'.join(job_description_lines).strip()

    if not job_description:
        print(f"{Colors.RED}Erreur: Aucune annonce fournie{Colors.END}")
        return

    # Demander le nom du job pour le fichier
    print(f"\n{Colors.BOLD}Nom de l'entreprise/poste (pour le nom de fichier):{Colors.END} ", end='')
    job_name = input().strip() or "job"
    job_name = job_name.replace(' ', '_').replace('/', '_')

    # Analyser le matching
    print(f"\n{Colors.YELLOW}Analyse en cours...{Colors.END}")
    analysis = analyze_job_matching(cv_data, config, job_description, client)

    matching_percentage = analysis['matching_percentage']

    # Afficher les résultats
    display_results(analysis, matching_percentage)

    # Si matching > seuil, générer CV optimisé
    threshold = config.get('matching_threshold', 50)
    optimized_cv = None

    if matching_percentage >= threshold and not analysis.get('has_deal_breakers'):
        print(f"{Colors.GREEN}✓ Matching supérieur à {threshold}% et pas de deal breakers!{Colors.END}")
        print(f"{Colors.YELLOW}Génération du CV optimisé...{Colors.END}\n")

        optimized_cv = optimize_cv(cv_data, config, job_description, analysis, client)

        print(f"{Colors.GREEN}✓ CV optimisé généré!{Colors.END}\n")
    else:
        if analysis.get('has_deal_breakers'):
            print(f"{Colors.RED}✗ Deal breakers détectés - CV non optimisé{Colors.END}\n")
        else:
            print(f"{Colors.RED}✗ Matching inférieur à {threshold}% - CV non optimisé{Colors.END}\n")

    # Sauvegarder les résultats
    analysis_path, cv_path = save_results(job_name, analysis, optimized_cv)

    print(f"{Colors.BOLD}Fichiers sauvegardés:{Colors.END}")
    print(f"  • Analyse: {analysis_path}")
    if cv_path:
        print(f"  • CV optimisé: {cv_path}")
        print(f"\n{Colors.BLUE}→ Vous pouvez maintenant convertir le CV en PDF avec votre outil Claude{Colors.END}")

    print()

if __name__ == "__main__":
    main()
