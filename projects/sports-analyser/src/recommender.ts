import type { Match, UpcomingMatch, Recommendation, ComboRecommendation, AppConfig, TeamStats, H2HStats } from './types.js';
import { Analyzer } from './analyzer.js';
import { randomUUID } from 'crypto';

export class Recommender {
  constructor(private config: AppConfig) {}

  generateRecommendations(upcoming: UpcomingMatch[], results: Match[]): Recommendation[] {
    const recs: Recommendation[] = [];

    for (const match of upcoming) {
      const homeStats = Analyzer.calculateTeamStats(match.homeTeam, results, match.sport);
      const awayStats = Analyzer.calculateTeamStats(match.awayTeam, results, match.sport);
      const h2h = Analyzer.analyzeH2H(match.homeTeam, match.awayTeam, results);

      // 1X2
      if (this.config.betTypes['1X2']) {
        const rec1X2 = this.analyze1X2(match, homeStats, awayStats, h2h);
        if (rec1X2 && rec1X2.confidence >= this.config.minConfidence) {
          // Only check minOdds if odds are available
          if (!match.odds?.['1X2'] || rec1X2.odds >= this.config.minOdds) {
            recs.push(rec1X2);
          }
        }
      }

      // BTTS
      if (this.config.betTypes.BTTS && match.odds?.btts) {
        const recBTTS = this.analyzeBTTS(match, homeStats, awayStats);
        if (recBTTS && recBTTS.odds >= this.config.minOdds && recBTTS.confidence >= this.config.minConfidence) {
          recs.push(recBTTS);
        }
      }

      // Over/Under 2.5
      if (this.config.betTypes.overUnder && match.odds?.over25) {
        const recOU = this.analyzeOverUnder(match, homeStats, awayStats);
        if (recOU && recOU.odds >= this.config.minOdds && recOU.confidence >= this.config.minConfidence) {
          recs.push(recOU);
        }
      }
    }

    return recs.sort((a, b) => b.confidence - a.confidence);
  }

  private analyze1X2(
    match: UpcomingMatch,
    homeStats: TeamStats,
    awayStats: TeamStats,
    h2h: H2HStats
  ): Recommendation | null {
    // Allow analysis without odds

    const reasoning: string[] = [];
    let confidence = 50;

    // Home form
    const homeWinRate = (homeStats.home.wins / Math.max(homeStats.home.matchesPlayed, 1)) * 100;
    if (homeWinRate > 60) {
      confidence += 15;
      reasoning.push(`${match.homeTeam}: ${homeWinRate.toFixed(0)}% wins at home`);
    }

    // Away form
    const awayWinRate = (awayStats.away.wins / Math.max(awayStats.away.matchesPlayed, 1)) * 100;
    if (awayWinRate < 30) {
      confidence += 10;
      reasoning.push(`${match.awayTeam}: only ${awayWinRate.toFixed(0)}% wins away`);
    }

    // Recent form
    const homeFormScore = this.calculateFormScore(homeStats.formLast5);
    const awayFormScore = this.calculateFormScore(awayStats.formLast5);

    if (homeFormScore > awayFormScore + 3) {
      confidence += 10;
      reasoning.push(`Better recent form: ${homeStats.formLast5} vs ${awayStats.formLast5}`);
    }

    // H2H
    if (h2h.dominance === 'team1' && h2h.team1 === match.homeTeam) {
      confidence += 5;
      reasoning.push(`H2H: ${h2h.team1Wins}W-${h2h.draws}D-${h2h.team2Wins}L`);
    }

    // Goals
    if (homeStats.home.avgGoalsFor > 1.5 && awayStats.away.avgGoalsAgainst > 1.2) {
      confidence += 5;
      reasoning.push(`Avg goals: ${homeStats.home.avgGoalsFor.toFixed(1)} vs ${awayStats.away.avgGoalsAgainst.toFixed(1)} conceded`);
    }

    // Calculate value if odds are available
    let value = 0;
    let oddsValue = 2.0; // Default estimated odds

    if (match.odds?.['1X2']) {
      oddsValue = match.odds['1X2'].home;
      const impliedProb = 1 / oddsValue;
      const ourProb = confidence / 100;
      value = (ourProb - impliedProb) * 100;
    } else {
      // Without odds, estimate value from confidence
      value = confidence - 60; // Positive if confidence > 60%
    }

    if (confidence >= this.config.minConfidence && value > 0) {
      return {
        matchId: match.id,
        match: `${match.homeTeam} vs ${match.awayTeam}`,
        date: match.date,
        sport: match.sport,
        betType: '1X2',
        selection: `1 (${match.homeTeam} Win)`,
        odds: oddsValue,
        confidence,
        reasoning,
        valueRating: value
      };
    }

    return null;
  }

