/* ==========================================
   DonTusa — Кабинет специалиста (логика)
   ========================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const { api } = await import('/services/api.js');

  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sections = document.querySelectorAll('.content-section');
  const pageTitle = document.getElementById('pageTitle');
  const pageSubtitle = document.getElementById('pageSubtitle');

  const statRequests = document.getElementById('statRequests');
  const statPending = document.getElementById('statPending');
  const statAccepted = document.getElementById('statAccepted');
  const statBooked = document.getElementById('statBooked');

  const sectionTitles = {
    dashboard: ['Мои запросы', 'Персональные запросы от менеджеров и мероприятия'],
    profile: ['Мой профиль', 'Редактирование профессиональных данных'],
    portfolio: ['Портфолио', 'Ваши работы и фотографии'],
    services: ['Мои услуги', 'Список предоставляемых услуг'],
    calendar: ['Календарь занятости', 'Ваши свободные и занятые даты'],
  };

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      sections.forEach(s => { s.classList.remove('active'); s.classList.add('hidden'); });
      const target = document.getElementById('section-' + section);
      if (target) { target.classList.remove('hidden'); target.classList.add('active'); }
      const [title, subtitle] = sectionTitles[section] || [section, ''];
      if (pageTitle) pageTitle.textContent = title;
      if (pageSubtitle) pageSubtitle.textContent = subtitle;
      loadSectionData(section);
    });
  });

  async function loadStats() {
    try {
      const { requests } = await api.specialistRequestsAPI.getAll();
      if (statRequests) statRequests.textContent = requests ? requests.length : '—';
      if (statPending) statPending.textContent = requests ? requests.filter(r => r.status === 'sent').length : '—';
      if (statAccepted) statAccepted.textContent = requests ? requests.filter(r => r.status === 'accepted').length : '—';
    } catch (err) { console.error('Ошибка загрузки статистики:', err); }
  }

  async function loadRequestsList() {
    try {
      const { requests } = await api.specialistRequestsAPI.getAll();
      const container = document.getElementById('requestsList');
      if (!container) return;
      if (!requests || requests.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px;">У вас пока нет персональных запросов.</p>';
        return;
      }
      container.innerHTML = requests.map(r => `
        <div class="card mb-4" style="padding: 20px;">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 style="margin-bottom: 8px;">Запрос на мероприятие</h3>
              <p style="color: var(--text-muted); margin-bottom: 4px;"><strong>Мероприятие:</strong> ${r.event_title || '—'}</p>
              <p style="color: var(--text-muted); margin-bottom: 4px;"><strong>Менеджер:</strong> ${r.manager_name || '—'}</p>
              <p style="color: var(--text-muted); margin-bottom: 0;"><strong>Дата:</strong> ${r.sent_at ? new Date(r.sent_at).toLocaleDateString() : '—'}</p>
            </div>
            <span class="status-badge status-${r.status || 'sent'}">${r.status || 'sent'}</span>
          </div>
          <p style="color: var(--text-dark); margin-bottom: 16px;">${r.message || '—'}</p>
          <div class="flex gap-4">
            <button class="btn btn-floral" onclick="respondToRequest(${r.id}, 'accepted')">Принять</button>
            <button class="btn btn-dark" onclick="respondToRequest(${r.id}, 'rejected')">Отклонить</button>
          </div>
        </div>
      `).join('');
    } catch (err) { console.error('Ошибка загрузки запросов:', err); }
  }

  window.respondToRequest = async (id, status) => {
    try {
      await api.specialistRequestsAPI.respond(id, { status, response_comment: '' });
      alert('Ответ отправлен');
      loadRequestsList();
      loadStats();
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  };

  async function loadProfile() {
    try {
      const { specialist } = await api.specialistsAPI.getMyProfile();
      document.getElementById('profileFullName').value = specialist.full_name || '';
      document.getElementById('profileCity').value = specialist.city || '';
      document.getElementById('profileDescription').value = specialist.description || '';
      document.getElementById('profilePriceFrom').value = specialist.price_from || '';
      document.getElementById('profileExperience').value = specialist.experience || '';
    } catch (err) { console.error('Ошибка загрузки профиля:', err); }
  }

  async function loadSectionData(section) {
    switch (section) {
      case 'dashboard':
        await loadStats();
        await loadRequestsList();
        break;
      case 'profile':
        await loadProfile();
        break;
    }
  }

  await loadStats();
});