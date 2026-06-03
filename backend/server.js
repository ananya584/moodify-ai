const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

const moodRoutes = require('./routes/moodRoutes');

console.log("SERVER Gemini:", process.env.GEMINI_API_KEY);
console.log("SERVER Spotify:", process.env.SPOTIFY_CLIENT_ID);
const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173').split(',');
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (CLIENT_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
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
