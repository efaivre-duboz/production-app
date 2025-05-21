const Production = require('../models/Production');
const Product = require('../models/Product');

// @desc    Obtenir toutes les productions
// @route   GET /api/productions
// @access  Admin
exports.getProductions = async (req, res) => {
  try {
    const productions = await Production.find().populate('product', 'code name');
    
    res.status(200).json({
      success: true,
      count: productions.length,
      data: productions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des productions',
      error: error.message
    });
  }
};

// @desc    Obtenir une production par ID
// @route   GET /api/productions/:id
// @access  Admin/Operator
exports.getProductionById = async (req, res) => {
  try {
    const production = await Production.findById(req.params.id).populate('product');
    
    if (!production) {
      return res.status(404).json({
        success: false,
        message: 'Production non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      data: production
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la production',
      error: error.message
    });
  }
};

// @desc    Démarrer une nouvelle production
// @route   POST /api/productions
// @access  Operator
exports.startProduction = async (req, res) => {
  try {
    const { productCode, batchNumber, operator } = req.body;
    
    // Vérifier si le produit existe
    const product = await Product.findOne({ code: productCode });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }
    
    // Vérifier si un lot avec ce numéro existe déjà
    const existingBatch = await Production.findOne({ batchNumber });
    if (existingBatch) {
      return res.status(400).json({
        success: false,
        message: 'Un lot avec ce numéro existe déjà'
      });
    }
    
    // Préparer les ingrédients pour la production
    const ingredients = product.recipe.ingredients.map(ingredient => ({
      name: ingredient.name,
      required: ingredient.quantity,
      actual: null,
      unit: ingredient.unit
    }));
    
    // Préparer les contrôles qualité pour la production
    const qualityChecks = product.recipe.qualityChecks.map(check => ({
      name: check.name,
      type: check.type,
      expectedValue: check.expectedValue,
      actualValue: null,
      result: 'pending'
    }));
    
    // Créer la nouvelle production
    const production = await Production.create({
      productCode,
      batchNumber,
      operator,
      product: product._id,
      ingredients,
      qualityChecks,
      status: 'in_progress'
    });
    
    res.status(201).json({
      success: true,
      data: production
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du démarrage de la production',
      error: error.message
    });
  }
};

// @desc    Mettre à jour les ingrédients d'une production
// @route   PUT /api/productions/:id/ingredients
// @access  Operator
exports.updateProductionIngredients = async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    const production = await Production.findById(req.params.id);
    if (!production) {
      return res.status(404).json({
        success: false,
        message: 'Production non trouvée'
      });
    }
    
    if (production.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de modifier une production terminée ou échouée'
      });
    }
    
    production.ingredients = ingredients;
    await production.save();
    
    res.status(200).json({
      success: true,
      data: production
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des ingrédients',
      error: error.message
    });
  }
};

// @desc    Mettre à jour les contrôles qualité d'une production
// @route   PUT /api/productions/:id/quality
// @access  Operator
exports.updateProductionQuality = async (req, res) => {
  try {
    const { qualityChecks } = req.body;
    
    const production = await Production.findById(req.params.id);
    if (!production) {
      return res.status(404).json({
        success: false,
        message: 'Production non trouvée'
      });
    }
    
    if (production.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de modifier une production terminée ou échouée'
      });
    }
    
    production.qualityChecks = qualityChecks;
    await production.save();
    
    res.status(200).json({
      success: true,
      data: production
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des contrôles qualité',
      error: error.message
    });
  }
};

// @desc    Enregistrer une pause de production
// @route   POST /api/productions/:id/pause
// @access  Operator
exports.recordProductionPause = async (req, res) => {
  try {
    const { startTime, reason, category } = req.body;
    
    const production = await Production.findById(req.params.id);
    if (!production) {
      return res.status(404).json({
        success: false,
        message: 'Production non trouvée'
      });
    }
    
    if (production.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de modifier une production terminée ou échouée'
      });
    }
    
    // Ajouter une nouvelle pause
    production.pauseHistory.push({
      startTime: startTime || new Date(),
      reason,
      category
    });
    
    await production.save();
    
    res.status(200).json({
      success: true,
      data: production.pauseHistory[production.pauseHistory.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de la pause',
      error: error.message
    });
  }
};

// @desc    Terminer une pause de production
// @route   PUT /api/productions/:id/pause/:pauseId
// @access  Operator
exports.endProductionPause = async (req, res) => {
  try {
    const { endTime } = req.body;
    
    const production = await Production.findById(req.params.id);
    if (!production) {
      return res.status(404).json({
        success: false,
        message: 'Production non trouvée'
      });
    }
    
    // Trouver la pause à terminer
    const pauseIndex = production.pauseHistory.findIndex(
      p => p._id.toString() === req.params.pauseId
    );
    
    if (pauseIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Pause non trouvée'
      });
    }
    
    const pause = production.pauseHistory[pauseIndex];
    
    // Mettre à jour les informations de fin de pause
    const endTimeDate = endTime || new Date();
    pause.endTime = endTimeDate;
    
    // Calculer la durée en secondes
    const startTimeMs = new Date(pause.startTime).getTime();
    const endTimeMs = new Date(endTimeDate).getTime();
    pause.duration = Math.round((endTimeMs - startTimeMs) / 1000);
    
    // Mettre à jour la durée totale des pauses
    production.pauseDuration += pause.duration;
    
    // Sauvegarder les modifications
    await production.save();
    
    res.status(200).json({
      success: true,
      data: pause
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la fin de la pause',
      error: error.message
    });
  }
};

// @desc    Terminer une production
// @route   PUT /api/productions/:id/complete
// @access  Operator
exports.completeProduction = async (req, res) => {
  try {
    const { finalQuantity, wastageQuantity, notes, totalDuration } = req.body;
    
    const production = await Production.findById(req.params.id);
    if (!production) {
      return res.status(404).json({
        success: false,
        message: 'Production non trouvée'
      });
    }
    
    if (production.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Cette production est déjà terminée ou a échoué'
      });
    }
    
    // Mettre à jour les informations de fin de production
    production.finalQuantity = finalQuantity;
    production.wastageQuantity = wastageQuantity || 0;
    production.notes = notes;
    production.status = 'completed';
    production.endDate = new Date();
    
    // Mettre à jour la durée totale si fournie
    if (totalDuration) {
      production.totalDuration = totalDuration;
    } else {
      // Calculer la durée totale en secondes
      const startTimeMs = new Date(production.startDate).getTime();
      const endTimeMs = new Date().getTime();
      production.totalDuration = Math.round((endTimeMs - startTimeMs) / 1000);
    }
    
    await production.save();
    
    res.status(200).json({
      success: true,
      data: production
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la finalisation de la production',
      error: error.message
    });
  }
};

// @desc    Marquer une production comme échouée
// @route   PUT /api/productions/:id/fail
// @access  Operator
exports.failProduction = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const production = await Production.findById(req.params.id);
    if (!production) {
      return res.status(404).json({
        success: false,
        message: 'Production non trouvée'
      });
    }
    
    if (production.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Cette production est déjà terminée ou a échoué'
      });
    }
    
    // Marquer la production comme échouée
    production.status = 'failed';
    production.notes = reason || production.notes;
    production.endDate = new Date();
    
    // Calculer la durée totale
    const startTimeMs = new Date(production.startDate).getTime();
    const endTimeMs = new Date().getTime();
    production.totalDuration = Math.round((endTimeMs - startTimeMs) / 1000);
    
    await production.save();
    
    res.status(200).json({
      success: true,
      data: production
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage de la production comme échouée',
      error: error.message
    });
  }
};
