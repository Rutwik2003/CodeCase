import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { auth, db, analytics } from '../config/firebase';

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  level: number;
  hints: number;
  completedCases: string[];
  unlockedCases: string[];
  totalPoints: number;
  achievements: string[];
  evidence: Evidence[];
  profilePictureUrl?: string;
  preferences: UserPreferences;
  statistics: UserStatistics;
  createdAt: Date;
  lastLogin: Date;
  referralCode: string;
  referralStats: ReferralStats;
  referredBy?: string;
  // Daily login streak fields
  loginStreak?: number;
  lastLoginStreak?: Date | Timestamp;
  lastClaimDate?: Date | Timestamp;
}

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalRewards: number;
  referralHistory: ReferralEntry[];
}

interface ReferralEntry {
  id: string;
  referredUserId: string;
  referredUserEmail: string;
  status: 'pending' | 'completed' | 'expired';
  referredAt: Date;
  completedAt?: Date;
  rewardsPaid: boolean;
  pointsEarned: number;
  hintsEarned: number;
}

interface Evidence {
  id: string;
  caseId: string;
  title: string;
  description: string;
  type: 'code' | 'document' | 'image' | 'clue';
  content: string;
  discoveredAt: Date;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  notifications: boolean;
  soundEffects: boolean;
  language: string;
}

