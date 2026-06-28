import { authClient } from '@/lib/auth-client';

// In-memory cache to avoid calling authClient.token() on every single request
let cachedToken = null;
let tokenExpiresAt = null;

const getToken = async () => {
  const now = Date.now();

  // Return cached token if it's still valid (with a 30-second safety buffer)
  if (cachedToken && tokenExpiresAt && now < tokenExpiresAt - 30_000) {
    return cachedToken;
  }

  try {
    // Use the official better-auth client method to get the JWT token
    const { data: jwtData } = await authClient.token();
    const token = jwtData?.token;
 

    if (token) {
      cachedToken = token;
      // Cache for 14 minutes (better-auth JWT default is 15 min)
      tokenExpiresAt = now + 14 * 60 * 1000;
      return token;
    }
  } catch (err) {
    console.error('fetchSecure: Failed to retrieve token', err);
  }

  cachedToken = null;
  tokenExpiresAt = null;
  return null;
};

/**
 * Authenticated fetch wrapper.
 * Automatically attaches the JWT Bearer token to every request.
 * Usage is identical to the native fetch() API.
 */
export const fetchSecure = async (url, options = {}) => {
  const token = await getToken();
  // console.log("token type:", typeof token, "| token value:", JSON.stringify(token));

  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, clear the token cache so next request fetches a fresh one
  if (response.status === 401) {
    cachedToken = null;
    tokenExpiresAt = null;
  }

  return response;
};

export default fetchSecure;
