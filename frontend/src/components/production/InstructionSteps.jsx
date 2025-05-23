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
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  LinearProgress,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Check as CheckIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const InstructionSteps = ({ instructions, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [stepTimers, setStepTimers] = useState({});
  const [stepNotes, setStepNotes] = useState({});
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentNoteStep, setCurrentNoteStep] = useState(null);
  const [tempNote, setTempNote] = useState('');

  // Transformer les instructions pour le format attendu
  const steps = instructions.map((instruction, index) => ({
    id: index,
    title: instruction.title,
    duration: instruction.duration || 0,
    instructions: Array.isArray(instruction.steps) ? instruction.steps : 
                  typeof instruction.instructions === 'string' ? 
                  instruction.instructions.split('. ').filter(s => s.trim()) : 
                  [instruction.instructions || ''],
    note: instruction.note || ''
  }));

  useEffect(() => {
    // Initialiser les timers pour chaque étape
    const timers = {};
    steps.forEach(step => {
      if (step.duration > 0) {
        timers[step.id] = {
          total: step.duration * 60, // Convertir en secondes
          remaining: step.duration * 60,
          isRunning: false,
          isCompleted: false
        };
      }
    });
    setStepTimers(timers);
  }, [steps.length]);

  // Gérer le timer d'une étape
  useEffect(() => {
    const intervals = {};
    
    Object.keys(stepTimers).forEach(stepId => {
      const timer = stepTimers[stepId];
      if (timer && timer.isRunning && timer.remaining > 0) {
        intervals[stepId] = setInterval(() => {
          setStepTimers(prev => {
            const newTimers = { ...prev };
            if (newTimers[stepId].remaining > 0) {
              newTimers[stepId].remaining -= 1;
            } else {
              newTimers[stepId].isRunning = false;
              newTimers[stepId].isCompleted = true;
            }
            return newTimers;
          });
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [stepTimers]);

  const startTimer = (stepId) => {
    setStepTimers(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        isRunning: true
      }
    }));
  };

  const pauseTimer = (stepId) => {
    setStepTimers(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        isRunning: false
      }
    }));
  };

  const resetTimer = (stepId) => {
    const step = steps.find(s => s.id === parseInt(stepId));
    if (step) {
      setStepTimers(prev => ({
        ...prev,
        [stepId]: {
          ...prev[stepId],
          remaining: step.duration * 60,
          isRunning: false,
          isCompleted: false
        }
      }));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    // Marquer l'étape actuelle comme terminée
    setCompletedSteps(prev => new Set([...prev, activeStep]));
    
    if (activeStep === steps.length - 1) {
      // Toutes les étapes sont terminées
      onComplete();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleAddNote = (stepId) => {
    setCurrentNoteStep(stepId);
    setTempNote(stepNotes[stepId] || '');
    setNoteDialogOpen(true);
  };

  const handleSaveNote = () => {
    setStepNotes(prev => ({
      ...prev,
      [currentNoteStep]: tempNote
    }));
    setNoteDialogOpen(false);
    setCurrentNoteStep(null);
    setTempNote('');
  };

  const getStepStatus = (stepIndex) => {
    if (completedSteps.has(stepIndex)) return 'completed';
    if (stepIndex === activeStep) return 'active';
    return 'pending';
  };

  const isAllCompleted = completedSteps.size === steps.length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Instructions de production
        </Typography>
        <Chip 
          label={`${completedSteps.size}/${steps.length} étapes terminées`}
          color={isAllCompleted ? 'success' : 'primary'}
          icon={isAllCompleted ? <CheckCircleIcon /> : <ScheduleIcon />}
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Suivez chaque étape dans l'ordre. Utilisez les timers pour respecter les durées recommandées.
      </Typography>

      {isAllCompleted && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Toutes les étapes sont terminées !</strong> Vous pouvez maintenant passer au contrôle qualité.
          </Typography>
        </Alert>
      )}
      
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => {
          const timer = stepTimers[step.id];
          const status = getStepStatus(index);
          
          return (
            <Step key={step.id} completed={completedSteps.has(index)}>
              <StepLabel
                optional={
                  step.duration > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      Durée recommandée: {step.duration} min
                    </Typography>
                  )
                }
                StepIconComponent={({ active, completed }) => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.300',
                      color: 'white'
                    }}
                  >
                    {completed ? <CheckIcon /> : index + 1}
                  </Box>
                )}
              >
                <Typography variant="h6" component="div">
                  {step.title}
                </Typography>
              </StepLabel>
              
              <StepContent>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    {/* Timer section */}
                    {timer && (
                      <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle2">
                            Timer de l'étape
                          </Typography>
                          <Typography variant="h6" color={timer.remaining <= 60 ? 'error.main' : 'text.primary'}>
                            {formatTime(timer.remaining)}
                          </Typography>
                        </Box>
                        
                        <LinearProgress 
                          variant="determinate" 
                          value={((timer.total - timer.remaining) / timer.total) * 100}
                          sx={{ mb: 2, height: 8, borderRadius: 4 }}
                          color={timer.isCompleted ? 'success' : timer.remaining <= 60 ? 'error' : 'primary'}
                        />
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {!timer.isRunning ? (
                            <Button
                              size="small"
                              startIcon={<PlayArrowIcon />}
                              onClick={() => startTimer(step.id)}
                              disabled={timer.isCompleted}
                            >
                              Démarrer
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              startIcon={<PauseIcon />}
                              onClick={() => pauseTimer(step.id)}
                            >
                              Pause
                            </Button>
                          )}
                          <Button
                            size="small"
                            onClick={() => resetTimer(step.id)}
                          >
                            Reset
                          </Button>
                        </Box>
                        
                        {timer.isCompleted && (
                          <Alert severity="success" sx={{ mt: 2 }}>
                            Durée recommandée atteinte !
                          </Alert>
                        )}
                      </Box>
                    )}
                    
                    {/* Instructions */}
                    <Typography variant="subtitle2" gutterBottom>
                      Instructions :
                    </Typography>
                    <List dense>
                      {step.instructions.map((instruction, instrIndex) => (
                        <ListItem key={instrIndex}>
                          <ListItemIcon>
                            <Typography variant="body2" color="primary.main" fontWeight="bold">
                              {instrIndex + 1}.
                            </Typography>
                          </ListItemIcon>
                          <ListItemText 
                            primary={instruction}
                            sx={{ textAlign: 'justify' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    {/* Note de l'étape */}
                    {step.note && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          <strong>Note importante :</strong> {step.note}
                        </Typography>
                      </Alert>
                    )}
                    
                    {/* Notes personnelles */}
                    {stepNotes[step.id] && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Vos notes :
                        </Typography>
                        <Typography variant="body2">
                          {stepNotes[step.id]}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
                
                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1 }}
                  >
                    {index === steps.length - 1 ? 'Terminer toutes les étapes' : 'Étape suivante'}
                  </Button>
                  
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1 }}
                  >
                    Précédent
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => handleAddNote(step.id)}
                    sx={{ mt: 1 }}
                  >
                    {stepNotes[step.id] ? 'Modifier note' : 'Ajouter note'}
                  </Button>
                </Box>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
      
      {/* Dialog pour ajouter des notes */}
      <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Ajouter une note personnelle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Note"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={tempNote}
            onChange={(e) => setTempNote(e.target.value)}
            placeholder="Notez vos observations, modifications ou remarques importantes..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveNote} variant="contained">Sauvegarder</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstructionSteps;