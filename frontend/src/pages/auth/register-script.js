document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        // Берем данные из полей (теперь названия точно совпадают с HTML)
        const fullName = document.getElementById('full_name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('confirm_password').value;
        const role_name = document.getElementById('role_name').value;

        const errorDiv = document.getElementById('registerError');

        if (password !== passwordConfirm) {
            if (errorDiv) {
                errorDiv.textContent = "Пароли не совпадают!";
                errorDiv.style.color = "red";
                errorDiv.style.display = "block";
            } else {
                alert("Пароли не совпадают!");
            }
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    full_name: fullName, 
                    email: email, 
                    phone: phone, 
                    password: password, 
                    role_name: role_name 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка регистрации');
            }

            // Если регистрация успешна, сохраняем токен и входим
            localStorage.setItem('dontusa_token', data.accessToken);
            if (data.user && data.user.role) {
                localStorage.setItem('dontusa_role', data.user.role);
            }
            
            // Перенаправляем в кабинет напрямую
            const role = data.user.role;
            if (role === 'specialist') {
                window.location.href = '/pages/specialist/dashboard.html';
            } else {
                window.location.href = '/pages/customer/dashboard.html';
            }
            
        } catch (err) {
            console.error('Ошибка:', err);
            if (errorDiv) {
                errorDiv.textContent = err.message;
                errorDiv.style.color = 'red';
                errorDiv.style.display = 'block';
            } else {
                alert(err.message);
            }
        }
    });
});
});