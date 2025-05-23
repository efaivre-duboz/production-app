// backend/routes/productRoutes.js - CORRIGÉ
const express = require('express');
const { 
  getProducts, 
  getProduct,
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductByCode,
  updateProductStatus
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// IMPORTANT: Route spécifique AVANT les routes génériques
// Route pour obtenir un produit par code (accessible par les opérateurs)
router.get('/code/:code', getProductByCode);

// Routes protégées pour les administrateurs
router.route('/')
  .get(getProducts) // Temporairement sans protection pour debug
  .post(protect, authorize('admin'), createProduct);

router.route('/:id')
  .get(getProduct)  // Temporairement sans protection pour debug
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

// Route pour changer le statut
router.patch('/:id/status', protect, authorize('admin'), updateProductStatus);

module.exports = router;