/* ==========================================
   DonTusa — Админ-панель (логика)
   ========================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const { api } = await import('/services/api.js');

  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sections = document.querySelectorAll('.content-section');
  const pageTitle = document.getElementById('pageTitle');
  const pageSubtitle = document.getElementById('pageSubtitle');

  const statUsers = document.getElementById('statUsers');
  const statEvents = document.getElementById('statEvents');
  const statVenues = document.getElementById('statVenues');
  const statSpecialists = document.getElementById('statSpecialists');

  const sectionTitles = {
    dashboard: ['Обзор системы', 'Ключевые показатели платформы DonTusa'],
    users: ['Пользователи системы', 'Управление аккаунтами всех ролей'],
    events: ['Все мероприятия', 'Созданные и запланированные события'],
    venues: ['Площадки для мероприятий', 'Каталог локаций и мест проведения'],
    specialists: ['Специалисты', 'Исполнители и подрядчики праздников'],
    requests: ['Персональные запросы', 'Запросы менеджеров специалистам'],
    messages: ['Переписка пользователей', 'Сообщения между заказчиками и менеджерами'],
    activity: ['Журнал действий', 'История действий администраторов и менеджеров'],
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
      const [usersRes, eventsRes, venuesRes, specialistsRes] = await Promise.all([
        api.usersAPI.getAll(), api.eventsAPI.getAll(), api.venuesAPI.getAll(), api.specialistsAPI.getAll(),
      ]);
      if (statUsers) statUsers.textContent = usersRes.users ? usersRes.users.length : '—';
      if (statEvents) statEvents.textContent = eventsRes.events ? eventsRes.events.length : '—';
      if (statVenues) statVenues.textContent = venuesRes.venues ? venuesRes.venues.length : '—';
      if (statSpecialists) statSpecialists.textContent = specialistsRes.specialists ? specialistsRes.specialists.length : '—';
    } catch (err) { console.error('Ошибка загрузки статистики:', err); }
  }

  async function loadUsersTable() {
    try {
      const { users } = await api.usersAPI.getAll();
      const tbody = document.getElementById('usersTableBody');
      if (!tbody) return;
      tbody.innerHTML = users.map(u => `
        <tr>
          <td>${u.full_name}</td>
          <td>${u.email}</td>
          <td><span class="status-badge status-${u.role_name || 'customer'}">${u.role_name || 'customer'}</span></td>
          <td>${u.phone || '—'}</td>
          <td><span class="status-badge ${u.is_active ? 'status-active' : 'status-cancelled'}">${u.is_active ? 'Активен' : 'Заблокирован'}</span></td>
          <td><button class="action-btn view" title="Просмотр">👁</button><button class="action-btn edit" title="Редактировать">✏</button><button class="action-btn delete" title="Удалить">🗑</button></td>
        </tr>
      `).join('');
    } catch (err) { console.error('Ошибка загрузки пользователей:', err); }
  }

  async function loadEventsTable() {
    try {
      const { events } = await api.eventsAPI.getAll();
      const tbody = document.getElementById('eventsTableBody');
      if (!tbody) return;
      tbody.innerHTML = events.map(ev => `
        <tr>
          <td>${ev.title}</td>
          <td>${ev.event_type_name || '—'}</td>
          <td>${ev.event_date || '—'}</td>
          <td>${ev.customer_name || '—'}</td>
          <td>${ev.manager_name || '—'}</td>
          <td><span class="status-badge status-${ev.status || 'draft'}">${ev.status || 'draft'}</span></td>
          <td>${ev.budget ? ev.budget + ' ₽' : '—'}</td>
          <td><button class="action-btn view" title="Просмотр">👁</button><button class="action-btn edit" title="Редактировать">✏</button><button class="action-btn delete" title="Удалить">🗑</button></td>
        </tr>
      `).join('');
    } catch (err) { console.error('Ошибка загрузки мероприятий:', err); }
  }

  async function loadVenuesTable() {
    try {
      const { venues } = await api.venuesAPI.getAll();
      const tbody = document.getElementById('venuesTableBody');
      if (!tbody) return;
      tbody.innerHTML = venues.map(v => `
        <tr>
          <td>${v.name}</td>
          <td>${v.address || '—'}</td>
          <td>${v.venue_type || '—'}</td>
          <td>${v.capacity || '—'}</td>
          <td><span class="status-badge ${v.is_published ? 'status-active' : 'status-pending'}">${v.is_published ? 'Опубликовано' : 'На модерации'}</span></td>
          <td>${v.created_by_name || '—'}</td>
          <td><button class="action-btn view" title="Просмотр">👁</button><button class="action-btn edit" title="Редактировать">✏</button><button class="action-btn delete" title="Удалить">🗑</button></td>
        </tr>
      `).join('');
    } catch (err) { console.error('Ошибка загрузки площадок:', err); }
  }

  async function loadSpecialistsTable() {
    try {
      const { specialists } = await api.specialistsAPI.getAll();
      const tbody = document.getElementById('specialistsTableBody');
      if (!tbody) return;
      tbody.innerHTML = specialists.map(s => `
        <tr>
          <td>${s.full_name || '—'}</td>
          <td>${s.city || '—'}</td>
          <td>${s.price_from ? s.price_from + ' ₽' : '—'}</td>
          <td>${s.experience || '—'} лет</td>
          <td><span class="status-badge ${s.is_published ? 'status-active' : 'status-pending'}">${s.is_published ? 'Опубликован' : 'Черновик'}</span></td>
          <td><button class="action-btn view" title="Просмотр">👁</button><button class="action-btn edit" title="Редактировать">✏</button></td>
        </tr>
      `).join('');
    } catch (err) { console.error('Ошибка загрузки специалистов:', err); }
  }

  async function loadRequestsTable() {
    try {
      const { requests } = await api.specialistRequestsAPI.getAll();
      const tbody = document.getElementById('requestsTableBody');
      if (!tbody) return;
      tbody.innerHTML = requests.map(r => `
        <tr>
          <td>${r.event_title || '—'}</td>
          <td>Специалист #${r.specialist_user_id || '—'}</td>
          <td>${r.manager_name || '—'}</td>
          <td><span class="status-badge status-${r.status || 'sent'}">${r.status || 'sent'}</span></td>
          <td>${r.sent_at ? new Date(r.sent_at).toLocaleDateString() : '—'}</td>
          <td><button class="action-btn view" title="Просмотр">👁</button></td>
        </tr>
      `).join('');
    } catch (err) { console.error('Ошибка загрузки запросов:', err); }
  }

  async function loadMessagesTable() {
    try {
      const { messages } = await api.messagesAPI.getAll();
      const tbody = document.getElementById('messagesTableBody');
      if (!tbody) return;
      tbody.innerHTML = messages.map(m => `
        <tr>
          <td>${m.sender_name || '—'}</td>
          <td>${m.receiver_name || '—'}</td>
          <td>${m.event_id ? 'Событие #' + m.event_id : '—'}</td>
          <td>${m.message_text || '—'}</td>
          <td>${m.created_at ? new Date(m.created_at).toLocaleDateString() : '—'}</td>
          <td><span class="status-badge ${m.is_read ? 'status-active' : 'status-pending'}">${m.is_read ? 'Прочитано' : 'Новое'}</span></td>
        </tr>
      `).join('');
    } catch (err) { console.error('Ошибка загрузки сообщений:', err); }
  }

  async function loadActivityTable() {
    try {
      const { log } = await api.activityLogAPI.getAll();
      const tbody = document.getElementById('activityTableBody');
      if (!tbody) return;
      tbody.innerHTML = log.map(a => `
        <tr>
          <td>${a.user_name || '—'}</td>
          <td>${a.action}</td>
          <td>${a.entity_type}</td>
          <td>${a.entity_id || '—'}</td>
          <td>${a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}</td>
        </tr>
      `).join('');
    } catch (err) { console.error('Ошибка загрузки журнала:', err); }
  }

  async function loadSectionData(section) {
    switch (section) {
      case 'dashboard':
        await loadStats();
        await loadUsersTable();
        await loadEventsTable();
        break;
      case 'users': await loadUsersTable(); break;
      case 'events': await loadEventsTable(); break;
      case 'venues': await loadVenuesTable(); break;
      case 'specialists': await loadSpecialistsTable(); break;
      case 'requests': await loadRequestsTable(); break;
      case 'messages': await loadMessagesTable(); break;
      case 'activity': await loadActivityTable(); break;
    }
  }

  await loadStats();
});