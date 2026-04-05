import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DailyConsolidated } from './DailyConsolidated';
import { IDEStreams } from './IDEStreams';
import { CategoryBadge } from './components/CategoryBadge';

interface JournalData {
  date: string;
  content: any;
  metadata: any;
}

export const JournalDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'consolidated' | 'streams'>('consolidated');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [journalData, setJournalData] = useState<JournalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJournalData();
  }, [activeView, selectedDate]);

  const loadJournalData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = activeView === 'consolidated'
        ? `/api/journal/daily-consolidated?date=${selectedDate}`
        : `/api/journal/ide-streams?date=${selectedDate}`;

      const response = await api.get(endpoint);
      setJournalData(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`No journal data found for ${selectedDate}`);
      } else {
        setError('Failed to load journal data');
      }
      setJournalData(null);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  return (
    <div className="journal-dashboard min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Development Journal</h1>
              <p className="text-gray-600 mt-1">IDE Ecosystem Collaboration Intelligence</p>
            </div>
            <div className="flex items-center space-x-4">
              <CategoryBadge category="new-projects" count={2} />
              <CategoryBadge category="maintenance" count={3} />
              <CategoryBadge category="research" count={2} />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* View Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'consolidated'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveView('consolidated')}
              >
                📊 Consolidated
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'streams'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveView('streams')}
              >
                🎭 IDE Streams
              </button>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                title="Previous day"
              >
                ←
              </button>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <button
                onClick={() => navigateDate('next')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                title="Next day"
              >
                →
              </button>

              <button
                onClick={goToToday}
                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading journal data...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">Error loading journal</h3>
                <p className="text-red-600 mt-1">{error}</p>
                <button
                  onClick={loadJournalData}
                  className="mt-3 text-red-700 hover:text-red-900 text-sm font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && journalData && (
          <div className="space-y-8">
            {activeView === 'consolidated' ? (
              <DailyConsolidated data={journalData} />
            ) : (
              <IDEStreams data={journalData} />
            )}
          </div>
        )}

        {!loading && !error && !journalData && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No journal entry found</h3>
            <p className="text-gray-600 mb-6">
              No journal data available for {selectedDate}. Try selecting a different date or create a new entry.
            </p>
            <button
              onClick={goToToday}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Today
            </button>
          </div>
        )}
      </div>
    </div>
  );
};