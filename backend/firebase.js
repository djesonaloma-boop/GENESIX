// Configuration Firebase Admin par variables d'environnement.
// Vercel : FIREBASE_SERVICE_ACCOUNT_JSON + FIREBASE_DATABASE_URL.
// Local : mêmes variables dans un fichier .env (non publié).
const admin = require('firebase-admin');
let db = null, auth = null, firebaseError = null;
try {
  let serviceAccount = null;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    };
  }
  const databaseURL = process.env.FIREBASE_DATABASE_URL || serviceAccount?.databaseURL;
  if (!serviceAccount || !databaseURL) throw new Error('Configuration Firebase absente. Ajoute FIREBASE_SERVICE_ACCOUNT_JSON et FIREBASE_DATABASE_URL.');
  if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL });
  db = admin.database(); auth = admin.auth();
} catch (error) { firebaseError = error.message; console.warn('GENESIX Firebase:', firebaseError); }
module.exports = { db, auth, admin, firebaseError };
