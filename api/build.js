// GENESIX - API/build.js
// Gestionnaire d'API pour déclencher la génération de l'API
// Utilisé par Vercel pour builder le backend

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res) => {
  try {
    console.log('🚀 GENESIX - Build API déclenché');

    // Vérifier que backend/app.js existe
    const appPath = path.join(__dirname, '..', 'backend', 'app.js');
    if (!fs.existsSync(appPath)) {
      return res.status(500).json({
        success: false,
        message: 'backend/app.js introuvable',
        path: appPath
      });
    }

    // Vérifier Firebase
    const firebasePath = path.join(__dirname, '..', 'backend', 'firebase.js');
    const firebaseExists = fs.existsSync(firebasePath);

    res.json({
      success: true,
      message: 'GENESIX API Build OK ✅',
      version: '1.0.0',
      author: 'Jason Aloma 🇨🇩',
      files: {
        app: true,
        firebase: firebaseExists,
        server: fs.existsSync(path.join(__dirname, '..', 'backend', 'server.js')),
        adminConfig: fs.existsSync(path.join(__dirname, '..', 'backend', 'admin-config.js'))
      },
      endpoints: [
        'GET /api/health',
        'POST /api/auth/register',
        'POST /api/auth/verify-code',
        'POST /api/auth/resend-code',
        'GET /api/users',
        'GET /api/conversations/:uid',
        'GET /api/messages/:conversationId',
        'POST /api/messages'
      ],
      time: new Date().toISOString()
    });
  } catch (e) {
    console.error('Build erreur:', e);
    res.status(500).json({ success: false, message: 'Erreur build', error: e.message });
  }
};
