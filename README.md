# GENESIX — préparation complète au déploiement

Projet : Firebase `starlink-investit`  
Créateur affiché : Jason Aloma 🇨🇩

## Fonctionnalités incluses

- `index.html` : redirige selon l'état de connexion.
- `register.html` : crée un compte Firebase Authentication (email/mot de passe), réserve le pseudo de manière atomique dans `usernames/{pseudo_minuscule}`, crée le profil dans `users/{uid}`, puis ouvre les discussions.
- `login.html` : connexion et redirection vers les discussions ; réinitialisation du mot de passe par email.
- `discussions.html` : liste les membres, ouvre/crée une conversation privée, écoute les messages en temps réel et permet l'envoi de messages texte.
- `assets/js/firebase.js` : unique configuration Firebase Web.
- `firestore.rules` : règles de sécurité Firestore.
- `firestore.indexes.json` : index Firestore (aucun index composé nécessaire pour les requêtes actuelles).
- `storage.rules` : règles Storage pour les futurs avatars et médias.
- `firebase.json` et `.firebaserc` : configuration de déploiement Firebase CLI.
- `backend/` et `api/` : backend Express facultatif utilisant Firebase Admin. Les routes protégées nécessitent des identifiants Admin dans les variables d'environnement Vercel.

Aucun fichier `admin.html` n'est créé.

## Étape A — créer/activer les services Firebase (obligatoire une fois)

La configuration Web ne donne pas les droits administrateur pour créer des bases cloud. Connecte-toi à la console Firebase avec le compte propriétaire du projet `starlink-investit` :

1. **Authentication → Sign-in method** : active `Email/Password`.
2. **Firestore Database** : si aucune base Firestore n'existe, clique `Create database`, choisis le mode production et une région. Les pages GENESIX utilisent Cloud Firestore (pas Realtime Database).
3. **Firestore Database → Rules** : copie le contenu de `firestore.rules`, puis clique `Publish`.
4. **Storage** (si tu veux activer les avatars/médias) : initialise le bucket si nécessaire, ouvre l'onglet Rules, copie `storage.rules`, puis clique `Publish`.
5. **Authentication → Settings → Authorized domains** : ajoute le domaine Vercel exact, par exemple `genesix.vercel.app`.

Important : l'URL Realtime Database fournie dans la configuration n'est pas utilisée par ces pages ; leurs données sont dans Cloud Firestore.

## Étape B — déployer le site sur Vercel

1. Décompresse le ZIP.
2. Envoie le contenu du dossier `genesix_check` à la racine du dépôt GitHub. Ne téléverse pas le dossier parent comme sous-dossier.
3. Importe le dépôt dans Vercel.
4. Framework Preset : `Other` ; Root Directory : `./` ; Build Command : vide ; Output Directory : vide ; Install Command : valeur par défaut.
5. Clique `Deploy`.

Pages attendues : `/`, `/index.html`, `/login.html`, `/register.html`, `/discussions.html`.

## Étape C — test réel

1. Ouvre le domaine Vercel dans un navigateur privé.
2. Crée un compte avec un email accessible et un pseudo unique (3 à 24 caractères, lettres/chiffres/underscore).
3. Vérifie dans Firebase Authentication → Users que le compte existe.
4. Vérifie dans Firestore que `users/{UID}` et `usernames/{pseudo_en_minuscule}` existent.
5. Tu dois être redirigé vers `/discussions.html`.
6. Crée un deuxième compte avec un autre email sur un autre navigateur/appareil, puis envoie un message entre les deux comptes.

## Déployer les règles via Firebase CLI (facultatif)

Depuis un environnement qui possède Node.js et Firebase CLI :

```bash
npm install -g firebase-tools
firebase login
firebase use starlink-investit
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Sinon, copie/colle manuellement les deux fichiers de règles dans la console Firebase comme indiqué à l'étape A.

## Backend Admin facultatif

Le parcours inscription/connexion/discussions du navigateur utilise directement le SDK Firebase Web et ne nécessite pas le backend Admin. Les routes `/api/users` et `/api/chats` exigent les variables Vercel `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` et `FIREBASE_PRIVATE_KEY` issues d'un compte de service Firebase. Ne mets jamais la clé privée dans les fichiers publics ou dans GitHub. Sans ces variables, les routes Admin renvoient volontairement `503`.

## Sécurité et limites actuelles

- Les profils publics ne contiennent pas l'adresse email ; l'email est géré par Firebase Authentication.
- Les pseudos sont réservés dans une transaction Firestore afin d'éviter les doublons.
- Les règles empêchent un utilisateur non membre de lire les messages d'une conversation.
- Les pages profil, paramètres, appels, groupes avancés et espace admin ne sont pas créées ici : tu pourras les coder séparément.
- La création réelle de la base Firestore, l'activation d'Authentication et la publication des règles doivent être faites par le propriétaire du projet dans Firebase Console. Un ZIP ne peut pas effectuer ces actions dans ton compte.
