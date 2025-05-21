import React, { useState } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Divider,
  Avatar,
  Button,
  Tooltip,
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const { currentUser, logout, hasRole } = useAuth();
  const isAdmin = hasRole('admin');

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigateTo = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="secondary">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo pour les grands écrans */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ProdMaster
            </Typography>

            {/* Menu burger pour les petits écrans */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem onClick={() => navigateTo('/')}>
                  <Typography textAlign="center">Scan de production</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/recipe')}>
                  <Typography textAlign="center">Recette et instructions</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/quality')}>
                  <Typography textAlign="center">Contrôle qualité</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/end')}>
                  <Typography textAlign="center">Fin de production</Typography>
                </MenuItem>
                {isAdmin && (
                  <>
                    <Divider />
                    <Typography variant="caption" sx={{ pl: 2, py: 1, display: 'block', color: 'text.secondary' }}>
                      Administration
                    </Typography>
                    <MenuItem onClick={() => navigateTo('/dashboard')}>
                      <DashboardIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography textAlign="center">Tableau de bord</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => navigateTo('/history')}>
                      <HistoryIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography textAlign="center">Historique de production</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => navigateTo('/product-management')}>
                      <InventoryIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography textAlign="center">Gestion des produits</Typography>
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>

            {/* Logo pour les petits écrans */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ProdMaster
            </Typography>

            {/* Menu pour les grands écrans */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={() => navigateTo('/')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Scan de production
              </Button>
              <Button
                onClick={() => navigateTo('/recipe')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Recette et instructions
              </Button>
              <Button
                onClick={() => navigateTo('/quality')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Contrôle qualité
              </Button>
              <Button
                onClick={() => navigateTo('/end')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Fin de production
              </Button>
              
              {isAdmin && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 1, bgcolor: 'rgba(255, 255, 255, 0.3)' }} />
                  
                  <Tooltip title="Réservé aux administrateurs">
                    <Button
                      onClick={() => navigateTo('/dashboard')}
                      startIcon={<DashboardIcon />}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      Tableau de bord
                    </Button>
                  </Tooltip>
                  
                  <Tooltip title="Réservé aux administrateurs">
                    <Button
                      onClick={() => navigateTo('/history')}
                      startIcon={<HistoryIcon />}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      Historique
                    </Button>
                  </Tooltip>
                  
                  <Tooltip title="Réservé aux administrateurs">
                    <Button
                      onClick={() => navigateTo('/product-management')}
                      startIcon={<InventoryIcon />}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      Gestion des produits
                    </Button>
                  </Tooltip>
                </>
              )}
            </Box>

            {/* Menu utilisateur */}
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              {isAdmin && (
                <Chip 
                  icon={<AdminPanelSettingsIcon />} 
                  label="Admin" 
                  color="error" 
                  size="small" 
                  sx={{ mr: 2 }} 
                />
              )}
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem>
                  <Typography variant="body2" color="textSecondary">
                    Connecté en tant que
                  </Typography>
                </MenuItem>
                <MenuItem>
                  <Typography fontWeight="bold">
                    {currentUser?.name || 'Utilisateur'}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography>Déconnexion</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Contenu principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>

      {/* Pied de page */}
      <Box component="footer" sx={{ py: 2, backgroundColor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Envirolin Canada. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;