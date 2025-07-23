// ========================
// SERVICE WORKER - PWA
// ========================

const CACHE_NAME = 'bouba-portfolio-v2.0.0';
const STATIC_CACHE_NAME = 'static-resources-v1.0.0';
const ANALYTICS_CACHE_NAME = 'analytics-data-v1.0.0';

// Ressources à mettre en cache pour le mode offline
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/styles.css',
  '/chatbot-styles.css',
  '/skills-matching.css',
  '/script.js',
  '/manifest.json',
  // Fonts externes
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  // Libraries JavaScript
  'https://unpkg.com/aos@2.3.1/dist/aos.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
];

// Pages dynamiques à mettre en cache après visite
const DYNAMIC_RESOURCES = [
  '#hero',
  '#about',
  '#skills',
  '#projets',
  '#skills-matching',
  '#experience',
  '#chatbot',
  '#contact'
];

// ========================
// INSTALLATION DU SW
// ========================
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources statiques
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('📦 Caching static resources...');
        return cache.addAll(STATIC_RESOURCES);
      }),
      
      // Cache Analytics
      caches.open(ANALYTICS_CACHE_NAME).then((cache) => {
        console.log('📊 Analytics cache initialized');
        return cache.put('/analytics-data', new Response(JSON.stringify({
          visits: [],
          interactions: [],
          skillsMatching: [],
          lastUpdate: Date.now()
        })));
      })
    ]).then(() => {
      console.log('✅ Service Worker installed successfully');
      // Force l'activation immédiate
      return self.skipWaiting();
    })
  );
});

// ========================
// ACTIVATION DU SW
// ========================
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE_NAME && 
                cacheName !== ANALYTICS_CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Prendre le contrôle immédiat
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker activated');
      
      // Notifier tous les clients de la mise à jour
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            message: 'Portfolio ready for offline use! 🚀'
          });
        });
      });
    })
  );
});

// ========================
// STRATÉGIE DE CACHE
// ========================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip cross-origin requests et certaines requêtes
  if (!request.url.startsWith(self.location.origin) && 
      !STATIC_RESOURCES.some(resource => request.url.includes(resource))) {
    return;
  }
  
  // Stratégie Cache First pour les ressources statiques
  if (isStaticResource(request)) {
    event.respondWith(cacheFirst(request));
  }
  // Stratégie Network First pour les données dynamiques
  else if (isDynamicContent(request)) {
    event.respondWith(networkFirst(request));
  }
  // Stratégie par défaut
  else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// ========================
// FONCTIONS DE CACHE
// ========================

// Cache First - pour les ressources statiques
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy error:', error);
    const fallbackResponse = await caches.match(request);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    return caches.match('/index.html');
  }
}

// Network First - pour le contenu dynamique
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Network first strategy error:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline - Content not available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Stale While Revalidate - équilibré
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// ========================
// UTILITAIRES
// ========================
function isStaticResource(request) {
  return request.url.includes('.css') ||
         request.url.includes('.js') ||
         request.url.includes('.woff') ||
         request.url.includes('.woff2') ||
         request.url.includes('fonts.googleapis.com') ||
         request.url.includes('cdnjs.cloudflare.com') ||
         request.url.includes('unpkg.com');
}

function isDynamicContent(request) {
  return request.url.includes('api') ||
         request.url.includes('analytics') ||
         request.method !== 'GET';
}

// ========================
// ANALYTICS OFFLINE
// ========================
self.addEventListener('message', (event) => {
  // Vérification de sécurité de l'origine
  if (event.origin !== self.location.origin) {
    return;
  }
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'TRACK_VISIT':
      trackVisit(data);
      break;
    case 'TRACK_INTERACTION':
      trackInteraction(data);
      break;
    case 'TRACK_SKILLS_MATCHING':
      trackSkillsMatching(data);
      break;
    case 'GET_ANALYTICS':
      getAnalytics().then(analytics => {
        event.ports[0].postMessage(analytics);
      });
      break;
  }
});

async function trackVisit(data) {
  try {
    const cache = await caches.open(ANALYTICS_CACHE_NAME);
    const response = await cache.match('/analytics-data');
    const analytics = response ? await response.json() : { visits: [], interactions: [], skillsMatching: [] };
    
    analytics.visits.push({
      timestamp: Date.now(),
      page: data.page,
      userAgent: data.userAgent,
      language: data.language,
      referrer: data.referrer
    });
    
    // Garder seulement les 1000 dernières visites
    if (analytics.visits.length > 1000) {
      analytics.visits = analytics.visits.slice(-1000);
    }
    
    analytics.lastUpdate = Date.now();
    await cache.put('/analytics-data', new Response(JSON.stringify(analytics)));
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

async function trackInteraction(data) {
  try {
    const cache = await caches.open(ANALYTICS_CACHE_NAME);
    const response = await cache.match('/analytics-data');
    const analytics = response ? await response.json() : { visits: [], interactions: [], skillsMatching: [] };
    
    analytics.interactions.push({
      timestamp: Date.now(),
      type: data.type,
      element: data.element,
      section: data.section,
      duration: data.duration
    });
    
    // Garder seulement les 500 dernières interactions
    if (analytics.interactions.length > 500) {
      analytics.interactions = analytics.interactions.slice(-500);
    }
    
    analytics.lastUpdate = Date.now();
    await cache.put('/analytics-data', new Response(JSON.stringify(analytics)));
  } catch (error) {
    console.error('Interaction tracking error:', error);
  }
}

async function trackSkillsMatching(data) {
  try {
    const cache = await caches.open(ANALYTICS_CACHE_NAME);
    const response = await cache.match('/analytics-data');
    const analytics = response ? await response.json() : { visits: [], interactions: [], skillsMatching: [] };
    
    analytics.skillsMatching.push({
      timestamp: Date.now(),
      domain: data.domain,
      technologies: data.technologies,
      experience: data.experience,
      projectTypes: data.projectTypes,
      compatibilityScore: data.compatibilityScore,
      matchedSkills: data.matchedSkills,
      missingSkills: data.missingSkills
    });
    
    // Garder seulement les 200 derniers matchings
    if (analytics.skillsMatching.length > 200) {
      analytics.skillsMatching = analytics.skillsMatching.slice(-200);
    }
    
    analytics.lastUpdate = Date.now();
    await cache.put('/analytics-data', new Response(JSON.stringify(analytics)));
  } catch (error) {
    console.error('Skills matching tracking error:', error);
  }
}

async function getAnalytics() {
  try {
    const cache = await caches.open(ANALYTICS_CACHE_NAME);
    const response = await cache.match('/analytics-data');
    return response ? await response.json() : { visits: [], interactions: [], skillsMatching: [] };
  } catch (error) {
    console.error('Get analytics error:', error);
    return { visits: [], interactions: [], skillsMatching: [] };
  }
}

// ========================
// NOTIFICATIONS
// ========================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/') // Ouvre le portfolio
  );
});

// ========================
// SYNCHRONISATION EN ARRIÈRE-PLAN
// ========================
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Synchroniser les données analytics quand la connexion est rétablie
  try {
    const analytics = await getAnalytics();
    // Ici on pourrait envoyer les données à un serveur d'analytics
    console.log('📊 Analytics synced:', analytics);
  } catch (error) {
    console.error('Analytics sync error:', error);
  }
}
