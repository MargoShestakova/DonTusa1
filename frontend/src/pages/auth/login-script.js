document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const loginVal = document.getElementById('login').value;
        const passVal = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        
        if (errorDiv) {
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        }

        try {
            // Отправляем запрос НАПРЯМУЮ к серверу, без всяких посредников
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: loginVal, password: passVal })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Неверный логин или пароль');
            }

            // Сохраняем токен
            localStorage.setItem('dontusa_token', data.accessToken);
            if (data.user && data.user.role) {
                localStorage.setItem('dontusa_role', data.user.role);
            }
            
            // Перенаправляем
            const role = data.user.role;
            if (role === 'admin') window.location.href = '/pages/admin/dashboard.html';
            else if (role === 'manager') window.location.href = '/pages/manager/dashboard.html';
            else if (role === 'specialist') window.location.href = '/pages/specialist/dashboard.html';
            else window.location.href = '/pages/customer/dashboard.html';
            
        } catch (err) {
            console.error('Ошибка:', err);
            if (errorDiv) {
                errorDiv.textContent = err.message;
                errorDiv.style.display = 'block';
                errorDiv.style.color = 'red';
                errorDiv.style.marginTop = '10px';
            } else {
                alert(err.message);
            }
        }
    });
});