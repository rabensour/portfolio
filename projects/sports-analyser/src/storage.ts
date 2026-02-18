import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import type { ResultsData, UpcomingData, AppConfig, Match, UpcomingMatch, Sport } from './types.js';

const DATA_DIR = join(process.cwd(), 'data');
const CONFIG_DIR = join(process.cwd(), 'config');

export class Storage {
  private static async ensureDir(path: string) {
    if (!existsSync(dirname(path))) {
      await mkdir(dirname(path), { recursive: true });
    }
  }

  private static async readJSON<T>(path: string, defaultValue: T): Promise<T> {
    try {
      const data = await readFile(path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }

  private static async writeJSON(path: string, data: unknown): Promise<void> {
    await this.ensureDir(path);
    await writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Results
  static async getResults(): Promise<ResultsData> {
    return this.readJSON(join(DATA_DIR, 'results.json'), {
      football: [],
      basketball: [],
      tennis: []
    });
  }

  static async addResults(sport: Sport, matches: Match[]): Promise<void> {
    const data = await this.getResults();
    data[sport].push(...matches);
    await this.writeJSON(join(DATA_DIR, 'results.json'), data);
  }

  // Upcoming
  static async getUpcoming(): Promise<UpcomingData> {
    return this.readJSON(join(DATA_DIR, 'upcoming.json'), {
      football: [],
      basketball: [],
      tennis: []
    });
  }

  static async addUpcoming(sport: Sport, matches: UpcomingMatch[]): Promise<void> {
    const data = await this.getUpcoming();
    data[sport].push(...matches);
    await this.writeJSON(join(DATA_DIR, 'upcoming.json'), data);
  }

  static async clearUpcoming(sport?: Sport): Promise<void> {
    const data = await this.getUpcoming();
    if (sport) {
      data[sport] = [];
    } else {
      data.football = [];
      data.basketball = [];
      data.tennis = [];
    }
    await this.writeJSON(join(DATA_DIR, 'upcoming.json'), data);
  }

  // Config
  static async getConfig(): Promise<AppConfig> {
    return this.readJSON(join(CONFIG_DIR, 'settings.json'), {
      minOdds: 1.6,
      minConfidence: 60,
      recentFormMatches: 5,
      enabledSports: ['football'],
      betTypes: {
        '1X2': true,
        BTTS: true,
        overUnder: true,
        handicap: false,
        corners: false
      },
      comboSettings: {
        minBets: 2,
        maxBets: 4,
        minTotalOdds: 1.6,
        maxCorrelation: 0.3
      }
    });
  }

  static async updateConfig(config: Partial<AppConfig>): Promise<void> {
    const current = await this.getConfig();
    await this.writeJSON(join(CONFIG_DIR, 'settings.json'), { ...current, ...config });
  }
}
