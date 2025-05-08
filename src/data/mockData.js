
export const teams = [
  {
    id: 'csk',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    logo: '/teams/csk.png',
    primaryColor: '#FFFF00',
    secondaryColor: '#0081C9'
  },
  {
    id: 'mi',
    name: 'Mumbai Indians',
    shortName: 'MI',
    logo: '/teams/mi.png',
    primaryColor: '#004BA0',
    secondaryColor: '#D1AB3E'
  },
  {
    id: 'rcb',
    name: 'Royal Challengers Bangalore',
    shortName: 'RCB',
    logo: '/teams/rcb.png',
    primaryColor: '#EC1C24',
    secondaryColor: '#000000'
  },
  {
    id: 'kkr',
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    logo: '/teams/kkr.png',
    primaryColor: '#3A225D',
    secondaryColor: '#B3A123'
  },
  {
    id: 'dc',
    name: 'Delhi Capitals',
    shortName: 'DC',
    logo: '/teams/dc.png',
    primaryColor: '#00008B',
    secondaryColor: '#FF0000'
  },
  {
    id: 'gt',
    name: 'Gujarat Titans',
    shortName: 'GT',
    logo: '/teams/gt.png',
    primaryColor: '#1D3C8D',
    secondaryColor: '#0F8641'
  },
  {
    id: 'pbks',
    name: 'Punjab Kings',
    shortName: 'PBKS',
    logo: '/teams/pbks.png',
    primaryColor: '#ED1B24',
    secondaryColor: '#A4A4A4'
  },
  {
    id: 'rr',
    name: 'Rajasthan Royals',
    shortName: 'RR',
    logo: '/teams/rr.png',
    primaryColor: '#254AA5',
    secondaryColor: '#FF1C51'
  },
  {
    id: 'srh',
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    logo: '/teams/srh.png',
    primaryColor: '#FF822A',
    secondaryColor: '#000000'
  },
  {
    id: 'lsg',
    name: 'Lucknow Super Giants',
    shortName: 'LSG',
    logo: '/teams/lsg.png',
    primaryColor: '#A5CFED',
    secondaryColor: '#9BC64D'
  }
];

export const matches = [
  {
    id: '1',
    team1: teams[0],
    team2: teams[1],
    team1Score: {
      runs: 168,
      wickets: 4,
      overs: 20
    },
    team2Score: {
      runs: 172,
      wickets: 5,
      overs: 19.2
    },
    date: '2024-03-22T19:30:00',
    venue: 'MA Chidambaram Stadium, Chennai',
    status: 'completed',
    result: 'Mumbai Indians won by 5 wickets'
  },
  {
    id: '2',
    team1: teams[2],
    team2: teams[3],
    date: '2024-03-23T19:30:00',
    venue: 'M. Chinnaswamy Stadium, Bangalore',
    status: 'upcoming'
  },
  {
    id: '3',
    team1: teams[3],
    team2: teams[8],
    date: '2024-03-24T19:30:00',
    venue: 'Eden Gardens, Kolkata',
    status: 'live',
    team1Score: { runs: 143, wickets: 6, overs: 16.4 },
    team2Score: { runs: 0, wickets: 0, overs: 0 }
  },
  {
    id: '4',
    team1: teams[1],
    team2: teams[5],
    date: '2024-03-25T19:30:00',
    venue: 'Wankhede Stadium, Mumbai',
    status: 'upcoming'
  },
  {
    id: '5',
    team1: teams[7],
    team2: teams[9],
    date: '2024-03-26T19:30:00',
    venue: 'Sawai Mansingh Stadium, Jaipur',
    status: 'upcoming'
  }
];

export const pointsTable = [
  {
    team: teams[0],
    played: 1,
    won: 0,
    lost: 1,
    points: 0,
    netRunRate: -0.2
  },
  {
    team: teams[1],
    played: 1,
    won: 1,
    lost: 0,
    points: 2,
    netRunRate: 0.2
  },
  {
    team: teams[2],
    played: 0,
    won: 0,
    lost: 0,
    points: 0,
    netRunRate: 0
  },
  {
    team: teams[3],
    played: 0,
    won: 0,
    lost: 0,
    points: 0,
    netRunRate: 0
  }
];

export const playerStats = [
  {
    id: '1',
    name: 'Virat Kohli',
    team: teams[2],
    matches: 1,
    runs: 82,
    wickets: 0,
    average: 82.0,
    strikeRate: 145.5,
    economy: 0
  },
  {
    id: '2',
    name: 'Jasprit Bumrah',
    team: teams[1],
    matches: 1,
    runs: 0,
    wickets: 3,
    average: 0,
    strikeRate: 0,
    economy: 6.5
  }
];