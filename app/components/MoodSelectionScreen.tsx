'use client';

import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface MoodSelectionScreenProps {
  onBack: () => void;
  onSubmit: (mood: string, weather: string) => void;
}

const emotions = [
  { emoji: '😔', label: '우울함' },
  { emoji: '🔥', label: '신남' },
  { emoji: '😴', label: '나른함' },
  { emoji: '😤', label: '화남' },
  { emoji: '🥰', label: '설렘' },
  { emoji: '😌', label: '평온함' },
];

const weathers = [
  { emoji: '☀️', label: '맑음' },
  { emoji: '🌧️', label: '비' },
  { emoji: '☁️', label: '흐림' },
  { emoji: '❄️', label: '눈' },
];

export function MoodSelectionScreen({ onBack, onSubmit }: MoodSelectionScreenProps) {
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('');

  const handleSubmit = () => {
    if (selectedMood && selectedWeather) {
      onSubmit(selectedMood, selectedWeather);
    }
  };

  return (
    <div className="flex flex-col h-full p-5 md:p-7" style={{ backgroundColor: '#121212' }}>
      {/* Header */}
      <div className="flex items-center mb-7">
        <button
          onClick={onBack}
          className="p-2 rounded-full transition-colors"
          style={{ color: '#B3B3B3' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#B3B3B3')}
        >
          <ArrowLeft size={22} />
        </button>
      </div>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: '#FFFFFF' }}>
        지금 기분을 골라봐
      </h2>

      {/* Emotion Tags */}
      <div className="mb-8">
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#B3B3B3' }}>
          감정
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {emotions.map((emotion) => {
            const isSelected = selectedMood === emotion.label;
            return (
              <button
                key={emotion.label}
                onClick={() => setSelectedMood(emotion.label)}
                className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 active:scale-95 border"
                style={{
                  backgroundColor: isSelected ? '#1DB954' : '#282828',
                  color: isSelected ? '#000000' : '#FFFFFF',
                  borderColor: isSelected ? '#1DB954' : '#3E3E3E',
                }}
              >
                <span className="mr-1.5">{emotion.emoji}</span>
                {emotion.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Weather Tags */}
      <div className="mb-auto">
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#B3B3B3' }}>
          날씨
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {weathers.map((weather) => {
            const isSelected = selectedWeather === weather.label;
            return (
              <button
                key={weather.label}
                onClick={() => setSelectedWeather(weather.label)}
                className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 active:scale-95 border"
                style={{
                  backgroundColor: isSelected ? '#1DB954' : '#282828',
                  color: isSelected ? '#000000' : '#FFFFFF',
                  borderColor: isSelected ? '#1DB954' : '#3E3E3E',
                }}
              >
                <span className="mr-1.5">{weather.emoji}</span>
                {weather.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedMood || !selectedWeather}
        className="w-full py-4 rounded-full font-bold text-base transition-all duration-200 active:scale-95"
        style={{
          backgroundColor: selectedMood && selectedWeather ? '#1DB954' : '#282828',
          color: selectedMood && selectedWeather ? '#000000' : '#6A6A6A',
          cursor: selectedMood && selectedWeather ? 'pointer' : 'not-allowed',
        }}
      >
        음악 찾아줘 🎵
      </button>
    </div>
  );
}
