import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const loadUser = async () => {
      console.log('[AUTH_CTX] Checking for saved rider session...');
      try {
        const storedUser = await AsyncStorage.getItem('ktm_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log(`[AUTH_CTX] ✅ Found session for: ${parsedUser.user.name}`);
          setUser(parsedUser);
        } else {
          console.log('[AUTH_CTX] ℹ️ No session found. Redirecting to Login.');
        }
      } catch (err) {
        console.error('[AUTH_CTX] ❌ Error reading storage:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    console.log(`[AUTH_CTX] 🔑 Logging in user: ${userData.user.name}`);
    await AsyncStorage.setItem('ktm_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    console.log('[AUTH_CTX] 🚪 Logging out...');
    await AsyncStorage.removeItem('ktm_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
