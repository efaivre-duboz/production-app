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
          message: 'Contrôles qualité mis à jour (simulation)'
        };
      }
      
      const response = await API.put(`/productions/${productionId}/quality`, {
        qualityChecks
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Contrôles qualité mis à jour avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour des contrôles qualité:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la mise à jour des contrôles qualité',
        error: error.response?.data || error.message
      };
    }
  }

  // Enregistrer une pause
  static async recordPause(productionId, pauseData) {
    try {
      if (productionId === 'temp_id') {
        // Simulation pour le développement
        await this.delay(300);
        return {
          success: true,
          data: {
            id: `pause_${Date.now()}`,
            ...pauseData,
            startTime: pauseData.startTime || new Date().toISOString()
          },
          message: 'Pause enregistrée (simulation)'
        };
      }
      
      const response = await API.post(`/productions/${productionId}/pause`, {
        startTime: pauseData.startTime || new Date().toISOString(),
        reason: pauseData.reason,
        category: pauseData.category
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Pause enregistrée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la pause:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'enregistrement de la pause',
        error: error.response?.data || error.message
      };
    }
  }

  // Terminer une pause
  static async endPause(productionId, pauseId, endTime) {
    try {
      if (productionId === 'temp_id') {
        // Simulation pour le développement
        await this.delay(300);
        return {
          success: true,
          message: 'Pause terminée (simulation)'
        };
      }
      
      const response = await API.put(`/productions/${productionId}/pause/${pauseId}`, {
        endTime: endTime || new Date().toISOString()
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Pause terminée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la fin de la pause:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la fin de la pause',
        error: error.response?.data || error.message
      };
    }
  }

  // Terminer une production
  static async completeProduction(productionId, completionData) {
    try {
      if (productionId === 'temp_id') {
        // Simulation pour le développement
        await this.delay(1000);
        return {
          success: true,
          message: 'Production terminée (simulation)'
        };
      }
      
      const response = await API.put(`/productions/${productionId}/complete`, {
        finalQuantity: completionData.finalQuantity,
        wastageQuantity: completionData.wastageQuantity || 0,
        notes: completionData.notes,
        endDate: new Date().toISOString()
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Production terminée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la finalisation de la production:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la finalisation de la production',
        error: error.response?.data || error.message
      };
    }
  }

  // Marquer une production comme échouée
  static async failProduction(productionId, reason) {
    try {
      if (productionId === 'temp_id') {
        // Simulation pour le développement
        await this.delay(500);
        return {
          success: true,
          message: 'Production marquée comme échouée (simulation)'
        };
      }
      
      const response = await API.put(`/productions/${productionId}/fail`, {
        reason: reason || 'Raison non spécifiée'
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Production marquée comme échouée'
      };
    } catch (error) {
      console.error('Erreur lors du marquage de la production comme échouée:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du marquage de la production',
        error: error.response?.data || error.message
      };
    }
  }

  // Obtenir les statistiques de production
  static async getProductionStats(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await API.get(`/productions/stats?${params.toString()}`);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Statistiques récupérées avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      
      // Retourner des statistiques fictives en cas d'erreur
      return {
        success: false,
        data: this.getMockStats(),
        message: 'Utilisation de données fictives (erreur API)',
        error: error.response?.data || error.message
      };
    }
  }

  // Rechercher des productions
  static async searchProductions(query, filters = {}) {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await API.get(`/productions/search?${params.toString()}`);
      
      return {
        success: true,
        data: response.data.data || response.data,
        count: response.data.count,
        message: 'Recherche effectuée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la recherche',
        error: error.response?.data || error.message
      };
    }
  }

  // Exporter des données de production
  static async exportProductions(format = 'csv', filters = {}) {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await API.get(`/productions/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `productions_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return {
        success: true,
        message: 'Export démarré avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'export',
        error: error.response?.data || error.message
      };
    }
  }

  // Méthodes utilitaires

  // Délai pour les simulations
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Données fictives pour le développement
  static getMockProduction() {
    return {
      success: true,
      data: {
        id: "temp_id",
        productCode: "A123",
        productName: "Nettoyant Multi-Surfaces",
        batchNumber: "L789",
        operator: "Jean Dupont",
        startDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        totalDuration: 21600,
        pauseDuration: 1800,
        status: "in_progress",
        ingredients: [
          { name: 'Eau déminéralisée', required: 75.0, actual: 74.8, unit: 'kg' },
          { name: 'Polymère A', required: 15.0, actual: 15.2, unit: 'kg' },
          { name: 'Additif B', required: 5.0, actual: 5.0, unit: 'kg' }
        ],
        qualityChecks: {
          appearanceCheck: "conforme",
          viscosityCheck: "conforme",
          pHValue: "7.2",
          odorCheck: "conforme"
        },
        pauseHistory: [
          {
            id: "pause_1",
            startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 4 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
            duration: 1800,
            reason: "Changement d'équipe",
            category: "personnel"
          }
        ]
      },
      message: 'Données fictives pour le développement'
    };
  }

  // Statistiques fictives
  static getMockStats() {
    return {
      totalProductions: 127,
      completedProductions: 118,
      failedProductions: 4,
      inProgressProductions: 5,
      averageProductionTime: 6.5,
      totalPauseTime: 45.2,
      qualityIssues: 12,
      topProducts: [
        { code: 'A123', count: 45, avgTime: 5.8 },
        { code: 'B456', count: 38, avgTime: 7.2 },
        { code: 'C789', count: 34, avgTime: 6.9 }
      ],
      monthlyTrend: [
        { month: 'Jan', productions: 32 },
        { month: 'Fév', productions: 28 },
        { month: 'Mar', productions: 35 },
        { month: 'Avr', productions: 32 }
      ]
    };
  }

  // Validation des données
  static validateProductionData(data) {
    const errors = [];
    
    if (!data.productCode) errors.push('Code produit requis');
    if (!data.batchNumber) errors.push('Numéro de lot requis');
    if (!data.operator) errors.push('Opérateur requis');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Formater les durées
  static formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  // Calculer l'écart d'ingrédient
  static calculateIngredientDeviation(required, actual) {
    if (!actual || actual === 0) return null;
    return ((actual - required) / required * 100).toFixed(1);
  }
}

export default ProductionService;