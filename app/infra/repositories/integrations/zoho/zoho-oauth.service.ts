export type ZohoTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  api_domain: string;
  token_type: string;
};

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID!;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET!;
const ZOHO_ACCOUNTS_URL = process.env.ZOHO_ACCOUNTS_URL!;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN!;

export class ZohoOAuthService {
  static getAuthUrl() {
    const redirectUri = encodeURIComponent(
      "http://localhost:3000/api/integrations/zoho/callback",
    );

    return `${ZOHO_ACCOUNTS_URL}/oauth/v2/auth?scope=WorkDrive.files.ALL&client_id=${ZOHO_CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${redirectUri}`;
  }

  static async exchangeCodeForTokens(code: string) {
    const redirectUri = "http://localhost:3000/api/integrations/zoho/callback";

    const res = await fetch(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!res.ok) {
      throw new Error("Error exchanging Zoho code");
    }

    const data: ZohoTokenResponse = await res.json();
    return data;
  }

  static async refreshAccessToken() {
    const res = await fetch(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        refresh_token: ZOHO_REFRESH_TOKEN,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
      }),
    });

    if (!res.ok) {
      throw new Error("Error refreshing Zoho token");
    }

    const data: ZohoTokenResponse = await res.json();
    return data.access_token;
  }
}
