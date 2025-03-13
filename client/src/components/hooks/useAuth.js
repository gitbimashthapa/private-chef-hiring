// hooks/useAuth.js
import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getUserProfile } from '../services/apiService';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          // Check if token is expired
          const decodedToken = jwt_decode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token expired
            localStorage.removeItem('token');
            setUser(null);
          } else {
            // Valid token, get user profile
            const userProfile = await getUserProfile();
            setUser(userProfile);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to authenticate. Please log in again.');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiLogin(credentials);
      localStorage.setItem('token', response.token);
      
      // Get user profile after successful login
      const userProfile = await getUserProfile();
      setUser(userProfile);
      
      return userProfile;
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      await apiLogout();
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRegister(userData);
      localStorage.setItem('token', response.token);
      
      // Get user profile after successful registration
      const userProfile = await getUserProfile();
      setUser(userProfile);
      
      return userProfile;
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedProfile = await updateUserProfile(userData);
      setUser(updatedProfile);
      
      return updatedProfile;
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated: !!user
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;