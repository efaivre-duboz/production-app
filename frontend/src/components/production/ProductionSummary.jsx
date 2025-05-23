import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Science as ScienceIcon,
  Assignment as AssignmentIcon,
  FactCheck as FactCheckIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';

const ProductionSummary = ({ 
  productionData, 
  onExport, 
  onPrint, 
  showActions = true,
  compact = false 
}) => {
  const [exportDialog, setExportDialog] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState('pdf');

  // Données par défaut si aucune donnée n'est fournie
  const defaultData = {
    product: {
      code: 'A123',
      name: 'Nettoyant Multi-Surfaces',
      batchNumber: 'L789'
    },
    production: {
      id: 'P001',
      operator: 'Utilisateur Test',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      status: 'completed',
      totalDuration: 22500, // 6h15m en secondes
      pauseDuration: 1800,   // 30m en secondes
      netDuration: 20700     // 5h45m en secondes
    },
    ingredients: [
      { name: 'Eau déminéralisée', required: 75.0, actual: 74.8, unit: 'kg', deviation: -0.3 },
      { name: 'Polymère A', required: 15.0, actual: 15.2, unit: 'kg', deviation: 1.3 },
      { name: 'Additif B', required: 5.0, actual: 5.0, unit: 'kg', deviation: 0 },
      { name: 'Colorant C', required: 2.5, actual: 2.4, unit: 'kg', deviation: -4.0 },
      { name: 'Conservateur D', required: 1.5, actual: 1.5, unit: 'kg', deviation: 0 },
      { name: 'Parfum E', required: 1.0, actual: 1.0, unit: 'kg', deviation: 0 }
    ],
    qualityChecks: {
      checks: [
        { name: 'Apparence', result: 'conforme', actualValue: 'Liquide clair, légèrement bleuté', expectedValue: 'Conforme aux spécifications' },
        { name: 'Viscosité', result: 'conforme', actualValue: '3500 cP', expectedValue: '3000-4000 cP' },
        { name: 'pH', result: 'conforme', actualValue: '7.2', expectedValue: '7.0-7.5' },
        { name: 'Odeur', result: 'conforme', actualValue: 'Fraîcheur agrumes', expectedValue: 'Fraîcheur, légère note d\'agrumes' }
      ],
      overallResult: 'conforme',
      notes: 'Production conforme à toutes les spécifications'
    },
    finalResults: {
      finalQuantity: 98.5,
      wastageQuantity: 1.5,
      yield: 98.5,
      notes: 'Production normale sans incident'
    },
    pauseHistory: [
      {
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date(Date.now() - 1800000).toISOString(),
        duration: 1800,
        reason: 'Changement d\'équipe',
        category: 'personnel'
      }
    ]
  };

  const data = productionData || defaultData;

  // Fonctions utilitaires
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'in_progress': return 'warning';
      default: return 'default';
    }
  };

  const getQualityColor = (result) => {
    switch (result) {
      case 'conforme': return 'success';
      case 'non-conforme': return 'error';
      case 'acceptable': return 'warning';
      default: return 'default';
    }
  };

  const getDeviationColor = (deviation) => {
    const abs = Math.abs(deviation);
    if (abs <= 2) return 'success';
    if (abs <= 5) return 'warning';
    return 'error';
  };

  const handleExport = (format) => {
    setSelectedExportFormat(format);
    setExportDialog(false);
    if (onExport) {
      onExport(format, data);
    }
  };

  // Calculs de performance
  const totalIngredients = data.ingredients.reduce((sum, ing) => sum + ing.actual, 0);
  const efficiency = ((data.production.netDuration / data.production.totalDuration) * 100).toFixed(1);
  const qualityScore = (data.qualityChecks.checks.filter(c => c.result === 'conforme').length / data.qualityChecks.checks.length * 100).toFixed(0);

  return (
    <Box>
      {/* En-tête du résumé */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              Résumé de Production
            </Typography>
            <Typography variant="h6">
              {data.product.name} - Lot {data.product.batchNumber}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Production ID: {data.production.id} | Code: {data.product.code}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Chip
              icon={<CheckCircleIcon />}
              label={`Statut: ${data.production.status === 'completed' ? 'Terminé' : 
                     data.production.status === 'failed' ? 'Échoué' : 'En cours'}`}
              color={getStatusColor(data.production.status)}
              size="large"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Terminé le {formatDateTime(data.production.endDate)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Métriques principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccessTimeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" component="div">
                {formatDuration(data.production.totalDuration)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Durée totale
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScienceIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h5" component="div">
                {data.finalResults.finalQuantity} kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quantité produite
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FactCheckIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h5" component="div">
                {qualityScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Score qualité
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h5" component="div">
                {efficiency}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Efficacité
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sections détaillées */}
      <Grid container spacing={3}>
        {/* Informations générales */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Informations Générales"
              avatar={<PersonIcon />}
            />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Opérateur" 
                    secondary={data.production.operator} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Début de production" 
                    secondary={formatDateTime(data.production.startDate)} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ScheduleIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Durée nette" 
                    secondary={formatDuration(data.production.netDuration)} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><WarningIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Temps de pause" 
                    secondary={formatDuration(data.production.pauseDuration)} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Résultats finaux */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Résultats de Production" />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Rendement de production
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={data.finalResults.yield} 
                  sx={{ height: 10, borderRadius: 5, mb: 1 }}
                  color="success"
                />
                <Typography variant="body2" fontWeight="bold">
                  {data.finalResults.yield}%
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Quantité finale
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {data.finalResults.finalQuantity} kg
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Rebuts
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    {data.finalResults.wastageQuantity} kg
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sections accordéon pour les détails */}
      <Box sx={{ mt: 3 }}>
        {/* Ingrédients */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScienceIcon />
              <Typography variant="h6">Ingrédients utilisés</Typography>
              <Chip 
                label={`${data.ingredients.length} ingrédients`} 
                size="small" 
                color="primary"
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ingrédient</TableCell>
                    <TableCell align="right">Requis</TableCell>
                    <TableCell align="right">Utilisé</TableCell>
                    <TableCell align="right">Unité</TableCell>
                    <TableCell align="right">Écart</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.ingredients.map((ingredient, index) => (
                    <TableRow key={index}>
                      <TableCell>{ingredient.name}</TableCell>
                      <TableCell align="right">{ingredient.required}</TableCell>
                      <TableCell align="right">{ingredient.actual}</TableCell>
                      <TableCell align="right">{ingredient.unit}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${ingredient.deviation > 0 ? '+' : ''}${ingredient.deviation.toFixed(1)}%`}
                          size="small"
                          color={getDeviationColor(ingredient.deviation)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>

        {/* Contrôles qualité */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FactCheckIcon />
              <Typography variant="h6">Contrôles Qualité</Typography>
              <Chip
                icon={data.qualityChecks.overallResult === 'conforme' ? <CheckCircleIcon /> : <WarningIcon />}
                label={data.qualityChecks.overallResult === 'conforme' ? 'Conforme' : 'Non conforme'}
                size="small"
                color={getQualityColor(data.qualityChecks.overallResult)}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Paramètre</TableCell>
                    <TableCell>Valeur attendue</TableCell>
                    <TableCell>Valeur mesurée</TableCell>
                    <TableCell>Résultat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.qualityChecks.checks.map((check, index) => (
                    <TableRow key={index}>
                      <TableCell>{check.name}</TableCell>
                      <TableCell>{check.expectedValue}</TableCell>
                      <TableCell>{check.actualValue}</TableCell>
                      <TableCell>
                        <Chip
                          icon={check.result === 'conforme' ? <CheckCircleIcon /> : <WarningIcon />}
                          label={check.result === 'conforme' ? 'Conforme' : 'Non conforme'}
                          size="small"
                          color={getQualityColor(check.result)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {data.qualityChecks.notes && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <strong>Notes:</strong> {data.qualityChecks.notes}
              </Alert>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Historique des pauses */}
        {data.pauseHistory && data.pauseHistory.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon />
                <Typography variant="h6">Historique des Pauses</Typography>
                <Chip 
                  label={`${data.pauseHistory.length} pause(s)`} 
                  size="small" 
                  color="warning"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Début</TableCell>
                      <TableCell>Fin</TableCell>
                      <TableCell>Durée</TableCell>
                      <TableCell>Raison</TableCell>
                      <TableCell>Catégorie</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.pauseHistory.map((pause, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDateTime(pause.startTime)}</TableCell>
                        <TableCell>{formatDateTime(pause.endTime)}</TableCell>
                        <TableCell>{formatDuration(pause.duration)}</TableCell>
                        <TableCell>{pause.reason}</TableCell>
                        <TableCell>
                          <Chip
                            label={pause.category === 'equipment' ? 'Équipement' :
                                   pause.category === 'material' ? 'Matériaux' :
                                   pause.category === 'personnel' ? 'Personnel' : 'Autre'}
                            size="small"
                            color="default"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>

      {/* Actions */}
      {showActions && (
        <Paper sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => onPrint && onPrint(data)}
            >
              Imprimer
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => setExportDialog(true)}
            >
              Exporter
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
            >
              Partager
            </Button>
          </Box>
        </Paper>
      )}

      {/* Dialog d'export */}
      <Dialog open={exportDialog} onClose={() => setExportDialog(false)}>
        <DialogTitle>Exporter le résumé de production</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choisissez le format d'export souhaité :
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant={selectedExportFormat === 'pdf' ? 'contained' : 'outlined'}
              onClick={() => handleExport('pdf')}
            >
              PDF - Rapport complet
            </Button>
            <Button
              variant={selectedExportFormat === 'excel' ? 'contained' : 'outlined'}
              onClick={() => handleExport('excel')}
            >
              Excel - Données tabulaires
            </Button>
            <Button
              variant={selectedExportFormat === 'json' ? 'contained' : 'outlined'}
              onClick={() => handleExport('json')}
            >
              JSON - Données brutes
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductionSummary;