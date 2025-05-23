const express = require('express');
const { 
  getProducts, 
  getProduct, // Changé de getProductById
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductByCode,
  updateProductStatus
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes protégées pour les administrateurs
router.route('/')
  .get(protect, authorize('admin'), getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/:id')
  .get(protect, authorize('admin'), getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

// Route pour changer le statut
router.route('/:id/status')
  .patch(protect, authorize('admin'), updateProductStatus);

// Route pour obtenir un produit par code (accessible par les opérateurs)
router.route('/code/:code')
  .get(protect, getProductByCode);

module.exports = router;
