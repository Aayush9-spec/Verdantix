const BASE_URL = '/api';

/**
 * Enhanced Fetch wrapper with offline support and Safe-Parsing logic
 */
export const apiFetch = async (endpoint, options = {}) => {
  // Check if online
  if (!navigator.onLine) {
    if (options.method === 'POST' && endpoint === '/predict') {
        const pending = JSON.parse(localStorage.getItem('pending') || '[]');
        pending.push(options.body ? JSON.parse(options.body) : {});
        localStorage.setItem('pending', JSON.stringify(pending));
        return { 
          offline: true, 
          message: 'Saved to pending. Will sync when back online.',
          success: true 
        };
    }
    throw new Error('You are offline. Please check your connection.');
  }

  try {
    const headers = { ...options.headers };
    if (!options.isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    // CRITICAL: Safe JSON Parsing
    const text = await response.text();
    let result;
    try {
        result = JSON.parse(text);
    } catch (e) {
        console.error("Malformed Response:", text);
        throw new Error("Server sent invalid data. Check Render logs.");
    }

    if (!response.ok) {
      throw new Error(result.data?.error || result.error || 'Production API Error');
    }
    return result;
  } catch (err) {
    console.error(`API Error (${endpoint}):`, err);
    throw err;
  }
};

/**
 * Global Metadata Sync
 */
export const syncOfflineData = async () => {
  const pending = JSON.parse(localStorage.getItem('pending') || '[]');
  if (pending.length === 0) return;

  try {
    const res = await fetch(`${BASE_URL}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pending_predictions: pending })
    });

    if (res.ok) {
      localStorage.removeItem('pending');
      return true;
    }
  } catch (err) {
    console.error('❌ Cloud Sync failed:', err);
  }
  return false;
};

if (typeof window !== 'undefined') {
  window.addEventListener('online', syncOfflineData);
}
