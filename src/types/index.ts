export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  country: string;
  imageUrl?: string;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  date: string;
  time?: string;
  venue: string;
  status: 'live' | 'completed' | 'upcoming';
  result?: string;
  team1Score?: {
    runs: number;
    wickets: number;
    overs: number;
  };
  team2Score?: {
    runs: number;
    wickets: number;
    overs: number;
  };
}

export interface Score {
  runs: number;
  wickets: number;
  overs: number;
}

export interface PointsTableEntry {
  team: Team;
  played: number;
  won: number;
  lost: number;
  points: number;
  netRunRate: number;
  seriesInfo?: {
    id: string;
    name: string;
    shortName: string;
  };
}

export interface PlayerStat {
  playerId: string;
  matches: number;
  runs?: number;
  average?: number;
  strikeRate?: number;
  wickets?: number;
  economy?: number;
}