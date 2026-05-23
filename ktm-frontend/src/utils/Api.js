/**
 * KTM Navigator API Utility
 * Handles all communication between the Mobile App and the Node.js Backend.
 */

// Use the environment variable from .env
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Generic Fetch Helper with Detailed Logging
 * @param {string} endpoint - The API endpoint (e.g., '/rides')
 */
const apiFetch = async (endpoint) => {
  console.log(`[NETWORK] 📡 Requesting: ${BASE_URL}${endpoint}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    if (!response.ok) {
      console.warn(`[NETWORK] ⚠️ ${endpoint} failed with status: ${response.status} (${duration}ms)`);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[NETWORK] ✅ ${endpoint} success (${duration}ms). Payload:`, Array.isArray(data) ? `${data.length} items` : 'Object');
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      console.error(`[NETWORK] ❌ ${endpoint} TIMEOUT. Is the server at ${BASE_URL} running?`);
    } else {
      console.error(`[NETWORK] ❌ ${endpoint} ERROR:`, error.message);
    }
    return null;
  }
};

export const fetchRides = async () => {
  const data = await apiFetch('/rides');
  return data || [];
};

export const fetchLeaderboard = async () => {
  const data = await apiFetch('/leaderboard');
  return data || [];
};

export const fetchBikeDetails = async () => {
  return await apiFetch('/bike');
};
