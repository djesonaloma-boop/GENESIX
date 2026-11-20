// GENESIX - backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// API
app.use('/api', routes);

// Frontend - public/
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 GENESIX sur http://localhost:${PORT}`);
});
