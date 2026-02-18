"""
Modèle d'analyse de sentiments utilisant TextBlob et transformers
"""

from textblob import TextBlob
from transformers import pipeline
import warnings

warnings.filterwarnings('ignore')

# Charger le modèle de sentiment (utilise un modèle multilingue)
# Note: En production, mettre en cache ce modèle
try:
    sentiment_pipeline = pipeline(
        "sentiment-analysis",
        model="nlptown/bert-base-multilingual-uncased-sentiment"
    )
    USE_TRANSFORMERS = True
except Exception as e:
    print(f"⚠️ Impossible de charger le modèle transformers: {e}")
    print("📌 Utilisation de TextBlob uniquement")
    USE_TRANSFORMERS = False

def analyze_sentiment(text, language='fr'):
    """
    Analyse le sentiment d'un texte

    Args:
        text (str): Le texte à analyser
        language (str): La langue du texte ('fr' ou 'en')

    Returns:
        dict: Résultat de l'analyse avec sentiment, score, polarité et subjectivité
    """
    # Analyse avec TextBlob
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # -1 (négatif) à 1 (positif)
    subjectivity = blob.sentiment.subjectivity  # 0 (objectif) à 1 (subjectif)

    # Déterminer le sentiment
    if polarity > 0.1:
        sentiment = 'positive'
    elif polarity < -0.1:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'

    # Normaliser le score entre 0 et 1
    score = (polarity + 1) / 2  # Convertir de [-1, 1] à [0, 1]

    result = {
        'sentiment': sentiment,
        'score': round(score, 4),
        'polarity': round(polarity, 4),
        'subjectivity': round(subjectivity, 4),
        'method': 'TextBlob'
    }

    # Si transformers est disponible, l'utiliser aussi
    if USE_TRANSFORMERS and language in ['fr', 'en']:
        try:
            transformer_result = sentiment_pipeline(text[:512])[0]  # Limite à 512 caractères

            # Le modèle retourne des étoiles (1-5)
            label = transformer_result['label']
            confidence = transformer_result['score']

            # Convertir les étoiles en sentiment
            stars = int(label.split()[0])
            if stars >= 4:
                transformer_sentiment = 'positive'
                transformer_score = 0.5 + (stars - 3) * 0.25
            elif stars <= 2:
                transformer_sentiment = 'negative'
                transformer_score = 0.5 - (3 - stars) * 0.25
            else:
                transformer_sentiment = 'neutral'
                transformer_score = 0.5

            # Moyenne des deux méthodes
            result['sentiment'] = transformer_sentiment
            result['score'] = round((score + transformer_score) / 2, 4)
            result['method'] = 'TextBlob + Transformers'
            result['transformer_confidence'] = round(confidence, 4)

        except Exception as e:
            print(f"Erreur transformers: {e}")

    return result

def analyze_batch(texts, language='fr'):
    """
    Analyse multiple textes

    Args:
        texts (list): Liste de textes à analyser
        language (str): La langue des textes

    Returns:
        list: Liste des résultats d'analyse
    """
    results = []

    for text in texts:
        if text.strip():
            result = analyze_sentiment(text, language)
            result['text'] = text[:100] + '...' if len(text) > 100 else text
            results.append(result)

    return results

def get_sentiment_emoji(sentiment):
    """Retourne un emoji correspondant au sentiment"""
    emoji_map = {
        'positive': '😊',
        'neutral': '😐',
        'negative': '😞'
    }
    return emoji_map.get(sentiment, '❓')

def get_sentiment_color(sentiment):
    """Retourne une couleur correspondant au sentiment"""
    color_map = {
        'positive': '#4CAF50',
        'neutral': '#FFC107',
        'negative': '#F44336'
    }
    return color_map.get(sentiment, '#9E9E9E')

if __name__ == '__main__':
    # Tests
    test_texts = [
        "J'adore cette application, elle est vraiment géniale !",
        "C'est horrible, je déteste ça.",
        "C'est correct, rien de spécial."
    ]

    print("🧪 Tests du modèle d'analyse de sentiments\n")

    for text in test_texts:
        result = analyze_sentiment(text, 'fr')
        emoji = get_sentiment_emoji(result['sentiment'])
        print(f"Texte: {text}")
        print(f"Sentiment: {result['sentiment']} {emoji}")
        print(f"Score: {result['score']}")
        print(f"Polarité: {result['polarity']}")
        print(f"Subjectivité: {result['subjectivity']}")
        print(f"Méthode: {result['method']}\n")
