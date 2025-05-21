import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Sector,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Définir des données fictives simples
const productionData = [
  { month: 'Janvier', productions: 45, tempsTotal: 352, tempsPause: 41 },
  { month: 'Février', productions: 52, tempsTotal: 389, tempsPause: 37 },
  { month: 'Mars', productions: 48, tempsTotal: 366, tempsPause: 32 },
  { month: 'Avril', productions: 61, tempsTotal: 452, tempsPause: 53 },
  { month: 'Mai', productions: 64, tempsTotal: 476, tempsPause: 48 }
];

const qualityIssuesData = [
  { name: 'Apparence', value: 42 },
  { name: 'Viscosité', value: 34 },
  { name: 'pH', value: 12 },
  { name: 'Odeur', value: 12 }
];

const pauseReasonsData = [
  { name: 'Équipement', value: 45 },
  { name: 'Matériaux', value: 27 },
  { name: 'Personnel', value: 32 },
  { name: 'Autre', value: 16 }
];

const productPerformanceData = [
  { code: 'A123', productionCount: 63, avgProductionTime: 5.2, qualityIssues: 8 },
  { code: 'B456', productionCount: 41, avgProductionTime: 7.3, qualityIssues: 5 },
  { code: 'C789', productionCount: 37, avgProductionTime: 8.1, qualityIssues: 12 },
  { code: 'D012', productionCount: 22, avgProductionTime: 6.4, qualityIssues: 3 }
];

const operatorPerformanceData = [
  { name: 'Jean Dupont', productions: 18, avgTime: 6.2, pausePercentage: 8.2 },
  { name: 'Marie Lambert', productions: 15, avgTime: 7.1, pausePercentage: 7.8 },
  { name: 'Pierre Martin', productions: 21, avgTime: 5.8, pausePercentage: 9.3 },
  { name: 'Sophie Bernard', productions: 16, avgTime: 6.7, pausePercentage: 8.5 }
];

const recentProductions = [
  {
    id: "P001",
    productCode: "A123",
    batchNumber: "L789",
    date: "2025-05-12",
    operator: "Jean Dupont",
    duration: "6h 15m",
    status: "completed"
  },
  {
    id: "P002",
    productCode: "B456",
    batchNumber: "L790",
    date: "2025-05-13",
    operator: "Marie Lambert",
    duration: "7h 45m",
    status: "completed"
  },
  {
    id: "P003",
    productCode: "C789",
    batchNumber: "L791",
    date: "2025-05-14",
    operator: "Pierre Martin",
    duration: "8h 30m",
    status: "completed"
  },
  {
    id: "P004",
    productCode: "A123",
    batchNumber: "L792",
    date: "2025-05-15",
    operator: "Sophie Bernard",
    duration: "5h 00m",
    status: "in_progress"
  }
];

