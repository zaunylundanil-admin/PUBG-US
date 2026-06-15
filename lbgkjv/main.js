// Главный файл инициализации
const App = {
    // Инициализация приложения
    init() {
        console.log('🚀 PUBG UC Store initializing...');
        
        // Инициализация систем
        this.initSystems();
        
        // Инициализация компонентов
        this.initComponents();
        
        // Инициализация обработчиков событий
        this.initEventHandlers();
        
        // Запуск анимаций
        this.startAnimations();
        
        console.log('✅ PUBG UC Store initialized successfully');
    },

    // Инициализация систем
    initSystems() {
        Cart.init();
        Packages.init();
        Reviews.init();
        FAQ.init();
    },

    // Инициализация компонентов
    initComponents() {
        this.renderSteps();
        this.renderAdvantages();
        this.renderPromotions();
        this.renderSupportOptions();
        this.initCountdownTimers();
        this.initScrollAnimations();
        this.initPerformanceOptimizations();
    },

    // Инициализация переключения темы
    initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('pubguc-theme') || 'dark';
        
        // Устанавливаем начальную тему
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);
        
        // Обработчик переключения темы
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('pubguc-theme', newTheme);
                this.updateThemeIcon(newTheme);
                
                Utils.showNotification(`Тема изменена на ${newTheme === 'dark' ? 'тёмную' : 'светлую'}`, 'success');
            });
        }
    },

    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (theme === 'dark') {
                icon.className = 'fas fa-moon';
                themeToggle.title = 'Переключить на светлую тему';
            } else {
                icon.className = 'fas fa-sun';
                themeToggle.title = 'Переключить на тёмную тему';
            }
        }
    },

    // Рендер шагов покупки
    renderSteps() {
        const container = document.querySelector('.steps');
        if (!container) return;

        container.innerHTML = STEPS.map(step => `
            <div class="step">
                <div class="step-number">${step.number}</div>
                <div class="step-icon">
                    <i class="${step.icon}"></i>
                </div>
                <h3>${step.title}</h3>
                <p>${step.description}</p>
                <div class="step-duration">${step.duration}</div>
            </div>
        `).join('');
    },

    // Рендер преимуществ
    renderAdvantages() {
        const container = document.querySelector('.advantages-grid');
        if (!container) return;

        container.innerHTML = ADVANTAGES.map(advantage => `
            <div class="advantage ${advantage.featured ? 'featured' : ''}">
                <div class="advantage-icon">
                    <i class="${advantage.icon}"></i>
                </div>
                <div class="advantage-content">
                    <h3>${advantage.title}</h3>
                    <p>${advantage.description}</p>
                </div>
            </div>
        `).join('');
    },

    // Рендер акций
    renderPromotions() {
        const container = document.querySelector('.promotions-container');
        if (!container) return;

        container.innerHTML = PROMOTIONS.map(promo => `
            <div class="promo-card ${promo.featured ? 'featured' : ''}">
                <div class="promo-icon">
                    <i class="${promo.icon}"></i>
                </div>
                <div class="promo-content">
                    <span class="promo-badge">${promo.badge}</span>
                    <h3>${promo.title}</h3>
                    <p>${promo.description}</p>
                    
                    ${promo.features ? `
                        <ul class="promo-features">
                            ${promo.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    ` : ''}
                    
                    ${promo.timer ? `
                        <div class="promo-timer">
                            До конца акции: <span class="time-left" id="timer-${promo.id}"></span>
                        </div>
                    ` : ''}
                    
                    <a href="#packages" class="btn">Воспользоваться предложением</a>
                </div>
            </div>
        `).join('');

        // Добавляем ограниченное предложение
        container.innerHTML += `
            <div class="limited-offer">
                <h3>🔥 ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ!</h3>
                <p>Только сегодня - двойные бонусы ко всем пакетам UC!</p>
                <a href="#packages" class="btn">Успеть получить</a>
            </div>
        `;
    },

    // Рендер опций поддержки
    renderSupportOptions() {
        const container = document.querySelector('.support-options');
        if (!container) return;

        container.innerHTML = `
            <div class="support-option featured">
                <div class="support-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <h3>Онлайн-чат</h3>
                <p>Получите мгновенную помощь через наш онлайн-чат. Среднее время ответа - 2 минуты.</p>
                <div class="response-time">⚡ Ответ за 2 минуты</div>
                <div class="live-chat-indicator">
                    <div class="status-dot"></div>
                    <span>Онлайн сейчас</span>
                </div>
                <a href="#" class="btn" onclick="App.startChat()">Начать чат</a>
            </div>
            
            <div class="support-option">
                <div class="support-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <h3>Электронная почта</h3>
                <p>Отправьте нам письмо и получите подробный ответ в течение часа.</p>
                <div class="response-time">⏱ Ответ за 1 час</div>
                <a href="mailto:support@pubguc.ru" class="btn">Написать</a>
            </div>
            
            <div class="support-option">
                <div class="support-icon">
                    <i class="fab fa-vk"></i>
                </div>
                <h3>Вконтакте</h3>
                <p>Свяжитесь с нами через Вконтакте для быстрой помощи в любое время.</p>
                <div class="response-time">⚡ Ответ за 5 минут</div>
                <a href="https://vk.com/club233812266" class="btn" target="_blank">Написать в Vk</a>
            </div>
        `;
    },

    // Инициализация таймеров обратного отсчета
    initCountdownTimers() {
        PROMOTIONS.forEach(promo => {
            if (promo.timer) {
                const timerElement = document.getElementById(`timer-${promo.id}`);
                if (timerElement) {
                    Utils.createCountdown(promo.timer, timerElement);
                }
            }
        });
    },

    // Инициализация анимаций при скролле
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Наблюдаем за элементами для анимации
        document.querySelectorAll('.package-card, .step, .advantage, .review').forEach(el => {
            observer.observe(el);
        });
    },

    // Инициализация оптимизаций производительности
    initPerformanceOptimizations() {
        // Ленивая загрузка изображений
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Оптимизация скролла
        this.initSmoothScroll();
    },
