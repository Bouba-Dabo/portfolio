// Visitor Analytics Animation System
class VisitorAnalytics {
    constructor() {
        this.isInitialized = false;
        this.updateInterval = null;
        this.activityData = [
            { country: '🇫🇷', location: 'Paris, France', page: 'Projets' },
            { country: '🇺🇸', location: 'New York, USA', page: 'Accueil' },
            { country: '🇩🇪', location: 'Berlin, Allemagne', page: 'Compétences' },
            { country: '🇬🇧', location: 'Londres, UK', page: 'À propos' },
            { country: '🇨🇦', location: 'Toronto, Canada', page: 'Projets' },
            { country: '🇯🇵', location: 'Tokyo, Japon', page: 'Accueil' },
            { country: '🇪🇸', location: 'Madrid, Espagne', page: 'Contact' },
            { country: '🇮🇹', location: 'Rome, Italie', page: 'Compétences' },
            { country: '🇳🇱', location: 'Amsterdam, Pays-Bas', page: 'Projets' },
            { country: '🇸🇪', location: 'Stockholm, Suède', page: 'À propos' },
            { country: '🇧🇷', location: 'São Paulo, Brésil', page: 'Accueil' },
            { country: '🇦🇺', location: 'Sydney, Australie', page: 'Compétences' }
        ];
        this.pages = ['Accueil', 'À propos', 'Compétences', 'Projets', 'Contact'];
        this.currentVisitors = 7;
        this.totalViews = 1247;
        this.uniqueVisitors = 892;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        document.addEventListener('DOMContentLoaded', () => {
            this.startAnimations();
            this.setupObserver();
            this.isInitialized = true;
        });
    }

    startAnimations() {
        // Animer les compteurs
        this.animateCounters();
        
        // Démarrer le flux d'activité en temps réel
        this.startActivityStream();
        
        // Animer les barres de progression des pays
        this.animateCountryBars();
        
        // Ajouter des visiteurs aléatoires sur la carte
        this.addRandomVisitors();
        
        // Démarrer les mises à jour périodiques
        this.startPeriodicUpdates();
    }

    animateCounters() {
        // Animer le compteur de visiteurs actuels
        this.animateNumber('current-count', 0, this.currentVisitors, 2000);
        
        // Animer les autres compteurs avec délai
        setTimeout(() => {
            this.animateNumber('total-views', 0, this.totalViews, 3000);
        }, 500);
        
        setTimeout(() => {
            this.animateNumber('unique-visitors', 0, this.uniqueVisitors, 3000);
        }, 1000);
        
        setTimeout(() => {
            this.animateNumber('countries', 0, 42, 2000);
        }, 1500);
    }

