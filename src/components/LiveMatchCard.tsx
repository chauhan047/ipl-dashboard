import React from 'react';
import { Match } from '../types';

interface LiveMatchCardProps {
  match: Match;
}

const LiveMatchCard: React.FC<LiveMatchCardProps> = ({ match }) => {
  const { team1, team2, status, team1Score, team2Score, venue, result } = match;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        {/* Match Status */}
        <div className="flex justify-between items-center mb-4">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            status === 'live' ? 'bg-red-100 text-red-800' :
            status === 'completed' ? 'bg-green-100 text-green-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {status.toUpperCase()}
          </span>
          <span className="text-sm text-gray-500">{venue}</span>
        </div>

        {/* Teams */}
        <div className="space-y-4">
          {/* Team 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={team1.logo}
                alt={team1.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{team1.name}</span>
            </div>
            {team1Score && (
              <div className="text-right">
                <div className="font-bold">{team1Score.runs}/{team1Score.wickets}</div>
                <div className="text-sm text-gray-500">{team1Score.overs} ov</div>
              </div>
            )}
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={team2.logo}
                alt={team2.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{team2.name}</span>
            </div>
            {team2Score && (
              <div className="text-right">
                <div className="font-bold">{team2Score.runs}/{team2Score.wickets}</div>
                <div className="text-sm text-gray-500">{team2Score.overs} ov</div>
              </div>
            )}
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatchCard;