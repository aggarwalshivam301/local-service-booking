import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, firebaseConfigured } from '../services/firebase';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const ensureFirebaseConfigured = () => {
    if (!firebaseConfigured || !auth) {
      const error = new Error('Firebase authentication is not configured. Add the REACT_APP_FIREBASE_* variables to the frontend environment.');
      toast.error(error.message);
      throw error;
    }
    return true;
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured || !auth) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user from backend
          const response = await api.get('/auth/profile');
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password, displayName, role) => {
    try {
      ensureFirebaseConfigured();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Register in backend
      const response = await api.post('/auth/register', {
        firebaseUid: firebaseUser.uid,
        email,
        displayName,
        role
      });

      setUser(response.data.user);
      toast.success('Registration successful!');
      return response.data.user;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      ensureFirebaseConfigured();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Login in backend
      const response = await api.post('/auth/login', {
        firebaseUid: firebaseUser.uid,
        email
      });

      setUser(response.data.user);
      toast.success('Login successful!');
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!firebaseConfigured || !auth) {
        setUser(null);
        return;
      }
      await firebaseSignOut(auth);
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      return response.data.user;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Update failed');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
