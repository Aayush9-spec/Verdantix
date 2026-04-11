const BASE_URL = '/api';

/**
 * Enhanced Fetch wrapper with offline support
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

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.data?.error || result.error || 'Something went wrong');
    }
    return result;
  } catch (err) {
    console.error(`API Error (${endpoint}):`, err);
    throw err;
  }
};

/**
 * Sync offline data
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
      console.log('✅ Offline data synced successfully');
      return true;
    }
  } catch (err) {
    console.error('❌ Sync failed:', err);
  }
  return false;
};

// Auto-sync listener
if (typeof window !== 'undefined') {
  window.addEventListener('online', syncOfflineData);
}
