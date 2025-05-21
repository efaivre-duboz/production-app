import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Science as ScienceIcon,
  Assignment as AssignmentIcon,
  FactCheck as FactCheckIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

// Importer les données des produits
import { products } from '../data/productsData';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Dans une application réelle, cela serait une requête API
    const fetchProduct = () => {
      try {
        const foundProduct = products.find(p => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Produit non trouvé');
        }
      } catch (err) {
        setError('Erreur lors du chargement du produit');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/product-management');
  };

  const handleEdit = () => {
    navigate(`/product-edit/${productId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>Chargement du produit...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error || 'Produit non trouvé'}</Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Retour à la liste des produits
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Retour
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ flexGrow: 1 }}>
            {product.name}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{ mr: 2 }}
            onClick={handleEdit}
          >
            Modifier
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informations générales
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Code produit
                  </Typography>
                  <Typography variant="body1">
                    {product.code}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Catégorie
                  </Typography>
                  <Typography variant="body1">
                    {product.category}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Statut
                  </Typography>
                  <Chip
                    label={product.status === 'active' ? 'Actif' : 'Inactif'}
                    color={product.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date de création
                  </Typography>
                  <Typography variant="body1">
                    {product.createdAt}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Dernière mise à jour
                  </Typography>
                  <Typography variant="body1">
                    {product.updatedAt}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1">
                  {product.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Ingrédients" icon={<ScienceIcon />} iconPosition="start" />
                <Tab label="Étapes" icon={<AssignmentIcon />} iconPosition="start" />
                <Tab label="Contrôles qualité" icon={<FactCheckIcon />} iconPosition="start" />
              </Tabs>
              
              <Box sx={{ p: 3 }}>
                {/* Onglet des ingrédients */}
                {tabValue === 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Liste des ingrédients</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                      >
                        Modifier les ingrédients
                      </Button>
                    </Box>
                    
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Nom de l'ingrédient</TableCell>
                            <TableCell align="right">Quantité</TableCell>
                            <TableCell align="right">Unité</TableCell>
                            <TableCell>Notes</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {product.recipe.ingredients.map((ingredient) => (
                            <TableRow key={ingredient.id}>
                              <TableCell>{ingredient.name}</TableCell>
                              <TableCell align="right">{ingredient.quantity}</TableCell>
                              <TableCell align="right">{ingredient.unit}</TableCell>
                              <TableCell>{ingredient.notes || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
                
                {/* Onglet des étapes */}
                {tabValue === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Étapes de production</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                      >
                        Modifier les étapes
                      </Button>
                    </Box>
                    
                    <List>
                      {product.recipe.steps.map((step) => (
                        <Paper key={step.order} sx={{ mb: 2, p: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Étape {step.order}: {step.title}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                            {step.instructions}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <TimelineIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                            <Typography variant="body2" color="text.secondary">
                              Durée estimée: {step.duration} minutes
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </List>
                  </Box>
                )}
                
                {/* Onglet des contrôles qualité */}
                {tabValue === 2 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Contrôles qualité</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                      >
                        Modifier les contrôles
                      </Button>
                    </Box>
                    
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Paramètre</TableCell>
                            <TableCell>Type de contrôle</TableCell>
                            <TableCell>Valeur attendue</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {product.recipe.qualityChecks.map((check, index) => (
                            <TableRow key={index}>
                              <TableCell>{check.name}</TableCell>
                              <TableCell>{check.type}</TableCell>
                              <TableCell>{check.expectedValue}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Box>
            </Paper>
            
            <Alert severity="info">
              <Typography variant="body2">
                Les modifications apportées à la recette n'affecteront que les futures productions.
                Les productions en cours ou terminées utiliseront la version de la recette au moment de leur création.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetail;