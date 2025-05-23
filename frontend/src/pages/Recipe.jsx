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
  const [saving, setSaving] = useState(false);

  // Charger les données de production au chargement de la page
  useEffect(() => {
    loadProductionData();
  }, []);

  const loadProductionData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Récupérer le code produit depuis le localStorage (mis par ProductionScan)
      const productCode = localStorage.getItem('currentProductCode') || 'A123';
      const batchNumber = localStorage.getItem('currentBatchNumber') || 'L999';
      
      console.log('📦 Chargement des données pour:', { productCode, batchNumber });
      
      // Charger les données du produit depuis l'API
      const productResponse = await ProductService.getProductByCode(productCode);
      
      if (!productResponse.success) {
        throw new Error("Produit non trouvé dans l'API");
      }
      
      const productData = productResponse.data;
      setProduct(productData);
      
      // Créer une production fictive (en attendant l'API de production)
      const mockProduction = {
        id: `PROD_${Date.now()}`,
        productCode: productData.code,
        batchNumber: batchNumber,
        startDate: new Date().toISOString(),
        status: "in_progress",
        operator: "Utilisateur Actuel"
      };
      
      setProduction(mockProduction);
      
      // Préparer les ingrédients pour l'affichage
      if (productData.recipe && productData.recipe.ingredients) {
        setIngredients(productData.recipe.ingredients.map(ing => ({
          ...ing,
          id: ing._id || Math.random().toString(36),
          actual: ''
        })));
      }
      
      console.log('✅ Données chargées:', { product: productData.name, ingredients: productData.recipe?.ingredients?.length });
      
    } catch (err) {
      console.error("❌ Erreur lors du chargement des données:", err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientChange = (id, value) => {
    setIngredients(prevIngredients => 
      prevIngredients.map(ing => 
        ing.id === id ? { ...ing, actual: value } : ing
      )
    );
  };

  const handleIngredientsValidate = async () => {
    try {
      setSaving(true);
      
      // Vérifier que tous les ingrédients ont des valeurs
      const missingIngredients = ingredients.filter(ing => !ing.actual || ing.actual <= 0);
      if (missingIngredients.length > 0) {
        setError(`Veuillez remplir les quantités pour: ${missingIngredients.map(ing => ing.name).join(', ')}`);
        setSaving(false);
        return;
      }
      
      // Sauvegarder dans le localStorage pour l'instant
      localStorage.setItem('productionIngredients', JSON.stringify(ingredients));
      
      // En production réelle, décommentez ceci :
      /*
      const response = await ProductionService.updateIngredients(production.id, ingredients);
      if (!response.success) {
        throw new Error(response.message || "Erreur lors de la validation des ingrédients");
      }
      */
      
      setIngredientsValidated(true);
      setActiveTab(1); // Passer à l'onglet des instructions
      setError('');
      
      console.log('✅ Ingrédients validés:', ingredients.length);
      
    } catch (err) {
      console.error("❌ Erreur lors de la validation des ingrédients:", err);
      setError(`Erreur lors de la validation: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInstructionsComplete = () => {
    setInstructionsCompleted(true);
    
    // Sauvegarder l'état des instructions
    localStorage.setItem('productionInstructionsCompleted', 'true');
    
    console.log('✅ Instructions complétées');
  };

  const handleTabChange = (event, newValue) => {
    // Permettre de naviguer entre les onglets seulement si les prérequis sont remplis
    if (newValue === 1 && !ingredientsValidated) {
      setError('Veuillez d\'abord valider les ingrédients');
      return;
    }
    setActiveTab(newValue);
    setError(''); // Effacer les erreurs précédentes
  };

  const handleContinue = () => {
    // Sauvegarder l'état final avant de continuer
    localStorage.setItem('productionRecipeCompleted', 'true');
    navigate('/quality');
  };
  
  const handlePauseStart = async (reason, category) => {
    try {
      console.log('⏸️ Début de pause:', { reason, category });
      
      const pauseData = {
        id: `pause_${Date.now()}`,
        startTime: new Date(),
        reason,
        category
      };
      
      setCurrentPause(pauseData);
      
      // Sauvegarder la pause
      localStorage.setItem('currentPause', JSON.stringify(pauseData));
      
      // En production réelle :
      // await ProductionService.recordPause(production.id, pauseData);
      
    } catch (err) {
      console.error("❌ Erreur lors du démarrage de la pause:", err);
      setError("Erreur lors du démarrage de la pause");
    }
  };
  
  const handlePauseEnd = async () => {
    if (!currentPause) return;
    
    try {
      console.log('▶️ Fin de pause');
      
      setCurrentPause(null);
      localStorage.removeItem('currentPause');
      
      // En production réelle :
      // await ProductionService.endPause(production.id, currentPause.id, new Date());
      
    } catch (err) {
      console.error("❌ Erreur lors de la fin de la pause:", err);
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

  if (error && !product) {
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
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
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
                {product?.name} ({product?.code})
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" color="text.secondary">
                Lot:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {production?.batchNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" color="text.secondary">
                Date de production:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {production ? new Date(production.startDate).toLocaleDateString() : 'N/A'}
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
              <Tab 
                label="Ingrédients" 
                sx={{ 
                  color: ingredientsValidated ? 'success.main' : 'inherit',
                  fontWeight: ingredientsValidated ? 'bold' : 'normal'
                }}
              />
              <Tab 
                label="Instructions" 
                disabled={!ingredientsValidated}
                sx={{ 
                  color: instructionsCompleted ? 'success.main' : 'inherit',
                  fontWeight: instructionsCompleted ? 'bold' : 'normal'
                }}
              />
            </Tabs>
            
            <Box sx={{ py: 3 }}>
              {activeTab === 0 && (
                <IngredientsTable 
                  ingredients={ingredients} 
                  onChange={handleIngredientChange}
                  onValidate={handleIngredientsValidate}
                  disabled={saving}
                  validated={ingredientsValidated}
                />
              )}
              
              {activeTab === 1 && product?.recipe?.steps && (
                <InstructionSteps 
                  instructions={product.recipe.steps.map(step => ({
                    title: step.title,
                    steps: step.instructions.split('. ').filter(s => s.trim()),
                    note: `Durée estimée: ${step.duration} minutes`,
                    duration: step.duration
                  }))}
                  onComplete={handleInstructionsComplete}
                  completed={instructionsCompleted}
                />
              )}
            </Box>
          </Box>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
          >
            Retour au scan
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleContinue}
            disabled={progress < 100 || saving}
            size="large"
          >
            {saving ? 'Sauvegarde...' : 'Continuer vers le contrôle qualité'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Recipe;