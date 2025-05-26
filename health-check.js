// health-check.js - Script de vérification de santé de l'application
const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    backend: {
        url: 'http://localhost:5000',
        timeout: 5000
    },
    frontend: {
        url: 'http://localhost:3000',
        timeout: 5000
    },
    database: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/prodmaster',
        timeout: 5000
    }
};

// Couleurs pour les logs
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
};

// Fonctions utilitaires
const log = {
    info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}[✓]${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}[⚠]${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}[✗]${colors.reset} ${msg}`),
    separator: () => console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`)
};

// Tests de santé
class HealthChecker {
    constructor() {
        this.results = {
            environment: { status: 'unknown', details: [] },
            files: { status: 'unknown', details: [] },
            database: { status: 'unknown', details: [] },
            backend: { status: 'unknown', details: [] },
            frontend: { status: 'unknown', details: [] },
            integration: { status: 'unknown', details: [] }
        };
    }

    // Vérification de l'environnement
    async checkEnvironment() {
        log.info('🔍 Vérification de l\'environnement...');
        
        const checks = [
            { name: 'Node.js', command: 'node --version' },
            { name: 'npm', command: 'npm --version' },
            { name: 'MongoDB', command: 'mongod --version', optional: true }
        ];

        for (const check of checks) {
            try {
                const { execSync } = require('child_process');
                const version = execSync(check.command, { encoding: 'utf8' }).trim();
                this.results.environment.details.push(`${check.name}: ${version.split('\n')[0]}`);
                log.success(`${check.name} disponible`);
            } catch (error) {
                if (check.optional) {
                    log.warning(`${check.name} non disponible (optionnel)`);
                    this.results.environment.details.push(`${check.name}: Non disponible (optionnel)`);
                } else {
                    log.error(`${check.name} manquant`);
                    this.results.environment.details.push(`${check.name}: MANQUANT`);
                    this.results.environment.status = 'error';
                    return;
                }
            }
        }

        // Vérifier les variables d'environnement
        const envVars = ['NODE_ENV', 'MONGO_URI', 'JWT_SECRET'];
        const missingVars = [];

        for (const varName of envVars) {
            if (!process.env[varName]) {
                missingVars.push(varName);
            }
        }

        if (missingVars.length > 0) {
            log.warning(`Variables d'environnement manquantes: ${missingVars.join(', ')}`);
            this.results.environment.details.push(`Variables manquantes: ${missingVars.join(', ')}`);
        }

        this.results.environment.status = this.results.environment.status === 'error' ? 'error' : 'success';
    }

    // Vérification des fichiers critiques
    async checkFiles() {
        log.info('📁 Vérification des fichiers critiques...');

        const criticalFiles = [
            // Backend
            { path: 'backend/package.json', required: true },
            { path: 'backend/.env', required: false },
            { path: 'backend/src/index.js', required: true },
            { path: 'backend/models/User.js', required: true },
            { path: 'backend/models/Product.js', required: true },
            { path: 'backend/models/Production.js', required: true },
            // Frontend
            { path: 'frontend/package.json', required: true },
            { path: 'frontend/src/main.jsx', required: true },
            { path: 'frontend/src/App.jsx', required: true },
            { path: 'frontend/src/services/api.js', required: true }
        ];

        let allFilesOk = true;

        for (const file of criticalFiles) {
            const exists = fs.existsSync(file.path);
            if (exists) {
                log.success(`${file.path} présent`);
                this.results.files.details.push(`${file.path}: ✓`);
            } else {
                if (file.required) {
                    log.error(`${file.path} manquant (requis)`);
                    this.results.files.details.push(`${file.path}: MANQUANT (requis)`);
                    allFilesOk = false;
                } else {
                    log.warning(`${file.path} manquant (optionnel)`);
                    this.results.files.details.push(`${file.path}: manquant (optionnel)`);
                }
            }
        }

        // Vérifier les node_modules
        const nodeModules = [
            'backend/node_modules',
            'frontend/node_modules'
        ];

        for (const dir of nodeModules) {
            if (fs.existsSync(dir)) {
                log.success(`${dir} installé`);
                this.results.files.details.push(`${dir}: ✓`);
            } else {
                log.error(`${dir} manquant - Lancez npm install`);
                this.results.files.details.push(`${dir}: MANQUANT`);
                allFilesOk = false;
            }
        }

        this.results.files.status = allFilesOk ? 'success' : 'error';
    }

