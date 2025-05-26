#!/bin/bash
# deploy.sh - Script de déploiement automatisé ProdMaster

set -e  # Arrêter en cas d'erreur

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
PROJECT_ROOT=$(pwd)
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
DEPLOY_ENV=${1:-production}

log_info "🚀 Démarrage du déploiement ProdMaster en mode $DEPLOY_ENV"

# Vérifications préalables
check_prerequisites() {
    log_info "🔍 Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier MongoDB (optionnel en local)
    if ! command -v mongod &> /dev/null; then
        log_warning "MongoDB n'est pas installé localement (OK si utilisation de MongoDB Atlas)"
    fi
    
    log_success "Prérequis validés"
}

# Corriger le conflit .env
fix_env_conflict() {
    log_info "🔧 Correction du conflit .env..."
    
    cd "$BACKEND_DIR"
    
    # Sauvegarder l'ancien .env
    if [ -f .env ]; then
        cp .env .env.backup
    fi
    
    # Créer le nouveau .env basé sur l'environnement
    cat > .env << EOF
NODE_ENV=$DEPLOY_ENV
PORT=5000
MONGO_URI=mongodb://localhost:27017/prodmaster
JWT_SECRET=prodmaster_jwt_secret_securise_${DEPLOY_ENV}_$(date +%s)
CORS_ORIGIN=http://localhost:3000
EOF
    
    log_success "Fichier .env configuré pour $DEPLOY_ENV"
}

# Installation des dépendances
install_dependencies() {
    log_info "📦 Installation des dépendances..."
    
    # Backend
    log_info "Installation backend..."
    cd "$BACKEND_DIR"
    npm ci --silent
    
    # Frontend
    log_info "Installation frontend..."
    cd "$FRONTEND_DIR"
    npm ci --silent
    
    log_success "Dépendances installées"
}

# Tests backend
test_backend() {
    log_info "🧪 Tests backend..."
    cd "$BACKEND_DIR"
    
    # Démarrer le serveur en arrière-plan pour les tests
    npm start &
    SERVER_PID=$!
    
    # Attendre que le serveur démarre
    sleep 5
    
    # Test de base de l'API
    if curl -s http://localhost:5000/api/ > /dev/null; then
        log_success "API backend accessible"
    else
        log_error "API backend non accessible"
        kill $SERVER_PID 2>/dev/null || true
        exit 1
    fi
    
    # Arrêter le serveur de test
    kill $SERVER_PID 2>/dev/null || true
    sleep 2
}

# Build frontend
build_frontend() {
    log_info "🏗️ Build du frontend..."
    cd "$FRONTEND_DIR"
    
    # Configurer l'environnement de production
    if [ "$DEPLOY_ENV" = "production" ]; then
        cat > .env.production << EOF
REACT_APP_API_URL=https://api.votre-domaine.com/api
REACT_APP_ENV=production
REACT_APP_DEBUG_MODE=false
REACT_APP_ENABLE_MOCK_DATA=false
EOF
    fi
    
    # Build
    npm run build
    
    if [ -d "dist" ]; then
        log_success "Build frontend réussi (dist/)"
    else
        log_error "Échec du build frontend"
        exit 1
    fi
}

# Initialiser la base de données
init_database() {
    log_info "🗃️ Initialisation de la base de données..."
    cd "$BACKEND_DIR"
    
    # Vérifier si MongoDB est accessible
    if node -e "
        const mongoose = require('mongoose');
        mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prodmaster')
            .then(() => { console.log('MongoDB accessible'); process.exit(0); })
            .catch(() => { console.log('MongoDB non accessible'); process.exit(1); });
    "; then
        # Initialiser les données
        node init-data.js
        log_success "Base de données initialisée"
    else
        log_warning "MongoDB non accessible - données non initialisées"
    fi
}

