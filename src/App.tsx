import { useState, useEffect } from 'react';
import LiveMatchCard from './components/LiveMatchCard';
import PointsTable from './components/PointsTable';
import MatchSchedule from './components/MatchSchedule';
import Navbar from './components/Navbar';
import { Match, PointsTableEntry } from './types';

interface ScheduleDay {
  id: string;
  date: string;
  day: string;
  matches: Match[];
}

function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [pointsTable, setPointsTable] = useState<PointsTableEntry[]>([]);
  const [schedules, setSchedules] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('matches');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch matches
        const matchesResponse = await fetch('http://localhost:3001/api/matches');
        if (!matchesResponse.ok) {
          throw new Error('Failed to fetch matches');
        }
        const matchesData = await matchesResponse.json();
        setMatches(matchesData);

        // Fetch points table
        const pointsResponse = await fetch('http://localhost:3001/api/points-table');
        if (!pointsResponse.ok) {
          throw new Error('Failed to fetch points table');
        }
        const pointsData = await pointsResponse.json();
        setPointsTable(pointsData);

        // Fetch schedules
        const schedulesResponse = await fetch('http://localhost:3001/api/schedules');
        if (!schedulesResponse.ok) {
          throw new Error('Failed to fetch schedules');
        }
        const schedulesData = await schedulesResponse.json();
        setSchedules(schedulesData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-xl text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'matches' ? (
          <>
            {/* Live Matches Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Live Matches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches
                  .filter(match => match.status === 'live')
                  .map(match => (
                    <LiveMatchCard key={match.id} match={match} />
                  ))}
              </div>
            </div>

            {/* Upcoming Matches Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming Matches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches
                  .filter(match => match.status === 'upcoming')
                  .map(match => (
                    <LiveMatchCard key={match.id} match={match} />
                  ))}
              </div>
            </div>
          </>
        ) : activeTab === 'schedule' ? (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Match Schedule</h2>
            <MatchSchedule schedules={schedules} />
          </div>
        ) : (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Points Table</h2>
            <PointsTable data={pointsTable} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;