// Добавьте эти методы в объект App:

initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('pubguc-theme') || 'dark';
    
    // Устанавливаем начальную тему
    document.documentElement.setAttribute('data-theme', currentTheme);
    this.updateThemeIcon(currentTheme);
    
    // Обработчик переключения темы
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('pubguc-theme', newTheme);
            this.updateThemeIcon(newTheme);
            
            Utils.showNotification(`Тема изменена на ${newTheme === 'dark' ? 'тёмную' : 'светлую'}`, 'success');
        });
    }
},

updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-moon';
            themeToggle.title = 'Переключить на светлую тему';
        } else {
            icon.className = 'fas fa-sun';
            themeToggle.title = 'Переключить на тёмную тему';
        }
    }
},
    // Инициализация плавного скролла
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    Utils.scrollToElement(targetId.replace('#', ''));
                }
            });
        });
    },

    // Инициализация обработчиков событий
    initEventHandlers() {
        // Обработчик для аккордеонов
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('accordion-header')) {
                const accordion = e.target.closest('.accordion');
                if (accordion) {
                    this.toggleAccordion(accordion);
                }
            }
        });

        // Обработчик для модальных окон
        this.initModalHandlers();

        // Обработчик для быстрых действий
        this.initQuickActions();

        // Инициализация переключения темы
        this.initTheme();
    },

    // Инициализация обработчиков модальных окон
    initModalHandlers() {
        // Закрытие модальных окон по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Закрытие по клику вне контента
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    },

    // Инициализация быстрых действий
    initQuickActions() {
        // Быстрая покупка
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                Utils.scrollToElement('packages');
            }
        });

        // Быстрый поиск по FAQ
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.getElementById('faqSearch');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
    },

    // Запуск анимаций
    startAnimations() {
        // Анимация счетчиков в статистике
        this.animateStats();

        // Анимация появления элементов
        this.startEntranceAnimations();

        // Анимация хедера при скролле
        this.initHeaderAnimation();
    },

    // Анимация счетчиков в статистике
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent.trim();
            let current = 0;
            
            const match = finalValue.match(/(\d+)/);
            if (!match) return;
            
            const target = parseInt(match[1]);
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            const stepTime = duration / steps;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + finalValue.replace(match[1], '');
                }
            }, stepTime);
        });
    },

    // Анимация появления элементов
    startEntranceAnimations() {
        const elements = document.querySelectorAll('.package-card, .step, .advantage');
        
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
            el.classList.add('animate-entrance');
        });
    },

    // Анимация хедера при скролле
    initHeaderAnimation() {
        const header = document.querySelector('header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(28, 28, 30, 0.98)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'rgba(28, 28, 30, 0.95)';
                header.style.backdropFilter = 'none';
            }

            // Прячем/показываем хедер при скролле
            if (window.scrollY > lastScrollY && window.scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = window.scrollY;
        });
    },

    // Вспомогательные методы
    toggleAccordion(accordion) {
        const content = accordion.querySelector('.accordion-content');
        const icon = accordion.querySelector('.accordion-header i');

        // Закрываем другие аккордеоны
        document.querySelectorAll('.accordion-content.active').forEach(item => {
            if (item !== content) {
                item.classList.remove('active');
                item.parentElement.classList.remove('active');
                item.previousElementSibling.querySelector('i').style.transform = 'rotate(0deg)';
            }
        });

        // Переключаем текущий
        content.classList.toggle('active');
        accordion.classList.toggle('active');
        icon.style.transform = content.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
    },

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    },

    // Методы для взаимодействия с пользователем
    startChat() {
        Utils.showNotification('Чат с поддержкой будет открыт в новом окне', 'info');
        // Здесь можно интегрировать сервис онлайн-чата
        setTimeout(() => {
            window.open('#', 'chat', 'width=400,height=600');
        }, 1000);
    },

    // Аналитика и метрики
    trackEvent(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        console.log(`📊 Analytics: ${category} - ${action} - ${label}`);
    }
};

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Обработчик ошибок
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    Utils.showNotification('Произошла ошибка. Пожалуйста, обновите страницу.', 'error');
});

// Обработчик offline/online статуса
window.addEventListener('online', () => {
    Utils.showNotification('Соединение восстановлено', 'success');
});

window.addEventListener('offline', () => {
    Utils.showNotification('Отсутствует интернет-соединение', 'warning');
});