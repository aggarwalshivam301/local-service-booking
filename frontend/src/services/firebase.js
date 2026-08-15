import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);
let app = null;
let auth = null;
let storage = null;

if (firebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
}

export { auth, storage, firebaseConfigured };
export default app;
