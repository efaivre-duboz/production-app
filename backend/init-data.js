// backend/init-data.js
const mongoose = require('mongoose');
require('dotenv').config();

// Modèle Product simple
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

const Product = mongoose.model('Product', productSchema);

// Données de test
const testProducts = [
  {
    code: "A123",
    name: "Nettoyant Multi-Surfaces",
    category: "Nettoyants",
    description: "Nettoyant écologique multi-surfaces",
    status: "active",
    recipe: {
      ingredients: [
        { name: "Eau déminéralisée", quantity: 75.0, unit: "kg", notes: "Température ambiante" },
        { name: "Polymère A", quantity: 15.0, unit: "kg", notes: "Ajouter lentement" },
        { name: "Additif B", quantity: 5.0, unit: "kg", notes: "" },
        { name: "Colorant C", quantity: 2.5, unit: "kg", notes: "Vérifier la couleur" }
      ],
      steps: [
        { order: 1, title: "Préparation", instructions: "Vérifier équipements et peser ingrédients", duration: 20 },
        { order: 2, title: "Mélange initial", instructions: "Ajouter eau et polymère lentement", duration: 30 },
        { order: 3, title: "Ajout additifs", instructions: "Incorporer additifs et colorant", duration: 25 },
        { order: 4, title: "Finition", instructions: "Homogénéiser et contrôler", duration: 15 }
      ],
      qualityChecks: [
        { name: "Apparence", type: "visuel", expectedValue: "Liquide clair bleuté" },
        { name: "Viscosité", type: "physique", expectedValue: "3000-4000 cP" },
        { name: "pH", type: "chimique", expectedValue: "7.0-7.5" }
      ]
    }
  },
  {
    code: "B456",
    name: "Dégraissant Industriel",
    category: "Dégraissants", 
    description: "Dégraissant puissant pour usage industriel",
    status: "active",
    recipe: {
      ingredients: [
        { name: "Base solvant", quantity: 80.0, unit: "kg", notes: "" },
        { name: "Résine X", quantity: 12.0, unit: "kg", notes: "Chauffer à 40°C" },
        { name: "Durcisseur Y", quantity: 5.0, unit: "kg", notes: "" }
      ],
      steps: [
        { order: 1, title: "Préparation", instructions: "Préchauffer à 40°C", duration: 25 },
        { order: 2, title: "Mélange", instructions: "Ajouter base et résine", duration: 45 },
        { order: 3, title: "Durcissement", instructions: "Incorporer durcisseur", duration: 30 }
      ],
      qualityChecks: [
        { name: "Apparence", type: "visuel", expectedValue: "Liquide ambré" },
        { name: "Viscosité", type: "physique", expectedValue: "5000-6000 cP" }
      ]
    }
  }
];

async function initData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prodmaster');
    console.log('✅ Connexion MongoDB établie');
    
    // Supprimer les données existantes
    await Product.deleteMany({});
    console.log('🗑️  Données existantes supprimées');
    
    // Insérer les nouveaux produits
    const products = await Product.insertMany(testProducts);
    console.log(`✅ ${products.length} produits créés:`);
    
    products.forEach(product => {
      console.log(`   - ${product.code}: ${product.name}`);
    });
    
    console.log('\n🎉 Données de test initialisées avec succès!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

initData();