# Déploiement local (développement/test)
deploy_local() {
    log_info "🏠 Déploiement local..."
    
    # Démarrer le backend
    cd "$BACKEND_DIR"
    npm start &
    BACKEND_PID=$!
    
    # Attendre que le backend démarre
    sleep 3
    
    # Démarrer le frontend en mode développement
    cd "$FRONTEND_DIR"
    if [ "$DEPLOY_ENV" = "production" ]; then
        # En production, servir les fichiers buildés
        npx serve -s dist -l 3000 &
        FRONTEND_PID=$!
    else
        npm run dev &
        FRONTEND_PID=$!
    fi
    
    log_success "Application démarrée !"
    log_info "Frontend: http://localhost:3000"
    log_info "Backend: http://localhost:5000"
    log_info "API: http://localhost:5000/api"
    
    # Créer un script d'arrêt
    cat > stop_app.sh << EOF
#!/bin/bash
echo "Arrêt de l'application ProdMaster..."
kill $BACKEND_PID 2>/dev/null || true
kill $FRONTEND_PID 2>/dev/null || true
echo "Application arrêtée"
EOF
    chmod +x stop_app.sh
    
    log_info "Pour arrêter l'application : ./stop_app.sh"
}

# Déploiement Docker (optionnel)
deploy_docker() {
    log_info "🐳 Préparation du déploiement Docker..."
    
    # Créer le Dockerfile pour le backend
    cat > "$BACKEND_DIR/Dockerfile" << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
EOF

    # Créer le Dockerfile pour le frontend
    cat > "$FRONTEND_DIR/Dockerfile" << EOF
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
EOF

    # Créer la configuration Nginx
    cat > "$FRONTEND_DIR/nginx.conf" << EOF
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files \$uri \$uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:5000;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
        }
    }
}
EOF

    # Créer docker-compose.yml
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  mongodb:
    image: mongo:6
    restart: unless-stopped
    environment:
      MONGO_INITDB_DATABASE: prodmaster
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGO_URI: mongodb://mongodb:27017/prodmaster
      JWT_SECRET: prodmaster_jwt_secret_docker
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
EOF

    log_success "Configuration Docker créée"
    log_info "Pour déployer avec Docker : docker-compose up -d"
}

# Vérifications post-déploiement
verify_deployment() {
    log_info "✅ Vérification du déploiement..."
    
    # Attendre que les services démarrent
    sleep 10
    
    # Test frontend
    if curl -s http://localhost:3000 > /dev/null; then
        log_success "Frontend accessible"
    else
        log_warning "Frontend non accessible"
    fi
    
    # Test backend
    if curl -s http://localhost:5000/api/ > /dev/null; then
        log_success "Backend API accessible"
    else
        log_warning "Backend API non accessible"
    fi
    
    # Test d'un endpoint spécifique
    if curl -s http://localhost:5000/api/products > /dev/null; then
        log_success "Endpoint /products accessible"
    else
        log_warning "Endpoint /products non accessible"
    fi
}

# Fonction principale
main() {
    log_info "🎯 Objectif : Déploiement ProdMaster en $DEPLOY_ENV"
    
    check_prerequisites
    fix_env_conflict
    install_dependencies
    
    if [ "$DEPLOY_ENV" != "test-only" ]; then
        init_database
        build_frontend
        
        # Choix du type de déploiement
        read -p "Type de déploiement [local/docker] (défaut: local): " DEPLOY_TYPE
        DEPLOY_TYPE=${DEPLOY_TYPE:-local}
        
        case $DEPLOY_TYPE in
            docker)
                deploy_docker
                log_info "Configuration Docker prête. Lancez : docker-compose up -d"
                ;;
            local|*)
                deploy_local
                verify_deployment
                ;;
        esac
    else
        test_backend
        log_success "Tests backend réussis"
    fi
    
    log_success "🎉 Déploiement terminé avec succès !"
}

# Script de nettoyage en cas d'interruption
cleanup() {
    log_warning "Nettoyage en cours..."
    pkill -f "npm start" 2>/dev/null || true
    pkill -f "npm run dev" 2>/dev/null || true
    pkill -f "npx serve" 2>/dev/null || true
}

trap cleanup EXIT

# Lancement du script principal
main "$@"