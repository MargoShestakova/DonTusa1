// ============================================
// DonTusa — Скрипт входа
// ============================================

const API_URL = 'http://localhost:3000/api/auth/login';

// Редирект в зависимости от роли пользователя
function redirectByRole(role) {
    const routes = {
        admin: '/pages/admin/dashboard.html',
        manager: '/pages/manager/dashboard.html',
        specialist: '/pages/specialist/dashboard.html',
        customer: '/pages/customer/dashboard.html'
    };

    window.location.href = routes[role] || '/pages/public/index.html';
}

// Показать текст ошибки под формой
function showError(text) {
    const errorBlock = document.getElementById('error-message');
    errorBlock.textContent = text;
    errorBlock.classList.add('visible');
}

// Скрыть ошибку
function hideError() {
    const errorBlock = document.getElementById('error-message');
    errorBlock.textContent = '';
    errorBlock.classList.remove('visible');
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // отменяем стандартную отправку формы
        hideError();

        const login = document.getElementById('login').value.trim();
        const password = document.getElementById('password').value;

        if (!login || !password) {
            showError('Пожалуйста, заполните все поля.');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Сохраняем токен
                localStorage.setItem('dontusa_token', data.accessToken);

                // Перекидываем пользователя в кабинет по роли
                redirectByRole(data.user.role);
            } else {
                // Ошибка от сервера (неверный логин/пароль и т.д.)
                showError(data.message || data.error || 'Неверный логин или пароль.');
            }
        } catch (error) {
            // Сервер недоступен или проблема с сетью
            showError('Не удалось подключиться к серверу. Попробуйте позже.');
            console.error('Ошибка запроса:', error);
        }
    });
});