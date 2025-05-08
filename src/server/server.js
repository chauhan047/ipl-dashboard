import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { teams } from '../data/mockData.js';

const app = express();
const port = process.env.PORT || 3001;

const CRICKET_API_KEY = '4cfb4240-7d2c-468a-b75d-3f7a83592052';
const CRICKET_API_BASE_URL = 'https://api.cricapi.com/v1';
const IPL_SERIES_ID = 'd5a498c8–7596–4b93–8ab0-e0efc3345312';

// IPL Series Information
const IPL_SERIES_INFO = {
  id: IPL_SERIES_ID,
  name: 'Indian Premier League 2022',
  shortName: 'IPL2022',
  startDate: '2022-03-26',
  endDate: 'May 29',
  odi: 0,
  t20: 70,
  test: 0,
  squads: 10,
  matches: 74
};

// Validate API key
if (CRICKET_API_KEY === 'YOUR_API_KEY') {
  console.warn('Warning: Using default API key. Please set CRICKET_API_KEY in your environment variables.');
  console.warn('You can get a free API key from: https://cricapi.com/');
}

app.use(cors());
app.use(express.json());

// Error handler middleware
const errorHandler = (error, res) => {
  console.error('API Error:', error);
  
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your CRICKET_API_KEY.',
        message: 'You can get a free API key from: https://cricapi.com/'
      });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ 
        error: 'API rate limit exceeded. Please try again later.',
        message: 'Free tier has limited requests per day.'
      });
    }
    if (error.code === 'ETIMEDOUT') {
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

app.get('/api/series-info', (req, res) => {
  res.json(IPL_SERIES_INFO);
});

app.get('/api/matches', async (req, res) => {
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
        series_id: IPL_SERIES_ID
      },
      timeout: 5000 // 5 second timeout
    });

    console.log('Matches API Response:', JSON.stringify(response.data, null, 2));

    if (!response.data.data || !Array.isArray(response.data.data)) {
      console.log('Using mock matches data');
      const mockMatches = [
        {
          id: '1',
          team1: {
            id: '1',
            name: 'Chennai Super Kings',
            shortName: 'CSK',
            logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/CSK/logos/Roundbig/CSKroundbig.png',
            primaryColor: '#FFFF00',
            secondaryColor: '#000080'
          },
          team2: {
            id: '2',
            name: 'Royal Challengers Bangalore',
            shortName: 'RCB',
            logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/RCB/Logos/Roundbig/RCBroundbig.png',
            primaryColor: '#EC1C24',
            secondaryColor: '#000000'
          },
          date: '2024-03-22',
          time: '19:30',
          venue: 'MA Chidambaram Stadium, Chennai',
          status: 'live',
          team1Score: {
            runs: 185,
            wickets: 4,
            overs: 20
          },
          team2Score: {
            runs: 165,
            wickets: 8,
            overs: 19.2
          }
        },
        {
          id: '2',
          team1: {
            id: '3',
            name: 'Mumbai Indians',
            shortName: 'MI',
            logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/MI/Logos/Roundbig/MIroundbig.png',
            primaryColor: '#004BA0',
            secondaryColor: '#D1AB3E'
          },
          team2: {
            id: '4',
            name: 'Gujarat Titans',
            shortName: 'GT',
            logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/GT/Logos/Roundbig/GTroundbig.png',
            primaryColor: '#1C1C1C',
            secondaryColor: '#A72056'
          },
          date: '2024-03-23',
          time: '15:30',
          venue: 'Narendra Modi Stadium, Ahmedabad',
          status: 'upcoming'
        }
      ];
      return res.json(mockMatches);
    }

    const matches = response.data.data.map((match) => {
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
        team1,
        team2,
        date: match.date || 'TBD',
        time: match.date ? new Date(match.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'TBD',
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
        seriesInfo: {
          id: IPL_SERIES_INFO.id,
          name: IPL_SERIES_INFO.name,
          shortName: IPL_SERIES_INFO.shortName
        }
      };
    });

    res.json(matches);
  } catch (error) {
    console.error('Matches API Error:', error);
    
    // If there's an error, return mock data instead of an error
    console.log('Error occurred, using mock matches data');
    const mockMatches = [
      {
        id: '1',
        team1: {
          id: '1',
          name: 'Chennai Super Kings',
          shortName: 'CSK',
          logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/CSK/logos/Roundbig/CSKroundbig.png',
          primaryColor: '#FFFF00',
          secondaryColor: '#000080'
        },
        team2: {
          id: '2',
          name: 'Royal Challengers Bangalore',
          shortName: 'RCB',
          logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/RCB/Logos/Roundbig/RCBroundbig.png',
          primaryColor: '#EC1C24',
          secondaryColor: '#000000'
        },
        date: '2024-03-22',
        time: '19:30',
        venue: 'MA Chidambaram Stadium, Chennai',
        status: 'live',
        team1Score: {
          runs: 185,
          wickets: 4,
          overs: 20
        },
        team2Score: {
          runs: 165,
          wickets: 8,
          overs: 19.2
        }
      },
      {
        id: '2',
        team1: {
          id: '3',
          name: 'Mumbai Indians',
          shortName: 'MI',
          logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/MI/Logos/Roundbig/MIroundbig.png',
          primaryColor: '#004BA0',
          secondaryColor: '#D1AB3E'
        },
        team2: {
          id: '4',
          name: 'Gujarat Titans',
          shortName: 'GT',
          logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/GT/Logos/Roundbig/GTroundbig.png',
          primaryColor: '#1C1C1C',
          secondaryColor: '#A72056'
        },
        date: '2024-03-23',
        time: '15:30',
        venue: 'Narendra Modi Stadium, Ahmedabad',
        status: 'upcoming'
      }
    ];
    res.json(mockMatches);
  }
});

