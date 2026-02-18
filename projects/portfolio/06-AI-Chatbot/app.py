from flask import Flask, render_template, request, jsonify, stream_with_context, Response
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
from datetime import datetime
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY', 'your-api-key-here')

# Stockage des conversations
conversations = {}

SYSTEM_PROMPTS = {
    'assistant': "Tu es un assistant virtuel serviable et amical.",
    'code': "Tu es un expert en programmation qui aide avec le code.",
    'creative': "Tu es un assistant créatif pour l'écriture.",
    'custom': "Tu es un assistant IA polyvalent."
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message', '')
    conversation_id = data.get('conversation_id', 'default')
    mode = data.get('mode', 'assistant')

    if not message:
        return jsonify({'error': 'Message requis'}), 400

    # Initialiser ou récupérer la conversation
    if conversation_id not in conversations:
        conversations[conversation_id] = {
            'messages': [{'role': 'system', 'content': SYSTEM_PROMPTS.get(mode, SYSTEM_PROMPTS['assistant'])}],
            'created_at': datetime.now().isoformat()
        }

    # Ajouter le message de l'utilisateur
    conversations[conversation_id]['messages'].append({
        'role': 'user',
        'content': message
    })

    try:
        # Appeler l'API OpenAI (simulation si pas de clé)
        if openai.api_key == 'your-api-key-here':
            # Mode simulation pour la démonstration
            response_text = f"[SIMULATION] Réponse simulée à: '{message}'. Pour utiliser réellement OpenAI, configurez votre clé API dans le fichier .env"
        else:
            # Vraie requête OpenAI
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=conversations[conversation_id]['messages'],
                max_tokens=500,
                temperature=0.7
            )
            response_text = response.choices[0].message.content

        # Ajouter la réponse à l'historique
        conversations[conversation_id]['messages'].append({
            'role': 'assistant',
            'content': response_text
        })

        return jsonify({
            'response': response_text,
            'conversation_id': conversation_id,
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/conversations/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    if conversation_id not in conversations:
        return jsonify({'error': 'Conversation non trouvée'}), 404

    return jsonify(conversations[conversation_id])

@app.route('/api/conversations', methods=['GET'])
def list_conversations():
    return jsonify({
        'conversations': list(conversations.keys()),
        'count': len(conversations)
    })

if __name__ == '__main__':
    print("🤖 Chatbot AI démarré!")
    app.run(debug=True, port=5000)
