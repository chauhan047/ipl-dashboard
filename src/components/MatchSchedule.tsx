import React from 'react';
import { Match } from '../types';

interface ScheduleDay {
  id: string;
  date: string;
  day: string;
  matches: Match[];
}

interface MatchScheduleProps {
  schedules: ScheduleDay[];
}

const MatchSchedule: React.FC<MatchScheduleProps> = ({ schedules }) => {
  return (
    <div className="space-y-8">
      {schedules.map((day) => (
        <div key={day.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {new Date(day.date).toLocaleDateString('en-US', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {day.matches.map((match) => (
              <div key={match.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">{match.venue}</span>
                  <span className="text-sm font-medium text-gray-900">{match.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={match.team1.logo}
                      alt={match.team1.name}
                      className="w-12 h-12 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/150?text=Team';
                      }}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{match.team1.name}</div>
                      <div className="text-sm text-gray-500">{match.team1.shortName}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">VS</div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{match.team2.name}</div>
                      <div className="text-sm text-gray-500">{match.team2.shortName}</div>
                    </div>
                    <img
                      src={match.team2.logo}
                      alt={match.team2.name}
                      className="w-12 h-12 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/150?text=Team';
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchSchedule; 