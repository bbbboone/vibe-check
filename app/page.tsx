'use client';

import { useState, useEffect } from 'react';
import { Home, Clock } from 'lucide-react';
import { HomeScreen } from './components/HomeScreen';
import { MoodSelectionScreen } from './components/MoodSelectionScreen';
import { ResultScreen } from './components/ResultScreen';
import { HistoryScreen } from './components/HistoryScreen';

type Screen = 'home' | 'mood-selection' | 'result' | 'history';

interface SpotifyUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('');
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  const handleStart = () => setCurrentScreen('mood-selection');

  const handleMoodSubmit = (mood: string, weather: string) => {
    setSelectedMood(mood);
    setSelectedWeather(weather);
    setCurrentScreen('result');
  };

  const handleRetry = () => setCurrentScreen('mood-selection');
  const handleBackToHome = () => setCurrentScreen('home');

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#000000', fontFamily: 'Inter, sans-serif' }}
    >
      <div
        className="relative w-full max-w-[440px] h-[100dvh] md:h-[calc(100dvh-2rem)] md:max-h-[850px] rounded-none md:rounded-3xl overflow-hidden border-0 md:border"
        style={{ backgroundColor: '#121212', borderColor: '#282828' }}
      >
        <div className="h-full pb-20 overflow-hidden">
          {currentScreen === 'home' && (
            <HomeScreen onStart={handleStart} user={user} authLoading={authLoading} />
          )}
          {currentScreen === 'mood-selection' && (
            <MoodSelectionScreen onBack={handleBackToHome} onSubmit={handleMoodSubmit} />
          )}
          {currentScreen === 'result' && (
            <ResultScreen
              onBack={handleBackToHome}
              onRetry={handleRetry}
              mood={selectedMood}
              weather={selectedWeather}
            />
          )}
          {currentScreen === 'history' && <HistoryScreen onBack={handleBackToHome} />}
        </div>

        {/* Bottom Navigation */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 border-t"
          style={{ backgroundColor: '#121212', borderColor: '#282828' }}
        >
          <div className="flex items-center justify-around h-full px-8">
            <button
              onClick={() => setCurrentScreen('home')}
              className="flex flex-col items-center gap-1 transition-colors"
              style={{
                color:
                  currentScreen === 'home' ||
                  currentScreen === 'mood-selection' ||
                  currentScreen === 'result'
                    ? '#1DB954'
                    : '#6A6A6A',
              }}
            >
              <Home size={24} />
              <span className="text-xs font-medium">홈</span>
            </button>
            <button
              onClick={() => user && setCurrentScreen('history')}
              disabled={!user}
              className="flex flex-col items-center gap-1 transition-colors"
              style={{
                color: !user ? '#3E3E3E' : currentScreen === 'history' ? '#1DB954' : '#6A6A6A',
                cursor: !user ? 'not-allowed' : 'pointer',
              }}
            >
              <Clock size={24} />
              <span className="text-xs font-medium">히스토리</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
