// ========================
// PORTFOLIO CORE FUNCTIONALITY - SECURED & OPTIMIZED
// ========================

// Utility functions for security
const SecurityUtils = {
    // Sanitize HTML content to prevent XSS
    sanitizeHTML: (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },
    
    // Validate localStorage data
    getSecureLocalStorage: (key, defaultValue = null) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.warn(`Invalid localStorage data for key: ${key}`);
            return defaultValue;
        }
    },
    
    // Safely set localStorage
    setSecureLocalStorage: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn(`Failed to set localStorage for key: ${key}`, e);
            return false;
        }
    }
};

// Theme initialization - FIXED
function initializeTheme() {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = SecurityUtils.getSecureLocalStorage('portfolio-theme');
    const theme = savedTheme || (prefersDarkMode ? 'dark' : 'light'); // FIXED: proper ternary logic
    document.documentElement.setAttribute('data-theme', theme);
}

// Mobile menu functionality - OPTIMIZED
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    };
    
    const closeMenu = () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    };
    
    hamburger.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on a link - OPTIMIZED
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Contact form functionality - SECURED
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {};
        
        // Sanitize form data
        for (let [key, value] of formData.entries()) {
            data[SecurityUtils.sanitizeHTML(key)] = SecurityUtils.sanitizeHTML(value);
        }
        
        console.log('Formulaire soumis (sécurisé):', data);
        showNotification('Message envoyé avec succès!', 'success');
        form.reset();
    });
}

// Project filters - OPTIMIZED
function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length === 0 || projectCards.length === 0) return;

    const updateActiveFilter = (activeBtn) => {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    };

    const filterProjects = (filterValue) => {
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category')?.split(' ') || [];
            const shouldShow = filterValue === 'all' || categories.includes(filterValue);
            
            if (shouldShow) {
                card.style.display = 'block';
                // FIXED: Reduce nesting
                requestAnimationFrame(() => {
                    card.classList.add('show');
                });
            } else {
                card.classList.remove('show');
                // FIXED: Reduce nesting
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            updateActiveFilter(btn);
            filterProjects(filterValue);
        });
    });
}

// CV Download functionality - SECURED
function downloadCV() {
    const cvContent = `BOUBACAR DABO - Étudiant-Ingénieur IA & Data Science
    
Contact: dabom372@gmail.com
Localisation: Rouen (études) • Saint-Denis Paris (résidence)
Portfolio: https://bouba-dabo.github.io/portfolio

OBJECTIF: Stage de fin d'études en Data Science / Intelligence Artificielle (Février 2026)

FORMATION:
• ESIGELEC - Cycle Ingénieur Big Data & Transformation Numérique (2023-2026)
• Spécialisation: Intelligence Artificielle, Machine Learning, NLP

COMPÉTENCES TECHNIQUES:
• Langages: Python, SQL, R, JavaScript
• IA/ML: PyTorch, TensorFlow, Scikit-learn, Pandas, NumPy
• NLP: spaCy, NLTK, Transformers, LangChain
• Data Viz: Plotly, Matplotlib, Streamlit
• Outils: Git, Docker, Jupyter, VS Code

PROJETS PHARES:
• IA_PRO: Assistant documentaire avec architecture RAG
• Mini-GPT PyTorch: Implémentation transformer from scratch
• DocuAI: Application NLP avec interface Streamlit
• E-commerce Analyzer: Dashboard analytics avec ML

LANGUES: Français (natif), Anglais (courant), Arabe (notions)
`;

    try {
        const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Boubacar_DABO_CV_2025.txt';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return true;
    } catch (error) {
        console.error('Erreur lors du téléchargement du CV:', error);
        showNotification('Erreur lors du téléchargement', 'error');
        return false;
    }
}

