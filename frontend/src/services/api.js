/* ==========================================
   DonTusa — API клиент (REST API)
   Глобальный объект window.dontusaAPI
   ========================================== */

(function() {
  const API_BASE = 'http://localhost:3000/api';

  function getToken() {
    try { return localStorage.getItem('dontusa_token') || null; } catch (e) { return null; }
  }
  function setToken(token) {
    try { if (token) localStorage.setItem('dontusa_token', token); else localStorage.removeItem('dontusa_token'); } catch (e) {}
  }

  async function request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const config = { ...options, headers };
    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) {
          setToken(null);
          if (window.location.pathname !== '/auth/login.html' && window.location.pathname !== '/auth/register.html') {
            window.location.href = '/auth/login.html';
          }
        }
        throw new Error(data.message || `Ошибка ${response.status}`);
      }
      return data;
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new Error('Сервер недоступен. Проверьте, запущен ли backend.');
      }
      throw err;
    }
  }

  /* ---------- Auth ---------- */
  const authAPI = {
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request('/auth/me'),
    logout: () => request('/auth/logout', { method: 'POST' }),
  };

  /* ---------- Users ---------- */
  const usersAPI = {
    getAll: () => request('/users'),
    getById: (id) => request(`/users/${id}`),
    update: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  };

  /* ---------- Roles ---------- */
  const rolesAPI = {
    getAll: () => request('/roles'),
  };

  /* ---------- Events ---------- */
  const eventsAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/events${qs ? '?' + qs : ''}`);
    },
    getById: (id) => request(`/events/${id}`),
    create: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  };

  /* ---------- Event Types ---------- */
  const eventTypesAPI = {
    getAll: () => request('/event-types'),
  };

  /* ---------- Specialists ---------- */
  const specialistsAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/specialists${qs ? '?' + qs : ''}`);
    },
    getById: (id) => request(`/specialists/${id}`),
    updateProfile: (data) => request('/specialists/profile', { method: 'PUT', body: JSON.stringify(data) }),
    getMyProfile: () => request('/specialists/profile/me'),
  };

  /* ---------- Specialist Categories ---------- */
  const specialistCategoriesAPI = {
    getAll: () => request('/specialist-categories'),
  };

  /* ---------- Portfolio ---------- */
  const portfolioAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/portfolio${qs ? '?' + qs : ''}`);
    },
    add: (formData) => request('/portfolio', { method: 'POST', body: formData }),
    delete: (id) => request(`/portfolio/${id}`, { method: 'DELETE' }),
  };

  /* ---------- Services ---------- */
  const servicesAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/services${qs ? '?' + qs : ''}`);
    },
    create: (data) => request('/services', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/services/${id}`, { method: 'DELETE' }),
  };

  /* ---------- Event Specialists ---------- */
  const eventSpecialistsAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/event-specialists${qs ? '?' + qs : ''}`);
    },
    assign: (data) => request('/event-specialists', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id, data) => request(`/event-specialists/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  };

  /* ---------- Specialist Requests ---------- */
  const specialistRequestsAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/specialist-requests${qs ? '?' + qs : ''}`);
    },
    create: (data) => request('/specialist-requests', { method: 'POST', body: JSON.stringify(data) }),
    respond: (id, data) => request(`/specialist-requests/${id}/respond`, { method: 'PUT', body: JSON.stringify(data) }),
  };

  /* ---------- Availability ---------- */
  const availabilityAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/availability${qs ? '?' + qs : ''}`);
    },
    create: (data) => request('/availability', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/availability/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/availability/${id}`, { method: 'DELETE' }),
  };

  /* ---------- Venues ---------- */
  const venuesAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/venues${qs ? '?' + qs : ''}`);
    },
    getById: (id) => request(`/venues/${id}`),
    create: (data) => request('/venues', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/venues/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/venues/${id}`, { method: 'DELETE' }),
  };

  /* ---------- Venue Photos ---------- */
  const venuePhotosAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/venue-photos${qs ? '?' + qs : ''}`);
    },
    add: (data) => request('/venue-photos', { method: 'POST', body: JSON.stringify(data) }),
  };

  /* ---------- Venue Event Types ---------- */
  const venueEventTypesAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/venue-event-types${qs ? '?' + qs : ''}`);
    },
    create: (data) => request('/venue-event-types', { method: 'POST', body: JSON.stringify(data) }),
  };

  /* ---------- Messages ---------- */
  const messagesAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/messages${qs ? '?' + qs : ''}`);
    },
    create: (data) => request('/messages', { method: 'POST', body: JSON.stringify(data) }),
    markRead: (id) => request(`/messages/${id}/read`, { method: 'PUT' }),
  };

  /* ---------- Notifications ---------- */
  const notificationsAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/notifications${qs ? '?' + qs : ''}`);
    },
    create: (data) => request('/notifications', { method: 'POST', body: JSON.stringify(data) }),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  };

  /* ---------- Status History ---------- */
  const statusHistoryAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/status-history${qs ? '?' + qs : ''}`);
    },
    create: (data) => request('/status-history', { method: 'POST', body: JSON.stringify(data) }),
  };

  /* ---------- Activity Log ---------- */
  const activityLogAPI = {
    getAll: (params) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/activity-log${qs ? '?' + qs : ''}`);
    },
    create: (data) => request('/activity-log', { method: 'POST', body: JSON.stringify(data) }),
  };

  window.dontusaAPI = {
    authAPI, usersAPI, rolesAPI, eventsAPI, eventTypesAPI,
    specialistsAPI, specialistCategoriesAPI, portfolioAPI, servicesAPI,
    eventSpecialistsAPI, specialistRequestsAPI, availabilityAPI,
    venuesAPI, venuePhotosAPI, venueEventTypesAPI,
    messagesAPI, notificationsAPI, statusHistoryAPI, activityLogAPI,
    getToken, setToken
  };
  
    // Делаем переменные глобальными для всех скриптов
  window.api = window.dontusaAPI;
  window.authAPI = window.dontusaAPI.authAPI;
  window.eventTypesAPI = window.dontusaAPI.eventTypesAPI;
  window.specialistsAPI = window.dontusaAPI.specialistsAPI;
  window.eventsAPI = window.dontusaAPI.eventsAPI;
  window.usersAPI = window.dontusaAPI.usersAPI;
  window.venuesAPI = window.dontusaAPI.venuesAPI;
  window.messagesAPI = window.dontusaAPI.messagesAPI;
  window.notificationsAPI = window.dontusaAPI.notificationsAPI;
})();