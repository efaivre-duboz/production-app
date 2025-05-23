const mongoose = require('mongoose');

// Schéma pour les ingrédients utilisés dans une production
const ProductionIngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de l\'ingrédient est requis'],
    trim: true
  },
  required: {
    type: Number,
    required: [true, 'La quantité requise est requise'],
    min: [0, 'La quantité doit être positive']
  },
  actual: {
    type: Number,
    min: [0, 'La quantité doit être positive']
  },
  unit: {
    type: String,
    required: [true, 'L\'unité est requise'],
    enum: ['kg', 'g', 'l', 'ml']
  }
});

// Schéma pour les pauses de production
const ProductionPauseSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: [true, 'L\'heure de début est requise']
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number,
    min: [0, 'La durée doit être positive']
  },
  reason: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['equipment', 'material', 'personnel', 'other'],
    default: 'other'
  }
});

// Schéma pour les résultats des contrôles qualité
const QualityResultSchema = new mongoose.Schema({
  checkName: {
    type: String,
    required: [true, 'Le nom du contrôle est requis'],
    trim: true
  },
  expectedValue: {
    type: String,
    required: [true, 'La valeur attendue est requise'],
    trim: true
  },
  actualValue: {
    type: String,
    trim: true
  },
  result: {
    type: String,
    enum: ['conforme', 'non-conforme', 'non-testé'],
    default: 'non-testé'
  },
  notes: {
    type: String,
    trim: true
  }
});

// Schéma principal de production
const ProductionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'L\'ID du produit est requis']
  },
  productCode: {
    type: String,
    required: [true, 'Le code produit est requis'],
    trim: true
  },
  productName: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true
  },
  batchNumber: {
    type: String,
    required: [true, 'Le numéro de lot est requis'],
    unique: true,
    trim: true
  },
  operator: {
    type: String,
    required: [true, 'L\'opérateur est requis'],
    trim: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'failed', 'cancelled'],
    default: 'in_progress'
  },
  recipeVersion: {
    type: Number,
    required: [true, 'La version de la recette est requise']
  },
  ingredients: [ProductionIngredientSchema],
  pauseHistory: [ProductionPauseSchema],
  qualityResults: [QualityResultSchema],
  totalDuration: {
    type: Number,
    default: 0
  },
  pauseDuration: {
    type: Number,
    default: 0
  },
  netDuration: {
    type: Number,
    default: 0
  },
  finalQuantity: {
    type: Number,
    min: [0, 'La quantité doit être positive']
  },
  wastageQuantity: {
    type: Number,
    min: [0, 'La quantité doit être positive'],
    default: 0
  },
  notes: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Production', ProductionSchema);
