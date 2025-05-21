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
      if (AuthService.isAuthenticated()) {
        try {
          // Si en mode bypass, créer un utilisateur fictif
          if (localStorage.getItem('authBypass') === 'true') {
            setCurrentUser({
              name: 'Utilisateur Test',
              role: localStorage.getItem('userRole') || 'user'
            });
          } else {
            // Sinon, essayer de récupérer le profil de l'utilisateur
            const response = await AuthService.getProfile();
            setCurrentUser(response.user);
          }
        } catch (err) {
          console.error('Erreur de session:', err);
          AuthService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Connexion
  const login = async (username, password) => {
    try {
      setError(null);
      console.log('Tentative de connexion avec:', { username, password });
      
      const response = await AuthService.login(username, password);
      setCurrentUser(response.user);
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      // Afficher plus de détails sur l'erreur
      if (error.response) {
        console.log('Données de réponse d\'erreur:', error.response.data);
        console.log('Statut de réponse d\'erreur:', error.response.status);
      } else if (error.request) {
        console.log('Requête sans réponse:', error.request);
      } else {
        console.log('Erreur de configuration:', error.message);
      }
      
      setError(
        error.response?.data?.message || 
        'Une erreur est survenue lors de la connexion'
      );
      return false;
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