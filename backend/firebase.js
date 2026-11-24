import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

// Firebase Web config ne remplace pas une clé de compte de service Admin.
// Le SDK Admin est initialisé seulement si les variables Vercel sont présentes.
const hasAdminCredentials = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

if (!admin.apps.length && hasAdminCredentials) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    }),
    databaseURL: "https://starlink-investit-default-rtdb.firebaseio.com"
  });
}

export const db = admin.apps.length ? admin.firestore() : null;
export const rtdb = admin.apps.length ? admin.database() : null;
export const auth = admin.apps.length ? admin.auth() : null;
export const adminConfigured = Boolean(admin.apps.length);
export default admin;
