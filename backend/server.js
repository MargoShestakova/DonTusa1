const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// Импорт маршрутов
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const roleRoutes = require('./src/routes/roles');
const eventRoutes = require('./src/routes/events');
const eventTypeRoutes = require('./src/routes/eventTypes');
const specialistRoutes = require('./src/routes/specialists');
const specialistCategoryRoutes = require('./src/routes/specialistCategories');
const portfolioRoutes = require('./src/routes/portfolio');
const serviceRoutes = require('./src/routes/services');
const eventSpecialistRoutes = require('./src/routes/eventSpecialists');
const specialistRequestRoutes = require('./src/routes/specialistRequests');
const availabilityRoutes = require('./src/routes/availability');
const venueRoutes = require('./src/routes/venues');
const venuePhotoRoutes = require('./src/routes/venuePhotos');
const venueEventTypeRoutes = require('./src/routes/venueEventTypes');
const messageRoutes = require('./src/routes/messages');
const notificationRoutes = require('./src/routes/notifications');
const statusHistoryRoutes = require('./src/routes/statusHistory');
const activityLogRoutes = require('./src/routes/activityLog');

// Импорт middleware
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Статические файлы для загруженных изображений
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'dontusa-backend', timestamp: new Date().toISOString() });
});

// API маршруты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/event-types', eventTypeRoutes);
app.use('/api/specialists', specialistRoutes);
app.use('/api/specialist-categories', specialistCategoryRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/event-specialists', eventSpecialistRoutes);
app.use('/api/specialist-requests', specialistRequestRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/venue-photos', venuePhotoRoutes);
app.use('/api/venue-event-types', venueEventTypeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/status-history', statusHistoryRoutes);
app.use('/api/activity-log', activityLogRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Маршрут не найден' });
});

// Обработка ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`DonTusa сервер запущен на порту ${PORT}`);
  console.log(`Среда: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;