# -*- coding: utf-8 -*-
"""
Veo3 Prompt Optimizer - Web App
Interface web moderne pour l'apprentissage de prompts Veo3
"""

import sys
import codecs

# Configuration encodage Windows (Python 3 only)
if sys.platform == 'win32' and sys.version_info[0] >= 3:
    try:
        if sys.stdout.encoding != 'utf-8' and hasattr(sys.stdout, 'buffer'):
            sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
            sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')
    except:
        pass  # Ignore encoding errors

from flask import Flask, render_template, request, jsonify
from veo3_ml_analyzer import Veo3MLAnalyzer
import os

app = Flask(__name__)
analyzer = Veo3MLAnalyzer()

@app.route('/')
def index():
    """Page principale"""
    return render_template('index.html')

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Récupère les statistiques"""
    return jsonify(analyzer.get_stats())

@app.route('/api/add_example', methods=['POST'])
def add_example():
    """Ajoute un exemple d'entraînement"""
    data = request.json
    prompt = data.get('prompt', '')
    success = data.get('success', True)
    notes = data.get('notes', '')

    if not prompt:
        return jsonify({'error': 'Prompt vide'}), 400

    analyzer.add_example(prompt, success, notes)
    return jsonify({'success': True, 'message': 'Exemple ajouté !'})

@app.route('/api/analyze', methods=['POST'])
def analyze_prompt():
    """Analyse un prompt et donne des recommandations"""
    data = request.json
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({'error': 'Prompt vide'}), 400

    features = analyzer.extract_features(prompt)
    recommendations = analyzer.get_recommendations(prompt)

    return jsonify({
        'features': features,
        'recommendations': recommendations
    })

@app.route('/api/patterns', methods=['GET'])
def get_patterns():
    """Récupère les patterns identifiés"""
    analysis = analyzer.analyze_patterns()
    return jsonify(analysis)

@app.route('/api/examples', methods=['GET'])
def get_examples():
    """Récupère tous les exemples"""
    return jsonify({
        'success': analyzer.data.get('success', []),
        'failed': analyzer.data.get('failed', [])
    })

@app.route('/api/delete_example', methods=['POST'])
def delete_example():
    """Supprime un exemple"""
    data = request.json
    example_type = data.get('type')  # 'success' or 'failed'
    index = data.get('index')

    if example_type not in ['success', 'failed']:
        return jsonify({'error': 'Type invalide'}), 400

    try:
        del analyzer.data[example_type][index]
        analyzer.save_data()
        return jsonify({'success': True})
    except IndexError:
        return jsonify({'error': 'Index invalide'}), 400

@app.route('/api/transform', methods=['POST'])
def transform_prompt():
    """TRANSFORME automatiquement un prompt basique en prompt optimisé"""
    data = request.json
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({'error': 'Prompt vide'}), 400

    result = analyzer.transform_prompt(prompt)

    return jsonify({
        'original': result['original'],
        'transformed': result['transformed'],
        'changes': result['changes'],
        'confidence': result['confidence']
    })

if __name__ == '__main__':
    # Créer le dossier templates s'il n'existe pas
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)

    print("\n" + "="*60)
    print("🎬 VEO3 PROMPT OPTIMIZER - Interface Web")
    print("="*60)
    print("\n✓ Serveur démarré !")
    print("✓ Ouvrez votre navigateur sur : http://localhost:5000")
    print("\nAppuyez sur Ctrl+C pour arrêter le serveur\n")

    app.run(debug=True, host='0.0.0.0', port=5000)
