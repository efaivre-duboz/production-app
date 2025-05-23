// frontend/src/services/apiTestService.js
import API from './api';

class ApiTestService {
  // Tester la connexion à l'API
  static async testConnection() {
    try {
      const response = await API.get('/');
      return {
        success: true,
        message: 'Connexion API réussie',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur de connexion API',
        error: error.message,
        details: error.response?.data || error
      };
    }
  }

  // Tester l'authentification
  static async testAuth(credentials) {
    try {
      const response = await API.post('/auth/login', credentials);
      return {
        success: true,
        message: 'Authentification réussie',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Échec de l\'authentification',
        error: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  }

  // Tester la récupération des produits
  static async testProducts(token) {
    try {
      // Temporairement définir le token pour ce test
      if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await API.get('/products');
      return {
        success: true,
        message: 'Récupération des produits réussie',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la récupération des produits',
        error: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  }

  // Test complet de l'API
  static async runFullTest() {
    const results = {
      connection: null,
      auth: null,
      products: null,
      overall: false
    };

    console.log('🧪 Début des tests API...');

    // Test 1: Connexion
    console.log('📡 Test de connexion...');
    results.connection = await this.testConnection();
    console.log(results.connection.success ? '✅ Connexion OK' : '❌ Connexion échouée', results.connection);

    // Test 2: Authentification avec des credentials de test
    console.log('🔐 Test d\'authentification...');
    results.auth = await this.testAuth({
      name: 'admin', // Utiliser les credentials que vous avez configurés
      password: 'admin123'
    });
    console.log(results.auth.success ? '✅ Auth OK' : '❌ Auth échouée', results.auth);

    // Test 3: Récupération des produits (si auth OK)
    if (results.auth.success && results.auth.data?.token) {
      console.log('📦 Test de récupération des produits...');
      results.products = await this.testProducts(results.auth.data.token);
      console.log(results.products.success ? '✅ Produits OK' : '❌ Produits échoués', results.products);
    }

    // Résultat global
    results.overall = results.connection.success && results.auth.success;
    
    console.log('🏁 Tests terminés. Résultat global:', results.overall ? '✅ SUCCÈS' : '❌ ÉCHEC');
    
    return results;
  }
}

export default ApiTestService;