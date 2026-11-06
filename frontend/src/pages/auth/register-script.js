// ============================================
// DonTusa — Скрипт регистрации
// ============================================

const API_URL = 'http://localhost:3000/api/auth/register';

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
    const form = document.getElementById('register-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // отменяем стандартную отправку формы
        hideError();

        const fullName = document.getElementById('full_name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        const roleName = document.getElementById('role_name').value;

        // Проверка: все поля заполнены
        if (!fullName || !email || !phone || !password || !confirmPassword) {
            showError('Пожалуйста, заполните все поля.');
            return;
        }

        // Проверка: пароли совпадают
        if (password !== confirmPassword) {
            showError('Пароли не совпадают.');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name: fullName,
                    email: email,
                    phone: phone,
                    password: password,
                    role_name: roleName
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Сохраняем токен
                localStorage.setItem('dontusa_token', data.accessToken);

                // Перекидываем пользователя в кабинет по роли
                redirectByRole(data.user.role);
            } else {
                // Ошибка от сервера (email занят и т.д.)
                showError(data.message || data.error || 'Ошибка регистрации. Попробуйте позже.');
            }
        } catch (error) {
            // Сервер недоступен или проблема с сетью
            showError('Не удалось подключиться к серверу. Попробуйте позже.');
            console.error('Ошибка запроса:', error);
        }
    });
});