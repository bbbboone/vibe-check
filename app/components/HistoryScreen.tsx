'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface HistoryScreenProps {
  onBack: () => void;
}

const chartData = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 19 },
  { month: 'Mar', count: 15 },
  { month: 'Apr', count: 25 },
  { month: 'May', count: 22 },
  { month: 'Jun', count: 30 },
];

const historyItems = [
  { id: 1, emoji: '🥰', mood: '설렘', date: '2026년 2월 23일', trackCount: 5 },
  { id: 2, emoji: '😌', mood: '평온함', date: '2026년 2월 20일', trackCount: 8 },
  { id: 3, emoji: '🔥', mood: '신남', date: '2026년 2월 18일', trackCount: 4 },
  { id: 4, emoji: '😴', mood: '나른함', date: '2026년 2월 15일', trackCount: 3 },
];

export function HistoryScreen({ }: HistoryScreenProps) {
  return (
    <div className="flex flex-col h-full p-5 md:p-7" style={{ backgroundColor: '#121212' }}>
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#FFFFFF' }}>
        My Vibes
      </h2>

      {/* Monthly Chart */}
      <div
        className="mb-6 p-4 rounded-xl border"
        style={{ backgroundColor: '#181818', borderColor: '#282828' }}
      >
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#B3B3B3' }}>
          월별 감정 진단
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barCategoryGap="30%">
            <XAxis
              dataKey="month"
              tick={{ fill: '#6A6A6A', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6A6A6A', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#1DB954" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent History */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#B3B3B3' }}>
          최근 기록
        </h3>
        <div className="space-y-2">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3.5 rounded-lg transition-colors"
              style={{ backgroundColor: '#181818' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#282828')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#181818')}
            >
              <div
                className="w-11 h-11 rounded flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: '#282828' }}
              >
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>
                  {item.mood}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#B3B3B3' }}>
                  {item.date}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-sm" style={{ color: '#1DB954' }}>
                  {item.trackCount}
                </p>
                <p className="text-xs" style={{ color: '#6A6A6A' }}>
                  playlists
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
