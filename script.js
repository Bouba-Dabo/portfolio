// Portfolio JavaScript - Animations and Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Navigation functionality
    initNavigation();
    
    // Smooth scrolling
    initSmoothScrolling();
    
    // Animations on scroll
    initScrollAnimations();
    
    // Typing effect for hero
    initTypingEffect();
    
    // Counter animations
    initCounterAnimations();
    
    // Skill bars animation
    initSkillBars();
    
    // Contact form handling
    initContactForm();
    
    // Glitch effect
    initGlitchEffect();
    
    // Parallax effects
    initParallaxEffects();
    
    // NEW: CV Download functionality
    initCVDownload();
    
    // NEW: Project filters
    initProjectFilters();
    
    // NEW: Loading screen
    initLoadingScreen();
    
    // NEW: Notifications system
    initNotifications();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const ctaButtons = document.querySelectorAll('.btn[href^="#"]');
    
    [...navLinks, ...ctaButtons].forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger specific animations based on element
                if (entry.target.classList.contains('skill-progress')) {
                    animateSkillBar(entry.target);
                }
                
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .project-card,
        .skill-category,
        .timeline-item,
        .contact-item,
        .about-text,
        .profile-card,
        .fadeIn
    `);

    animatedElements.forEach(el => {
        el.classList.add('fadeIn');
        observer.observe(el);
    });
}

// Typing effect for hero subtitle
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typingSpeed = 100;
    
    function typeWriter() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            // Add cursor blink effect
            subtitle.style.borderRight = '2px solid #00d4ff';
            setTimeout(() => {
                subtitle.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing after a delay
    setTimeout(typeWriter, 1000);
}

// Counter animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Store the animation function for later use
        counter.animateCounter = updateCounter;
    });
}

// Animate counter when visible
function animateCounter(counter) {
    if (counter.animateCounter && !counter.hasAnimated) {
        counter.animateCounter();
        counter.hasAnimated = true;
    }
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress[data-width]');
    
    skillBars.forEach(bar => {
        bar.animateSkill = function() {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        };
    });
}

// Animate skill bar when visible
function animateSkillBar(bar) {
    if (bar.animateSkill && !bar.hasAnimated) {
        setTimeout(() => {
            bar.animateSkill();
        }, 200);
        bar.hasAnimated = true;
    }
}

// Contact form handling
function initContactForm() {
    const form = document.querySelector('.form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    const submitBtn = form.querySelector('.submit-btn');

    // Add floating label effect
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });

        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Reset form
            form.reset();
            inputs.forEach(input => {
                input.parentElement.classList.remove('focused');
            });
            
            // Show success message
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
            submitBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)';
            
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Envoyer le message</span><i class="fas fa-paper-plane"></i>';
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
            
        }, 2000);
    });
}

// Enhanced glitch effect
function initGlitchEffect() {
    const glitchElement = document.querySelector('.glitch');
    if (!glitchElement) return;

    setInterval(() => {
        // Random glitch trigger
        if (Math.random() < 0.1) {
            glitchElement.style.animation = 'none';
            setTimeout(() => {
                glitchElement.style.animation = '';
            }, 100);
        }
    }, 2000);
}

// Parallax effects
function initParallaxEffects() {
    const stars = document.querySelector('.stars');
    const nebula = document.querySelector('.nebula');
    
    if (!stars || !nebula) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const rate2 = scrolled * -0.3;
        
        stars.style.transform = `translateY(${rate}px)`;
        nebula.style.transform = `translateY(${rate2}px)`;
    });
}

// Project filtering (if needed)
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Mouse cursor effect
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        }, 50);
    });

    // Add cursor styles
    const cursorStyles = `
        .custom-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #00d4ff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.2s ease;
        }
        
        .cursor-dot {
            position: fixed;
            width: 4px;
            height: 4px;
            background: #00d4ff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: left 0.1s ease, top 0.1s ease;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = cursorStyles;
    document.head.appendChild(styleSheet);

    // Hide default cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#ff006b';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#00d4ff';
        });
    });
}

// Particle system for background
function initParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.3;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }

    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            ctx.fill();
        });

        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const distance = Math.sqrt(
                    Math.pow(particle.x - otherParticle.x, 2) + 
                    Math.pow(particle.y - otherParticle.y, 2)
                );

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
    }

    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animate();
}

// Matrix rain effect (optional, for extra futuristic feel)
function initMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -2;
        opacity: 0.1;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');

    let drops = [];
    const fontSize = 14;
    let columns;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
    }

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00d4ff';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    setInterval(draw, 100);
}

// Performance optimization
function optimizeAnimations() {
    // Reduce animations on low-end devices
    const isLowEndDevice = navigator.hardwareConcurrency < 4 || 
                          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isLowEndDevice) {
        // Disable complex animations
        const complexAnimations = document.querySelectorAll('.neuron, .stars, .nebula');
        complexAnimations.forEach(el => {
            el.style.animation = 'none';
        });
    }
}

// Initialize performance optimizations
optimizeAnimations();

// Optional: Initialize advanced effects (uncomment if desired)
// initCursorEffect();
// initParticleSystem();
// initMatrixRain();

// Loading screen
function initLoadingScreen() {
    const loader = document.createElement('div');
    loader.className = 'loading-screen';
    loader.innerHTML = `
        <div class="loader">
            <div class="loader-text">BOUBA</div>
            <div class="loader-subtitle">Engineering Intelligent Futures</div>
            <div class="loader-progress">
                <div class="loader-bar"></div>
            </div>
        </div>
    `;
    
    const loaderStyles = `
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        }
        
        .loader {
            text-align: center;
        }
        
        .loader-text {
            font-family: var(--font-primary);
            font-size: 3rem;
            font-weight: 900;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            animation: pulse 2s ease-in-out infinite;
        }
        
        .loader-subtitle {
            color: var(--text-secondary);
            margin-bottom: 2rem;
        }
        
        .loader-progress {
            width: 200px;
            height: 4px;
            background: rgba(0, 212, 255, 0.2);
            border-radius: 2px;
            overflow: hidden;
        }
        
        .loader-bar {
            height: 100%;
            background: var(--gradient-primary);
            border-radius: 2px;
            animation: loading 3s ease-in-out forwards;
        }
        
        @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
        }
    `;
    
    // Inject the styles
    const style = document.createElement('style');
    style.textContent = loadingStyles;
    document.head.appendChild(style);
}

// NEW FUNCTIONS FOR ENHANCED PORTFOLIO

// CV Download functionality
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

function downloadCV() {
    const cvContent = `
BOUBACAR DABO
Étudiant-Ingénieur Big Data & Intelligence Artificielle

Contact:
📧 Email: dabom372@gmail.com
📍 Localisation: Rouen (études) • Saint-Denis Paris (résidence)
🌐 Portfolio: https://bouba-dabo.github.io/portfolio

OBJECTIF:
Stage de fin d'études en Data Science / Intelligence Artificielle (Février 2026)

FORMATION:
• ESIGELEC - Cycle Ingénieur Big Data & Transformation Numérique (2023-2026)
• Classes Préparatoires Scientifiques - ESMT Dakar (2021-2023)
• Diplôme MPI - Université Cheikh Anta Diop (2021-2023)
• Baccalauréat Sciences Expérimentales - Lycée Limamoulaye (2020-2021)

COMPÉTENCES TECHNIQUES:
Intelligence Artificielle & ML:
• PyTorch, TensorFlow, Scikit-learn
• Deep Learning, Neural Networks
• Computer Vision, NLP

Data Science:
• Pandas, NumPy, Plotly, Streamlit
• Data Analysis & Visualization
• Business Intelligence

Développement:
• Python, FastAPI, Git/GitHub
• Docker, Cloud Computing
• API Development

PROJETS PRINCIPAUX:
• IA_PRO - Assistant documentaire avec RAG et LangChain
• Mini-GPT PyTorch - Implémentation transformer from scratch
• DocuAI - Application NLP pour extraction d'informations
• E-commerce Analyzer - Dashboard analytics avec Streamlit
• Assistant Claude GPT - IA conversationnelle personnalisée
• Classification RFID - ML pour identification automatique
• Analyse Sentiment Tweets - NLP pour opinion publique

LANGUES:
• Français (Natif)
• Anglais (Courant technique)

DISPONIBILITÉ:
• Février 2026 - Juillet 2026
• 6 mois - Temps plein
• Mobilité géographique : France, Europe
• Remote possible
    `;

    const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CV_Boubacar_DABO_IA_DataScience.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Project filters functionality
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Loading screen functionality
function initLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <span class="logo-text">BOUBACAR DABO</span>
                <span class="logo-subtitle">Engineering Intelligent Futures</span>
            </div>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
            <div class="loading-text">Chargement du portfolio...</div>
        </div>
    `;
    
    document.body.appendChild(loadingScreen);
    
    // Hide loading screen after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                }
            }, 500);
        }, 1500);
    });
}

// Notifications system
function initNotifications() {
    // Add notification styles
    const notificationStyles = `
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
        
        .notification.success {
            border-color: #10b981;
        }
        
        .notification.success i {
            color: #10b981;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 18px;
            cursor: pointer;
            margin-left: 10px;
            padding: 0;
        }
        
        .notification-close:hover {
            color: var(--text-primary);
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        }
        
        .loading-content {
            text-align: center;
        }
        
        .loading-logo .logo-text {
            font-family: var(--font-primary);
            font-size: 2.5rem;
            font-weight: 900;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: block;
            margin-bottom: 10px;
        }
        
        .loading-logo .logo-subtitle {
            color: var(--text-secondary);
            font-size: 1.1rem;
            display: block;
            margin-bottom: 40px;
        }
        
        .loading-bar {
            width: 300px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
            margin: 0 auto 20px;
        }
        
        .loading-progress {
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            animation: loading-animation 2s ease-in-out forwards;
        }
        
        .loading-text {
            color: var(--text-secondary);
            font-size: 0.9rem;
            animation: pulse 2s infinite;
        }
        
        @keyframes loading-animation {
            to { width: 100%; }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = notificationStyles;
    document.head.appendChild(style);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.remove();
    });
}

// Enhanced scroll navbar
function initScrollNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
            
            // Hide/show navbar based on scroll direction
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

// Initialize enhanced navbar
document.addEventListener('DOMContentLoaded', function() {
    initScrollNavbar();
});

// Project demo functionality
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

function showProjectDemo(projectTitle) {
    const demos = {
        'IA_PRO': 'Démonstration interactive de l\'assistant IA pour l\'analyse documentaire avec RAG',
        'Mini-GPT PyTorch': 'Visualisation de l\'architecture transformer et du processus d\'entraînement',
        'DocuAI': 'Interface de traitement NLP avec extraction d\'entités nommées en temps réel',
        'E-commerce Analyzer': 'Dashboard interactif avec visualisations et prédictions de ventes'
    };
    
    const demoContent = demos[projectTitle] || 'Démonstration interactive disponible';
    showNotification(`🎮 Démo ${projectTitle}: ${demoContent}`, 'info');
}
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = loaderStyles;
    document.head.appendChild(styleSheet);
    document.body.appendChild(loader);
    
    // Remove loader after 3 seconds
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(loader);
        }, 500);
    }, 3000);
}

// Initialize loading screen
initLoadingScreen();
