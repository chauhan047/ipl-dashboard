import express from 'express';
import cors from 'cors';
import axios from 'axios';
import type { Request, Response } from 'express';
import type { AxiosError } from 'axios';
import { Match, PointsTableEntry, PlayerStats } from './types.js';
import { teams } from '../data/mockData.js';

const app = express();
const port = process.env.PORT || 3001;

// You'll need to sign up at https://cricapi.com/ to get an API key
const CRICKET_API_KEY = '4cfb4240-7d2c-468a-b75d-3f7a83592052';
const CRICKET_API_BASE_URL = 'https://api.cricapi.com/v1';

// Validate API key
if (CRICKET_API_KEY === '4cfb4240-7d2c-468a-b75d-3f7a83592052') {
  console.warn('Warning: Using default API key. Please set CRICKET_API_KEY in your environment variables.');
  console.warn('You can get a free API key from: https://cricapi.com/');
}

app.use(cors());
app.use(express.json());

// Error handler middleware
const errorHandler = (error: any, res: Response) => {
  console.error('API Error:', error);
  
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your CRICKET_API_KEY.',
        message: 'You can get a free API key from: https://cricapi.com/'
      });
    }
    if (axiosError.response?.status === 429) {
      return res.status(429).json({ 
        error: 'API rate limit exceeded. Please try again later.',
        message: 'Free tier has limited requests per day.'
      });
    }
    if (axiosError.code === 'ETIMEDOUT') {
      return res.status(504).json({ 
        error: 'Request timed out',
        message: 'The Cricket API is taking too long to respond. Please try again later.'
      });
    }
    return res.status(500).json({ 
      error: 'Failed to fetch data from Cricket API',
      message: 'Please check your API key and try again.'
    });
  }
  
  return res.status(500).json({ 
    error: 'Internal server error',
    message: 'Something went wrong on our end. Please try again later.'
  });
};

// Get IPL matches data
app.get('/api/matches', async (req: Request, res: Response) => {
  if (CRICKET_API_KEY === 'YOUR_API_KEY') {
    return res.status(401).json({
      error: 'API key not configured',
      message: 'Please set CRICKET_API_KEY in your environment variables. You can get a free API key from: https://cricapi.com/'
    });
  }

  try {
    const response = await axios.get(`${CRICKET_API_BASE_URL}/matches`, {
      params: {
        apikey: CRICKET_API_KEY,
        offset: 0,
        search: 'IPL'
      },
      timeout: 5000 // 5 second timeout
    });

    if (!response.data.data || !Array.isArray(response.data.data)) {
      return res.status(500).json({ 
        error: 'Invalid response format from Cricket API',
        message: 'The API returned an unexpected format. Please try again later.'
      });
    }

    const matches: Match[] = response.data.data.map((match: any) => {
      const team1Id = match.teams?.[0]?.toLowerCase().replace(/\s+/g, '') || 'unknown';
      const team2Id = match.teams?.[1]?.toLowerCase().replace(/\s+/g, '') || 'unknown';
      
      // Find team data from our mock data
      const team1 = teams.find(team => team.id === team1Id) || {
        id: team1Id,
        name: match.teams?.[0] || 'Unknown Team',
        shortName: team1Id.toUpperCase(),
        logo: 'https://via.placeholder.com/150',
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF'
      };

      const team2 = teams.find(team => team.id === team2Id) || {
        id: team2Id,
        name: match.teams?.[1] || 'Unknown Team',
        shortName: team2Id.toUpperCase(),
        logo: 'https://via.placeholder.com/150',
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF'
      };

      return {
        id: match.id,
        team1Id,
        team2Id,
        date: match.date || 'TBD',
        venue: match.venue || 'TBD',
        status: match.status?.toLowerCase().includes('live') ? 'live' : 
                match.status?.toLowerCase().includes('completed') ? 'completed' : 'upcoming',
        result: match.status || 'TBD',
        team1Score: match.score?.[0] ? {
          runs: parseInt(match.score[0].r) || 0,
          wickets: parseInt(match.score[0].w) || 0,
          overs: parseFloat(match.score[0].o) || 0
        } : undefined,
        team2Score: match.score?.[1] ? {
          runs: parseInt(match.score[1].r) || 0,
          wickets: parseInt(match.score[1].w) || 0,
          overs: parseFloat(match.score[1].o) || 0
        } : undefined,
        team1,
        team2
      };
    });

    res.json(matches);
  } catch (error) {
    errorHandler(error, res);
  }
});

