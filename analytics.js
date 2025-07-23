// ========================
// ANALYTICS SYSTEM
// ========================

class PortfolioAnalytics {
    constructor() {
        this.isOnline = navigator.onLine;
        this.sessionStart = Date.now();
        this.interactions = [];
        this.currentSection = null;
        this.sectionTimings = new Map();
        
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.trackVisit();
        this.setupEventListeners();
        this.startHeartbeat();
        
        console.log('📊 Portfolio Analytics initialized');
    }

    // ========================
    // SERVICE WORKER
    // ========================
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('✅ Service Worker registered:', registration);

                // Écouter les messages du Service Worker
                navigator.serviceWorker.addEventListener('message', (event) => {
                    const { type, message } = event.data;
                    if (type === 'SW_ACTIVATED') {
                        this.showPWANotification(message);
                    }
                });

                // Vérifier les mises à jour
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });

            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        }
    }

    // ========================
    // TRACKING DES VISITES
    // ========================
    trackVisit() {
        const visitData = {
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            language: navigator.language,
            referrer: document.referrer,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: Date.now()
        };

        this.sendToServiceWorker('TRACK_VISIT', visitData);
        
        // Analytics locales
        this.saveToLocalStorage('lastVisit', visitData);
        this.incrementVisitCount();
    }

    // ========================
    // TRACKING DES INTERACTIONS
    // ========================
    setupEventListeners() {
        // Scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackInteraction('scroll', 'window', {
                    scrollPercentage: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100),
                    scrollPosition: window.scrollY
                });
            }, 500);
        });

        // Section viewing
        this.observeSections();

        // Clicks sur les éléments importants
        this.trackImportantClicks();

        // Skills Matching form
        this.trackSkillsMatching();

        // Time on page
        window.addEventListener('beforeunload', () => {
            this.trackSessionEnd();
        });

        // Online/Offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.trackInteraction('connection', 'status', { status: 'online' });
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.trackInteraction('connection', 'status', { status: 'offline' });
        });
    }

    observeSections() {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const sectionId = entry.target.id;
                    
                    // Fin du timing de la section précédente
                    if (this.currentSection && this.currentSection !== sectionId) {
                        this.endSectionTiming(this.currentSection);
                    }
                    
                    // Début du timing de la nouvelle section
                    this.startSectionTiming(sectionId);
                    this.currentSection = sectionId;
                    
                    this.trackInteraction('section_view', sectionId, {
                        sectionName: sectionId,
                        scrollDirection: 'down'
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    startSectionTiming(sectionId) {
        this.sectionTimings.set(sectionId, Date.now());
    }

    endSectionTiming(sectionId) {
        const startTime = this.sectionTimings.get(sectionId);
        if (startTime) {
            const duration = Date.now() - startTime;
            this.trackInteraction('section_duration', sectionId, {
                duration: duration,
                humanReadable: this.formatDuration(duration)
            });
            this.sectionTimings.delete(sectionId);
        }
    }

    trackImportantClicks() {
        // Liens de contact
        document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackInteraction('contact_click', e.target.tagName, {
                    type: e.target.href.startsWith('mailto:') ? 'email' : 'phone',
                    value: e.target.href
                });
            });
        });

        // Boutons de projet
        document.querySelectorAll('.project-card a, .project-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackInteraction('project_click', 'project_link', {
                    projectName: e.target.closest('.project-card')?.querySelector('h3')?.textContent || 'Unknown',
                    url: e.target.href
                });
            });
        });

        // Boutons de navigation
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackInteraction('navigation_click', 'nav_link', {
                    section: e.target.getAttribute('href'),
                    text: e.target.textContent
                });
            });
        });

        // Chatbot interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.chatbot-toggle, .chatbot-container')) {
                this.trackInteraction('chatbot_interaction', 'chatbot', {
                    action: e.target.className,
                    timestamp: Date.now()
                });
            }
        });
    }

    trackSkillsMatching() {
        const form = document.getElementById('skills-matching-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                const formData = new FormData(form);
                const matchingData = {
                    domain: formData.get('domain'),
                    technologies: formData.get('technologies'),
                    experience: formData.get('experience'),
                    projectTypes: formData.get('project-types'),
                    timestamp: Date.now()
                };

                this.trackInteraction('skills_matching_submit', 'form', matchingData);
                
                // Après analyse, tracker les résultats
                setTimeout(() => {
                    this.trackSkillsMatchingResults();
                }, 1000);
            });
        }
    }

    trackSkillsMatchingResults() {
        const resultsContainer = document.getElementById('matching-results');
        if (resultsContainer && resultsContainer.style.display !== 'none') {
            const scoreElement = resultsContainer.querySelector('.score-value');
            const compatibilityScore = scoreElement ? parseInt(scoreElement.textContent) : 0;
            
            const matchedSkills = Array.from(resultsContainer.querySelectorAll('.matched-skills .skill-tag'))
                .map(tag => tag.textContent.trim());
            
            const missingSkills = Array.from(resultsContainer.querySelectorAll('.missing-skills .skill-tag'))
                .map(tag => tag.textContent.trim());

            const resultsData = {
                compatibilityScore,
                matchedSkills,
                missingSkills,
                timestamp: Date.now()
            };

            this.sendToServiceWorker('TRACK_SKILLS_MATCHING', resultsData);
        }
    }

    // ========================
    // TRACKING GÉNÉRAL
    // ========================
    trackInteraction(type, element, additionalData = {}) {
        const interactionData = {
            type,
            element,
            timestamp: Date.now(),
            section: this.currentSection || 'unknown',
            sessionDuration: Date.now() - this.sessionStart,
            ...additionalData
        };

        this.interactions.push(interactionData);
        this.sendToServiceWorker('TRACK_INTERACTION', interactionData);
        
        // Limiter le nombre d'interactions en mémoire
        if (this.interactions.length > 100) {
            this.interactions = this.interactions.slice(-50);
        }
    }

    trackSessionEnd() {
        const sessionData = {
            duration: Date.now() - this.sessionStart,
            interactionsCount: this.interactions.length,
            sectionsVisited: Array.from(this.sectionTimings.keys()),
            timestamp: Date.now()
        };

        this.trackInteraction('session_end', 'window', sessionData);
        
        // Finaliser les timings des sections
        if (this.currentSection) {
            this.endSectionTiming(this.currentSection);
        }
    }

    // ========================
    // COMMUNICATION SW
    // ========================
    sendToServiceWorker(type, data) {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type, data });
        }
    }

    async getAnalytics() {
        return new Promise((resolve) => {
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                const channel = new MessageChannel();
                channel.port1.onmessage = (event) => {
                    resolve(event.data);
                };
                
                navigator.serviceWorker.controller.postMessage(
                    { type: 'GET_ANALYTICS' }, 
                    [channel.port2]
                );
            } else {
                resolve({ visits: [], interactions: [], skillsMatching: [] });
            }
        });
    }

    // ========================
    // NOTIFICATIONS & UI
    // ========================
    showPWANotification(message) {
        const notification = document.createElement('div');
        notification.className = 'pwa-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-rocket"></i>
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            </div>
        `;

        // Styles inline pour la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
            z-index: 10000;
            font-family: 'Rajdhani', sans-serif;
            animation: slideInRight 0.5s ease;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 5000);

        // Close button
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        });
    }

    showUpdateNotification() {
        const updateBanner = document.createElement('div');
        updateBanner.className = 'update-banner';
        updateBanner.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <span>Une nouvelle version est disponible !</span>
                <button class="update-btn" onclick="window.location.reload()">
                    Actualiser
                </button>
            </div>
        `;

        updateBanner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--accent-color);
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 10000;
            font-family: 'Rajdhani', sans-serif;
            animation: slideInUp 0.5s ease;
        `;

        document.body.appendChild(updateBanner);
    }

    // ========================
    // HEARTBEAT & PERSISTENCE
    // ========================
    startHeartbeat() {
        // Envoie un heartbeat toutes les 30 secondes
        setInterval(() => {
            this.trackInteraction('heartbeat', 'system', {
                isOnline: this.isOnline,
                sessionDuration: Date.now() - this.sessionStart
            });
        }, 30000);
    }

    // ========================
    // STOCKAGE LOCAL
    // ========================
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(`portfolio_analytics_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error('LocalStorage save error:', error);
        }
    }

    getFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(`portfolio_analytics_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('LocalStorage get error:', error);
            return null;
        }
    }

    incrementVisitCount() {
        const count = this.getFromLocalStorage('visitCount') || 0;
        this.saveToLocalStorage('visitCount', count + 1);
    }

    // ========================
    // UTILITAIRES
    // ========================
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        
        if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        return `${seconds}s`;
    }

    // ========================
    // API PUBLIQUE
    // ========================
    async getAnalyticsReport() {
        const data = await this.getAnalytics();
        const localData = {
            visitCount: this.getFromLocalStorage('visitCount') || 0,
            lastVisit: this.getFromLocalStorage('lastVisit'),
            currentSession: {
                duration: Date.now() - this.sessionStart,
                interactions: this.interactions.length,
                sectionsVisited: Array.from(this.sectionTimings.keys())
            }
        };

        return { ...data, local: localData };
    }

    trackCustomEvent(eventName, eventData = {}) {
        this.trackInteraction('custom_event', eventName, {
            customEventName: eventName,
            ...eventData
        });
    }
}

// ========================
// INITIALISATION
// ========================
let portfolioAnalytics;

document.addEventListener('DOMContentLoaded', () => {
    portfolioAnalytics = new PortfolioAnalytics();
    
    // Exposer l'API globalement pour le debugging
    window.portfolioAnalytics = portfolioAnalytics;
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioAnalytics;
}