    // Vérification de la base de données
    async checkDatabase() {
        log.info('🗃️ Vérification de la base de données...');

        try {
            await mongoose.connect(config.database.uri, {
                serverSelectionTimeoutMS: config.database.timeout,
                connectTimeoutMS: config.database.timeout
            });

            log.success('Connexion MongoDB établie');

            // Vérifier les collections
            const collections = await mongoose.connection.db.listCollections().toArray();
            const collectionNames = collections.map(c => c.name);

            log.info(`Collections trouvées: ${collectionNames.join(', ')}`);
            this.results.database.details.push(`Collections: ${collectionNames.join(', ')}`);

            // Vérifier les données de base
            const User = require('./backend/models/User');
            const Product = require('./backend/models/Product');

            const userCount = await User.countDocuments();
            const productCount = await Product.countDocuments();

            log.info(`Utilisateurs: ${userCount}, Produits: ${productCount}`);
            this.results.database.details.push(`Utilisateurs: ${userCount}, Produits: ${productCount}`);

            if (productCount === 0) {
                log.warning('Aucun produit en base - Lancez node backend/init-data.js');
                this.results.database.details.push('⚠ Aucun produit en base');
            }

            this.results.database.status = 'success';

        } catch (error) {
            log.error(`Erreur base de données: ${error.message}`);
            this.results.database.details.push(`Erreur: ${error.message}`);
            this.results.database.status = 'error';
        } finally {
            if (mongoose.connection.readyState === 1) {
                await mongoose.disconnect();
            }
        }
    }

    // Vérification du backend
    async checkBackend() {
        log.info('🔧 Vérification du backend...');

        try {
            // Test de base
            const response = await axios.get(config.backend.url + '/api/', {
                timeout: config.backend.timeout
            });

            if (response.status === 200) {
                log.success('Backend API accessible');
                this.results.backend.details.push('API de base: ✓');
            }

            // Test des endpoints critiques
            const endpoints = [
                '/api/auth/login',
                '/api/products',
                '/api/productions'
            ];

            for (const endpoint of endpoints) {
                try {
                    const endpointResponse = await axios.get(config.backend.url + endpoint, {
                        timeout: 2000
                    });
                    
                    // Même si on a une erreur 401/403, c'est que l'endpoint répond
                    log.success(`Endpoint ${endpoint} accessible`);
                    this.results.backend.details.push(`${endpoint}: ✓`);
                } catch (error) {
                    if (error.response && [401, 403].includes(error.response.status)) {
                        log.success(`Endpoint ${endpoint} accessible (authentification requise)`);
                        this.results.backend.details.push(`${endpoint}: ✓ (auth requis)`);
                    } else {
                        log.error(`Endpoint ${endpoint} inaccessible`);
                        this.results.backend.details.push(`${endpoint}: ✗`);
                    }
                }
            }

            this.results.backend.status = 'success';

        } catch (error) {
            log.error(`Backend inaccessible: ${error.message}`);
            this.results.backend.details.push(`Erreur: ${error.message}`);
            this.results.backend.status = 'error';
        }
    }

    // Vérification du frontend
    async checkFrontend() {
        log.info('🎨 Vérification du frontend...');

        try {
            const response = await axios.get(config.frontend.url, {
                timeout: config.frontend.timeout
            });

            if (response.status === 200 && response.data.includes('<!DOCTYPE html>')) {
                log.success('Frontend accessible');
                this.results.frontend.details.push('Page principale: ✓');

                // Vérifier si c'est une app React
                if (response.data.includes('react') || response.data.includes('root')) {
                    log.success('Application React détectée');
                    this.results.frontend.details.push('Application React: ✓');
                }

                // Vérifier les assets critiques
                const assets = [
                    '/assets/',
                    '/src/',
                    '/static/'
                ];

                for (const asset of assets) {
                    try {
                        await axios.get(config.frontend.url + asset, { timeout: 1000 });
                        log.success(`Assets ${asset} accessibles`);
                        this.results.frontend.details.push(`${asset}: ✓`);
                        break; // Un seul suffit
                    } catch (error) {
                        // Normal si l'asset n'existe pas
                    }
                }

                this.results.frontend.status = 'success';
            } else {
                log.error('Frontend ne retourne pas de HTML valide');
                this.results.frontend.status = 'error';
            }

        } catch (error) {
            log.error(`Frontend inaccessible: ${error.message}`);
            this.results.frontend.details.push(`Erreur: ${error.message}`);
            this.results.frontend.status = 'error';
        }
    }

