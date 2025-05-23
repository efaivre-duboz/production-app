// frontend/src/components/debug/QuickTest.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Api as ApiIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useApiIntegration, useApiCall } from '../../hooks/useApiIntegration';
import { useNotificationContext } from '../system/NotificationSystem';

const QuickTest = () => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);
  const { isOnline, apiStatus } = useApiIntegration();
  const { execute } = useApiCall();
  const { notifySuccess, notifyError } = useNotificationContext();

  const runQuickTest = async () => {
    setTesting(true);
    const results = {};
    
    try {
      // Test 1: Connexion API
      notifySuccess('Démarrage des tests...', { title: 'Tests en cours' });
      
      const API = (await import('../../services/api')).default;
      
      try {
        const connectionTest = await API.get('/');
        results.connection = { success: true, message: 'API accessible' };
      } catch (error) {
        results.connection = { success: false, message: 'API non accessible', error: error.message };
      }

      // Test 2: Service d'authentification
      try {
        const AuthService = (await import('../../services/authService')).default;
        const authTest = await AuthService.login('test', 'test');
        results.auth = { 
          success: true, 
          message: authTest.success ? 'Service auth OK' : 'Service auth répond (credentials incorrects - normal)' 
        };
      } catch (error) {
        results.auth = { success: false, message: 'Service auth inaccessible', error: error.message };
      }

      // Test 3: Service de production
      try {
        const ProductionService = (await import('../../services/productionService')).default;
        const prodTest = await ProductionService.getProductions();
        results.production = { 
          success: prodTest.success, 
          message: prodTest.success ? 'Service production OK' : 'Service production accessible (données fictives)' 
        };
      } catch (error) {
        results.production = { success: false, message: 'Service production inaccessible', error: error.message };
      }

      // Test 4: Service de produits
      try {
        const ProductService = (await import('../../services/productService')).default;
        const productTest = await ProductService.getProducts();
        results.products = { 
          success: productTest.success, 
          message: productTest.success ? 'Service produits OK' : 'Service produits accessible' 
        };
      } catch (error) {
        results.products = { success: false, message: 'Service produits inaccessible', error: error.message };
      }

      // Test 5: LocalStorage
      try {
        localStorage.setItem('test', 'value');
        const testValue = localStorage.getItem('test');
        localStorage.removeItem('test');
        results.localStorage = { 
          success: testValue === 'value', 
          message: 'LocalStorage fonctionnel' 
        };
      } catch (error) {
        results.localStorage = { success: false, message: 'LocalStorage non accessible', error: error.message };
      }

      // Test 6: Hooks d'intégration
      results.hooks = { 
        success: true, 
        message: 'Hooks d\'intégration chargés',
        details: { isOnline, apiStatus }
      };

      setTestResults(results);
      
      const successCount = Object.values(results).filter(r => r.success).length;
      const totalTests = Object.keys(results).length;
      
      if (successCount === totalTests) {
        notifySuccess('Tous les tests sont passés!', { title: 'Tests réussis' });
      } else {
        notifyError(`${successCount}/${totalTests} tests réussis`, { title: 'Tests partiels' });
      }

    } catch (error) {
      console.error('Erreur lors des tests:', error);
      notifyError('Erreur lors des tests', { title: 'Erreur de test' });
    } finally {
      setTesting(false);
    }
  };

  const getIcon = (success) => {
    if (success === undefined) return <WarningIcon color="warning" />;
    return success ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />;
  };

  const getColor = (success) => {
    if (success === undefined) return 'warning';
    return success ? 'success' : 'error';
  };

  const testItems = [
    { key: 'connection', label: 'Connexion API', icon: <ApiIcon /> },
    { key: 'auth', label: 'Service Authentification', icon: <SecurityIcon /> },
    { key: 'production', label: 'Service Production', icon: <SpeedIcon /> },
    { key: 'products', label: 'Service Produits', icon: <StorageIcon /> },
    { key: 'localStorage', label: 'Stockage Local', icon: <StorageIcon /> },
    { key: 'hooks', label: 'Hooks d\'Intégration', icon: <ApiIcon /> }
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Tests Rapides d'Intégration
          </Typography>
          <Button
            variant="contained"
            startIcon={testing ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            onClick={runQuickTest}
            disabled={testing}
          >
            {testing ? 'Tests en cours...' : 'Lancer les tests'}
          </Button>
        </Box>

        {/* Statut général */}
        <Alert 
          severity={isOnline && apiStatus === 'online' ? 'success' : 'warning'} 
          sx={{ mb: 2 }}
        >
          {isOnline ? (
            apiStatus === 'online' ? 
            '🟢 Système en ligne et API accessible' : 
            '🟡 Système en ligne mais API en erreur'
          ) : (
            '🔴 Système hors ligne'
          )}
        </Alert>

        <Divider sx={{ my: 2 }} />

        {/* Résultats des tests */}
        <List>
          {testItems.map((item) => {
            const result = testResults[item.key];
            return (
              <ListItem key={item.key} divider>
                <ListItemIcon>
                  {result ? getIcon(result.success) : item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={result ? result.message : 'Non testé'}
                />
                {result && (
                  <Chip
                    label={result.success ? 'OK' : 'ÉCHEC'}
                    color={getColor(result.success)}
                    size="small"
                  />
                )}
              </ListItem>
            );
          })}
        </List>

        {/* Informations détaillées */}
        {Object.keys(testResults).length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Informations détaillées:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Connexion réseau: {isOnline ? '✅ En ligne' : '❌ Hors ligne'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Statut API: {apiStatus || 'Non vérifié'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Environnement: {process.env.NODE_ENV || 'development'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  URL API: {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Conseils de dépannage */}
        {Object.values(testResults).some(r => !r.success) && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Conseils de dépannage:</strong>
            </Typography>
            <Typography variant="body2">
              • Vérifiez que le backend est démarré (npm run dev dans /backend)
            </Typography>
            <Typography variant="body2">
              • Vérifiez que MongoDB est accessible
            </Typography>
            <Typography variant="body2">
              • Consultez la console pour plus de détails
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickTest;