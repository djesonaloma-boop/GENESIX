// GENESIX - backend/firebase.js
// Connexion Firebase Admin (SDK Admin)
const admin = require('firebase-admin');
const config = require('./admin-config');

let initialized = false;

function initFirebase() {
  if (admin.apps.length > 0) return admin.app();
  if (initialized) return admin.app();

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.FIREBASE.PROJECT_ID,
        clientEmail: config.FIREBASE.CLIENT_EMAIL,
        privateKey: config.FIREBASE.PRIVATE_KEY.replace(/\\n/g, '\n')
      }),
      databaseURL: config.FIREBASE.DATABASE_URL
    });

    initialized = true;
    console.log('✅ Firebase Admin connecté - GENESIX');
    return admin.app();
  } catch (e) {
    console.error('❌ Firebase erreur:', e.message);
    console.error('👉 Vérifie tes clés dans admin-config.js');
    return null;
  }
}

function getDB() {
  if (admin.apps.length === 0) initFirebase();
  return admin.database();
}

function getAuth() {
  if (admin.apps.length === 0) initFirebase();
  return admin.auth();
}

module.exports = { initFirebase, getDB, getAuth, admin };
