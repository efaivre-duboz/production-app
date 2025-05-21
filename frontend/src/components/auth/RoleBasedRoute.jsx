import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Composant pour protéger les routes basées sur le rôle
const RoleBasedRoute = ({ allowedRoles = [] }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Pour le développement, permettre l'accès si l'authentification est contournée
  const isBypassedAuth = localStorage.getItem('authBypass') === 'true';
  const bypassRole = localStorage.getItem('userRole');
  
  // Vérifier si l'utilisateur a le rôle requis
  const hasRequiredRole = 
    allowedRoles.length === 0 || 
    (currentUser?.role && allowedRoles.includes(currentUser.role)) ||
    (isBypassedAuth && bypassRole && allowedRoles.includes(bypassRole));
  
  // Si l'utilisateur n'a pas le rôle requis, rediriger vers la page d'accueil
  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }
  
  // Si l'utilisateur est authentifié et a le rôle requis, afficher le contenu
  return <Outlet />;
};

export default RoleBasedRoute;