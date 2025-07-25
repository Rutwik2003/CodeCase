// Firebase Auth Test
import { auth } from './src/config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

console.log('🔥 Firebase Auth Test Starting...');
console.log('Auth object:', auth);
console.log('Auth config:', auth.config);

// Test user registration
const testEmail = 'test@example.com';
const testPassword = 'test123456';

console.log('Testing Firebase Authentication...');

// Try to register a user
createUserWithEmailAndPassword(auth, testEmail, testPassword)
  .then((userCredential) => {
    console.log('✅ User registered successfully:', userCredential.user);
  })
  .catch((error) => {
    console.error('❌ Registration error:', error.code, error.message);
    
    // If user already exists, try to login
    if (error.code === 'auth/email-already-in-use') {
      console.log('🔄 User exists, trying to login...');
      return signInWithEmailAndPassword(auth, testEmail, testPassword);
    }
  })
  .then((userCredential) => {
    if (userCredential) {
      console.log('✅ Login successful:', userCredential.user);
    }
  })
  .catch((loginError) => {
    console.error('❌ Login error:', loginError.code, loginError.message);
  });
