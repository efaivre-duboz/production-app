import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Paper
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const PauseButton = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [pauseCategory, setPauseCategory] = useState('equipment');

  const handlePauseClick = () => {
    if (!isPaused) {
      // Démarrer la pause
      setOpenDialog(true);
    } else {
      // Reprendre la production
      setIsPaused(false);
      
      // En production réelle, envoyez les données de la pause au backend
      console.log('Production reprise. Raison de la pause:', pauseReason);
      
      // Réinitialiser
      setPauseReason('');
    }
  };

  const handleDialogConfirm = () => {
    setIsPaused(true);
    setOpenDialog(false);
  };

  const handleDialogCancel = () => {
    setOpenDialog(false);
    setPauseReason('');
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        mb: 3, 
        bgcolor: isPaused ? '#FFF4F4' : 'white',
        border: isPaused ? '1px solid #FFCCCC' : 'none'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {isPaused ? "PRODUCTION EN PAUSE" : "Production en cours"}
        </Typography>
        
        <Button
          variant={isPaused ? "contained" : "outlined"}
          color={isPaused ? "error" : "primary"}
          startIcon={isPaused ? <PlayArrowIcon /> : <PauseIcon />}
          onClick={handlePauseClick}
          size="large"
          sx={{ mt: 1, mb: 1, px: 3 }}
        >
          {isPaused ? "Reprendre la production" : "Mettre en pause"}
        </Button>
        
        {isPaused && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Raison de la pause: {pauseReason || "Non spécifiée"}
          </Typography>
        )}
      </Box>

      <Dialog open={openDialog} onClose={handleDialogCancel}>
        <DialogTitle>Raison de la pause</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" fullWidth sx={{ mt: 2, mb: 2 }}>
            <FormLabel component="legend">Catégorie</FormLabel>
            <RadioGroup
              row
              name="pauseCategory"
              value={pauseCategory}
              onChange={(e) => setPauseCategory(e.target.value)}
            >
              <FormControlLabel value="equipment" control={<Radio />} label="Équipement" />
              <FormControlLabel value="material" control={<Radio />} label="Matériaux" />
              <FormControlLabel value="personnel" control={<Radio />} label="Personnel" />
              <FormControlLabel value="other" control={<Radio />} label="Autre" />
            </RadioGroup>
          </FormControl>
          
          <TextField
            autoFocus
            margin="dense"
            id="pauseReason"
            label="Description de la raison"
            fullWidth
            variant="outlined"
            value={pauseReason}
            onChange={(e) => setPauseReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleDialogConfirm} color="primary" variant="contained">
            Confirmer la pause
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PauseButton;