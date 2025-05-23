// frontend/src/components/system/NotificationSystem.jsx
import React, { createContext, useContext } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  IconButton,
  Typography,
  Slide,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNotification, useApiIntegration } from '../../hooks/useApiIntegration';

// Contexte pour les notifications
const NotificationContext = createContext();

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

// Composant de transition pour les notifications
function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

// Composant individuel de notification
const NotificationItem = ({ notification, onClose }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'info': return <InfoIcon />;
      default: return <InfoIcon />;
    }
  };

  const getSeverity = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  return (
    <Alert
      severity={getSeverity(notification.type)}
      icon={getIcon(notification.type)}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => onClose(notification.id)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      sx={{ mb: 1, width: '100%' }}
    >
      {notification.title && <AlertTitle>{notification.title}</AlertTitle>}
      {notification.message}
    </Alert>
  );
};

// Indicateur de statut API
const ApiStatusIndicator = ({ apiStatus, isOnline, lastError }) => {
  const getStatusColor = () => {
    if (!isOnline) return 'error';
    switch (apiStatus) {
      case 'online': return 'success';
      case 'offline': return 'error';
      case 'error': return 'warning';
      default: return 'info';
    }
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOffIcon />;
    switch (apiStatus) {
      case 'online': return <WifiIcon />;
      case 'offline': return <WifiOffIcon />;
      case 'error': return <ErrorIcon />;
      default: return <WifiIcon />;
    }
  };

  const getStatusText = () => {
    if (!isOnline) return 'Hors ligne';
    switch (apiStatus) {
      case 'online': return 'Connecté';
      case 'offline': return 'API indisponible';
      case 'error': return 'Erreur API';
      default: return 'Vérification...';
    }
  };

  // Ne pas afficher si tout est OK
  if (isOnline && apiStatus === 'online') return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        borderRadius: 1,
        bgcolor: `${getStatusColor()}.main`,
        color: 'white',
        boxShadow: 2
      }}
    >
      {getStatusIcon()}
      <Typography variant="body2">
        {getStatusText()}
        {lastError && apiStatus !== 'online' && (
          <Typography variant="caption" display="block">
            {lastError}
          </Typography>
        )}
      </Typography>
    </Box>
  );
};

// Composant principal du système de notifications
const NotificationSystem = ({ children }) => {
  const {
    notifications,
    removeNotification,
    clearAllNotifications,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo
  } = useNotification();

  const { isOnline, apiStatus, lastError } = useApiIntegration();

  return (
    <NotificationContext.Provider
      value={{
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo,
        clearAllNotifications
      }}
    >
      {children}
      
      {/* Indicateur de statut API */}
      <ApiStatusIndicator 
        apiStatus={apiStatus} 
        isOnline={isOnline} 
        lastError={lastError} 
      />
      
      {/* Stack de notifications */}
      <Box
        sx={{
          position: 'fixed',
          top: 80,
          right: 16,
          zIndex: 1500,
          width: 400,
          maxWidth: 'calc(100vw - 32px)'
        }}
      >
        <Stack spacing={1}>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={removeNotification}
            />
          ))}
        </Stack>
      </Box>
    </NotificationContext.Provider>
  );
};

// Hook pour ErrorBoundary
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log l'erreur
    console.error('Error caught by boundary:', error, errorInfo);
    
    // En production, on pourrait envoyer l'erreur à un service de monitoring
    if (process.env.NODE_ENV === 'production') {
      // Exemple: Sentry.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            p: 3,
            textAlign: 'center'
          }}
        >
          <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Une erreur inattendue s'est produite
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            L'application a rencontré un problème. Veuillez rafraîchir la page ou contacter le support.
          </Typography>
          
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1, textAlign: 'left' }}>
              <Typography variant="body2" color="error">
                <strong>Erreur:</strong> {this.state.error && this.state.error.toString()}
              </Typography>
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                <strong>Stack:</strong>
                <pre style={{ fontSize: '10px', overflow: 'auto' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </Typography>
            </Box>
          )}
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Rafraîchir la page
            </button>
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              style={{
                padding: '8px 16px',
                backgroundColor: '#fff',
                color: '#1976d2',
                border: '1px solid #1976d2',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Réessayer
            </button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Composant de fallback pour les erreurs de réseau
export const NetworkErrorFallback = ({ error, resetError }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        p: 3,
        textAlign: 'center'
      }}
    >
      <WifiOffIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Problème de connexion
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Impossible de se connecter au serveur. Vérifiez votre connexion réseau.
      </Typography>
      <button
        onClick={resetError}
        style={{
          padding: '8px 16px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Réessayer
      </button>
    </Box>
  );
};

// Hook pour gérer les erreurs API de manière uniforme
export const useErrorHandler = () => {
  const { notifyError, notifyWarning } = useNotificationContext();

  const handleApiError = (error, context = '') => {
    let message = 'Une erreur est survenue';
    let title = 'Erreur';

    if (error.response) {
      // Erreur du serveur
      switch (error.response.status) {
        case 400:
          title = 'Données invalides';
          message = error.response.data?.message || 'Les données envoyées sont invalides';
          break;
        case 401:
          title = 'Non autorisé';
          message = 'Votre session a expiré. Veuillez vous reconnecter.';
          break;
        case 403:
          title = 'Accès interdit';
          message = 'Vous n\'avez pas les permissions nécessaires';
          break;
        case 404:
          title = 'Non trouvé';
          message = error.response.data?.message || 'Ressource non trouvée';
          break;
        case 409:
          title = 'Conflit';
          message = error.response.data?.message || 'Un conflit a été détecté';
          break;
        case 422:
          title = 'Données invalides';
          message = error.response.data?.message || 'Les données ne sont pas valides';
          break;
        case 429:
          title = 'Trop de requêtes';
          message = 'Trop de tentatives. Veuillez patienter avant de réessayer.';
          break;
        case 500:
          title = 'Erreur serveur';
          message = 'Le serveur a rencontré un problème. Veuillez réessayer.';
          break;
        case 503:
          title = 'Service indisponible';
          message = 'Le service est temporairement indisponible.';
          break;
        default:
          message = error.response.data?.message || `Erreur ${error.response.status}`;
      }
    } else if (error.request) {
      // Pas de réponse du serveur
      title = 'Problème de connexion';
      message = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    } else {
      // Autre erreur
      message = error.message || 'Une erreur inattendue s\'est produite';
    }

    if (context) {
      message = `${context}: ${message}`;
    }

    // Utiliser warning pour les erreurs 4xx (erreurs utilisateur)
    // Utiliser error pour les erreurs 5xx (erreurs serveur) et réseau
    if (error.response?.status >= 400 && error.response?.status < 500) {
      notifyWarning(message, { title });
    } else {
      notifyError(message, { title });
    }
  };

  return { handleApiError };
};

// Composant wrapper pour l'intégration complète
export const ApiIntegrationProvider = ({ children }) => {
  return (
    <ErrorBoundary>
      <NotificationSystem>
        {children}
      </NotificationSystem>
    </ErrorBoundary>
  );
};

export default NotificationSystem;