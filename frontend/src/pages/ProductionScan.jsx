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
  Divider
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import NumbersIcon from '@mui/icons-material/Numbers';

const ProductionScan = () => {
  const [productCode, setProductCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  const handleScan = () => {
    setScanning(true);
    // Simuler un scan
    setTimeout(() => {
      setScanning(false);
      if (productCode) {
        navigate('/recipe');
      }
    }, 1500);
  };

  const handleManualEntry = () => {
    if (productCode) {
      navigate('/recipe');
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
                  {scanning ? 'Scan en cours...' : 'Scanner maintenant'}
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
                  Entrez le code du produit manuellement
                </Typography>
                <TextField
                  fullWidth
                  label="Code produit"
                  variant="outlined"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  fullWidth
                  onClick={handleManualEntry}
                  disabled={!productCode}
                >
                  Continuer
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
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              • Produit A123 - Lot L789 - 15/05/2025 14:30
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              • Produit B456 - Lot L790 - 15/05/2025 10:15
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              • Produit C789 - Lot L788 - 14/05/2025 16:45
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProductionScan;