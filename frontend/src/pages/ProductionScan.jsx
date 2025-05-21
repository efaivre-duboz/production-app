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
      // Dans une application réelle, cette fonction récupérerait les productions récentes
      // Pour l'instant, nous utiliserons des données statiques
      // Si l'API est prête, décommentez le code ci-dessous
      /*
      const response = await ProductionService.getProductions();
      if (response.success) {
        // Limiter à 5 productions récentes
        setRecentProductions(response.data.slice(0, 5));
      }
      */

      // Données statiques pour le moment
      setRecentProductions([
        { id: "P001", productCode: "A123", batchNumber: "L789", date: "2025-05-12", status: "completed" },
        { id: "P002", productCode: "B456", batchNumber: "L790", date: "2025-05-13", status: "completed" }
      ]);
    } catch (err) {
      console.error("Erreur lors du chargement des productions récentes:", err);
    }
  };

  const handleScan = async () => {
    try {
      setScanning(true);
      setError('');
      
      // Simuler un scan
      setTimeout(async () => {
        try {
          // Vérifier si le produit existe
          await checkProductAndStartProduction();
        } catch (err) {
          console.error("Erreur lors du scan:", err);
          setError(err.response?.data?.message || "Erreur lors du scan");
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
      await checkProductAndStartProduction();
    } catch (err) {
      console.error("Erreur lors de la saisie manuelle:", err);
      setError(err.response?.data?.message || "Erreur lors de la vérification du produit");
    } finally {
      setLoading(false);
    }
  };
  
  const checkProductAndStartProduction = async () => {
    try {
      // Vérifier si le produit existe
      const productResponse = await ProductService.getProductByCode(productCode);
      
      if (!productResponse.success) {
        throw new Error("Produit non trouvé");
      }
      
      // Démarrer une nouvelle production
      const productionData = {
        productCode,
        batchNumber,
        operator: currentUser.name
      };
      
      // Stocker l'ID de la production en cours dans le localStorage
      localStorage.setItem('currentProductionId', 'temp_id');
      
      // En production réelle, décommentez ce code
      /*
      const productionResponse = await ProductionService.startProduction(productionData);
      
      if (productionResponse.success) {
        // Stocker l'ID de la production en cours dans le localStorage
        localStorage.setItem('currentProductionId', productionResponse.data.id);
        // Rediriger vers la page de recette
        navigate('/recipe');
      } else {
        throw new Error(productionResponse.message || "Erreur lors du démarrage de la production");
      }
      */
      
      // En mode développement, rediriger directement
      navigate('/recipe');
      
    } catch (err) {
      console.error("Erreur:", err);
      throw err;
    }
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
                  onChange={(e) => setProductCode(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Numéro de lot"
                  variant="outlined"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  sx={{ mb: 2 }}
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
                      Chargement...
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
                <Typography key={production.id} variant="body2" color="text.secondary" sx={{ py: 1 }}>
                  • Produit {production.productCode} - Lot {production.batchNumber} - {production.date}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                Aucune production récente
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProductionScan;