/* ==========================================
   DonTusa — Кабинет заказчика (логика)
   ========================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const { api } = await import('/services/api.js');

  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sections = document.querySelectorAll('.content-section');
  const pageTitle = document.getElementById('pageTitle');
  const pageSubtitle = document.getElementById('pageSubtitle');

  const statEvents = document.getElementById('statEvents');
  const statPending = document.getElementById('statPending');
  const statConfirmed = document.getElementById('statConfirmed');
  const statNotifications = document.getElementById('statNotifications');

  const sectionTitles = {
    dashboard: ['Мои мероприятия', 'Создавайте и отслеживайте подготовку к праздникам'],
    proposals: ['Предложения менеджера', 'Специалисты, подобранные для вашего мероприятия'],
    messages: ['Сообщения с менеджером', 'Общайтесь с назначенным менеджером'],
    notifications: ['Уведомления', 'Системные уведомления и оповещения'],
    profile: ['Мой профиль', 'Редактирование личных данных'],
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
      const { events } = await api.eventsAPI.getAll({ customer_id: 'me' });
      if (statEvents) statEvents.textContent = events ? events.length : '—';
      if (statPending) statPending.textContent = events ? events.filter(e => e.status === 'pending_manager' || e.status === 'in_preparation').length : '—';
      if (statConfirmed) statConfirmed.textContent = events ? events.filter(e => e.status === 'confirmed').length : '—';
    } catch (err) { console.error('Ошибка загрузки статистики:', err); }
  }

  async function loadEventsList() {
    try {
      const { events } = await api.eventsAPI.getAll({ customer_id: 'me' });
      const container = document.getElementById('eventsList');
      if (!container) return;
      if (!events || events.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px;">У вас пока нет мероприятий. Создайте первое!</p>';
        return;
      }
      container.innerHTML = events.map(ev => `
        <div class="card mb-4" style="padding: 20px;">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 style="margin-bottom: 8px;">${ev.title}</h3>
              <p style="color: var(--text-muted); margin-bottom: 4px;"><strong>Тип:</strong> ${ev.event_type_name || '—'}</p>
              <p style="color: var(--text-muted); margin-bottom: 4px;"><strong>Дата:</strong> ${ev.event_date || '—'} ${ev.start_time ? 'в ' + ev.start_time : ''}</p>
              <p style="color: var(--text-muted); margin-bottom: 0;"><strong>Адрес:</strong> ${ev.address || '—'}</p>
            </div>
            <span class="status-badge status-${ev.status || 'draft'}">${ev.status || 'draft'}</span>
          </div>
          <div class="flex gap-4">
            <p style="color: var(--text-dark); font-weight: 700;">${ev.budget ? ev.budget + ' ₽' : '—'} / бюджет</p>
            <p style="color: var(--text-muted);">Гостей: ${ev.guest_count || '—'}</p>
          </div>
        </div>
      `).join('');
    } catch (err) { console.error('Ошибка загрузки мероприятий:', err); }
  }

  async function loadSectionData(section) {
    switch (section) {
      case 'dashboard':
        await loadStats();
        await loadEventsList();
        break;
      case 'proposals':
        // Загрузка предложений
        break;
      case 'messages':
        // Загрузка сообщений
        break;
      case 'notifications':
        // Загрузка уведомлений
        break;
      case 'profile':
        await loadProfile();
        break;
    }
  }

  async function loadProfile() {
    try {
      const { user } = await api.authAPI.me();
      document.getElementById('profileFullName').value = user.full_name || '';
      document.getElementById('profileEmail').value = user.email || '';
      document.getElementById('profilePhone').value = user.phone || '';
    } catch (err) { console.error('Ошибка загрузки профиля:', err); }
  }

  await loadStats();
});