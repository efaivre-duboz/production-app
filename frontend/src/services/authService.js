import API from './api';

// Service pour les opérations liées à l'authentification
const AuthService = {
  // Connexion
  login: async (name, password) => {
    try {
      const response = await API.post('/auth/login', { name, password });
      
      // Stocker le token dans le localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authBypass');
    localStorage.removeItem('userRole');
  },

  // Vérifier la session (profil utilisateur)
  getProfile: async () => {
    try {
      const response = await API.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null || localStorage.getItem('authBypass') === 'true';
  },

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole: (role) => {
    // Pour le développement, vérifier d'abord le bypass
    if (localStorage.getItem('authBypass') === 'true') {
      const bypassRole = localStorage.getItem('userRole');
      if (bypassRole === role) {
        return true;
      }
    }
    
    // Vérification réelle à implémenter lorsque nous avons la gestion des rôles côté serveur
    // Pour l'instant, nous supposons que la vérification est faite dans le contexte AuthContext
    return false;
  }
};

export default AuthService;