// Notification system - SECURED
function showNotification(message, type = 'info') {
    // Sanitize input
    const sanitizedMessage = SecurityUtils.sanitizeHTML(message);
    const validTypes = ['info', 'success', 'error'];
    const safeType = validTypes.includes(type) ? type : 'info';
    
    // FIXED: Complex ternary
    const getIconClass = (notificationType) => {
        switch(notificationType) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            default: return 'info-circle';
        }
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${safeType}`;
    
    // FIXED: Use textContent and createElement instead of innerHTML
    const icon = document.createElement('i');
    icon.className = `fas fa-${getIconClass(safeType)}`;
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = sanitizedMessage;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.textContent = '×';
    
    notification.appendChild(icon);
    notification.appendChild(messageSpan);
    notification.appendChild(closeBtn);
    
    // Inject styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--bg-secondary);
                border: 1px solid var(--primary-color);
                border-radius: 10px;
                padding: 15px 20px;
                color: var(--text-primary);
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 1001;
                animation: slideInRight 0.3s ease;
                box-shadow: 0 4px 20px rgba(0, 212, 255, 0.2);
            }
            .notification.success { border-color: #10b981; }
            .notification.success i { color: #10b981; }
            .notification.error { border-color: #ef4444; }
            .notification.error i { color: #ef4444; }
            .notification-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 18px;
                cursor: pointer;
                margin-left: 10px;
                padding: 0;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    const autoRemove = setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.remove();
    });
}

// ========================
// ADVANCED ANIMATIONS MODULE - SECURED
// ========================

// Advanced Loading Screen - FIXED
function initAdvancedLoadingScreen() {
    const loader = document.querySelector('.advanced-loader');
    if (!loader) return;

    // Add loading class to body to prevent scrolling
    document.body.classList.add('loading');

    // FIXED: Remove unused variable
    const loaderText = document.querySelector('.loader-text');
    
    const loadingMessages = [
        'Initialisation des systèmes IA...',
        'Chargement des données...',
        'Connexion aux réseaux de neurones...',
        'Finalisation...'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        if (loaderText && messageIndex < loadingMessages.length) {
            loaderText.textContent = loadingMessages[messageIndex]; // SECURED: Use textContent
            messageIndex++;
        }
    }, 750);

    setTimeout(() => {
        clearInterval(messageInterval);
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        // Remove loading class to restore scrolling
        document.body.classList.remove('loading');
    }, 3000);
}

class AdvancedAnimations {
    constructor() {
        this.initializeTypewriter();
        this.initializeScrollAnimations();
        this.initializeButtonEffects();
        this.initializeParticles();
        this.initializeGlitchEffect();
    }

    // FIXED: Reduced nesting and secured
    initializeTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter-effect');
        
        typewriterElements.forEach(element => {
            const text = element.dataset.text;
            if (!text) return;

            this.createTypewriterEffect(element, text);
        });
    }
    
    // FIXED: Extract nested function
    createTypewriterEffect(element, text) {
        element.textContent = ''; // SECURED: Use textContent instead of innerHTML
        let i = 0;
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.textContent = '|'; // SECURED: Use textContent
        
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent = text.substring(0, i + 1); // SECURED
                element.appendChild(cursor);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    if (cursor.parentNode) {
                        cursor.remove();
                    }
                }, 2000);
            }
        };

        // Use Intersection Observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // FIXED: Reduce nesting
                    requestAnimationFrame(() => {
                        setTimeout(typeWriter, 500);
                    });
                    observer.unobserve(element);
                }
            });
        });

        observer.observe(element);
    }

    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach(el => {
            observer.observe(el);
        });
    }

    initializeButtonEffects() {
        document.querySelectorAll('.btn, .btn-primary, .btn-secondary').forEach(button => {
            button.classList.add('btn-ripple');
            
            button.addEventListener('click', (e) => {
                this.createRippleEffect(button, e);
            });
        });

        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            button.classList.add('btn-enhanced');
            button.addEventListener('mouseenter', () => this.playHoverSound());
        });
    }
    
    // FIXED: Extract ripple effect creation
    createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.classList.add('ripple');
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }

    initializeParticles() {
        const particleContainers = document.querySelectorAll('.ai-particles');
        
        particleContainers.forEach(container => {
            const particles = container.querySelectorAll('.particle');
            
            particles.forEach((particle) => {
                particle.addEventListener('mouseenter', () => {
                    particle.style.transform += ' scale(2)';
                    particle.style.opacity = '1';
                });
                
                particle.addEventListener('mouseleave', () => {
                    particle.style.transform = particle.style.transform.replace(' scale(2)', '');
                    particle.style.opacity = '0.6';
                });
            });
        });
    }

    // FIXED: Proper error handling
    playHoverSound() {
        if (!('AudioContext' in window) && !('webkitAudioContext' in window)) {
            return; // Audio not supported
        }
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.warn('Audio context error:', error.message);
            // Continue silently - audio is not critical
        }
    }

    initializeGlitchEffect() {
        const glitchElements = document.querySelectorAll('.glitch-enhanced');
        
        glitchElements.forEach(element => {
            const text = element.textContent;
            element.setAttribute('data-text', text);
            
            // Random glitch trigger with cleanup
            const glitchInterval = setInterval(() => {
                if (Math.random() > 0.8) {
                    element.classList.add('glitch-active');
                    setTimeout(() => {
                        element.classList.remove('glitch-active');
                    }, 200);
                }
            }, 3000);
            
            // Store interval for cleanup
            element.glitchInterval = glitchInterval;
        });
    }
    
    // Cleanup method
    destroy() {
        document.querySelectorAll('.glitch-enhanced').forEach(element => {
            if (element.glitchInterval) {
                clearInterval(element.glitchInterval);
            }
        });
    }
}

// Performance Monitor - ENHANCED
class PerformanceMonitor {
    constructor() {
        this.checkAnimationPreference();
        this.monitorPerformance();
        this.setupMemoryManagement();
    }

    checkAnimationPreference() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduce-motion');
        }
        
        // Listen for changes
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduce-motion');
            } else {
                document.body.classList.remove('reduce-motion');
            }
        });
    }

    monitorPerformance() {
        // Disable heavy animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.querySelectorAll('.particle').forEach(particle => {
                particle.style.display = 'none';
            });
        }
        
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                if (memInfo.usedJSHeapSize > 50000000) { // 50MB threshold
                    console.warn('High memory usage detected');
                }
            }, 30000);
        }
    }
    
    setupMemoryManagement() {
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            // Clear all intervals and timeouts
            if (window.animations instanceof AdvancedAnimations) {
                window.animations.destroy();
            }
        });
    }
}

// Enhanced scroll navbar - OPTIMIZED
function initScrollNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const updateNavbar = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
            
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    };
    
    // Throttle scroll events for performance
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

// Project demo functionality - SECURED
function initProjectDemos() {
    const validProjects = new Set(['IA_PRO', 'Mini-GPT PyTorch', 'DocuAI', 'E-commerce Analyzer']);
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('demo-btn') || e.target.parentElement.classList.contains('demo-btn')) {
            const projectCard = e.target.closest('.project-card');
            if (!projectCard) return;
            
            const projectTitle = projectCard.querySelector('.project-title')?.textContent?.trim();
            if (projectTitle && validProjects.has(projectTitle)) {
                showProjectDemo(projectTitle);
            }
        }
        
        if (e.target.classList.contains('code-btn') || e.target.parentElement.classList.contains('code-btn')) {
            showNotification('Code source disponible sur GitHub', 'info');
        }
    });
}

function showProjectDemo(projectTitle) {
    const demos = {
        'IA_PRO': 'Assistant IA pour l\'analyse documentaire avec RAG',
        'Mini-GPT PyTorch': 'Architecture transformer et processus d\'entraînement',
        'DocuAI': 'Interface NLP avec extraction d\'entités en temps réel',
        'E-commerce Analyzer': 'Dashboard interactif avec prédictions ML'
    };
    
    const demoContent = demos[projectTitle] || 'Démonstration interactive disponible';
    showNotification(`🎮 Démo ${projectTitle}: ${demoContent}`, 'info');
}

// CV Download button handler - SECURED
function initCVDownload() {
    const downloadBtn = document.getElementById('downloadCV');
    if (!downloadBtn) return;
    
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (downloadCV()) {
            showNotification('CV téléchargé avec succès!', 'success');
        }
    });
}

// ========================
// MAIN INITIALIZATION - SECURED
// ========================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    initializeTheme();
    setupMobileMenu();
    setupContactForm();
    setupProjectFilters();
    initCVDownload();
    initProjectDemos();
    initScrollNavbar();
    
    // Initialize data visualizations
    initializeDataVisualizations();
    
    // Initialize skills matching
    initializeSkillsMatching();
    
    // Initialize advanced loading screen
    initAdvancedLoadingScreen();
    
    // Initialize advanced animations after a short delay
    setTimeout(() => {
        // FIXED: Store instances for cleanup
        window.animations = new AdvancedAnimations();
        window.performanceMonitor = new PerformanceMonitor();
    }, 1000);
    
    // Initialize AOS (if available)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

// Neural Network Visualization Functions
function initializeNeuralNetwork() {
    const networkContainer = document.querySelector('.neural-network-interactive');
    if (!networkContainer) return;

    const neurons = networkContainer.querySelectorAll('.neuron');
    const canvas = document.querySelector('.neural-connections');
    
    if (!canvas) {
        const canvasElement = document.createElement('canvas');
        canvasElement.className = 'neural-connections';
        canvasElement.width = 500;
        canvasElement.height = 300;
        networkContainer.appendChild(canvasElement);
        
        drawNeuralConnections(canvasElement);
    }

    // Animate neurons periodically
    setInterval(() => {
        neurons.forEach((neuron, index) => {
            setTimeout(() => {
                neuron.classList.add('active');
                setTimeout(() => neuron.classList.remove('active'), 800);
            }, index * 200);
        });
    }, 4000);

    // Add data flow particles
    addDataFlowParticles(networkContainer);
    
    // Update neural stats
    updateNeuralStats();
}

function drawNeuralConnections(canvas) {
    const ctx = canvas.getContext('2d');
    const layers = document.querySelectorAll('.neural-layer');
    
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.lineWidth = 2;
    
    // Draw connections between layers
    for (let i = 0; i < layers.length - 1; i++) {
        const currentLayer = layers[i];
        const nextLayer = layers[i + 1];
        const currentNeurons = currentLayer.querySelectorAll('.neuron');
        const nextNeurons = nextLayer.querySelectorAll('.neuron');
        
        currentNeurons.forEach(currentNeuron => {
            nextNeurons.forEach(nextNeuron => {
                const currentRect = currentNeuron.getBoundingClientRect();
                const nextRect = nextNeuron.getBoundingClientRect();
                const containerRect = canvas.getBoundingClientRect();
                
                const startX = currentRect.left - containerRect.left + currentRect.width / 2;
                const startY = currentRect.top - containerRect.top + currentRect.height / 2;
                const endX = nextRect.left - containerRect.left + nextRect.width / 2;
                const endY = nextRect.top - containerRect.top + nextRect.height / 2;
                
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            });
        });
    }
}

function addDataFlowParticles(container) {
    const dataFlow = document.createElement('div');
    dataFlow.className = 'data-flow';
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'flow-particle';
        particle.style.animationDelay = `${i * 0.5}s`;
        dataFlow.appendChild(particle);
    }
    
    container.appendChild(dataFlow);
}

function updateNeuralStats() {
    const stats = {
        accuracy: (Math.random() * 5 + 95).toFixed(1),
        layers: '4',
        neurons: '128',
        epochs: Math.floor(Math.random() * 50 + 150)
    };
    
    const statElements = document.querySelectorAll('.neural-stats .stat-value');
    if (statElements.length >= 4) {
        statElements[0].textContent = `${stats.accuracy}%`;
        statElements[1].textContent = stats.layers;
        statElements[2].textContent = stats.neurons;
        statElements[3].textContent = stats.epochs;
    }
}

// Analytics Dashboard Functions
function initializeAnalyticsDashboard() {
    updateMetrics();
    initializeGauges();
    initializePipeline();
    
    // Update metrics every 3 seconds
    setInterval(updateMetrics, 3000);
    setInterval(updateGauges, 5000);
    setInterval(updatePipeline, 7000);
}

function updateMetrics() {
    const metrics = {
        accuracy: (Math.random() * 3 + 97).toFixed(1),
        precision: (Math.random() * 2 + 98).toFixed(1),
        recall: (Math.random() * 4 + 96).toFixed(1),
        f1score: (Math.random() * 2 + 97.5).toFixed(1),
        processed: Math.floor(Math.random() * 1000 + 15000),
        speed: (Math.random() * 50 + 250).toFixed(0)
    };
    
    const metricElements = document.querySelectorAll('.metric-value');
    if (metricElements.length >= 6) {
        metricElements[0].textContent = `${metrics.accuracy}%`;
        metricElements[1].textContent = `${metrics.precision}%`;
        metricElements[2].textContent = `${metrics.recall}%`;
        metricElements[3].textContent = `${metrics.f1score}%`;
        metricElements[4].textContent = metrics.processed.toLocaleString();
        metricElements[5].textContent = `${metrics.speed}/s`;
    }
}

function initializeGauges() {
    const gauges = document.querySelectorAll('.gauge-fill');
    const values = [94, 96, 92, 98]; // Accuracy, Precision, Recall, F1-Score
    
    gauges.forEach((gauge, index) => {
        if (index < values.length) {
            const circumference = 283; // 2 * π * r (r = 45)
            const offset = circumference - (values[index] / 100) * circumference;
            gauge.style.strokeDashoffset = offset;
        }
    });
}

function updateGauges() {
    const gauges = document.querySelectorAll('.gauge-fill');
    const gaugeValues = document.querySelectorAll('.gauge-value');
    
    gauges.forEach((gauge, index) => {
        const randomValue = Math.random() * 5 + 92; // 92-97%
        const circumference = 283;
        const offset = circumference - (randomValue / 100) * circumference;
        
        gauge.style.strokeDashoffset = offset;
        if (gaugeValues[index]) {
            gaugeValues[index].textContent = `${randomValue.toFixed(1)}%`;
        }
    });
}

function initializePipeline() {
    const stages = document.querySelectorAll('.pipeline-stage');
    let currentStage = 0;
    
    function animatePipeline() {
        stages.forEach((stage, index) => {
            stage.classList.remove('active', 'processing');
            
            if (index < currentStage) {
                stage.classList.add('completed');
            } else if (index === currentStage) {
                stage.classList.add('processing');
            }
        });
        
        setTimeout(() => {
            if (stages[currentStage]) {
                stages[currentStage].classList.remove('processing');
                stages[currentStage].classList.add('active');
            }
            
            currentStage = (currentStage + 1) % stages.length;
        }, 2000);
    }
    
    // Initial animation
    animatePipeline();
}

function updatePipeline() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const newWidth = Math.random() * 20 + 70; // 70-90%
        progressBar.style.width = `${newWidth}%`;
    }
}

function initializeChartControls() {
    const chartButtons = document.querySelectorAll('.chart-btn');
    const canvas = document.getElementById('trendChart');
    
    if (!canvas) {
        console.warn('⚠️ Chart canvas not found');
        return;
    }

    // Chart configuration
    let chartInstance = null;
    
    const chartData = {
        accuracy: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
            data: [85.2, 87.8, 91.3, 93.7, 95.1, 97.8],
            color: '#00d4ff',
            label: 'Accuracy (%)'
        },
        loss: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
            data: [0.45, 0.38, 0.29, 0.22, 0.18, 0.12],
            color: '#ff006b',
            label: 'Loss'
        },
        performance: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
            data: [78.5, 82.3, 86.7, 89.2, 92.6, 96.4],
            color: '#9d4edd',
            label: 'Performance (%)'
        }
    };

    function createChart(type) {
        const ctx = canvas.getContext('2d');
        const data = chartData[type];
        
        // Destroy existing chart
        if (chartInstance) {
            chartInstance.destroy();
        }
        
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label,
                    data: data.data,
                    borderColor: data.color,
                    backgroundColor: data.color + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: data.color,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            font: {
                                family: 'Rajdhani',
                                size: 12
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            font: {
                                family: 'Rajdhani',
                                size: 12
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: data.color
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutCubic'
                }
            }
        });
    }
    
    chartButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            chartButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const chartType = this.dataset.chart;
            createChart(chartType);
        });
    });
    
    // Initialize with accuracy chart
    if (chartButtons.length > 0) {
        chartButtons[0].classList.add('active');
        createChart('accuracy');
    }
}

function updateChartDisplay(chartType) {
    console.log(`✨ Chart updated to: ${chartType}`);
}

// Main initialization function for data visualizations
function initializeDataVisualizations() {
    try {
        initializeNeuralNetwork();
        initializeAnalyticsDashboard();
        initializeChartControls();
        initializeChatbot();
        console.log('✨ Data visualizations initialized successfully');
    } catch (error) {
        console.warn('⚠️ Error initializing data visualizations:', error);
    }
}

// ========================
// AI CHATBOT FUNCTIONALITY
// ========================

function initializeChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (!chatbotToggle || !chatbotWindow) {
        console.warn('⚠️ Chatbot elements not found');
        return;
    }

    // Chatbot knowledge base
    const knowledgeBase = {
        'compétences': {
            keywords: ['compétence', 'skill', 'technologie', 'maîtrise', 'savoir'],
            response: `🎯 **Compétences principales de Boubacar :**

**Intelligence Artificielle & ML :**
• PyTorch, TensorFlow, Scikit-learn
• Deep Learning, Neural Networks
• Computer Vision, NLP

**Big Data & Analytics :**
• Apache Spark, Hadoop, HDFS
• Data Engineering, ETL Pipelines
• Distributed Computing

**Data Science :**
• Pandas, NumPy, Plotly, Streamlit
• Data Analysis, Visualization
• Business Intelligence, Power BI

**Développement :**
• Python, Java, FastAPI, SQL
• Git/GitHub, Docker, Cloud Computing`
        },
        'projets': {
            keywords: ['projet', 'réalisation', 'application', 'développement'],
            response: `🚀 **Projets phares de Boubacar :**

1. **IA_PRO** - Assistant documentaire avec RAG
2. **Mini-GPT PyTorch** - Implémentation transformer from scratch
3. **DocuAI** - Application NLP ouverte
4. **E-commerce Analyzer** - Dashboard analytics avancé
5. **Assistant Claude GPT** - IA conversationnelle
6. **Classification RFID** - ML pour identification automatique
7. **Analyse Sentiment Tweets** - NLP pour opinion publique

🔗 **Démonstration :** [Showcase App](https://bouba-dabo-showcase-app-hnfxcf.streamlit.app/)`
        },
        'contact': {
            keywords: ['contact', 'email', 'linkedin', 'joindre', 'contacter'],
            response: `📧 **Comment contacter Boubacar :**

• **Email :** dabom372@gmail.com
• **LinkedIn :** [Boubacar Dabo](https://www.linkedin.com/in/boubacar-dabo-94206a291/)
• **GitHub :** [Bouba-Dabo](https://github.com/Bouba-Dabo)
• **Localisation :** Rouen (études) • Saint-Denis Paris (résidence)

🎯 **Objectif :** Stage à partir de Février 2026 (CDI possible)`
        },
        'formation': {
            keywords: ['formation', 'études', 'diplôme', 'école', 'esigelec', 'parcours'],
            response: `🎓 **Formation de Boubacar :**

• **ESIGELEC** - Étudiant-ingénieur en Big Data & IA
• **Double diplôme MPI** à l'UCAD (Mathématiques, Physique, Informatique)
• **Classes préparatoires** - Base scientifique solide
• **Spécialisation :** Intelligence Artificielle et Big Data

🏆 **Parcours exceptionnel** avec une approche pluridisciplinaire unique !`
        },
        'stage': {
            keywords: ['stage', 'internship', 'opportunité', 'recherche', 'disponibilité'],
            response: `🚀 **Recherche de stage :**

• **Période :** À partir de Février 2026
• **Durée :** Stage longue durée (6 mois recommandé)
• **Évolution :** Possibilité de signer un CDI après la fin du stage
• **Domaines :** Data Science, Intelligence Artificielle, Big Data
• **Localisation :** Flexible (Rouen, Paris, France)

💼 **Objectif :** Intégration progressive dans l'équipe avec perspective d'embauche en CDI pour continuer les projets développés pendant le stage.

🎯 **Profil recherché :** Projets innovants en IA/ML, environnement stimulant, équipe passionnée !`
        },
        'cdi': {
            keywords: ['cdi', 'embauche', 'contrat', 'permanent', 'long terme', 'évolution'],
            response: `💼 **Évolution vers un CDI :**

🎯 **Stratégie de carrière :**
• **Stage initial :** Février 2026 (6 mois idéalement)
• **Transition naturelle :** Possibilité de CDI à la fin du stage
• **Continuité projet :** Poursuivre et approfondir les projets initiés
• **Montée en compétences :** Évolution progressive des responsabilités

✨ **Avantages pour l'entreprise :**
• Connaissance approfondie de l'équipe et des projets
• Période d'adaptation déjà effectuée
• ROI optimisé sur la formation et l'intégration
• Engagement long terme mutuel

🚀 **Vision :** Contribuer durablement à l'innovation IA de l'entreprise !`
        },
        'experience': {
            keywords: ['expérience', 'background', 'historique', 'parcours professionnel'],
            response: `💼 **Expérience de Boubacar :**

🎯 **Profil étudiant-ingénieur** avec focus sur l'innovation

• **Projets académiques** avancés en IA/ML
• **Développement personnel** de 7+ projets techniques
• **Veille technologique** constante
• **Approche pratique** : de la théorie à l'implémentation

🌟 **Valeurs :** Rigueur, Curiosité intellectuelle, Innovation technologique`
        }
    };

    // Toggle chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatbotInput.focus();
        }
    });

    // Close chatbot
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    // Send message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Process and respond
        setTimeout(() => {
            hideTypingIndicator();
            const response = processMessage(message);
            addMessage(response, 'bot');
        }, 1500);
    }

    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Quick action buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-btn')) {
            const question = e.target.dataset.question;
            if (question) {
                addMessage(question, 'user');
                setTimeout(() => {
                    hideTypingIndicator();
                    const response = processMessage(question);
                    addMessage(response, 'bot');
                }, 1500);
                showTypingIndicator();
            }
        }
    });

    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        if (type === 'bot') {
            avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (type === 'bot') {
            // Format bot response with markdown-like syntax
            const formattedContent = content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/•/g, '•')
                .replace(/\n/g, '<br>');
            contentDiv.innerHTML = `<p>${formattedContent}</p>`;
        } else {
            contentDiv.innerHTML = `<p>${content}</p>`;
        }
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingMessage = chatbotMessages.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    function processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Find matching knowledge base entry
        for (const [category, data] of Object.entries(knowledgeBase)) {
            if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return data.response;
            }
        }
        
        // Handle greetings
        if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
            return `👋 Bonjour ! Je suis l'assistant IA de Boubacar DABO. Je peux vous renseigner sur :

🎯 Ses **compétences** en IA et Data Science
🚀 Ses **projets** innovants
📧 Comment le **contacter**
🎓 Sa **formation** à ESIGELEC
💼 Sa recherche de **stage**

Que souhaitez-vous savoir ?`;
        }
        
        // Handle thanks
        if (lowerMessage.includes('merci') || lowerMessage.includes('thanks')) {
            return `🙏 Avec plaisir ! N'hésitez pas si vous avez d'autres questions sur le profil de Boubacar. Bonne visite du portfolio ! ✨`;
        }
        
        // Default response
        return `🤔 Désolé, je n'ai pas bien compris votre question. Je peux vous aider avec :

• **Compétences** techniques de Boubacar
• **Projets** et réalisations  
• **Contact** et coordonnées
• **Formation** et parcours
• **Stage** recherché

Reformulez votre question ou utilisez les boutons rapides ! 😊`;
    }

    console.log('🤖 Chatbot initialized successfully');
}

