import type { Match, UpcomingMatch, Sport } from './types.js';
import { randomUUID } from 'crypto';

const TEAM_ALIASES: Record<string, string> = {
  'psg': 'PSG', 'paris': 'PSG', 'paris sg': 'PSG',
  'om': 'OM', 'marseille': 'OM',
  'ol': 'Lyon', 'olympique lyonnais': 'Lyon',
  'losc': 'Lille', 'lille': 'Lille',
  'monaco': 'Monaco', 'as monaco': 'Monaco',
  'nice': 'Nice', 'ogc nice': 'Nice',
  'lens': 'Lens', 'rc lens': 'Lens',
  'rennes': 'Rennes', 'stade rennais': 'Rennes',
};

function normalizeTeam(name: string): string {
  const key = name.trim().toLowerCase();
  return TEAM_ALIASES[key] || name.trim();
}

export class ResultParser {
  static parseResults(input: string, sport: Sport = 'football'): Match[] {
    const lines = input.split('\n').filter(l => l.trim());
    const results: Match[] = [];

    // Try multi-line format first (date + homeTeam + homeTeam + awayTeam + awayTeam + scoreHome + scoreAway)
    for (let i = 0; i < lines.length; i++) {
      const parsed = this.parseMultiLine(lines, i, sport);
      if (parsed) {
        results.push(parsed);
        i += 6; // Skip next 6 lines (already processed)
        continue;
      }

      // Fallback to single line parsing
      const singleParsed = this.parseLine(lines[i], sport);
      if (singleParsed) results.push(singleParsed);
    }

    return results;
  }

  private static parseMultiLine(lines: string[], startIndex: number, sport: Sport): Match | null {
    // Format: date\nhomeTeam\nhomeTeam\nawayTeam\nawayTeam\nscoreHome\nscoreAway
    if (startIndex + 6 >= lines.length) return null;

    const dateLine = lines[startIndex].trim();
    const homeTeam1 = lines[startIndex + 1].trim();
    const homeTeam2 = lines[startIndex + 2].trim();
    const awayTeam1 = lines[startIndex + 3].trim();
    const awayTeam2 = lines[startIndex + 4].trim();
    const scoreHome = lines[startIndex + 5].trim();
    const scoreAway = lines[startIndex + 6].trim();

    // Check if date matches format "DD.MM. HH:MM"
    const dateMatch = dateLine.match(/^(\d{1,2})\.(\d{1,2})\.\s+(\d{1,2}):(\d{2})$/);
    if (!dateMatch) return null;

    // Check if teams are duplicated (typical of this format)
    if (homeTeam1 !== homeTeam2 || awayTeam1 !== awayTeam2) return null;

    // Check if scores are valid numbers
    if (!/^\d+$/.test(scoreHome) || !/^\d+$/.test(scoreAway)) return null;

    const [, day, month, hours, minutes] = dateMatch;
    const year = new Date().getFullYear();
    const date = new Date(year, parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));

    return {
      id: randomUUID(),
      date: date.toISOString(),
      sport,
      homeTeam: normalizeTeam(homeTeam1),
      awayTeam: normalizeTeam(awayTeam1),
      scoreHome: parseInt(scoreHome),
      scoreAway: parseInt(scoreAway)
    };
  }

  private static parseLine(line: string, sport: Sport): Match | null {
    line = line.trim();
    if (!line) return null;

    // CSV: "PSG,OM,3,1,2024-01-25"
    if (line.includes(',')) {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length < 4) return null;
      return {
        id: randomUUID(),
        date: parts[4] || new Date().toISOString(),
        sport,
        homeTeam: normalizeTeam(parts[0]),
        awayTeam: normalizeTeam(parts[1]),
        scoreHome: parseInt(parts[2]),
        scoreAway: parseInt(parts[3]),
        league: parts[5]
      };
    }

    // Flashscore: "PSG - OM 3:1 (2:0)"
    let match = line.match(/^(.+?)\s*[-–]\s*(.+?)\s+(\d+):(\d+)\s*(?:\((\d+):(\d+)\))?/);
    if (match) {
      const [, home, away, sh, sa, hth, hta] = match;
      return {
        id: randomUUID(),
        date: new Date().toISOString(),
        sport,
        homeTeam: normalizeTeam(home),
        awayTeam: normalizeTeam(away),
        scoreHome: parseInt(sh),
        scoreAway: parseInt(sa),
        scoreHT: hth && hta ? { home: parseInt(hth), away: parseInt(hta) } : undefined
      };
    }

    // Simple: "PSG vs OM 3-1"
    match = line.match(/^(.+?)\s+(?:vs|v)\s+(.+?)\s+(\d+)-(\d+)/);
    if (match) {
      const [, home, away, sh, sa] = match;
      return {
        id: randomUUID(),
        date: new Date().toISOString(),
        sport,
        homeTeam: normalizeTeam(home),
        awayTeam: normalizeTeam(away),
        scoreHome: parseInt(sh),
        scoreAway: parseInt(sa)
      };
    }

    return null;
  }
}

export class UpcomingParser {
  static parseUpcoming(input: string, sport: Sport = 'football'): UpcomingMatch[] {
    const lines = input.split('\n').filter(l => l.trim());
    const results: UpcomingMatch[] = [];

    // Try multi-line format first (time + homeTeam + homeTeam + awayTeam + awayTeam)
    for (let i = 0; i < lines.length; i++) {
      const parsed = this.parseMultiLine(lines, i, sport);
      if (parsed) {
        results.push(parsed);
        i += 4; // Skip next 4 lines (already processed)
        continue;
      }

      // Fallback to single line parsing
      const singleParsed = this.parseLine(lines[i], sport);
      if (singleParsed) results.push(singleParsed);
    }

    return results;
  }

  private static parseMultiLine(lines: string[], startIndex: number, sport: Sport): UpcomingMatch | null {
    // Format: HH:MM\nhomeTeam\nhomeTeam\nawayTeam\nawayTeam
    if (startIndex + 4 >= lines.length) return null;

    const timeLine = lines[startIndex].trim();
    const homeTeam1 = lines[startIndex + 1].trim();
    const homeTeam2 = lines[startIndex + 2].trim();
    const awayTeam1 = lines[startIndex + 3].trim();
    const awayTeam2 = lines[startIndex + 4].trim();

    // Check if time matches format "HH:MM"
    const timeMatch = timeLine.match(/^(\d{1,2}):(\d{2})$/);
    if (!timeMatch) return null;

    // Check if teams are duplicated (typical of this format)
    if (homeTeam1 !== homeTeam2 || awayTeam1 !== awayTeam2) return null;

    const [, hours, minutes] = timeMatch;
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return {
      id: randomUUID(),
      date: date.toISOString(),
      sport,
      homeTeam: normalizeTeam(homeTeam1),
      awayTeam: normalizeTeam(awayTeam1)
    };
  }

  private static parseLine(line: string, sport: Sport): UpcomingMatch | null {
    line = line.trim();
    if (!line) return null;

    // With odds: "PSG vs OM 26/01 20:00 1.65 3.80 5.20"
    let match = line.match(/^(.+?)\s+(?:vs|v|-)\s+(.+?)\s+(\d{1,2}\/\d{1,2})(?:\s+(\d{1,2}:\d{2}))?\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
    if (match) {
      const [, home, away, date, time, o1, oX, o2] = match;
      return {
        id: randomUUID(),
        date: this.parseDate(date, time),
        sport,
        homeTeam: normalizeTeam(home),
        awayTeam: normalizeTeam(away),
        odds: {
          '1X2': {
            home: parseFloat(o1),
            draw: parseFloat(oX),
            away: parseFloat(o2)
          }
        }
      };
    }

    // With date: "PSG vs OM 26/01"
    match = line.match(/^(.+?)\s+(?:vs|v|-)\s+(.+?)\s+(\d{1,2}\/\d{1,2})(?:\s+(\d{1,2}:\d{2}))?/);
    if (match) {
      const [, home, away, date, time] = match;
      return {
        id: randomUUID(),
        date: this.parseDate(date, time),
        sport,
        homeTeam: normalizeTeam(home),
        awayTeam: normalizeTeam(away)
      };
    }

    // Simple: "PSG vs OM"
    match = line.match(/^(.+?)\s+(?:vs|v|-)\s+(.+)$/);
    if (match) {
      const [, home, away] = match;
      return {
        id: randomUUID(),
        date: new Date(Date.now() + 86400000).toISOString(),
        sport,
        homeTeam: normalizeTeam(home),
        awayTeam: normalizeTeam(away)
      };
    }

    return null;
  }

  private static parseDate(dateStr: string, timeStr?: string): string {
    const [day, month] = dateStr.split('/').map(n => parseInt(n));
    const year = new Date().getFullYear();
    const date = new Date(year, month - 1, day);

    if (timeStr) {
      const [hours, minutes] = timeStr.split(':').map(n => parseInt(n));
      date.setHours(hours, minutes, 0, 0);
    } else {
      date.setHours(20, 0, 0, 0);
    }

    return date.toISOString();
  }
}
