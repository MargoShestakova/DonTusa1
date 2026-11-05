# DonTusa

Веб-платформа для организации и сопровождения праздничных мероприятий.

## Технологический стек
- HTML5, CSS3, JavaScript
- Node.js, Express.js, REST API
- PostgreSQL
- JWT авторизация
- Leaflet + OpenStreetMap (карта площадок)

## Роли пользователей
1. Администратор
2. Заказчик (обычный пользователь)
3. Менеджер
4. Специалист (рабочий персонал)

## Структура
- `backend/` — серверная часть (Node.js + Express + PostgreSQL)
- `frontend/` — клиентская часть (HTML/CSS/JS)

## Запуск
```bash
# Установка зависимостей
cd backend && npm install

# Инициализация базы данных
npm run init-db

# Запуск сервера
npm start
```

Сервер: http://localhost:3000
База данных: PostgreSQL на порту 5432 (пользователь postgres, пароль 123456)