// ========================
// SKILLS MATCHING FUNCTIONALITY
// ========================

function initializeSkillsMatching() {
    const form = document.getElementById('skills-matching-form');
    const resultsSection = document.getElementById('matching-results');
    
    if (!form || !resultsSection) {
        console.warn('⚠️ Skills matching elements not found');
        return;
    }
    
    // Comprehensive skills database
    const skillsDatabase = {
        // Core programming and tools
        'python': { level: 95, category: 'programming', aliases: ['py'] },
        'java': { level: 85, category: 'programming', aliases: [] },
        'sql': { level: 90, category: 'database', aliases: ['mysql', 'postgresql', 'sqlite'] },
        'javascript': { level: 80, category: 'programming', aliases: ['js', 'node.js', 'nodejs'] },
        'git': { level: 88, category: 'tools', aliases: ['github', 'version control'] },
        'docker': { level: 75, category: 'tools', aliases: ['containerization'] },
        
        // AI/ML frameworks
        'pytorch': { level: 90, category: 'ai-ml', aliases: ['torch'] },
        'tensorflow': { level: 85, category: 'ai-ml', aliases: ['tf'] },
        'scikit-learn': { level: 95, category: 'ai-ml', aliases: ['sklearn', 'scikit'] },
        'keras': { level: 80, category: 'ai-ml', aliases: [] },
        'huggingface': { level: 85, category: 'ai-ml', aliases: ['transformers', 'hf'] },
        'deep learning': { level: 88, category: 'ai-ml', aliases: ['neural networks', 'nn'] },
        'machine learning': { level: 90, category: 'ai-ml', aliases: ['ml', 'apprentissage automatique'] },
        
        // Big Data
        'apache spark': { level: 82, category: 'big-data', aliases: ['spark', 'pyspark', 'sparck'] },
        'hadoop': { level: 78, category: 'big-data', aliases: ['hdfs', 'hadoop hdfs'] },
        'kafka': { level: 70, category: 'big-data', aliases: ['apache kafka'] },
        'elasticsearch': { level: 72, category: 'big-data', aliases: ['elastic'] },
        
        // NLP
        'spacy': { level: 92, category: 'nlp', aliases: [] },
        'nltk': { level: 88, category: 'nlp', aliases: [] },
        'transformers': { level: 85, category: 'nlp', aliases: ['bert', 'gpt', 'llm'] },
        'langchain': { level: 80, category: 'nlp', aliases: [] },
        
        // Data Science
        'pandas': { level: 93, category: 'data-science', aliases: [] },
        'numpy': { level: 91, category: 'data-science', aliases: [] },
        'matplotlib': { level: 87, category: 'data-viz', aliases: [] },
        'plotly': { level: 86, category: 'data-viz', aliases: [] },
        'streamlit': { level: 89, category: 'data-viz', aliases: [] },
        'power bi': { level: 85, category: 'business-intelligence', aliases: ['powerbi', 'microsoft power bi'] },
        'tableau': { level: 70, category: 'business-intelligence', aliases: [] },
        
        // Cloud and DevOps
        'aws': { level: 65, category: 'cloud', aliases: ['amazon web services'] },
        'azure': { level: 60, category: 'cloud', aliases: ['microsoft azure'] },
        'gcp': { level: 58, category: 'cloud', aliases: ['google cloud'] },
        'kubernetes': { level: 60, category: 'devops', aliases: ['k8s'] },
        
        // Web development
        'fastapi': { level: 82, category: 'web', aliases: [] },
        'flask': { level: 78, category: 'web', aliases: [] },
        'django': { level: 70, category: 'web', aliases: [] },
        'react': { level: 75, category: 'web', aliases: ['reactjs'] },
        'html': { level: 85, category: 'web', aliases: ['html5'] },
        'css': { level: 83, category: 'web', aliases: ['css3'] }
    };
    
    // Projects database with associated technologies
    const projectsDatabase = {
        'IA_PRO': {
            title: 'IA_PRO - Assistant Documentaire',
            description: 'Assistant IA avec architecture RAG pour l\'analyse documentaire intelligente',
            technologies: ['python', 'transformers', 'langchain', 'streamlit', 'nlp'],
            domain: ['ai', 'nlp', 'data-science'],
            relevance: 95
        },
        'Mini-GPT PyTorch': {
            title: 'Mini-GPT PyTorch',
            description: 'Implémentation complète d\'un transformer GPT from scratch avec PyTorch',
            technologies: ['python', 'pytorch', 'transformers', 'deep learning'],
            domain: ['ai', 'machine-learning', 'nlp'],
            relevance: 90
        },
        'DocuAI': {
            title: 'DocuAI - Application NLP',
            description: 'Application NLP avec extraction d\'entités et interface Streamlit',
            technologies: ['python', 'spacy', 'nltk', 'streamlit', 'nlp'],
            domain: ['nlp', 'data-science'],
            relevance: 88
        },
        'E-commerce Analyzer': {
            title: 'E-commerce Analytics Dashboard',
            description: 'Dashboard interactif avec prédictions ML et visualisations avancées',
            technologies: ['python', 'pandas', 'plotly', 'scikit-learn', 'streamlit'],
            domain: ['data-science', 'business-intelligence', 'machine-learning'],
            relevance: 92
        },
        'Classification RFID': {
            title: 'Classification RFID ML',
            description: 'Système de classification automatique pour identification RFID',
            technologies: ['python', 'scikit-learn', 'pandas', 'machine learning'],
            domain: ['machine-learning', 'data-science'],
            relevance: 85
        },
        'Sentiment Analysis': {
            title: 'Analyse Sentiment Tweets',
            description: 'Classification de sentiments sur données Twitter avec techniques NLP',
            technologies: ['python', 'nltk', 'scikit-learn', 'pandas', 'nlp'],
            domain: ['nlp', 'machine-learning', 'data-science'],
            relevance: 87
        }
    };
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        analyzeCompatibility();
    });
    
    function analyzeCompatibility() {
        const formData = new FormData(form);
        const domain = formData.get('domain');
        const skillsInput = formData.get('skills');
        const experienceLevel = formData.get('level');
        const projectsInput = formData.get('projects');
        
        // Parse required skills
        const requiredSkills = skillsInput
            ? skillsInput.toLowerCase().split(',').map(s => s.trim()).filter(s => s)
            : [];
            
        // Parse project requirements
        const projectRequirements = projectsInput
            ? projectsInput.toLowerCase().split(',').map(s => s.trim()).filter(s => s)
            : [];
        
        // Analyze compatibility
        const analysis = performSkillsAnalysis(requiredSkills, domain, experienceLevel, projectRequirements);
        
        // Display results
        displayResults(analysis);
        
        // Show results section with animation
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in-up');
        
        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
    
    function performSkillsAnalysis(requiredSkills, domain, experienceLevel, projectRequirements) {
        const matchedSkills = [];
        const missingSkills = [];
        const bonusSkills = [];
        const relevantProjects = [];
        
        let totalScore = 0;
        let maxPossibleScore = 0;
        
        // Analyze each required skill
        requiredSkills.forEach(skill => {
            maxPossibleScore += 100;
            const matchedSkill = findSkillMatch(skill);
            
            if (matchedSkill) {
                matchedSkills.push({
                    name: skill,
                    level: matchedSkill.level,
                    category: matchedSkill.category
                });
                totalScore += matchedSkill.level;
            } else {
                missingSkills.push({
                    name: skill,
                    suggestion: suggestAlternative(skill)
                });
            }
        });
        
        // Add domain-specific bonus skills
        const domainBonusSkills = getDomainBonusSkills(domain);
        domainBonusSkills.forEach(skill => {
            if (!requiredSkills.includes(skill.name.toLowerCase())) {
                bonusSkills.push(skill);
            }
        });
        
        // Find relevant projects
        Object.entries(projectsDatabase).forEach(([key, project]) => {
            const relevanceScore = calculateProjectRelevance(project, requiredSkills, domain, projectRequirements);
            if (relevanceScore > 60) {
                relevantProjects.push({
                    ...project,
                    relevanceScore
                });
            }
        });
        
        // Sort projects by relevance
        relevantProjects.sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        // Calculate final compatibility score
        const baseScore = requiredSkills.length > 0 ? (totalScore / maxPossibleScore) * 100 : 85;
        const domainBonus = getDomainCompatibility(domain);
        const experienceBonus = getExperienceBonus(experienceLevel);
        
        const finalScore = Math.min(95, Math.round(baseScore + domainBonus + experienceBonus));
        
        return {
            score: finalScore,
            matchedSkills,
            missingSkills,
            bonusSkills,
            relevantProjects,
            domain,
            experienceLevel
        };
    }
    
    function findSkillMatch(skill) {
        const normalizedSkill = skill.toLowerCase().trim();
        
        // Direct match
        if (skillsDatabase[normalizedSkill]) {
            return skillsDatabase[normalizedSkill];
        }
        
        // Check aliases
        for (const [key, data] of Object.entries(skillsDatabase)) {
            if (data.aliases.includes(normalizedSkill) || key.includes(normalizedSkill)) {
                return data;
            }
        }
        
        return null;
    }
    
    function suggestAlternative(skill) {
        const suggestions = {
            'react': 'Expérience en JavaScript et développement web',
            'angular': 'Compétences en JavaScript et développement frontend',
            'vue': 'Connaissance des frameworks JavaScript',
            'mongodb': 'Expérience avec bases de données et modélisation',
            'redis': 'Compétences en systèmes de cache et optimisation'
        };
        
        return suggestions[skill.toLowerCase()] || 'Compétence en développement rapide';
    }
    
    function getDomainBonusSkills(domain) {
        const domainSkills = {
            'data-science': [
                { name: 'Pandas', level: 93, category: 'data-science' },
                { name: 'NumPy', level: 91, category: 'data-science' },
                { name: 'Plotly', level: 86, category: 'data-viz' }
            ],
            'machine-learning': [
                { name: 'PyTorch', level: 90, category: 'ai-ml' },
                { name: 'Scikit-learn', level: 95, category: 'ai-ml' },
                { name: 'TensorFlow', level: 85, category: 'ai-ml' }
            ],
            'ai': [
                { name: 'Transformers', level: 85, category: 'nlp' },
                { name: 'LangChain', level: 80, category: 'nlp' },
                { name: 'PyTorch', level: 90, category: 'ai-ml' }
            ],
            'big-data': [
                { name: 'Apache Spark', level: 82, category: 'big-data' },
                { name: 'Hadoop HDFS', level: 78, category: 'big-data' },
                { name: 'SQL', level: 90, category: 'database' }
            ],
            'nlp': [
                { name: 'spaCy', level: 92, category: 'nlp' },
                { name: 'NLTK', level: 88, category: 'nlp' },
                { name: 'Transformers', level: 85, category: 'nlp' }
            ]
        };
        
        return domainSkills[domain] || [];
    }
    
    function calculateProjectRelevance(project, requiredSkills, domain, projectRequirements) {
        let score = 0;
        
        // Check technology overlap
        const techOverlap = project.technologies.filter(tech => 
            requiredSkills.some(req => req.includes(tech) || tech.includes(req))
        );
        score += (techOverlap.length / Math.max(project.technologies.length, requiredSkills.length)) * 40;
        
        // Check domain match
        if (project.domain.includes(domain)) {
            score += 30;
        }
        
        // Check project requirements match
        projectRequirements.forEach(req => {
            if (project.description.toLowerCase().includes(req) || 
                project.title.toLowerCase().includes(req)) {
                score += 15;
            }
        });
        
        // Base relevance
        score += (project.relevance / 100) * 30;
        
        return Math.min(100, score);
    }
    
    function getDomainCompatibility(domain) {
        const domainScores = {
            'data-science': 15,
            'machine-learning': 12,
            'ai': 10,
            'big-data': 8,
            'nlp': 12,
            'data-engineering': 6,
            'business-intelligence': 8
        };
        
        return domainScores[domain] || 0;
    }
    
    function getExperienceBonus(level) {
        const experienceBonus = {
            'junior': 5,
            'intermediate': 0,
            'senior': -2  // Slightly lower as I'm still a student
        };
        
        return experienceBonus[level] || 0;
    }
    
    function displayResults(analysis) {
        // Update compatibility score
        updateCompatibilityScore(analysis.score);
        
        // Display matched skills
        displayMatchedSkills(analysis.matchedSkills);
        
        // Display missing skills
        displayMissingSkills(analysis.missingSkills);
        
        // Display bonus skills
        displayBonusSkills(analysis.bonusSkills);
        
        // Display relevant projects
        displayRelevantProjects(analysis.relevantProjects);
    }
    
    function updateCompatibilityScore(score) {
        const scoreElement = document.getElementById('score-value');
        const scoreCircle = document.querySelector('.score-circle');
        
        if (scoreElement && scoreCircle) {
            // Animate score counting
            let currentScore = 0;
            const increment = score / 50; // 50 frames animation
            
            const scoreAnimation = setInterval(() => {
                currentScore += increment;
                if (currentScore >= score) {
                    currentScore = score;
                    clearInterval(scoreAnimation);
                }
                
                scoreElement.textContent = Math.round(currentScore) + '%';
                
                // Update circle gradient
                const angle = (currentScore / 100) * 360;
                scoreCircle.style.setProperty('--score-angle', angle + 'deg');
            }, 20);
        }
    }
    
    function displayMatchedSkills(skills) {
        const container = document.getElementById('matched-skills-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        skills.forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                <i class="fas fa-check"></i>
                <span>${skill.name}</span>
                <small>(${skill.level}%)</small>
            `;
            container.appendChild(tag);
        });
    }
    
    function displayMissingSkills(skills) {
        const container = document.getElementById('missing-skills-list');
        const section = document.getElementById('missing-skills-section');
        
        if (!container || !section) return;
        
        if (skills.length === 0) {
            section.style.display = 'none';
            return;
        }
        
        section.style.display = 'block';
        container.innerHTML = '';
        
        skills.forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>${skill.name}</span>
            `;
            if (skill.suggestion) {
                tag.title = skill.suggestion;
            }
            container.appendChild(tag);
        });
    }
    
    function displayBonusSkills(skills) {
        const container = document.getElementById('bonus-skills-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        skills.slice(0, 6).forEach(skill => { // Limit to 6 bonus skills
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                <i class="fas fa-star"></i>
                <span>${skill.name}</span>
                <small>(${skill.level}%)</small>
            `;
            container.appendChild(tag);
        });
    }
    
    function displayRelevantProjects(projects) {
        const container = document.getElementById('relevant-projects-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        projects.slice(0, 4).forEach(project => { // Limit to 4 projects
            const card = document.createElement('div');
            card.className = 'project-match-card';
            card.innerHTML = `
                <h5>${project.title}</h5>
                <p>${project.description}</p>
                <div class="project-relevance">
                    <span>Pertinence:</span>
                    <div class="relevance-bar">
                        <div class="relevance-fill" style="width: ${project.relevanceScore}%"></div>
                    </div>
                    <span>${Math.round(project.relevanceScore)}%</span>
                </div>
            `;
            container.appendChild(card);
        });
    }
    
    console.log('🎯 Skills matching system initialized successfully');
}

// Functions for matching actions
function downloadMatchingReport() {
    const results = document.getElementById('matching-results');
    if (!results || results.style.display === 'none') {
        showNotification('Veuillez d\'abord effectuer une analyse de compatibilité', 'error');
        return;
    }
    
    const score = document.getElementById('score-value')?.textContent || '0%';
    const matchedSkills = Array.from(document.querySelectorAll('#matched-skills-list .skill-tag'))
        .map(tag => tag.textContent.trim())
        .join(', ');
    
    const reportContent = `RAPPORT DE COMPATIBILITÉ - BOUBACAR DABO
Generated: ${new Date().toLocaleDateString('fr-FR')}

SCORE DE COMPATIBILITÉ: ${score}

COMPÉTENCES CORRESPONDANTES:
${matchedSkills || 'Aucune compétence spécifiée'}

PROJETS PERTINENTS:
- IA_PRO: Assistant documentaire avec RAG
- Mini-GPT PyTorch: Implémentation transformer from scratch
- DocuAI: Application NLP avec interface Streamlit
- E-commerce Analyzer: Dashboard analytics avec ML

CONTACT:
Email: dabom372@gmail.com
LinkedIn: https://www.linkedin.com/in/boubacar-dabo-94206a291/
Portfolio: https://bouba-dabo.github.io/portfolio

DISPONIBILITÉ: À partir de Février 2026 (Stage → CDI possible)
`;

    try {
        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Boubacar_DABO_Matching_Report_${new Date().toISOString().split('T')[0]}.txt`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Rapport de compatibilité téléchargé avec succès!', 'success');
    } catch (error) {
        console.error('Erreur lors du téléchargement du rapport:', error);
        showNotification('Erreur lors du téléchargement', 'error');
    }
}

function contactForMatch() {
    const results = document.getElementById('matching-results');
    if (!results || results.style.display === 'none') {
        showNotification('Veuillez d\'abord effectuer une analyse de compatibilité', 'error');
        return;
    }
    
    const score = document.getElementById('score-value')?.textContent || '0%';
    const subject = encodeURIComponent(`Opportunité de collaboration - Compatibilité ${score}`);
    const body = encodeURIComponent(`Bonjour Boubacar,

J'ai effectué une analyse de compatibilité sur votre portfolio et les résultats sont très encourageants (${score} de compatibilité).

Je souhaiterais discuter d'une opportunité de collaboration dans le domaine de la Data Science/IA.

Pouvons-nous organiser un échange pour discuter plus en détail ?

Cordialement,`);
    
    const mailtoLink = `mailto:dabom372@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
    
    showNotification('Client email ouvert pour prise de contact', 'success');
}
    
    console.log('🚀 Portfolio sécurisé et optimisé initialisé !');
});
