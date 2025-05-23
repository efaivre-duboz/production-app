// frontend/src/App.jsx - Version complètement intégrée
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Pages principales
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

// Composants système
import Layout from './components/layout/Layout';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import ApiDiagnostic from './components/debug/ApiDiagnostic';

// Contexte et providers
import { AuthProvider } from './context/AuthContext';
import { ApiIntegrationProvider } from './components/system/NotificationSystem';

// L'application principale
function AppContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        {/* Route publique pour la connexion */}
        <Route path="/login" element={<Login />} />
        
        {/* Route de diagnostic (accessible sans authentification en dev) */}
        {process.env.NODE_ENV === 'development' && (
          <Route path="/api-diagnostic" element={<ApiDiagnostic />} />
        )}
        
        {/* Routes protégées pour tous les utilisateurs authentifiés */}
        <Route element={<RoleBasedRoute allowedRoles={[]} />}>
          <Route element={<Layout />}>
            {/* Routes de production (accessibles à tous les utilisateurs connectés) */}
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
            
            {/* Route de diagnostic pour les admins */}
            <Route path="admin/api-diagnostic" element={<ApiDiagnostic />} />
          </Route>
        </Route>
        
        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}

// Wrapper principal avec tous les providers
function App() {
  return (
    <ApiIntegrationProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ApiIntegrationProvider>
  );
}

export default App;