export type Sport = 'football' | 'basketball' | 'tennis';
export type BetType = '1X2' | 'BTTS' | 'Over/Under' | 'Handicap' | 'HT' | 'Corners';

export interface Match {
  id: string;
  date: string;
  sport: Sport;
  homeTeam: string;
  awayTeam: string;
  scoreHome: number;
  scoreAway: number;
  scoreHT?: { home: number; away: number };
  league?: string;
  metadata?: {
    corners?: { home: number; away: number };
    cards?: { yellow: number; red: number };
  };
}

export interface UpcomingMatch {
  id: string;
  date: string;
  sport: Sport;
  homeTeam: string;
  awayTeam: string;
  league?: string;
  odds?: {
    '1X2'?: { home: number; draw: number; away: number };
    btts?: { yes: number; no: number };
    over25?: number;
    under25?: number;
  };
}

export interface MatchMetrics {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  avgGoalsFor: number;
  avgGoalsAgainst: number;
}

export interface TeamStats {
  teamId: string;
  sport: Sport;
  overall: MatchMetrics;
  home: MatchMetrics;
  away: MatchMetrics;
  formLast5: string;
  formLast10: string;
  recentTrends: {
    scoringStreak: number;
    cleanSheetStreak: number;
    winStreak: number;
    unbeatenStreak: number;
  };
  advanced: {
    bttsPercentage: number;
    over25Percentage: number;
    avgCornersFor?: number;
  };
  lastUpdated: string;
}

export interface H2HStats {
  team1: string;
  team2: string;
  last5Meetings: Match[];
  team1Wins: number;
  draws: number;
  team2Wins: number;
  avgGoalsTeam1: number;
  avgGoalsTeam2: number;
  dominance: 'team1' | 'team2' | 'balanced';
}

export interface Recommendation {
  matchId: string;
  match: string;
  date: string;
  sport: Sport;
  betType: BetType;
  selection: string;
  odds: number;
  confidence: number;
  reasoning: string[];
  valueRating: number;
}

export interface ComboRecommendation {
  id: string;
  bets: Recommendation[];
  totalOdds: number;
  confidence: number;
  reasoning: string;
}

export interface ResultsData {
  football: Match[];
  basketball: Match[];
  tennis: Match[];
}

export interface UpcomingData {
  football: UpcomingMatch[];
  basketball: UpcomingMatch[];
  tennis: UpcomingMatch[];
}

export interface AppConfig {
  minOdds: number;
  minConfidence: number;
  recentFormMatches: number;
  enabledSports: Sport[];
  betTypes: {
    '1X2': boolean;
    BTTS: boolean;
    overUnder: boolean;
    handicap: boolean;
    corners: boolean;
  };
  comboSettings: {
    minBets: number;
    maxBets: number;
    minTotalOdds: number;
    maxCorrelation: number;
  };
}
