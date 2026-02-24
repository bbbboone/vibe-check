'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: { total: number };
  external_urls: { spotify: string };
  owner: { display_name: string };
}

interface ResultScreenProps {
  onBack: () => void;
  onRetry: () => void;
  mood: string;
  weather: string;
}

const moodEmoji: Record<string, string> = {
  '우울함': '😔',
  '신남': '🔥',
  '나른함': '😴',
  '화남': '😤',
  '설렘': '🥰',
  '평온함': '😌',
};

export function ResultScreen({ onBack, onRetry, mood, weather }: ResultScreenProps) {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    fetch(`/api/spotify/playlists?mood=${encodeURIComponent(mood)}&weather=${encodeURIComponent(weather)}`)
      .then((res) => {
        if (res.status === 401) throw new Error('로그인이 필요해요');
        if (!res.ok) throw new Error('플레이리스트를 불러오지 못했어요');
        return res.json();
      })
      .then((data) => setPlaylists(data.playlists || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [mood, weather]);

  return (
    <div className="flex flex-col h-full p-5 md:p-7" style={{ backgroundColor: '#121212' }}>
      {/* Header */}
      <div className="flex items-center mb-6">
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

      {/* Mood Badge */}
      <div
        className="inline-flex items-center gap-2.5 px-4 py-3 rounded-xl mb-6 self-start"
        style={{ backgroundColor: '#282828' }}
      >
        <span className="text-2xl">{moodEmoji[mood] || '🎵'}</span>
        <div>
          <p className="font-bold text-sm" style={{ color: '#FFFFFF' }}>
            {mood}
          </p>
          <p className="text-xs" style={{ color: '#B3B3B3' }}>
            {weather} 날씨
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="mb-5">
        <h2 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
          추천 플레이리스트
        </h2>
        {!loading && !error && playlists.length > 0 && (
          <p className="text-xs mt-1" style={{ color: '#B3B3B3' }}>
            {playlists.length}개의 플레이리스트를 찾았어요
          </p>
        )}
      </div>

      {/* Playlist List */}
      <div className="flex-1 overflow-y-auto mb-4" style={{ scrollbarWidth: 'none' }}>
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 size={28} className="animate-spin" style={{ color: '#1DB954' }} />
            <p className="text-sm" style={{ color: '#B3B3B3' }}>
              플레이리스트 찾는 중...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
            <p className="text-3xl">😅</p>
            <p className="font-semibold" style={{ color: '#FFFFFF' }}>
              {error}
            </p>
            {error.includes('로그인') && (
              <a
                href="/api/auth/login"
                className="px-6 py-3 rounded-full font-bold text-sm transition-all"
                style={{ backgroundColor: '#1DB954', color: '#000000' }}
              >
                Spotify로 로그인
              </a>
            )}
          </div>
        )}

        {!loading && !error && playlists.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-3xl">🎵</p>
            <p className="text-sm" style={{ color: '#B3B3B3' }}>
              추천 플레이리스트가 없어요
            </p>
          </div>
        )}

        {!loading && !error && playlists.length > 0 && (
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <a
                key={playlist.id}
                href={playlist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-150 group"
                style={{ backgroundColor: '#181818' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#282828')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#181818')}
              >
                {playlist.images?.[0]?.url ? (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-14 h-14 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: '#282828' }}
                  >
                    🎵
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: '#FFFFFF' }}>
                    {playlist.name}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: '#B3B3B3' }}>
                    {playlist.owner?.display_name} · {playlist.tracks?.total}곡
                  </p>
                </div>
                <ExternalLink
                  size={15}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#1DB954' }}
                />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Retry Button */}
      <button
        onClick={onRetry}
        className="w-full py-3.5 rounded-full font-bold text-sm transition-all duration-200 active:scale-95 border"
        style={{ borderColor: '#3E3E3E', color: '#FFFFFF', backgroundColor: 'transparent' }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#FFFFFF')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#3E3E3E')}
      >
        다시 진단하기
      </button>
    </div>
  );
}
