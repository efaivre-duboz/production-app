const express = require('express');
const {
  getProductions,
  getProductionById,
  startProduction,
  updateProductionIngredients,
  updateProductionQuality,
  recordProductionPause,
  endProductionPause,
  completeProduction,
  failProduction
} = require('../controllers/productionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes générales
router.route('/')
  .get(protect, authorize('admin'), getProductions)
  .post(protect, startProduction);

router.route('/:id')
  .get(protect, getProductionById);

// Routes spécifiques pour les différentes étapes
router.route('/:id/ingredients')
  .put(protect, updateProductionIngredients);

router.route('/:id/quality')
  .put(protect, updateProductionQuality);

router.route('/:id/pause')
  .post(protect, recordProductionPause);

router.route('/:id/pause/:pauseId')
  .put(protect, endProductionPause);

router.route('/:id/complete')
  .put(protect, completeProduction);

router.route('/:id/fail')
  .put(protect, failProduction);

module.exports = router;
