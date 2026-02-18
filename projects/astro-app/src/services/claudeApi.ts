import type { ChatMessage } from '../types/astro';
import { birthChart } from '../data/birthChart';

const PROXY_URL = 'http://localhost:3001/api/chat';

function buildSystemContext(): string {
  const planetsText = birthChart.planets
    .map(p => `${p.name} ${p.sign} ${p.degree} M${p.house}${p.retrograde ? 'R' : ''}`)
    .join(', ');

  const aspectsText = birthChart.aspects
    .slice(0, 15) // Top 15 aspects les plus serrés
    .map(a => `${a.planet1} ${a.aspect} ${a.planet2} (${a.orb}°)`)
    .join(', ');

  return `Tu es un expert en astrologie. Thème natal:
Asc ${birthChart.ascendant}, Desc ${birthChart.descendant}
Planètes: ${planetsText}
Aspects majeurs: ${aspectsText}
Réponds de manière claire et personnalisée.`;
}

export async function sendMessage(
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  // Garder seulement les 10 derniers messages pour éviter payload trop gros
  const recentMessages = messages.slice(-10);

  const anthropicMessages = recentMessages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: anthropicMessages,
        apiKey: apiKey,
        system: buildSystemContext()
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}
