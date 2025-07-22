// ========================
// PORTFOLIO CORE FUNCTIONALITY
// ========================

// Theme initialization
function initializeTheme() {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('portfolio-theme');
    const theme = savedTheme || (prefersDarkMode ? 'dark' : 'dark'); // Force dark theme for futuristic look
    document.documentElement.setAttribute('data-theme', theme);
}

// Mobile menu functionality
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Contact form functionality
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Formulaire soumis:', data);
        showNotification('Message envoyé avec succès!', 'success');
        form.reset();
    });
}

// Project filters
function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Filter projects
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('show'), 10);
                } else {
                    card.classList.remove('show');
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

// CV Download functionality
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

    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Boubacar_DABO_CV_2025.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">×</button>
    `;
    
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
    
    const autoRemove = setTimeout(() => notification.remove(), 5000);
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.remove();
    });
}

// ========================
// ADVANCED ANIMATIONS MODULE
// ========================

// Advanced Loading Screen
function initAdvancedLoadingScreen() {
    const loader = document.querySelector('.advanced-loader');
    if (!loader) return;

    const progressBar = document.querySelector('.loader-progress-bar');
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
            loaderText.textContent = loadingMessages[messageIndex];
            messageIndex++;
        }
    }, 750);

    setTimeout(() => {
        clearInterval(messageInterval);
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        document.body.style.overflow = 'visible';
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

    initializeTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter-effect');
        
        typewriterElements.forEach(element => {
            const text = element.dataset.text;
            if (!text) return;

            element.innerHTML = '';
            let i = 0;
            const cursor = document.createElement('span');
            cursor.className = 'typewriter-cursor';
            cursor.innerHTML = '|';
            
            const typeWriter = () => {
                if (i < text.length) {
                    element.innerHTML = text.substring(0, i + 1);
                    element.appendChild(cursor);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    setTimeout(() => cursor.remove(), 2000);
                }
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => typeWriter(), 500);
                        observer.unobserve(element);
                    }
                });
            });

            observer.observe(element);
        });
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
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.classList.add('ripple');
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                button.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });

        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            button.classList.add('btn-enhanced');
            button.addEventListener('mouseenter', () => this.playHoverSound());
        });
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

    playHoverSound() {
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
        } catch (e) {
            // Silent fail if audio context is not available
        }
    }

    initializeGlitchEffect() {
        const glitchElements = document.querySelectorAll('.glitch-enhanced');
        
        glitchElements.forEach(element => {
            const text = element.textContent;
            element.setAttribute('data-text', text);
            
            setInterval(() => {
                if (Math.random() > 0.8) {
                    element.classList.add('glitch-active');
                    setTimeout(() => {
                        element.classList.remove('glitch-active');
                    }, 200);
                }
            }, 3000);
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.checkAnimationPreference();
        this.monitorPerformance();
    }

    checkAnimationPreference() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduce-motion');
        }
    }

    monitorPerformance() {
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.querySelectorAll('.particle').forEach(particle => {
                particle.style.display = 'none';
            });
        }
    }
}

// Enhanced scroll navbar
function initScrollNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
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
    });
}

// Project demo functionality
function initProjectDemos() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('demo-btn') || e.target.parentElement.classList.contains('demo-btn')) {
            const projectCard = e.target.closest('.project-card');
            const projectTitle = projectCard.querySelector('.project-title').textContent;
            showProjectDemo(projectTitle);
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

// CV Download button handler
function initCVDownload() {
    const downloadBtn = document.getElementById('downloadCV');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadCV();
            showNotification('CV téléchargé avec succès!', 'success');
        });
    }
}

// ========================
// MAIN INITIALIZATION
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
    
    // Initialize advanced loading screen
    initAdvancedLoadingScreen();
    
    // Initialize advanced animations after a short delay
    setTimeout(() => {
        new AdvancedAnimations();
        new PerformanceMonitor();
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
    
    console.log('🚀 Portfolio avec animations avancées initialisé !');
});
