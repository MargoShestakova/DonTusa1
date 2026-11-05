const pool = require('./database');
const bcrypt = require('bcryptjs');

const SQL = `
-- 1. Таблица ролей
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
  username VARCHAR(100) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  avatar_path VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Таблица типов мероприятий
CREATE TABLE IF NOT EXISTS event_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Таблица мероприятий
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  event_type_id INTEGER REFERENCES event_types(id) ON DELETE SET NULL,
  description TEXT,
  event_date DATE,
  start_time TIME,
  end_time TIME,
  address VARCHAR(500),
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  guest_count INTEGER,
  budget DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Профили специалистов
CREATE TABLE IF NOT EXISTS specialist_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  description TEXT,
  city VARCHAR(100),
  price_from DECIMAL(12, 2),
  price_to DECIMAL(12, 2),
  experience INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Категории специалистов
CREATE TABLE IF NOT EXISTS specialist_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Связка специалист-категория
CREATE TABLE IF NOT EXISTS specialist_category_links (
  id SERIAL PRIMARY KEY,
  specialist_id INTEGER REFERENCES specialist_profiles(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES specialist_categories(id) ON DELETE CASCADE,
  UNIQUE(specialist_id, category_id)
);

-- 8. Фотографии портфолио
CREATE TABLE IF NOT EXISTS portfolio_photos (
  id SERIAL PRIMARY KEY,
  specialist_id INTEGER REFERENCES specialist_profiles(id) ON DELETE CASCADE,
  file_path VARCHAR(500) NOT NULL,
  caption VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Услуги специалистов
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  specialist_id INTEGER REFERENCES specialist_profiles(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES specialist_categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12, 2),
  price_unit VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Назначение специалистов на мероприятие
CREATE TABLE IF NOT EXISTS event_specialists (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  specialist_id INTEGER REFERENCES specialist_profiles(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  selection_status VARCHAR(50) DEFAULT 'proposed',
  proposed_price DECIMAL(12, 2),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Персональные запросы (менеджер -> специалист)
CREATE TABLE IF NOT EXISTS specialist_requests (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  specialist_id INTEGER REFERENCES specialist_profiles(id) ON DELETE CASCADE,
  manager_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(50) DEFAULT 'sent',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP NULL,
  response_comment TEXT
);

-- 12. Календарь занятости специалистов
CREATE TABLE IF NOT EXISTS specialist_availability (
  id SERIAL PRIMARY KEY,
  specialist_id INTEGER REFERENCES specialist_profiles(id) ON DELETE CASCADE,
  start_datetime TIMESTAMP NOT NULL,
  end_datetime TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'free',
  event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
  comment TEXT
);

-- 13. Площадки
CREATE TABLE IF NOT EXISTS venues (
  id SERIAL PRIMARY KEY,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  description TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  capacity INTEGER,
  venue_type VARCHAR(100),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Фотографии площадок
CREATE TABLE IF NOT EXISTS venue_photos (
  id SERIAL PRIMARY KEY,
  venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
  file_path VARCHAR(500) NOT NULL,
  caption VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Связка площадка-тип мероприятия
CREATE TABLE IF NOT EXISTS venue_event_types (
  id SERIAL PRIMARY KEY,
  venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
  event_type_id INTEGER REFERENCES event_types(id) ON DELETE CASCADE,
  UNIQUE(venue_id, event_type_id)
);

-- 16. Сообщения
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. Уведомления
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  related_event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. История статусов мероприятий
CREATE TABLE IF NOT EXISTS event_status_history (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. Журнал действий
CREATE TABLE IF NOT EXISTS activity_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id INTEGER,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_customer_id ON events(customer_id);
CREATE INDEX IF NOT EXISTS idx_events_manager_id ON events(manager_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_specialist_profiles_user_id ON specialist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_specialist_profiles_city ON specialist_profiles(city);
CREATE INDEX IF NOT EXISTS idx_specialist_requests_specialist_id ON specialist_requests(specialist_id);
CREATE INDEX IF NOT EXISTS idx_specialist_requests_status ON specialist_requests(status);
CREATE INDEX IF NOT EXISTS idx_venues_is_published ON venues(is_published);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
`;

