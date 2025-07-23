// ========================
// INTERNATIONALIZATION SYSTEM
// ========================

class PortfolioI18n {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.fallbackLanguage = 'fr';
        this.translations = {};
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.setupLanguageSelector();
        this.applyTranslations();
        this.setupLanguageToggle();
        
        console.log(`🌍 I18n initialized with language: ${this.currentLanguage}`);
    }

    // ========================
    // DÉTECTION DE LANGUE
    // ========================
    detectLanguage() {
        // 1. URL parameter (?lang=en)
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.isValidLanguage(urlLang)) {
            return urlLang;
        }

        // 2. LocalStorage
        const savedLang = localStorage.getItem('portfolio_language');
        if (savedLang && this.isValidLanguage(savedLang)) {
            return savedLang;
        }

        // 3. Browser language
        const browserLang = navigator.language.substring(0, 2);
        if (this.isValidLanguage(browserLang)) {
            return browserLang;
        }

        // 4. Fallback
        return this.fallbackLanguage;
    }

    isValidLanguage(lang) {
        return ['fr', 'en'].includes(lang);
    }

    // ========================
    // CHARGEMENT DES TRADUCTIONS
    // ========================
    async loadTranslations() {
        this.isLoading = true;
        
        try {
            // Charger les deux langues pour éviter les requêtes futures
            const [frTranslations, enTranslations] = await Promise.all([
                this.loadLanguageFile('fr'),
                this.loadLanguageFile('en')
            ]);

            this.translations = {
                fr: frTranslations,
                en: enTranslations
            };

        } catch (error) {
            console.error('Failed to load translations:', error);
            // Fallback vers les traductions inline
            this.translations = this.getInlineTranslations();
        }
        
        this.isLoading = false;
    }

    async loadLanguageFile(lang) {
        // Pour l'instant, on utilise des traductions inline
        // Plus tard, on pourra charger depuis des fichiers JSON
        return this.getInlineTranslations()[lang];
    }

    getInlineTranslations() {
        return {
            fr: {
                // Navigation
                'nav.home': 'Accueil',
                'nav.about': 'À propos',
                'nav.skills': 'Compétences',
                'nav.projects': 'Projets',
                'nav.experience': 'Expérience',
                'nav.contact': 'Contact',
                'nav.skills-matching': 'Skills Matching',
                'nav.chatbot': 'Chatbot IA',

                // Hero Section
                'hero.greeting': 'Salut, je suis',
                'hero.name': 'Boubacar DABO',
                'hero.title': 'Étudiant-Ingénieur en Big Data & IA',
                'hero.subtitle': 'Engineering Intelligent Futures',
                'hero.description': 'Passionné par l\'Intelligence Artificielle et la Data Science, je développe des solutions innovantes qui transforment les données en insights stratégiques.',
                'hero.cta.projects': 'Voir mes projets',
                'hero.cta.contact': 'Me contacter',
                'hero.availability': 'Disponible pour un stage à partir de février 2026',

                // À propos
                'about.title': 'À propos de moi',
                'about.subtitle': 'Qui suis-je et quelle est ma mission',
                'about.intro': 'Étudiant-ingénieur passionné par l\'IA',
                'about.description': 'Actuellement en formation d\'ingénieur en Big Data et Intelligence Artificielle à ESIGELEC, je me spécialise dans le développement de solutions IA innovantes. Mon expertise couvre le Machine Learning, le NLP, et la Data Science, avec une approche pratique et orientée résultats.',
                'about.mission': 'Ma mission',
                'about.mission.text': 'Transformer les défis complexes en solutions intelligentes grâce à l\'IA et aux données.',

                // Compétences
                'skills.title': 'Mes Compétences',
                'skills.subtitle': 'Technologies et expertises que je maîtrise',
                'skills.ai.title': 'Intelligence Artificielle',
                'skills.data.title': 'Data Science',
                'skills.dev.title': 'Développement',
                'skills.tools.title': 'Outils & DevOps',

                // Projets
                'projects.title': 'Mes Projets',
                'projects.subtitle': 'Découvrez mes réalisations en IA et Data Science',
                'projects.view': 'Voir le projet',
                'projects.code': 'Voir le code',
                'projects.demo': 'Démo',

                // Skills Matching
                'matching.title': 'Skills Matching',
                'matching.subtitle': 'Analysez la compatibilité de vos besoins avec mes compétences',
                'matching.form.title': 'Vos Besoins',
                'matching.form.domain': 'Domaine d\'activité',
                'matching.form.domain.placeholder': 'Ex: Intelligence Artificielle, Data Science...',
                'matching.form.technologies': 'Technologies recherchées',
                'matching.form.technologies.placeholder': 'Ex: Python, TensorFlow, React...',
                'matching.form.experience': 'Niveau d\'expérience',
                'matching.form.experience.junior': 'Junior (0-2 ans)',
                'matching.form.experience.mid': 'Intermédiaire (2-5 ans)',
                'matching.form.experience.senior': 'Senior (5+ ans)',
                'matching.form.projects': 'Types de projets',
                'matching.form.projects.placeholder': 'Ex: Applications web, systèmes de recommandation...',
                'matching.form.submit': 'Analyser la compatibilité',
                'matching.results.title': 'Résultats de l\'analyse',
                'matching.results.score': 'Score',
                'matching.results.matched': 'Compétences correspondantes',
                'matching.results.missing': 'Compétences à développer',
                'matching.results.bonus': 'Compétences bonus',
                'matching.results.projects': 'Projets pertinents',
                'matching.actions.report': 'Générer un rapport',
                'matching.actions.contact': 'Me contacter',

                // Expérience
                'experience.title': 'Mon Parcours',
                'experience.subtitle': 'Formation et expériences professionnelles',

                // Contact
                'contact.title': 'Contactez-moi',
                'contact.subtitle': 'Discutons de vos projets IA et Data Science',
                'contact.intro': 'Prêt à collaborer ?',
                'contact.description': 'Je suis toujours ouvert aux discussions sur l\'IA, la Data Science et les opportunités de stage. N\'hésitez pas à me contacter !',
                'contact.stage': 'Recherche de stage - Février 2026',
                'contact.email': 'Email',
                'contact.linkedin': 'LinkedIn',
                'contact.github': 'GitHub',

                // Chatbot
                'chatbot.title': 'Assistant IA',
                'chatbot.welcome': 'Bonjour ! Je suis l\'assistant IA de Boubacar. Comment puis-je vous aider ?',
                'chatbot.placeholder': 'Posez votre question...',
                'chatbot.send': 'Envoyer',

                // Footer
                'footer.rights': 'Tous droits réservés.',
                'footer.made': 'Fait avec',
                'footer.by': 'par Boubacar DABO',

                // Notifications
                'notifications.pwa.ready': 'Portfolio prêt pour consultation offline ! 🚀',
                'notifications.update.available': 'Une nouvelle version est disponible !',
                'notifications.update.button': 'Actualiser',

                // Accessibility
                'accessibility.menu': 'Menu de navigation',
                'accessibility.close': 'Fermer',
                'accessibility.external': 'Lien externe',

                // Dates et temps
                'time.now': 'maintenant',
                'time.minutes': 'minutes',
                'time.hours': 'heures',
                'time.days': 'jours',
            },

            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.about': 'About',
                'nav.skills': 'Skills',
                'nav.projects': 'Projects',
                'nav.experience': 'Experience',
                'nav.contact': 'Contact',
                'nav.skills-matching': 'Skills Matching',
                'nav.chatbot': 'AI Chatbot',

                // Hero Section
                'hero.greeting': 'Hi, I\'m',
                'hero.name': 'Boubacar DABO',
                'hero.title': 'Engineering Student in Big Data & AI',
                'hero.subtitle': 'Engineering Intelligent Futures',
                'hero.description': 'Passionate about Artificial Intelligence and Data Science, I develop innovative solutions that transform data into strategic insights.',
                'hero.cta.projects': 'View my projects',
                'hero.cta.contact': 'Contact me',
                'hero.availability': 'Available for internship from February 2026',

                // About
                'about.title': 'About Me',
                'about.subtitle': 'Who I am and what my mission is',
                'about.intro': 'AI-passionate engineering student',
                'about.description': 'Currently studying Big Data and Artificial Intelligence Engineering at ESIGELEC, I specialize in developing innovative AI solutions. My expertise covers Machine Learning, NLP, and Data Science, with a practical and results-oriented approach.',
                'about.mission': 'My mission',
                'about.mission.text': 'Transform complex challenges into intelligent solutions through AI and data.',

                // Skills
                'skills.title': 'My Skills',
                'skills.subtitle': 'Technologies and expertise I master',
                'skills.ai.title': 'Artificial Intelligence',
                'skills.data.title': 'Data Science',
                'skills.dev.title': 'Development',
                'skills.tools.title': 'Tools & DevOps',

                // Projects
                'projects.title': 'My Projects',
                'projects.subtitle': 'Discover my achievements in AI and Data Science',
                'projects.view': 'View project',
                'projects.code': 'View code',
                'projects.demo': 'Demo',

                // Skills Matching
                'matching.title': 'Skills Matching',
                'matching.subtitle': 'Analyze compatibility between your needs and my skills',
                'matching.form.title': 'Your Requirements',
                'matching.form.domain': 'Activity domain',
                'matching.form.domain.placeholder': 'Ex: Artificial Intelligence, Data Science...',
                'matching.form.technologies': 'Required technologies',
                'matching.form.technologies.placeholder': 'Ex: Python, TensorFlow, React...',
                'matching.form.experience': 'Experience level',
                'matching.form.experience.junior': 'Junior (0-2 years)',
                'matching.form.experience.mid': 'Intermediate (2-5 years)',
                'matching.form.experience.senior': 'Senior (5+ years)',
                'matching.form.projects': 'Project types',
                'matching.form.projects.placeholder': 'Ex: Web applications, recommendation systems...',
                'matching.form.submit': 'Analyze compatibility',
                'matching.results.title': 'Analysis Results',
                'matching.results.score': 'Score',
                'matching.results.matched': 'Matching skills',
                'matching.results.missing': 'Skills to develop',
                'matching.results.bonus': 'Bonus skills',
                'matching.results.projects': 'Relevant projects',
                'matching.actions.report': 'Generate report',
                'matching.actions.contact': 'Contact me',

                // Experience
                'experience.title': 'My Journey',
                'experience.subtitle': 'Education and professional experience',

                // Contact
                'contact.title': 'Contact Me',
                'contact.subtitle': 'Let\'s discuss your AI and Data Science projects',
                'contact.intro': 'Ready to collaborate?',
                'contact.description': 'I\'m always open to discussions about AI, Data Science, and internship opportunities. Feel free to contact me!',
                'contact.stage': 'Looking for internship - February 2026',
                'contact.email': 'Email',
                'contact.linkedin': 'LinkedIn',
                'contact.github': 'GitHub',

                // Chatbot
                'chatbot.title': 'AI Assistant',
                'chatbot.welcome': 'Hello! I\'m Boubacar\'s AI assistant. How can I help you?',
                'chatbot.placeholder': 'Ask your question...',
                'chatbot.send': 'Send',

                // Footer
                'footer.rights': 'All rights reserved.',
                'footer.made': 'Made with',
                'footer.by': 'by Boubacar DABO',

                // Notifications
                'notifications.pwa.ready': 'Portfolio ready for offline consultation! 🚀',
                'notifications.update.available': 'A new version is available!',
                'notifications.update.button': 'Refresh',

                // Accessibility
                'accessibility.menu': 'Navigation menu',
                'accessibility.close': 'Close',
                'accessibility.external': 'External link',

                // Time and dates
                'time.now': 'now',
                'time.minutes': 'minutes',
                'time.hours': 'hours',
                'time.days': 'days',
            }
        };
    }

    // ========================
    // TRADUCTION
    // ========================
    t(key, params = {}) {
        const translation = this.translations[this.currentLanguage]?.[key] || 
                          this.translations[this.fallbackLanguage]?.[key] || 
                          key;

        // Remplacer les paramètres {{param}}
        return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
            return params[param] || match;
        });
    }

    // ========================
    // APPLICATION DES TRADUCTIONS
    // ========================
    applyTranslations() {
        // Éléments avec attribut data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else if (element.hasAttribute('placeholder')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Titre de la page
        const titleKey = document.documentElement.getAttribute('data-i18n-title');
        if (titleKey) {
            document.title = this.t(titleKey);
        }

        // Meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        const descKey = metaDesc?.getAttribute('data-i18n');
        if (metaDesc && descKey) {
            metaDesc.content = this.t(descKey);
        }

        // Attributs aria-label
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            element.setAttribute('aria-label', this.t(key));
        });

        // Mettre à jour l'attribut lang du HTML
        document.documentElement.lang = this.currentLanguage;
    }

    // ========================
    // SÉLECTEUR DE LANGUE
    // ========================
    setupLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.value = this.currentLanguage;
            selector.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
    }

    setupLanguageToggle() {
        const toggle = document.getElementById('language-toggle');
        if (toggle) {
            this.updateLanguageToggle(toggle);
            
            toggle.addEventListener('click', () => {
                const newLang = this.currentLanguage === 'fr' ? 'en' : 'fr';
                this.changeLanguage(newLang);
            });
        }
    }

    updateLanguageToggle(toggle) {
        const flagIcon = toggle.querySelector('.flag-icon');
        const langText = toggle.querySelector('.lang-text');
        
        if (flagIcon) {
            flagIcon.textContent = this.currentLanguage === 'fr' ? '🇫🇷' : '🇺🇸';
        }
        
        if (langText) {
            langText.textContent = this.currentLanguage.toUpperCase();
        }
        
        toggle.title = this.currentLanguage === 'fr' ? 'Switch to English' : 'Passer en français';
    }

    // ========================
    // CHANGEMENT DE LANGUE
    // ========================
    async changeLanguage(newLang) {
        if (!this.isValidLanguage(newLang) || newLang === this.currentLanguage) {
            return;
        }

        const oldLang = this.currentLanguage;
        this.currentLanguage = newLang;

        // Sauvegarder la préférence
        localStorage.setItem('portfolio_language', newLang);

        // Mettre à jour l'URL sans recharger
        const url = new URL(window.location);
        url.searchParams.set('lang', newLang);
        window.history.replaceState(null, '', url);

        // Appliquer les traductions
        this.applyTranslations();
        this.updateLanguageToggle(document.getElementById('language-toggle'));

        // Animation de transition
        this.animateLanguageChange(oldLang, newLang);

        // Événement personnalisé
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { oldLang, newLang }
        }));

        // Analytics
        if (window.portfolioAnalytics) {
            window.portfolioAnalytics.trackCustomEvent('language_change', {
                from: oldLang,
                to: newLang
            });
        }

        console.log(`🌍 Language changed from ${oldLang} to ${newLang}`);
    }

    animateLanguageChange(oldLang, newLang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.animation = 'fadeInUp 0.3s ease';
            }, index * 10);
        });
    }

    // ========================
    // FORMATAGE SELON LA LOCALE
    // ========================
    formatDate(date, options = {}) {
        const locale = this.currentLanguage === 'fr' ? 'fr-FR' : 'en-US';
        return new Intl.DateTimeFormat(locale, options).format(date);
    }

    formatNumber(number, options = {}) {
        const locale = this.currentLanguage === 'fr' ? 'fr-FR' : 'en-US';
        return new Intl.NumberFormat(locale, options).format(number);
    }

    formatCurrency(amount, currency = 'EUR') {
        const locale = this.currentLanguage === 'fr' ? 'fr-FR' : 'en-US';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency
        }).format(amount);
    }

    // ========================
    // UTILITAIRES
    // ========================
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    isRTL() {
        // Pour l'instant, nous ne supportons que des langues LTR
        return false;
    }
}

// ========================
// INITIALISATION
// ========================
let portfolioI18n;

document.addEventListener('DOMContentLoaded', async () => {
    portfolioI18n = new PortfolioI18n();
    window.portfolioI18n = portfolioI18n;
});

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioI18n;
}
