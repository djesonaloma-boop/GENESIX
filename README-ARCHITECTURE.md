# GENESIX — architecture demandée

```text
GENESIX/
├── package.json
├── capacitor.config.json
├── vercel.json
├── .gitignore
├── backend/
│   ├── firebase.js
│   ├── server.js
│   └── routes.js
└── public/
    ├── index.html
    ├── discussions.html
    ├── chat.html
    ├── profil.html
    ├── admin.html
    ├── login.html
    ├── register.html
    ├── manifest.json
    ├── sw.js
    ├── css/app.css
    └── js/{core,discussions,chat,profil,admin}.js
```

## Configuration obligatoire

Dans Vercel → Project → Settings → Environment Variables, ajoute :
- `FIREBASE_SERVICE_ACCOUNT_JSON` : contenu JSON complet du compte de service Firebase (une seule variable).
- `FIREBASE_DATABASE_URL` : URL Realtime Database du projet.

Ne publie jamais la clé privée dans GitHub. Les pages de connexion/inscription utilisent également la configuration Firebase Web dans `public/login.html` et `public/register.html` : remplace les valeurs `COLLE_TA_...` par celles de Firebase Console → Paramètres du projet → Tes applications → application Web.

## Démarrer localement

```bash
npm install
npm start
```

Le serveur démarre sur le port fourni par `PORT` (5000 par défaut). `/api/health` permet de vérifier le serveur. Si Firebase n'est pas configuré, l'API répond `503 Firebase non configuré` au lieu de faire planter le démarrage.

## Remarque sécurité

Cette version conserve les routes et données Realtime Database du projet source. Avant une mise en production ouverte au public, ajoute une vérification Firebase ID token sur les routes privées et une autorisation admin dédiée sur `/api/users`.