interface UserStatistics {
  totalCasesStarted: number;
  totalCasesCompleted: number;
  totalTimeSpent: number;
  averageCaseTime: number;
  hintsUsed: number;
  currentStreak: number;
  bestStreak: number;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, referralCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (updates: Partial<UserData>) => Promise<void>;
  refreshUserData: () => Promise<void>;
  addEvidence: (evidence: Omit<Evidence, 'id' | 'discoveredAt'>) => Promise<void>;
  completeCase: (caseId: string, points: number, timeSpent: number) => Promise<{pointsAwarded: number, isRepeat: boolean}>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  resetAllUserAchievements: () => Promise<{ success: boolean; updatedUsers: number } | undefined>;
  processReferral: (referralCode: string) => Promise<{ success: boolean; message: string }>;
  updateReferralStats: (userId: string, updates: Partial<ReferralStats>) => Promise<void>;
  generateReferralCode: (uid: string) => string;
  applyReferralCodeToExistingUser: (referralCode: string) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data from Firestore
  const loadUserData = async (user: User) => {
    try {
      console.log('📥 Loading user data from Firestore for:', user.uid);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        console.log('📄 User document found');
        const data = userDoc.data() as UserData;
        // Update last login
        console.log('⏰ Updating last login timestamp...');
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date()
        });
        console.log('✅ User data loaded and last login updated');
        setUserData({ ...data, lastLogin: new Date() });
      } else {
        console.log('❌ No user document found in Firestore for:', user.uid);
      }
    } catch (error) {
      console.error('❌ Error loading user data:', error);
    }
  };

  // Generate referral code
  const generateReferralCode = (uid: string): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const baseCode = uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    for (let i = 0; i < 6; i++) {
      if (i < baseCode.length) {
        result += baseCode[i];
      } else {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    return result;
  };

  // Create initial user data in Firestore
  const createUserData = async (user: User, displayName: string, referralCode?: string) => {
    console.log('📝 Starting createUserData...');
    console.log('👤 User UID:', user.uid);
    console.log('📧 User Email:', user.email);
    console.log('🏷️ Display Name:', displayName);
    console.log('🎫 Referral Code:', referralCode);
    
    const userReferralCode = generateReferralCode(user.uid);
    console.log('🎯 Generated referral code:', userReferralCode);
    
    const initialUserData: UserData = {
      uid: user.uid,
      email: user.email || '',
      displayName,
      level: 1,
      hints: referralCode ? 3 : 2, // Extra hint if referred by someone
      completedCases: [],
      unlockedCases: ['case-vanishing-blogger'], // First case always unlocked
      totalPoints: referralCode ? 700 : 500, // Bonus points if referred
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
      createdAt: new Date(),
      lastLogin: new Date(),
      referralCode: userReferralCode,
      referralStats: {
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
        totalRewards: 0,
        referralHistory: []
      },
      referredBy: referralCode
    };

    try {
      console.log('💾 Saving user data to Firestore...');
      console.log('📄 Document path: users/' + user.uid);
      console.log('📊 Data to save:', JSON.stringify(initialUserData, null, 2));
      
      await setDoc(doc(db, 'users', user.uid), initialUserData);
      console.log('✅ User data saved successfully');
      setUserData(initialUserData);
      console.log('✅ UserData state updated');
    } catch (error) {
      console.error('❌ Error creating user data:', error);
      console.error('❌ Error code:', (error as any).code);
      console.error('❌ Error message:', (error as any).message);
      
      // Check if it's a permissions error
      if ((error as any).code === 'permission-denied') {
        console.error('🚫 Firestore permission denied - check security rules');
      }
      
      // Check if it's a network error
      if ((error as any).code === 'unavailable') {
        console.error('🌐 Firestore unavailable - check network connection');
      }
      
      throw error; // Re-throw so the parent function knows it failed
    }
  };

  // Process referral code during registration
  const processReferral = async (referralCode: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🔍 Processing referral code:', referralCode);
      
      // Basic validation
      if (!referralCode || referralCode.length !== 6) {
        return { success: false, message: 'Referral code must be 6 characters long' };
      }

      // Find the user with this referral code
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('referralCode', '==', referralCode.toUpperCase()));
      
      console.log('🔍 Querying database for referral code...');
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('❌ No user found with referral code:', referralCode);
        return { success: false, message: 'Invalid referral code - no user found with this code' };
      }

      const referrerDoc = querySnapshot.docs[0];
      const referrerData = referrerDoc.data() as UserData;
      
      console.log('✅ Found referrer:', referrerData.displayName);
      
      return { success: true, message: `Valid referral code from ${referrerData.displayName}` };
    } catch (error: any) {
      console.error('❌ Error processing referral:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'permission-denied') {
        return { 
          success: false, 
          message: 'Database permissions issue - please try again or contact support' 
        };
      }
      
      if (error.code === 'unavailable') {
        return { 
          success: false, 
          message: 'Database temporarily unavailable - please try again' 
        };
      }
      
      return { success: false, message: 'Unable to validate referral code - please try again' };
    }
  };

  // Apply referral code to existing user
  const applyReferralCodeToExistingUser = async (referralCode: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🔍 Applying referral code to existing user:', referralCode);
      
      if (!currentUser || !userData) {
        return { success: false, message: 'User not authenticated' };
      }

      // Check if user already has a referral code applied
      if (userData.referredBy) {
        return { success: false, message: 'You have already used a referral code' };
      }

      // Validate referral code format
      if (!referralCode || referralCode.length !== 6) {
        return { success: false, message: 'Referral code must be 6 characters long' };
      }

      const normalizedCode = referralCode.trim().toUpperCase();

      // Check if user is trying to use their own referral code
      if (userData.referralCode === normalizedCode) {
        return { success: false, message: 'You cannot use your own referral code' };
      }

      // Find the user with this referral code
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('referralCode', '==', normalizedCode));
      
      console.log('🔍 Searching for referrer in database...');
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('❌ No user found with referral code:', normalizedCode);
        return { success: false, message: 'Invalid referral code - no user found with this code' };
      }

      const referrerDoc = querySnapshot.docs[0];
      const referrerData = referrerDoc.data() as UserData;
      const referrerId = referrerDoc.id;

      console.log('✅ Found referrer:', referrerData.displayName);

      // Apply referral rewards to current user
      const newUserData = {
        ...userData,
        referredBy: normalizedCode,
        totalPoints: (userData.totalPoints || 0) + 200,
        hints: (userData.hints || 0) + 1
      };

      // Create referral entry for referrer
      const newReferralEntry: ReferralEntry = {
        id: `ref_${Date.now()}`,
        referredUserId: currentUser.uid,
        referredUserEmail: userData.email,
        status: 'completed',
        referredAt: new Date(),
        completedAt: new Date(),
        rewardsPaid: true,
        pointsEarned: 100,
        hintsEarned: 1
      };

      // Update referrer's stats
      const updatedReferrerStats = {
        ...referrerData.referralStats,
        totalReferrals: (referrerData.referralStats.totalReferrals || 0) + 1,
        successfulReferrals: (referrerData.referralStats.successfulReferrals || 0) + 1,
        totalRewards: (referrerData.referralStats.totalRewards || 0) + 100,
        referralHistory: [...(referrerData.referralStats.referralHistory || []), newReferralEntry]
      };

      // Update both users in Firestore
      const currentUserRef = doc(db, 'users', currentUser.uid);
      const referrerRef = doc(db, 'users', referrerId);

      console.log('💾 Updating user data in database...');

      await updateDoc(currentUserRef, {
        referredBy: normalizedCode,
        totalPoints: newUserData.totalPoints,
        hints: newUserData.hints
      });

      await updateDoc(referrerRef, {
        'referralStats': updatedReferrerStats,
        totalPoints: (referrerData.totalPoints || 0) + 100,
        hints: (referrerData.hints || 0) + 1
      });

      // Update local state
      setUserData(newUserData);

      console.log('✅ Referral applied successfully!');

      return { 
        success: true, 
        message: `Referral applied! You received 200 points and 1 hint. ${referrerData.displayName} also received rewards!` 
      };
    } catch (error: any) {
      console.error('❌ Error applying referral code:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'permission-denied') {
        return { 
          success: false, 
          message: 'Database permissions issue - please try signing out and back in, then try again' 
        };
      }
      
      if (error.code === 'unavailable') {
        return { 
          success: false, 
          message: 'Database temporarily unavailable - please try again in a moment' 
        };
      }
      
      if (error.code === 'not-found') {
        return { 
          success: false, 
          message: 'User data not found - please try refreshing the page' 
        };
      }
      
      return { success: false, message: 'Unable to apply referral code - please try again later' };
    }
  };

  // Update referral stats
  const updateReferralStats = async (userId: string, updates: Partial<ReferralStats>) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { referralStats: updates });
    } catch (error) {
      console.error('Error updating referral stats:', error);
    }
  };

  // Register new user
  const register = async (email: string, password: string, displayName: string, referralCode?: string) => {
    try {
      console.log('🚀 Starting registration process...');
      console.log('📧 Email:', email);
      console.log('👤 Display Name:', displayName);
      console.log('🎫 Referral Code:', referralCode);
      
      let validReferral = false;
      let referrerData: UserData | null = null;

      // Validate referral code if provided
      if (referralCode) {
        console.log('🔍 Validating referral code...');
        const result = await processReferral(referralCode);
        console.log('🎯 Referral validation result:', result);
        if (result.success) {
          validReferral = true;
          // Get referrer data for rewards
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('referralCode', '==', referralCode.toUpperCase()));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const referrerDoc = querySnapshot.docs[0];
            referrerData = referrerDoc.data() as UserData;
            // Store the document ID for later use
            (referrerData as any)._docId = referrerDoc.id;
          }
        }
      }

      console.log('🔐 Creating Firebase user...');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase user created:', result.user.uid);
      
      console.log('📝 Updating user profile...');
      await updateProfile(result.user, { displayName });
      console.log('✅ Profile updated');
      
      console.log('💾 Creating user data in Firestore...');
      await createUserData(result.user, displayName, validReferral ? referralCode : undefined);
      console.log('✅ User data created in Firestore');
      
      // Process referral rewards if valid referral
      if (validReferral && referrerData) {
        try {
          console.log('🎯 Processing referral rewards for referrer...');
          
          // Update referrer's stats and give rewards
          const newReferralEntry: ReferralEntry = {
            id: `ref_${Date.now()}`,
            referredUserId: result.user.uid,
            referredUserEmail: email,
            status: 'completed',
            referredAt: new Date(),
            completedAt: new Date(),
            rewardsPaid: true,
            pointsEarned: 100,
            hintsEarned: 1
          };

          const updatedReferralStats: ReferralStats = {
            ...referrerData.referralStats,
            successfulReferrals: (referrerData.referralStats?.successfulReferrals || 0) + 1,
            totalReferrals: (referrerData.referralStats?.totalReferrals || 0) + 1,
            totalRewards: (referrerData.referralStats?.totalRewards || 0) + 100,
            referralHistory: [...(referrerData.referralStats?.referralHistory || []), newReferralEntry]
          };

          // Use the document ID we stored earlier
          const referrerDocId = (referrerData as any)._docId;
          console.log('💾 Updating referrer document:', referrerDocId);

          // Update referrer's data
          await updateDoc(doc(db, 'users', referrerDocId), {
            'referralStats': updatedReferralStats,
            'totalPoints': (referrerData.totalPoints || 0) + 100,
            'hints': (referrerData.hints || 0) + 1
          });
          
          console.log('✅ Referrer rewards updated successfully!');
        } catch (error) {
          console.error('Error processing referral rewards:', error);
        }
      }
      
      // Track registration event
      if (analytics) {
        logEvent(analytics, 'sign_up', {
          method: 'email',
          referred: validReferral
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting login process...');
      console.log('📧 Email:', email);
      
      console.log('🔍 Attempting Firebase authentication...');
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase login successful:', result.user.uid);
      
      // Track login event
      if (analytics) {
        logEvent(analytics, 'login', {
          method: 'email'
        });
      }
      console.log('✅ Login process completed successfully');
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Update user data
  const updateUserData = async (updates: Partial<UserData>) => {
    if (!currentUser || !userData) return;

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), updates);
      setUserData({ ...userData, ...updates });
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  // Refresh user data from Firebase
  const refreshUserData = async () => {
    if (!currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Add evidence to user's collection
  const addEvidence = async (evidence: Omit<Evidence, 'id' | 'discoveredAt'>) => {
    if (!currentUser || !userData) return;

    const newEvidence: Evidence = {
      ...evidence,
      id: `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      discoveredAt: new Date()
    };

    try {
      const updatedEvidence = [...(userData.evidence || []), newEvidence];
      await updateDoc(doc(db, 'users', currentUser.uid), {
        evidence: updatedEvidence
      });
      setUserData({ ...userData, evidence: updatedEvidence });
    } catch (error) {
      console.error('Error adding evidence:', error);
      throw error;
    }
  };

  // Complete a case with statistics tracking and evidence collection
  const completeCase = async (caseId: string, points: number, timeSpent: number): Promise<{pointsAwarded: number, isRepeat: boolean}> => {
    if (!currentUser || !userData) {
      return { pointsAwarded: 0, isRepeat: false };
    }

    try {
      // Check if this case has already been completed
      const alreadyCompleted = userData.completedCases.includes(caseId);
      
      // For tutorial case, only award points on first completion to prevent point grinding
      const isTutorialCase = caseId === 'case-vanishing-blogger';
      const shouldAwardPoints = !isTutorialCase || !alreadyCompleted;
      
      // Only add to completed cases if not already completed
      const newCompletedCases = alreadyCompleted 
        ? userData.completedCases 
        : [...userData.completedCases, caseId];
      
      // Only award points if it's the first completion (or not tutorial)
      const pointsToAward = shouldAwardPoints ? points : 0;
      const newTotalPoints = userData.totalPoints + pointsToAward;
      const newLevel = Math.floor(newTotalPoints / 1000) + 1;
      
      // Update statistics - only count as "completed" if it's first time or non-tutorial
      const shouldUpdateStats = !isTutorialCase || !alreadyCompleted;
      const updatedStatistics: UserStatistics = shouldUpdateStats ? {
        ...userData.statistics,
        totalCasesCompleted: userData.statistics.totalCasesCompleted + 1,
        totalTimeSpent: userData.statistics.totalTimeSpent + timeSpent,
        averageCaseTime: (userData.statistics.totalTimeSpent + timeSpent) / (userData.statistics.totalCasesCompleted + 1),
        currentStreak: userData.statistics.currentStreak + 1,
        bestStreak: Math.max(userData.statistics.bestStreak, userData.statistics.currentStreak + 1)
      } : {
        ...userData.statistics,
        totalTimeSpent: userData.statistics.totalTimeSpent + timeSpent,
        // Update average case time even for repeat tutorial plays
        averageCaseTime: userData.statistics.totalCasesCompleted > 0 
          ? (userData.statistics.totalTimeSpent + timeSpent) / userData.statistics.totalCasesCompleted
          : timeSpent
      };

      // Auto-generate evidence for completed case
      const caseEvidenceTemplates: Record<string, Omit<Evidence, 'id' | 'discoveredAt'>[]> = {
        'case-vanishing-blogger': [
          {
            caseId,
            title: 'Corrupted Blog HTML',
            description: 'Found broken HTML tags that were hiding Sam\'s last message',
            type: 'code',
            content: '<h2> tags were preventing proper display of the blog content',
            importance: 'high'
          },
          {
            caseId,
            title: 'Hidden CSS Clue',
            description: 'Discovered a secret message hidden in the CSS code',
            type: 'clue',
            content: 'Sam left breadcrumbs about checking backup files on old server',
            importance: 'critical'
          }
        ],
        'visual-vanishing-blogger': [
          {
            caseId,
            title: 'Rishi\'s Encrypted Notes',
            description: 'Found encrypted documents about suspicious Sherpa companies',
            type: 'document',
            content: 'Rishi\'s research revealed multiple fake Sherpa certification schemes targeting climbers',
            importance: 'critical'
          },
          {
            caseId,
            title: 'Hidden CSS Evidence',
            description: 'Discovered hidden HTML elements revealing the truth',
            type: 'code',
            content: 'CSS visibility properties were concealing crucial evidence about Rishi\'s whereabouts',
            importance: 'high'
          },
          {
            caseId,
            title: 'Phone Message Clue',  
            description: 'Decoded the final message from Rishi\'s device',
            type: 'clue',
            content: 'Rishi wasn\'t kidnapped - he went into hiding after exposing the corruption',
            importance: 'critical'
          }
        ],
        'case-social-media-stalker': [
          {
            caseId,
            title: 'Malicious Script Code',
            description: 'Found hidden JavaScript code used for tracking users',
            type: 'code',
            content: 'Tracking script embedded in profile pages',
            importance: 'critical'
          },
          {
            caseId,
            title: 'User Data Logs',
            description: 'Discovered logs of unauthorized data collection',
            type: 'document',
            content: 'Log files show systematic harvesting of personal information',
            importance: 'high'
          }
        ],
        'case-corporate-sabotage': [
          {
            caseId,
            title: 'Sabotaged Website Code',
            description: 'Identified malicious code injected into company website',
            type: 'code',
            content: 'Hidden CSS rules causing layout failures during presentation',
            importance: 'critical'
          },
          {
            caseId,
            title: 'Internal Email Trail',
            description: 'Corporate communications revealing the sabotage plot',
            type: 'document',
            content: 'Email evidence shows coordinated effort to undermine the company presentation',
            importance: 'high'
          }
        ],
        'case-dating-app-disaster': [
          {
            caseId,
            title: 'Profile Manipulation Code',
            description: 'Code used to alter user profiles and create fake matches',
            type: 'code',
            content: 'JavaScript functions for profile data manipulation',
            importance: 'critical'
          },
          {
            caseId,
            title: 'Fake Profile Database',
            description: 'Database of artificially created dating profiles',
            type: 'document',
            content: 'Systematic creation of fake profiles to manipulate user engagement',
            importance: 'high'
          }
        ],
        'case-ecommerce-fraud': [
          {
            caseId,
            title: 'Price Manipulation Script',
            description: 'Hidden code altering product prices at checkout',
            type: 'code',
            content: 'JavaScript code modifying DOM elements during payment process',
            importance: 'critical'
          },
          {
            caseId,
            title: 'Financial Transaction Logs',
            description: 'Evidence of fraudulent pricing modifications',
            type: 'document',
            content: 'Log files showing systematic price manipulation affecting customer payments',
            importance: 'critical'
          }
        ],
        'case-gaming-platform-hack': [
          {
            caseId,
            title: 'Exploit Code',
            description: 'Code used to exploit gaming platform vulnerabilities',
            type: 'code',
            content: 'CSS and JavaScript exploits for unauthorized access',
            importance: 'critical'
          },
          {
            caseId,
            title: 'Hack Methodology Document',
            description: 'Step-by-step guide used by hackers to breach the platform',
            type: 'document',
            content: 'Detailed instructions for exploiting CSS injection vulnerabilities in gaming platforms',
            importance: 'high'
          }
        ]
      };

      // Add evidence for this case - only on first completion to avoid duplicates
      const shouldAddEvidence = !alreadyCompleted;
      const caseEvidence = (shouldAddEvidence && caseEvidenceTemplates[caseId]) ? caseEvidenceTemplates[caseId] : [];
      const newEvidence: Evidence[] = caseEvidence.map((template, index) => ({
        ...template,
        id: `evidence-${caseId}-${index}-${Date.now()}`,
        discoveredAt: new Date()
      }));

      const updatedEvidence = [...(userData.evidence || []), ...newEvidence];

      const updates = {
        completedCases: newCompletedCases,
        totalPoints: newTotalPoints,
        level: newLevel,
        statistics: updatedStatistics,
        evidence: updatedEvidence
      };

      await updateDoc(doc(db, 'users', currentUser.uid), updates);
      setUserData({ ...userData, ...updates });
      
      // Track case completion event
      if (analytics) {
        logEvent(analytics, 'case_completed', {
          caseId,
          points: pointsToAward, // Log actual points awarded, not requested points
          originalPoints: points, // Log original points for reference
          timeSpent,
          level: newLevel,
          isRepeat: alreadyCompleted,
          isTutorial: isTutorialCase
        });
      }

      // Return information about the completion
      return {
        pointsAwarded: pointsToAward,
        isRepeat: alreadyCompleted
      };
    } catch (error) {
      console.error('Error completing case:', error);
      throw error;
    }
  };

  // Unlock achievement
  const unlockAchievement = async (achievementId: string) => {
    if (!currentUser || !userData) return;

    if (userData.achievements.includes(achievementId)) return;

    try {
      const newAchievements = [...userData.achievements, achievementId];
      await updateDoc(doc(db, 'users', currentUser.uid), {
        achievements: newAchievements
      });
      setUserData({ ...userData, achievements: newAchievements });
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
  };

  // Update user preferences
  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!currentUser || !userData) return;

    try {
      const updatedPreferences = { ...userData.preferences, ...preferences };
      await updateDoc(doc(db, 'users', currentUser.uid), {
        preferences: updatedPreferences
      });
      setUserData({ ...userData, preferences: updatedPreferences });
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    console.log('🔧 Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔔 Auth state changed:', user ? `User ${user.uid}` : 'No user');
      setCurrentUser(user);
      if (user) {
        console.log('👤 Loading user data for:', user.uid);
        await loadUserData(user);
      } else {
        console.log('🚪 User logged out, clearing data');
        setUserData(null);
      }
      setLoading(false);
      console.log('✅ Auth state update complete');
    });

    return unsubscribe;
  }, []);

  // Reset achievements for all users (Admin function)
  const resetAllUserAchievements = async () => {
    try {
      // Import additional Firestore functions for batch operations
      const { collection, getDocs, writeBatch } = await import('firebase/firestore');
      
      console.log('Starting achievement reset for all users...');
      
      // Get all user documents
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      
      if (usersSnapshot.empty) {
        console.log('No users found to reset achievements for');
        return;
      }

      // Create a batch to update all users at once
      const batch = writeBatch(db);
      let updateCount = 0;

      // Add each user update to the batch
      usersSnapshot.forEach((userDoc) => {
        batch.update(userDoc.ref, {
          achievements: []
        });
        updateCount++;
      });

      // Execute the batch
      await batch.commit();
      
      console.log(`Successfully reset achievements for ${updateCount} users`);
      
      // If the current user is logged in, update their local state too
      if (currentUser && userData) {
        setUserData({ ...userData, achievements: [] });
      }
      
      return { success: true, updatedUsers: updateCount };
      
    } catch (error) {
      console.error('Error resetting achievements for all users:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    login,
    register,
    logout,
    updateUserData,
    refreshUserData,
    addEvidence,
    completeCase,
    unlockAchievement,
    updatePreferences,
    resetAllUserAchievements,
    processReferral,
    updateReferralStats,
    generateReferralCode,
    applyReferralCodeToExistingUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
