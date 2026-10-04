/**
 * Aasra Full Stack API Client & Backend Connection Manager
 * Seamlessly connects Frontend to FastAPI Backend & Database (MySQL / SQLite).
 */

(function () {
  'use strict';

  // Always talk to the backend on port 8000
  var API_BASE = 'http://127.0.0.1:8000';
  // If page is already served from port 8000, use relative paths
  if (window.location.port === '8000') {
    API_BASE = '';
  }

  var TOKEN_KEY = 'aasra_auth_token';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || '';
  }

  function setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  async function apiFetch(endpoint, options) {
    options = options || {};
    var slash = endpoint.startsWith('/') ? '' : '/';
    var url = API_BASE + slash + endpoint;
    var headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    var token = getToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = 'Bearer ' + token;
    }
    try {
      var response = await fetch(url, Object.assign({}, options, { headers: headers }));
      var data = await response.json().catch(function() { return {}; });
      return { ok: response.ok, status: response.status, data: data };
    } catch (err) {
      console.warn('[Aasra FullStack] API request to ' + endpoint + ' failed:', err);
      return { ok: false, status: 0, error: err.message, data: null };
    }
  }

  // Check server health and update status badge in navbar
  async function checkServerHealth() {
    var badge = document.getElementById('fullstack-status-badge');
    var textEl = document.getElementById('fullstack-status-text');

    try {
      var res = await apiFetch('/api/health');
      if (res.ok && res.data) {
        var db = (res.data.active_database || 'DB').toUpperCase();
        if (badge) {
          badge.classList.remove('offline');
          badge.classList.add('online');
          badge.title = 'Full Stack Active: FastAPI + ' + db + ' Database connected';
        }
        if (textEl) {
          textEl.textContent = db + ' Live';
        }
        return true;
      }
    } catch (e) {}

    if (badge) {
      badge.classList.remove('online');
      badge.classList.add('offline');
      badge.title = 'Backend offline. Run start.bat to launch backend.';
    }
    if (textEl) {
      textEl.textContent = 'Offline';
    }
    return false;
  }

  // Exposed global API client
  window.AasraAPI = {
    BASE_URL: API_BASE,
    getToken: getToken,
    setToken: setToken,
    checkServerHealth: checkServerHealth,

    // Authentication
    register: async function(userData) {
      var res = await apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) });
      if (res.ok && res.data && res.data.access_token) { setToken(res.data.access_token); }
      return res;
    },

    login: async function(credentials) {
      var res = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
      if (res.ok && res.data && res.data.access_token) { setToken(res.data.access_token); }
      return res;
    },

    getMe: async function() {
      return apiFetch('/api/auth/me');
    },

    // Applications & Appointments
    getApplications: async function(query) {
      var endpoint = query ? ('/api/applications?query=' + encodeURIComponent(query)) : '/api/applications';
      return apiFetch(endpoint);
    },

    getApplication: async function(trackingId) {
      return apiFetch('/api/applications/' + encodeURIComponent(trackingId));
    },

    createApplication: async function(appData) {
      return apiFetch('/api/applications', { method: 'POST', body: JSON.stringify(appData) });
    },

    deleteApplication: async function(trackingId) {
      return apiFetch('/api/applications/' + encodeURIComponent(trackingId), { method: 'DELETE' });
    },

    // Counseling Bookings
    bookCounseling: async function(counselingData) {
      return apiFetch('/api/counseling', { method: 'POST', body: JSON.stringify(counselingData) });
    },

    // Child Profiles
    getChildren: async function(category) {
      var endpoint = (category && category !== 'all')
        ? ('/api/children?category=' + encodeURIComponent(category))
        : '/api/children';
      return apiFetch(endpoint);
    },

    // Stats & Analytics
    getStats: async function() {
      return apiFetch('/api/stats/summary');
    },

    // Yuganshi Chatbot
    chat: async function(message, sessionId, userId) {
      return apiFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: message,
          session_id: sessionId || null,
          user_id: userId || null
        })
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    checkServerHealth();
    setInterval(checkServerHealth, 30000);
  });
})();