const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const moodRoutes = require('./routes/moodRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173').split(',');
app.use(cors({ origin: CLIENT_ORIGINS, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'moodify-backend' });
});

app.use('/api/mood', moodRoutes);

app.use((err, _req, res, next) => {
  void next;
  console.error(err);
  res.status(500).json({
    message: 'Internal server error',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://127.0.0.1:${PORT}`);
});
