import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

// Check if we are in Mock Mode (placeholder Firebase key)
const IS_MOCK_MODE = import.meta.env.VITE_FIREBASE_API_KEY === 'AIzaSyDemoKeyReplaceMeWithReal';

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- MOCK MODE HELPERS ---
  const mockUsers = {
    'admin@mak.co': { uid: 'mock-admin', email: 'admin@mak.co', name: 'Proprietor', role: 'admin', phone: '+91 0000000000' },
    'user@mak.co': { uid: 'mock-user', email: 'user@mak.co', name: 'Devotee', role: 'customer', phone: '+91 1111111111' }
  };

  async function signup(email, password, name, role = 'customer', phone = '') {
    if (IS_MOCK_MODE) {
      const newUser = { uid: `mock-${Date.now()}`, email, name, role, phone };
      localStorage.setItem('mock_user', JSON.stringify(newUser));
      setCurrentUser({ uid: newUser.uid, email: newUser.email });
      setUserRole(role);
      setUserData(newUser);
      return { user: newUser };
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', cred.user.uid), {
      name,
      email,
      role,
      phone,
      createdAt: new Date().toISOString(),
    });
    return cred;
  }

  async function login(email, password) {
    if (IS_MOCK_MODE) {
      if (password === 'password' && mockUsers[email]) {
        const user = mockUsers[email];
        localStorage.setItem('mock_user', JSON.stringify(user));
        setCurrentUser({ uid: user.uid, email: user.email });
        setUserRole(user.role);
        setUserData(user);
        return { user };
      } else if (password === 'password') {
        // Allow any login with 'password' in mock mode for ease of testing
        const user = { uid: 'mock-custom', email, name: 'Guest Devotee', role: 'customer' };
        localStorage.setItem('mock_user', JSON.stringify(user));
        setCurrentUser({ uid: user.uid, email: user.email });
        setUserRole(user.role);
        setUserData(user);
        return { user };
      }
      throw new Error('Invalid credentials (Try: password)');
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    if (IS_MOCK_MODE) {
      localStorage.removeItem('current_user');
      setCurrentUser(null);
      setUserRole(null);
      setUserData(null);
      return;
    }
    return signOut(auth);
  }

  useEffect(() => {
    if (IS_MOCK_MODE) {
      setLoading(true);
      const savedUser = localStorage.getItem('current_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser({ uid: user.uid, email: user.email });
        setUserRole(user.role);
        setUserData(user);
      }
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            setUserRole(snap.data().role);
            setUserData(snap.data());
          }
        } catch {
          setUserRole('customer');
          setUserData(null);
        }
      } else {
        setUserRole(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = {
    currentUser,
    userRole,
    userData,
    loading,
    signup,
    login,
    logout,
    isAdmin: userRole === 'admin',
    isMock: IS_MOCK_MODE
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
