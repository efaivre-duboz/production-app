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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const QualityControl = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    appearanceCheck: '',
    viscosityCheck: '',
    pHValue: '',
    odorCheck: '',
    qualityNotes: '',
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
    console.log('Données du contrôle qualité:', formData);
  };
  
  const handleContinue = () => {
    navigate('/end');
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Contrôle Qualité
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
          Effectuez les vérifications de qualité requises pour ce lot de production
        </Typography>
        
        {formSubmitted ? (
          <Paper sx={{ p: 4, mb: 3, textAlign: 'center' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Contrôle qualité complété avec succès
            </Typography>
            <Typography variant="body1" paragraph>
              Les informations de contrôle qualité ont été enregistrées.
            </Typography>
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
                Contrôles visuels et physiques
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }} required>
                    <FormLabel component="legend">Apparence</FormLabel>
                    <RadioGroup
                      name="appearanceCheck"
                      value={formData.appearanceCheck}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel value="conforme" control={<Radio />} label="Conforme" />
                      <FormControlLabel value="non-conforme" control={<Radio />} label="Non conforme" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }} required>
                    <FormLabel component="legend">Odeur</FormLabel>
                    <RadioGroup
                      name="odorCheck"
                      value={formData.odorCheck}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel value="conforme" control={<Radio />} label="Conforme" />
                      <FormControlLabel value="non-conforme" control={<Radio />} label="Non conforme" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }} required>
                    <FormLabel component="legend">Viscosité</FormLabel>
                    <RadioGroup
                      name="viscosityCheck"
                      value={formData.viscosityCheck}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel value="conforme" control={<Radio />} label="Conforme" />
                      <FormControlLabel value="non-conforme" control={<Radio />} label="Non conforme" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Valeur pH"
                    name="pHValue"
                    value={formData.pHValue}
                    onChange={handleChange}
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 14, step: 0.1 } }}
                    fullWidth
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Remarques sur la qualité"
                    name="qualityNotes"
                    value={formData.qualityNotes}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
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
                Valider le contrôle qualité
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default QualityControl;