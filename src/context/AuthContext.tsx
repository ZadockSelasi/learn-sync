import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthReady: boolean;
  userRole: 'admin' | 'user';
  userStatus: 'active' | 'suspended';
  hasCompletedOnboarding: boolean | null;
  checkOnboardingStatus: (uid?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthReady: false,
  userRole: 'user',
  userStatus: 'active',
  hasCompletedOnboarding: null,
  checkOnboardingStatus: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
  const [userStatus, setUserStatus] = useState<'active' | 'suspended'>('active');
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
            const userData = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: 'user', // Default role
              status: 'active', // Default status
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              loginMethod: currentUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email'
            };
            await setDoc(userRef, userData);
            setUserRole('user');
            setUserStatus('active');
          } catch (error) {
            console.error("Error creating user document", error);
          }
        } else {
          const data = userSnap.data();
          setUserRole(data.role || 'user');
          setUserStatus(data.status || 'active');
          
          // Update last login
          try {
            await setDoc(userRef, { 
              lastLogin: new Date().toISOString(),
              loginMethod: currentUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email'
            }, { merge: true });
          } catch (e) {
            console.error("Error updating last login", e);
          }
        }

        // Check onboarding status
        await checkOnboardingStatus(currentUser.uid);
      } else {
        setHasCompletedOnboarding(null);
        setUserRole('user');
        setUserStatus('active');
      }
      
      setLoading(false);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthReady, 
      userRole, 
      userStatus, 
      hasCompletedOnboarding, 
      checkOnboardingStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
