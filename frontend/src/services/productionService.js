import API from './api';

// Service pour les opérations liées aux productions
const ProductionService = {
  // Obtenir toutes les productions
  getProductions: async () => {
    try {
      const response = await API.get('/productions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir une production par ID
  getProductionById: async (id) => {
    try {
      const response = await API.get(`/productions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Démarrer une nouvelle production
  startProduction: async (productionData) => {
    try {
      const response = await API.post('/productions', productionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour les ingrédients d'une production
  updateIngredients: async (id, ingredients) => {
    try {
      const response = await API.put(`/productions/${id}/ingredients`, { ingredients });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour les contrôles qualité d'une production
  updateQualityChecks: async (id, qualityChecks) => {
    try {
      const response = await API.put(`/productions/${id}/quality`, { qualityChecks });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Enregistrer une pause de production
  recordPause: async (id, pauseData) => {
    try {
      const response = await API.post(`/productions/${id}/pause`, pauseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Terminer une pause de production
  endPause: async (id, pauseId, endTime) => {
    try {
      const response = await API.put(`/productions/${id}/pause/${pauseId}`, { endTime });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Terminer une production
  completeProduction: async (id, completionData) => {
    try {
      const response = await API.put(`/productions/${id}/complete`, completionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Marquer une production comme échouée
  failProduction: async (id, reason) => {
    try {
      const response = await API.put(`/productions/${id}/fail`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default ProductionService;