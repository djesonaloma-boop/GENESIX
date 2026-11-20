// GENESIX - backend/routes.js - TOUTES LES ROUTES API
const express = require('express');
const router = express.Router();
const { db, auth } = require('./firebase');

function genCode() { return Math.floor(100000 + Math.random() * 900000).toString(); }

router.get('/health', (req, res) => res.json({ status: 'OK', app: 'GENESIX', time: new Date().toISOString() }));

// REGISTER
router.post('/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, birthDate, gender, country, city, phone } = req.body;
    if (!email || !password || !username) return res.status(400).json({ success: false, message: 'Champs manquants' });
    const snap = await db.ref('usernames/' + username.toLowerCase()).once('value');
    if (snap.exists()) return res.status(400).json({ success: false, message: 'Pseudo déjà pris' });
    const userRecord = await auth.createUser({ email, password, displayName: firstName + ' ' + lastName });
    const code = genCode();
    await db.ref('users/' + userRecord.uid).set({
      uid: userRecord.uid, firstName, lastName, username, fullName: firstName + ' ' + lastName,
      email, phone, birthDate, gender, country, city,
      photoURL: '', bio: '', followers: 0, following: 0, postsCount: 0,
      verified: false, verificationCode: code, verificationExpires: Date.now() + 15*60*1000,
      online: false, lastSeen: Date.now(), createdAt: new Date().toISOString()
    });
    await db.ref('usernames/' + username.toLowerCase()).set(userRecord.uid);
    res.json({ success: true, uid: userRecord.uid, code });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// VERIFY CODE
router.post('/auth/verify-code', async (req, res) => {
  try {
    const { uid, code } = req.body;
    const snap = await db.ref('users/' + uid).once('value');
    const u = snap.val();
    if (!u) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    if (u.verificationCode !== String(code)) return res.status(400).json({ success: false, message: 'Code incorrect' });
    await db.ref('users/' + uid).update({ verified: true, verificationCode: null });
    res.json({ success: true, message: 'Vérifié ✅' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// USERS
router.get('/users', async (req, res) => {
  const snap = await db.ref('users').once('value');
  const data = snap.val() || {};
  res.json({ success: true, users: Object.values(data) });
});
router.get('/users/:uid', async (req, res) => {
  const snap = await db.ref('users/' + req.params.uid).once('value');
  if (!snap.exists()) return res.status(404).json({ success: false, message: 'Introuvable' });
  res.json({ success: true, user: snap.val() });
});
router.put('/users/:uid', async (req, res) => {
  await db.ref('users/' + req.params.uid).update(req.body);
  res.json({ success: true });
});

// CONVERSATIONS
router.get('/conversations/:uid', async (req, res) => {
  const snap = await db.ref('conversations').once('value');
  const data = snap.val() || {};
  const list = Object.entries(data).filter(([id,c]) => c.members && c.members[req.params.uid]).map(([id,c]) => ({ id, ...c }));
  list.sort((a,b) => (b.time||0)-(a.time||0));
  res.json({ success: true, conversations: list });
});
router.post('/conversations', async (req, res) => {
  const { members, type='private', name='', photo='' } = req.body;
  const membersObj = {}; members.forEach(m => membersObj[m]=true);
  const ref = db.ref('conversations').push();
  await ref.set({ members: membersObj, type, name, photo, lastMessage:'', time: Date.now(), createdAt: Date.now(), unread:{} });
  res.json({ success: true, conversationId: ref.key });
});

// MESSAGES
router.get('/messages/:id', async (req, res) => {
  const snap = await db.ref('messages/' + req.params.id).once('value');
  const data = snap.val() || {};
  const list = Object.entries(data).map(([id,m]) => ({ id, ...m }));
  list.sort((a,b) => (a.time||0)-(b.time||0));
  res.json({ success: true, messages: list });
});
router.post('/messages', async (req, res) => {
  const { conversationId, senderId, text='', type='text' } = req.body;
  const ref = db.ref('messages/' + conversationId).push();
  await ref.set({ senderId, text, type, time: Date.now(), seen:false });
  const conv = (await db.ref('conversations/' + conversationId).once('value')).val() || {};
  const unread = conv.unread || {};
  Object.keys(conv.members||{}).forEach(uid => { if(uid!==senderId) unread[uid]=(unread[uid]||0)+1; });
  await db.ref('conversations/' + conversationId).update({ lastMessage: text, time: Date.now(), unread });
  res.json({ success: true, messageId: ref.key });
});

module.exports = router;