    // Test d'intégration
    async checkIntegration() {
        log.info('🔗 Test d\'intégration...');

        if (this.results.backend.status !== 'success' || this.results.database.status !== 'success') {
            log.warning('Backend ou base de données non disponible - Tests d\'intégration ignorés');
            this.results.integration.status = 'warning';
            this.results.integration.details.push('Prérequis non satisfaits');
            return;
        }

        try {
            // Test de création d'utilisateur
            const testUser = {
                email: 'test@healthcheck.com',
                password: 'testpass123',
                nom: 'Test',
                prenom: 'User'
            };

            try {
                const registerResponse = await axios.post(
                    config.backend.url + '/api/auth/register',
                    testUser,
                    { timeout: 3000 }
                );

                if (registerResponse.status === 201) {
                    log.success('Création d\'utilisateur fonctionnelle');
                    this.results.integration.details.push('Création utilisateur: ✓');

                    // Test de connexion
                    const loginResponse = await axios.post(
                        config.backend.url + '/api/auth/login',
                        {
                            email: testUser.email,
                            password: testUser.password
                        },
                        { timeout: 3000 }
                    );

                    if (loginResponse.status === 200 && loginResponse.data.token) {
                        log.success('Authentification fonctionnelle');
                        this.results.integration.details.push('Authentification: ✓');

                        // Test avec token
                        const token = loginResponse.data.token;
                        const protectedResponse = await axios.get(
                            config.backend.url + '/api/products',
                            {
                                headers: { Authorization: `Bearer ${token}` },
                                timeout: 3000
                            }
                        );

                        if (protectedResponse.status === 200) {
                            log.success('Endpoints protégés fonctionnels');
                            this.results.integration.details.push('Endpoints protégés: ✓');
                        }
                    }
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    log.info('Utilisateur test existe déjà - Test de connexion...');
                    // Tenter la connexion directement
                    const loginResponse = await axios.post(
                        config.backend.url + '/api/auth/login',
                        {
                            email: testUser.email,
                            password: testUser.password
                        },
                        { timeout: 3000 }
                    );

                    if (loginResponse.status === 200) {
                        log.success('Authentification fonctionnelle');
                        this.results.integration.details.push('Authentification: ✓');
                    }
                } else {
                    throw error;
                }
            }

            this.results.integration.status = 'success';

        } catch (error) {
            log.error(`Tests d'intégration échoués: ${error.message}`);
            this.results.integration.details.push(`Erreur: ${error.message}`);
            this.results.integration.status = 'error';
        }
    }

    // Génération du rapport final
    generateReport() {
        log.separator();
        console.log(`${colors.magenta}📊 RAPPORT DE SANTÉ DE L'APPLICATION${colors.reset}`);
        log.separator();

        let overallStatus = 'success';
        const categories = Object.keys(this.results);

        for (const category of categories) {
            const result = this.results[category];
            const statusIcon = result.status === 'success' ? '✅' : 
                             result.status === 'warning' ? '⚠️' : '❌';
            
            console.log(`\n${statusIcon} ${category.toUpperCase()}: ${result.status.toUpperCase()}`);
            
            for (const detail of result.details) {
                console.log(`   ${detail}`);
            }

            if (result.status === 'error') {
                overallStatus = 'error';
            } else if (result.status === 'warning' && overallStatus !== 'error') {
                overallStatus = 'warning';
            }
        }

        log.separator();
        
        if (overallStatus === 'success') {
            log.success('🎉 Application en bonne santé !');
        } else if (overallStatus === 'warning') {
            log.warning('⚠️ Application fonctionnelle avec des avertissements');
        } else {
            log.error('❌ Problèmes détectés dans l\'application');
        }

        log.separator();

        // Recommandations
        this.generateRecommendations(overallStatus);

        return overallStatus;
    }

    // Génération des recommandations
    generateRecommendations(overallStatus) {
        console.log(`${colors.cyan}💡 RECOMMANDATIONS${colors.reset}\n`);

        if (this.results.files.status === 'error') {
            console.log('• Installez les dépendances manquantes avec "npm install"');
        }

        if (this.results.database.status === 'error') {
            console.log('• Vérifiez que MongoDB est démarré');
            console.log('• Vérifiez la chaîne de connexion MONGO_URI');
        }

        if (this.results.backend.status === 'error') {
            console.log('• Démarrez le serveur backend avec "npm run dev" dans le dossier backend');
        }

        if (this.results.frontend.status === 'error') {
            console.log('• Démarrez le serveur frontend avec "npm run dev" dans le dossier frontend');
        }

        if (this.results.integration.status === 'error') {
            console.log('• Vérifiez la configuration CORS entre frontend et backend');
            console.log('• Vérifiez que toutes les routes API sont correctement définies');
        }

        if (overallStatus === 'success') {
            console.log('• Votre application est prête pour le développement !');
            console.log('• Pensez à configurer les variables d\'environnement pour la production');
        }
    }

    // Méthode principale
    async run() {
        console.log(`${colors.cyan}🏥 VÉRIFICATION DE SANTÉ DE L'APPLICATION${colors.reset}`);
        console.log(`${colors.white}Timestamp: ${new Date().toISOString()}${colors.reset}\n`);

        try {
            await this.checkEnvironment();
            log.separator();
            
            await this.checkFiles();
            log.separator();
            
            await this.checkDatabase();
            log.separator();
            
            await this.checkBackend();
            log.separator();
            
            await this.checkFrontend();
            log.separator();
            
            await this.checkIntegration();
            
            return this.generateReport();

        } catch (error) {
            log.error(`Erreur critique durant la vérification: ${error.message}`);
            console.error(error);
            return 'error';
        }
    }
}

// Exécution du script
if (require.main === module) {
    const checker = new HealthChecker();
    checker.run().then((status) => {
        process.exit(status === 'success' ? 0 : 1);
    }).catch((error) => {
        console.error('Erreur fatale:', error);
        process.exit(1);
    });
}

module.exports = HealthChecker;