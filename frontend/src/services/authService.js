// frontend/src/services/authService.js - Version complète intégrée
import API from './api';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.token = localStorage.getItem('token');
    
    // Configurer l'intercepteur pour les requêtes
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Intercepteur pour ajouter le token aux requêtes
    API.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour gérer les réponses et erreurs
    API.interceptors.response.use(
      (response) => response,
      (error) => {
        // Si token expiré ou invalide, déconnecter automatiquement
        if (error.response?.status === 401) {
          this.logout();
          // Rediriger vers login si pas déjà sur la page de login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Connexion avec gestion complète des erreurs
  async login(nameOrEmail, password) {
    try {
      const response = await API.post('/auth/login', { 
        name: nameOrEmail,
        email: nameOrEmail, // Support pour email ou nom
        password 
      });
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Stocker le token
        this.setToken(token);
        this.currentUser = user;
        
        return {
          success: true,
          user,
          message: 'Connexion réussie'
        };
      } else {
        throw new Error(response.data.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      let errorMessage = 'Une erreur est survenue lors de la connexion';
      
      if (error.response) {
        // Erreur du serveur
        switch (error.response.status) {
          case 400:
            errorMessage = 'Données de connexion invalides';
            break;
          case 401:
            errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
            break;
          case 403:
            errorMessage = 'Accès interdit';
            break;
          case 500:
            errorMessage = 'Erreur interne du serveur';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        // Pas de réponse du serveur
        errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  }

  // Inscription (si nécessaire)
  async register(userData) {
    try {
      const response = await API.post('/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        this.setToken(token);
        this.currentUser = user;
        
        return {
          success: true,
          user,
          message: 'Inscription réussie'
        };
      } else {
        throw new Error(response.data.message || 'Échec de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'inscription',
        error: error.response?.data || error.message
      };
    }
  }

  // Récupérer le profil utilisateur
  async getProfile() {
    try {
      const response = await API.get('/auth/me');
      
      if (response.data.success) {
        this.currentUser = response.data.user;
        return {
          success: true,
          user: response.data.user
        };
      } else {
        throw new Error('Impossible de récupérer le profil');
      }
    } catch (error) {
      console.error('Erreur de récupération du profil:', error);
      
      // Si erreur 401, le token est probablement expiré
      if (error.response?.status === 401) {
        this.logout();
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la récupération du profil'
      };
    }
  }

  // Déconnexion
  logout() {
    this.removeToken();
    this.currentUser = null;
    
    // Nettoyer toutes les données de session
    localStorage.removeItem('authBypass');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentProductionId');
    
    // Supprimer l'Authorization header
    delete API.defaults.headers.common['Authorization'];
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    const token = this.getToken();
    const bypass = localStorage.getItem('authBypass') === 'true';
    
    return !!(token || bypass);
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role) {
    // Support pour le mode bypass de développement
    if (localStorage.getItem('authBypass') === 'true') {
      const bypassRole = localStorage.getItem('userRole');
      return bypassRole === role;
    }
    
    return this.currentUser?.role === role;
  }

  // Vérifier si l'utilisateur a une permission spécifique
  hasPermission(permission) {
    if (!this.isAuthenticated()) return false;
    
    // Logique de permissions basée sur les rôles
    const rolePermissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'view_reports'],
      operator: ['read', 'write'],
      viewer: ['read']
    };
    
    const userRole = this.getCurrentUser()?.role || 'viewer';
    const permissions = rolePermissions[userRole] || [];
    
    return permissions.includes(permission);
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    if (localStorage.getItem('authBypass') === 'true') {
      return {
        name: 'Utilisateur Test',
        role: localStorage.getItem('userRole') || 'user'
      };
    }
    
    return this.currentUser;
  }

  // Gestion du token
  setToken(token) {
    localStorage.setItem('token', token);
    this.token = token;
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  removeToken() {
    localStorage.removeItem('token');
    this.token = null;
    delete API.defaults.headers.common['Authorization'];
  }

  // Vérifier si le token est valide (basique)
  isTokenValid() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Décoder le JWT pour vérifier l'expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      
      return payload.exp > now;
    } catch (error) {
      console.error('Token invalide:', error);
      return false;
    }
  }

  // Rafraîchir le token si nécessaire
  async refreshTokenIfNeeded() {
    if (!this.isTokenValid()) {
      try {
        const response = await API.post('/auth/refresh');
        if (response.data.success) {
          this.setToken(response.data.token);
          return true;
        }
      } catch (error) {
        console.error('Erreur de rafraîchissement du token:', error);
        this.logout();
      }
      return false;
    }
    return true;
  }

  // Méthodes de bypass pour le développement
  bypassAuth(role = 'operator') {
    localStorage.setItem('authBypass', 'true');
    localStorage.setItem('userRole', role);
    this.currentUser = {
      name: 'Utilisateur Test',
      role: role
    };
  }

  bypassAuthAsAdmin() {
    this.bypassAuth('admin');
  }

  // Nettoyer le bypass
  clearBypass() {
    localStorage.removeItem('authBypass');
    localStorage.removeItem('userRole');
  }
}

// Créer une instance singleton
const authService = new AuthService();

export default authService;