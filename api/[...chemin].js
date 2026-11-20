// GENESIX - API/[...chemin].js
// Gestionnaire d'API pour Vercel - Attrape toutes les routes
// Créé par Jason Aloma 🇨🇩

// On importe l'app Express depuis backend/
const app = require('../backend/app');

// Vercel : cette fonction reçoit toutes les requêtes /api/*
// [...chemin] = catch-all, ex: /api/auth/register, /api/users, etc.
module.exports = (req, res) => {
  return app(req, res);
};
