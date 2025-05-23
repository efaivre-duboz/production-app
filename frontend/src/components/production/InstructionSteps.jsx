import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Chip,
  Alert
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const InstructionSteps = ({ instructions, onComplete, completed = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [stepStartTime, setStepStartTime] = useState(null);
  const [stepDurations, setStepDurations] = useState({});

  // Charger l'état sauvegardé au montage
  useEffect(() => {
    const savedProgress = localStorage.getItem('instructionProgress');
    if (savedProgress) {
      try {
        const { activeStep: savedActiveStep, completedSteps: savedCompleted } = JSON.parse(savedProgress);
        setActiveStep(savedActiveStep);
        setCompletedSteps(new Set(savedCompleted));
      } catch (error) {
        console.log('Erreur lors du chargement de la progression:', error);
      }
    }
  }, []);

  // Sauvegarder la progression
  const saveProgress = (currentStep, currentCompleted) => {
    localStorage.setItem('instructionProgress', JSON.stringify({
      activeStep: currentStep,
      completedSteps: Array.from(currentCompleted)
    }));
  };

  const handleNext = () => {
    const newCompleted = new Set([...completedSteps, activeStep]);
    setCompletedSteps(newCompleted);
    
    // Enregistrer la durée de l'étape
    if (stepStartTime) {
      const duration = Math.round((Date.now() - stepStartTime) / 1000);
      setStepDurations(prev => ({
        ...prev,
        [activeStep]: duration
      }));
    }
    
    if (activeStep === instructions.length - 1) {
      // Toutes les étapes sont terminées
      onComplete();
      localStorage.removeItem('instructionProgress'); // Nettoyer la sauvegarde
    } else {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      setStepStartTime(Date.now());
      saveProgress(nextStep, newCompleted);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      const newActiveStep = activeStep - 1;
      setActiveStep(newActiveStep);
      setStepStartTime(Date.now());
      saveProgress(newActiveStep, completedSteps);
    }
  };

  const handleStepClick = (stepIndex) => {
    // Permettre de naviguer vers les étapes précédentes ou la suivante si toutes les précédentes sont complètes
    const canNavigate = stepIndex <= activeStep || 
      (stepIndex === activeStep + 1 && completedSteps.has(activeStep));
    
    if (canNavigate) {
      setActiveStep(stepIndex);
      setStepStartTime(Date.now());
      saveProgress(stepIndex, completedSteps);
    }
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const totalSteps = instructions.length;
  const completedCount = completedSteps.size;
  const progressPercentage = (completedCount / totalSteps) * 100;

  if (completed) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          ✅ Instructions complétées
        </Typography>
        <Typography variant="body2">
          Toutes les étapes de production ont été suivies avec succès.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Instructions de production
        </Typography>
        <Chip 
          label={`${completedCount}/${totalSteps} étapes`}
          color={completedCount === totalSteps ? 'success' : 'primary'}
          variant="outlined"
        />
      </Box>

      {/* Barre de progression globale */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Progression globale: {Math.round(progressPercentage)}%
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progressPercentage} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
      
      <Stepper activeStep={activeStep} orientation="vertical">
        {instructions.map((instruction, index) => {
          const isCompleted = completedSteps.has(index);
          const isActive = index === activeStep;
          const canAccess = index <= activeStep || 
            (index === activeStep + 1 && completedSteps.has(activeStep));

          return (
            <Step key={index} completed={isCompleted}>
              <StepLabel 
                onClick={() => handleStepClick(index)}
                sx={{ 
                  cursor: canAccess ? 'pointer' : 'default',
                  opacity: canAccess ? 1 : 0.6
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">
                    Étape {index + 1}: {instruction.title}
                  </Typography>
                  {instruction.duration && (
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={`${instruction.duration} min`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {isCompleted && (
                    <CheckCircleIcon color="success" fontSize="small" />
                  )}
                </Box>
              </StepLabel>

              <StepContent>
                <Paper sx={{ p: 3, mb: 2, bgcolor: 'grey.50' }}>
                  {/* Instructions détaillées */}
                  <List dense>
                    {instruction.steps.map((step, stepIndex) => (
                      <ListItem key={stepIndex} sx={{ pl: 0 }}>
                        <ListItemText 
                          primary={`${stepIndex + 1}. ${step}`}
                          sx={{ 
                            textAlign: 'justify',
                            '& .MuiListItemText-primary': {
                              fontSize: '0.95rem',
                              lineHeight: 1.5
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  {/* Note ou informations supplémentaires */}
                  {instruction.note && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                      <Typography variant="body2" color="info.contrastText" sx={{ fontStyle: 'italic' }}>
                        💡 {instruction.note}
                      </Typography>
                    </Box>
                  )}

                  {/* Durée réelle de l'étape */}
                  {stepDurations[index] && (
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        icon={<CheckCircleIcon />}
                        label={`Terminé en ${formatDuration(stepDurations[index])}`}
                        color="success"
                        size="small"
                      />
                    </Box>
                  )}
                </Paper>
                
                {/* Boutons de navigation */}
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    startIcon={index === instructions.length - 1 ? <CheckCircleIcon /> : <PlayArrowIcon />}
                  >
                    {index === instructions.length - 1 ? 'Terminer toutes les instructions' : 'Étape suivante'}
                  </Button>
                  
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Étape précédente
                  </Button>

                  {isActive && instruction.duration && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      ⏱️ Durée estimée pour cette étape: {instruction.duration} minutes
                    </Typography>
                  )}
                </Box>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>

      {/* Résumé des durées */}
      {Object.keys(stepDurations).length > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom>
            📊 Temps réalisés par étape:
          </Typography>
          {Object.entries(stepDurations).map(([stepIndex, duration]) => (
            <Typography key={stepIndex} variant="body2" color="text.secondary">
              • Étape {parseInt(stepIndex) + 1}: {formatDuration(duration)}
            </Typography>
          ))}
          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
            Temps total: {formatDuration(Object.values(stepDurations).reduce((a, b) => a + b, 0))}
          </Typography>
        </Box>
      )}

      {/* Message d'aide */}
      {completedCount === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            💡 Suivez chaque étape dans l'ordre. Vous pouvez revenir aux étapes précédentes si nécessaire.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default InstructionSteps;