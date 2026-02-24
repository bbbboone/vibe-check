import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('spotify_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null });
  }

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json({ user: null });
  }

  const user = await response.json();
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.display_name,
      email: user.email,
      image: user.images?.[0]?.url || null,
    },
  });
}
