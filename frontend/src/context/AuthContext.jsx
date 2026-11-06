import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth';
import { usersApi } from '../api/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('blogitech_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('blogitech_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch full user profile if logged in
  const refreshProfile = useCallback(async () => {
    if (!token) {
      setUserProfile(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await usersApi.getProfile();
      if (res?.user) {
        setUserProfile(res.user);
        // keep basic user synchronized
        const updatedUser = {
          _id: res.user._id,
          username: res.user.username,
          email: res.user.email,
          role: res.user.role,
          accountLevel: res.user.accountLevel,
          profilePicture: res.user.profilePicture,
        };
        setUser(updatedUser);
        localStorage.setItem('blogitech_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.warn('Failed to refresh profile:', err);
      // If token expired or invalid (401), clean up
      if (err?.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      refreshProfile();
    } else {
      setIsLoading(false);
    }
  }, [token, refreshProfile]);

  const login = async (username, password) => {
    const data = await authApi.login({ username, password });
    if (data?.token) {
      localStorage.setItem('blogitech_token', data.token);
      setToken(data.token);

      const basicUser = {
        _id: data._id,
        username: data.username,
        email: data.email,
        role: data.role,
      };
      localStorage.setItem('blogitech_user', JSON.stringify(basicUser));
      setUser(basicUser);

      // fetch full populated profile
      try {
        const profileRes = await usersApi.getProfile();
        if (profileRes?.user) {
          setUserProfile(profileRes.user);
        }
      } catch (err) {
        console.warn('Initial profile load failed:', err);
      }
    }
    return data;
  };

  const register = async (username, email, password) => {
    return await authApi.register({ username, email, password });
  };

  const logout = () => {
    localStorage.removeItem('blogitech_token');
    localStorage.removeItem('blogitech_user');
    setToken(null);
    setUser(null);
    setUserProfile(null);
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        userProfile,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
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

export default AuthContext;
