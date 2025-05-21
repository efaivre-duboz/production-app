// Données fictives des produits et recettes
export const products = [
  {
    id: "P001",
    code: "A123",
    name: "Nettoyant Multi-Surfaces",
    category: "Nettoyants",
    description: "Nettoyant écologique multi-surfaces à usage domestique et industriel léger",
    createdAt: "2024-01-15",
    updatedAt: "2025-02-20",
    status: "active",
    imageUrl: "/api/placeholder/150/150",
    recipe: {
      ingredients: [
        { id: 1, name: "Eau déminéralisée", quantity: 75.0, unit: "kg", notes: "Température ambiante (20-25°C)" },
        { id: 2, name: "Polymère A", quantity: 15.0, unit: "kg", notes: "Ajouter lentement pour éviter la formation de grumeaux" },
        { id: 3, name: "Additif B", quantity: 5.0, unit: "kg", notes: "" },
        { id: 4, name: "Colorant C", quantity: 2.5, unit: "kg", notes: "Vérifier la couleur après mélange complet" },
        { id: 5, name: "Conservateur D", quantity: 1.5, unit: "kg", notes: "" },
        { id: 6, name: "Parfum E", quantity: 1.0, unit: "kg", notes: "" }
      ],
      steps: [
        { order: 1, title: "Préparation", instructions: "Vérifier que tous les équipements sont propres et prêts à l'emploi. Peser tous les ingrédients selon les quantités spécifiées. S'assurer que la température de la cuve est entre 20°C et 25°C.", duration: 20 },
        { order: 2, title: "Mélange initial", instructions: "Verser l'eau déminéralisée dans la cuve principale. Démarrer l'agitateur à vitesse lente (100-150 RPM). Ajouter lentement le Polymère A tout en maintenant l'agitation. Continuer l'agitation pendant 15 minutes jusqu'à dissolution complète.", duration: 30 },
        { order: 3, title: "Ajout des additifs", instructions: "Ajouter l'Additif B lentement tout en maintenant l'agitation. Après 5 minutes, ajouter le Colorant C et mélanger pendant 10 minutes. Ajouter le Conservateur D et continuer l'agitation pendant 5 minutes.", duration: 25 },
        { order: 4, title: "Finition", instructions: "Réduire la vitesse d'agitation à 80-100 RPM. Ajouter le Parfum E et mélanger pendant 10 minutes supplémentaires. Vérifier visuellement l'homogénéité du mélange. Arrêter l'agitation et procéder au contrôle qualité.", duration: 15 }
      ],
      qualityChecks: [
        { name: "Apparence", type: "visuel", expectedValue: "Liquide clair, légèrement bleuté" },
        { name: "Viscosité", type: "physique", expectedValue: "3000-4000 cP" },
        { name: "pH", type: "chimique", expectedValue: "7.0-7.5" },
        { name: "Odeur", type: "olfactif", expectedValue: "Fraîcheur, légère note d'agrumes" }
      ]
    }
  },
  {
    id: "P002",
    code: "B456",
    name: "Dégraissant Industriel",
    category: "Dégraissants",
    description: "Dégraissant puissant pour surfaces industrielles et équipements lourds",
    createdAt: "2024-02-20",
    updatedAt: "2025-03-15",
    status: "active",
    imageUrl: "/api/placeholder/150/150",
    recipe: {
      ingredients: [
        { id: 1, name: "Base solvant", quantity: 80.0, unit: "kg", notes: "" },
        { id: 2, name: "Résine X", quantity: 12.0, unit: "kg", notes: "Chauffer à 40°C avant utilisation" },
        { id: 3, name: "Durcisseur Y", quantity: 5.0, unit: "kg", notes: "" },
        { id: 4, name: "Additif Z", quantity: 3.0, unit: "kg", notes: "Protéger de la lumière" }
      ],
      steps: [
        { order: 1, title: "Préparation", instructions: "Préchauffer la cuve à 40°C. Vérifier l'étanchéité du système d'agitation. Peser tous les ingrédients selon les quantités spécifiées.", duration: 25 },
        { order: 2, title: "Mélange principal", instructions: "Verser la Base solvant dans la cuve. Activer l'agitateur à 200 RPM. Ajouter la Résine X préchauffée et mélanger pendant 20 minutes.", duration: 45 },
        { order: 3, title: "Ajout des composants secondaires", instructions: "Réduire l'agitation à 150 RPM. Ajouter lentement le Durcisseur Y pendant 10 minutes. Maintenir l'agitation pendant 15 minutes supplémentaires.", duration: 30 },
        { order: 4, title: "Finition", instructions: "Ajouter l'Additif Z et mélanger pendant 20 minutes. Réduire la température à 30°C tout en maintenant l'agitation. Procéder au contrôle qualité.", duration: 30 }
      ],
      qualityChecks: [
        { name: "Apparence", type: "visuel", expectedValue: "Liquide visqueux ambré" },
        { name: "Viscosité", type: "physique", expectedValue: "5000-6000 cP" },
        { name: "pH", type: "chimique", expectedValue: "9.0-9.5" },
        { name: "Test de dégraissage", type: "fonctionnel", expectedValue: "Dégraissage complet en moins de 2 minutes" }
      ]
    }
  },
  {
    id: "P003",
    code: "C789",
    name: "Détergent Eco-Responsable",
    category: "Détergents",
    description: "Détergent biodégradable à faible impact environnemental",
    createdAt: "2024-03-10",
    updatedAt: "2025-04-05",
    status: "active",
    imageUrl: "/api/placeholder/150/150",
    recipe: {
      ingredients: [
        { id: 1, name: "Eau déminéralisée", quantity: 65.0, unit: "kg", notes: "" },
        { id: 2, name: "Composé A", quantity: 20.0, unit: "kg", notes: "" },
        { id: 3, name: "Composé B", quantity: 10.0, unit: "kg", notes: "Sensible à l'humidité" },
        { id: 4, name: "Additif C", quantity: 5.0, unit: "kg", notes: "" }
      ],
      steps: [
        { order: 1, title: "Préparation", instructions: "Vérifier que la cuve est propre et sèche. Peser tous les ingrédients. Préparer le système d'agitation à double hélice.", duration: 20 },
        { order: 2, title: "Mélange principal", instructions: "Verser l'eau déminéralisée. Chauffer à 35°C. Ajouter le Composé A lentement et mélanger pendant 30 minutes à 180 RPM.", duration: 40 },
        { order: 3, title: "Incorporation du Composé B", instructions: "Dans un environnement à faible humidité, ajouter progressivement le Composé B sur 15 minutes. Augmenter l'agitation à 220 RPM pendant 25 minutes.", duration: 45 },
        { order: 4, title: "Finition", instructions: "Réduire la température à 25°C. Ajouter l'Additif C et mélanger pendant 15 minutes. Laisser reposer pendant 30 minutes avant le contrôle qualité.", duration: 50 }
      ],
      qualityChecks: [
        { name: "Apparence", type: "visuel", expectedValue: "Liquide translucide vert pâle" },
        { name: "Viscosité", type: "physique", expectedValue: "2500-3000 cP" },
        { name: "pH", type: "chimique", expectedValue: "7.8-8.2" },
        { name: "Biodégradabilité", type: "environnemental", expectedValue: ">90% en 28 jours" }
      ]
    }
  },
  {
    id: "P004",
    code: "D012",
    name: "Désinfectant Professionnel",
    category: "Désinfectants",
    description: "Désinfectant haute performance pour milieux professionnels et médicaux",
    createdAt: "2024-04-25",
    updatedAt: "2025-05-10",
    status: "inactive",
    imageUrl: "/api/placeholder/150/150",
    recipe: {
      ingredients: [
        { id: 1, name: "Base alcoolique", quantity: 70.0, unit: "kg", notes: "Manipuler avec précaution - inflammable" },
        { id: 2, name: "Agent antimicrobien E", quantity: 15.0, unit: "kg", notes: "" },
        { id: 3, name: "Stabilisateur F", quantity: 10.0, unit: "kg", notes: "" },
        { id: 4, name: "Additif hydratant G", quantity: 5.0, unit: "kg", notes: "" }
      ],
      steps: [
        { order: 1, title: "Préparation sécurisée", instructions: "Vérifier la ventilation de la zone. S'assurer que tous les équipements sont anti-étincelles. Porter les EPI appropriés. Peser tous les ingrédients.", duration: 30 },
        { order: 2, title: "Mélange de la base", instructions: "Dans une cuve à sécurité renforcée, ajouter la Base alcoolique. Maintenir la température sous 20°C. Démarrer l'agitation à basse vitesse (80 RPM).", duration: 20 },
        { order: 3, title: "Ajout des composants actifs", instructions: "Ajouter lentement l'Agent antimicrobien E sur 20 minutes. Augmenter progressivement l'agitation à 120 RPM. Ajouter le Stabilisateur F et mélanger pendant 30 minutes.", duration: 60 },
        { order: 4, title: "Finition et contrôle", instructions: "Réduire l'agitation à 100 RPM. Ajouter l'Additif hydratant G et mélanger pendant 15 minutes. Laisser reposer 1 heure avant les tests de qualité et d'efficacité.", duration: 90 }
      ],
      qualityChecks: [
        { name: "Apparence", type: "visuel", expectedValue: "Liquide clair et incolore" },
        { name: "Teneur en alcool", type: "chimique", expectedValue: "65-70%" },
        { name: "pH", type: "chimique", expectedValue: "6.5-7.5" },
        { name: "Efficacité antimicrobienne", type: "microbiologique", expectedValue: "99.9% d'élimination des pathogènes tests" }
      ]
    }
  }
];
