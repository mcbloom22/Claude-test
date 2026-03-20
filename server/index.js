require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/saved', require('./routes/saved'));
app.use('/api/reservations', require('./routes/reservations'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Bind to 0.0.0.0 so iPhones on the same WiFi can reach it
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
