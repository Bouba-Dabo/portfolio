// 🔧 Test de Correction du Bug Canvas
// Script pour vérifier que l'erreur Chart.js est résolue

console.log("🔧 Test correction bug Canvas Chart.js");

// 1. Vérifier la disponibilité de Chart.js
function checkChartJS() {
    console.log("1️⃣ Vérification Chart.js...");
    
    if (typeof Chart !== 'undefined') {
        console.log("✅ Chart.js disponible, version:", Chart.version || 'inconnue');
        return true;
    } else {
        console.log("❌ Chart.js non disponible");
        return false;
    }
}

// 2. Tester la création et destruction de graphiques
function testChartCreationDestruction() {
    console.log("2️⃣ Test création/destruction graphiques...");
    
    // Créer un canvas temporaire
    const tempCanvas = document.createElement('canvas');
    tempCanvas.id = 'test-canvas';
    tempCanvas.width = 400;
    tempCanvas.height = 200;
    document.body.appendChild(tempCanvas);
    
    try {
        // Créer premier graphique
        console.log("📊 Création graphique 1...");
        const chart1 = new Chart(tempCanvas, {
            type: 'line',
            data: {
                labels: ['A', 'B', 'C'],
                datasets: [{
                    label: 'Test 1',
                    data: [1, 2, 3],
                    borderColor: '#00d4ff'
                }]
            },
            options: { responsive: false }
        });
        console.log("✅ Graphique 1 créé");
        
        // Détruire et recréer
        console.log("🗑️ Destruction graphique 1...");
        chart1.destroy();
        console.log("✅ Graphique 1 détruit");
        
        // Créer deuxième graphique sur le même canvas
        console.log("📊 Création graphique 2 sur même canvas...");
        const chart2 = new Chart(tempCanvas, {
            type: 'doughnut',
            data: {
                labels: ['X', 'Y'],
                datasets: [{
                    data: [10, 20],
                    backgroundColor: ['#ff006b', '#9d4edd']
                }]
            },
            options: { responsive: false }
        });
        console.log("✅ Graphique 2 créé sans erreur");
        
        // Nettoyer
        chart2.destroy();
        tempCanvas.remove();
        console.log("✅ Test réussi - Pas d'erreur Canvas");
        
    } catch (error) {
        console.error("❌ Erreur lors du test:", error);
        tempCanvas.remove();
    }
}

// 3. Tester le refresh du dashboard
function testDashboardRefresh() {
    console.log("3️⃣ Test refresh dashboard...");
    
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        console.log("🔄 Simulation clic refresh...");
        
        // Observer les erreurs console
        const originalError = console.error;
        let errorCount = 0;
        
        console.error = function(...args) {
            if (args[0] && args[0].includes('Canvas is already in use')) {
                errorCount++;
                console.log("❌ Erreur Canvas détectée!");
            }
            originalError.apply(console, args);
        };
        
        // Cliquer plusieurs fois pour tester
        setTimeout(() => refreshBtn.click(), 100);
        setTimeout(() => refreshBtn.click(), 2000);
        setTimeout(() => refreshBtn.click(), 4000);
        
        // Vérifier après 6 secondes
        setTimeout(() => {
            console.error = originalError;
            if (errorCount === 0) {
                console.log("✅ Aucune erreur Canvas détectée lors du refresh");
            } else {
                console.log(`❌ ${errorCount} erreur(s) Canvas détectée(s)`);
            }
        }, 6000);
        
    } else {
        console.log("❌ Bouton refresh non trouvé");
    }
}

// 4. Vérifier l'état des variables globales
function checkGlobalChartVariables() {
    console.log("4️⃣ Vérification variables globales...");
    
    // Ces variables devraient être définies dans le dashboard
    const globalVars = ['visitsChart', 'sectionsChart', 'analyticsData'];
    
    globalVars.forEach(varName => {
        if (typeof window[varName] !== 'undefined') {
            console.log(`✅ ${varName}: ${window[varName] ? 'défini' : 'null'}`);
        } else {
            console.log(`⚠️ ${varName}: non défini`);
        }
    });
}

// 5. Test de performance de Chart.js
function testChartPerformance() {
    console.log("5️⃣ Test performance Chart.js...");
    
    const startTime = performance.now();
    const tempCanvas = document.createElement('canvas');
    document.body.appendChild(tempCanvas);
    
    try {
        const chart = new Chart(tempCanvas, {
            type: 'line',
            data: {
                labels: Array.from({length: 100}, (_, i) => `Point ${i}`),
                datasets: [{
                    label: 'Performance Test',
                    data: Array.from({length: 100}, () => Math.random() * 100),
                    borderColor: '#00d4ff'
                }]
            },
            options: {
                responsive: false,
                animation: false
            }
        });
        
        const creationTime = performance.now() - startTime;
        console.log(`⚡ Création graphique: ${creationTime.toFixed(2)}ms`);
        
        const destroyStart = performance.now();
        chart.destroy();
        const destroyTime = performance.now() - destroyStart;
        console.log(`🗑️ Destruction graphique: ${destroyTime.toFixed(2)}ms`);
        
        tempCanvas.remove();
        
    } catch (error) {
        console.error("❌ Erreur test performance:", error);
        tempCanvas.remove();
    }
}

// Interface de test
console.log("🧪 Tests disponibles:");
console.log("- checkChartJS() : Vérifier Chart.js");
console.log("- testChartCreationDestruction() : Test création/destruction");
console.log("- testDashboardRefresh() : Test refresh dashboard");
console.log("- checkGlobalChartVariables() : Variables globales");
console.log("- testChartPerformance() : Test performance");

// Auto-exécution des tests
console.log("\n🚀 Exécution automatique des tests...");
if (checkChartJS()) {
    setTimeout(testChartCreationDestruction, 1000);
    setTimeout(checkGlobalChartVariables, 2000);
    setTimeout(testChartPerformance, 3000);
    setTimeout(testDashboardRefresh, 4000);
} else {
    console.log("⏹️ Tests arrêtés - Chart.js non disponible");
}

console.log("\n💡 Info: Si vous êtes sur le dashboard analytics,");
console.log("les tests de refresh détecteront automatiquement les erreurs Canvas.");
