import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDEfvl8CZSNNsNPldFLGJUyQbYdGbyLwyk",
  authDomain: "shortner-852c7.firebaseapp.com",
  projectId: "shortner-852c7",
  storageBucket: "shortner-852c7.firebasestorage.app",
  messagingSenderId: "680331874702",
  appId: "1:680331874702:web:a04e13bc6e5479aa7e54df",
  measurementId: "G-T3R29902Q9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);