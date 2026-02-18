const API_BASE = '/api';

const elements = {
    textInput: document.getElementById('textInput'),
    languageSelect: document.getElementById('languageSelect'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    clearBtn: document.getElementById('clearBtn'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    resultsSection: document.getElementById('resultsSection'),
    sentimentIcon: document.getElementById('sentimentIcon'),
    sentimentLabel: document.getElementById('sentimentLabel'),
    sentimentDescription: document.getElementById('sentimentDescription'),
    scoreCircle: document.getElementById('scoreCircle'),
    scoreValue: document.getElementById('scoreValue'),
    polarityBar: document.getElementById('polarityBar'),
    polarityValue: document.getElementById('polarityValue'),
    subjectivityBar: document.getElementById('subjectivityBar'),
    subjectivityValue: document.getElementById('subjectivityValue'),
    emotionsGrid: document.getElementById('emotionsGrid'),
    historyList: document.getElementById('historyList'),
    loadingOverlay: document.getElementById('loadingOverlay')
};

const SENTIMENT_CONFIG = {
    positive: { emoji: '😊', color: '#4CAF50', label: 'Positif' },
    neutral: { emoji: '😐', color: '#FFC107', label: 'Neutre' },
    negative: { emoji: '😞', color: '#F44336', label: 'Négatif' }
};

const EMOTION_CONFIG = {
    joy: { emoji: '😊', label: 'Joie' },
    sadness: { emoji: '😢', label: 'Tristesse' },
    anger: { emoji: '😠', label: 'Colère' },
    fear: { emoji: '😨', label: 'Peur' },
    surprise: { emoji: '😲', label: 'Surprise' },
    disgust: { emoji: '🤢', label: 'Dégoût' }
};

// Analyser le texte
elements.analyzeBtn.addEventListener('click', async () => {
    const text = elements.textInput.value.trim();

    if (!text) {
        alert('Veuillez entrer un texte à analyser');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_BASE}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                language: elements.languageSelect.value
            })
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'analyse');
        }

        const data = await response.json();
        displayResults(data);
        loadHistory();

    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de l\'analyse');
    } finally {
        showLoading(false);
    }
});

// Effacer le texte
elements.clearBtn.addEventListener('click', () => {
    elements.textInput.value = '';
    elements.resultsSection.style.display = 'none';
});

// Afficher les résultats
function displayResults(data) {
    const { sentiment, score, polarity, subjectivity, emotions } = data;
    const config = SENTIMENT_CONFIG[sentiment];

    // Sentiment principal
    elements.sentimentIcon.textContent = config.emoji;
    elements.sentimentLabel.textContent = config.label;
    elements.sentimentLabel.style.color = config.color;
    elements.sentimentDescription.textContent = getSentimentDescription(sentiment, score);

    // Score
    const scorePercent = Math.round(score * 100);
    elements.scoreValue.textContent = scorePercent + '%';
    elements.scoreCircle.style.background = `conic-gradient(${config.color} ${scorePercent}%, #e1e8ed ${scorePercent}%)`;

    // Polarité (-1 à 1, converti en 0 à 100%)
    const polarityPercent = ((polarity + 1) / 2) * 100;
    elements.polarityBar.style.width = polarityPercent + '%';
    elements.polarityValue.textContent = polarity.toFixed(2);

    // Subjectivité (0 à 1, converti en 0 à 100%)
    const subjectivityPercent = subjectivity * 100;
    elements.subjectivityBar.style.width = subjectivityPercent + '%';
    elements.subjectivityValue.textContent = subjectivity.toFixed(2);

    // Émotions
    displayEmotions(emotions);

    // Afficher la section des résultats
    elements.resultsSection.style.display = 'block';
    elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Afficher les émotions
function displayEmotions(emotions) {
    elements.emotionsGrid.innerHTML = '';

    const sortedEmotions = Object.entries(emotions)
        .sort((a, b) => b[1] - a[1])
        .filter(([_, score]) => score > 0);

    sortedEmotions.forEach(([emotion, score]) => {
        const config = EMOTION_CONFIG[emotion];
        if (!config) return;

        const emotionItem = document.createElement('div');
        emotionItem.className = 'emotion-item';

        const scorePercent = Math.round(score * 100);

        emotionItem.innerHTML = `
            <div class="emotion-icon">${config.emoji}</div>
            <div class="emotion-name">${config.label}</div>
            <div class="emotion-score">${scorePercent}%</div>
        `;

        elements.emotionsGrid.appendChild(emotionItem);
    });

    if (sortedEmotions.length === 0) {
        elements.emotionsGrid.innerHTML = '<p style="text-align: center; color: #666;">Aucune émotion forte détectée</p>';
    }
}

// Charger l'historique
async function loadHistory() {
    try {
        const response = await fetch(`${API_BASE}/history?limit=10`);
        const data = await response.json();

        elements.historyList.innerHTML = '';

        if (data.history.length === 0) {
            elements.historyList.innerHTML = '<p style="text-align: center; color: #666;">Aucun historique</p>';
            return;
        }

        data.history.reverse().forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';

            const config = SENTIMENT_CONFIG[item.sentiment];
            const date = new Date(item.timestamp).toLocaleString('fr-FR');

            historyItem.innerHTML = `
                <div class="history-text">"${item.text.substring(0, 100)}${item.text.length > 100 ? '...' : ''}"</div>
                <div class="history-meta">
                    <span>${config.emoji} ${config.label}</span>
                    <span>Score: ${Math.round(item.score * 100)}%</span>
                    <span>${date}</span>
                </div>
            `;

            elements.historyList.appendChild(historyItem);
        });

    } catch (error) {
        console.error('Erreur chargement historique:', error);
    }
}

// Effacer l'historique
elements.clearHistoryBtn.addEventListener('click', async () => {
    if (!confirm('Êtes-vous sûr de vouloir effacer l\'historique ?')) {
        return;
    }

    try {
        await fetch(`${API_BASE}/history/clear`, { method: 'DELETE' });
        loadHistory();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'effacement de l\'historique');
    }
});

// Afficher/masquer le loading
function showLoading(show) {
    elements.loadingOverlay.style.display = show ? 'flex' : 'none';
}

// Description du sentiment
function getSentimentDescription(sentiment, score) {
    const intensity = score > 0.7 ? 'très' : score > 0.4 ? 'plutôt' : 'légèrement';

    const descriptions = {
        positive: `Ce texte exprime un sentiment ${intensity} positif`,
        neutral: 'Ce texte a un ton neutre et objectif',
        negative: `Ce texte exprime un sentiment ${intensity} négatif`
    };

    return descriptions[sentiment] || 'Analyse du sentiment';
}

// Charger l'historique au démarrage
loadHistory();

console.log('✅ Sentiment Analysis AI chargé avec succès !');
