const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'src')));

// Прокси API на backend
app.use('/api', (req, res) => {
  res.status(502).json({ error: 'Backend не доступен на этом порту. Используйте http://localhost:3000/api напрямую.' });
});

// Все остальные запросы отдают index.html (для SPA-подобной навигации, если нужно)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DonTusa frontend сервер запущен на http://localhost:${PORT}`);
});