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
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Importer les données des produits
import { products } from '../data/productsData';

const ProductManagement = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productStats, setProductStats] = useState({
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    inactive: products.filter(p => p.status === 'inactive').length
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Extraire toutes les catégories uniques
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // Filtrer les produits en fonction des critères de recherche et des filtres
  const filteredProducts = products.filter(product => {
    const matchesSearch = (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Gérer le changement de page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Gérer le changement du nombre de lignes par page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gérer l'ouverture du menu de filtres
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  // Gérer la fermeture du menu de filtres
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Gérer le changement de filtre de catégorie
  const handleCategoryFilterChange = (category) => {
    setCategoryFilter(category);
    handleFilterClose();
  };

  // Gérer le changement de filtre de statut
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    handleFilterClose();
  };

  // Gérer l'ouverture du dialogue de suppression
  const handleDeleteDialogOpen = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
    handleActionMenuClose();
  };

  // Gérer la fermeture du dialogue de suppression
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Simuler la suppression d'un produit
  const handleDeleteProduct = () => {
    // Dans une application réelle, cela enverrait une requête à l'API
    console.log(`Produit supprimé: ${productToDelete.id}`);
    handleDeleteDialogClose();
    // Mettre à jour l'interface utilisateur pour refléter la suppression
    // (dans une application réelle, ce serait fait après confirmation de l'API)
  };

  // Gérer l'ouverture du menu d'actions
  const handleActionMenuOpen = (event, productId) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedProductId(productId);
  };

  // Gérer la fermeture du menu d'actions
  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
    setSelectedProductId(null);
  };

  // Naviguer vers la page d'édition du produit
  const handleEditProduct = (productId) => {
    navigate(`/product-edit/${productId}`);
    handleActionMenuClose();
  };

  // Naviguer vers la page de détail du produit
  const handleViewProduct = (productId) => {
    navigate(`/product-detail/${productId}`);
    handleActionMenuClose();
  };

  // Naviguer vers la page de création de produit
  const handleAddProduct = () => {
    navigate('/product-create');
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gestion des Produits
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
          >
            Nouveau Produit
          </Button>
        </Box>

        {/* Stats cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {productStats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Produits au total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" color="success.main">
                  {productStats.active}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Produits actifs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" color="error.main">
                  {productStats.inactive}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Produits inactifs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', mb: 3, gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Rechercher un produit..."
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
              onClick={handleFilterClick}
            >
              Filtres
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              <MenuItem disabled>
                <Typography variant="subtitle2">Catégorie</Typography>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem
                  key={category}
                  onClick={() => handleCategoryFilterChange(category)}
                  selected={categoryFilter === category}
                >
                  {category === 'all' ? 'Toutes les catégories' : category}
                </MenuItem>
              ))}
              <Divider />
              <MenuItem disabled>
                <Typography variant="subtitle2">Statut</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => handleStatusFilterChange('all')}
                selected={statusFilter === 'all'}
              >
                Tous les statuts
              </MenuItem>
              <MenuItem
                onClick={() => handleStatusFilterChange('active')}
                selected={statusFilter === 'active'}
              >
                Actif
              </MenuItem>
              <MenuItem
                onClick={() => handleStatusFilterChange('inactive')}
                selected={statusFilter === 'inactive'}
              >
                Inactif
              </MenuItem>
            </Menu>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Dernière mise à jour</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>{product.code}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {product.description.length > 50
                          ? `${product.description.substring(0, 50)}...`
                          : product.description}
                      </TableCell>
                      <TableCell>{product.updatedAt}</TableCell>
                      <TableCell>
                        <Chip
                          label={product.status === 'active' ? 'Actif' : 'Inactif'}
                          color={product.status === 'active' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="more"
                          aria-controls="action-menu"
                          aria-haspopup="true"
                          onClick={(e) => handleActionMenuOpen(e, product.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Aucun produit trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
        </Paper>

        {/* Menu d'actions pour les produits */}
        <Menu
          id="action-menu"
          anchorEl={actionMenuAnchorEl}
          keepMounted
          open={Boolean(actionMenuAnchorEl)}
          onClose={handleActionMenuClose}
        >
          <MenuItem onClick={() => handleViewProduct(selectedProductId)}>
            <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
            Voir détails
          </MenuItem>
          <MenuItem onClick={() => handleEditProduct(selectedProductId)}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Modifier
          </MenuItem>
          <MenuItem
            onClick={() => handleDeleteDialogOpen(products.find(p => p.id === selectedProductId))}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Supprimer
          </MenuItem>
        </Menu>

        {/* Dialogue de confirmation de suppression */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
        >
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer le produit "{productToDelete?.name}" ? Cette action est irréversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Annuler
            </Button>
            <Button onClick={handleDeleteProduct} color="error">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ProductManagement;