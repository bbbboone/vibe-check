import { NextRequest, NextResponse } from 'next/server';

const moodKeywords: Record<string, string> = {
  '우울함': 'sad melancholic heartbreak emotional',
  '신남': 'energetic upbeat party dance',
  '나른함': 'lofi chill relax study',
  '화남': 'angry intense aggressive rock',
  '설렘': 'romantic hopeful love exciting',
  '평온함': 'peaceful calm ambient serene',
};

const weatherKeywords: Record<string, string> = {
  '맑음': 'sunny bright happy summer',
  '비': 'rain rainy cozy melancholy',
  '흐림': 'cloudy grey moody atmospheric',
  '눈': 'winter snow acoustic cozy',
};

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('spotify_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mood = searchParams.get('mood') || '';
  const weather = searchParams.get('weather') || '';

  const moodQuery = moodKeywords[mood] || mood;
  const weatherQuery = weatherKeywords[weather] || weather;
  const combinedQuery = `${weatherQuery} ${moodQuery.split(' ')[0]}`;

  const headers = { Authorization: `Bearer ${accessToken}` };

  const [moodRes, combinedRes] = await Promise.all([
    fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(moodQuery)}&type=playlist&limit=6&market=KR`,
      { headers }
    ),
    fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(combinedQuery)}&type=playlist&limit=6&market=KR`,
      { headers }
    ),
  ]);

  if (!moodRes.ok && !combinedRes.ok) {
    return NextResponse.json({ error: 'Spotify API error' }, { status: moodRes.status });
  }

  const [moodData, combinedData] = await Promise.all([
    moodRes.ok ? moodRes.json() : { playlists: { items: [] } },
    combinedRes.ok ? combinedRes.json() : { playlists: { items: [] } },
  ]);

  const moodPlaylists = (moodData.playlists?.items || []).filter(Boolean);
  const combinedPlaylists = (combinedData.playlists?.items || []).filter(Boolean);

  // 날씨+기분 결과를 우선, 기분 결과로 채움 (중복 제거)
  const seenIds = new Set<string>();
  const merged = [];

  for (const playlist of [...combinedPlaylists, ...moodPlaylists]) {
    if (!seenIds.has(playlist.id)) {
      seenIds.add(playlist.id);
      merged.push(playlist);
    }
    if (merged.length >= 10) break;
  }

  return NextResponse.json({ playlists: merged });
}
