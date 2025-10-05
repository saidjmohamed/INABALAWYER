const CACHE_NAME = 'inaba-lawyer-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// قائمة الملفات المطلوب تخزينها في التخزين المؤقت
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // سيتم إضافة الملفات الأخرى ديناميكياً
];

// تنصيب Service Worker
self.addEventListener('install', event => {
  console.log('🚀 Service Worker: تم التنصيب بنجاح');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 تخزين الملفات الأساسية...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('❌ خطأ في تخزين الملفات:', err);
      })
  );
  
  // إجبار التنشيط فوراً
  self.skipWaiting();
});

// تنشيط Service Worker
self.addEventListener('activate', event => {
  console.log('✅ Service Worker: تم التنشيط بنجاح');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // حذف التخزين القديم
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ حذف التخزين القديم:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // تولي زمام جميع الصفحات فوراً
        return self.clients.claim();
      })
  );
});

// معالجة طلبات الشبكة
self.addEventListener('fetch', event => {
  // تجاهل طلبات غير HTTP/HTTPS
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // استراتيجية Cache First للملفات الساكنة
  if (event.request.destination === 'image' || 
      event.request.destination === 'style' || 
      event.request.destination === 'script' ||
      event.request.url.includes('/icons/') ||
      event.request.url.includes('/assets/')) {
    
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response; // إرجاع من التخزين
          }
          
          // تحميل من الشبكة وحفظ في التخزين
          return fetch(event.request)
            .then(fetchResponse => {
              const responseToCache = fetchResponse.clone();
              caches.open(STATIC_CACHE)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              return fetchResponse;
            });
        })
    );
    return;
  }

  // استراتيجية Network First للبيانات الديناميكية
  if (event.request.method === 'GET' && 
      (event.request.url.includes('/api/') || 
       event.request.url.includes('.supabase.'))) {
    
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // حفظ الردود الناجحة في التخزين الديناميكي
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // في حالة عدم وجود اتصال، ارجع من التخزين
          return caches.match(event.request);
        })
    );
    return;
  }

  // استراتيجية Cache First للصفحات
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // تحديث في الخلفية
          fetch(event.request)
            .then(fetchResponse => {
              if (fetchResponse.ok) {
                caches.open(DYNAMIC_CACHE)
                  .then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                  });
              }
            })
            .catch(() => {
              // تجاهل أخطاء التحديث في الخلفية
            });
          
          return response;
        }
        
        // تحميل من الشبكة وحفظ
        return fetch(event.request)
          .then(fetchResponse => {
            const responseToCache = fetchResponse.clone();
            
            // حفظ فقط إذا كان الرد ناجح
            if (fetchResponse.ok) {
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            
            return fetchResponse;
          })
          .catch(() => {
            // في حالة عدم وجود اتصال
            if (event.request.mode === 'navigate') {
              // ارجع الصفحة الرئيسية إذا لم تكن متوفرة
              return caches.match('/') ||
                     new Response('غير متوفر حالياً - الرجاء التحقق من اتصالك بالإنترنت', {
                       status: 503,
                       headers: { 'Content-Type': 'text/html; charset=utf-8' }
                     });
            }
            
            return new Response('عذراً، لا يوجد اتصال بالإنترنت', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// رسالة ترحيبية
console.log('🚀 Service Worker لتطبيق إنابة ومعلومة جاهز!');
console.log('📱 التطبيق يعمل بوضع PWA متقدم');