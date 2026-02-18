import type { Match, TeamStats, MatchMetrics, H2HStats, Sport } from './types.js';

export class Analyzer {
  static calculateTeamStats(teamName: string, matches: Match[], sport: Sport): TeamStats {
    const teamNameLower = teamName.toLowerCase();
    const teamMatches = matches.filter(m =>
      m.homeTeam.toLowerCase() === teamNameLower || m.awayTeam.toLowerCase() === teamNameLower
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const overall = this.calculateMetrics(teamName, teamMatches);
    const home = this.calculateMetrics(teamName, teamMatches.filter(m => m.homeTeam === teamName));
    const away = this.calculateMetrics(teamName, teamMatches.filter(m => m.awayTeam === teamName));

    const last5 = teamMatches.slice(0, 5);
    const last10 = teamMatches.slice(0, 10);

    return {
      teamId: teamName,
      sport,
      overall,
      home,
      away,
      formLast5: this.getFormString(teamName, last5),
      formLast10: this.getFormString(teamName, last10),
      recentTrends: this.calculateTrends(teamName, last10),
      advanced: this.calculateAdvanced(teamName, teamMatches),
      lastUpdated: new Date().toISOString()
    };
  }

  private static calculateMetrics(teamName: string, matches: Match[]): MatchMetrics {
    let wins = 0, draws = 0, losses = 0;
    let goalsFor = 0, goalsAgainst = 0;

    for (const match of matches) {
      const isHome = match.homeTeam === teamName;
      const teamScore = isHome ? match.scoreHome : match.scoreAway;
      const oppScore = isHome ? match.scoreAway : match.scoreHome;

      goalsFor += teamScore;
      goalsAgainst += oppScore;

      if (teamScore > oppScore) wins++;
      else if (teamScore === oppScore) draws++;
      else losses++;
    }

    const matchesPlayed = matches.length;

    return {
      matchesPlayed,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      avgGoalsFor: matchesPlayed > 0 ? goalsFor / matchesPlayed : 0,
      avgGoalsAgainst: matchesPlayed > 0 ? goalsAgainst / matchesPlayed : 0
    };
  }

  private static getFormString(teamName: string, matches: Match[]): string {
    return matches.map(m => {
      const isHome = m.homeTeam === teamName;
      const teamScore = isHome ? m.scoreHome : m.scoreAway;
      const oppScore = isHome ? m.scoreAway : m.scoreHome;

      if (teamScore > oppScore) return 'W';
      if (teamScore === oppScore) return 'D';
      return 'L';
    }).join('-');
  }

  private static calculateTrends(teamName: string, matches: Match[]) {
    let scoringStreak = 0;
    let cleanSheetStreak = 0;
    let winStreak = 0;
    let unbeatenStreak = 0;

    for (const match of matches) {
      const isHome = match.homeTeam === teamName;
      const teamScore = isHome ? match.scoreHome : match.scoreAway;
      const oppScore = isHome ? match.scoreAway : match.scoreHome;

      if (teamScore > 0) scoringStreak++;
      else break;
    }

    for (const match of matches) {
      const isHome = match.homeTeam === teamName;
      const oppScore = isHome ? match.scoreAway : match.scoreHome;

      if (oppScore === 0) cleanSheetStreak++;
      else break;
    }

    for (const match of matches) {
      const isHome = match.homeTeam === teamName;
      const teamScore = isHome ? match.scoreHome : match.scoreAway;
      const oppScore = isHome ? match.scoreAway : match.scoreHome;

      if (teamScore > oppScore) winStreak++;
      else break;
    }

    for (const match of matches) {
      const isHome = match.homeTeam === teamName;
      const teamScore = isHome ? match.scoreHome : match.scoreAway;
      const oppScore = isHome ? match.scoreAway : match.scoreHome;

      if (teamScore >= oppScore) unbeatenStreak++;
      else break;
    }

    return { scoringStreak, cleanSheetStreak, winStreak, unbeatenStreak };
  }

  private static calculateAdvanced(teamName: string, matches: Match[]) {
    let bttsCount = 0;
    let over25Count = 0;
    let cornersTotal = 0;
    let cornersCount = 0;

    for (const match of matches) {
      const isHome = match.homeTeam === teamName;
      const teamScore = isHome ? match.scoreHome : match.scoreAway;
      const oppScore = isHome ? match.scoreAway : match.scoreHome;

      if (teamScore > 0 && oppScore > 0) bttsCount++;
      if (teamScore + oppScore > 2.5) over25Count++;

      if (match.metadata?.corners) {
        const teamCorners = isHome ? match.metadata.corners.home : match.metadata.corners.away;
        cornersTotal += teamCorners;
        cornersCount++;
      }
    }

    return {
      bttsPercentage: matches.length > 0 ? (bttsCount / matches.length) * 100 : 0,
      over25Percentage: matches.length > 0 ? (over25Count / matches.length) * 100 : 0,
      avgCornersFor: cornersCount > 0 ? cornersTotal / cornersCount : undefined
    };
  }

  static analyzeH2H(team1: string, team2: string, matches: Match[]): H2HStats {
    const team1Lower = team1.toLowerCase();
    const team2Lower = team2.toLowerCase();
    const h2hMatches = matches.filter(m =>
      (m.homeTeam.toLowerCase() === team1Lower && m.awayTeam.toLowerCase() === team2Lower) ||
      (m.homeTeam.toLowerCase() === team2Lower && m.awayTeam.toLowerCase() === team1Lower)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    let team1Wins = 0, draws = 0, team2Wins = 0;
    let goalsTeam1 = 0, goalsTeam2 = 0;

    for (const match of h2hMatches) {
      const team1IsHome = match.homeTeam === team1;
      const team1Score = team1IsHome ? match.scoreHome : match.scoreAway;
      const team2Score = team1IsHome ? match.scoreAway : match.scoreHome;

      goalsTeam1 += team1Score;
      goalsTeam2 += team2Score;

      if (team1Score > team2Score) team1Wins++;
      else if (team1Score === team2Score) draws++;
      else team2Wins++;
    }

    const avgGoalsTeam1 = h2hMatches.length > 0 ? goalsTeam1 / h2hMatches.length : 0;
    const avgGoalsTeam2 = h2hMatches.length > 0 ? goalsTeam2 / h2hMatches.length : 0;

    let dominance: 'team1' | 'team2' | 'balanced' = 'balanced';
    if (team1Wins > team2Wins + 1) dominance = 'team1';
    else if (team2Wins > team1Wins + 1) dominance = 'team2';

    return {
      team1,
      team2,
      last5Meetings: h2hMatches,
      team1Wins,
      draws,
      team2Wins,
      avgGoalsTeam1,
      avgGoalsTeam2,
      dominance
    };
  }
}
