/* ==========================================
   DonTusa — Основной JS клиента
   Навигация, загрузка данных
   ========================================== */

/* ---------- Навигация (подсветка активной ссылки) ---------- */
const navLinks = document.querySelectorAll('.navbar-nav a');
const currentPath = window.location.pathname;
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href && currentPath.includes(href) && href !== '/') {
    link.style.background = 'var(--color-soft-yellow)';
    link.style.color = 'var(--color-dark)';
  }
});

/* ---------- Загрузка типов мероприятий ---------- */
async function loadEventTypes() {
  const grid = document.getElementById('eventTypesGrid');
  if (!grid) return;
  try {
    const { eventTypes } = await window.api.eventTypesAPI.getAll();
    grid.innerHTML = eventTypes.map(et => `
      <div class="card" style="min-width: 200px; text-align: center;">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🎊</div>
        <h3 style="font-size: 1.25rem; margin-bottom: 8px;">${et.name}</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted);">${et.description || ''}</p>
      </div>
    `).join('');
  } catch (err) {
    console.error('Ошибка загрузки типов мероприятий:', err);
    grid.innerHTML = '<p style="color: var(--color-accent);">Не удалось загрузить типы мероприятий.</p>';
  }
}

/* ---------- Загрузка специалистов ---------- */
async function loadSpecialists() {
  const grid = document.getElementById('specialistsGrid');
  if (!grid) return;
  try {
    const { specialists } = await window.api.specialistsAPI.getAll({ is_published: 'true' });
    grid.innerHTML = specialists.map(s => `
      <div class="card" style="min-width: 240px;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🌸</div>
        <h3 style="font-size: 1.25rem; margin-bottom: 8px;">${s.full_name || 'Специалист'}</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">${s.city || ''}</p>
        <div style="font-size: 1rem; font-weight: 700; color: var(--color-dark);">
          от ${s.price_from ? s.price_from : 'договорная'} ₽
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Ошибка загрузки специалистов:', err);
    grid.innerHTML = '<p style="color: var(--color-accent);">Не удалось загрузить специалистов.</p>';
  }
}

/* ---------- Инициализация ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  window.api = {
    eventTypesAPI: null,
    specialistsAPI: null,
  };

  try {
    const apiModule = await import('/services/api.js');
    window.api = apiModule;
  } catch (err) {
    console.error('Не удалось загрузить API клиент:', err);
  }

  loadEventTypes();
  loadSpecialists();
});