// Composant pour les cartes de statistiques
const StatCard = ({ title, value, subtitle, trend, trendValue, color }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="medium">
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {trend === 'up' ? (
                <ArrowUpwardIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
              ) : (
                <ArrowDownwardIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
              )}
              <Typography
                variant="body2"
                color={trend === 'up' ? 'success.main' : 'error.main'}
              >
                {trendValue}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '50%',
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AssessmentIcon />
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Composant personnalisé pour le rendu des étiquettes du PieChart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="#fff" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={10}
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Composant personnalisé de légende pour le PieChart
const CustomLegend = (props) => {
  const { payload } = props;
  
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      {payload.map((entry, index) => (
        <li key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
          <span style={{ display: 'inline-block', width: 10, height: 10, background: entry.color, marginRight: 5 }}></span>
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const [timeRangeMenu, setTimeRangeMenu] = useState(null);
  const [timeRange, setTimeRange] = useState('Mois en cours');
  const [tabValue, setTabValue] = useState(0);
  
  const handleTimeRangeClick = (event) => {
    setTimeRangeMenu(event.currentTarget);
  };
  
  const handleTimeRangeClose = (range) => {
    if (range) {
      setTimeRange(range);
    }
    setTimeRangeMenu(null);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Couleurs pour les graphiques
  const COLORS = ['#C41E3A', '#333333', '#FF7700', '#22AA33', '#4488FF'];
  
  // Date actuelle formatée
  const currentDate = format(new Date(), 'EEEE dd MMMM yyyy', { locale: fr });
  
  // Fonction pour obtenir le statut
  const getStatusInfo = (status) => {
    switch(status) {
      case 'completed': return { color: 'success', label: 'Terminé' };
      case 'in_progress': return { color: 'warning', label: 'En cours' };
      case 'failed': return { color: 'error', label: 'Échoué' };
      default: return { color: 'default', label: status };
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Tableau de Bord
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              <CalendarTodayIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              {currentDate}
            </Typography>
          </Box>
          
          <Box>
            <Button
              variant="outlined"
              startIcon={<AssessmentIcon />}
              onClick={handleTimeRangeClick}
              sx={{ mr: 2 }}
            >
              {timeRange}
            </Button>
            <Menu
              anchorEl={timeRangeMenu}
              open={Boolean(timeRangeMenu)}
              onClose={() => handleTimeRangeClose()}
            >
              <MenuItem onClick={() => handleTimeRangeClose('Aujourd\'hui')}>Aujourd'hui</MenuItem>
              <MenuItem onClick={() => handleTimeRangeClose('Cette semaine')}>Cette semaine</MenuItem>
              <MenuItem onClick={() => handleTimeRangeClose('Mois en cours')}>Mois en cours</MenuItem>
              <MenuItem onClick={() => handleTimeRangeClose('Trimestre')}>Trimestre</MenuItem>
              <MenuItem onClick={() => handleTimeRangeClose('Année')}>Année</MenuItem>
            </Menu>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
            >
              Actualiser
            </Button>
          </Box>
        </Box>
        
        {/* Cartes de statistiques */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Productions totales"
              value="270"
              subtitle="Depuis janvier 2025"
              trend="up"
              trendValue="+12.5% depuis le dernier mois"
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Temps moyen de production"
              value="6.7h"
              subtitle="Moyenne sur tous les produits"
              trend="down"
              trendValue="-4.2% depuis le dernier mois"
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pauses de production"
              value="8.3%"
              subtitle="Pourcentage du temps total"
              trend="up"
              trendValue="+1.8% depuis le dernier mois"
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Problèmes qualité"
              value="43"
              subtitle="Nombre total de cas"
              trend="down"
              trendValue="-6.7% depuis le dernier mois"
              color="error"
            />
          </Grid>
        </Grid>
        
        {/* Graphiques */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={7}>
            <Card>
              <CardHeader 
                title="Évolution des productions" 
                subheader="Nombre de productions par mois"
                action={
                  <IconButton aria-label="options">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 450, py: 3 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={productionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      height={60}
                      tick={{ dy: 10 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend 
                      verticalAlign="bottom"
                      height={50}
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
                    <Line 
                      name="productions" 
                      type="monotone" 
                      dataKey="productions" 
                      stroke="#C41E3A" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      name="tempsTotal" 
                      type="monotone" 
                      dataKey="tempsTotal" 
                      stroke="#000000" 
                    />
                    <Line 
                      name="tempsPause" 
                      type="monotone" 
                      dataKey="tempsPause" 
                      stroke="#FF7700" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={5}>
            <Card sx={{ height: '100%' }}>
              <CardHeader 
                title="Répartition des problèmes" 
                subheader="Par catégorie"
                action={
                  <IconButton aria-label="options">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 450 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{ mb: 2 }}
                >
                  <Tab label="Problèmes qualité" />
                  <Tab label="Raisons de pause" />
                </Tabs>
                
                <Box sx={{ display: tabValue === 0 ? 'block' : 'none', height: 'calc(100% - 48px)' }}>
                  <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                      <Pie
                        data={qualityIssuesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {qualityIssuesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ mt: 1 }}>
                    <CustomLegend 
                      payload={qualityIssuesData.map((item, index) => ({
                        value: item.name,
                        color: COLORS[index % COLORS.length]
                      }))}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ display: tabValue === 1 ? 'block' : 'none', height: 'calc(100% - 48px)' }}>
                  <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                      <Pie
                        data={pauseReasonsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pauseReasonsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ mt: 1 }}>
                    <CustomLegend 
                      payload={pauseReasonsData.map((item, index) => ({
                        value: item.name,
                        color: COLORS[index % COLORS.length]
                      }))}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Graphiques de performance */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardHeader 
                title="Performance par produit" 
                subheader="Temps moyen de production et problèmes"
                action={
                  <IconButton aria-label="options">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 450 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="code" 
                      tick={{ fontSize: 12 }}
                      height={60}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}`, '']} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={50} 
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
                    <Bar 
                      name="Nombre de productions" 
                      dataKey="productionCount" 
                      fill="#C41E3A" 
                    />
                    <Bar 
                      name="Temps moyen (h)" 
                      dataKey="avgProductionTime" 
                      fill="#333333" 
                    />
                    <Bar 
                      name="Problèmes qualité" 
                      dataKey="qualityIssues" 
                      fill="#FF7700" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <Card>
              <CardHeader 
                title="Performance des opérateurs" 
                subheader="Productions et temps moyen"
                action={
                  <IconButton aria-label="options">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ height: 450 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={operatorPerformanceData}
                    margin={{ top: 20, right: 30, left: 80, bottom: 50 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip formatter={(value) => [`${value}`, '']} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={50} 
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
                    <Bar 
                      name="Productions" 
                      dataKey="productions" 
                      fill="#C41E3A" 
                    />
                    <Bar 
                      name="Temps moyen (h)" 
                      dataKey="avgTime" 
                      fill="#333333" 
                    />
                    <Bar 
                      name="% de pauses" 
                      dataKey="pausePercentage" 
                      fill="#FF7700" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Productions récentes */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Productions récentes
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Produit</TableCell>
                  <TableCell>Lot</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Opérateur</TableCell>
                  <TableCell>Durée</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentProductions.map((production) => {
                  const status = getStatusInfo(production.status);
                  return (
                    <TableRow key={production.id} hover>
                      <TableCell>{production.id}</TableCell>
                      <TableCell>{production.productCode}</TableCell>
                      <TableCell>{production.batchNumber}</TableCell>
                      <TableCell>{production.date}</TableCell>
                      <TableCell>{production.operator}</TableCell>
                      <TableCell>{production.duration}</TableCell>
                      <TableCell>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button variant="text" size="small">
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="text" color="primary">
              Voir toutes les productions
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;