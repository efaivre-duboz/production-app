import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import HomeIcon from '@mui/icons-material/Home';

const ProductionEnd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [production, setProduction] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [qualityResults, setQualityResults] = useState([]);
  const [formData, setFormData] = useState({
    finalQuantity: '',
    wastageQuantity: '',
    productionNotes: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [productionSummary, setProductionSummary] = useState(null);
  
  // Charger les données au montage
  useEffect(() => {
    loadProductionData();
  }, []);

  const loadProductionData = async () => {
    try {
      setLoading(true);
      
      // Récupérer toutes les données sauvegardées
      const productData = JSON.parse(localStorage.getItem('currentProductData') || '{}');
      const productCode = localStorage.getItem('currentProductCode');
      const batchNumber = localStorage.getItem('currentBatchNumber');
      const startTime = localStorage.getItem('productionStartTime');
      const operator = localStorage.getItem('currentOperator');
      
      if (!productData.code || !productCode) {
        navigate('/');
        return;
      }
      
      setProduct(productData);
      
      // Données de production
      const productionData = {
        productCode: productCode,
        batchNumber: batchNumber,
        operator: operator || 'Utilisateur',
        startTime: startTime,
        endTime: null
      };
      setProduction(productionData);
      
      // Charger les ingrédients utilisés
      const savedIngredients = JSON.parse(localStorage.getItem('productionIngredients') || '[]');
      setIngredients(savedIngredients);
      
      // Charger les résultats qualité
      const qualityData = JSON.parse(localStorage.getItem('qualityControlData') || '{}');
      if (qualityData.checks) {
        setQualityResults(qualityData.checks);
      }
      
      // Vérifier si déjà soumis
      const endData = localStorage.getItem('productionEndData');
      if (endData) {
        const parsedEndData = JSON.parse(endData);
        setFormData(parsedEndData.formData);
        setFormSubmitted(parsedEndData.submitted || false);
        setProductionSummary(parsedEndData.summary);
      }
      
    } catch (err) {
      console.error('Erreur lors du chargement des données de fin:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const calculateProductionSummary = () => {
    const startTime = new Date(production.startTime);
    const endTime = new Date();
    const totalDuration = Math.round((endTime - startTime) / 1000); // en secondes
    
    // Calculer les totaux d'ingrédients
    const totalRequiredWeight = ingredients.reduce((sum, ing) => sum + (ing.quantity || 0), 0);
    const totalActualWeight = ingredients.reduce((sum, ing) => sum + (parseFloat(ing.actual) || 0), 0);
    
    // Statistiques qualité
    const totalQualityChecks = qualityResults.length;
    const conformeChecks = qualityResults.filter(q => q.result === 'conforme').length;
    const nonConformeChecks = qualityResults.filter(q => q.result === 'non-conforme').length;
    
    // Calculs de rendement
    const theoreticalYield = totalRequiredWeight;
    const actualQuantity = parseFloat(formData.finalQuantity) || 0;
    const wastage = parseFloat(formData.wastageQuantity) || 0;
    const yield = actualQuantity + wastage;
    const yieldPercentage = theoreticalYield > 0 ? ((yield / theoreticalYield) * 100) : 0;
    const wastePercentage = yield > 0 ? ((wastage / yield) * 100) : 0;
    
    return {
      productInfo: {
        code: product.code,
        name: product.name,
        batch: production.batchNumber,
        operator: production.operator
      },
      timing: {
        startTime: startTime,
        endTime: endTime,
        totalDuration: totalDuration,
        durationFormatted: formatDuration(totalDuration)
      },
      ingredients: {
        totalRequired: totalRequiredWeight,
        totalActual: totalActualWeight,
        deviation: totalActualWeight - totalRequiredWeight,
        deviationPercentage: totalRequiredWeight > 0 ? (((totalActualWeight - totalRequiredWeight) / totalRequiredWeight) * 100) : 0
      },
      quality: {
        totalChecks: totalQualityChecks,
        conforme: conformeChecks,
        nonConforme: nonConformeChecks,
        conformePercentage: totalQualityChecks > 0 ? ((conformeChecks / totalQualityChecks) * 100) : 0
      },
      yield: {
        theoretical: theoreticalYield,
        actual: actualQuantity,
        wastage: wastage,
        total: yield,
        yieldPercentage: yieldPercentage,
        wastePercentage: wastePercentage
      }
    };
  };
  
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.finalQuantity || parseFloat(formData.finalQuantity) <= 0) {
      alert('Veuillez saisir une quantité finale valide');
      return;
    }
    
    // Calculer le résumé de production
    const summary = calculateProductionSummary();
    setProductionSummary(summary);
    
    // Sauvegarder les données finales
    const endData = {
      formData: formData,
      submitted: true,
      submittedAt: new Date().toISOString(),
      summary: summary
    };
    
    localStorage.setItem('productionEndData', JSON.stringify(endData));
    localStorage.setItem('productionCompleted', 'true');
    
    setFormSubmitted(true);
    
    console.log('✅ Production terminée:', endData);
  };
  
  const handleNewProduction = () => {
    // Nettoyer toutes les données de production
    const keysToRemove = [
      'currentProductCode',
      'currentBatchNumber', 
      'currentProductData',
      'productionStartTime',
      'currentOperator',
      'currentProductionId',
      'productionIngredients',
      'productionInstructionsCompleted',
      'productionRecipeCompleted',
      'qualityControlData',
      'qualityControlCompleted',
      'productionEndData',
      'productionCompleted',
      'instructionProgress'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    navigate('/');
  };

  const handleShowSummary = () => {
    setShowSummary(true);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const steps = ['Scan de production', 'Recette et instructions', 'Contrôle qualité', 'Fin de production'];

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography>Chargement des données de fin de production...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Fin de Production
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
          Complétez les informations finales de production
        </Typography>
        
        <Stepper activeStep={3} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}