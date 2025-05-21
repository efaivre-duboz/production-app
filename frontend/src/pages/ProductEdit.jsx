import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Tabs,
  Tab,
  MenuItem,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Science as ScienceIcon,
  Assignment as AssignmentIcon,
  FactCheck as FactCheckIcon
} from '@mui/icons-material';

// Importer les données des produits
import { products } from '../data/productsData';

const ProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isNewProduct = productId === undefined;
  const [tabValue, setTabValue] = useState(0);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Création d'un état pour le formulaire
  const [formData, setFormData] = useState({
    id: '',
    code: '',
    name: '',
    category: '',
    description: '',
    status: 'active',
    recipe: {
      ingredients: [],
      steps: [],
      qualityChecks: []
    }
  });

  // Liste des catégories disponibles
  const categories = ['Nettoyants', 'Dégraissants', 'Détergents', 'Désinfectants', 'Autres'];

  // Chargement du produit si en mode édition
  useEffect(() => {
    if (!isNewProduct) {
      // Dans une application réelle, cela serait une requête API
      const product = products.find(p => p.id === productId);
      if (product) {
        setFormData(product);
      } else {
        // Rediriger si le produit n'existe pas
        navigate('/product-management');
      }
    }
  }, [productId, isNewProduct, navigate]);

  // Gestion des changements d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Gestion des changements dans le formulaire principal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Réinitialisation des erreurs pour ce champ
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Gestion des changements pour les ingrédients
  const handleIngredientChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      recipe: {
        ...prev.recipe,
        ingredients: prev.recipe.ingredients.map(ing => 
          ing.id === id ? { ...ing, [field]: value } : ing
        )
      }
    }));
  };

  // Ajouter un nouvel ingrédient
  const handleAddIngredient = () => {
    const newIngredient = {
      id: Date.now(), // ID temporaire
      name: '',
      quantity: 0,
      unit: 'kg',
      notes: ''
    };

    setFormData(prev => ({
      ...prev,
      recipe: {
        ...prev.recipe,
        ingredients: [...prev.recipe.ingredients, newIngredient]
      }
    }));
  };

  // Supprimer un ingrédient
  const handleDeleteIngredient = (id) => {
    setFormData(prev => ({
      ...prev,
      recipe: {
        ...prev.recipe,
        ingredients: prev.recipe.ingredients.filter(ing => ing.id !== id)
      }
    }));
  };

  // Gestion des changements pour les étapes
  const handleStepChange = (order, field, value) => {
    setFormData(prev => ({
      ...prev,
      recipe: {
        ...prev.recipe,
        steps: prev.recipe.steps.map(step => 
          step.order === order ? { ...step, [field]: value } : step
        )
      }
    }));
  };

  // Ajouter une nouvelle étape
  const handleAddStep = () => {
    const newOrder = formData.recipe.steps.length > 0 
      ? Math.max(...formData.recipe.steps.map(s => s.order)) + 1 
      : 1;

    const newStep = {
      order: newOrder,
      title: '',
      instructions: '',
      duration: 0
    };

    setFormData(prev => ({
      ...prev,
      recipe: {
        ...prev.recipe,
        steps: [...prev.recipe.steps, newStep]
      }
    }));
  };

  // Supprimer une étape
  const handleDeleteStep = (order) => {
    setFormData(prev => ({
      ...prev,
      recipe: {
        ...prev.recipe,
        steps: prev.recipe.steps.filter(step => step.order !== order)
      }
    }));
  };

  // Gestion des changements pour les contrôles qualité
  const handleQualityCheckChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      recipe: {
        ...prev.recipe,
        qualityChecks: prev.recipe.qualityChecks.map((check, i) => 
          i === index ? { ...check, [field]: value } : check
        )
      }
    }));
  };

  // Ajouter un nouveau contrôle qualité
  const handleAddQualityCheck = () => {
    const newCheck = {
      name: '',
      type: '',
      expectedValue: ''
    };

    setFormData(prev => ({
      ...prev,
      recipe: {
        ...prev.recipe,
        qualityChecks: [...prev.recipe.qualityChecks, newCheck]
      }
    }));
  };

  // Supprimer un contrôle qualité
  const handleDeleteQualityCheck = (index) => {
    setFormData(prev => ({
      ...prev,
      recipe: {
        ...prev.recipe,
        qualityChecks: prev.recipe.qualityChecks.filter((_, i) => i !== index)
      }
    }));
  };

  // Validation du formulaire
  const validateForm = () => {
    const errors = {};

    if (!formData.code.trim()) errors.code = 'Le code produit est requis';
    if (!formData.name.trim()) errors.name = 'Le nom du produit est requis';
    if (!formData.category) errors.category = 'La catégorie est requise';

    // Validation des ingrédients
    const ingredientErrors = formData.recipe.ingredients.some(ing => !ing.name.trim() || ing.quantity <= 0);
    if (ingredientErrors) errors.ingredients = 'Tous les ingrédients doivent avoir un nom et une quantité positive';

    // Validation des étapes
    const stepErrors = formData.recipe.steps.some(step => !step.title.trim() || !step.instructions.trim() || step.duration <= 0);
    if (stepErrors) errors.steps = 'Toutes les étapes doivent avoir un titre, des instructions et une durée positive';

    // Validation des contrôles qualité
    const qualityErrors = formData.recipe.qualityChecks.some(check => !check.name.trim() || !check.type.trim() || !check.expectedValue.trim());
    if (qualityErrors) errors.qualityChecks = 'Tous les contrôles qualité doivent être remplis';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Ouverture du dialogue de sauvegarde
  const handleSaveClick = () => {
    if (validateForm()) {
      setSaveDialogOpen(true);
    } else {
      // Faire défiler jusqu'à la première erreur
      const firstErrorTab = ['ingredients', 'steps', 'qualityChecks'].find(tab => formErrors[tab]);
      if (firstErrorTab === 'ingredients') setTabValue(0);
      else if (firstErrorTab === 'steps') setTabValue(1);
      else if (firstErrorTab === 'qualityChecks') setTabValue(2);
    }
  };

  // Confirmation de sauvegarde
  const handleSaveConfirm = () => {
    // Dans une application réelle, cela enverrait les données au serveur
    console.log('Données du produit à sauvegarder:', formData);
    setSaveDialogOpen(false);
    navigate(`/product-detail/${formData.id || 'new'}`);
  };

  // Annulation de la sauvegarde
  const handleSaveCancel = () => {
    setSaveDialogOpen(false);
  };

  // Ouverture du dialogue d'annulation
  const handleCancelClick = () => {
    setCancelDialogOpen(true);
  };

  // Confirmation d'annulation
  const handleCancelConfirm = () => {
    setCancelDialogOpen(false);
    navigate(isNewProduct ? '/product-management' : `/product-detail/${productId}`);
  };

  // Annulation de l'annulation
  const handleCancelCancel = () => {
    setCancelDialogOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleCancelClick}
            sx={{ mr: 2 }}
          >
            Annuler
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ flexGrow: 1 }}>
            {isNewProduct ? 'Nouveau Produit' : `Modification - ${formData.name}`}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveClick}
          >
            Enregistrer
          </Button>
        </Box>

        <Paper sx={{ mb: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Informations générales
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Code Produit"
                name="code"
                value={formData.code}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.code}
                helperText={formErrors.code}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <TextField
                label="Nom du Produit"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                label="Catégorie"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.category}
                helperText={formErrors.category}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Statut</FormLabel>
                <RadioGroup
                  row
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <FormControlLabel value="active" control={<Radio />} label="Actif" />
                  <FormControlLabel value="inactive" control={<Radio />} label="Inactif" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </Paper>

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
                    startIcon={<AddIcon />}
                    onClick={handleAddIngredient}
                  >
                    Ajouter un ingrédient
                  </Button>
                </Box>
                
                {formErrors.ingredients && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {formErrors.ingredients}
                  </Alert>
                )}
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nom de l'ingrédient</TableCell>
                        <TableCell align="right">Quantité</TableCell>
                        <TableCell align="right">Unité</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.recipe.ingredients.map((ingredient) => (
                        <TableRow key={ingredient.id}>
                          <TableCell>
                            <TextField
                              value={ingredient.name}
                              onChange={(e) => handleIngredientChange(ingredient.id, 'name', e.target.value)}
                              fullWidth
                              size="small"
                              placeholder="Nom de l'ingrédient"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={ingredient.quantity}
                              onChange={(e) => handleIngredientChange(ingredient.id, 'quantity', parseFloat(e.target.value) || 0)}
                              size="small"
                              inputProps={{ min: 0, step: 0.1 }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              select
                              value={ingredient.unit}
                              onChange={(e) => handleIngredientChange(ingredient.id, 'unit', e.target.value)}
                              size="small"
                              sx={{ width: 80 }}
                            >
                              <MenuItem value="kg">kg</MenuItem>
                              <MenuItem value="l">l</MenuItem>
                              <MenuItem value="g">g</MenuItem>
                              <MenuItem value="ml">ml</MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={ingredient.notes}
                              onChange={(e) => handleIngredientChange(ingredient.id, 'notes', e.target.value)}
                              fullWidth
                              size="small"
                              placeholder="Notes optionnelles"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteIngredient(ingredient.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {formData.recipe.ingredients.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            Aucun ingrédient ajouté. Cliquez sur "Ajouter un ingrédient" pour commencer.
                          </TableCell>
                        </TableRow>
                      )}
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
                    startIcon={<AddIcon />}
                    onClick={handleAddStep}
                  >
                    Ajouter une étape
                  </Button>
                </Box>
                
                {formErrors.steps && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {formErrors.steps}
                  </Alert>
                )}
                
                {formData.recipe.steps.map((step) => (
                  <Paper key={step.order} sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Étape {step.order}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteStep(step.order)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={9}>
                        <TextField
                          label="Titre de l'étape"
                          value={step.title}
                          onChange={(e) => handleStepChange(step.order, 'title', e.target.value)}
                          fullWidth
                          size="small"
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Durée (min)"
                          type="number"
                          value={step.duration}
                          onChange={(e) => handleStepChange(step.order, 'duration', parseInt(e.target.value) || 0)}
                          fullWidth
                          size="small"
                          inputProps={{ min: 0 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Instructions"
                          value={step.instructions}
                          onChange={(e) => handleStepChange(step.order, 'instructions', e.target.value)}
                          fullWidth
                          multiline
                          rows={3}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
                
                {formData.recipe.steps.length === 0 && (
                  <Alert severity="info">
                    Aucune étape ajoutée. Cliquez sur "Ajouter une étape" pour commencer.
                  </Alert>
                )}
              </Box>
            )}
            
            {/* Onglet des contrôles qualité */}
            {tabValue === 2 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Contrôles qualité</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddQualityCheck}
                  >
                    Ajouter un contrôle
                  </Button>
                </Box>
                
                {formErrors.qualityChecks && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {formErrors.qualityChecks}
                  </Alert>
                )}
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Paramètre</TableCell>
                        <TableCell>Type de contrôle</TableCell>
                        <TableCell>Valeur attendue</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.recipe.qualityChecks.map((check, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              value={check.name}
                              onChange={(e) => handleQualityCheckChange(index, 'name', e.target.value)}
                              fullWidth
                              size="small"
                              placeholder="Paramètre à contrôler"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              select
                              value={check.type}
                              onChange={(e) => handleQualityCheckChange(index, 'type', e.target.value)}
                              fullWidth
                              size="small"
                            >
                              <MenuItem value="visuel">Visuel</MenuItem>
                              <MenuItem value="physique">Physique</MenuItem>
                              <MenuItem value="chimique">Chimique</MenuItem>
                              <MenuItem value="microbiologique">Microbiologique</MenuItem>
                              <MenuItem value="fonctionnel">Fonctionnel</MenuItem>
                              <MenuItem value="olfactif">Olfactif</MenuItem>
                              <MenuItem value="environnemental">Environnemental</MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={check.expectedValue}
                              onChange={(e) => handleQualityCheckChange(index, 'expectedValue', e.target.value)}
                              fullWidth
                              size="small"
                              placeholder="Valeur attendue"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteQualityCheck(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {formData.recipe.qualityChecks.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            Aucun contrôle qualité ajouté. Cliquez sur "Ajouter un contrôle" pour commencer.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancelClick}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveClick}
          >
            Enregistrer
          </Button>
        </Box>

        {/* Dialogue de confirmation de sauvegarde */}
        <Dialog
          open={saveDialogOpen}
          onClose={handleSaveCancel}
        >
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir enregistrer ces modifications ? 
              {!isNewProduct && " Elles n'affecteront que les futures productions."}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveCancel}>Annuler</Button>
            <Button onClick={handleSaveConfirm} color="primary" variant="contained">
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialogue de confirmation d'annulation */}
        <Dialog
          open={cancelDialogOpen}
          onClose={handleCancelCancel}
        >
          <DialogTitle>Annuler les modifications</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir annuler ? Toutes les modifications non enregistrées seront perdues.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelCancel} color="primary">
              Continuer l'édition
            </Button>
            <Button onClick={handleCancelConfirm} color="error">
              Annuler les modifications
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ProductEdit;