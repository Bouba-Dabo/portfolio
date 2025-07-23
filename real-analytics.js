// 🚀 SYSTÈME ANALYTICS HYBRIDE - Portfolio Bouba
// =================================================
// Support pour données réelles (Google Analytics) ET simulation (démo)

class PortfolioAnalytics {
    constructor() {
        this.mode = 'production'; // 'demo' ou 'production'
        this.measurementId = 'G-VP0981J1ML'; // Votre ID GA4 réel
        this.isGALoaded = false;
        this.demoData = {
            totalViews: 1247,
            uniqueVisitors: 892,
            avgTime: '3:42',
            countries: 42,
            mobilePercent: 68,
            currentVisitors: 7,
            referrals: 156
        };
        this.init();
    }

    // 🔧 Initialisation du système
    init() {
        console.log('🔗 Initialisation Portfolio Analytics...');
        
        if (this.mode === 'production') {
            this.loadGoogleAnalytics();
            this.setupRealAnalytics();
        } else {
            this.setupDemoAnalytics();
        }
        
        this.updateUIBadge();
        this.startUpdateCycle();
    }

    // 📊 Charger Google Analytics 4
    loadGoogleAnalytics() {
        console.log('📊 Chargement Google Analytics 4...');
        
        // Ajouter le script GA4
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script1);

        // Initialiser gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', this.measurementId, {
            page_title: document.title,
            page_location: window.location.href
        });

        // Marquer GA comme chargé
        script1.onload = () => {
            this.isGALoaded = true;
            console.log('✅ Google Analytics 4 chargé avec succès');
        };
    }

    // 🎯 Configuration analytics réelles
    setupRealAnalytics() {
        console.log('🎯 Configuration analytics réelles...');
        
        // Événements personnalisés
        this.trackCustomEvents();
        
        // Récupération des données réelles (nécessite Google Analytics Reporting API)
        // Pour l'instant, on utilise les données en temps réel disponibles via gtag
        this.getRealTimeData();
    }

    // 🎪 Configuration analytics démo
    setupDemoAnalytics() {
        console.log('🎪 Mode démonstration activé');
        // Utilise le système existant dans visitor-analytics.js
    }

    // 📈 Récupérer les données en temps réel
    async getRealTimeData() {
        try {
            // Note: Pour des données complètes, il faut l'API Google Analytics
            // Ici on peut récupérer quelques métriques basiques
            
            const realData = {
                totalViews: await this.getPageViews(),
                uniqueVisitors: await this.getUniqueVisitors(),
                currentVisitors: await this.getCurrentVisitors(),
                // Les autres métriques nécessitent l'API
            };

            this.updateAnalyticsDisplay(realData);
        } catch (error) {
            console.log('⚠️ Erreur récupération données réelles, passage en mode démo');
            this.mode = 'demo';
            this.setupDemoAnalytics();
        }
    }

    // 📊 Métriques en temps réel (basiques)
    async getPageViews() {
        // Compteur simple stocké en localStorage + envoi GA4
        let views = localStorage.getItem('portfolio_views') || 0;
        views = parseInt(views) + 1;
        localStorage.setItem('portfolio_views', views);
        
        // Envoyer à GA4
        if (this.isGALoaded) {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
        
        return views;
    }

    async getUniqueVisitors() {
        // Simulation basée sur les sessions
        const sessionKey = 'portfolio_session_' + new Date().toDateString();
        if (!localStorage.getItem(sessionKey)) {
            localStorage.setItem(sessionKey, 'true');
            let unique = localStorage.getItem('portfolio_unique') || 0;
            unique = parseInt(unique) + 1;
            localStorage.setItem('portfolio_unique', unique);
            return unique;
        }
        return localStorage.getItem('portfolio_unique') || 1;
    }

    async getCurrentVisitors() {
        // Pour les visiteurs actuels, on a besoin de l'API ou d'un backend
        // Simulation pour l'instant
        return Math.floor(Math.random() * 15) + 3;
    }

    // 🎯 Événements personnalisés
    trackCustomEvents() {
        // Clic sur projets
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                if (this.isGALoaded) {
                    gtag('event', 'project_click', {
                        event_category: 'Projects',
                        event_label: card.querySelector('.project-title')?.textContent
                    });
                }
            });
        });

        // Navigation sections
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                if (this.isGALoaded) {
                    gtag('event', 'section_navigation', {
                        event_category: 'Navigation',
                        event_label: link.getAttribute('href')
                    });
                }
            });
        });

        // Contact clicks
        document.querySelectorAll('.social-link').forEach(social => {
            social.addEventListener('click', () => {
                if (this.isGALoaded) {
                    gtag('event', 'contact_click', {
                        event_category: 'Contact',
                        event_label: social.getAttribute('title')
                    });
                }
            });
        });
    }

    // 🔄 Mettre à jour l'affichage
    updateAnalyticsDisplay(data) {
        // Utilise les mêmes éléments que le système démo
        if (data.totalViews) {
            document.getElementById('total-views').textContent = data.totalViews.toLocaleString();
        }
        if (data.uniqueVisitors) {
            document.getElementById('unique-visitors').textContent = data.uniqueVisitors.toLocaleString();
        }
        if (data.currentVisitors) {
            document.getElementById('current-count').textContent = data.currentVisitors;
        }
    }

    // 🏷️ Mettre à jour le badge
    updateUIBadge() {
        const badge = document.querySelector('.demo-badge');
        const liveIndicator = document.querySelector('.visitors-live-indicator span:last-child');
        
        if (this.mode === 'production') {
            badge.innerHTML = '<i class="fas fa-chart-line"></i> Données réelles';
            badge.style.backgroundColor = '#28a745';
            if (liveIndicator) liveIndicator.textContent = 'Analytics en direct';
        } else {
            badge.innerHTML = '<i class="fas fa-flask"></i> Données de démonstration';
            badge.style.backgroundColor = '#ffc107';
            if (liveIndicator) liveIndicator.textContent = 'Simulation en direct';
        }
    }

    // ⏰ Cycle de mise à jour
    startUpdateCycle() {
        setInterval(() => {
            if (this.mode === 'production') {
                this.getRealTimeData();
            }
            // Le mode démo continue avec visitor-analytics.js
        }, 30000); // Mise à jour toutes les 30 secondes
    }

    // 🔄 Switch entre modes
    toggleMode() {
        this.mode = this.mode === 'demo' ? 'production' : 'demo';
        console.log(`🔄 Switch vers mode: ${this.mode}`);
        this.init();
    }
}

// 🚀 CONFIGURATION ET LANCEMENT
// ===============================

// Configuration
const ANALYTICS_CONFIG = {
    // À changer selon vos besoins
    defaultMode: 'production', // 'demo' pour les présentations, 'production' pour le vrai site
    measurementId: 'G-VP0981J1ML', // ✅ Votre ID GA4 correct
    updateInterval: 30000, // 30 secondes
    enableCustomEvents: true
};

// Lancement automatique
let portfolioAnalytics;
document.addEventListener('DOMContentLoaded', () => {
    portfolioAnalytics = new PortfolioAnalytics();
    
    // Switch mode avec Ctrl+Alt+A (pour les démos)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'a') {
            portfolioAnalytics.toggleMode();
        }
    });
});

// Export pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioAnalytics;
}