// Get points table
app.get('/api/points-table', async (req, res) => {
  if (CRICKET_API_KEY === 'YOUR_API_KEY') {
    return res.status(401).json({
      error: 'API key not configured',
      message: 'Please set CRICKET_API_KEY in your environment variables. You can get a free API key from: https://cricapi.com/'
    });
  }

  try {
    // First try to get the series points table
    const response = await axios.get(`${CRICKET_API_BASE_URL}/series_points_table`, {
      params: {
        apikey: CRICKET_API_KEY,
        series_id: IPL_SERIES_ID
      },
      timeout: 5000 // 5 second timeout
    });

    console.log('Points Table API Response:', JSON.stringify(response.data, null, 2));

    // If the response doesn't have the expected format, return mock data
    if (!response.data.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
      console.log('Using mock points table data');
      const mockPointsTable = teams.map((team, index) => ({
        team,
        played: Math.floor(Math.random() * 5),
        won: Math.floor(Math.random() * 5),
        lost: Math.floor(Math.random() * 5),
        points: Math.floor(Math.random() * 10),
        netRunRate: (Math.random() * 2 - 1).toFixed(2),
        seriesInfo: {
          id: IPL_SERIES_INFO.id,
          name: IPL_SERIES_INFO.name,
          shortName: IPL_SERIES_INFO.shortName
        }
      }));

      return res.json(mockPointsTable);
    }

    const pointsTable = response.data.data.map((team) => {
      const teamId = team.team_id?.toLowerCase().replace(/\s+/g, '') || 'unknown';
      const teamData = teams.find(t => t.id === teamId) || {
        id: teamId,
        name: team.team_name || 'Unknown Team',
        shortName: teamId.toUpperCase(),
        logo: 'https://via.placeholder.com/150',
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF'
      };

      return {
        team: teamData,
        played: parseInt(team.played) || 0,
        won: parseInt(team.won) || 0,
        lost: parseInt(team.lost) || 0,
        points: parseInt(team.points) || 0,
        netRunRate: parseFloat(team.nrr) || 0,
        seriesInfo: {
          id: IPL_SERIES_INFO.id,
          name: IPL_SERIES_INFO.name,
          shortName: IPL_SERIES_INFO.shortName
        }
      };
    });

    res.json(pointsTable);
  } catch (error) {
    console.error('Points Table Error:', error);
    
    // If there's an error, return mock data instead of an error
    console.log('Error occurred, using mock points table data');
    const mockPointsTable = teams.map((team, index) => ({
      team,
      played: Math.floor(Math.random() * 5),
      won: Math.floor(Math.random() * 5),
      lost: Math.floor(Math.random() * 5),
      points: Math.floor(Math.random() * 10),
      netRunRate: (Math.random() * 2 - 1).toFixed(2),
      seriesInfo: {
        id: IPL_SERIES_INFO.id,
        name: IPL_SERIES_INFO.name,
        shortName: IPL_SERIES_INFO.shortName
      }
    }));

    res.json(mockPointsTable);
  }
});

// Get player stats
app.get('/api/player-stats', async (req, res) => {
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
        series_id: IPL_SERIES_ID
      },
      timeout: 5000 // 5 second timeout
    });

    if (!response.data.data || !Array.isArray(response.data.data)) {
      return res.status(500).json({ 
        error: 'Invalid response format from Cricket API',
        message: 'The API returned an unexpected format. Please try again later.'
      });
    }

    const playerStats = response.data.data.map((player) => {
      const teamId = player.team_id?.toLowerCase().replace(/\s+/g, '') || 'unknown';
      const teamData = teams.find(t => t.id === teamId) || {
        id: teamId,
        name: player.team_name || 'Unknown Team',
        shortName: teamId.toUpperCase(),
        logo: 'https://via.placeholder.com/150',
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF'
      };

      return {
        id: player.id || 'unknown',
        name: player.name || 'Unknown Player',
        team: teamData,
        matches: parseInt(player.matches) || 0,
        runs: parseInt(player.runs) || 0,
        wickets: parseInt(player.wickets) || 0,
        average: parseFloat(player.average) || 0,
        strikeRate: parseFloat(player.strikeRate) || 0,
        economy: parseFloat(player.economy) || 0,
        seriesInfo: {
          id: IPL_SERIES_INFO.id,
          name: IPL_SERIES_INFO.name,
          shortName: IPL_SERIES_INFO.shortName
        }
      };
    });

    res.json(playerStats);
  } catch (error) {
    errorHandler(error, res);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    apiKey: CRICKET_API_KEY === 'YOUR_API_KEY' ? 'not configured' : 'configured',
    message: CRICKET_API_KEY === 'YOUR_API_KEY' ? 
      'Please set CRICKET_API_KEY in your environment variables. You can get a free API key from: https://cricapi.com/' : 
      'API key is configured',
    seriesInfo: IPL_SERIES_INFO
  });
});

