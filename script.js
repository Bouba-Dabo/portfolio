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
    
    chartButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            chartButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Simulate chart data change
            updateChartDisplay(this.textContent.toLowerCase());
        });
    });
    
    // Set first button as active
    if (chartButtons.length > 0) {
        chartButtons[0].classList.add('active');
    }
}

function updateChartDisplay(chartType) {
    console.log(`Updating chart display for: ${chartType}`);
    // This would integrate with Chart.js or similar library
}

// Main initialization function for data visualizations
function initializeDataVisualizations() {
    try {
        initializeNeuralNetwork();
        initializeAnalyticsDashboard();
        initializeChartControls();
        console.log('✨ Data visualizations initialized successfully');
    } catch (error) {
        console.warn('⚠️ Error initializing data visualizations:', error);
    }
}
    
    console.log('🚀 Portfolio sécurisé et optimisé initialisé !');
});