// Get points table
app.get('/api/points-table', async (req: Request, res: Response) => {
  if (CRICKET_API_KEY === 'YOUR_API_KEY') {
    return res.status(401).json({
      error: 'API key not configured',
      message: 'Please set CRICKET_API_KEY in your environment variables. You can get a free API key from: https://cricapi.com/'
    });
  }

  try {
    const response = await axios.get(`${CRICKET_API_BASE_URL}/series_points_table`, {
      params: {
        apikey: CRICKET_API_KEY,
        series_id: 'c75f8952-74d4-416f-b7b4-7da4b4e3ae6e' // IPL 2024 series ID
      },
      timeout: 5000 // 5 second timeout
    });

    if (!response.data.data || !Array.isArray(response.data.data)) {
      return res.status(500).json({ 
        error: 'Invalid response format from Cricket API',
        message: 'The API returned an unexpected format. Please try again later.'
      });
    }

    const pointsTable: PointsTableEntry[] = response.data.data.map((team: any) => ({
      teamId: team.team_id?.toLowerCase().replace(/\s+/g, '') || 'unknown',
      played: parseInt(team.played) || 0,
      won: parseInt(team.won) || 0,
      lost: parseInt(team.lost) || 0,
      tied: parseInt(team.tied) || 0,
      points: parseInt(team.points) || 0,
      netRunRate: parseFloat(team.nrr) || 0
    }));

    res.json(pointsTable);
  } catch (error) {
    errorHandler(error, res);
  }
});

// Get player stats
app.get('/api/player-stats', async (req: Request, res: Response) => {
  if (CRICKET_API_KEY === 'YOUR_API_KEY') {
    return res.status(401).json({
      error: 'API key not configured',
      message: 'Please set CRICKET_API_KEY in your environment variables. You can get a free API key from: https://cricapi.com/'
    });
  }

  try {
    const response = await axios.get(`${CRICKET_API_BASE_URL}/player_stats`, {
      params: {
        apikey: CRICKET_API_KEY,
        series_id: 'c75f8952-74d4-416f-b7b4-7da4b4e3ae6e' // IPL 2024 series ID
      },
      timeout: 5000 // 5 second timeout
    });

    if (!response.data.data || !Array.isArray(response.data.data)) {
      return res.status(500).json({ 
        error: 'Invalid response format from Cricket API',
        message: 'The API returned an unexpected format. Please try again later.'
      });
    }

    const playerStats: PlayerStats[] = response.data.data.map((player: any) => ({
      id: player.id || 'unknown',
      name: player.name || 'Unknown Player',
      team: player.team || 'Unknown Team',
      matches: parseInt(player.matches) || 0,
      runs: parseInt(player.runs) || 0,
      average: parseFloat(player.average) || 0,
      strikeRate: parseFloat(player.strikeRate) || 0,
      hundreds: parseInt(player.hundreds) || 0,
      fifties: parseInt(player.fifties) || 0,
      wickets: player.wickets ? parseInt(player.wickets) : undefined,
      economy: player.economy ? parseFloat(player.economy) : undefined,
      bestBowling: player.bestBowling
    }));

    res.json(playerStats);
  } catch (error) {
    errorHandler(error, res);
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    apiKey: CRICKET_API_KEY === 'YOUR_API_KEY' ? 'not configured' : 'configured',
    message: CRICKET_API_KEY === 'YOUR_API_KEY' ? 
      'Please set CRICKET_API_KEY in your environment variables. You can get a free API key from: https://cricapi.com/' : 
      'API key is configured'
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Health check available at http://localhost:${port}/api/health`);
}); 