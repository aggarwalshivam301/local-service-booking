const admin = require('firebase-admin');

let db, bucket;

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (!serviceAccountPath) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH is required in production');
    }

    console.warn('⚠️ Firebase not initialized: FIREBASE_SERVICE_ACCOUNT_PATH is not configured');
  } else {
    const serviceAccount = require(serviceAccountPath);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
    }

    db = admin.firestore();
    bucket = admin.storage().bucket();

    console.log('✅ Firebase initialized successfully');
  }
} catch (error) {
  console.warn('⚠️ Firebase not initialized:', error.message);
}

module.exports = { admin, db, bucket };
