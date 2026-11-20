# Déploiement GENESIX sur Vercel

## Corrections incluses
- Harmonisation des chemins `api/` (le dossier était référencé en majuscules dans Vercel).
- Ajout de `backend/app.js`, utilisé par la fonction serverless.
- Ajout de `backend/server.js` (l'ancien fichier `serveur.js` avait un nom différent de celui appelé par `package.json`).
- Configuration Vercel séparant l'API serverless et les fichiers du dossier `public/`.
- Configuration Firebase par variables d'environnement : aucune clé privée n'est inscrite dans le code.
- `/api/health` reste accessible pour diagnostiquer le déploiement, même avant la configuration Firebase.

## Variables d'environnement obligatoires pour les fonctions Firebase
Dans Vercel : Project → Settings → Environment Variables, ajouter :
1. `FIREBASE_SERVICE_ACCOUNT_JSON` : le contenu JSON complet du compte de service Firebase.
2. `FIREBASE_DATABASE_URL` : URL Realtime Database du projet.

Redéployer après avoir ajouté les variables. Ne publiez jamais le JSON du compte de service.

## Vérification
- Ouvrir `/api/health` : doit afficher `status: OK` et `firebase: true`.
- Ouvrir `/api/build` : doit afficher `GENESIX déployé correctement`.

Sans variables Firebase, le site statique et le diagnostic peuvent s'ouvrir, mais inscription, utilisateurs et messages renverront une erreur 503 explicite jusqu'à la configuration.
