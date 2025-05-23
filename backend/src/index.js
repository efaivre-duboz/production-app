const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import des modèles (créer des versions simplifiées si nécessaire)
let Product;
try {
  Product = require('../models/Product');
} catch (error) {
  console.log('⚠️  Modèle Product non trouvé, création d\'un modèle simple...');
  // Modèle simple inline si le fichier n'existe pas
  const productSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: String,
    description: String,
    status: { type: String, default: 'active' },
    recipe: {
      ingredients: [{ name: String, quantity: Number, unit: String, notes: String }],
      steps: [{ order: Number, title: String, instructions: String, duration: Number }],
      qualityChecks: [{ name: String, type: String, expectedValue: String }]
    }
  }, { timestamps: true });
  
  Product = mongoose.model('Product', productSchema);
}

// Routes de base
app.get('/', (req, res) => {
  res.json({ 
    message: 'API ProdMaster fonctionnelle',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Routes API Products
app.get('/api/products', async (req, res) => {
  try {
    console.log('📦 Récupération des produits...');
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Erreur produits:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits',
      error: error.message
    });
  }
});

app.get('/api/products/code/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    console.log('📦 Recherche du produit:', code);
    
    let product = await Product.findOne({ code: code });
    
    // Si le produit n'est pas trouvé en base, utiliser des données factices
    if (!product) {
      console.log('⚠️ Produit non trouvé en base, utilisation de données factices');
      
      const mockProducts = {
        'A123': {
          code: "A123",
          name: "Nettoyant Multi-Surfaces",
          category: "Nettoyants",
          description: "Nettoyant écologique multi-surfaces",
          status: "active",
          recipe: {
            ingredients: [
              { _id: "1", name: "Eau déminéralisée", quantity: 75.0, unit: "kg", notes: "Température ambiante (20-25°C)" },
              { _id: "2", name: "Polymère A", quantity: 15.0, unit: "kg", notes: "Ajouter lentement pour éviter la formation de grumeaux" },
              { _id: "3", name: "Additif B", quantity: 5.0, unit: "kg", notes: "" },
              { _id: "4", name: "Colorant C", quantity: 2.5, unit: "kg", notes: "Vérifier la couleur après mélange complet" },
              { _id: "5", name: "Conservateur D", quantity: 1.5, unit: "kg", notes: "" },
              { _id: "6", name: "Parfum E", quantity: 1.0, unit: "kg", notes: "" }
            ],
            steps: [
              { order: 1, title: "Préparation", instructions: "Vérifier que tous les équipements sont propres et prêts à l'emploi. Peser tous les ingrédients selon les quantités spécifiées. S'assurer que la température de la cuve est entre 20°C et 25°C.", duration: 20 },
              { order: 2, title: "Mélange initial", instructions: "Verser l'eau déminéralisée dans la cuve principale. Démarrer l'agitateur à vitesse lente (100-150 RPM). Ajouter lentement le Polymère A tout en maintenant l'agitation. Continuer l'agitation pendant 15 minutes jusqu'à dissolution complète.", duration: 30 },
              { order: 3, title: "Ajout des additifs", instructions: "Ajouter l'Additif B lentement tout en maintenant l'agitation. Après 5 minutes, ajouter le Colorant C et mélanger pendant 10 minutes. Ajouter le Conservateur D et continuer l'agitation pendant 5 minutes.", duration: 25 },
              { order: 4, title: "Finition", instructions: "Réduire la vitesse d'agitation à 80-100 RPM. Ajouter le Parfum E et mélanger pendant 10 minutes supplémentaires. Vérifier visuellement l'homogénéité du mélange. Arrêter l'agitation et procéder au contrôle qualité.", duration: 15 }
            ],
            qualityChecks: [
              { name: "Apparence", type: "visuel", expectedValue: "Liquide clair, légèrement bleuté" },
              { name: "Viscosité", type: "physique", expectedValue: "3000-4000 cP" },
              { name: "pH", type: "chimique", expectedValue: "7.0-7.5" },
              { name: "Odeur", type: "olfactif", expectedValue: "Fraîcheur, légère note d'agrumes" }
            ]
          }
        },
        'B456': {
          code: "B456",
          name: "Dégraissant Industriel",
          category: "Dégraissants",
          description: "Dégraissant puissant pour surfaces industrielles",
          status: "active",
          recipe: {
            ingredients: [
              { _id: "1", name: "Base solvant", quantity: 80.0, unit: "kg", notes: "" },
              { _id: "2", name: "Résine X", quantity: 12.0, unit: "kg", notes: "Chauffer à 40°C avant utilisation" },
              { _id: "3", name: "Durcisseur Y", quantity: 5.0, unit: "kg", notes: "" },
              { _id: "4", name: "Additif Z", quantity: 3.0, unit: "kg", notes: "Protéger de la lumière" }
            ],
            steps: [
              { order: 1, title: "Préparation", instructions: "Préchauffer la cuve à 40°C. Vérifier l'étanchéité du système d'agitation. Peser tous les ingrédients selon les quantités spécifiées.", duration: 25 },
              { order: 2, title: "Mélange principal", instructions: "Verser la Base solvant dans la cuve. Activer l'agitateur à 200 RPM. Ajouter la Résine X préchauffée et mélanger pendant 20 minutes.", duration: 45 },
              { order: 3, title: "Ajout des composants secondaires", instructions: "Réduire l'agitation à 150 RPM. Ajouter lentement le Durcisseur Y pendant 10 minutes. Maintenir l'agitation pendant 15 minutes supplémentaires.", duration: 30 },
              { order: 4, title: "Finition", instructions: "Ajouter l'Additif Z et mélanger pendant 20 minutes. Réduire la température à 30°C tout en maintenant l'agitation. Procéder au contrôle qualité.", duration: 30 }
            ],
            qualityChecks: [
              { name: "Apparence", type: "visuel", expectedValue: "Liquide visqueux ambré" },
              { name: "Viscosité", type: "physique", expectedValue: "5000-6000 cP" },
              { name: "pH", type: "chimique", expectedValue: "9.0-9.5" },
              { name: "Test de dégraissage", type: "fonctionnel", expectedValue: "Dégraissage complet en moins de 2 minutes" }
            ]
          }
        }
      };
      
      product = mockProducts[code];
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produit "${code}" non trouvé. Codes disponibles: A123, B456`
        });
      }
    }
    
    console.log('✅ Produit trouvé:', product.name);
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erreur recherche produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche du produit',
      error: error.message
    });
  }
});

// Route Auth simple
app.post('/api/auth/login', async (req, res) => {
  const { name, password } = req.body;
  
  // Authentification simple pour le développement
  if (name === 'admin' && password === 'admin123') {
    res.json({
      success: true,
      user: { name: 'admin', role: 'admin' },
      token: 'fake-jwt-token'
    });
  } else if (name === 'operateur' && password === 'op123') {
    res.json({
      success: true,
      user: { name: 'operateur', role: 'user' },
      token: 'fake-jwt-token'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Identifiants incorrects'
    });
  }
});

// Route API de base (pour les appels à /api/)
app.get('/api', (req, res) => {
  res.json({
    message: 'API ProdMaster',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      productions: '/api/productions',
      auth: '/api/auth/login'
    }
  });
});

// Routes API Productions (données factices pour le développement)
app.get('/api/productions', async (req, res) => {
  try {
    console.log('🏭 Récupération des productions...');
    
    // Données factices de productions
    const mockProductions = [
      {
        id: "P001",
        productCode: "A123",
        batchNumber: "L789",
        startDate: "2025-05-12T08:15:00",
        endDate: "2025-05-12T14:30:00",
        status: "completed",
        operator: "Jean Dupont"
      },
      {
        id: "P002", 
        productCode: "B456",
        batchNumber: "L790",
        startDate: "2025-05-13T09:00:00",
        endDate: "2025-05-13T16:45:00",
        status: "completed",
        operator: "Marie Lambert"
      }
    ];
    
    res.json({
      success: true,
      count: mockProductions.length,
      data: mockProductions
    });
  } catch (error) {
    console.error('Erreur productions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des productions',
      error: error.message
    });
  }
});

app.get('/api/productions/:id', async (req, res) => {
  try {
    console.log('🏭 Recherche de la production:', req.params.id);
    
    // Production factice
    const mockProduction = {
      id: req.params.id,
      productCode: "A123",
      batchNumber: "L789",
      startDate: "2025-05-23T08:00:00",
      status: "in_progress",
      operator: "Test User",
      ingredients: [],
      qualityChecks: null
    };
    
    res.json({
      success: true,
      data: mockProduction
    });
  } catch (error) {
    console.error('Erreur recherche production:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche de la production',
      error: error.message
    });
  }
});

app.post('/api/productions', async (req, res) => {
  try {
    console.log('🏭 Création d\'une nouvelle production...');
    const { productCode, batchNumber, operator } = req.body;
    
    // Simulation de création
    const newProduction = {
      id: `P${Date.now()}`,
      productCode,
      batchNumber,
      operator,
      startDate: new Date().toISOString(),
      status: "in_progress",
      ingredients: [],
      qualityChecks: null
    };
    
    res.status(201).json({
      success: true,
      data: newProduction
    });
  } catch (error) {
    console.error('Erreur création production:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la production',
      error: error.message
    });
  }
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  console.log(`❌ Route non trouvée: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} non trouvée`
  });
});

// Gestion des erreurs
app.use((error, req, res, next) => {
  console.error('🚨 Erreur serveur:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

// Connexion à MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prodmaster');
    console.log('✅ Connexion à MongoDB établie');
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    // Continuer sans MongoDB pour les tests
    console.log('⚠️  Fonctionnement sans base de données');
  }
}

// Démarrer le serveur
async function startServer() {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
    console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  });
}

startServer();