import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Paper,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../context/AuthContext';

// Style pour le conteneur du logo
const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

// Style pour l'icône
const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(2),
}));

const LoginPage = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Modifié pour inclure bypassAuth et bypassAuthAsAdmin
  const { login, bypassAuth, bypassAuthAsAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setErrorMessage('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setErrorMessage('Identifiants incorrects');
      }
    } catch (error) {
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour contourner l'authentification en mode développement
  const handleDevBypass = () => {
    bypassAuth();
    navigate('/');
  };
  
  // Fonction pour contourner l'authentification en tant qu'admin
  const handleDevBypassAdmin = () => {
    bypassAuthAsAdmin();
    navigate('/dashboard'); // Modifié pour rediriger vers le tableau de bord
  };

  return (
    <LoginPage>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: 'secondary.main', 
            color: 'white', 
            py: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              ProdMaster
            </Typography>
            <Typography variant="subtitle1">
              Envirolin Canada
            </Typography>
          </Box>
          
          <CardContent sx={{ px: 4, py: 4 }}>
            <LogoContainer>
              <IconWrapper>
                <LockOutlinedIcon fontSize="large" />
              </IconWrapper>
              <Typography component="h2" variant="h5" fontWeight="medium">
                Connexion
              </Typography>
            </LogoContainer>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nom d'utilisateur"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
              
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Mode développement
                </Typography>
              </Divider>

              {/* Boutons de développement */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={handleDevBypass}
                  sx={{ mb: 1 }}
                >
                  Mode Opérateur
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<AdminPanelSettingsIcon />}
                  onClick={handleDevBypassAdmin}
                  sx={{ mb: 1 }}
                >
                  Mode Admin
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Paper>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Envirolin Canada. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </LoginPage>
  );
};

export default Login;