import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, redirectUri } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_WHOOP_CLIENT_ID;
    const clientSecret = process.env.WHOOP_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.error('Missing WHOOP credentials:', { 
        clientId: !!clientId, 
        clientSecret: !!clientSecret 
      });
      return NextResponse.json(
        { error: 'WHOOP credentials not configured' },
        { status: 500 }
      );
    }

    console.log('🔐 Exchanging WHOOP authorization code for tokens...');
    console.log('📝 Code length:', code.length);
    console.log('🌐 Redirect URI:', redirectUri);

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://api.prod.whoop.com/oauth/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri || 'http://localhost:3001/callback',
      }),
    });

    console.log('📡 WHOOP API response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ WHOOP token exchange failed:', tokenResponse.status, errorText);
      
      return NextResponse.json(
        { 
          error: 'WHOOP token exchange failed',
          details: errorText,
          status: tokenResponse.status
        },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ WHOOP token exchange successful');

    // Return tokens to client (they'll be stored in localStorage)
    return NextResponse.json({
      success: true,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type
    });

  } catch (error) {
    console.error('❌ WHOOP token exchange error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error during token exchange',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
