export interface WhoopUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface WhoopHealthData {
  id: string;
  type: 'heart_rate' | 'sleep' | 'steps' | 'recovery' | 'strain';
  value: number;
  unit: string;
  timestamp: string;
  source: 'whoop';
  verified: boolean;
  metadata?: Record<string, any>;
}

export interface WhoopAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface WhoopRecoveryData {
  id: string;
  score: number;
  restingHeartRate: number;
  hrv: number;
  sleepScore: number;
  timestamp: string;
}

export interface WhoopSleepData {
  id: string;
  score: number;
  duration: number;
  deepSleep: number;
  lightSleep: number;
  remSleep: number;
  awake: number;
  timestamp: string;
}

export interface WhoopStrainData {
  id: string;
  score: number;
  cardiovascular: number;
  muscular: number;
  timestamp: string;
}

class WhoopApiService {
  private baseUrl = 'https://api.prod.whoop.com/developer/v2';
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage if available
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('whoop_access_token');
      this.refreshToken = localStorage.getItem('whoop_refresh_token');
    }
  }

  // Get OAuth URL for user to authorize WHOOP
  getAuthUrl(): string {
    const clientId = process.env.NEXT_PUBLIC_WHOOP_CLIENT_ID || '07873865-1460-4bd5-9874-4ad4e5e09ae1';
    const redirectUri = process.env.NEXT_PUBLIC_WHOOP_REDIRECT_URI || 'http://localhost:3001/callback';
    
    // Generate a secure random state parameter (required by WHOOP OAuth)
    const state = this.generateSecureState();
    
    // Store the state for verification
    if (typeof window !== 'undefined') {
      localStorage.setItem('whoop_oauth_state', state);
    }
    
    // Use the correct WHOOP v2 OAuth endpoint
    return `https://api.prod.whoop.com/oauth/oauth2/auth?` +
           `client_id=${clientId}&` +
           `redirect_uri=${encodeURIComponent(redirectUri)}&` +
           `response_type=code&` +
           `state=${state}&` +
           `scope=read:recovery read:sleep read:workout read:profile read:cycles read:body_measurement`;
  }

  // Handle OAuth callback and exchange code for tokens
  async handleAuthCallback(code: string): Promise<WhoopAuthResponse> {
    const redirectUri = process.env.NEXT_PUBLIC_WHOOP_REDIRECT_URI || 'http://localhost:3001/callback';

    console.log('🔐 WHOOP Token Exchange via Server Route:');
    console.log('📋 Code length:', code.length);
    console.log('🌐 Redirect URI:', redirectUri);

    try {
      // Use our server-side API route to avoid CORS issues
      const response = await fetch('/api/whoop/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          redirectUri: redirectUri,
        }),
      });

      console.log('📡 Server route response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Server token exchange failed:', errorData);
        throw new Error(`Server token exchange failed: ${errorData.error} - ${errorData.details || ''}`);
      }

      const data = await response.json();
      console.log('✅ Server token exchange successful:', {
        access_token_length: data.access_token?.length || 0,
        refresh_token_length: data.refresh_token?.length || 0,
        expires_in: data.expires_in,
        token_type: data.token_type
      });
      
      // Store tokens
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('whoop_access_token', data.access_token);
        localStorage.setItem('whoop_refresh_token', data.refresh_token);
      }

      // Convert to WhoopAuthResponse format
      const authResponse: WhoopAuthResponse = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type
      };

      return authResponse;
    } catch (fetchError) {
      console.error('❌ Fetch error during server token exchange:', fetchError);
      throw new Error(`Server token exchange error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const clientId = process.env.NEXT_PUBLIC_WHOOP_CLIENT_ID || '07873865-1460-4bd5-9874-4ad4e5e09ae1';
    const clientSecret = process.env.WHOOP_CLIENT_SECRET || 'e110d5edbc049fbbd72677447c744bf2da4c2095e04284dc39c85adb8bb74aad';

    const response = await fetch('https://api.prod.whoop.com/oauth/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: this.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data: WhoopAuthResponse = await response.json();
    this.accessToken = data.access_token;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('whoop_access_token', data.access_token);
    }
  }

  // Get user profile
  async getUserProfile(): Promise<WhoopUser> {
    await this.ensureValidToken();
    
    const response = await fetch(`${this.baseUrl}/user/profile/basic`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }

  // Get recovery data for the last 7 days
  async getRecoveryData(days: number = 7): Promise<WhoopRecoveryData[]> {
    await this.ensureValidToken();
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const response = await fetch(
      `${this.baseUrl}/activity/recovery?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch recovery data');
    }

    const data = await response.json();
    return data.records || [];
  }

  // Get sleep data for the last 7 days
  async getSleepData(days: number = 7): Promise<WhoopSleepData[]> {
    await this.ensureValidToken();
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const response = await fetch(
      `${this.baseUrl}/activity/sleep?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch sleep data');
    }

    const data = await response.json();
    return data.records || [];
  }

  // Get strain data for the last 7 days
  async getStrainData(days: number = 7): Promise<WhoopStrainData[]> {
    await this.ensureValidToken();
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const response = await fetch(
      `${this.baseUrl}/cycle?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch strain data');
    }

    const data = await response.json();
    return data.records || [];
  }

  // Get all health data in a unified format
  async getAllHealthData(days: number = 7): Promise<WhoopHealthData[]> {
    const [recoveryData, sleepData, strainData] = await Promise.all([
      this.getRecoveryData(days),
      this.getSleepData(days),
      this.getStrainData(days),
    ]);

    const healthData: WhoopHealthData[] = [];

    // Convert recovery data
    recoveryData.forEach((recovery) => {
      healthData.push({
        id: `recovery_${recovery.id}`,
        type: 'recovery',
        value: recovery.score,
        unit: 'score',
        timestamp: recovery.timestamp,
        source: 'whoop',
        verified: true,
        metadata: {
          restingHeartRate: recovery.restingHeartRate,
          hrv: recovery.hrv,
          sleepScore: recovery.sleepScore,
        },
      });
    });

    // Convert sleep data
    sleepData.forEach((sleep) => {
      healthData.push({
        id: `sleep_${sleep.id}`,
        type: 'sleep',
        value: sleep.duration / 3600, // Convert seconds to hours
        unit: 'hours',
        timestamp: sleep.timestamp,
        source: 'whoop',
        verified: true,
        metadata: {
          score: sleep.score,
          deepSleep: sleep.deepSleep / 3600,
          lightSleep: sleep.lightSleep / 3600,
          remSleep: sleep.remSleep / 3600,
          awake: sleep.awake / 3600,
        },
      });
    });

    // Convert strain data
    strainData.forEach((strain) => {
      healthData.push({
        id: `strain_${strain.id}`,
        type: 'strain',
        value: strain.score,
        unit: 'score',
        timestamp: strain.timestamp,
        source: 'whoop',
        verified: true,
        metadata: {
          cardiovascular: strain.cardiovascular,
          muscular: strain.muscular,
        },
      });
    });

    return healthData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Logout and clear tokens
  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('whoop_access_token');
      localStorage.removeItem('whoop_refresh_token');
    }
  }

  // Generate a secure random state parameter for OAuth
  private generateSecureState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Ensure we have a valid token, refresh if needed
  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken) {
      throw new Error('No access token available. Please authenticate first.');
    }

    // TODO: Implement token expiration check and refresh logic
    // For now, we'll assume the token is valid
  }
}

export const whoopApi = new WhoopApiService();
export default whoopApi;
