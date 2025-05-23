// frontend/src/pages/ProductionScan.jsx - Version intégrée avec API complète
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  QrCodeScanner as QrCodeScannerIcon,
  Numbers as NumbersIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Hooks et services
import { useProduction, useProducts } from '../hooks/useApiIntegration';
import { useNotificationContext, useErrorHandler } from '../components/system/NotificationSystem';
import { useAuth } from '../context/AuthContext';

const ProductionScan = () => {
  // States locaux
  const [productCode, setProductCode] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [scanning, setScanning] = useState(false);
  const [recentProductions, setRecentProductions] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { notifySuccess, notifyError, notifyWarning } = useNotificationContext();
  const { handleApiError } = useErrorHandler();
  
  // Hooks d'intégration API
  const {
    loading: productionLoading,
    error: productionError,
    startProduction
  } = useProduction();
  
  const {
    loading: productLoading,
    error: productError,
    loadProductByCode
  } = useProducts();

  // Charger les productions récentes au chargement
  useEffect(() => {
    loadRecentProductions();
  }, []);

  // Charger les productions récentes
  const loadRecentProductions = async () => {
    try {
      setLoadingRecent(true);
      
      // Import dynamique pour éviter les dépendances circulaires
      const ProductionService = (await import('../services/productionService')).default;
      const result = await ProductionService.getProductions({
        limit: 5,
        sortBy: 'startDate',
        sortOrder: 'desc'
      });
      
      if (result.success) {
        setRecentProductions(result.data || []);
      } else {
        // En cas d'erreur, utiliser des données locales si disponibles
        const localData = localStorage.getItem('recentProductions');
        if (localData) {
          setRecentProductions(JSON.parse(localData));
          notifyWarning('Données locales utilisées (serveur indisponible)');
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des productions récentes:', error);
      handleApiError(error, 'Chargement des productions récentes');
    } finally {
      setLoadingRecent(false);
    }
  };

  // Simuler un scan de code-barres
  const handleScan = async () => {
    try {
      setScanning(true);
      
      // Simulation du scan - en réalité, cela utiliserait une caméra
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Pour la démo, utiliser des codes prédéfinis
      const mockCodes = ['A123', 'B456', 'C789'];
      const scannedCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
      const scannedBatch = `L${Date.now().toString().slice(-6)}`;
      
      setProductCode(scannedCode);
      setBatchNumber(scannedBatch);
      
      notifySuccess(`Code scanné: ${scannedCode}`, { title: 'Scan réussi' });
      
      // Vérifier automatiquement le produit après le scan
      await checkAndStartProduction(scannedCode, scannedBatch);
      
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      notifyError('Erreur lors du scan du code-barres');
    } finally {
      setScanning(false);
    }
  };

  // Gestion de la saisie manuelle
  const handleManualEntry = async () => {
    if (!productCode.trim() || !batchNumber.trim()) {
      notifyWarning('Veuillez saisir un code produit et un numéro de lot');
      return;
    }
    
    await checkAndStartProduction(productCode.trim(), batchNumber.trim());
  };

  // Vérifier le produit et démarrer la production
  const checkAndStartProduction = async (code, batch) => {
    try {
      // 1. Vérifier que le produit existe
      notifySuccess('Vérification du produit...', { title: 'Validation en cours' });
      
      const productResult = await loadProductByCode(code);
      
      if (!productResult.success) {
        notifyError(`Produit "${code}" non trouvé`, { title: 'Produit invalide' });
        return;
      }

      const product = productResult.data;
      
      // 2. Vérifier que le produit est actif
      if (product.status !== 'active') {
        notifyWarning(`Le produit "${code}" n'est pas actif`, { title: 'Produit inactif' });
        return;
      }

      // 3. Démarrer la production
      const productionData = {
        productCode: code,
        batchNumber: batch,
        operator: currentUser?.name || 'Opérateur inconnu'
      };

      const productionResult = await startProduction(productionData);
      
      if (productionResult.success) {
        // Sauvegarder localement pour le mode hors ligne
        const productionInfo = {
          ...productionResult.data,
          product: product
        };
        localStorage.setItem('currentProduction', JSON.stringify(productionInfo));
        
        notifySuccess(
          `Production démarrée pour le lot ${batch}`,
          { title: 'Production créée' }
        );
        
        // Rediriger vers la page de recette
        navigate('/recipe');
      } else {
        // Gestion spécifique des erreurs de production
        if (productionResult.error?.includes('lot')) {
          notifyError(`Le lot "${batch}" existe déjà`, { title: 'Lot en double' });
        } else {
          handleApiError(new Error(productionResult.message), 'Démarrage de production');
        }
      }
      
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      handleApiError(error, 'Vérification du produit');
    }
  };

  // Reprendre une production existante
  const handleResumeProduction = (production) => {
    localStorage.setItem('currentProductionId', production.id);
    notifySuccess(`Reprise de la production du lot ${production.batchNumber}`);
    navigate('/recipe');
  };

  // Calculer les statistiques des productions récentes
  const recentStats = {
    total: recentProductions.length,
    completed: recentProductions.filter(p => p.status === 'completed').length,
    inProgress: recentProductions.filter(p => p.status === 'in_progress').length,
    failed: recentProductions.filter(p => p.status === 'failed').length
  };

  const isLoading = productionLoading || productLoading;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Scan de Production
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
          Scannez ou saisissez le code de produit pour commencer la production
        </Typography>

        {/* Alertes d'erreur */}
        {(productionError || productError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {productionError || productError}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Section Scanner */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <QrCodeScannerIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" component="h2" gutterBottom>
                  Scanner le code-barres
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Placez le scanner sur le code-barres du produit
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  fullWidth
                  onClick={handleScan}
                  disabled={scanning || isLoading}
                  startIcon={scanning ? <CircularProgress size={20} /> : undefined}
                >
                  {scanning ? 'Scan en cours...' : 'Scanner maintenant'}
                </Button>
                
                {/* Affichage du code scanné */}
                {productCode && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1, width: '100%' }}>
                    <Typography variant="body2" color="success.contrastText">
                      Code scanné: <strong>{productCode}</strong>
                    </Typography>
                    <Typography variant="body2" color="success.contrastText">
                      Lot: <strong>{batchNumber}</strong>
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Section Saisie manuelle */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <NumbersIcon sx={{ fontSize: 80, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" component="h2" gutterBottom>
                  Saisie manuelle
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Entrez le code du produit et le numéro de lot manuellement
                </Typography>
                <TextField
                  fullWidth
                  label="Code produit"
                  variant="outlined"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value.toUpperCase())}
                  sx={{ mb: 2 }}
                  disabled={isLoading}
                  placeholder="Ex: A123, B456..."
                />
                <TextField
                  fullWidth
                  label="Numéro de lot"
                  variant="outlined"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value.toUpperCase())}
                  sx={{ mb: 2 }}
                  disabled={isLoading}
                  placeholder="Ex: L789..."
                />
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  fullWidth
                  onClick={handleManualEntry}
                  disabled={isLoading || !productCode.trim() || !batchNumber.trim()}
                  startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
                >
                  {isLoading ? 'Vérification...' : 'Continuer'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Statistiques rapides */}
        <Paper sx={{ mt: 4, p: 2, bgcolor: 'primary.light' }}>
          <Grid container spacing={2} sx={{ textAlign: 'center' }}>
            <Grid item xs={3}>
              <Typography variant="h6" color="primary.contrastText">
                {recentStats.total}
              </Typography>
              <Typography variant="body2" color="primary.contrastText">
                Total
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" color="primary.contrastText">
                {recentStats.completed}
              </Typography>
              <Typography variant="body2" color="primary.contrastText">
                Terminées
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" color="primary.contrastText">
                {recentStats.inProgress}
              </Typography>
              <Typography variant="body2" color="primary.contrastText">
                En cours
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" color="primary.contrastText">
                {recentStats.failed}
              </Typography>
              <Typography variant="body2" color="primary.contrastText">
                Échouées
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Productions récentes */}
        <Paper sx={{ mt: 4, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <HistoryIcon sx={{ mr: 1 }} />
              Dernières productions
            </Typography>
            <Button
              size="small"
              startIcon={loadingRecent ? <CircularProgress size={16} /> : <RefreshIcon />}
              onClick={loadRecentProductions}
              disabled={loadingRecent}
            >
              Actualiser
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {loadingRecent ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : recentProductions.length > 0 ? (
            <List>
              {recentProductions.map((production) => (
                <ListItem
                  key={production.id}
                  button={production.status === 'in_progress'}
                  onClick={() => production.status === 'in_progress' && handleResumeProduction(production)}
                  divider
                >
                  <ListItemIcon>
                    {production.status === 'completed' ? (
                      <CheckCircleIcon color="success" />
                    ) : production.status === 'failed' ? (
                      <ErrorIcon color="error" />
                    ) : (
                      <CircularProgress size={24} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${production.productCode} - Lot ${production.batchNumber}`}
                    secondary={`${production.operator} - ${new Date(production.startDate).toLocaleDateString()}`}
                  />
                  <Chip
                    label={
                      production.status === 'completed' ? 'Terminée' :
                      production.status === 'in_progress' ? 'En cours' :
                      production.status === 'failed' ? 'Échouée' : production.status
                    }
                    color={
                      production.status === 'completed' ? 'success' :
                      production.status === 'in_progress' ? 'warning' :
                      production.status === 'failed' ? 'error' : 'default'
                    }
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
              Aucune production récente
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ProductionScan;