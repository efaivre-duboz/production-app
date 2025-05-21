import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  LinearProgress,
  Alert,
  CircularProgress
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Composants personnalisés
import InstructionSteps from '../components/production/InstructionSteps';
import IngredientsTable from '../components/production/IngredientsTable';
import PauseButton from '../components/production/PauseButton';

// Services
import ProductService from '../services/productService';
import ProductionService from '../services/productionService';

const Recipe = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [product, setProduct] = useState(null);
  const [production, setProduction] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [ingredientsValidated, setIngredientsValidated] = useState(false);
  const [instructionsCompleted, setInstructionsCompleted] = useState(false);
  const [currentPause, setCurrentPause] = useState(null);

  // Charger les données de production au chargement de la page
  useEffect(() => {
    loadProductionData();
  }, []);

  const loadProductionData = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'ID de la production en cours depuis le localStorage
      const productionId = localStorage.getItem('currentProductionId');
      
      if (!productionId) {
        // Si pas d'ID trouvé, rediriger vers la page de scan
        navigate('/');
        return;
      }
      
      // En production réelle, décommentez ce code pour charger depuis l'API
      /*
      // Charger les données de la production
      const productionResponse = await ProductionService.getProductionById(productionId);
      
      if (!productionResponse.success) {
        setError("Erreur lors du chargement des données de production");
        return;
      }
      
      const productionData = productionResponse.data;
      setProduction(productionData);
      
      // Charger les données du produit associé
      const productResponse = await ProductService.getProductByCode(productionData.productCode);
      
      if (!productResponse.success) {
        setError("Erreur lors du chargement des données du produit");
        return;
      }
      
      setProduct(productResponse.data);
      
      // Préparer les ingrédients pour l'affichage
      setIngredients(productionData.ingredients);
      */
      
      // Pour le développement, utiliser des données factices
      // Simuler le chargement des données
      setTimeout(() => {
        // Données factices du produit
        const mockProduct = {
          code: "A123",
          name: "Nettoyant Multi-Surfaces",
          recipe: {
            ingredients: [
              { id: 1, name: 'Eau déminéralisée', required: 75.0, unit: 'kg', info: 'Température ambiante (20-25°C)' },
              { id: 2, name: 'Polymère A', required: 15.0, unit: 'kg', info: 'Ajouter lentement pour éviter la formation de grumeaux' },
              { id: 3, name: 'Additif B', required: 5.0, unit: 'kg' },
              { id: 4, name: 'Colorant C', required: 2.5, unit: 'kg', info: 'Vérifier la couleur après mélange complet' },
              { id: 5, name: 'Conservateur D', required: 1.5, unit: 'kg' },
              { id: 6, name: 'Parfum E', required: 1.0, unit: 'kg' }
            ],
            steps: [
              { order: 1, title: "Préparation", instructions: "Vérifier que tous les équipements sont propres et prêts à l'emploi. Peser tous les ingrédients selon les quantités spécifiées. S'assurer que la température de la cuve est entre 20°C et 25°C.", duration: 20 },
              { order: 2, title: "Mélange initial", instructions: "Verser l'eau déminéralisée dans la cuve principale. Démarrer l'agitateur à vitesse lente (100-150 RPM). Ajouter lentement le Polymère A tout en maintenant l'agitation. Continuer l'agitation pendant 15 minutes jusqu'à dissolution complète.", duration: 30 },
              { order: 3, title: "Ajout des additifs", instructions: "Ajouter l'Additif B lentement tout en maintenant l'agitation. Après 5 minutes, ajouter le Colorant C et mélanger pendant 10 minutes. Ajouter le Conservateur D et continuer l'agitation pendant 5 minutes.", duration: 25 },
              { order: 4, title: "Finition", instructions: "Réduire la vitesse d'agitation à 80-100 RPM. Ajouter le Parfum E et mélanger pendant 10 minutes supplémentaires. Vérifier visuellement l'homogénéité du mélange. Arrêter l'agitation et procéder au contrôle qualité.", duration: 15 }
            ]
          }
        };
        
        // Données factices de la production
        const mockProduction = {
          id: "temp_id",
          productCode: "A123",
          batchNumber: "L789",
          startDate: new Date().toISOString(),
          status: "in_progress",
          pauseHistory: []
        };
        
        setProduct(mockProduct);
        setProduction(mockProduction);
        
        // Préparer les ingrédients pour l'affichage
        setIngredients(mockProduct.recipe.ingredients.map(ing => ({
          ...ing,
          actual: ''
        })));
        
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      setError("Une erreur est survenue lors du chargement des données");
      setLoading(false);
    }
  };

  const handleIngredientChange = (id, value) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, actual: value } : ing
    ));
  };

  const handleIngredientsValidate = async () => {
    try {
      // En production réelle, envoyer les données au serveur
      /*
      const response = await ProductionService.updateIngredients(production.id, ingredients);
      
      if (!response.success) {
        throw new Error(response.message || "Erreur lors de la validation des ingrédients");
      }
      */
      
      // Marquer les ingrédients comme validés
      setIngredientsValidated(true);
      // Passer à l'onglet des instructions
      setActiveTab(1);
    } catch (err) {
      console.error("Erreur lors de la validation des ingrédients:", err);
      setError("Erreur lors de la validation des ingrédients");
    }
  };

  const handleInstructionsComplete = () => {
    setInstructionsCompleted(true);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleContinue = () => {
    navigate('/quality');
  };
  
  const handlePauseStart = async (reason, category) => {
    try {
      // En production réelle, enregistrer la pause dans le backend
      /*
      const response = await ProductionService.recordPause(production.id, {
        startTime: new Date(),
        reason,
        category
      });
      
      if (!response.success) {
        throw new Error(response.message || "Erreur lors de l'enregistrement de la pause");
      }
      
      // Stocker l'ID de la pause en cours
      setCurrentPause(response.data);
      */
      
      // Pour le développement, simuler une pause
      setCurrentPause({
        id: `pause_${Date.now()}`,
        startTime: new Date(),
        reason,
        category
      });
      
    } catch (err) {
      console.error("Erreur lors du démarrage de la pause:", err);
      setError("Erreur lors du démarrage de la pause");
    }
  };
  
  const handlePauseEnd = async () => {
    if (!currentPause) return;
    
    try {
      // En production réelle, terminer la pause dans le backend
      /*
      const response = await ProductionService.endPause(
        production.id, 
        currentPause.id, 
        new Date()
      );
      
      if (!response.success) {
        throw new Error(response.message || "Erreur lors de la fin de la pause");
      }
      */
      
      // Réinitialiser la pause en cours
      setCurrentPause(null);
      
    } catch (err) {
      console.error("Erreur lors de la fin de la pause:", err);
      setError("Erreur lors de la fin de la pause");
    }
  };

  // Calculer la progression globale
  const progress = [
    ingredientsValidated ? 50 : 0,
    instructionsCompleted ? 50 : 0
  ].reduce((a, b) => a + b, 0);
  
  const steps = ['Scan de production', 'Recette et instructions', 'Contrôle qualité', 'Fin de production'];
  
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Chargement des données de production...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/')}>
            Retour à la page de scan
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Recette et Instructions
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
          Suivez la recette et entrez les quantités réelles utilisées
        </Typography>
        
        <Stepper activeStep={1} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Composant de pause */}
        <PauseButton 
          isPaused={!!currentPause}
          onPauseStart={handlePauseStart}
          onPauseEnd={handlePauseEnd}
        />
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1, mb: 3 }}>
            Informations du produit
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" color="text.secondary">
                Produit:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {product.name} ({product.code})
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" color="text.secondary">
                Lot:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {production.batchNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" color="text.secondary">
                Date de production:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {new Date(production.startDate).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Progression de la production:
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                0%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progress}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                100%
              </Typography>
            </Box>
          </Box>
          
          {progress < 100 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Complétez toutes les étapes pour pouvoir continuer vers le contrôle qualité.
              </Typography>
            </Alert>
          )}
          
          {progress === 100 && (
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Toutes les étapes ont été complétées. Vous pouvez maintenant passer au contrôle qualité.
              </Typography>
            </Alert>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Ingrédients" />
              <Tab label="Instructions" />
            </Tabs>
            
            <Box sx={{ py: 3 }}>
              {activeTab === 0 && (
                <IngredientsTable 
                  ingredients={ingredients} 
                  onChange={handleIngredientChange}
                  onValidate={handleIngredientsValidate}
                />
              )}
              
              {activeTab === 1 && (
                <InstructionSteps 
                  instructions={product.recipe.steps.map(step => ({
                    title: step.title,
                    steps: step.instructions.split('. ').filter(s => s.trim()),
                    note: ''
                  }))}
                  onComplete={handleInstructionsComplete}
                />
              )}
            </Box>
          </Box>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleContinue}
            disabled={progress < 100}
            size="large"
          >
            Continuer vers le contrôle qualité
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Recipe;