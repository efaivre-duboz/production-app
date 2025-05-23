import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier d'abord le mode bypass (développement)
        if (localStorage.getItem('authBypass') === 'true') {
          setCurrentUser({
            name: 'Utilisateur Test',
            role: localStorage.getItem('userRole') || 'user'
          });
          setLoading(false);
          return;
        }

        // Vérifier s'il y a un token
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await AuthService.getProfile();
            setCurrentUser(response.user);
          } catch (err) {
            console.error('Token invalide:', err);
            // Nettoyer le token invalide
            localStorage.removeItem('token');
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'authentification:', err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Connexion
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await AuthService.login(username, password);
      setCurrentUser(response.user);
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      setError(
        error.response?.data?.message || 
        'Une erreur est survenue lors de la connexion'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  // Mode temporaire pour le développement - Bypass de l'authentification
  const bypassAuth = (role = 'user') => {
    setCurrentUser({ 
      name: 'Utilisateur Test',
      role: role
    });
    localStorage.setItem('authBypass', 'true');
    localStorage.setItem('userRole', role);
  };

  // Mode admin pour le développement
  const bypassAuthAsAdmin = () => {
    bypassAuth('admin');
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    error,
    login,
    logout,
    bypassAuth,
    bypassAuthAsAdmin,
    hasRole: (role) => currentUser?.role === role || localStorage.getItem('userRole') === role
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;