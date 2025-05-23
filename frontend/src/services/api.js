import axios from 'axios';

// Créer une instance d'axios avec la configuration de base
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 secondes
});

// Intercepteur pour ajouter le token d'authentification aux requêtes
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Requête API:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Erreur de configuration de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
API.interceptors.response.use(
  (response) => {
    console.log('Réponse API:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Erreur de réponse API:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message
    });
    
    // Si le token est expiré ou invalide, rediriger vers la connexion
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('authBypass');
      localStorage.removeItem('userRole');
      // Ne pas rediriger automatiquement pour éviter les boucles
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default API;