    animateNumber(elementId, start, end, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Utiliser une fonction d'easing pour un effet plus naturel
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(start + (end - start) * easeOutExpo);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    startActivityStream() {
        const streamElement = document.getElementById('activity-stream');
        if (!streamElement) return;

        // Ajouter une nouvelle activité toutes les 8-15 secondes
        setInterval(() => {
            this.addNewActivity();
        }, Math.random() * 7000 + 8000);
    }

    addNewActivity() {
        const streamElement = document.getElementById('activity-stream');
        if (!streamElement) return;

        // Sélectionner une activité aléatoire
        const activity = this.activityData[Math.floor(Math.random() * this.activityData.length)];
        const page = this.pages[Math.floor(Math.random() * this.pages.length)];
        
        // Créer l'élément d'activité
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <span class="activity-flag">${activity.country}</span>
            <div class="activity-info">
                <div class="activity-location">${activity.location}</div>
                <div class="activity-time">À l'instant</div>
                <div class="activity-page">Page: ${page}</div>
            </div>
        `;

        // Ajouter en haut du stream
        streamElement.insertBefore(activityItem, streamElement.firstChild);

        // Supprimer les anciens éléments si trop nombreux
        const items = streamElement.querySelectorAll('.activity-item');
        if (items.length > 6) {
            items[items.length - 1].remove();
        }

        // Mettre à jour les temps
        this.updateActivityTimes();

        // Notification discrète
        this.showUpdateNotification(`Nouveau visiteur depuis ${activity.location}`);
    }

    updateActivityTimes() {
        const timeElements = document.querySelectorAll('.activity-time');
        timeElements.forEach((element, index) => {
            if (index === 0) {
                element.textContent = 'À l\'instant';
            } else {
                const minutes = Math.floor(Math.random() * 30) + (index * 2);
                element.textContent = `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
            }
        });
    }

    animateCountryBars() {
        setTimeout(() => {
            const progressBars = document.querySelectorAll('.country-progress');
            progressBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.transition = 'width 2s ease-out';
                    // Les largeurs sont déjà définies dans le HTML
                }, index * 200);
            });
        }, 2000);
    }

    addRandomVisitors() {
        const mapElement = document.getElementById('world-map');
        if (!mapElement) return;

        // Ajouter de nouveaux points de visiteurs de façon périodique
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% de chance
                this.addVisitorDot();
            }
        }, 5000);
    }

    addVisitorDot() {
        const mapElement = document.getElementById('world-map');
        if (!mapElement) return;

        const dot = document.createElement('div');
        dot.className = 'visitor-dot';
        
        // Position aléatoire sur la carte
        const top = Math.random() * 60 + 20; // 20% à 80%
        const left = Math.random() * 80 + 10; // 10% à 90%
        
        dot.style.top = `${top}%`;
        dot.style.left = `${left}%`;
        dot.style.opacity = '0';
        dot.style.transform = 'scale(0)';
        
        const activity = this.activityData[Math.floor(Math.random() * this.activityData.length)];
        dot.title = activity.location;
        
        mapElement.appendChild(dot);
        
        // Animation d'apparition
        setTimeout(() => {
            dot.style.transition = 'all 0.5s ease-out';
            dot.style.opacity = '1';
            dot.style.transform = 'scale(1)';
        }, 100);
        
        // Supprimer après 20 secondes
        setTimeout(() => {
            dot.style.transition = 'all 0.5s ease-in';
            dot.style.opacity = '0';
            dot.style.transform = 'scale(0)';
            setTimeout(() => {
                if (dot.parentNode) {
                    dot.parentNode.removeChild(dot);
                }
            }, 500);
        }, 20000);
    }

    startPeriodicUpdates() {
        // Mettre à jour les statistiques de façon périodique
        setInterval(() => {
            this.updateStats();
        }, 30000); // Toutes les 30 secondes
    }

    updateStats() {
        // Augmenter légèrement les statistiques
        const currentElement = document.getElementById('current-count');
        if (currentElement && Math.random() > 0.5) {
            const change = Math.random() > 0.7 ? 1 : -1;
            this.currentVisitors = Math.max(1, this.currentVisitors + change);
            this.animateNumber('current-count', parseInt(currentElement.textContent), this.currentVisitors, 1000);
        }

        // Augmenter les vues totales occasionnellement
        if (Math.random() > 0.8) {
            this.totalViews += Math.floor(Math.random() * 5) + 1;
            this.animateNumber('total-views', parseInt(document.getElementById('total-views').textContent), this.totalViews, 1500);
        }
    }

    showUpdateNotification(message) {
        // Créer ou réutiliser l'élément de notification
        let notification = document.querySelector('.update-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'update-notification';
            document.body.appendChild(notification);
        }

        notification.innerHTML = `<i class="fas fa-bell"></i>${message} <small>(Démo)</small>`;
        notification.classList.add('show');

        // Masquer après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    setupObserver() {
        // Observer pour démarrer les animations quand la section est visible
        const analyticsSection = document.querySelector('.visitors-analytics');
        if (!analyticsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Relancer les animations si nécessaire
                    const globe = entry.target.querySelector('.visitor-globe');
                    if (globe) {
                        globe.style.animationPlayState = 'running';
                    }
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(analyticsSection);
    }

    // Méthode pour simuler l'augmentation du trafic
    simulateTrafficSpike() {
        this.currentVisitors += Math.floor(Math.random() * 10) + 5;
        this.animateNumber('current-count', parseInt(document.getElementById('current-count').textContent), this.currentVisitors, 2000);
        
        // Ajouter plusieurs nouvelles activités rapidement
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.addNewActivity();
            }, i * 1000);
        }
        
        this.showUpdateNotification('Pic de trafic détecté ! 📈');
    }
}

// Easter egg : simuler un pic de trafic en tapant "traffic" sur la page
let typedSequence = '';
document.addEventListener('keydown', (e) => {
    typedSequence += e.key.toLowerCase();
    if (typedSequence.includes('traffic')) {
        if (window.visitorAnalytics) {
            window.visitorAnalytics.simulateTrafficSpike();
        }
        typedSequence = '';
    }
    if (typedSequence.length > 10) {
        typedSequence = typedSequence.slice(-10);
    }
});

// Initialiser le système d'analytics
window.visitorAnalytics = new VisitorAnalytics();

// Export pour usage externe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisitorAnalytics;
}
