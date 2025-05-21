import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const bypassAuth = localStorage.getItem('authBypass');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkUserSession();
    } else if (bypassAuth === 'true') {
      // Si bypass d'authentification est activé - simuler un utilisateur standard
      setCurrentUser({ 
        name: 'Utilisateur Test',
        role: 'user'
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  // Vérifier la session utilisateur
  const checkUserSession = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me');
      console.log('Session check response:', response.data);
      setCurrentUser(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error('Session error:', error);
      logout();
      setLoading(false);
    }
  };

  // Connexion
  const login = async (username, password) => {
    try {
      setError(null);
      console.log('Tentative de connexion avec:', { username, password });
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        name: username,
        password
      });
      
      console.log('Réponse de connexion:', response.data);
      
      const { user, token } = response.data;
      
      // Sauvegarder le token
      localStorage.setItem('token', token);
      
      // Configurer Axios pour utiliser le token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
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
    localStorage.removeItem('token');
    localStorage.removeItem('authBypass');
    delete axios.defaults.headers.common['Authorization'];
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