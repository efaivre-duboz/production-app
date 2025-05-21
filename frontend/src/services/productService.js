import API from './api';

// Service pour les opérations liées aux produits
const ProductService = {
  // Obtenir tous les produits
  getProducts: async () => {
    try {
      const response = await API.get('/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir un produit par ID
  getProductById: async (id) => {
    try {
      const response = await API.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir un produit par code
  getProductByCode: async (code) => {
    try {
      const response = await API.get(`/products/code/${code}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Créer un nouveau produit
  createProduct: async (productData) => {
    try {
      const response = await API.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un produit
  updateProduct: async (id, productData) => {
    try {
      const response = await API.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un produit
  deleteProduct: async (id) => {
    try {
      const response = await API.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default ProductService;