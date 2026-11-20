// GENESIX - backend/server.js
// Lance le serveur
const app = require('./app');
const config = require('./admin-config');
const { initFirebase } = require('./firebase');

initFirebase();

const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 GENESIX Backend sur http://localhost:${PORT}`);
  console.log(`📡 Test : http://localhost:${PORT}/api/health`);
});
