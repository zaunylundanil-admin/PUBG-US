// Функционал пакетов UC
const Packages = {
    // Мифические пакеты
    mythicalPackages: [
        {
            id: 6,
            name: "Мифический",
            uc: 12000,
            price: 8999,
            bonus: 1000,
            popular: false,
            mythical: true,
            savings: "Экономия 35%",
            features: [
                "Мгновенная доставка", 
                "Поддержка 24/7", 
                "Безопасная оплата", 
                "Максимальные бонусы", 
                "Приоритетная доставка", 
                "Персональный менеджер",
                "⭐ Эксклюзивный бонус",
                "🎁 Подарочный набор"
            ],
            limited: true,
            available: true
        },
        {
            id: 7, 
            name: "Легенда",
            uc: 25000,
            price: 17999,
            bonus: 2500,
            popular: false,
            mythical: true,
            savings: "Экономия 40%",
            features: [
                "Мгновенная доставка",
                "Поддержка 24/7", 
                "Безопасная оплата",
                "Эксклюзивные бонусы",
                "Приоритетная доставка",
                "Персональный менеджер",
                "⭐ VIP поддержка",
                "🎁 Эксклюзивные скины",
                "⚡ Самый выгодный курс"
            ],
            limited: true,
            available: true
        }
    ],

    // Таймер для мифических пакетов
    mythicalTimer: null,
    timeLeft: 24 * 600 * 60, // 24 часа в секундах

    // Инициализация секции пакетов
    init() {
        this.renderPackages();
        this.renderMythicalPackages();
        this.initPackageComparison();
        this.initEventListeners();
        this.startMythicalTimer();
    },

    // Рендер обычных пакетов UC
    renderPackages() {
        const container = document.querySelector('.packages-grid');
        if (!container) return;

        const regularPackages = UC_PACKAGES.filter(pkg => !pkg.mythical);
        container.innerHTML = regularPackages.map(pkg => this.createPackageCard(pkg)).join('');
    },

    // Рендер мифических пакетов
    renderMythicalPackages() {
        // Создаем контейнер для мифических пакетов если его нет
        let mythicalContainer = document.querySelector('.mythical-packages');
        if (!mythicalContainer) {
            const packagesSection = document.querySelector('.packages');
            if (!packagesSection) return;

            mythicalContainer = document.createElement('div');
            mythicalContainer.className = 'mythical-packages';
            mythicalContainer.innerHTML = `
                <div class="mythical-header">
                    <h3 class="mythical-title">⚡ МИФИЧЕСКИЕ ПАКЕТЫ</h3>
                    <div class="mythical-timer" id="mythicalTimer">
                        До конца акции: <span id="timerDisplay">24:00:00</span>
                    </div>
                </div>
                <div class="mythical-grid" id="mythicalGrid"></div>
            `;
            packagesSection.appendChild(mythicalContainer);
        }

        const mythicalGrid = document.getElementById('mythicalGrid');
        if (mythicalGrid) {
            mythicalGrid.innerHTML = this.mythicalPackages
                .filter(pkg => pkg.available)
                .map(pkg => this.createMythicalPackageCard(pkg))
                .join('');
        }
    },

    // Создание карточки обычного пакета
    createPackageCard(pkg) {
        const isPopular = pkg.popular ? 'popular' : '';
        const totalUC = pkg.uc + pkg.bonus;
        
        return `
            <div class="package-card ${isPopular}" data-package-id="${pkg.id}">
                <h3>${pkg.name}</h3>
                <div class="uc-amount">${Utils.formatNumber(totalUC)} UC</div>
                <div class="price">${Utils.formatPrice(pkg.price)}</div>
                <div class="bonus">+ бонус ${Utils.formatNumber(pkg.bonus)} UC</div>
                ${pkg.savings ? `<div class="savings">${pkg.savings}</div>` : ''}
                
                <ul class="package-features">
                    ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                
                <button class="btn add-to-cart" 
                    data-id="${pkg.id}"
                    data-name="${pkg.name} пакет"
                    data-uc="${totalUC}"
                    data-price="${pkg.price}">
                    Купить сейчас
                </button>
                
                <div class="package-meta">
                    <span>⭐ Самый выгодный</span>
                    <span>⚡ Мгновенная доставка</span>
                </div>
            </div>
        `;
    },

    // Создание карточки мифического пакета
    createMythicalPackageCard(pkg) {
        const totalUC = pkg.uc + pkg.bonus;
        const pricePerUC = (pkg.price / totalUC).toFixed(2);
        
        return `
            <div class="package-card mythical" data-package-id="${pkg.id}">
                <div class="mythical-badge">🔥 МИФИЧЕСКИЙ</div>
                <div class="limited-badge">⏰ ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ</div>
                
                <h3>${pkg.name}</h3>
                <div class="uc-amount mythical-uc">${Utils.formatNumber(totalUC)} UC</div>
                <div class="price mythical-price">${Utils.formatPrice(pkg.price)}</div>
                <div class="bonus mythical-bonus">+ БОНУС ${Utils.formatNumber(pkg.bonus)} UC</div>
                
                <div class="price-per-uc">
                    💰 Всего ${pricePerUC} ₽ за 1 UC
                </div>
                
                ${pkg.savings ? `<div class="savings mythical-savings">${pkg.savings}</div>` : ''}
                
                <ul class="package-features mythical-features">
                    ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                
                <button class="btn btn-mythical add-to-cart" 
                    data-id="${pkg.id}"
                    data-name="${pkg.name} мифический пакет"
                    data-uc="${totalUC}"
                    data-price="${pkg.price}">
                    🎁 Получить эксклюзив
                </button>
                
                <div class="package-meta mythical-meta">
                    <span>⭐ Эксклюзивное предложение</span>
                    <span>⚡ Только сегодня</span>
                    <span>🎯 Лучшее предложение</span>
                </div>
            </div>
        `;
    },

    // Запуск таймера для мифических пакетов
    startMythicalTimer() {
        this.updateTimerDisplay();
        
        this.mythicalTimer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.endMythicalSale();
            }
        }, 1000);
    },

    // Обновление отображения таймера
    updateTimerDisplay() {
        const timerElement = document.getElementById('timerDisplay');
        if (!timerElement) return;

        const hours = Math.floor(this.timeLeft / 3600);
        const minutes = Math.floor((this.timeLeft % 3600) / 60);
        const seconds = this.timeLeft % 60;

        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Меняем цвет при малом времени
        if (this.timeLeft < 3600) { // Меньше часа
            timerElement.style.color = '#ff3a2d';
            timerElement.style.animation = 'pulse 1s infinite';
        }
    },

    // Завершение распродажи мифических пакетов
    endMythicalSale() {
        clearInterval(this.mythicalTimer);
        
        // Помечаем пакеты как недоступные
        this.mythicalPackages.forEach(pkg => {
            pkg.available = false;
        });

        // Обновляем отображение
        this.renderMythicalPackages();
        
        // Показываем уведомление
        Utils.showNotification('Время действия мифических пакетов истекло!', 'warning');
    },

    // Случайная активация мифических пакетов
    activateRandomMythical() {
        // 10% шанс активации при посещении
        if (Math.random() < 0.1) {
            this.mythicalPackages.forEach(pkg => {
                pkg.available = true;
            });
            this.renderMythicalPackages();
            Utils.showNotification('🎉 Вам доступны эксклюзивные мифические пакеты!', 'success');
        }
    },

    // Получить лучший мифический пакет
    getBestMythicalPackage() {
        const availableMythical = this.mythicalPackages.filter(pkg => pkg.available);
        if (availableMythical.length === 0) return null;

        return availableMythical.reduce((best, current) => {
            const bestValue = (best.uc + best.bonus) / best.price;
            const currentValue = (current.uc + current.bonus) / current.price;
            return currentValue > bestValue ? current : best;
        });
    },

    // Проверить доступность мифических пакетов
    checkMythicalAvailability() {
        return this.mythicalPackages.some(pkg => pkg.available);
    },

    // Получить статистику по пакетам
    getPackageStats() {
        const allPackages = [...UC_PACKAGES, ...this.mythicalPackages];
        const availablePackages = allPackages.filter(pkg => !pkg.mythical || pkg.available);
        
        return {
            totalPackages: availablePackages.length,
            mythicalAvailable: this.checkMythicalAvailability(),
            bestValue: availablePackages.reduce((best, pkg) => {
                const value = (pkg.uc + pkg.bonus) / pkg.price;
                return value > best.value ? { pkg, value } : best;
            }, { pkg: null, value: 0 })
        };
    },

    // Инициализация сравнения пакетов
    initPackageComparison() {
        // Можно добавить функционал сравнения пакетов
        console.log('Package comparison initialized');
    },

    // Инициализация обработчиков событий
    initEventListeners() {
        // Обработчики для карточек пакетов
        document.addEventListener('click', (e) => {
            const packageCard = e.target.closest('.package-card');
            if (packageCard) {
                this.handlePackageClick(packageCard);
            }
        });

        // Анимации при наведении
        document.addEventListener('mouseover', (e) => {
            const packageCard = e.target.closest('.package-card');
            if (packageCard) {
                if (packageCard.classList.contains('mythical')) {
                    packageCard.style.transform = 'translateY(-10px) scale(1.05)';
                    packageCard.style.boxShadow = '0 20px 40px rgba(255, 215, 0, 0.3)';
                } else {
                    packageCard.style.transform = 'translateY(-10px) scale(1.02)';
                }
            }
        });

        document.addEventListener('mouseout', (e) => {
            const packageCard = e.target.closest('.package-card');
            if (packageCard) {
                packageCard.style.transform = 'translateY(0) scale(1)';
                if (packageCard.classList.contains('mythical')) {
                    packageCard.style.boxShadow = '';
                }
            }
        });

        // Специальные эффекты для мифических пакетов
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-mythical')) {
                this.handleMythicalPurchase(e.target.closest('.btn-mythical'));
            }
        });
    },

    // Обработчик клика по пакету
    handlePackageClick(card) {
        const packageId = card.dataset.packageId;
        const pkg = [...UC_PACKAGES, ...this.mythicalPackages].find(p => p.id == packageId);
        
        if (pkg) {
            console.log('Selected package:', pkg);
            
            // Анимация выбора
            if (pkg.mythical) {
                card.style.boxShadow = '0 0 40px rgba(255, 215, 0, 0.5)';
            } else {
                card.style.boxShadow = '0 0 30px rgba(255, 146, 16, 0.5)';
            }
            
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 500);
        }
    },

    // Обработчик покупки мифического пакета
    handleMythicalPurchase(button) {
        // Специальные эффекты для мифических покупок
        button.innerHTML = '🎉 ВЫ ПОЛУЧАЕТЕ ЭКСКЛЮЗИВ!';
        button.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
        button.style.color = '#000';
        
        setTimeout(() => {
            button.innerHTML = '🎁 Получить эксклюзив';
            button.style.background = '';
            button.style.color = '';
        }, 2000);

        Utils.showNotification('🎊 Поздравляем с выбором мифического пакета!', 'success');
    },

    // Получить пакет по ID
    getPackageById(id) {
        return [...UC_PACKAGES, ...this.mythicalPackages].find(pkg => pkg.id == id);
    },

    // Рекомендовать пакет на основе бюджета
    recommendPackage(budget) {
        const allPackages = [...UC_PACKAGES, ...this.mythicalPackages.filter(p => p.available)];
        return allPackages
            .filter(pkg => pkg.price <= budget)
            .sort((a, b) => (b.uc / b.price) - (a.uc / a.price))[0];
    },

    // Рассчитать стоимость за 1 UC
    calculatePricePerUC(packageId) {
        const pkg = this.getPackageById(packageId);
        if (!pkg) return null;
        
        const totalUC = pkg.uc + pkg.bonus;
        return (pkg.price / totalUC).toFixed(2);
    }
};