// frontend/src/components/debug/ApiDiagnostic.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  TextField,
  Grid,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import ApiTestService from '../../services/apiTestService';

const ApiDiagnostic = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [manualTest, setManualTest] = useState({
    endpoint: '/products',
    method: 'GET',
    body: ''
  });
  const [manualResult, setManualResult] = useState(null);

  const runFullDiagnostic = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const results = await ApiTestService.runFullTest();
      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors du diagnostic:', error);
      setTestResults({
        overall: false,
        error: 'Erreur inattendue lors du diagnostic'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runManualTest = async () => {
    setManualResult(null);
    
    try {
      const API = (await import('../../services/api')).default;
      
      let response;
      const endpoint = manualTest.endpoint;
      
      switch (manualTest.method.toLowerCase()) {
        case 'get':
          response = await API.get(endpoint);
          break;
        case 'post':
          response = await API.post(endpoint, manualTest.body ? JSON.parse(manualTest.body) : {});
          break;
        case 'put':
          response = await API.put(endpoint, manualTest.body ? JSON.parse(manualTest.body) : {});
          break;
        case 'delete':
          response = await API.delete(endpoint);
          break;
        default:
          throw new Error('Méthode HTTP non supportée');
      }
      
      setManualResult({
        success: true,
        status: response.status,
        data: response.data
      });
    } catch (error) {
      setManualResult({
        success: false,
        status: error.response?.status || 'N/A',
        error: error.response?.data || error.message,
        message: error.message
      });
    }
  };

  const getStatusIcon = (success) => {
    if (success === null) return <InfoIcon color="info" />;
    return success ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />;
  };

  const getStatusColor = (success) => {
    if (success === null) return 'info';
    return success ? 'success' : 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔧 Diagnostic API
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Testez la connexion entre le frontend et le backend pour identifier les problèmes d'intégration.
      </Typography>

      {/* Configuration actuelle */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Configuration Actuelle
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                URL de l'API:
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Environnement:
              </Typography>
              <Typography variant="body1">
                {process.env.NODE_ENV || 'development'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Test automatique */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Tests Automatiques
            </Typography>
            <Button
              variant="contained"
              startIcon={isRunning ? <CircularProgress size={20} /> : <PlayArrowIcon />}
              onClick={runFullDiagnostic}
              disabled={isRunning}
            >
              {isRunning ? 'Test en cours...' : 'Lancer le diagnostic'}
            </Button>
          </Box>

          {testResults && (
            <Box>
              <Alert 
                severity={testResults.overall ? 'success' : 'error'} 
                sx={{ mb: 2 }}
              >
                {testResults.overall 
                  ? '✅ Tous les tests sont passés avec succès !' 
                  : '❌ Certains tests ont échoué. Vérifiez les détails ci-dessous.'}
              </Alert>

              <List>
                {testResults.connection && (
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(testResults.connection.success)}
                    </ListItemIcon>
                    <ListItemText
                      primary="Connexion API"
                      secondary={testResults.connection.message}
                    />
                    <Chip 
                      label={testResults.connection.success ? 'OK' : 'ÉCHEC'} 
                      color={getStatusColor(testResults.connection.success)}
                      size="small"
                    />
                  </ListItem>
                )}

                {testResults.auth && (
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(testResults.auth.success)}
                    </ListItemIcon>
                    <ListItemText
                      primary="Authentification"
                      secondary={testResults.auth.message}
                    />
                    <Chip 
                      label={testResults.auth.success ? 'OK' : 'ÉCHEC'} 
                      color={getStatusColor(testResults.auth.success)}
                      size="small"
                    />
                  </ListItem>
                )}

                {testResults.products && (
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(testResults.products.success)}
                    </ListItemIcon>
                    <ListItemText
                      primary="Récupération des produits"
                      secondary={testResults.products.message}
                    />
                    <Chip 
                      label={testResults.products.success ? 'OK' : 'ÉCHEC'} 
                      color={getStatusColor(testResults.products.success)}
                      size="small"
                    />
                  </ListItem>
                )}
              </List>

              {/* Détails des erreurs */}
              {!testResults.overall && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Détails des erreurs</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                        {JSON.stringify(testResults, null, 2)}
                      </pre>
                    </Paper>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Test manuel */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Manuel d'Endpoint
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                label="Méthode"
                value={manualTest.method}
                onChange={(e) => setManualTest({...manualTest, method: e.target.value})}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Endpoint"
                value={manualTest.endpoint}
                onChange={(e) => setManualTest({...manualTest, endpoint: e.target.value})}
                placeholder="/products"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={runManualTest}
                sx={{ height: '56px' }}
              >
                Tester
              </Button>
            </Grid>
          </Grid>

          {(manualTest.method === 'POST' || manualTest.method === 'PUT') && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Body (JSON)"
              value={manualTest.body}
              onChange={(e) => setManualTest({...manualTest, body: e.target.value})}
              placeholder='{"key": "value"}'
              sx={{ mb: 2 }}
            />
          )}

          {manualResult && (
            <Paper sx={{ p: 2, bgcolor: manualResult.success ? 'success.light' : 'error.light' }}>
              <Typography variant="subtitle2" gutterBottom>
                Résultat (Status: {manualResult.status})
              </Typography>
              <pre style={{ fontSize: '12px', overflow: 'auto', margin: 0 }}>
                {JSON.stringify(manualResult.success ? manualResult.data : manualResult.error, null, 2)}
              </pre>
            </Paper>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ApiDiagnostic;