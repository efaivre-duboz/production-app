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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  LinearProgress,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningIcon from '@mui/icons-material/Warning';
import ScienceIcon from '@mui/icons-material/Science';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SpeedIcon from '@mui/icons-material/Speed';

const QualityControl = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [production, setProduction] = useState(null);
  const [qualityChecks, setQualityChecks] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  
  // Charger les données au montage
  useEffect(() => {
    loadQualityData();
  }, []);

  const loadQualityData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les données sauvegardées
      const productData = JSON.parse(localStorage.getItem('currentProductData') || '{}');
      const productCode = localStorage.getItem('currentProductCode');
      const batchNumber = localStorage.getItem('currentBatchNumber');
      
      if (!productData.code || !productCode) {
        setError('Données de production manquantes. Veuillez recommencer depuis le scan.');
        return;
      }
      
      setProduct(productData);
      
      // Données de production
      const productionData = {
        productCode: productCode,
        batchNumber: batchNumber,
        operator: localStorage.getItem('currentOperator') || 'Utilisateur',
        startTime: localStorage.getItem('productionStartTime')
      };
      setProduction(productionData);
      
      // Préparer les contrôles qualité
      if (productData.recipe && productData.recipe.qualityChecks) {
        const checks = productData.recipe.qualityChecks.map((check, index) => ({
          id: index + 1,
          name: check.name,
          type: check.type,
          expectedValue: check.expectedValue,
          actualValue: '',
          result: '',
          notes: '',
          icon: getCheckIcon(check.type)
        }));
        setQualityChecks(checks);
      }
      
      // Vérifier si déjà soumis
      const savedQualityData = localStorage.getItem('qualityControlData');
      if (savedQualityData) {
        const parsedData = JSON.parse(savedQualityData);
        setQualityChecks(parsedData.checks);
        setFormSubmitted(parsedData.submitted || false);
      }
      
    } catch (err) {
      console.error('Erreur lors du chargement des données qualité:', err);
      setError('Erreur lors du chargement des données de contrôle qualité');
    } finally {
      setLoading(false);
    }
  };

  const getCheckIcon = (type) => {
    switch (type) {
      case 'visuel': return <VisibilityIcon />;
      case 'physique': return <SpeedIcon />;
      case 'chimique': return <ScienceIcon />;
      case 'olfactif': return <VisibilityIcon />;
      default: return <ScienceIcon />;
    }
  };

  const getCheckColor = (type) => {
    switch (type) {
      case 'visuel': return 'primary';
      case 'physique': return 'secondary';
      case 'chimique': return 'error';
      case 'olfactif': return 'success';
      default: return 'default';
    }
  };

  const handleCheckChange = (checkId, field, value) => {
    setQualityChecks(prevChecks => 
      prevChecks.map(check => 
        check.id === checkId 
          ? { ...check, [field]: value }
          : check
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const incompleteChecks = qualityChecks.filter(check => 
      !check.result || (check.type === 'chimique' && !check.actualValue)
    );
    
    if (incompleteChecks.length > 0) {
      setError(`Veuillez compléter tous les contrôles : ${incompleteChecks.map(c => c.name).join(', ')}`);
      return;
    }
    
    // Sauvegarder les données
    const qualityData = {
      checks: qualityChecks,
      submitted: true,
      submittedAt: new Date().toISOString()
    };
    
    localStorage.setItem('qualityControlData', JSON.stringify(qualityData));
    localStorage.setItem('qualityControlCompleted', 'true');
    
    setFormSubmitted(true);
    setError('');
    
    console.log('✅ Contrôle qualité complété:', qualityData);
  };
  
  const handleContinue = () => {
    navigate('/end');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Calculer les statistiques
  const completedChecks = qualityChecks.filter(check => check.result).length;
  const conformeChecks = qualityChecks.filter(check => check.result === 'conforme').length;
  const nonConformeChecks = qualityChecks.filter(check => check.result === 'non-conforme').length;
  const progressPercentage = qualityChecks.length > 0 ? (completedChecks / qualityChecks.length) * 100 : 0;

  // Séparer les contrôles par type
  const checksByType = qualityChecks.reduce((acc, check) => {
    if (!acc[check.type]) acc[check.type] = [];
    acc[check.type].push(check);
    return acc;
  }, {});

  const steps = ['Scan de production', 'Recette et instructions', 'Contrôle qualité', 'Fin de production'];

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography>Chargement des données de contrôle qualité...</Typography>
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
            Retour au scan
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Contrôle Qualité
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
          Effectuez les vérifications de qualité requises pour ce lot de production
        </Typography>

        <Stepper activeStep={2} alternativeLabel sx={{ mb: 4 }}>
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
        
        {formSubmitted ? (
          <Paper sx={{ p: 4, mb: 3, textAlign: 'center' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Contrôle qualité complété avec succès
            </Typography>
            <Typography variant="body1" paragraph>
              Les informations de contrôle qualité ont été enregistrées.
            </Typography>
            
            {/* Résumé des résultats */}
            <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {conformeChecks}
                    </Typography>
                    <Typography variant="body2">
                      Contrôles conformes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">
                      {nonConformeChecks}
                    </Typography>
                    <Typography variant="body2">
                      Non-conformités
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      {completedChecks}
                    </Typography>
                    <Typography variant="body2">
                      Total vérifié
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              onClick={handleContinue}
              sx={{ mt: 2 }}
            >
              Continuer vers la fin de production
            </Button>
          </Paper>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
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
                    {production?.startTime ? new Date(production.startTime).toLocaleDateString() : new Date().toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>

              {/* Progression */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Progression des contrôles:
                  </Typography>
                  <Chip 
                    label={`${completedChecks}/${qualityChecks.length} complétés`}
                    color={completedChecks === qualityChecks.length ? 'success' : 'default'}
                  />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercentage} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Tous les contrôles" />
                <Tab label="Par type" />
                <Tab label="Résumé" />
              </Tabs>

              {/* Onglet 1: Tous les contrôles */}
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  {qualityChecks.map((check) => (
                    <Grid item xs={12} md={6} key={check.id}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ color: `${getCheckColor(check.type)}.main`, mr: 1 }}>
                              {check.icon}
                            </Box>
                            <Typography variant="h6">
                              {check.name}
                            </Typography>
                            <Chip 
                              label={check.type} 
                              size="small" 
                              color={getCheckColor(check.type)}
                              sx={{ ml: 'auto' }}
                            />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Valeur attendue: <strong>{check.expectedValue}</strong>
                          </Typography>

                          {check.type === 'chimique' && (
                            <TextField
                              label="Valeur mesurée"
                              name={`actualValue-${check.id}`}
                              value={check.actualValue}
                              onChange={(e) => handleCheckChange(check.id, 'actualValue', e.target.value)}
                              fullWidth
                              sx={{ mb: 2 }}
                              placeholder="ex: 7.2"
                            />
                          )}

                          <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }} required>
                            <FormLabel component="legend">Résultat</FormLabel>
                            <RadioGroup
                              name={`result-${check.id}`}
                              value={check.result}
                              onChange={(e) => handleCheckChange(check.id, 'result', e.target.value)}
                              row
                            >
                              <FormControlLabel value="conforme" control={<Radio />} label="Conforme" />
                              <FormControlLabel value="non-conforme" control={<Radio />} label="Non conforme" />
                            </RadioGroup>
                          </FormControl>

                          <TextField
                            label="Notes (optionnel)"
                            name={`notes-${check.id}`}
                            value={check.notes}
                            onChange={(e) => handleCheckChange(check.id, 'notes', e.target.value)}
                            multiline
                            rows={2}
                            fullWidth
                            placeholder="Observations particulières..."
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Onglet 2: Par type */}
              {tabValue === 1 && (
                <Box>
                  {Object.entries(checksByType).map(([type, checks]) => (
                    <Paper key={type} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                        Contrôles {type}s
                      </Typography>
                      <Grid container spacing={2}>
                        {checks.map((check) => (
                          <Grid item xs={12} sm={6} key={check.id}>
                            <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                              <Typography variant="subtitle1">{check.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Attendu: {check.expectedValue}
                              </Typography>
                              {check.result && (
                                <Chip 
                                  label={check.result} 
                                  color={check.result === 'conforme' ? 'success' : 'error'}
                                  size="small"
                                  sx={{ mt: 1 }}
                                />
                              )}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  ))}
                </Box>
              )}

              {/* Onglet 3: Résumé */}
              {tabValue === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary.main">
                          {completedChecks}
                        </Typography>
                        <Typography variant="body1">
                          Contrôles effectués
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          sur {qualityChecks.length} au total
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main">
                          {conformeChecks}
                        </Typography>
                        <Typography variant="body1">
                          Conformes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {qualityChecks.length > 0 ? Math.round((conformeChecks / qualityChecks.length) * 100) : 0}% du total
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="error.main">
                          {nonConformeChecks}
                        </Typography>
                        <Typography variant="body1">
                          Non-conformes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {nonConformeChecks > 0 ? 'Attention requise' : 'Aucun problème'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                variant="outlined"
                onClick={() => navigate('/recipe')}
              >
                Retour aux instructions
              </Button>
              
              <Button 
                variant="contained" 
                color="primary"
                type="submit"
                size="large"
                disabled={completedChecks < qualityChecks.length}
                startIcon={nonConformeChecks > 0 ? <WarningIcon /> : <CheckCircleOutlineIcon />}
              >
                {nonConformeChecks > 0 ? 
                  `Valider avec ${nonConformeChecks} non-conformité(s)` : 
                  'Valider le contrôle qualité'
                }
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default QualityControl;