from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json

from models.sentiment_model import analyze_sentiment, analyze_batch
from models.emotion_model import detect_emotions

app = Flask(__name__)
CORS(app)

# Stockage en mémoire de l'historique (en production, utiliser une base de données)
analysis_history = []

@app.route('/')
def index():
    """Page d'accueil de l'application"""
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Analyse le sentiment d'un texte
    Body: { "text": str, "language": str (optional) }
    """
    try:
        data = request.get_json()

        if not data or 'text' not in data:
            return jsonify({'error': 'Le champ "text" est requis'}), 400

        text = data['text']
        language = data.get('language', 'fr')

        if not text.strip():
            return jsonify({'error': 'Le texte ne peut pas être vide'}), 400

        # Analyse de sentiment
        sentiment_result = analyze_sentiment(text, language)

        # Détection d'émotions
        emotions = detect_emotions(text)

        # Résultat complet
        result = {
            'text': text,
            'sentiment': sentiment_result['sentiment'],
            'score': sentiment_result['score'],
            'polarity': sentiment_result['polarity'],
            'subjectivity': sentiment_result['subjectivity'],
            'emotions': emotions,
            'timestamp': datetime.now().isoformat(),
            'language': language
        }

        # Ajouter à l'historique
        analysis_history.append(result)

        # Limiter l'historique à 100 entrées
        if len(analysis_history) > 100:
            analysis_history.pop(0)

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze/batch', methods=['POST'])
def analyze_batch_endpoint():
    """
    Analyse multiple textes en une seule requête
    Body: { "texts": [str], "language": str (optional) }
    """
    try:
        data = request.get_json()

        if not data or 'texts' not in data:
            return jsonify({'error': 'Le champ "texts" est requis'}), 400

        texts = data['texts']
        language = data.get('language', 'fr')

        if not isinstance(texts, list) or len(texts) == 0:
            return jsonify({'error': 'texts doit être une liste non vide'}), 400

        results = analyze_batch(texts, language)

        return jsonify({
            'count': len(results),
            'results': results,
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Récupère l'historique des analyses"""
    limit = request.args.get('limit', 50, type=int)
    return jsonify({
        'count': len(analysis_history),
        'history': analysis_history[-limit:]
    })

@app.route('/api/history/clear', methods=['DELETE'])
def clear_history():
    """Efface l'historique"""
    global analysis_history
    analysis_history = []
    return jsonify({'message': 'Historique effacé'})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Statistiques globales des analyses"""
    if not analysis_history:
        return jsonify({
            'total_analyses': 0,
            'sentiment_distribution': {},
            'average_score': 0
        })

    sentiment_counts = {'positive': 0, 'neutral': 0, 'negative': 0}
    total_score = 0

    for analysis in analysis_history:
        sentiment_counts[analysis['sentiment']] += 1
        total_score += analysis['score']

    return jsonify({
        'total_analyses': len(analysis_history),
        'sentiment_distribution': sentiment_counts,
        'average_score': total_score / len(analysis_history) if analysis_history else 0,
        'last_analysis': analysis_history[-1]['timestamp'] if analysis_history else None
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Vérification de l'état de l'API"""
    return jsonify({
        'status': 'OK',
        'message': 'Sentiment Analysis API is running',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    print("🚀 Démarrage de l'application Sentiment Analysis AI...")
    print("📊 Chargement des modèles d'IA...")
    print("✅ Application prête !")
    print("🌐 Accédez à l'application sur http://localhost:5000")

    app.run(debug=True, host='0.0.0.0', port=5000)
