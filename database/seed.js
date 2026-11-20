// GENESIX - Database/seed.js
// Créer des données de test - Lancer: node Database/seed.js
// NE PAS lancer en production, seulement pour tester

const admin = require('firebase-admin');
const config = require('../backend/admin-config');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.FIREBASE.PROJECT_ID,
    clientEmail: config.FIREBASE.CLIENT_EMAIL,
    privateKey: config.FIREBASE.PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: config.FIREBASE.DATABASE_URL
});

const db = admin.database();

async function seed() {
  console.log('🌱 GENESIX - Seed en cours...');

  // Vider (attention!)
  // await db.ref('users').remove();
  // await db.ref('conversations').remove();
  // await db.ref('messages').remove();

  console.log('✅ Base vide prête - Aucune fausse discussion créée');
  console.log('👉 Les vrais utilisateurs vont créer les vraies données');
  console.log('📁 Structure créée : users, usernames, conversations, messages, status, posts');

  // Créer juste les noeuds vides pour voir la structure
  await db.ref('users').set({});
  await db.ref('usernames').set({});
  await db.ref('conversations').set({});
  await db.ref('messages').set({});
  await db.ref('status').set({});
  await db.ref('posts').set({});

  console.log('🎉 Seed terminé');
  process.exit(0);
}

seed().catch(e => {
  console.error('❌ Erreur:', e.message);
  process.exit(1);
});
