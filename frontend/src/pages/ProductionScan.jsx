import React, { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import NumbersIcon from '@mui/icons-material/Numbers';
import ProductService from '../services/productService';
import ProductionService from '../services/productionService';
import { useAuth } from '../context/AuthContext';

const ProductionScan = () => {
  const [productCode, setProductCode] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentProductions, setRecentProductions] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Charger les productions récentes
  React.useEffect(() => {
    if (currentUser) {
      loadRecentProductions();
    }
  }, [currentUser]);

  const loadRecentProductions = async () => {
    try {
      // Essayer de charger depuis l'API
      const response = await ProductionService.getProductions();
      if (response.success) {
        setRecentProductions(response.data.slice(0, 5));
      }
    } catch (err) {
      console.log("Utilisation de données factices pour les productions récentes");
      // Utiliser des données factices en cas d'erreur API
      setRecentProductions([
        { id: "P001", productCode: "A123", batchNumber: "L789", date: "2025-05-12", status: "completed" },
        { id: "P002", productCode: "B456", batchNumber: "L790", date: "2025-05-13", status: "completed" }
      ]);
    }
  };

  const handleScan = async () => {
    try {
      setScanning(true);
      setError('');
      
      // Simuler un scan qui trouve un code produit
      setTimeout(async () => {
        try {
          // Simuler la lecture d'un code-barres
          const scannedCode = "A123"; // Code scanné
          const scannedBatch = `L${Date.now().toString().slice(-6)}`; // Lot généré
          
          setProductCode(scannedCode);
          setBatchNumber(scannedBatch);
          
          // Vérifier le produit et démarrer la production
          await checkProductAndStartProduction(scannedCode, scannedBatch);
        } catch (err) {
          console.error("Erreur lors du scan:", err);
          setError(err.message || "Erreur lors du scan");
        } finally {
          setScanning(false);
        }
      }, 1500);
    } catch (err) {
      setScanning(false);
      setError("Erreur lors du scan");
      console.error(err);
    }
  };

  const handleManualEntry = async () => {
    if (!productCode || !batchNumber) {
      setError('Veuillez saisir un code produit et un numéro de lot');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await checkProductAndStartProduction(productCode, batchNumber);
    } catch (err) {
      console.error("Erreur lors de la saisie manuelle:", err);
      setError(err.message || "Erreur lors de la vérification du produit");
    } finally {
      setLoading(false);
    }
  };
  
  const checkProductAndStartProduction = async (code, batch) => {
    try {
      console.log('🔍 Vérification du produit:', code);
      
      // Vérifier si le produit existe dans l'API
      const productResponse = await ProductService.getProductByCode(code);
      
      if (!productResponse.success) {
        throw new Error(`Produit "${code}" non trouvé dans le système`);
      }
      
      const product = productResponse.data;
      console.log('✅ Produit trouvé:', product.name);
      
      // Vérifier que le produit a une recette
      if (!product.recipe || !product.recipe.ingredients || product.recipe.ingredients.length === 0) {
        throw new Error(`Le produit "${code}" n'a pas de recette définie`);
      }
      
      // Vérifier que le lot n'existe pas déjà (simulation)
      const existingBatches = JSON.parse(localStorage.getItem('usedBatches') || '[]');
      if (existingBatches.includes(batch)) {
        throw new Error(`Le numéro de lot "${batch}" a déjà été utilisé`);
      }
      
      // Sauvegarder les données de production pour les pages suivantes
      localStorage.setItem('currentProductCode', code);      
      localStorage.setItem('currentBatchNumber', batch);
      localStorage.setItem('currentProductData', JSON.stringify(product));
      localStorage.setItem('productionStartTime', new Date().toISOString());
      localStorage.setItem('currentOperator', currentUser?.name || 'Utilisateur');
      
      // Ajouter le lot à la liste des lots utilisés
      existingBatches.push(batch);
      localStorage.setItem('usedBatches', JSON.stringify(existingBatches));
      
      // Créer une production (simulée pour l'instant)
      const productionData = {
        productCode: code,
        batchNumber: batch,
        operator: currentUser?.name || 'Utilisateur',
        startTime: new Date().toISOString()
      };
      
      // Essayer de créer la production via l'API
      try {
        const productionResponse = await ProductionService.startProduction(productionData);
        if (productionResponse.success) {
          localStorage.setItem('currentProductionId', productionResponse.data.id);
          console.log('✅ Production créée via API');
        }
      } catch (apiError) {
        // Si l'API n'est pas disponible, continuer avec une production locale
        console.log('⚠️ API production non disponible, utilisation mode local');
        localStorage.setItem('currentProductionId', `LOCAL_${Date.now()}`);
      }
      
      console.log('🚀 Redirection vers la page de recette...');
      
      // Nettoyer les erreurs et rediriger
      setError('');
      navigate('/recipe');
      
    } catch (err) {
      console.error("❌ Erreur:", err);
      throw err;
    }
  };

  const handleQuickStart = (recentProduction) => {
    // Démarrer rapidement avec une production récente comme modèle
    const newBatch = `L${Date.now().toString().slice(-6)}`;
    setProductCode(recentProduction.productCode);
    setBatchNumber(newBatch);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Scan de Production
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
          Scannez ou saisissez le code de produit pour commencer la production
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
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
                  disabled={scanning}
                >
                  {scanning ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                      Scan en cours...
                    </>
                  ) : 'Scanner maintenant'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

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
                  placeholder="ex: A123, B456"
                />
                <TextField
                  fullWidth
                  label="Numéro de lot"
                  variant="outlined"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value.toUpperCase())}
                  sx={{ mb: 2 }}
                  placeholder="ex: L789"
                />
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  fullWidth
                  onClick={handleManualEntry}
                  disabled={loading || !productCode || !batchNumber}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                      Vérification...
                    </>
                  ) : 'Continuer'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Dernières productions:
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {recentProductions.length > 0 ? (
              recentProductions.map((production) => (
                <Box 
                  key={production.id} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 1,
                    borderBottom: '1px solid #eee'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    • Produit {production.productCode} - Lot {production.batchNumber} - {production.date}
                  </Typography>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleQuickStart(production)}
                  >
                    Utiliser comme modèle
                  </Button>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                Aucune production récente
              </Typography>
            )}
          </Box>
        </Paper>

        {/* Section d'aide */}
        <Paper sx={{ mt: 3, p: 2, bgcolor: 'info.light' }}>
          <Typography variant="body2" color="info.contrastText">
            💡 <strong>Codes produits disponibles:</strong> A123 (Nettoyant Multi-Surfaces), B456 (Dégraissant Industriel)
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProductionScan;