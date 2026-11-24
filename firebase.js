// Configuration Firebase Web GENESIX
// Cette configuration est publique côté navigateur. Les règles Firebase protègent les données.
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged, signOut, updateProfile, sendPasswordResetEmail } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, where, orderBy, onSnapshot, getDocs,
  addDoc, doc, updateDoc, getDoc, setDoc, increment, serverTimestamp,
  runTransaction, deleteDoc } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyA24pBo8mBWiZssPtep--MMBdB7c8_Lu4U",
  authDomain: "starlink-investit.firebaseapp.com",
  databaseURL: "https://starlink-investit-default-rtdb.firebaseio.com",
  projectId: "starlink-investit",
  storageBucket: "starlink-investit.firebasestorage.app",
  messagingSenderId: "807081599583",
  appId: "1:807081599583:web:e00ec3959bc4acdae031ea"
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged, signOut, updateProfile, sendPasswordResetEmail,
  collection, query, where, orderBy, onSnapshot, getDocs, addDoc,
  doc, updateDoc, getDoc, setDoc, increment, serverTimestamp,
  runTransaction, deleteDoc
};
