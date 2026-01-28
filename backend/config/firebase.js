const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './config/serviceAccountKey.json';
  
  admin.initializeApp({
    credential: admin.credential.cert(require(path.resolve(serviceAccountPath))),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });

  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('⚠️ Firebase initialization warning:', error.message);
  console.log('Note: Firebase is optional for development');
}

module.exports = admin;
