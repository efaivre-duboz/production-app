import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Pages
import Login from './pages/Login';
import ProductionScan from './pages/ProductionScan';
import Recipe from './pages/Recipe';
import QualityControl from './pages/QualityControl';
import ProductionEnd from './pages/ProductionEnd';
import ProductionHistory from './pages/ProductionHistory';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import ProductDetail from './pages/ProductDetail';
import ProductEdit from './pages/ProductEdit';

// Layout
import Layout from './components/layout/Layout';

// Context & Auth
import { AuthProvider } from './context/AuthContext';
import RoleBasedRoute from './components/auth/RoleBasedRoute';

// L'application principale
function AppContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />
        
        {/* Routes protégées pour tous les utilisateurs */}
        <Route element={<RoleBasedRoute allowedRoles={[]} />}>
          <Route element={<Layout />}>
            <Route index element={<ProductionScan />} />
            <Route path="recipe" element={<Recipe />} />
            <Route path="quality" element={<QualityControl />} />
            <Route path="end" element={<ProductionEnd />} />
          </Route>
        </Route>
        
        {/* Routes protégées pour les administrateurs uniquement */}
        <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
          <Route element={<Layout />}>
            <Route path="history" element={<ProductionHistory />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="product-management" element={<ProductManagement />} />
            <Route path="product-detail/:productId" element={<ProductDetail />} />
            <Route path="product-edit/:productId" element={<ProductEdit />} />
            <Route path="product-create" element={<ProductEdit />} />
          </Route>
        </Route>
        
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}

// Wrapper avec le contexte d'authentification
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;