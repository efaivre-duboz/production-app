const mongoose = require('mongoose');

// Schéma pour les ingrédients
const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de l\'ingrédient est requis'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'La quantité est requise'],
    min: [0, 'La quantité doit être positive']
  },
  unit: {
    type: String,
    required: [true, 'L\'unité est requise'],
    enum: ['kg', 'g', 'l', 'ml']
  },
  notes: {
    type: String,
    trim: true
  }
});

// Schéma pour les étapes de production
const ProductionStepSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: [true, 'L\'ordre est requis'],
    min: [1, 'L\'ordre doit être au moins 1']
  },
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  instructions: {
    type: String,
    required: [true, 'Les instructions sont requises'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'La durée est requise'],
    min: [0, 'La durée doit être positive']
  }
});

// Schéma pour les contrôles qualité
const QualityCheckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du paramètre est requis'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Le type de contrôle est requis'],
    enum: ['visuel', 'physique', 'chimique', 'microbiologique', 'fonctionnel', 'olfactif', 'environnemental']
  },
  expectedValue: {
    type: String,
    required: [true, 'La valeur attendue est requise'],
    trim: true
  }
});

// Schéma pour la recette
const RecipeSchema = new mongoose.Schema({
  ingredients: [IngredientSchema],
  steps: [ProductionStepSchema],
  qualityChecks: [QualityCheckSchema],
  version: {
    type: Number,
    default: 1
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Schéma principal du produit
const ProductSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Le code produit est requis'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  recipe: {
    type: RecipeSchema,
    required: [true, 'La recette est requise']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour la date de mise à jour
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);