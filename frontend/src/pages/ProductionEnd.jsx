import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const ProductionEnd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    finalQuantity: '',
    wastageQuantity: '',
    productionNotes: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Dans une application réelle, vous enverriez ces données à votre backend
    console.log('Données de fin de production:', formData);
  };
  
  const handleNewProduction = () => {
    navigate('/');
  };
  
  const steps = ['Scan de production', 'Recette et instructions', 'Contrôle qualité', 'Fin de production'];
  
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
              Lot L789 du produit A123 a été complété et enregistré dans le système.
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
                    Produit A123
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1" color="text.secondary">
                    Lot:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    L789
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1" color="text.secondary">
                    Date de production:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    16/05/2025
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
                    placeholder="Notez toute information pertinente concernant cette production"
                  />
                </Grid>
              </Grid>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                type="submit"
                size="large"
              >
                Terminer la production
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProductionEnd;
