# setup-integration.ps1
# Script de configuration simplifie pour Windows

Write-Host "Configuration ProdMaster" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

# Verification Node.js
Write-Host "Verification Node.js..." -ForegroundColor Blue
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "Node.js trouve: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "Node.js non trouve" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Erreur Node.js" -ForegroundColor Red
    exit 1
}

# Verification npm
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "npm trouve: $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "npm non trouve" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Erreur npm" -ForegroundColor Red
    exit 1
}

# Verification structure
Write-Host "Verification structure..." -ForegroundColor Blue
if ((Test-Path "frontend") -and (Test-Path "backend")) {
    Write-Host "Structure OK" -ForegroundColor Green
} else {
    Write-Host "Dossiers frontend et backend requis" -ForegroundColor Red
    exit 1
}

# Installation backend
Write-Host "Installation backend..." -ForegroundColor Blue
Set-Location backend
try {
    if (Test-Path "package.json") {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Backend installe" -ForegroundColor Green
        } else {
            Write-Host "Erreur installation backend" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "package.json manquant dans backend" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Erreur backend" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Creation .env backend
if (-not (Test-Path ".env")) {
    Write-Host "Creation .env backend..." -ForegroundColor Yellow
    $envBackend = "NODE_ENV=development`r`nPORT=5000`r`nMONGO_URI=mongodb://localhost:27017/prodmaster`r`nJWT_SECRET=supersecretkey123"
    $envBackend | Out-File -FilePath ".env" -Encoding ascii
    Write-Host "Fichier .env backend cree" -ForegroundColor Green
} else {
    Write-Host "Fichier .env backend existe" -ForegroundColor Green
}

Set-Location ..

# Installation frontend
Write-Host "Installation frontend..." -ForegroundColor Blue
Set-Location frontend
try {
    if (Test-Path "package.json") {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Frontend installe" -ForegroundColor Green
        } else {
            Write-Host "Erreur installation frontend" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "package.json manquant dans frontend" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Erreur frontend" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Creation .env frontend
if (-not (Test-Path ".env")) {
    Write-Host "Creation .env frontend..." -ForegroundColor Yellow
    $envFrontend = "REACT_APP_API_URL=http://localhost:5000/api`r`nREACT_APP_ENV=development`r`nREACT_APP_DEBUG_MODE=true`r`nREACT_APP_ENABLE_MOCK_DATA=true"
    $envFrontend | Out-File -FilePath ".env" -Encoding ascii
    Write-Host "Fichier .env frontend cree" -ForegroundColor Green
} else {
    Write-Host "Fichier .env frontend existe" -ForegroundColor Green
}

Set-Location ..

# Verification MongoDB
Write-Host "Verification MongoDB..." -ForegroundColor Blue
try {
    $mongoCheck = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
    if ($mongoCheck) {
        Write-Host "MongoDB demarre" -ForegroundColor Green
    } else {
        Write-Host "MongoDB non demarre (optionnel)" -ForegroundColor Yellow
        Write-Host "Pour demarrer: net start MongoDB" -ForegroundColor Yellow
        Write-Host "Ou avec Docker: docker run -d -p 27017:27017 mongo" -ForegroundColor Yellow
    }
} catch {
    Write-Host "MongoDB non detecte" -ForegroundColor Yellow
}

# Instructions finales
Write-Host ""
Write-Host "Configuration terminee!" -ForegroundColor Green
Write-Host ""
Write-Host "Instructions de demarrage:" -ForegroundColor Cyan
Write-Host "1. Ouvrez un nouveau terminal:" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2. Ouvrez un autre terminal:" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "   Application: http://localhost:3000" -ForegroundColor White
Write-Host "   API: http://localhost:5000/api" -ForegroundColor White
Write-Host ""

Write-Host "Appuyez sur Entree pour terminer..." -ForegroundColor Gray
Read-Host