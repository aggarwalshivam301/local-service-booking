const admin = require('firebase-admin');

let db, bucket;

try {
  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './config/local-service-booking-f0034-firebase-adminsdk-fbsvc-0796c84c8e.json';

  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });

  db = admin.firestore();
  bucket = admin.storage().bucket();

  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.warn(
    '⚠️ Firebase not initialized:',
    error.message,
    '\nNote: Firebase features will be disabled in development.'
  );
}

module.exports = { admin, db, bucket };
