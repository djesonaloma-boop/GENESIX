// GENESIX - backend/app.js
// Application Express + Routes API
const express = require('express');
const cors = require('cors');
const { getDB, getAuth } = require('./firebase');
const nodemailer = require('nodemailer');
const config = require('./admin-config');

const app = express();

app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json({ limit: '10mb' }));

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: config.EMAIL.USER, pass: config.EMAIL.PASS }
  });
}

// --- ROUTE TEST ---
app.get('/', (req, res) => {
  res.json({ success: true, message: 'GENESIX API en ligne ✅', version: '1.0.0', author: 'Jason Aloma 🇨🇩' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// --- AUTH : REGISTER ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, birthDate, gender, country, city, phone } = req.body;
    if (!email || !password || !username) return res.status(400).json({ success: false, message: 'Champs manquants' });

    const auth = getAuth();
    const db = getDB();

    const snap = await db.ref('usernames/' + username.toLowerCase()).once('value');
    if (snap.exists()) return res.status(400).json({ success: false, message: 'Pseudonyme déjà pris' });

    const userRecord = await auth.createUser({ email, password, displayName: firstName + ' ' + lastName });
    const code = genCode();

    await db.ref('users/' + userRecord.uid).set({
      uid: userRecord.uid, firstName, lastName, username, username_lower: username.toLowerCase(),
      fullName: firstName + ' ' + lastName, birthDate, gender, country, city, email, phone,
      photoURL: '', bio: '', followers: 0, following: 0, postsCount: 0,
      verified: false, verificationCode: code,
      verificationExpires: Date.now() + 15 * 60 * 1000,
      online: false, lastSeen: Date.now(), createdAt: new Date().toISOString()
    });
    await db.ref('usernames/' + username.toLowerCase()).set(userRecord.uid);

    // Envoyer email
    try {
      await getTransporter().sendMail({
        from: config.EMAIL.FROM, to: email,
        subject: 'Ton code GENESIX : ' + code,
        html: `<div style="font-family:Arial;text-align:center;padding:30px"><h1 style="color:#7c5cff">GENESIX</h1><p>Bonjour ${firstName},</p><h1 style="font-size:40px;letter-spacing:8px;color:#12d6b4">${code}</h1><p>Expire dans 15 minutes.</p></div>`
      });
    } catch (e) { console.log('Email non envoyé:', e.message); }

    res.json({ success: true, message: 'Compte créé', uid: userRecord.uid, code });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// --- AUTH : VERIFY CODE ---
app.post('/api/auth/verify-code', async (req, res) => {
  try {
    const { uid, code } = req.body;
    const db = getDB();
    const snap = await db.ref('users/' + uid).once('value');
    const user = snap.val();
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    if (user.verificationCode !== String(code)) return res.status(400).json({ success: false, message: 'Code incorrect' });
    if (Date.now() > user.verificationExpires) return res.status(400).json({ success: false, message: 'Code expiré' });
    await db.ref('users/' + uid).update({ verified: true, emailVerified: true, verificationCode: null });
    res.json({ success: true, message: 'Compte vérifié ✅' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// --- AUTH : RESEND CODE ---
app.post('/api/auth/resend-code', async (req, res) => {
  try {
    const { uid } = req.body;
    const db = getDB();
    const code = genCode();
    await db.ref('users/' + uid).update({ verificationCode: code, verificationExpires: Date.now() + 15 * 60 * 1000 });
    const snap = await db.ref('users/' + uid).once('value');
    const user = snap.val();
    if (user?.email) {
      try { await getTransporter().sendMail({ from: config.EMAIL.FROM, to: user.email, subject: 'Nouveau code GENESIX : ' + code, html: `<h1>${code}</h1>` }); } catch (e) {}
    }
    res.json({ success: true, message: 'Nouveau code envoyé', code });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// --- USERS ---
app.get('/api/users', async (req, res) => {
  try {
    const db = getDB();
    const snap = await db.ref('users').once('value');
    const data = snap.val() || {};
    const users = Object.values(data).map(u => ({ uid: u.uid, username: u.username, fullName: u.fullName, firstName: u.firstName, lastName: u.lastName, photoURL: u.photoURL || '', bio: u.bio || '', country: u.country, city: u.city, online: u.online || false, lastSeen: u.lastSeen }));
    res.json({ success: true, count: users.length, users });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('/api/users/:uid', async (req, res) => {
  try {
    const db = getDB();
    const snap = await db.ref('users/' + req.params.uid).once('value');
    if (!snap.exists()) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    res.json({ success: true, user: snap.val() });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.put('/api/users/:uid', async (req, res) => {
  try {
    const db = getDB();
    await db.ref('users/' + req.params.uid).update(req.body);
    res.json({ success: true, message: 'Profil mis à jour' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// --- CONVERSATIONS ---
app.get('/api/conversations/:uid', async (req, res) => {
  try {
    const db = getDB();
    const snap = await db.ref('conversations').once('value');
    const data = snap.val() || {};
    const list = Object.entries(data).filter(([id, c]) => c.members && c.members[req.params.uid]).map(([id, c]) => ({ id, ...c }));
    list.sort((a, b) => (b.time || 0) - (a.time || 0));
    res.json({ success: true, count: list.length, conversations: list });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/conversations', async (req, res) => {
  try {
    const { members, type = 'private', name = '', photo = '' } = req.body;
    if (!members || members.length < 2) return res.status(400).json({ success: false, message: '2 membres minimum' });
    const db = getDB();
    if (type === 'private') {
      const snap = await db.ref('conversations').once('value');
      const data = snap.val() || {};
      for (const [id, c] of Object.entries(data)) {
        if (c.type === 'private' && c.members && c.members[members[0]] && c.members[members[1]] && Object.keys(c.members).length === 2) {
          return res.json({ success: true, conversationId: id, exists: true });
        }
      }
    }
    const membersObj = {};
    members.forEach(m => membersObj[m] = true);
    const newRef = db.ref('conversations').push();
    await newRef.set({ members: membersObj, type, name, photo, lastMessage: '', time: Date.now(), createdAt: Date.now(), unread: {} });
    res.json({ success: true, conversationId: newRef.key });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// --- MESSAGES ---
app.get('/api/messages/:conversationId', async (req, res) => {
  try {
    const db = getDB();
    const snap = await db.ref('messages/' + req.params.conversationId).once('value');
    const data = snap.val() || {};
    const messages = Object.entries(data).map(([id, m]) => ({ id, ...m }));
    messages.sort((a, b) => (a.time || 0) - (b.time || 0));
    res.json({ success: true, count: messages.length, messages });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { conversationId, senderId, text = '', type = 'text', imageUrl = '' } = req.body;
    if (!conversationId || !senderId) return res.status(400).json({ success: false, message: 'Champs manquants' });
    const db = getDB();
    const newRef = db.ref('messages/' + conversationId).push();
    const msg = { senderId, text, type, imageUrl, time: Date.now(), seen: false };
    await newRef.set(msg);
    const convSnap = await db.ref('conversations/' + conversationId).once('value');
    const conv = convSnap.val() || {};
    const unread = conv.unread || {};
    Object.keys(conv.members || {}).forEach(uid => { if (uid !== senderId) unread[uid] = (unread[uid] || 0) + 1; });
    await db.ref('conversations/' + conversationId).update({ lastMessage: text || (type === 'image' ? '📷 Photo' : 'Message'), time: Date.now(), unread });
    res.json({ success: true, messageId: newRef.key, message: msg });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Route introuvable' }));

module.exports = app;
