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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PauseButton from '../components/production/PauseButton';

const Recipe = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Eau déminéralisée', required: 75.0, actual: '', unit: 'kg' },
    { id: 2, name: 'Polymère A', required: 15.0, actual: '', unit: 'kg' },
    { id: 3, name: 'Additif B', required: 5.0, actual: '', unit: 'kg' },
    { id: 4, name: 'Colorant C', required: 2.5, actual: '', unit: 'kg' },
    { id: 5, name: 'Conservateur D', required: 1.5, actual: '', unit: 'kg' },
    { id: 6, name: 'Parfum E', required: 1.0, actual: '', unit: 'kg' }
  ]);
  
  const handleIngredientChange = (id, value) => {
    const updatedIngredients = ingredients.map(ing => 
      ing.id === id ? { ...ing, actual: value } : ing
    );
    setIngredients(updatedIngredients);
  };
  
  const totalRequired = ingredients.reduce((sum, ing) => sum + ing.required, 0);
  const totalActual = ingredients.reduce((sum, ing) => sum + (parseFloat(ing.actual) || 0), 0);
  
  const handleContinue = () => {
    // Ici, vous pourriez valider que tous les ingrédients ont été saisis
    navigate('/quality');
  };
  
  const steps = ['Scan de production', 'Recette et instructions', 'Contrôle qualité', 'Fin de production'];
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Recette et Instructions
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
          Suivez la recette et entrez les quantités réelles utilisées
        </Typography>
    
    
        
        <Stepper activeStep={1} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <PauseButton />

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
          
          <Typography variant="h6" gutterBottom>
            Ingrédients
          </Typography>
          
          <TableContainer sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'secondary.light' }}>
                  <TableCell>Nom de l'ingrédient</TableCell>
                  <TableCell align="right">Quantité requise</TableCell>
                  <TableCell align="right">Quantité réelle</TableCell>
                  <TableCell align="right">Unité</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingredients.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell component="th" scope="row">
                      {ingredient.name}
                    </TableCell>
                    <TableCell align="right">{ingredient.required}</TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        InputProps={{ 
                          inputProps: { 
                            min: 0, 
                            step: 0.1 
                          },
                          endAdornment: (
                            <Box sx={{ display: 'flex', ml: 1 }}>
                              <Button 
                                size="small" 
                                variant="outlined"
                                sx={{ minWidth: '30px', p: 0.5, mr: 0.5 }}
                                onClick={() => {
                                  const current = parseFloat(ingredient.actual) || 0;
                                  handleIngredientChange(ingredient.id, Math.max(0, current - 0.1).toFixed(1));
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                sx={{ minWidth: '30px', p: 0.5 }}
                                onClick={() => {
                                  const current = parseFloat(ingredient.actual) || 0;
                                  handleIngredientChange(ingredient.id, (current + 0.1).toFixed(1));
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </Button>
                            </Box>
                          )
                        }}
                        value={ingredient.actual}
                        onChange={(e) => handleIngredientChange(ingredient.id, e.target.value)}
                        size="small"
                        sx={{ width: 150 }}
                      />
                    </TableCell>
                    <TableCell align="right">{ingredient.unit}</TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: 'background.default' }}>
                  <TableCell component="th" scope="row">
                    <Typography fontWeight="bold">TOTAL</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">{totalRequired.toFixed(1)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">{totalActual.toFixed(1)}</Typography>
                  </TableCell>
                  <TableCell align="right">kg</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Instructions de fabrication
          </Typography>
          
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">Étape 1: Préparation</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                1. Vérifier que tous les équipements sont propres et prêts à l'emploi.
              </Typography>
              <Typography paragraph>
                2. Peser tous les ingrédients selon les quantités spécifiées.
              </Typography>
              <Typography paragraph>
                3. S'assurer que la température de la cuve est entre 20°C et 25°C.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">Étape 2: Mélange initial</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                1. Verser l'eau déminéralisée dans la cuve principale.
              </Typography>
              <Typography paragraph>
                2. Démarrer l'agitateur à vitesse lente (100-150 RPM).
              </Typography>
              <Typography paragraph>
                3. Ajouter lentement le Polymère A tout en maintenant l'agitation.
              </Typography>
              <Typography paragraph>
                4. Continuer l'agitation pendant 15 minutes jusqu'à dissolution complète.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">Étape 3: Ajout des additifs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                1. Ajouter l'Additif B lentement tout en maintenant l'agitation.
              </Typography>
              <Typography paragraph>
                2. Après 5 minutes, ajouter le Colorant C et mélanger pendant 10 minutes.
              </Typography>
              <Typography paragraph>
                3. Ajouter le Conservateur D et continuer l'agitation pendant 5 minutes.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">Étape 4: Finition</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                1. Réduire la vitesse d'agitation à 80-100 RPM.
              </Typography>
              <Typography paragraph>
                2. Ajouter le Parfum E et mélanger pendant 10 minutes supplémentaires.
              </Typography>
              <Typography paragraph>
                3. Vérifier visuellement l'homogénéité du mélange.
              </Typography>
              <Typography paragraph>
                4. Arrêter l'agitation et procéder au contrôle qualité.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleContinue}
            size="large"
          >
            Continuer vers le contrôle qualité
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Recipe;
