// Données fictives pour le tableau de bord
export const productionData = [
  { month: 'Janvier', productions: 45, tempsTotal: 352, tempsPause: 41 },
  { month: 'Février', productions: 52, tempsTotal: 389, tempsPause: 37 },
  { month: 'Mars', productions: 48, tempsTotal: 366, tempsPause: 32 },
  { month: 'Avril', productions: 61, tempsTotal: 452, tempsPause: 53 },
  { month: 'Mai', productions: 64, tempsTotal: 476, tempsPause: 48 }
];

export const qualityIssuesData = [
  { name: 'Apparence', value: 12 },
  { name: 'Viscosité', value: 18 },
  { name: 'pH', value: 5 },
  { name: 'Odeur', value: 8 }
];

export const pauseReasonsData = [
  { name: 'Équipement', value: 45 },
  { name: 'Matériaux', value: 27 },
  { name: 'Personnel', value: 32 },
  { name: 'Autre', value: 16 }
];

export const productPerformanceData = [
  { code: 'A123', nom: 'Produit A', productionCount: 63, avgProductionTime: 5.2, qualityIssues: 8 },
  { code: 'B456', nom: 'Produit B', productionCount: 41, avgProductionTime: 7.3, qualityIssues: 5 },
  { code: 'C789', nom: 'Produit C', productionCount: 37, avgProductionTime: 8.1, qualityIssues: 12 },
  { code: 'D012', nom: 'Produit D', productionCount: 22, avgProductionTime: 6.4, qualityIssues: 3 }
];

export const recentProductions = [
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

export const operatorPerformanceData = [
  { name: 'Jean Dupont', productions: 18, avgTime: 6.2, pausePercentage: 8.2 },
  { name: 'Marie Lambert', productions: 15, avgTime: 7.1, pausePercentage: 7.8 },
  { name: 'Pierre Martin', productions: 21, avgTime: 5.8, pausePercentage: 9.3 },
  { name: 'Sophie Bernard', productions: 16, avgTime: 6.7, pausePercentage: 8.5 }
];