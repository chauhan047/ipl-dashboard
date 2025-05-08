export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
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
  date: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  result?: string;
}

export interface PointsTableEntry {
  team: Team;
  played: number;
  won: number;
  lost: number;
  points: number;
  netRunRate: number;
}

export interface PlayerStats {
  id: string;
  name: string;
  team: Team;
  matches: number;
  runs: number;
  wickets: number;
  average: number;
  strikeRate: number;
  economy: number;
} 