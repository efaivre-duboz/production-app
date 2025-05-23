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
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const IngredientsTable = ({ ingredients, onChange, onValidate }) => {
  const isAllFilled = ingredients.every(ing => ing.actual && ing.actual > 0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ingrédients requis
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ingrédient</TableCell>
              <TableCell align="right">Quantité requise</TableCell>
              <TableCell align="right">Quantité réelle</TableCell>
              <TableCell align="right">Unité</TableCell>
              <TableCell>Info</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell align="right">{ingredient.required}</TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    value={ingredient.actual || ''}
                    onChange={(e) => onChange(ingredient.id, parseFloat(e.target.value) || '')}
                    size="small"
                    inputProps={{ min: 0, step: 0.1 }}
                    sx={{ width: 100 }}
                  />
                </TableCell>
                <TableCell align="right">{ingredient.unit}</TableCell>
                <TableCell>
                  {ingredient.info && (
                    <Tooltip title={ingredient.info}>
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={onValidate}
          disabled={!isAllFilled}
        >
          Valider les ingrédients
        </Button>
      </Box>
    </Box>
  );
};

export default IngredientsTable;
