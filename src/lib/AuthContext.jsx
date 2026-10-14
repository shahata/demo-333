import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch((err) => {
        if (err?.status === 403 && err?.data?.extra_data?.reason === 'user_not_registered') {
          setAuthError({ type: 'user_not_registered' });
        }
        setUser(null);
      })
      .finally(() => setIsLoadingAuth(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoadingAuth, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};