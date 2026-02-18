import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ResultParser, UpcomingParser } from '../src/parser.js';
import { SmartParser } from '../src/smart-parser.js';
import { Storage } from '../src/storage.js';
import { Analyzer } from '../src/analyzer.js';
import { Recommender } from '../src/recommender.js';
import type { Sport } from '../src/types.js';

const app = express();
const PORT = 5200;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// POST /api/results - Add results
app.post('/api/results', async (req, res) => {
  try {
    const { text, sport = 'football', useSmart = false } = req.body;
    const matches = useSmart
      ? await SmartParser.parseResults(text, sport as Sport)
      : ResultParser.parseResults(text, sport as Sport);
    await Storage.addResults(sport, matches);
    res.json({ success: true, count: matches.length, matches });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/upcoming - Add upcoming matches
app.post('/api/upcoming', async (req, res) => {
  try {
    const { text, sport = 'football', useSmart = false } = req.body;
    const matches = useSmart
      ? await SmartParser.parseUpcoming(text, sport as Sport)
      : UpcomingParser.parseUpcoming(text, sport as Sport);
    await Storage.addUpcoming(sport, matches);
    res.json({ success: true, count: matches.length, matches });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/recommendations - Get recommendations
app.get('/api/recommendations', async (req, res) => {
  try {
    const config = await Storage.getConfig();
    const results = await Storage.getResults();
    const upcoming = await Storage.getUpcoming();

    const sport = (req.query.sport as Sport) || 'football';

    console.log('🎯 Recommendations request:', {
      sport,
      upcomingCount: upcoming[sport].length,
      resultsCount: results[sport].length
    });

    console.log('📅 Sample upcoming match:', upcoming[sport][0]);
    console.log('⚙️  Config:', config);

    const recommender = new Recommender(config);

    const singles = recommender.generateRecommendations(
      upcoming[sport],
      results[sport]
    );

    const combos = recommender.generateCombos(singles);

    console.log('💡 Recommendations generated:', {
      singles: singles.length,
      combos: combos.length
    });

    if (singles.length === 0) {
      console.log('⚠️  No recommendations generated. Reasons:');
      console.log('   - Matches need odds (1X2, BTTS, or Over/Under)');
      console.log('   - Confidence must be >= ' + config.minConfidence);
      console.log('   - Odds must be >= ' + config.minOdds);
    }

    res.json({ singles, combos });
  } catch (error) {
    console.error('❌ Recommendations error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/stats/:team - Get team stats
app.get('/api/stats/:team', async (req, res) => {
  try {
    const { team } = req.params;
    const sport = (req.query.sport as Sport) || 'football';
    const results = await Storage.getResults();

    console.log('🔍 Stats request:', { team, sport, resultsCount: results[sport].length });
    console.log('📋 Available teams:', [...new Set(results[sport].flatMap(m => [m.homeTeam, m.awayTeam]))]);

    const stats = Analyzer.calculateTeamStats(team, results[sport], sport);
    console.log('📊 Stats calculated:', stats);

    res.json(stats);
  } catch (error) {
    console.error('❌ Stats error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/results - Get all results
app.get('/api/results', async (req, res) => {
  try {
    const results = await Storage.getResults();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/upcoming - Get all upcoming matches
app.get('/api/upcoming', async (req, res) => {
  try {
    const upcoming = await Storage.getUpcoming();
    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/config - Get config
app.get('/api/config', async (req, res) => {
  try {
    const config = await Storage.getConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PUT /api/config - Update config
app.put('/api/config', async (req, res) => {
  try {
    await Storage.updateConfig(req.body);
    const config = await Storage.getConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`🎯 Sports Analyser running on http://localhost:${PORT}`);
});
