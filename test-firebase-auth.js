// Quick Firebase Authentication Test
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testRegistration() {
  try {
    console.log('🧪 Testing Firebase connection...');
    console.log('🔧 Firebase Config:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain
    });

    // Test user creation
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    const testDisplayName = 'Test User';

    console.log('👤 Creating test user:', testEmail);
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    const user = userCredential.user;
    console.log('✅ User created successfully:', user.uid);

    // Test Firestore document creation
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: testDisplayName,
      level: 1,
      hints: 2,
      completedCases: [],
      unlockedCases: ['case-vanishing-blogger'],
      totalPoints: 500,
      achievements: [],
      evidence: [],
      preferences: {
        theme: 'dark',
        notifications: true,
        soundEffects: true,
        language: 'en'
      },
      statistics: {
        totalCasesStarted: 0,
        totalCasesCompleted: 0,
        totalTimeSpent: 0,
        averageCaseTime: 0,
        hintsUsed: 0,
        currentStreak: 0,
        bestStreak: 0
      },
      createdAt: Timestamp.fromDate(new Date()),
      lastLogin: Timestamp.fromDate(new Date()),
      referralCode: 'TEST01',
      referralStats: {
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
        totalRewards: 0,
        referralHistory: []
      }
      // Note: No referredBy field - should work without it
    };

    console.log('💾 Creating Firestore document...');
    await setDoc(doc(db, 'users', user.uid), userData);
    console.log('✅ Firestore document created successfully');

    console.log('🧹 Cleaning up test user...');
    await user.delete();
    console.log('✅ Test user deleted');

    console.log('🎉 All tests passed! Firebase registration should work correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
}

testRegistration();
