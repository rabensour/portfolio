# -*- coding: utf-8 -*-
"""
Veo3 ML Analyzer - Système d'apprentissage intelligent pour prompts Veo3
Analyse automatiquement les patterns de réussite/échec
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Tuple
from collections import Counter
import statistics


class Veo3MLAnalyzer:
    """Système d'apprentissage basé sur l'extraction de features"""

    # Connaissances Veo3 (pour extraction de features, PAS pour jugement)
    CAMERA_MOVEMENTS = [
        'dolly', 'tracking', 'crane', 'aerial', 'pan', 'pov', 'steadicam',
        'handheld', 'orbit', 'zoom', 'tilt', 'push in', 'pull out'
    ]

    LIGHTING_KEYWORDS = [
        'lighting', 'light', 'shadow', 'golden hour', 'neon', 'chiaroscuro',
        'backlit', 'rim light', 'key light', 'ambient', 'soft light', 'hard light',
        'temperature', '3000k', '5600k', 'warm', 'cool', 'spotlight'
    ]

    SEVEN_ELEMENTS = {
        'subject': ['person', 'man', 'woman', 'character', 'object', 'animal', 'car', 'building'],
        'context': ['in', 'at', 'location', 'setting', 'environment', 'scene', 'background'],
        'action': ['walking', 'running', 'talking', 'moving', 'standing', 'sitting', 'flying', 'driving'],
        'style': ['cinematic', 'animated', 'realistic', 'stylized', 'photorealistic', 'artistic'],
        'camera': CAMERA_MOVEMENTS,
        'composition': ['close-up', 'wide shot', 'medium shot', 'framing', 'angle', 'perspective'],
        'ambiance': ['mood', 'atmosphere', 'tone', 'feeling', 'dark', 'bright', 'mysterious']
    }

    def __init__(self, data_file: str = "veo3_training_data.json"):
        self.data_file = data_file
        self.data = {"success": [], "failed": []}
        self.load_data()

    def load_data(self):
        """Charge les données d'entraînement"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
        except FileNotFoundError:
            self.data = {"success": [], "failed": [], "last_updated": datetime.now().isoformat()}

    def save_data(self):
        """Sauvegarde les données"""
        self.data['last_updated'] = datetime.now().isoformat()
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)

    def extract_features(self, prompt: str) -> Dict:
        """Extrait automatiquement les features d'un prompt"""
        prompt_lower = prompt.lower()

        features = {
            # Métriques basiques
            'length_chars': len(prompt),
            'length_words': len(prompt.split()),
            'is_json': self._is_json_format(prompt),

            # 7 éléments Veo3
            'has_subject': self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['subject']),
            'has_context': self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['context']),
            'has_action': self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['action']),
            'has_style': self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['style']),
            'has_camera': self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['camera']),
            'has_composition': self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['composition']),
            'has_ambiance': self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['ambiance']),

            # Score des 7 éléments (0-7)
            'seven_elements_score': sum([
                self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['subject']),
                self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['context']),
                self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['action']),
                self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['style']),
                self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['camera']),
                self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['composition']),
                self._contains_keywords(prompt_lower, self.SEVEN_ELEMENTS['ambiance'])
            ]),

            # Techniques cinématographiques
            'camera_movements_count': self._count_keywords(prompt_lower, self.CAMERA_MOVEMENTS),
            'lighting_keywords_count': self._count_keywords(prompt_lower, self.LIGHTING_KEYWORDS),

            # Spécificité
            'specificity_score': self._calculate_specificity(prompt),
            'adjective_count': len(re.findall(r'\b(detailed|slow|smooth|cinematic|dramatic|soft|hard|warm|cool|bright|dark)\b', prompt_lower)),

            # Audio
            'has_dialogue': 'says:' in prompt_lower or 'speaking' in prompt_lower,
            'dialogue_estimated_duration': self._estimate_dialogue_duration(prompt),
            'has_no_subtitles': 'no subtitle' in prompt_lower or 'no text overlay' in prompt_lower,

            # Complexité
            'sentence_count': len(re.findall(r'[.!?]+', prompt)),
            'comma_count': prompt.count(','),
            'action_complexity': self._estimate_action_complexity(prompt_lower),

            # Format
            'has_numbers': bool(re.search(r'\d', prompt)),
            'has_technical_terms': self._has_technical_terms(prompt_lower),

            # === NOUVELLES FEATURES : Contrôle Audio & Dialogue ===

            # I. Contrôle Audio (Critique pour succès)
            'has_silence_absolu': self._has_silence_absolu(prompt),
            'has_audio_negation': self._has_audio_negation(prompt_lower),
            'has_problematic_audio': self._has_problematic_audio(prompt_lower),
            'audio_control_score': self._calculate_audio_control(prompt, prompt_lower),

            # II. Dialogue Structuré (JSON avec character/line/tone)
            'has_structured_dialogue': self._has_structured_dialogue(prompt),
            'dialogue_fields_count': self._count_dialogue_fields(prompt),
            'has_character_field': '"character"' in prompt_lower,
            'has_line_field': '"line"' in prompt_lower,
            'has_tone_field': '"tone"' in prompt_lower,

            # III. Annotations Interdites (dans "line")
            'has_forbidden_annotations': self._has_forbidden_annotations(prompt),
            'parentheses_in_line': self._check_parentheses_in_line(prompt),

            # IV. Attribution Claire des Personnages
            'has_character_naming': self._has_character_naming(prompt),
            'character_count': self._count_characters(prompt),

            # V. Négations Strictes (aucun, jamais, interdit)
            'strict_negations_count': self._count_strict_negations(prompt_lower),
            'has_effects_negation': 'aucun son ajouté' in prompt_lower or 'no added sound' in prompt_lower,
        }

        return features

    def _is_json_format(self, prompt: str) -> bool:
        """Détecte si le prompt est au format JSON"""
        try:
            json.loads(prompt)
            return True
        except:
            return prompt.strip().startswith('{') and prompt.strip().endswith('}')

    def _contains_keywords(self, text: str, keywords: List[str]) -> bool:
        """Vérifie si le texte contient au moins un mot-clé"""
        return any(keyword in text for keyword in keywords)

    def _count_keywords(self, text: str, keywords: List[str]) -> int:
        """Compte le nombre de mots-clés présents"""
        return sum(1 for keyword in keywords if keyword in text)

    def _calculate_specificity(self, prompt: str) -> float:
        """Calcule un score de spécificité (0-1)"""
        words = prompt.split()
        if len(words) == 0:
            return 0.0

        # Mots vagues à éviter
        vague_words = ['beautiful', 'nice', 'good', 'something', 'stuff', 'things', 'random']
        vague_count = sum(1 for word in words if word.lower() in vague_words)

        # Score = 1 - (ratio de mots vagues)
        return 1.0 - (vague_count / len(words))

    def _estimate_dialogue_duration(self, prompt: str) -> float:
        """Estime la durée du dialogue en secondes"""
        if 'says:' not in prompt.lower() and 'speaking' not in prompt.lower():
            return 0.0

        # Recherche du texte entre guillemets ou après "says:"
        dialogue_patterns = [
            r'says:\s*["\']?([^"\']+)["\']?',
            r'speaking[^:]*:\s*["\']?([^"\']+)["\']?',
            r'"([^"]+)"'
        ]

        total_chars = 0
        for pattern in dialogue_patterns:
            matches = re.findall(pattern, prompt, re.IGNORECASE)
            total_chars += sum(len(match) for match in matches)

        # Estimation : ~15 caractères par seconde de parole
        return total_chars / 15.0

    def _estimate_action_complexity(self, prompt: str) -> int:
        """Estime la complexité des actions (nombre d'actions différentes)"""
        action_words = ['then', 'and then', 'after', 'before', 'while', 'during', 'next']
        return sum(1 for word in action_words if word in prompt)

    def _has_technical_terms(self, prompt: str) -> bool:
        """Détecte la présence de termes techniques"""
        technical = ['fps', '4k', '8k', 'bokeh', 'dof', 'depth of field', 'aperture',
                    'focal length', 'iso', 'shutter', 'resolution']
        return any(term in prompt for term in technical)

    # === NOUVELLES MÉTHODES : Contrôle Audio & Dialogue ===

    def _has_silence_absolu(self, prompt: str) -> bool:
        """Détecte la présence de 'SILENCE ABSOLU' ou formules similaires"""
        silence_patterns = [
            'silence absolu',
            'aucune musique',
            'aucun bruit ambiant',
            'aucun bruit de fond',
            'silence total',
            'absolute silence',
            'no music',
            'no ambient noise'
        ]
        prompt_lower = prompt.lower()
        return any(pattern in prompt_lower for pattern in silence_patterns)

    def _has_audio_negation(self, prompt_lower: str) -> bool:
        """Détecte les négations audio (aucun son ajouté, pas de respiration, etc.)"""
        negation_patterns = [
            'aucun son ajouté',
            'aucune respiration',
            'aucune interjection',
            'aucun ajout sonore',
            'pas de respiration',
            'no added sound',
            'no breathing',
            'no interjection'
        ]
        return any(pattern in prompt_lower for pattern in negation_patterns)

    def _has_problematic_audio(self, prompt_lower: str) -> bool:
        """Détecte les éléments audio problématiques (musique forte, bruits chaotiques)"""
        problematic_patterns = [
            'musique forte',
            'musique punk',
            'bruits chaotiques',
            'cris et conversations',
            'ambiance survoltée',
            'loud music',
            'chaotic noise',
            'intense background'
        ]
        return any(pattern in prompt_lower for pattern in problematic_patterns)

    def _calculate_audio_control(self, prompt: str, prompt_lower: str) -> float:
        """Calcule un score de contrôle audio (0-1, 1=excellent contrôle)"""
        score = 0.0

        # +0.4 pour silence absolu
        if self._has_silence_absolu(prompt):
            score += 0.4

        # +0.3 pour négations audio strictes
        if self._has_audio_negation(prompt_lower):
            score += 0.3

        # +0.3 pour bruit minimal/neutre
        if 'silent office hum' in prompt_lower or 'bruitage léger' in prompt_lower:
            score += 0.3

        # -0.5 pour audio problématique
        if self._has_problematic_audio(prompt_lower):
            score -= 0.5

        return max(0.0, min(1.0, score))

    def _has_structured_dialogue(self, prompt: str) -> bool:
        """Détecte le format JSON structuré avec character/line/tone"""
        # Cherche les patterns {"character": ..., "line": ..., "tone": ...}
        has_char = '"character"' in prompt.lower() or "'character'" in prompt.lower()
        has_line = '"line"' in prompt.lower() or "'line'" in prompt.lower()
        has_tone = '"tone"' in prompt.lower() or "'tone'" in prompt.lower()

        return has_char and has_line  # tone est optionnel

    def _count_dialogue_fields(self, prompt: str) -> int:
        """Compte le nombre de champs de dialogue structurés"""
        count = 0
        if '"character"' in prompt.lower() or "'character'" in prompt.lower():
            count += 1
        if '"line"' in prompt.lower() or "'line'" in prompt.lower():
            count += 1
        if '"tone"' in prompt.lower() or "'tone'" in prompt.lower():
            count += 1
        return count

    def _has_forbidden_annotations(self, prompt: str) -> bool:
        """Détecte les annotations interdites (parenthèses/crochets dans line)"""
        # Cherche les patterns comme "line":"texte (annotation)" ou "line":"texte [annotation]"
        forbidden_patterns = [
            r'"line"\s*:\s*"[^"]*[\(\[][^\)\]]*[\)\]][^"]*"',
            r"'line'\s*:\s*'[^']*[\(\[][^\)\]]*[\)\]][^']*'"
        ]
        return any(re.search(pattern, prompt) for pattern in forbidden_patterns)

    def _check_parentheses_in_line(self, prompt: str) -> int:
        """Compte les occurrences de parenthèses/crochets dans les champs line"""
        # Trouve tous les champs "line"
        line_pattern = r'"line"\s*:\s*"([^"]*)"'
        matches = re.findall(line_pattern, prompt)

        count = 0
        for match in matches:
            if '(' in match or ')' in match or '[' in match or ']' in match:
                count += 1

        return count

    def _has_character_naming(self, prompt: str) -> bool:
        """Détecte la présence de nommage clair des personnages"""
        # Cherche des patterns comme "Boulanger (P1)", "character":"Nom"
        naming_patterns = [
            r'\([P|p]\d+\)',  # (P1), (P2), etc.
            r'"character"\s*:\s*"[^"]+"',  # "character":"Nom"
            r'[A-Z][a-z]+\s*\([P|p]\d+\)'  # Nom (P1)
        ]
        return any(re.search(pattern, prompt) for pattern in naming_patterns)

    def _count_characters(self, prompt: str) -> int:
        """Compte le nombre de personnages identifiés"""
        # Compte les occurrences de "character":
        char_pattern = r'"character"\s*:\s*"([^"]+)"'
        matches = re.findall(char_pattern, prompt)
        return len(set(matches))  # Unique characters

    def _count_strict_negations(self, prompt_lower: str) -> int:
        """Compte les négations strictes (aucun, jamais, interdit)"""
        negation_words = [
            'aucun', 'aucune', 'jamais', 'interdit',
            'strictement', 'absolument pas', 'never',
            'strictly', 'forbidden', 'no'
        ]
        return sum(1 for word in negation_words if word in prompt_lower)

    def add_example(self, prompt: str, success: bool, notes: str = ""):
        """Ajoute un exemple d'entraînement"""
        example = {
            "prompt": prompt,
            "notes": notes,
            "added": datetime.now().isoformat(),
            "features": self.extract_features(prompt)
        }

        if success:
            self.data['success'].append(example)
        else:
            self.data['failed'].append(example)

        self.save_data()

    def analyze_patterns(self) -> Dict:
        """Analyse les patterns de réussite vs échec"""
        if len(self.data['success']) == 0 and len(self.data['failed']) == 0:
            return {"error": "Pas assez de données pour analyser"}

        success_features = [ex['features'] for ex in self.data['success']]
        failed_features = [ex['features'] for ex in self.data['failed']]

        analysis = {
            'total_examples': len(self.data['success']) + len(self.data['failed']),
            'success_count': len(self.data['success']),
            'failed_count': len(self.data['failed']),
            'patterns': {}
        }

        # Analyse comparative pour chaque feature
        if success_features:
            feature_names = success_features[0].keys()

            for feature in feature_names:
                success_values = [f[feature] for f in success_features]
                failed_values = [f[feature] for f in failed_features] if failed_features else []

                pattern = self._compare_feature(feature, success_values, failed_values)
                if pattern:
                    analysis['patterns'][feature] = pattern

        return analysis

    def _compare_feature(self, feature_name: str, success_vals: List, failed_vals: List) -> Dict:
        """Compare une feature entre succès et échecs"""
        if not success_vals:
            return None

        # Pour les booléens
        if isinstance(success_vals[0], bool):
            success_rate = sum(success_vals) / len(success_vals)
            failed_rate = sum(failed_vals) / len(failed_vals) if failed_vals else 0

            if abs(success_rate - failed_rate) > 0.3:  # Différence significative
                return {
                    'type': 'boolean',
                    'success_rate': success_rate,
                    'failed_rate': failed_rate,
                    'recommendation': f"{'Inclure' if success_rate > failed_rate else 'Éviter'} {feature_name}"
                }

        # Pour les nombres
        elif isinstance(success_vals[0], (int, float)):
            success_avg = statistics.mean(success_vals)
            failed_avg = statistics.mean(failed_vals) if failed_vals else 0

            if abs(success_avg - failed_avg) > 0.5:  # Différence significative
                return {
                    'type': 'numeric',
                    'success_avg': success_avg,
                    'failed_avg': failed_avg,
                    'recommendation': f"Optimal: ~{success_avg:.1f}"
                }

        return None

    def get_recommendations(self, prompt: str) -> List[str]:
        """Génère des recommandations basées sur les patterns appris"""
        features = self.extract_features(prompt)
        patterns = self.analyze_patterns().get('patterns', {})

        recommendations = []

        for feature_name, pattern in patterns.items():
            if feature_name not in features:
                continue

            current_value = features[feature_name]

            if pattern['type'] == 'boolean':
                if pattern['success_rate'] > 0.7 and not current_value:
                    recommendations.append(f"✓ Ajouter : {feature_name.replace('has_', '').replace('_', ' ')}")
                elif pattern['success_rate'] < 0.3 and current_value:
                    recommendations.append(f"✗ Éviter : {feature_name.replace('has_', '').replace('_', ' ')}")

            elif pattern['type'] == 'numeric':
                if abs(current_value - pattern['success_avg']) > 1:
                    recommendations.append(f"📊 {feature_name.replace('_', ' ')}: {pattern['recommendation']}")

        return recommendations

    def get_stats(self) -> Dict:
        """Retourne les statistiques globales"""
        return {
            'total_examples': len(self.data['success']) + len(self.data['failed']),
            'success_count': len(self.data['success']),
            'failed_count': len(self.data['failed']),
            'success_rate': len(self.data['success']) / max(1, len(self.data['success']) + len(self.data['failed'])),
            'last_updated': self.data.get('last_updated', 'N/A')
        }

    def transform_prompt(self, input_prompt: str) -> Dict:
        """
        TRANSFORME automatiquement un prompt basique en prompt optimisé
        basé sur les patterns appris des exemples de succès

        Returns:
            {
                'original': le prompt d'origine,
                'transformed': le prompt transformé,
                'changes': liste des modifications appliquées
            }
        """
        if not self.data['success']:
            return {
                'original': input_prompt,
                'transformed': input_prompt,
                'changes': ['⚠️ Aucun exemple de succès pour apprendre. Ajoutez des exemples d\'abord !'],
                'confidence': 0.0
            }

        features = self.extract_features(input_prompt)
        patterns = self.analyze_patterns().get('patterns', {})

        transformed = input_prompt
        changes = []
        confidence_score = 0.0

        # Analyse des patterns de succès pour déterminer ce qui manque
        success_examples = self.data['success']

        # 1. AUDIO CONTROL - Priorité critique
        if 'audio_control_score' in patterns:
            avg_success_audio = patterns['audio_control_score'].get('success_avg', 0)
            if avg_success_audio > 0.5 and features.get('audio_control_score', 0) < 0.3:
                # Ajoute section audio stricte si manquante
                if not features.get('has_silence_absolu'):
                    audio_section = self._generate_audio_control_section(success_examples)
                    transformed = self._inject_audio_section(transformed, audio_section)
                    changes.append('✓ Ajout : Contrôle audio strict (SILENCE ABSOLU)')
                    confidence_score += 0.3

        # 2. DIALOGUE STRUCTURÉ
        if 'has_structured_dialogue' in patterns:
            success_rate = patterns['has_structured_dialogue'].get('success_rate', 0)
            if success_rate > 0.7 and not features.get('has_structured_dialogue'):
                # Convertit dialogue basique en JSON structuré
                transformed = self._convert_to_structured_dialogue(transformed, success_examples)
                changes.append('✓ Conversion : Dialogue structuré avec character/line/tone')
                confidence_score += 0.25

        # 3. NOMMAGE DES PERSONNAGES (P1, P2)
        if 'has_character_naming' in patterns:
            success_rate = patterns['has_character_naming'].get('success_rate', 0)
            if success_rate > 0.7 and not features.get('has_character_naming'):
                transformed = self._add_character_naming(transformed)
                changes.append('✓ Ajout : Nommage clair des personnages (P1, P2)')
                confidence_score += 0.15

        # 4. FORMAT JSON
        if 'is_json' in patterns:
            success_rate = patterns['is_json'].get('success_rate', 0)
            if success_rate > 0.7 and not features.get('is_json'):
                transformed = self._wrap_in_json_structure(transformed, success_examples)
                changes.append('✓ Structure : Format JSON Veo3')
                confidence_score += 0.2

        # 5. ÉLÉMENTS MANQUANTS (7 éléments)
        missing_elements = self._identify_missing_elements(features, patterns)
        if missing_elements:
            for element in missing_elements[:3]:  # Max 3 éléments à la fois
                transformed = self._add_element(transformed, element, success_examples)
                changes.append(f'✓ Ajout : {element}')
                confidence_score += 0.05

        # 6. ANNOTATIONS INTERDITES
        if features.get('has_forbidden_annotations') or features.get('parentheses_in_line', 0) > 0:
            transformed = self._clean_forbidden_annotations(transformed)
            changes.append('✓ Nettoyage : Suppression des annotations dans "line"')
            confidence_score += 0.1

        # Calcul de confiance final
        confidence_score = min(1.0, confidence_score)

        if not changes:
            changes.append('✓ Le prompt semble déjà optimisé selon vos patterns de succès')

        return {
            'original': input_prompt,
            'transformed': transformed,
            'changes': changes,
            'confidence': round(confidence_score, 2)
        }

    def _generate_audio_control_section(self, success_examples: List[Dict]) -> str:
        """Génère une section audio basée sur les exemples de succès"""
        # Cherche les patterns audio dans les succès
        for example in success_examples:
            prompt = example.get('prompt', '')
            if 'SILENCE ABSOLU' in prompt.upper() or 'aucune musique' in prompt.lower():
                # Extrait la section audio
                match = re.search(r'"ambient"\s*:\s*"([^"]+)"', prompt)
                if match:
                    return match.group(1)

        # Pattern par défaut si aucun exemple trouvé
        return "SILENCE ABSOLU. AUCUNE MUSIQUE, AUCUN BRUIT AMBIANT."

    def _inject_audio_section(self, prompt: str, audio_text: str) -> str:
        """Injecte la section audio dans le prompt"""
        # Si déjà en JSON, ajoute dans la structure
        if self._is_json_format(prompt):
            # Cherche une section audio existante
            if '"audio"' in prompt.lower():
                # Remplace ambient si existe
                prompt = re.sub(
                    r'"ambient"\s*:\s*"[^"]*"',
                    f'"ambient": "{audio_text}"',
                    prompt
                )
            else:
                # Ajoute section audio complète
                audio_block = f'''
      "audio": {{
        "ambient": "{audio_text}",
        "effects": "aucun son ajouté. Aucune respiration, interjection ou mot non écrit."
      }}'''
                # Insère avant la fermeture du shot
                prompt = re.sub(r'(\s*}\s*})', audio_block + r'\1', prompt, count=1)
        else:
            # Ajoute à la fin du prompt basique
            prompt += f"\n\nAudio: {audio_text}"

        return prompt

    def _convert_to_structured_dialogue(self, prompt: str, success_examples: List[Dict]) -> str:
        """Convertit un dialogue basique en format structuré JSON"""
        # Détecte les dialogues basiques : (personnage) texte ou personnage: texte
        dialogue_patterns = [
            r'\(([^)]+)\)\s*([^(\n]+)',  # (boulanger) vous voulez quoi
            r'([A-Z][a-z]+)\s*:\s*([^(\n]+)',  # Boulanger: vous voulez quoi
        ]

        dialogues_found = []
        for pattern in dialogue_patterns:
            matches = re.findall(pattern, prompt)
            for match in matches:
                character, line = match
                dialogues_found.append({
                    'character': character.strip(),
                    'line': line.strip(),
                    'tone': 'neutre'  # Défaut
                })

        if not dialogues_found:
            return prompt

        # Construit la structure JSON de dialogue
        dialogue_json = []
        for i, dlg in enumerate(dialogues_found, 1):
            dialogue_json.append({
                'character': f"{dlg['character']} (P{i})",
                'line': dlg['line'].rstrip('?!.,'),
                'tone': self._infer_tone(dlg['line'])
            })

        # Si le prompt est déjà en JSON, on remplace la section dialogues
        if self._is_json_format(prompt):
            dialogue_str = json.dumps(dialogue_json, indent=10, ensure_ascii=False)
            if '"dialogues"' in prompt.lower():
                prompt = re.sub(
                    r'"dialogues"\s*:\s*\[[^\]]*\]',
                    f'"dialogues": {dialogue_str}',
                    prompt,
                    flags=re.DOTALL
                )
            else:
                # Insère la section dialogues
                dialogue_block = f'\n        "dialogues": {dialogue_str}'
                prompt = re.sub(r'("audio"\s*:\s*{[^}]+})', r'\1,' + dialogue_block, prompt)
        else:
            # Crée une structure JSON complète
            prompt = self._wrap_in_json_with_dialogues(prompt, dialogue_json)

        return prompt

    def _infer_tone(self, line: str) -> str:
        """Infère le ton d'une réplique"""
        line_lower = line.lower()
        if '!' in line or 'quoi' in line_lower:
            return 'agressif'
        elif '?' in line:
            return 'interrogatif'
        elif any(word in line_lower for word in ['merci', 's\'il vous plaît', 'pardon']):
            return 'poli'
        return 'neutre'

    def _add_character_naming(self, prompt: str) -> str:
        """Ajoute (P1), (P2) aux noms de personnages"""
        # Cherche les patterns de personnages sans numérotation
        character_pattern = r'"character"\s*:\s*"([^"(]+)"'
        matches = list(re.finditer(character_pattern, prompt))

        for i, match in enumerate(matches, 1):
            character_name = match.group(1).strip()
            if not re.search(r'\(P\d+\)', character_name):
                new_name = f'{character_name} (P{i})'
                prompt = prompt.replace(match.group(0), f'"character": "{new_name}"')

        return prompt

    def _wrap_in_json_structure(self, prompt: str, success_examples: List[Dict]) -> str:
        """Enveloppe le prompt dans une structure JSON Veo3"""
        # Cherche un template JSON dans les succès
        for example in success_examples:
            ex_prompt = example.get('prompt', '')
            if self._is_json_format(ex_prompt):
                # Utilise la structure comme template
                if 'basic_settings' in ex_prompt and 'shots' in ex_prompt:
                    # Garde juste la structure de base
                    template = {
                        "basic_settings": {
                            "video_style": "réaliste, cinématique"
                        },
                        "shots": [{
                            "shot-1": {
                                "subject": {
                                    "description": prompt
                                }
                            }
                        }]
                    }
                    return json.dumps(template, indent=2, ensure_ascii=False)

        # Template par défaut
        template = {
            "basic_settings": {
                "video_style": "cinématique, réaliste"
            },
            "shots": [{
                "shot-1": {
                    "subject": {
                        "description": prompt
                    }
                }
            }]
        }
        return json.dumps(template, indent=2, ensure_ascii=False)

    def _wrap_in_json_with_dialogues(self, prompt: str, dialogues: List[Dict]) -> str:
        """Crée une structure JSON avec dialogues"""
        template = {
            "basic_settings": {
                "video_style": "réaliste, dramatique"
            },
            "shots": [{
                "shot-1": {
                    "subject": {
                        "description": prompt
                    },
                    "audio": {
                        "ambient": "SILENCE ABSOLU. AUCUNE MUSIQUE, AUCUN BRUIT AMBIANT.",
                        "dialogues": dialogues,
                        "effects": "aucun son ajouté. Aucune respiration, interjection ou mot non écrit."
                    }
                }
            }]
        }
        return json.dumps(template, indent=2, ensure_ascii=False)

    def _identify_missing_elements(self, features: Dict, patterns: Dict) -> List[str]:
        """Identifie les éléments des 7 éléments qui manquent et sont importants"""
        missing = []
        elements = ['subject', 'context', 'action', 'style', 'camera', 'composition', 'ambiance']

        for elem in elements:
            feature_name = f'has_{elem}'
            if feature_name in patterns:
                success_rate = patterns[feature_name].get('success_rate', 0)
                if success_rate > 0.6 and not features.get(feature_name):
                    missing.append(elem)

        return missing

    def _add_element(self, prompt: str, element: str, success_examples: List[Dict]) -> str:
        """Ajoute un élément manquant basé sur les exemples de succès"""
        # Exemples par défaut selon l'élément
        defaults = {
            'camera': 'Steadicam shot',
            'style': 'cinématique, réaliste',
            'composition': 'medium shot',
            'ambiance': 'atmosphère dramatique'
        }

        if element in defaults:
            addition = defaults[element]
            # Ajoute intelligemment selon le format
            if self._is_json_format(prompt):
                # Cherche où insérer dans le JSON
                if '"description"' in prompt:
                    prompt = re.sub(
                        r'("description"\s*:\s*"[^"]+)"',
                        rf'\1, {addition}"',
                        prompt
                    )
            else:
                prompt += f", {addition}"

        return prompt

    def _clean_forbidden_annotations(self, prompt: str) -> str:
        """Supprime les annotations dans les champs line"""
        # Pattern: "line": "texte (annotation)"
        pattern = r'("line"\s*:\s*"[^"]*)\s*\([^)]+\)([^"]*")'
        prompt = re.sub(pattern, r'\1\2', prompt)

        # Pattern: "line": "texte [annotation]"
        pattern = r'("line"\s*:\s*"[^"]*)\s*\[[^\]]+\]([^"]*")'
        prompt = re.sub(pattern, r'\1\2', prompt)

        return prompt


if __name__ == '__main__':
    # Test rapide
    analyzer = Veo3MLAnalyzer()
    test_prompt = "A cinematic dolly shot of a golden retriever running through a sunlit meadow, warm lighting, 4k"
    features = analyzer.extract_features(test_prompt)
    print("Features extraites :")
    for key, value in features.items():
        print(f"  {key}: {value}")
