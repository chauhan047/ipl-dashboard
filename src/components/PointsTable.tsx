import React from 'react';
import { PointsTableEntry } from '../server/types';

interface PointsTableProps {
  data: PointsTableEntry[];
}

const PointsTable: React.FC<PointsTableProps> = ({ data }) => {
  // Sort the data by points (descending) and then by net run rate (descending)
  const sortedData = [...data].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    const nrrA = typeof a.netRunRate === 'number' ? a.netRunRate : 0;
    const nrrB = typeof b.netRunRate === 'number' ? b.netRunRate : 0;
    return nrrB - nrrA;
  });

  const formatNetRunRate = (nrr: number | string | undefined) => {
    if (typeof nrr === 'number') {
      return nrr > 0 ? `+${nrr.toFixed(3)}` : nrr.toFixed(3);
    }
    if (typeof nrr === 'string') {
      const num = parseFloat(nrr);
      return !isNaN(num) ? (num > 0 ? `+${num.toFixed(3)}` : num.toFixed(3)) : '0.000';
    }
    return '0.000';
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">NRR</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedData.map((entry, index) => (
            <tr key={entry.team.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={entry.team.logo}
                      alt={entry.team.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/150?text=Team';
                      }}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{entry.team.name}</div>
                    <div className="text-sm text-gray-500">{entry.team.shortName}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-center text-sm text-gray-500">{entry.played}</td>
              <td className="px-6 py-4 text-center text-sm text-gray-500">{entry.won}</td>
              <td className="px-6 py-4 text-center text-sm text-gray-500">{entry.lost}</td>
              <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">{entry.points}</td>
              <td className="px-6 py-4 text-center text-sm text-gray-500">
                {formatNetRunRate(entry.netRunRate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PointsTable; 