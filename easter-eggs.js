// 🎨 Fonctionnalités Cachées du Portfolio
// Copiez dans la console pour découvrir les easter eggs

console.log("🎨 Fonctionnalités cachées activées !");

// 1. Mode Debug Analytics
function enableDebugMode() {
    localStorage.setItem('portfolio_debug', 'true');
    console.log("🐛 Mode debug activé");
    console.log("Rechargez la page pour voir les logs détaillés");
}

// 2. Konami Code pour des effets spéciaux
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    console.log("🎉 KONAMI CODE ACTIVÉ !");
    
    // Effet Matrix
    const style = document.createElement('style');
    style.textContent = `
        .matrix-effect {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 0, 0.1) 2px,
                rgba(0, 255, 0, 0.1) 4px
            );
            pointer-events: none;
            z-index: 9999;
            animation: matrix-rain 0.5s linear infinite;
        }
        
        @keyframes matrix-rain {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
    `;
    document.head.appendChild(style);
    
    const matrix = document.createElement('div');
    matrix.className = 'matrix-effect';
    document.body.appendChild(matrix);
    
    setTimeout(() => {
        matrix.remove();
        style.remove();
    }, 3000);
}

// 3. Statistiques secrètes
function getSecretStats() {
    const stats = {
        linesOfCode: 2847,
        coffeeConsumed: "∞",
        bugsFixed: 42,
        deploymentsSuccess: "99.9%",
        aiModelsCreated: 7,
        datasetsProcessed: "23.4 GB",
        neuralLayers: 284,
        gitCommits: 156
    };
    
    console.table(stats);
    console.log("☕ Statistiques du développeur révélées !");
}

// 4. Mode Performance
function togglePerformanceMode() {
    const body = document.body;
    if (body.classList.contains('performance-mode')) {
        body.classList.remove('performance-mode');
        console.log("🏃‍♂️ Mode performance désactivé");
    } else {
        body.classList.add('performance-mode');
        console.log("⚡ Mode performance activé - Animations réduites");
        
        const style = document.createElement('style');
        style.id = 'performance-style';
        style.textContent = `
            .performance-mode * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// 5. Générateur de rapports automatique
function generateAutoReport() {
    console.log("📄 Génération du rapport automatique...");
    
    const report = {
        timestamp: new Date().toLocaleString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        connection: navigator.connection?.effectiveType || 'unknown',
        platform: navigator.platform,
        portfolio: {
            pwaNative: 'serviceWorker' in navigator,
            i18nActive: !!window.portfolioI18n,
            analyticsActive: !!window.portfolioAnalytics,
            currentLanguage: window.portfolioI18n?.getCurrentLanguage() || 'fr'
        }
    };
    
    console.table(report);
    
    // Copier dans le presse-papiers si possible
    if (navigator.clipboard) {
        navigator.clipboard.writeText(JSON.stringify(report, null, 2));
        console.log("📋 Rapport copié dans le presse-papiers !");
    }
    
    return report;
}

// 6. Mode recruteur (affichage optimisé)
function activateRecruiterMode() {
    console.log("👔 Mode recruteur activé !");
    
    // Ajouter des highlights sur les éléments importants
    const style = document.createElement('style');
    style.id = 'recruiter-mode';
    style.textContent = `
        .hero-cta, .skills-matching, .contact {
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.5) !important;
            border: 2px solid var(--primary-color) !important;
        }
        
        .project-card {
            transform: scale(1.02) !important;
        }
        
        .stat-number {
            animation: pulse 2s infinite !important;
        }
    `;
    document.head.appendChild(style);
    
    // Message d'accueil personnalisé
    setTimeout(() => {
        alert("👋 Bienvenue ! Ce portfolio est optimisé pour les recruteurs. Les sections importantes sont mises en évidence.");
    }, 2000);
}

// Interface des commandes
console.log("🎮 Commandes secrètes disponibles :");
console.log("- enableDebugMode() : Mode développeur");
console.log("- getSecretStats() : Statistiques cachées");
console.log("- togglePerformanceMode() : Mode rapide");
console.log("- generateAutoReport() : Rapport technique");
console.log("- activateRecruiterMode() : Mode recruteur");
console.log("- Konami Code : ↑↑↓↓←→←→BA pour effet spécial");

console.log("\n💡 Astuce : Testez getSecretStats() !");
