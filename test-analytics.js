// Test Script pour les Analytics
// Copiez ce code dans la console du portfolio principal

console.log("📊 Test du système Analytics");

// 1. Vérifier si Analytics est initialisé
function checkAnalyticsInit() {
    console.log("1️⃣ Vérification Analytics...");
    
    if (window.portfolioAnalytics) {
        console.log("✅ Analytics initialisé");
        console.log("📈 Session démarrée:", new Date(window.portfolioAnalytics.sessionStart));
    } else {
        console.log("❌ Analytics non initialisé");
    }
}

// 2. Tester le tracking manuel
function testManualTracking() {
    console.log("2️⃣ Test tracking manuel...");
    
    if (window.portfolioAnalytics) {
        // Tester un événement personnalisé
        window.portfolioAnalytics.trackCustomEvent('test_event', {
            source: 'manual_test',
            timestamp: Date.now()
        });
        console.log("✅ Événement custom envoyé");
        
        // Tester une interaction
        window.portfolioAnalytics.trackInteraction('test_click', 'test_button', {
            testData: 'validation'
        });
        console.log("✅ Interaction envoyée");
    }
}

// 3. Récupérer les données analytics
async function getAnalyticsData() {
    console.log("3️⃣ Récupération données analytics...");
    
    if (window.portfolioAnalytics) {
        try {
            const report = await window.portfolioAnalytics.getAnalyticsReport();
            console.log("📊 Rapport Analytics:", report);
            console.log(`- Visites: ${report.visits?.length || 0}`);
            console.log(`- Interactions: ${report.interactions?.length || 0}`);
            console.log(`- Skills Matching: ${report.skillsMatching?.length || 0}`);
        } catch (error) {
            console.error("❌ Erreur récupération analytics:", error);
        }
    }
}

// 4. Test Service Worker
function testServiceWorker() {
    console.log("4️⃣ Test Service Worker...");
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            console.log("✅ Service Worker actif:", registration);
            
            // Envoyer un message au SW
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'TRACK_VISIT',
                    data: { page: 'test', timestamp: Date.now() }
                });
                console.log("✅ Message envoyé au Service Worker");
            }
        });
    } else {
        console.log("❌ Service Worker non supporté");
    }
}

// 5. Simuler des interactions pour les tests
function simulateInteractions() {
    console.log("5️⃣ Simulation d'interactions...");
    
    const sections = ['hero', 'about', 'projects', 'skills', 'contact'];
    const actions = ['click', 'scroll', 'hover'];
    
    sections.forEach((section, index) => {
        setTimeout(() => {
            if (window.portfolioAnalytics) {
                window.portfolioAnalytics.trackInteraction(
                    actions[index % actions.length],
                    'simulated_element',
                    { section, simulation: true }
                );
                console.log(`📍 Interaction simulée: ${section}`);
            }
        }, index * 500);
    });
}

// Exécuter tous les tests
console.log("🚀 Démarrage tests Analytics...");
checkAnalyticsInit();
setTimeout(testManualTracking, 1000);
setTimeout(getAnalyticsData, 2000);
setTimeout(testServiceWorker, 3000);
setTimeout(simulateInteractions, 4000);

console.log("📝 Instructions Analytics:");
console.log("1. Naviguez sur différentes sections");
console.log("2. Testez le Skills Matching");
console.log("3. Visitez /analytics-dashboard.html");
console.log("4. Vérifiez les données en temps réel");
