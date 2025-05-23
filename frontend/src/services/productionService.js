// frontend/src/services/productionService.js - Version complète intégrée
import API from './api';

class ProductionService {
  
  // Obtenir toutes les productions (admin uniquement)
  static async getProductions(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Ajouter les filtres à la requête
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await API.get(`/productions?${params.toString()}`);
      
      return {
        success: true,
        data: response.data.data || response.data,
        count: response.data.count,
        message: 'Productions récupérées avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des productions:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la récupération des productions',
        error: error.response?.data || error.message
      };
    }
  }

  // Obtenir une production par ID
  static async getProductionById(id) {
    try {
      if (!id || id === 'temp_id') {
        // Retourner des données fictives pour le développement
        return this.getMockProduction();
      }
      
      const response = await API.get(`/productions/${id}`);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Production récupérée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la production:', error);
      
      // En cas d'erreur, retourner des données fictives pour le développement
      if (process.env.NODE_ENV === 'development') {
        console.warn('Utilisation de données fictives pour le développement');
        return this.getMockProduction();
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Production non trouvée',
        error: error.response?.data || error.message
      };
    }
  }

  // Démarrer une nouvelle production
  static async startProduction(productionData) {
    try {
      // Validation des données requises
      if (!productionData.productCode || !productionData.batchNumber || !productionData.operator) {
        throw new Error('Données de production incomplètes');
      }
      
      const response = await API.post('/productions', {
        productCode: productionData.productCode,
        batchNumber: productionData.batchNumber,
        operator: productionData.operator,
        startDate: new Date().toISOString()
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Production démarrée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors du démarrage de la production:', error);
      
      let errorMessage = 'Erreur lors du démarrage de la production';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Données invalides';
      } else if (error.response?.status === 409) {
        errorMessage = 'Un lot avec ce numéro existe déjà';
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  }

  // Mettre à jour les ingrédients d'une production
  static async updateIngredients(productionId, ingredients) {
    try {
      if (productionId === 'temp_id') {
        // Simulation pour le développement
        await this.delay(500);
        return {
          success: true,
          message: 'Ingrédients mis à jour (simulation)'
        };
      }
      
      const response = await API.put(`/productions/${productionId}/ingredients`, {
        ingredients
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Ingrédients mis à jour avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour des ingrédients:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la mise à jour des ingrédients',
        error: error.response?.data || error.message
      };
    }
  }

  // Mettre à jour les contrôles qualité
  static async updateQualityChecks(productionId, qualityChecks) {
    try {
      if (productionId === 'temp_id') {
        // Simulation pour le développement
        await this.delay(500);
        return {
          success: true,
          message: