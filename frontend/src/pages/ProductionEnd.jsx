import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

// Composants
import ProductionSummary from '../components/production/ProductionSummary';

// Services
import ProductService from '../services/productService';
import ProductionService from '../services/productionService';

const ProductionEnd = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // États pour les données de production
  const [product, setProduct] = useState(null);
  const [production, setProduction] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [qualityChecks, setQualityChecks] = useState(null);
  const [pauseHistory, setPauseHistory] = useState([]);
  
  // États pour le formulaire de fin de production
  const [formData, setFormData] = useState({
    finalQuantity: '',
    wastageQuantity: '',
    productionNotes: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Charger les données de production au chargement
  useEffect(() => {
    loadProductionData();
  }, []);

  const loadProductionData = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'ID de la production en cours
      const productionId = localStorage.getItem('currentProductionId');
      
      if (!productionId) {
        navigate('/');
        return;
      }
      
      // En production réelle, décommentez ce code pour charger depuis l'API
      /*
      const productionResponse = await ProductionService.getProductionById(productionId);
      
      if (!productionResponse.success) {
        setError("Erreur lors du chargement des données de production");
        return;
      }
      
      const productionData = productionResponse.data;
      setProduction(productionData);
      
      const productResponse = await ProductService.getProductByCode(productionData.productCode);
      
      if (!productResponse.success) {
        setError("Erreur lors du chargement des données du produit");
        return;
      }
      
      setProduct(productResponse.data);
      setIngredients(productionData.ingredients);
      setQualityChecks(productionData.qualityChecks);
      setPauseHistory(productionData.pauseHistory);
      */
      
      // Pour le développement, utiliser des données factices
      setTimeout(() => {
        const mockProduct = {
          code: "A123",
          name: "Nettoyant Multi-Surfaces",
          category: "Nettoyants"
        };
        
        const mockProduction = {
          id: "temp_id",
          productCode: "A123",
          batchNumber: "L789",
          operator: "Jean Dupont",
          startDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // Il y a 6 heures
          totalDuration: 21600, // 6 heures en secondes
          pauseDuration: 1800, // 30 minutes en secondes
          status: "in_progress"
        };
        
        const mockIngredients = [
          { name: 'Eau déminéralisée', required: 75.0, actual: 74.8, unit: 'kg' },
          { name: 'Polymère A', required: 15.0, actual: 15.2, unit: 'kg' },
          { name: 'Additif B', required: 5.0, actual: 5.0, unit: 'kg' },
          { name: 'Colorant C', required: 2.5, actual: 2.4, unit: 'kg' },
          { name: 'Conservateur D', required: 1.5, actual: 1.5, unit: 'kg' },
          { name: 'Parfum E', required: 1.0, actual: 1.0, unit: 'kg' }
        ];
        
        const mockQualityChecks = {
          appearanceCheck: "conforme",
          viscosityCheck: "conforme",
          pHValue: "7.2",
          odorCheck: "conforme"
        };
        
        const mockPauseHistory = [
          {
            startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 4 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
            duration: 1800,
            reason: "Changement d'équipe",
            category: "personnel"
          }
        ];
        
        setProduct(mockProduct);
        setProduction(mockProduction);
        setIngredients(mockIngredients);
        setQualityChecks(mockQualityChecks);
        setPauseHistory(mockPauseHistory);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error("Erreur:", err);
      setError("Une erreur est survenue lors du chargement des données");
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // En production réelle, terminer la production dans l'API
      /*
      const completionData = {
        finalQuantity: parseFloat(formData.finalQuantity),
        wastageQuantity: parseFloat(formData.wastageQuantity) || 0,
        notes: formData.productionNotes
      };
      
      const response = await ProductionService.completeProduction(production.id, completionData);
      
      if (!response.success) {
        throw new Error("Erreur lors de la finalisation de la production");
      }
      */
      
      // Marquer comme soumis
      setFormSubmitted(true);
      
      // Nettoyer le localStorage
      localStorage.removeItem('currentProductionId');
      
      console.log('Données de fin de production:', formData);
      
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur lors de la finalisation de la production");
    }
  };
  
  const handleNewProduction = () => {
    navigate('/');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
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
          Fin de Production
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
          Finalisez votre production et consultez le résumé complet
        </Typography>
        
        <Stepper activeStep={3} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {formSubmitted ? (
          <Paper sx={{ p: 4, mb: 3, textAlign: 'center' }}>
            <TaskAltIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Production terminée avec succès
            </Typography>
            <Typography variant="body1" paragraph>
              Toutes les informations de production ont été enregistrées.
            </Typography>
            <Alert severity="success" sx={{ mb: 3, mx: 'auto', maxWidth: '80%' }}>
              Lot {production?.batchNumber} du produit {production?.productCode} a été complété et enregistré dans le système.
            </Alert>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              onClick={handleNewProduction}
              sx={{ mt: 2 }}
            >
              Commencer une nouvelle production
            </Button>
          </Paper>
        ) : (
          <>
            {/* Onglets pour le résumé et la finalisation */}
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab 
                  label="Résumé de Production" 
                  icon={<SummarizeIcon />} 
                  iconPosition="start" 
                />
                <Tab 
                  label="Finalisation" 
                  icon={<AssignmentTurnedInIcon />} 
                  iconPosition="start" 
                />
              </Tabs>
              
              <Box sx={{ p: 3 }}>
                {/* Onglet Résumé */}
                {activeTab === 0 && (
                  <ProductionSummary
                    product={product}
                    production={production}
                    ingredients={ingredients}
                    qualityChecks={qualityChecks}
                    pauseHistory={pauseHistory}
                  />
                )}
                
                {/* Onglet Finalisation */}
                {activeTab === 1 && (
                  <Box component="form" onSubmit={handleSubmit}>
                    <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1, mb: 3 }}>
                      Informations finales de production
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
                          {production?.startDate ? new Date(production.startDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1, mb: 3 }}>
                      Résultats de production
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Quantité finale produite (kg)"
                          name="finalQuantity"
                          value={formData.finalQuantity}
                          onChange={handleChange}
                          type="number"
                          InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                          fullWidth
                          required
                          helperText="Quantité totale de produit fini obtenue"
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Quantité de rebuts (kg)"
                          name="wastageQuantity"
                          value={formData.wastageQuantity}
                          onChange={handleChange}
                          type="number"
                          InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                          fullWidth
                          helperText="Quantité de produit non conforme ou perdue"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          label="Notes de production"
                          name="productionNotes"
                          value={formData.productionNotes}
                          onChange={handleChange}
                          multiline
                          rows={4}
                          fullWidth
                          placeholder="Ajoutez toute information pertinente concernant cette production (observations, incidents, recommandations, etc.)"
                        />
                      </Grid>
                    </Grid>

                    <Alert severity="info" sx={{ mt: 3, mb: 3 }}>
                      <Typography variant="body2">
                        Une fois la production finalisée, ces informations seront définitivement enregistrées 
                        et ne pourront plus être modifiées. Assurez-vous que toutes les données sont correctes.
                      </Typography>
                    </Alert>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        type="submit"
                        size="large"
                        disabled={!formData.finalQuantity}
                      >
                        Terminer la production
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ProductionEnd;