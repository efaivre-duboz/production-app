import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Importer les données
import { productionHistory } from '../data/productionHistory';

const ProductionHistory = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTab, setDetailTab] = useState(0);
  
  // Formater la durée en heures et minutes
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  // Filtrer les productions
  const filteredProductions = productionHistory.filter(production => 
    production.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    production.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    production.operator.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Gérer le changement de page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Gérer le changement du nombre de lignes par page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Ouvrir la boîte de dialogue des détails de production
  const handleOpenDetail = (production) => {
    setSelectedProduction(production);
    setDetailOpen(true);
    setDetailTab(0);
  };
  
  // Fermer la boîte de dialogue des détails
  const handleCloseDetail = () => {
    setDetailOpen(false);
  };
  
  // Gérer le changement d'onglet dans les détails
  const handleChangeDetailTab = (event, newValue) => {
    setDetailTab(newValue);
  };
  
  // Obtenir la couleur et l'icône en fonction du statut
  const getStatusInfo = (status) => {
    switch(status) {
      case 'completed':
        return { 
          color: 'success', 
          icon: <CheckCircleOutlineIcon fontSize="small" />, 
          label: 'Terminé' 
        };
      case 'in_progress':
        return { 
          color: 'warning', 
          icon: <HourglassEmptyIcon fontSize="small" />, 
          label: 'En cours' 
        };
      case 'failed':
        return { 
          color: 'error', 
          icon: <ErrorOutlineIcon fontSize="small" />, 
          label: 'Échoué' 
        };
      default:
        return { 
          color: 'default', 
          icon: null, 
          label: status 
        };
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Historique de Production
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
          Consultez et analysez l'historique des productions
        </Typography>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          {/* Filtres et recherche */}
          <Box sx={{ display: 'flex', mb: 3, gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Rechercher un lot, produit ou opérateur..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
            >
              Filtres
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
            >
              Exporter
            </Button>
          </Box>
          
          {/* Tableau des productions */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'secondary.light' }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Produit</TableCell>
                  <TableCell>Lot</TableCell>
                  <TableCell>Opérateur</TableCell>
                  <TableCell>Durée</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProductions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((production) => {
                    const statusInfo = getStatusInfo(production.status);
                    return (
                      <TableRow key={production.id} hover>
                        <TableCell>
                          {new Date(production.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{production.productCode}</TableCell>
                        <TableCell>{production.batchNumber}</TableCell>
                        <TableCell>{production.operator}</TableCell>
                        <TableCell>{formatDuration(production.totalDuration)}</TableCell>
                        <TableCell>
                          <Chip 
                            icon={statusInfo.icon}
                            label={statusInfo.label}
                            color={statusInfo.color}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="text"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleOpenDetail(production)}
                          >
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {filteredProductions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        Aucune production trouvée.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProductions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        </Paper>
        
        {/* Boîte de dialogue des détails */}
        <Dialog 
          open={detailOpen} 
          onClose={handleCloseDetail}
          fullWidth
          maxWidth="md"
        >
          {selectedProduction && (
            <>
              <DialogTitle>
                Détails de la Production - {selectedProduction.productCode} ({selectedProduction.batchNumber})
              </DialogTitle>
              <Tabs
                value={detailTab}
                onChange={handleChangeDetailTab}
                sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
              >
                <Tab label="Général" />
                <Tab label="Ingrédients" />
                <Tab label="Qualité" />
                <Tab label="Pauses" />
              </Tabs>
              <DialogContent>
                {detailTab === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Produit</Typography>
                      <Typography variant="body1" gutterBottom>{selectedProduction.productCode}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Lot</Typography>
                      <Typography variant="body1" gutterBottom>{selectedProduction.batchNumber}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Date de début</Typography>
                      <Typography variant="body1" gutterBottom>
                        {new Date(selectedProduction.startDate).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Date de fin</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedProduction.endDate 
                          ? new Date(selectedProduction.endDate).toLocaleString()
                          : "En cours"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Opérateur</Typography>
                      <Typography variant="body1" gutterBottom>{selectedProduction.operator}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Statut</Typography>
                      <Typography variant="body1" gutterBottom>
                        <Chip 
                          icon={getStatusInfo(selectedProduction.status).icon}
                          label={getStatusInfo(selectedProduction.status).label}
                          color={getStatusInfo(selectedProduction.status).color}
                          size="small"
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Durée totale</Typography>
                      <Typography variant="body1" gutterBottom>{formatDuration(selectedProduction.totalDuration)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Durée des pauses</Typography>
                      <Typography variant="body1" gutterBottom>{formatDuration(selectedProduction.pauseDuration)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Durée nette</Typography>
                      <Typography variant="body1" gutterBottom>{formatDuration(selectedProduction.netDuration)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                      <Typography variant="body1">{selectedProduction.notes || "Aucune note"}</Typography>
                    </Grid>
                  </Grid>
                )}
                
                {detailTab === 1 && (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Ingrédient</TableCell>
                          <TableCell align="right">Quantité requise</TableCell>
                          <TableCell align="right">Quantité réelle</TableCell>
                          <TableCell align="right">Unité</TableCell>
                          <TableCell align="right">Écart</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedProduction.ingredients.map((ingredient, index) => {
                          const deviation = ingredient.actual 
                            ? ((ingredient.actual - ingredient.required) / ingredient.required * 100).toFixed(1)
                            : null;
                          return (
                            <TableRow key={index}>
                              <TableCell>{ingredient.name}</TableCell>
                              <TableCell align="right">{ingredient.required}</TableCell>
                              <TableCell align="right">{ingredient.actual || "N/A"}</TableCell>
                              <TableCell align="right">{ingredient.unit}</TableCell>
                              <TableCell align="right" sx={{ 
                                color: deviation && Math.abs(parseFloat(deviation)) > 5 
                                  ? 'error.main' 
                                  : 'inherit'
                              }}>
                                {deviation ? `${deviation > 0 ? '+' : ''}${deviation}%` : "N/A"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                
                {detailTab === 2 && (
                  <Box>
                    {selectedProduction.qualityChecks ? (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Apparence</Typography>
                          <Typography variant="body1" gutterBottom>
                            <Chip 
                              label={selectedProduction.qualityChecks.appearanceCheck}
                              color={selectedProduction.qualityChecks.appearanceCheck === "conforme" ? "success" : "error"}
                              size="small"
                            />
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Viscosité</Typography>
                          <Typography variant="body1" gutterBottom>
                            <Chip 
                              label={selectedProduction.qualityChecks.viscosityCheck}
                              color={selectedProduction.qualityChecks.viscosityCheck === "conforme" ? "success" : "error"}
                              size="small"
                            />
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">pH</Typography>
                          <Typography variant="body1" gutterBottom>{selectedProduction.qualityChecks.pHValue}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Odeur</Typography>
                          <Typography variant="body1" gutterBottom>
                            <Chip 
                              label={selectedProduction.qualityChecks.odorCheck}
                              color={selectedProduction.qualityChecks.odorCheck === "conforme" ? "success" : "error"}
                              size="small"
                            />
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : (
                      <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                        Aucun contrôle qualité n'a encore été effectué.
                      </Typography>
                    )}
                  </Box>
                )}
                
                {detailTab === 3 && (
                  <Box>
                    {selectedProduction.pauseHistory.length > 0 ? (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Début</TableCell>
                              <TableCell>Fin</TableCell>
                              <TableCell>Durée</TableCell>
                              <TableCell>Catégorie</TableCell>
                              <TableCell>Raison</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedProduction.pauseHistory.map((pause, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {new Date(pause.startTime).toLocaleTimeString()}
                                </TableCell>
                                <TableCell>
                                  {new Date(pause.endTime).toLocaleTimeString()}
                                </TableCell>
                                <TableCell>
                                  {Math.floor(pause.duration / 60)}m {pause.duration % 60}s
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={(() => {
                                      switch(pause.category) {
                                        case 'equipment': return 'Équipement';
                                        case 'material': return 'Matériaux';
                                        case 'personnel': return 'Personnel';
                                        default: return 'Autre';
                                      }
                                    })()}
                                    size="small"
                                    color={(() => {
                                      switch(pause.category) {
                                        case 'equipment': return 'error';
                                        case 'material': return 'warning';
                                        case 'personnel': return 'info';
                                        default: return 'default';
                                      }
                                    })()}
                                  />
                                </TableCell>
                                <TableCell>{pause.reason}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                        Aucune pause n'a été enregistrée pour cette production.
                      </Typography>
                    )}
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDetail}>Fermer</Button>
                <Button variant="contained" startIcon={<DownloadIcon />}>
                  Exporter en PDF
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Container>
  );
};

export default ProductionHistory;