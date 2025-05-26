const mongoose = require('mongoose');
require('dotenv').config();

async function setupProduction() {
  try {
    console.log('🔄 Configuration de la base de données de production...');
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prodmaster');
    console.log('✅ Connexion à MongoDB établie');
    
    // Importer les modèles
    const User = require('./models/User.js');
    const Product = require('./models/Product.js');
    
    // Créer un utilisateur admin par défaut
    const adminExists = await User.findOne({ email: 'admin@prodmaster.com' });
    
    if (!adminExists) {
      await User.create({
        name: 'Administrateur',
        email: 'admin@prodmaster.com',
        password: 'Admin123!',
        role: 'admin'
      });
      console.log('✅ Utilisateur admin créé (admin@prodmaster.com / Admin123!)');
    }
    
    // Créer un opérateur par défaut
    const operatorExists = await User.findOne({ email: 'operator@prodmaster.com' });
    
    if (!operatorExists) {
      await User.create({
        name: 'Opérateur',
        email: 'operator@prodmaster.com',
        password: 'Operator123!',
        role: 'user'
      });
      console.log('✅ Utilisateur opérateur créé (operator@prodmaster.com / Operator123!)');
    }
    
    // Vérifier les produits
    const productCount = await Product.countDocuments();
    
    if (productCount === 0) {
      console.log('🔄 Initialisation des produits de démonstration...');
      
      // Exécuter le script d'initialisation des données
      try {
        require('./init-data.js');
        console.log('✅ Produits de démonstration créés');
      } catch (error) {
        console.error('⚠️ Erreur lors de l\'initialisation des produits:', error.message);
      }
    } else {
      console.log(`✅ ${productCount} produits déjà présents en base`);
    }
    
    console.log('\n🎉 Configuration de production terminée avec succès!');
    console.log('📋 Comptes créés:');
    console.log('   - Admin: admin@prodmaster.com / Admin123!');
    console.log('   - Opérateur: operator@prodmaster.com / Operator123!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Exécuter le setup si ce fichier est appelé directement
if (require.main === module) {
  setupProduction();
}

module.exports = setupProduction;