import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// 🛑 Suppress the annoying generic Firebase Dynamic Links deprecation warning in the console.
// This warning is printed automatically by the Firebase SDK for everyone, even if you don't use the feature.
const originalConsoleWarn = console.warn;
console.warn = function (...args) {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('Firebase Dynamic Links')) {
        return; // Ignore this specific warning
    }
    originalConsoleWarn.apply(console, args);
};
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
