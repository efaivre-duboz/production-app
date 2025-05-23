import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Alert,
  Paper,
  Chip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const IngredientsTable = ({ ingredients, onChange, onValidate }) => {
  const [validated, setValidated] = useState(false);
  
  // Calculer le statut de chaque ingrédient
  const getIngredientStatus = (ingredient) => {
    if (!ingredient.actual || ingredient.actual === '') {
      return { status: 'pending', color: 'default', message: 'En attente' };
    }
    
    const deviation = Math.abs((ingredient.actual - ingredient.required) / ingredient.required) * 100;
    
    if (deviation <= 2) {
      return { status: 'good', color: 'success', message: 'Conforme' };
    } else if (deviation <= 5) {
      return { status: 'warning', color: 'warning', message: 'Acceptable' };
    } else {
      return { status: 'error', color: 'error', message: 'Hors spécification' };
    }
  };
  
  // Vérifier si tous les ingrédients sont remplis
  const isAllFilled = ingredients.every(ing => ing.actual && ing.actual > 0);
  
  // Vérifier s'il y a des erreurs critiques
  const hasErrors = ingredients.some(ing => {
    if (!ing.actual) return false;
    const deviation = Math.abs((ing.actual - ing.required) / ing.required) * 100;
    return deviation > 5;
  });

  const handleValidate = () => {
    if (hasErrors) {
      // Demander confirmation pour les ingrédients hors spécification
      const confirm = window.confirm(
        'Certains ingrédients sont hors spécification. Voulez-vous continuer quand même ?'
      );
      if (!confirm) return;
    }
    
    setValidated(true);
    onValidate();
  };

  const handleIngredientChange = (id, value) => {
    setValidated(false);
    onChange(id, value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ingrédients requis
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Entrez les quantités réelles utilisées pour chaque ingrédient. 
        Les écarts de plus de 5% seront signalés.
      </Typography>
      
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell><strong>Ingrédient</strong></TableCell>
              <TableCell align="right"><strong>Quantité requise</strong></TableCell>
              <TableCell align="right"><strong>Quantité réelle</strong></TableCell>
              <TableCell align="right"><strong>Unité</strong></TableCell>
              <TableCell align="center"><strong>Écart</strong></TableCell>
              <TableCell align="center"><strong>Statut</strong></TableCell>
              <TableCell align="center"><strong>Info</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient) => {
              const status = getIngredientStatus(ingredient);
              const deviation = ingredient.actual ? 
                ((ingredient.actual - ingredient.required) / ingredient.required) * 100 : 0;
              
              return (
                <TableRow 
                  key={ingredient.id}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: 'grey.50' },
                    borderLeft: `4px solid ${
                      status.status === 'good' ? '#4caf50' : 
                      status.status === 'warning' ? '#ff9800' : 
                      status.status === 'error' ? '#f44336' : 'transparent'
                    }`
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {ingredient.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {ingredient.required}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={ingredient.actual || ''}
                      onChange={(e) => handleIngredientChange(ingredient.id, parseFloat(e.target.value) || '')}
                      size="small"
                      inputProps={{ 
                        min: 0, 
                        step: 0.1,
                        style: { textAlign: 'right' }
                      }}
                      sx={{ width: 100 }}
                      disabled={validated}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {ingredient.unit}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {ingredient.actual ? (
                      <Typography 
                        variant="body2" 
                        color={deviation > 0 ? 'error.main' : 'success.main'}
                        fontWeight="medium"
                      >
                        {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={status.message}
                      color={status.color}
                      size="small"
                      icon={
                        status.status === 'good' ? <CheckCircleOutlineIcon /> :
                        status.status === 'warning' ? <WarningAmberIcon /> :
                        status.status === 'error' ? <WarningAmberIcon /> : undefined
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    {ingredient.info && (
                      <Tooltip title={ingredient.info} arrow>
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {hasErrors && !validated && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Attention :</strong> Certains ingrédients présentent un écart supérieur à 5%. 
            Vérifiez les quantités avant de valider.
          </Typography>
        </Alert>
      )}
      
      {validated && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Ingrédients validés :</strong> Vous pouvez maintenant passer aux instructions de production.
          </Typography>
        </Alert>
      )}
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {ingredients.filter(ing => ing.actual && ing.actual > 0).length} / {ingredients.length} ingrédients renseignés
        </Typography>
        
        <Button
          variant="contained"
          onClick={handleValidate}
          disabled={!isAllFilled || validated}
          startIcon={validated ? <CheckCircleOutlineIcon /> : undefined}
        >
          {validated ? 'Ingrédients validés' : 'Valider les ingrédients'}
        </Button>
      </Box>
    </Box>
  );
};

export default IngredientsTable;