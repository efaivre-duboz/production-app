// @desc    Obtenir un produit par son ID
// @route   GET /api/products/:id  
// @access  Admin
exports.getProductById = exports.getProduct;

// @desc    Obtenir un produit par son code
// @route   GET /api/products/code/:code
// @access  Operator/Admin
exports.getProductByCode = async (req, res) => {
  try {
    const product = await Product.findOne({ code: req.params.code });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du produit',
      error: error.message
    });
  }
};
