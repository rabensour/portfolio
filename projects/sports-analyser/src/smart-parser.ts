import Anthropic from '@anthropic-ai/sdk';
import type { Match, UpcomingMatch, Sport } from './types.js';
import { randomUUID } from 'crypto';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export class SmartParser {
  static async parseResults(input: string, sport: Sport = 'football'): Promise<Match[]> {
    const prompt = `Analyse ce texte et extrais TOUS les résultats de matchs sportifs.
Pour chaque match trouvé, retourne un objet JSON avec:
- homeTeam: nom équipe domicile (normalisé, ex: "PSG" pas "Paris SG")
- awayTeam: nom équipe extérieur (normalisé)
- scoreHome: score équipe domicile (nombre)
- scoreAway: score équipe extérieur (nombre)
- date: date du match au format ISO (si mentionnée, sinon utilise la date du jour)

Texte à analyser:
${input}

Réponds UNIQUEMENT avec un array JSON, sans explication:
[{"homeTeam":"...","awayTeam":"...","scoreHome":X,"scoreAway":Y,"date":"..."}]`;

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type');
      }

      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return parsed.map((match: any) => ({
        id: randomUUID(),
        date: match.date || new Date().toISOString(),
        sport,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        scoreHome: parseInt(match.scoreHome),
        scoreAway: parseInt(match.scoreAway)
      }));
    } catch (error) {
      console.error('Smart parser error:', error);
      throw new Error(`Failed to parse with AI: ${(error as Error).message}`);
    }
  }

  static async parseUpcoming(input: string, sport: Sport = 'football'): Promise<UpcomingMatch[]> {
    const prompt = `Analyse ce texte (peut venir de Winner.co.il ou autre site de paris) et extrais TOUS les matchs à venir.

Pour chaque match trouvé, retourne un objet JSON avec:
- homeTeam: nom équipe domicile (normalisé, ex: "Chelsea" pas "Chelsea FC")
- awayTeam: nom équipe extérieur (normalisé)
- date: date/heure du match au format ISO (si mentionnée, sinon demain à 20h)
- odds: TOUJOURS extraire les cotes si présentes! Format: {"1X2": {"home": X.XX, "draw": X.XX, "away": X.XX}}

IMPORTANT pour les cotes:
- Cherche 3 nombres qui représentent: Domicile / Nul / Extérieur
- Format Winner: souvent "2.10  3.40  3.50" ou similaire
- Toujours inclure le champ "odds" même si estimé

Texte à analyser:
${input}

Réponds UNIQUEMENT avec un array JSON, sans explication:
[{"homeTeam":"...","awayTeam":"...","date":"...","odds":{"1X2":{"home":X.XX,"draw":X.XX,"away":X.XX}}}]`;

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type');
      }

      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return parsed.map((match: any) => ({
        id: randomUUID(),
        date: match.date || new Date(Date.now() + 86400000).toISOString(),
        sport,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        odds: match.odds
      }));
    } catch (error) {
      console.error('Smart parser error:', error);
      throw new Error(`Failed to parse with AI: ${(error as Error).message}`);
    }
  }
}
