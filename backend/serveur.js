// GENESIX — serveur Express (local + Vercel)
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
if (require.main === module) {
  const port = Number(process.env.PORT || 5000);
  app.listen(port, () => console.log(`GENESIX disponible sur http://localhost:${port}`));
}
module.exports = app;
