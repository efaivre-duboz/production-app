import React from 'react';
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
  Chip,
  Alert
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const IngredientsTable = ({ ingredients, onChange, onValidate, disabled = false, validated = false }) => {
  // Calculer l'état de chaque ingrédient
  const getIngredientStatus = (ingredient) => {
    if (!ingredient.actual || ingredient.actual <= 0) {
      return { status: 'empty', color: 'default', message: 'À remplir' };
    }
    
    const deviation = ((ingredient.actual - ingredient.quantity) / ingredient.quantity) * 100;
    
    if (Math.abs(deviation) <= 5) {
      return { status: 'good', color: 'success', message: `${deviation > 0 ? '+' : ''}${deviation.toFixed(1)}%` };
    } else if (Math.abs(deviation) <= 10) {
      return { status: 'warning', color: 'warning', message: `${deviation > 0 ? '+' : ''}${deviation.toFixed(1)}%` };
    } else {
      return { status: 'error', color: 'error', message: `${deviation > 0 ? '+' : ''}${deviation.toFixed(1)}%` };
    }
  };

  const isAllFilled = ingredients.every(ing => ing.actual && ing.actual > 0);
  const hasWarnings = ingredients.some(ing => {
    const status = getIngredientStatus(ing);
    return status.status === 'warning' || status.status === 'error';
  });

  const filledCount = ingredients.filter(ing => ing.actual && ing.actual > 0).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Ingrédients requis
        </Typography>
        <Chip 
          label={`${filledCount}/${ingredients.length} complétés`}
          color={isAllFilled ? 'success' : 'default'}
          variant={isAllFilled ? 'filled' : 'outlined'}
        />
      </Box>

      {validated && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2">
            ✅ Ingrédients validés et sauvegardés
          </Typography>
        </Alert>
      )}

      {hasWarnings && !validated && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            ⚠️ Certains ingrédients ont des écarts importants par rapport aux quantités requises
          </Typography>
        </Alert>
      )}
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ingrédient</TableCell>
              <TableCell align="right">Quantité requise</TableCell>
              <TableCell align="right">Quantité réelle</TableCell>
              <TableCell align="right">Unité</TableCell>
              <TableCell align="center">Écart</TableCell>
              <TableCell align="center">Info</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient) => {
              const status = getIngredientStatus(ingredient);
              return (
                <TableRow 
                  key={ingredient.id}
                  sx={{ 
                    backgroundColor: validated ? 'success.light' : 'inherit',
                    opacity: validated ? 0.8 : 1
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {ingredient.name}
                      {validated && (
                        <CheckCircleIcon 
                          color="success" 
                          fontSize="small" 
                          sx={{ ml: 1 }} 
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="medium">
                      {ingredient.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={ingredient.actual || ''}
                      onChange={(e) => onChange(ingredient.id, parseFloat(e.target.value) || '')}
                      size="small"
                      disabled={disabled || validated}
                      inputProps={{ 
                        min: 0, 
                        step: 0.1,
                        style: { textAlign: 'right' }
                      }}
                      sx={{ 
                        width: 120,
                        '& input': {
                          fontWeight: ingredient.actual ? 'medium' : 'normal'
                        }
                      }}
                      error={status.status === 'error'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {ingredient.unit}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {ingredient.actual && ingredient.actual > 0 && (
                      <Chip
                        label={status.message}
                        color={status.color}
                        size="small"
                        variant="outlined"
                        icon={
                          status.status === 'error' ? <WarningIcon /> :
                          status.status === 'good' ? <CheckCircleIcon /> : undefined
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {ingredient.notes && (
                      <Tooltip title={ingredient.notes} arrow>
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
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            💡 Écarts acceptables: ±5% (vert), ±10% (orange), +10% (rouge)
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          onClick={onValidate}
          disabled={!isAllFilled || disabled || validated}
          size="large"
          startIcon={validated ? <CheckCircleIcon /> : undefined}
        >
          {validated ? 'Ingrédients validés' : 
           disabled ? 'Validation en cours...' : 
           'Valider les ingrédients'}
        </Button>
      </Box>

      {!isAllFilled && !validated && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            📋 Ingrédients restants à remplir: {ingredients.length - filledCount}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default IngredientsTable;