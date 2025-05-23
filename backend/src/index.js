const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const authRoutes = require('../routes/authRoutes');
const productRoutes = require('../routes/productRoutes');
const productionRoutes = require('../routes/productionRoutes');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // L'URL de votre frontend
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/productions', productionRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'API fonctionnelle' });
});

// Fonction pour démarrer le serveur
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    console.log(`API accessible sur http://localhost:${PORT}`);
  });
};

// Connexion à MongoDB (avec fallback en cas d'échec)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Connexion à MongoDB établie avec succès');
      startServer();
    })
    .catch((err) => {
      console.error('Erreur lors de la connexion à MongoDB:', err.message);
      console.log('Démarrage du serveur sans MongoDB (mode développement)');
      startServer();
    });
} else {
  console.log('MONGO_URI non défini - Démarrage en mode développement sans MongoDB');
  startServer();
}

// Gestion des erreurs non interceptées
process.on('unhandledRejection', (err) => {
  console.log('ERREUR NON GÉRÉE:', err.message);
  // Ne pas arrêter le serveur en mode développement
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});