async function init() {
  const client = await pool.connect();
  try {
    await client.query(SQL);
    console.log('Все таблицы созданы успешно');

    // Seed ролей
    const roles = ['admin', 'manager', 'customer', 'specialist'];
    for (const roleName of roles) {
      await client.query(
        'INSERT INTO roles (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [roleName, getRoleDescription(roleName)]
      );
    }
    console.log('Роли созданы');

    // Добавляем колонку username если её нет (для существующих БД)
    try {
      await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE");
    } catch (e) {
      // игнорируем ошибку если колонка уже есть
    }

    // Администратор по умолчанию
    const adminRole = await client.query("SELECT id FROM roles WHERE name = 'admin'");
    if (adminRole.rows.length > 0) {
      const existing = await client.query("SELECT id FROM users WHERE email = 'admin@dontusa.com'");
      if (existing.rows.length === 0) {
        const passwordHash = await bcrypt.hash('admin123', 10);
        await client.query(
          'INSERT INTO users (role_id, full_name, email, username, password_hash, is_active) VALUES ($1, $2, $3, $4, $5, $6)',
          [adminRole.rows[0].id, 'Администратор системы', 'admin@dontusa.com', 'admin', passwordHash, true]
        );
        console.log('Администратор создан: логин=admin, email=admin@dontusa.com, пароль=admin123');
      } else {
        // Обновляем существующего админа — добавляем логин
        await client.query("UPDATE users SET username = 'admin' WHERE email = 'admin@dontusa.com' AND (username IS NULL OR username = '')");
        console.log('Администратор обновлен: логин=admin');
      }
    }

    // Типы мероприятий
    const eventTypes = [
      ['Свадьба', 'Торжественная церемония бракосочетания и банкет'],
      ['День рождения', 'Празднование дня рождения'],
      ['Корпоратив', 'Корпоративное мероприятие для сотрудников'],
      ['Юбилей', 'Юбилейное торжество'],
      ['Выпускной', 'Выпускной вечер'],
      ['Детский праздник', 'Праздник для детей'],
    ];
    for (const [name, desc] of eventTypes) {
      await client.query(
        'INSERT INTO event_types (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [name, desc]
      );
    }
    console.log('Типы мероприятий созданы');

    // Категории специалистов
    const categories = [
      ['Фотограф', 'Профессиональная фотосъёмка мероприятий'],
      ['Видеограф', 'Видеосъёмка и монтаж'],
      ['Ведущий', 'Ведущий мероприятий, тамада'],
      ['Флорист', 'Оформление цветами и декор'],
      ['Декоратор', 'Декоративное оформление площадки'],
      ['Музыкант', 'Живая музыка на мероприятие'],
      ['DJ', 'Диджей и музыкальное сопровождение'],
      ['Визажист', 'Макияж и причёски'],
      ['Кейтеринг', 'Кейтеринг и организация питания'],
      ['Аренда оборудования', 'Аренда звукового и светового оборудования'],
    ];
    for (const [name, desc] of categories) {
      await client.query(
        'INSERT INTO specialist_categories (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [name, desc]
      );
    }
    console.log('Категории специалистов созданы');

    console.log('Инициализация базы данных завершена');
  } catch (err) {
    console.error('Ошибка инициализации базы данных:', err);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

function getRoleDescription(name) {
  const descriptions = {
    admin: 'Администратор системы с полным доступом',
    manager: 'Менеджер по сопровождению мероприятий',
    customer: 'Заказчик мероприятий',
    specialist: 'Рабочий персонал / специалист',
  };
  return descriptions[name] || '';
}

init();