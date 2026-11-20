// GENESIX - backend/firebase.js
const admin = require('firebase-admin');

// ⚠️ COLLE TES CLÉS ICI - Firebase Console > Paramètres > Comptes de service
const SERVICE_ACCOUNT = {
  projectId: "genesix",
  clientEmail: "firebase-adminsdk-xxxxx@genesix.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nCOLLE_TA_CLE_ICI\n-----END PRIVATE KEY-----\n",
  databaseURL: "https://genesix-default-rtdb.firebaseio.com"
};

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: SERVICE_ACCOUNT.projectId,
      clientEmail: SERVICE_ACCOUNT.clientEmail,
      privateKey: SERVICE_ACCOUNT.privateKey.replace(/\\n/g, '\n')
    }),
    databaseURL: SERVICE_ACCOUNT.databaseURL
  });
  console.log('✅ Firebase Admin connecté');
}

module.exports = {
  db: admin.database(),
  auth: admin.auth(),
  admin
};
