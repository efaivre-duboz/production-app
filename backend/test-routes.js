// backend/test-routes.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testRoute(method, path, data = null) {
  try {
    console.log(`🧪 Test: ${method} ${path}`);
    
    let response;
    switch(method.toUpperCase()) {
      case 'GET':
        response = await axios.get(`${BASE_URL}${path}`);
        break;
      case 'POST':
        response = await axios.post(`${BASE_URL}${path}`, data);
        break;
      default:
        throw new Error(`Méthode ${method} non supportée`);
    }
    
    console.log(`✅ Succès: ${response.status} ${response.statusText}`);
    console.log(`📦 Données:`, response.data);
    console.log('---');
    return true;
  } catch (error) {
    console.log(`❌ Erreur: ${error.response?.status || 'NETWORK'} - ${error.response?.statusText || error.message}`);
    if (error.response?.data) {
      console.log(`📦 Erreur détaillée:`, error.response.data);
    }
    console.log('---');
    return false;
  }
}

async function runTests() {
  console.log('🚀 Test des routes API ProdMaster\n');
  
  // Tests de base
  await testRoute('GET', '/');
  await testRoute('GET', '/health');
  
  // Test des routes API
  await testRoute('GET', '/api/products');
  await testRoute('GET', '/api/products/code/A123');
  
  // Test de route inexistante
  await testRoute('GET', '/api/nonexistent');
  
  console.log('🏁 Tests terminés');
}

runTests();