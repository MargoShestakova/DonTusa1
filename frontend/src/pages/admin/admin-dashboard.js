// ============================================
// DonTusa — Кабинет администратора
// ============================================

const API_USERS = 'http://localhost:3000/api/users';

// Получаем токен из localStorage
const token = localStorage.getItem('dontusa_token');

// Если токена нет — на страницу входа
if (!token) {
    window.location.href = '../auth/login.html';
}

// Показать ошибку
function showError(container, text) {
    container.innerHTML = `
        <div class="form-error visible" style="display: block;">
            ${text}
        </div>
    `;
}

// Переключение вкладок
function initTabs() {
    const links = document.querySelectorAll('.sidebar-link');

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const tabName = link.dataset.tab;

            // Подсветка активной вкладки
            links.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');

            // Показ нужной панели
            document.querySelectorAll('.tab-panel').forEach((panel) => {
                panel.style.display = 'none';
            });
            document.getElementById('tab-' + tabName).style.display = 'block';
        });
    });
}

// Экранирование текста (защита от XSS)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
}

// Вывод статистики
function renderStats(users) {
    document.getElementById('stat-users').textContent = users.length;
    document.getElementById('stat-customers').textContent =
        users.filter((u) => u.role === 'customer').length;
    document.getElementById('stat-specialists').textContent =
        users.filter((u) => u.role === 'specialist').length;
}

// Вывод таблицы пользователей
function renderUsersTable(users) {
    const container = document.getElementById('users-container');

    if (users.length === 0) {
        container.innerHTML = '<p class="text-muted">Пользователей пока нет.</p>';
        return;
    }

    const rows = users.map((user) => `
        <tr>
            <td>${user.id}</td>
            <td>${escapeHtml(user.full_name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${escapeHtml(user.phone)}</td>
            <td>${escapeHtml(user.role)}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>ФИО</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Роль</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}

// Загрузка пользователей с сервера
async function loadUsers() {
    const container = document.getElementById('users-container');

    try {
        const response = await fetch(API_USERS, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Токен недействителен — на страницу входа
                localStorage.removeItem('dontusa_token');
                window.location.href = '../auth/login.html';
                return;
            }
            throw new Error('Ошибка сервера: ' + response.status);
        }

        const users = await response.json();

        renderStats(users);
        renderUsersTable(users);
    } catch (error) {
        showError(container, 'Не удалось загрузить список пользователей.');
        console.error('Ошибка запроса:', error);
    }
}

// Кнопка "Выйти"
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('dontusa_token');
        window.location.href = '../auth/login.html';
    });
}

// Запуск после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initLogout();
    loadUsers();
});