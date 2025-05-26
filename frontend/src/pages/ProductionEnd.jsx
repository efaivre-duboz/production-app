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
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import HomeIcon from '@mui/icons-material/Home';

const ProductionEnd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [production, setProduction] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [qualityResults, setQualityResults] = useState([]);
  const [formData, setFormData] = useState({
    finalQuantity: '',
    wastageQuantity: '',
    productionNotes: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [productionSummary, setProductionSummary] = useState(null);
  
  // Charger les données au montage
  useEffect(() => {
    loadProductionData();
  }, []);

  const loadProductionData = async () => {
    try {
      setLoading(true);
      
      // Récupérer toutes les données sauvegardées
      const productData = JSON.parse(localStorage.getItem('currentProductData') || '{}');
      const productCode = localStorage.getItem('currentProductCode');
      const batchNumber = localStorage.getItem('currentBatchNumber');
      const startTime = localStorage.getItem('productionStartTime');
      const operator = localStorage.getItem('currentOperator');
      
      if (!productData.code || !productCode) {
        navigate('/');
        return;
      }
      
      setProduct(productData);
      
      // Données de production
      const productionData = {
        productCode: productCode,
        batchNumber: batchNumber,
        operator: operator || 'Utilisateur',
        startTime: startTime,
        endTime: null
      };
      setProduction(productionData);
      
      // Charger les ingrédients utilisés
      const savedIngredients = JSON.parse(localStorage.getItem('productionIngredients') || '[]');
      setIngredients(savedIngredients);
      
      // Charger les résultats qualité
      const qualityData = JSON.parse(localStorage.getItem('qualityControlData') || '{}');
      if (qualityData.checks) {
        setQualityResults(qualityData.checks);
      }
      
      // Vérifier si déjà soumis
      const endData = localStorage.getItem('productionEndData');
      if (endData) {
        const parsedEndData = JSON.parse(endData);
        setFormData(parsedEndData.formData);
        setFormSubmitted(parsedEndData.submitted || false);
        setProductionSummary(parsedEndData.summary);
      }
      
    } catch (err) {
      console.error('Erreur lors du chargement des données de fin:', err);
    } finally {
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
  
  const calculateProductionSummary = () => {
    const startTime = new Date(production.startTime);
    const endTime = new Date();
    const totalDuration = Math.round((endTime - startTime) / 1000); // en secondes
    
    // Calculer les totaux d'ingrédients
    const totalRequiredWeight = ingredients.reduce((sum, ing) => sum + (ing.quantity || 0), 0);
    const totalActualWeight = ingredients.reduce((sum, ing) => sum + (parseFloat(ing.actual) || 0), 0);
    
    // Statistiques qualité
    const totalQualityChecks = qualityResults.length;
    const conformeChecks = qualityResults.filter(q => q.result === 'conforme').length;
    const nonConformeChecks = qualityResults.filter(q => q.result === 'non-conforme').length;
    
    // Calculs de rendement
    const theoreticalYield = totalRequiredWeight;
    const actualQuantity = parseFloat(formData.finalQuantity) || 0;
    const wastage = parseFloat(formData.wastageQuantity) || 0;
    const totalYield = actualQuantity + wastage; // Changed from 'yield' to 'totalYield'
    const yieldPercentage = theoreticalYield > 0 ? ((totalYield / theoreticalYield) * 100) : 0;
    const wastePercentage = totalYield > 0 ? ((wastage / totalYield) * 100) : 0;
    
    return {
      productInfo: {
        code: product.code,
        name: product.name,
        batch: production.batchNumber,
        operator: production.operator
      },
      timing: {
        startTime: startTime,
        endTime: endTime,
        totalDuration: totalDuration,
        durationFormatted: formatDuration(totalDuration)
      },
      ingredients: {
        totalRequired: totalRequiredWeight,
        totalActual: totalActualWeight,
        deviation: totalActualWeight - totalRequiredWeight,
        deviationPercentage: totalRequiredWeight > 0 ? (((totalActualWeight - totalRequiredWeight) / totalRequiredWeight) * 100) : 0
      },
      quality: {
        totalChecks: totalQualityChecks,
        conforme: conformeChecks,
        nonConforme: nonConformeChecks,
        conformePercentage: totalQualityChecks > 0 ? ((conformeChecks / totalQualityChecks) * 100) : 0
      },
      yield: {
        theoretical: theoreticalYield,
        actual: actualQuantity,
        wastage: wastage,
        total: totalYield, // Changed from 'yield' to 'totalYield'
        yieldPercentage: yieldPercentage,
        wastePercentage: wastePercentage
      }
    };
  };
  
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.finalQuantity || parseFloat(formData.finalQuantity) <= 0) {
      alert('Veuillez saisir une quantité finale valide');
      return;
    }
    
    // Calculer le résumé de production
    const summary = calculateProductionSummary();
    setProductionSummary(summary);
    
    // Sauvegarder les données finales
    const endData = {
      formData: formData,
      submitted: true,
      submittedAt: new Date().toISOString(),
      summary: summary
    };
    
    localStorage.setItem('productionEndData', JSON.stringify(endData));
    localStorage.setItem('productionCompleted', 'true');
    
    setFormSubmitted(true);
    
    console.log('✅ Production terminée:', endData);
  };
  
  const handleNewProduction = () => {
    // Nettoyer toutes les données de production
    const keysToRemove = [
      'currentProductCode',
      'currentBatchNumber', 
      'currentProductData',
      'productionStartTime',
      'currentOperator',
      'currentProductionId',
      'productionIngredients',
      'productionInstructionsCompleted',
      'productionRecipeCompleted',
      'qualityControlData',
      'qualityControlCompleted',
      'productionEndData',
      'productionCompleted',
      'instructionProgress'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    navigate('/');
  };

  const handleShowSummary = () => {
    setShowSummary(true);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const steps = ['Scan de production', 'Recette et instructions', 'Contrôle qualité', 'Fin de production'];

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography>Chargement des données de fin de production...</Typography>
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
          Complétez les informations finales de production
        </Typography>
        
        <Stepper activeStep={3} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {!formSubmitted ? (
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Informations finales de production
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Quantité finale produite (kg)"
                    name="finalQuantity"
                    type="number"
                    value={formData.finalQuantity}
                    onChange={handleChange}
                    required
                    inputProps={{ step: "0.1", min: "0" }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Quantité de déchets (kg)"
                    name="wastageQuantity"
                    type="number"
                    value={formData.wastageQuantity}
                    onChange={handleChange}
                    inputProps={{ step: "0.1", min: "0" }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes de production"
                    name="productionNotes"
                    multiline
                    rows={4}
                    value={formData.productionNotes}
                    onChange={handleChange}
                    placeholder="Commentaires, observations, incidents..."
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/quality-control')}
                    >
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<TaskAltIcon />}
                    >
                      Terminer la production
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        ) : (
          <Box>
            <Alert severity="success" sx={{ mb: 4 }}>
              <Typography variant="h6">Production terminée avec succès !</Typography>
              <Typography>
                La production du lot {production?.batchNumber} est maintenant terminée.
              </Typography>
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Actions disponibles
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<HomeIcon />}
                        onClick={handleNewProduction}
                        fullWidth
                      >
                        Nouvelle production
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleShowSummary}
                        fullWidth
                      >
                        Voir le rapport
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={handlePrintReport}
                        fullWidth
                      >
                        Imprimer le rapport
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Résumé rapide
                    </Typography>
                    {productionSummary && (
                      <Box>
                        <Typography variant="body2">
                          <strong>Produit:</strong> {productionSummary.productInfo.name}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Lot:</strong> {productionSummary.productInfo.batch}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Durée:</strong> {productionSummary.timing.durationFormatted}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Rendement:</strong> {productionSummary.yield.yieldPercentage.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2">
                          <strong>Qualité:</strong> {productionSummary.quality.conformePercentage.toFixed(1)}% conforme
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Dialog pour afficher le rapport complet */}
        <Dialog 
          open={showSummary} 
          onClose={() => setShowSummary(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Rapport de production complet</DialogTitle>
          <DialogContent>
            {productionSummary && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Informations générales</Typography>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell><strong>Produit</strong></TableCell>
                          <TableCell>{productionSummary.productInfo.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Code</strong></TableCell>
                          <TableCell>{productionSummary.productInfo.code}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Lot</strong></TableCell>
                          <TableCell>{productionSummary.productInfo.batch}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Opérateur</strong></TableCell>
                          <TableCell>{productionSummary.productInfo.operator}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Durée</strong></TableCell>
                          <TableCell>{productionSummary.timing.durationFormatted}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Rendement</Typography>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell><strong>Rendement théorique</strong></TableCell>
                          <TableCell>{productionSummary.yield.theoretical.toFixed(2)} kg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Quantité produite</strong></TableCell>
                          <TableCell>{productionSummary.yield.actual.toFixed(2)} kg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Déchets</strong></TableCell>
                          <TableCell>{productionSummary.yield.wastage.toFixed(2)} kg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Rendement total</strong></TableCell>
                          <TableCell>
                            <Chip 
                              label={`${productionSummary.yield.yieldPercentage.toFixed(1)}%`}
                              color={productionSummary.yield.yieldPercentage >= 90 ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Contrôle qualité</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Total contrôles</strong></TableCell>
                          <TableCell><strong>Conformes</strong></TableCell>
                          <TableCell><strong>Non conformes</strong></TableCell>
                          <TableCell><strong>Taux de conformité</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{productionSummary.quality.totalChecks}</TableCell>
                          <TableCell>{productionSummary.quality.conforme}</TableCell>
                          <TableCell>{productionSummary.quality.nonConforme}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${productionSummary.quality.conformePercentage.toFixed(1)}%`}
                              color={productionSummary.quality.conformePercentage >= 95 ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSummary(false)}>Fermer</Button>
            <Button onClick={handlePrintReport} variant="contained">Imprimer</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ProductionEnd;