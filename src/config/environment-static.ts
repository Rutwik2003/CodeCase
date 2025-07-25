// Simple environment configuration for static hosting
export const environment = {
  // App Configuration
  app: {
    name: 'CodeCase Detective Academy',
    description: 'Learn HTML & CSS by solving detective mysteries in India',
    version: '1.0.0',
    country: 'IN',
    timezone: 'Asia/Kolkata',
    language: 'en-IN',
    currency: 'INR',
    url: 'https://codecase.appwrite.network',
  },

  // Appwrite Configuration
  appwrite: {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: '68839182000e7f7bc644',
    databaseId: 'codecase-db',
    usersCollectionId: 'users',
    achievementsCollectionId: 'achievements',
    progressCollectionId: 'progress',
    referralsCollectionId: 'referrals',
    storageBucketId: 'assets',
  },

  // Firebase Configuration
  firebase: {
    apiKey: 'AIzaSyADaTIt-LtRo3NQNxVskWOj5412B0VvA9U',
    authDomain: 'codebuster-82940.firebaseapp.com',
    projectId: 'codebuster-82940',
    storageBucket: 'codebuster-82940.firebasestorage.app',
    messagingSenderId: '723934530435',
    appId: '1:723934530435:web:7e36ac09290873e5b5c4b6',
  },

  // Analytics & Features
  analytics: {
    id: '',
  },
  
  // Security
  security: {
    jwtSecret: 'codecase_jwt_secret_2025_secure_key_min_32_chars',
  }
};
