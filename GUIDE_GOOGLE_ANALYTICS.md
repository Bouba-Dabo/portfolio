# 📊 Guide d'intégration Google Analytics 4 - Portfolio Bouba

## 🎯 Objectif
Remplacer les données simulées par de vraies analytics Google Analytics 4

## 🔧 Étapes d'installation

### 1️⃣ Créer un compte Google Analytics
1. Aller sur https://analytics.google.com/
2. Cliquer sur "Commencer" 
3. Créer une propriété pour votre portfolio
4. Récupérer votre **MEASUREMENT_ID** (format: G-XXXXXXXXXX)

### 2️⃣ Ajouter le script GA4 dans le portfolio
Le script sera ajouté automatiquement dans la section `<head>` de index.html

### 3️⃣ Modifier le code JavaScript
- Remplacer les données simulées par les vraies métriques GA4
- Garder le même design et les mêmes animations
- Ajouter un switch démo/production

### 4️⃣ Configuration avancée (optionnelle)
- Événements personnalisés (clics sur projets, temps passé)
- Goals et conversions
- Rapports personnalisés

## 🎨 Design conservé
✅ Même interface visuelle
✅ Mêmes animations
✅ Même structure
✅ Badge "Données réelles" au lieu de "Démonstration"

## 📈 Métriques disponibles
- Visiteurs en temps réel
- Pages vues totales
- Visiteurs uniques
- Temps moyen sur site
- Géolocalisation des visiteurs
- Sources de trafic
- Pages les plus visitées

## 🔄 Mode hybrid (recommandé)
- Données réelles quand disponibles
- Données simulées en backup pour les démos
- Switch manuel démo/production

## 🚀 Déploiement
Une fois configuré, les vraies données apparaîtront automatiquement !
