import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthReady: boolean;
  hasCompletedOnboarding: boolean | null;
  checkOnboardingStatus: (uid?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthReady: false,
  hasCompletedOnboarding: null,
  checkOnboardingStatus: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  const checkOnboardingStatus = async (uid?: string) => {
    const userId = uid || user?.uid;
    if (!userId) {
      setHasCompletedOnboarding(null);
      return;
    }
    try {
      const profileRef = doc(db, 'careerProfiles', userId);
      const profileSnap = await getDoc(profileRef);
      setHasCompletedOnboarding(profileSnap.exists());
    } catch (error) {
      console.error("Error checking onboarding status", error);
      setHasCompletedOnboarding(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Ensure user document exists in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          try {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              createdAt: new Date().toISOString()
            });
          } catch (error) {
            console.error("Error creating user document", error);
          }
        }

        // Check onboarding status
        await checkOnboardingStatus(currentUser.uid);
      } else {
        setHasCompletedOnboarding(null);
      }
      
      setLoading(false);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthReady, hasCompletedOnboarding, checkOnboardingStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
