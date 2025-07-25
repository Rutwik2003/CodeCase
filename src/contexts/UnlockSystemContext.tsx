import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface UnlockSystemType {
  unlockedCases: string[];
  unlockCase: (caseId: string, cost: number) => Promise<boolean>;
  isLoading: boolean;
  canAfford: (cost: number) => boolean;
}

const UnlockSystemContext = createContext<UnlockSystemType | null>(null);

export const UnlockSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData, updateUserData } = useAuth();
  const [unlockedCases, setUnlockedCases] = useState<string[]>(['case-vanishing-blogger']);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's unlocked cases
  useEffect(() => {
    if (userData?.unlockedCases) {
      setUnlockedCases(userData.unlockedCases);
    } else {
      setUnlockedCases(['case-vanishing-blogger']); // First case always unlocked
    }
  }, [userData]);

  const canAfford = (cost: number): boolean => {
    return (userData?.totalPoints || 0) >= cost;
  };

  const unlockCase = async (caseId: string, cost: number): Promise<boolean> => {
    if (!userData) {
      console.error('No user data');
      return false;
    }

    if (userData.totalPoints < cost) {
      console.error('Insufficient points');
      return false;
    }

    if (unlockedCases.includes(caseId)) {
      console.log('Case already unlocked');
      return true;
    }

    setIsLoading(true);

    try {
      const newUnlockedCases = [...unlockedCases, caseId];
      const newTotalPoints = userData.totalPoints - cost;

      // Update Firebase
      if (userData.uid) {
        await updateDoc(doc(db, 'users', userData.uid), {
          unlockedCases: newUnlockedCases,
          totalPoints: newTotalPoints
        });
      }

      // Update local state
      updateUserData({
        unlockedCases: newUnlockedCases,
        totalPoints: newTotalPoints
      });

      setUnlockedCases(newUnlockedCases);
      
      console.log(`Unlocked case: ${caseId}`);
      return true;
    } catch (error) {
      console.error('Error unlocking case:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UnlockSystemContext.Provider value={{
      unlockedCases,
      unlockCase,
      isLoading,
      canAfford
    }}>
      {children}
    </UnlockSystemContext.Provider>
  );
};

export const useUnlockSystem = () => {
  const context = useContext(UnlockSystemContext);
  if (!context) {
    throw new Error('useUnlockSystem must be used within UnlockSystemProvider');
  }
  return context;
};
