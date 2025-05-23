// frontend/src/hooks/useApiIntegration.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

// Hook principal pour l'intégration API
export const useApiIntegration = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiStatus, setApiStatus] = useState('unknown'); // 'online', 'offline', 'error', 'unknown'
  const [lastError, setLastError] = useState(null);
  const navigate = useNavigate();

  // Vérifier le statut de l'API
  const checkApiStatus = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/', {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        setApiStatus('online');
        setLastError(null);
        return true;
      } else {
        setApiStatus('error');
        setLastError(`API responded with status: ${response.status}`);
        return false;
      }
    } catch (error) {
      setApiStatus('offline');
      setLastError(error.message);
      return false;
    }
  }, []);

  // Vérifier la connexion réseau
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkApiStatus();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setApiStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérification initiale
    checkApiStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkApiStatus]);

  return {
    isOnline,
    apiStatus,
    lastError,
    checkApiStatus
  };
};

// Hook pour les appels API avec gestion d'erreurs
export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const execute = useCallback(async (apiFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      
      if (result.success) {
        setData(result.data);
        return result;
      } else {
        setError(result.message || 'Une erreur est survenue');
        return result;
      }
    } catch (error) {
      console.error('Erreur API:', error);
      
      // Gestion spécifique des erreurs d'authentification
      if (error.response?.status === 401) {
        AuthService.logout();
        navigate('/login');
        setError('Session expirée. Veuillez vous reconnecter.');
      } else if (error.response?.status === 403) {
        setError('Accès interdit. Permissions insuffisantes.');
      } else if (error.response?.status >= 500) {
        setError('Erreur serveur. Veuillez réessayer plus tard.');
      } else if (error.name === 'NetworkError' || !navigator.onLine) {
        setError('Problème de connexion réseau. Vérifiez votre connexion.');
      } else {
        setError(error.message || 'Une erreur inattendue est survenue');
      }
      
      return {
        success: false,
        message: error.message,
        error
      };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset
  };
};

// Hook pour la gestion des productions avec intégration API
export const useProduction = () => {
  const { execute, loading, error } = useApiCall();
  const [currentProduction, setCurrentProduction] = useState(null);

  // Démarrer une production
  const startProduction = useCallback(async (productionData) => {
    const ProductionService = (await import('../services/productionService')).default;
    const result = await execute(ProductionService.startProduction, productionData);
    
    if (result.success) {
      setCurrentProduction(result.data);
      localStorage.setItem('currentProductionId', result.data.id);
    }
    
    return result;
  }, [execute]);

  // Charger une production
  const loadProduction = useCallback(async (productionId) => {
    const ProductionService = (await import('../services/productionService')).default;
    const result = await execute(ProductionService.getProductionById, productionId);
    
    if (result.success) {
      setCurrentProduction(result.data);
    }
    
    return result;
  }, [execute]);

  // Mettre à jour les ingrédients
  const updateIngredients = useCallback(async (productionId, ingredients) => {
    const ProductionService = (await import('../services/productionService')).default;
    return await execute(ProductionService.updateIngredients, productionId, ingredients);
  }, [execute]);

  // Mettre à jour les contrôles qualité
  const updateQuality = useCallback(async (productionId, qualityChecks) => {
    const ProductionService = (await import('../services/productionService')).default;
    return await execute(ProductionService.updateQualityChecks, productionId, qualityChecks);
  }, [execute]);

  // Enregistrer une pause
  const recordPause = useCallback(async (productionId, pauseData) => {
    const ProductionService = (await import('../services/productionService')).default;
    return await execute(ProductionService.recordPause, productionId, pauseData);
  }, [execute]);

  // Terminer une pause
  const endPause = useCallback(async (productionId, pauseId, endTime) => {
    const ProductionService = (await import('../services/productionService')).default;
    return await execute(ProductionService.endPause, productionId, pauseId, endTime);
  }, [execute]);

  // Terminer une production
  const completeProduction = useCallback(async (productionId, completionData) => {
    const ProductionService = (await import('../services/productionService')).default;
    const result = await execute(ProductionService.completeProduction, productionId, completionData);
    
    if (result.success) {
      localStorage.removeItem('currentProductionId');
      setCurrentProduction(null);
    }
    
    return result;
  }, [execute]);

  return {
    currentProduction,
    loading,
    error,
    startProduction,
    loadProduction,
    updateIngredients,
    updateQuality,
    recordPause,
    endPause,
    completeProduction
  };
};

// Hook pour la gestion des produits avec intégration API
export const useProducts = () => {
  const { execute, loading, error } = useApiCall();
  const [products, setProducts] = useState([]);

  // Charger tous les produits
  const loadProducts = useCallback(async () => {
    const ProductService = (await import('../services/productService')).default;
    const result = await execute(ProductService.getProducts);
    
    if (result.success) {
      setProducts(result.data);
    }
    
    return result;
  }, [execute]);

  // Charger un produit par code
  const loadProductByCode = useCallback(async (code) => {
    const ProductService = (await import('../services/productService')).default;
    return await execute(ProductService.getProductByCode, code);
  }, [execute]);

  // Créer un produit
  const createProduct = useCallback(async (productData) => {
    const ProductService = (await import('../services/productService')).default;
    const result = await execute(ProductService.createProduct, productData);
    
    if (result.success) {
      // Recharger la liste des produits
      await loadProducts();
    }
    
    return result;
  }, [execute, loadProducts]);

  // Mettre à jour un produit
  const updateProduct = useCallback(async (productId, productData) => {
    const ProductService = (await import('../services/productService')).default;
    const result = await execute(ProductService.updateProduct, productId, productData);
    
    if (result.success) {
      // Recharger la liste des produits
      await loadProducts();
    }
    
    return result;
  }, [execute, loadProducts]);

  // Supprimer un produit
  const deleteProduct = useCallback(async (productId) => {
    const ProductService = (await import('../services/productService')).default;
    const result = await execute(ProductService.deleteProduct, productId);
    
    if (result.success) {
      // Retirer le produit de la liste locale
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
    
    return result;
  }, [execute]);

  return {
    products,
    loading,
    error,
    loadProducts,
    loadProductByCode,
    createProduct,
    updateProduct,
    deleteProduct
  };
};

// Hook pour les notifications et feedback utilisateur
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-suppression après 5 secondes pour les notifications non permanentes
    if (!notification.permanent) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const notifySuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    });
  }, [addNotification]);

  const notifyError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      permanent: true, // Les erreurs restent jusqu'à fermeture manuelle
      ...options
    });
  }, [addNotification]);

  const notifyWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      ...options
    });
  }, [addNotification]);

  const notifyInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo
  };
};

// Hook pour la persistance locale (fallback hors ligne)
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lors de la lecture de localStorage pour la clé "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erreur lors de l'écriture de localStorage pour la clé "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Erreur lors de la suppression de localStorage pour la clé "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};