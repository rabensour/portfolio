"""
Modèle de détection d'émotions
"""

import re
from textblob import TextBlob

# Dictionnaires de mots-clés pour chaque émotion
EMOTION_KEYWORDS = {
    'joy': {
        'fr': ['heureux', 'joie', 'content', 'ravi', 'génial', 'super', 'magnifique',
               'excellent', 'adore', 'aime', 'parfait', 'merveilleux', 'fantastique'],
        'en': ['happy', 'joy', 'glad', 'delighted', 'great', 'awesome', 'wonderful',
               'excellent', 'love', 'perfect', 'amazing', 'fantastic']
    },
    'sadness': {
        'fr': ['triste', 'tristesse', 'malheureux', 'désolé', 'déprimé', 'peine',
               'chagrin', 'mélancolie', 'pleure', 'larmes'],
        'en': ['sad', 'sadness', 'unhappy', 'sorry', 'depressed', 'sorrow',
               'grief', 'melancholy', 'cry', 'tears']
    },
    'anger': {
        'fr': ['colère', 'énervé', 'furieux', 'rage', 'irrité', 'fâché', 'déteste',
               'horrible', 'nul', 'merde'],
        'en': ['anger', 'angry', 'furious', 'rage', 'irritated', 'mad', 'hate',
               'terrible', 'awful', 'sucks']
    },
    'fear': {
        'fr': ['peur', 'effrayé', 'terrifié', 'anxieux', 'inquiet', 'angoisse',
               'stress', 'panique', 'crainte'],
        'en': ['fear', 'scared', 'terrified', 'anxious', 'worried', 'anxiety',
               'stress', 'panic', 'afraid']
    },
    'surprise': {
        'fr': ['surpris', 'surprise', 'étonné', 'choqué', 'incroyable', 'wow',
               'inattendu', 'stupéfait'],
        'en': ['surprised', 'surprise', 'astonished', 'shocked', 'amazing', 'wow',
               'unexpected', 'stunned']
    },
    'disgust': {
        'fr': ['dégoût', 'dégoûtant', 'répugnant', 'écœurant', 'horrible', 'sale'],
        'en': ['disgust', 'disgusting', 'repulsive', 'gross', 'horrible', 'nasty']
    }
}

def detect_emotions(text, language='fr'):
    """
    Détecte les émotions dans un texte

    Args:
        text (str): Le texte à analyser
        language (str): La langue du texte

    Returns:
        dict: Scores d'émotions (0-1) pour chaque émotion
    """
    text_lower = text.lower()

    # Initialiser les scores
    emotion_scores = {
        'joy': 0.0,
        'sadness': 0.0,
        'anger': 0.0,
        'fear': 0.0,
        'surprise': 0.0,
        'disgust': 0.0
    }

    # Compter les mots-clés
    word_counts = {}
    total_keywords = 0

    for emotion, keywords_dict in EMOTION_KEYWORDS.items():
        keywords = keywords_dict.get(language, keywords_dict['en'])
        count = 0

        for keyword in keywords:
            # Utiliser des regex pour les mots entiers
            pattern = r'\b' + re.escape(keyword) + r'\b'
            matches = len(re.findall(pattern, text_lower))
            count += matches

        word_counts[emotion] = count
        total_keywords += count

    # Calculer les scores
    if total_keywords > 0:
        for emotion in emotion_scores:
            emotion_scores[emotion] = round(word_counts[emotion] / total_keywords, 4)
    else:
        # Si aucun mot-clé trouvé, utiliser la polarité pour estimer
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity

        if polarity > 0.3:
            emotion_scores['joy'] = 0.6
        elif polarity < -0.3:
            emotion_scores['sadness'] = 0.4
            emotion_scores['anger'] = 0.3
        else:
            # Neutre - pas d'émotion forte
            pass

    # Normaliser pour que la somme soit au plus 1
    total = sum(emotion_scores.values())
    if total > 1:
        emotion_scores = {k: round(v / total, 4) for k, v in emotion_scores.items()}

    return emotion_scores

def get_dominant_emotion(emotions):
    """
    Retourne l'émotion dominante

    Args:
        emotions (dict): Dictionnaire des scores d'émotions

    Returns:
        tuple: (emotion, score)
    """
    if not emotions:
        return ('neutral', 0.0)

    dominant = max(emotions.items(), key=lambda x: x[1])

    if dominant[1] < 0.1:
        return ('neutral', 0.0)

    return dominant

def get_emotion_emoji(emotion):
    """Retourne un emoji correspondant à l'émotion"""
    emoji_map = {
        'joy': '😊',
        'sadness': '😢',
        'anger': '😠',
        'fear': '😨',
        'surprise': '😲',
        'disgust': '🤢',
        'neutral': '😐'
    }
    return emoji_map.get(emotion, '❓')

def emotions_to_text(emotions):
    """
    Convertit les scores d'émotions en texte descriptif

    Args:
        emotions (dict): Scores d'émotions

    Returns:
        str: Description textuelle
    """
    dominant_emotion, score = get_dominant_emotion(emotions)

    if dominant_emotion == 'neutral':
        return "Ton neutre, sans émotion forte détectée."

    emoji = get_emotion_emoji(dominant_emotion)

    descriptions = {
        'joy': "Ton joyeux et positif",
        'sadness': "Ton triste et mélancolique",
        'anger': "Ton en colère ou irrité",
        'fear': "Ton anxieux ou inquiet",
        'surprise': "Ton surpris ou étonné",
        'disgust': "Ton dégoûté ou répulsé"
    }

    description = descriptions.get(dominant_emotion, "Ton émotionnel")
    intensity = "forte" if score > 0.6 else "modérée" if score > 0.3 else "légère"

    return f"{description} avec une intensité {intensity} {emoji}"

if __name__ == '__main__':
    # Tests
    test_texts = [
        "Je suis tellement heureux aujourd'hui ! C'est une journée magnifique !",
        "Je suis vraiment triste et déprimé...",
        "Je suis furieux ! C'est horrible !",
        "Ça me fait peur, je suis très anxieux.",
    ]

    print("🧪 Tests du modèle de détection d'émotions\n")

    for text in test_texts:
        emotions = detect_emotions(text, 'fr')
        dominant = get_dominant_emotion(emotions)
        description = emotions_to_text(emotions)

        print(f"Texte: {text}")
        print(f"Émotions détectées:")
        for emotion, score in sorted(emotions.items(), key=lambda x: x[1], reverse=True):
            if score > 0:
                emoji = get_emotion_emoji(emotion)
                print(f"  {emotion}: {score:.2%} {emoji}")
        print(f"Dominante: {dominant[0]} ({dominant[1]:.2%})")
        print(f"Description: {description}\n")