  private analyzeBTTS(
    match: UpcomingMatch,
    homeStats: TeamStats,
    awayStats: TeamStats
  ): Recommendation | null {
    if (!match.odds?.btts) return null;

    const reasoning: string[] = [];
    let confidence = 50;

    const homeBTTS = homeStats.advanced.bttsPercentage;
    const awayBTTS = awayStats.advanced.bttsPercentage;

    if (homeBTTS > 60 && awayBTTS > 60) {
      confidence += 20;
      reasoning.push(`Both teams BTTS%: ${homeBTTS.toFixed(0)}% / ${awayBTTS.toFixed(0)}%`);
    }

    if (homeStats.overall.avgGoalsFor > 1.2 && awayStats.overall.avgGoalsFor > 1.0) {
      confidence += 10;
      reasoning.push(`Both teams score regularly`);
    }

    if (homeStats.recentTrends.scoringStreak >= 3 && awayStats.recentTrends.scoringStreak >= 3) {
      confidence += 10;
      reasoning.push(`Scoring streaks: ${homeStats.recentTrends.scoringStreak} / ${awayStats.recentTrends.scoringStreak} matches`);
    }

    const odds = match.odds.btts.yes;
    const impliedProb = 1 / odds;
    const ourProb = confidence / 100;
    const value = (ourProb - impliedProb) * 100;

    if (confidence >= this.config.minConfidence && value > 0) {
      return {
        matchId: match.id,
        match: `${match.homeTeam} vs ${match.awayTeam}`,
        date: match.date,
        sport: match.sport,
        betType: 'BTTS',
        selection: 'Yes',
        odds,
        confidence,
        reasoning,
        valueRating: value
      };
    }

    return null;
  }

  private analyzeOverUnder(
    match: UpcomingMatch,
    homeStats: TeamStats,
    awayStats: TeamStats
  ): Recommendation | null {
    if (!match.odds?.over25) return null;

    const reasoning: string[] = [];
    let confidence = 50;

    const homeOver = homeStats.advanced.over25Percentage;
    const awayOver = awayStats.advanced.over25Percentage;

    if (homeOver > 65 && awayOver > 65) {
      confidence += 20;
      reasoning.push(`Over 2.5 %: ${homeOver.toFixed(0)}% / ${awayOver.toFixed(0)}%`);
    }

    const totalAvgGoals = homeStats.home.avgGoalsFor + awayStats.away.avgGoalsAgainst;
    if (totalAvgGoals > 3.0) {
      confidence += 15;
      reasoning.push(`Avg combined goals: ${totalAvgGoals.toFixed(1)}`);
    }

    const odds = match.odds.over25;
    const impliedProb = 1 / odds;
    const ourProb = confidence / 100;
    const value = (ourProb - impliedProb) * 100;

    if (confidence >= this.config.minConfidence && value > 0) {
      return {
        matchId: match.id,
        match: `${match.homeTeam} vs ${match.awayTeam}`,
        date: match.date,
        sport: match.sport,
        betType: 'Over/Under',
        selection: 'Over 2.5',
        odds,
        confidence,
        reasoning,
        valueRating: value
      };
    }

    return null;
  }

  private calculateFormScore(form: string): number {
    let score = 0;
    for (const char of form.split('-')) {
      if (char === 'W') score += 3;
      else if (char === 'D') score += 1;
    }
    return score;
  }

  generateCombos(recommendations: Recommendation[]): ComboRecommendation[] {
    const combos: ComboRecommendation[] = [];
    const { minBets, maxBets, minTotalOdds } = this.config.comboSettings;

    for (let size = minBets; size <= Math.min(maxBets, recommendations.length); size++) {
      const combinations = this.getCombinations(recommendations, size);

      for (const combo of combinations) {
        if (!this.hasCorrelation(combo)) {
          const totalOdds = combo.reduce((acc, r) => acc * r.odds, 1);
          const avgConfidence = combo.reduce((acc, r) => acc + r.confidence, 0) / combo.length;

          if (totalOdds >= minTotalOdds && avgConfidence >= this.config.minConfidence) {
            combos.push({
              id: randomUUID(),
              bets: combo,
              totalOdds: parseFloat(totalOdds.toFixed(2)),
              confidence: parseFloat(avgConfidence.toFixed(0)),
              reasoning: `Combo ${combo.length} paris @ ${totalOdds.toFixed(2)}`
            });
          }
        }
      }
    }

    return combos.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
  }

  private getCombinations<T>(arr: T[], size: number): T[][] {
    if (size === 1) return arr.map(el => [el]);
    const result: T[][] = [];

    for (let i = 0; i <= arr.length - size; i++) {
      const head = arr[i];
      const tailCombos = this.getCombinations(arr.slice(i + 1), size - 1);
      for (const combo of tailCombos) {
        result.push([head, ...combo]);
      }
    }

    return result;
  }

  private hasCorrelation(recs: Recommendation[]): boolean {
    const matchIds = new Set<string>();
    for (const rec of recs) {
      if (matchIds.has(rec.matchId)) return true;
      matchIds.add(rec.matchId);
    }
    return false;
  }
}