// Mock data for match schedules
const mockSchedules = [
  {
    id: '1',
    date: '2024-03-22',
    day: 'Friday',
    matches: [
      {
        id: '1',
        team1: {
          id: '1',
          name: 'Chennai Super Kings',
          shortName: 'CSK',
          logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/CSK/logos/Roundbig/CSKroundbig.png',
          primaryColor: '#FFFF00',
          secondaryColor: '#000080'
        },
        team2: {
          id: '2',
          name: 'Royal Challengers Bangalore',
          shortName: 'RCB',
          logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/RCB/Logos/Roundbig/RCBroundbig.png',
          primaryColor: '#EC1C24',
          secondaryColor: '#000000'
        },
        time: '19:30',
        venue: 'MA Chidambaram Stadium, Chennai',
        status: 'upcoming'
      }
    ]
  },
  {
    id: '2',
    date: '2024-03-23',
    day: 'Saturday',
    matches: [
      {
        id: '2',
        team1: {
          id: '3',
          name: 'Mumbai Indians',
          shortName: 'MI',
          logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/MI/Logos/Roundbig/MIroundbig.png',
          primaryColor: '#004BA0',
          secondaryColor: '#D1AB3E'
        },
        team2: {
          id: '4',
          name: 'Gujarat Titans',
          shortName: 'GT',
          logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/GT/Logos/Roundbig/GTroundbig.png',
          primaryColor: '#1C1C1C',
          secondaryColor: '#A72056'
        },
        time: '15:30',
        venue: 'Narendra Modi Stadium, Ahmedabad',
        status: 'upcoming'
      },
      {
        id: '3',
        team1: {
          id: '5',
          name: 'Kolkata Knight Riders',
          shortName: 'KKR',
          logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/KKR/Logos/Roundbig/KKRroundbig.png',
          primaryColor: '#3A225D',
          secondaryColor: '#B3A123'
        },
        team2: {
          id: '6',
          name: 'Sunrisers Hyderabad',
          shortName: 'SRH',
          logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/SRH/Logos/Roundbig/SRHroundbig.png',
          primaryColor: '#F26522',
          secondaryColor: '#000000'
        },
        time: '19:30',
        venue: 'Eden Gardens, Kolkata',
        status: 'upcoming'
      }
    ]
  }
];

// Add new endpoint for match schedules
app.get('/api/schedules', async (req, res) => {
  try {
    const response = await axios.get('https://api.cricapi.com/v1/series_matches', {
      params: {
        apikey: CRICKET_API_KEY,
        id: 'c75f8952-74d4-416f-b7b4-7da4b7e2aeef' // IPL 2024 series ID
      }
    });

    if (response.data.status === 'success' && response.data.data) {
      // Group matches by date
      const matchesByDate = response.data.data.reduce((acc, match) => {
        const date = new Date(match.date).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {
            id: date,
            date: date,
            day: new Date(match.date).toLocaleDateString('en-US', { weekday: 'long' }),
            matches: []
          };
        }
        acc[date].matches.push({
          id: match.id,
          team1: {
            id: match.teams[0].id,
            name: match.teams[0].name,
            shortName: match.teams[0].shortname,
            logo: `https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/${match.teams[0].shortname}/Logos/Roundbig/${match.teams[0].shortname}roundbig.png`,
            primaryColor: '#000000',
            secondaryColor: '#FFFFFF'
          },
          team2: {
            id: match.teams[1].id,
            name: match.teams[1].name,
            shortName: match.teams[1].shortname,
            logo: `https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/${match.teams[1].shortname}/Logos/Roundbig/${match.teams[1].shortname}roundbig.png`,
            primaryColor: '#000000',
            secondaryColor: '#FFFFFF'
          },
          time: new Date(match.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          venue: match.venue,
          status: match.status
        });
        return acc;
      }, {});

      // Convert to array and sort by date
      const schedules = Object.values(matchesByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
      res.json(schedules);
    } else {
      console.log('Using mock schedule data');
      res.json(mockSchedules);
    }
  } catch (error) {
    console.error('Error fetching schedules:', error.message);
    console.log('Using mock schedule data');
    res.json(mockSchedules);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Health check available at http://localhost:${port}/api/health`);
}); 