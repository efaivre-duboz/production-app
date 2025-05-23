import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  Description as DescriptionIcon,
  ExpandLess,
  ExpandMore,
  Science as ScienceIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const QualityChecksForm = ({ 
  qualityChecks, 
  onUpdate, 
  onValidate, 
  productInfo,
  isReadOnly = false 
}) => {
  const [checks, setChecks] = useState({});
  const [validated, setValidated] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    visual: true,
    physical: true,
    chemical: true
  });
  const [photoDialog, setPhotoDialog] = useState({ open: false, checkId: null });
  const [notes, setNotes] = useState('');

  // Initialiser les contrôles qualité
  useEffect(() => {
    if (qualityChecks && qualityChecks.length > 0) {
      const initialChecks = {};
      qualityChecks.forEach(check => {
        initialChecks[check.name] = {
          id: check.name,
          name: check.name,
          type: check.type,
          expectedValue: check.expectedValue,
          actualValue: '',
          result: 'pending',
          notes: '',
          photos: [],
          timestamp: null
        };
      });
      setChecks(initialChecks);
    } else {
      // Contrôles par défaut si aucun n'est fourni
      setChecks({
        'Apparence': {
          id: 'apparence',
          name: 'Apparence',
          type: 'visuel',
          expectedValue: 'Conforme aux spécifications',
          actualValue: '',
          result: 'pending',
          notes: '',
          photos: [],
          timestamp: null
        },
        'Viscosité': {
          id: 'viscosite',
          name: 'Viscosité',
          type: 'physique',
          expectedValue: '3000-4000 cP',
          actualValue: '',
          result: 'pending',
          notes: '',
          photos: [],
          timestamp: null
        },
        'pH': {
          id: 'ph',
          name: 'pH',
          type: 'chimique',
          expectedValue: '7.0-7.5',
          actualValue: '',
          result: 'pending',
          notes: '',
          photos: [],
          timestamp: null
        },
        'Odeur': {
          id: 'odeur',
          name: 'Odeur',
          type: 'olfactif',
          expectedValue: 'Fraîcheur, légère note d\'agrumes',
          actualValue: '',
          result: 'pending',
          notes: '',
          photos: [],
          timestamp: null
        }
      });
    }
  }, [qualityChecks]);

  // Grouper les contrôles par type
  const groupedChecks = Object.values(checks).reduce((groups, check) => {
    const category = getCheckCategory(check.type);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(check);
    return groups;
  }, {});

  function getCheckCategory(type) {
    const categories = {
      'visuel': 'visual',
      'physique': 'physical',
      'chimique': 'chemical',
      'microbiologique': 'chemical',
      'fonctionnel': 'physical',
      'olfactif': 'visual',
      'environnemental': 'chemical'
    };
    return categories[type] || 'other';
  }

  function getCategoryInfo(category) {
    const info = {
      visual: {
        title: 'Contrôles Visuels et Sensoriels',
        icon: <VisibilityIcon />,
        color: 'primary'
      },
      physical: {
        title: 'Contrôles Physiques',
        icon: <ScienceIcon />,
        color: 'secondary'
      },
      chemical: {
        title: 'Contrôles Chimiques',
        icon: <ScienceIcon />,
        color: 'success'
      },
      other: {
        title: 'Autres Contrôles',
        icon: <InfoIcon />,
        color: 'info'
      }
    };
    return info[category] || info.other;
  }

  const handleCheckUpdate = (checkId, field, value) => {
    if (isReadOnly) return;

    setChecks(prev => {
      const updated = {
        ...prev,
        [checkId]: {
          ...prev[checkId],
          [field]: value,
          timestamp: field === 'result' ? new Date().toISOString() : prev[checkId].timestamp
        }
      };

      // Auto-déterminer le résultat pour certains types
      if (field === 'actualValue' && updated[checkId].type === 'chimique') {
        const actual = parseFloat(value);
        const expected = updated[checkId].expectedValue;
        
        if (expected.includes('-')) {
          const [min, max] = expected.split('-').map(v => parseFloat(v.trim()));
          if (actual >= min && actual <= max) {
            updated[checkId].result = 'conforme';
          } else {
            updated[checkId].result = 'non-conforme';
          }
        }
      }

      return updated;
    });
  };

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'conforme': return 'success';
      case 'non-conforme': return 'error';
      case 'acceptable': return 'warning';
      default: return 'default';
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case 'conforme': return <CheckCircleIcon />;
      case 'non-conforme': return <ErrorIcon />;
      case 'acceptable': return <WarningIcon />;
      default: return <InfoIcon />;
    }
  };

  const isAllChecksCompleted = () => {
    return Object.values(checks).every(check => 
      check.result !== 'pending' && check.actualValue.trim() !== ''
    );
  };

  const getOverallResult = () => {
    const results = Object.values(checks).map(check => check.result);
    if (results.includes('non-conforme')) return 'non-conforme';
    if (results.includes('acceptable')) return 'acceptable';
    if (results.every(r => r === 'conforme')) return 'conforme';
    return 'pending';
  };

  const handleValidate = () => {
    if (!isAllChecksCompleted()) {
      alert('Veuillez compléter tous les contrôles avant de valider.');
      return;
    }

    const overallResult = getOverallResult();
    
    if (overallResult === 'non-conforme') {
      const confirm = window.confirm(
        'Certains contrôles sont non-conformes. Voulez-vous vraiment valider ces résultats ?'
      );
      if (!confirm) return;
    }

    const formData = {
      checks: Object.values(checks),
      overallResult,
      notes,
      completedAt: new Date().toISOString(),
      operator: 'Current User' // À remplacer par l'utilisateur connecté
    };

    setValidated(true);
    onValidate(formData);
    if (onUpdate) onUpdate(formData);
  };

  const handleAddPhoto = (checkId) => {
    setPhotoDialog({ open: true, checkId });
  };

  const renderCheckCard = (check) => (
    <Card key={check.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="div">
              {check.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Valeur attendue: {check.expectedValue}
            </Typography>
          </Box>
          <Chip
            icon={getResultIcon(check.result)}
            label={check.result === 'pending' ? 'En attente' : 
                  check.result === 'conforme' ? 'Conforme' :
                  check.result === 'non-conforme' ? 'Non conforme' : 'Acceptable'}
            color={getResultColor(check.result)}
            size="small"
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Valeur mesurée"
              value={check.actualValue}
              onChange={(e) => handleCheckUpdate(check.name, 'actualValue', e.target.value)}
              disabled={isReadOnly}
              size="small"
              type={check.type === 'chimique' ? 'number' : 'text'}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Résultat</FormLabel>
              <RadioGroup
                row
                value={check.result}
                onChange={(e) => handleCheckUpdate(check.name, 'result', e.target.value)}
              >
                <FormControlLabel 
                  value="conforme" 
                  control={<Radio />} 
                  label="Conforme"
                  disabled={isReadOnly}
                />
                <FormControlLabel 
                  value="acceptable" 
                  control={<Radio />} 
                  label="Acceptable"
                  disabled={isReadOnly}
                />
                <FormControlLabel 
                  value="non-conforme" 
                  control={<Radio />} 
                  label="Non conforme"
                  disabled={isReadOnly}
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes et observations"
              multiline
              rows={2}
              value={check.notes}
              onChange={(e) => handleCheckUpdate(check.name, 'notes', e.target.value)}
              disabled={isReadOnly}
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                startIcon={<PhotoCameraIcon />}
                onClick={() => handleAddPhoto(check.id)}
                disabled={isReadOnly}
                size="small"
              >
                Ajouter photo
              </Button>
              {check.photos && check.photos.length > 0 && (
                <Chip label={`${check.photos.length} photo(s)`} size="small" />
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Contrôles Qualité
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Effectuez tous les contrôles qualité requis selon les spécifications du produit.
      </Typography>

      {/* Résumé du produit */}
      {productInfo && (
        <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Informations du produit
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Produit:</Typography>
                <Typography variant="body2">{productInfo.name} ({productInfo.code})</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Lot:</Typography>
                <Typography variant="body2">{productInfo.batchNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">Date:</Typography>
                <Typography variant="body2">{new Date().toLocaleDateString()}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Résultat global */}
      {validated && (
        <Alert 
          severity={getOverallResult() === 'conforme' ? 'success' : 
                   getOverallResult() === 'non-conforme' ? 'error' : 'warning'}
          sx={{ mb: 3 }}
        >
          <Typography variant="body2">
            <strong>Résultat global: </strong>
            {getOverallResult() === 'conforme' ? 'Tous les contrôles sont conformes' :
             getOverallResult() === 'non-conforme' ? 'Certains contrôles sont non-conformes' :
             'Contrôles acceptables avec réserves'}
          </Typography>
        </Alert>
      )}

      {/* Sections de contrôles */}
      {Object.entries(groupedChecks).map(([category, categoryChecks]) => {
        const categoryInfo = getCategoryInfo(category);
        return (
          <Paper key={category} sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: `${categoryInfo.color}.light`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onClick={() => handleSectionToggle(category)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {categoryInfo.icon}
                <Typography variant="h6">{categoryInfo.title}</Typography>
                <Chip 
                  label={`${categoryChecks.length} contrôle(s)`} 
                  size="small" 
                  color={categoryInfo.color}
                />
              </Box>
              {expandedSections[category] ? <ExpandLess /> : <ExpandMore />}
            </Box>
            
            <Collapse in={expandedSections[category]}>
              <Box sx={{ p: 2 }}>
                {categoryChecks.map(check => renderCheckCard(check))}
              </Box>
            </Collapse>
          </Paper>
        );
      })}

      {/* Notes générales */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notes générales du contrôle qualité
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ajoutez vos observations générales, recommandations ou commentaires..."
          disabled={isReadOnly}
        />
      </Paper>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {Object.values(checks).filter(c => c.result !== 'pending').length} / {Object.values(checks).length} contrôles complétés
        </Typography>
        
        <Button
          variant="contained"
          onClick={handleValidate}
          disabled={!isAllChecksCompleted() || validated || isReadOnly}
          size="large"
          startIcon={validated ? <CheckCircleIcon /> : undefined}
        >
          {validated ? 'Contrôles validés' : 'Valider les contrôles qualité'}
        </Button>
      </Box>

      {/* Dialog pour photos */}
      <Dialog open={photoDialog.open} onClose={() => setPhotoDialog({ open: false, checkId: null })}>
        <DialogTitle>Ajouter une photo</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Fonctionnalité à implémenter : capture et stockage des photos de contrôle qualité.
          </Typography>
          <input
            type="file"
            accept="image/*"
            style={{ width: '100%' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialog({ open: false, checkId: null })}>
            Annuler
          </Button>
          <Button variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QualityChecksForm;