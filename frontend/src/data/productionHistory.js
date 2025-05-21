// Données fictives d'historique de production
export const productionHistory = [
  {
    id: "P001",
    productCode: "A123",
    batchNumber: "L789",
    startDate: "2025-05-12T08:15:00",
    endDate: "2025-05-12T14:30:00",
    status: "completed",
    operator: "Jean Dupont",
    totalDuration: 22500, // en secondes (6h15m)
    pauseDuration: 1800, // en secondes (30m)
    netDuration: 20700, // en secondes (5h45m)
    ingredients: [
      { name: "Eau déminéralisée", required: 75.0, actual: 74.8, unit: "kg" },
      { name: "Polymère A", required: 15.0, actual: 15.2, unit: "kg" },
      { name: "Additif B", required: 5.0, actual: 5.0, unit: "kg" },
      { name: "Colorant C", required: 2.5, actual: 2.4, unit: "kg" },
      { name: "Conservateur D", required: 1.5, actual: 1.5, unit: "kg" },
      { name: "Parfum E", required: 1.0, actual: 1.0, unit: "kg" }
    ],
    qualityChecks: {
      appearanceCheck: "conforme",
      viscosityCheck: "conforme",
      pHValue: "7.2",
      odorCheck: "conforme"
    },
    pauseHistory: [
      {
        startTime: "2025-05-12T10:45:00",
        endTime: "2025-05-12T11:15:00",
        duration: 1800,
        reason: "Changement d'équipe",
        category: "personnel"
      }
    ],
    notes: "Production normale sans incident"
  },
  {
    id: "P002",
    productCode: "B456",
    batchNumber: "L790",
    startDate: "2025-05-13T09:00:00",
    endDate: "2025-05-13T16:45:00",
    status: "completed",
    operator: "Marie Lambert",
    totalDuration: 27900, // en secondes (7h45m)
    pauseDuration: 3600, // en secondes (1h)
    netDuration: 24300, // en secondes (6h45m)
    ingredients: [
      { name: "Base solvant", required: 80.0, actual: 80.0, unit: "kg" },
      { name: "Résine X", required: 12.0, actual: 12.5, unit: "kg" },
      { name: "Durcisseur Y", required: 5.0, actual: 5.0, unit: "kg" },
      { name: "Additif Z", required: 3.0, actual: 2.8, unit: "kg" }
    ],
    qualityChecks: {
      appearanceCheck: "conforme",
      viscosityCheck: "non-conforme",
      pHValue: "6.8",
      odorCheck: "conforme"
    },
    pauseHistory: [
      {
        startTime: "2025-05-13T12:00:00",
        endTime: "2025-05-13T13:00:00",
        duration: 3600,
        reason: "Pause déjeuner",
        category: "personnel"
      }
    ],
    notes: "Viscosité légèrement hors spécification, mais approuvée après revérification"
  },
  {
    id: "P003",
    productCode: "C789",
    batchNumber: "L791",
    startDate: "2025-05-14T07:30:00",
    endDate: "2025-05-14T16:00:00",
    status: "completed",
    operator: "Pierre Martin",
    totalDuration: 30600, // en secondes (8h30m)
    pauseDuration: 5400, // en secondes (1h30m)
    netDuration: 25200, // en secondes (7h)
    ingredients: [
      { name: "Eau déminéralisée", required: 65.0, actual: 65.2, unit: "kg" },
      { name: "Composé A", required: 20.0, actual: 20.0, unit: "kg" },
      { name: "Composé B", required: 10.0, actual: 9.8, unit: "kg" },
      { name: "Additif C", required: 5.0, actual: 5.0, unit: "kg" }
    ],
    qualityChecks: {
      appearanceCheck: "conforme",
      viscosityCheck: "conforme",
      pHValue: "7.8",
      odorCheck: "conforme"
    },
    pauseHistory: [
      {
        startTime: "2025-05-14T10:30:00",
        endTime: "2025-05-14T11:15:00",
        duration: 2700,
        reason: "Maintenance de l'agitateur",
        category: "equipment"
      },
      {
        startTime: "2025-05-14T12:30:00",
        endTime: "2025-05-14T13:15:00",
        duration: 2700,
        reason: "Pause déjeuner",
        category: "personnel"
      }
    ],
    notes: "Production complète avec maintenance préventive de l'équipement"
  },
  {
    id: "P004",
    productCode: "A123",
    batchNumber: "L792",
    startDate: "2025-05-15T08:00:00",
    endDate: null, // Production en cours
    status: "in_progress",
    operator: "Sophie Bernard",
    totalDuration: 18000, // jusqu'à présent
    pauseDuration: 900, // 15 minutes de pause
    netDuration: 17100,
    ingredients: [
      { name: "Eau déminéralisée", required: 75.0, actual: 75.0, unit: "kg" },
      { name: "Polymère A", required: 15.0, actual: 15.0, unit: "kg" },
      { name: "Additif B", required: 5.0, actual: 5.0, unit: "kg" },
      { name: "Colorant C", required: 2.5, actual: null, unit: "kg" }, // Pas encore ajouté
      { name: "Conservateur D", required: 1.5, actual: null, unit: "kg" }, // Pas encore ajouté
      { name: "Parfum E", required: 1.0, actual: null, unit: "kg" } // Pas encore ajouté
    ],
    qualityChecks: null, // Pas encore effectué
    pauseHistory: [
      {
        startTime: "2025-05-15T09:45:00",
        endTime: "2025-05-15T10:00:00",
        duration: 900,
        reason: "Approvisionnement en matériaux",
        category: "material"
      }
    ],
    notes: "Production en cours"
  }
];
