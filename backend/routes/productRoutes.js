const express = require('express');
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductByCode
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes protégées pour les administrateurs
router.route('/')
  .get(protect, authorize('admin'), getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/:id')
  .get(protect, authorize('admin'), getProductById)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

// Route pour obtenir un produit par code (accessible par les opérateurs)
router.route('/code/:code')
  .get(protect, getProductByCode);

module.exports = router;