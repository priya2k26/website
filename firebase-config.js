import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update, push, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDRO11Aqp44jhOAgNWGHWg5WEdHE36VMM",
  authDomain: "order-management-e614d.firebaseapp.com",
  databaseURL: "https://order-management-e614d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "order-management-e614d",
  storageBucket: "order-management-e614d.firebasestorage.app",
  messagingSenderId: "152601790584",
  appId: "1:152601790584:web:e6337a56d52cba933a058d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Make Firebase available globally so standard scripts can use it
window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseAuth = auth;
window.firebaseSignIn = signInWithEmailAndPassword;
window.firebaseSignUp = createUserWithEmailAndPassword;
window.firebaseSignOut = signOut;
window.firebaseGoogleProvider = googleProvider;
window.firebaseSignInWithPopup = signInWithPopup;

// Database functions
window.dbRef = ref;
window.dbSet = set;
window.dbOnValue = onValue;
window.dbUpdate = update;
window.dbPush = push;
window.dbRemove = remove;

export { app, db, auth };
