import React, { useState } from 'react';
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
  ListItemText
} from '@mui/material';

const InstructionSteps = ({ instructions, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, activeStep]));
    
    if (activeStep === instructions.length - 1) {
      onComplete();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Instructions de production
      </Typography>
      
      <Stepper activeStep={activeStep} orientation="vertical">
        {instructions.map((instruction, index) => (
          <Step key={index} completed={completedSteps.has(index)}>
            <StepLabel>
              <Typography variant="h6">{instruction.title}</Typography>
            </StepLabel>
            <StepContent>
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <List dense>
                  {instruction.steps.map((step, stepIndex) => (
                    <ListItem key={stepIndex}>
                      <ListItemText 
                        primary={`${stepIndex + 1}. ${step}`}
                        sx={{ textAlign: 'justify' }}
                      />
                    </ListItem>
                  ))}
                </List>
                
                {instruction.note && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                    Note: {instruction.note}
                  </Typography>
                )}
              </Paper>
              
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  {index === instructions.length - 1 ? 'Terminer' : 'Suivant'}
                </Button>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Précédent
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default InstructionSteps;
