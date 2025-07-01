import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    configureGoogleSignIn();
    
    // 監聽 Firebase 認證狀態變化
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // 用戶已登入
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '使用者',
        };
        
        setUser(userData);
      } else {
        // 用戶未登入
        setUser(null);
      }
      
      if (isLoading) {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, [isLoading]);

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      iosClientId: '391242174728-42buasphe2ubrak9i4p14db541sglq3o.apps.googleusercontent.com',
      webClientId: '391242174728-78o34qg3oij1qjp442c63ulej0c7ueg7.apps.googleusercontent.com',
    })
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      const signInResult = await GoogleSignin.signIn();
      let idToken = signInResult.data?.idToken;

      if (!idToken) {
        // if you are using older versions of google-signin, try old style result
        idToken = signInResult.idToken;
      }
      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      if (userCredential.user) {
        // 儲存或更新用戶資料到 Firestore
        await saveUserToFirestore(userCredential.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google 登入錯誤:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('登出錯誤:', error);
    }
  };

  const saveUserToFirestore = async (firebaseUser: any) => {
    try {
      const userRef = firestore().collection('users').doc(firebaseUser.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists()) {
        await userRef.set({
          userId: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || '使用者',
          photoURL: firebaseUser.photoURL || null,
          createdAt: firestore.FieldValue.serverTimestamp(),
          lastLoginAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // 現有用戶：不更新 createdAt
        await userRef.set({
          userId: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || '使用者',
          photoURL: firebaseUser.photoURL || null,
          lastLoginAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }
    } catch (error) {
      console.error('儲存用戶資料失敗:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loginWithGoogle,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};