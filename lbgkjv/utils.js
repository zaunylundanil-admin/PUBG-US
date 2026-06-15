// Утилиты для приложения
const Utils = {
    // Форматирование цены
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ' + CONFIG.APP.CURRENCY_SYMBOL;
    },

    // Форматирование числа
    formatNumber(number) {
        return new Intl.NumberFormat('ru-RU').format(number);
    },

    // Склонение слов
    declension(number, titles) {
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[
            number % 100 > 4 && number % 100 < 20 
                ? 2 
                : cases[number % 10 < 5 ? number % 10 : 5]
        ];
    },

    // Генерация случайного ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Валидация email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Валидация номера телефона
    validatePhone(phone) {
        const re = /^[\+]?[78][-(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/;
        return re.test(phone.replace(/\s/g, ''));
    },

    // Показ уведомления
    showNotification: function(message, type = 'info') {
    try {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff3a2d' : 
                         type === 'success' ? '#4CAF50' : 
                         type === 'warning' ? '#ff9800' : '#2196F3'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            font-weight: 500;
            max-width: 400px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        // Возможность закрыть кликом
        notification.addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
        
    } catch (error) {
        // Резервный вывод в консоль если DOM не доступен
        console.log(`Notification [${type}]: ${message}`);
    }
},

    // Анимация счетчика
    animateCounter(element, target, duration = 2000) {
        const start = parseInt(element.textContent.replace(/\D/g, '')) || 0;
        const increment = target > start ? 1 : -1;
        const step = Math.abs(Math.floor(duration / (target - start)));
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = Utils.formatNumber(current) + (element.textContent.includes('%') ? '%' : '+');
            
            if (current === target) {
                clearInterval(timer);
            }
        }, step);
    },

    // Определение типа устройства
    getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "mobile";
        }
        return "desktop";
    },

    // Сохранение в localStorage с обработкой ошибок
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения в localStorage:', error);
            return false;
        }
    },

    // Чтение из localStorage с обработкой ошибок
    getLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Ошибка чтения из localStorage:', error);
            return defaultValue;
        }
    },

    // Копирование текста в буфер обмена
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            Utils.showNotification('Текст скопирован!', 'success');
            return true;
        } catch (error) {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            Utils.showNotification('Текст скопирован!', 'success');
            return true;
        }
    },

    // Форматирование времени
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },

    // Создание таймера обратного отсчета
    createCountdown(endTime, element) {
        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = new Date(endTime).getTime() - now;

            if (distance < 0) {
                element.innerHTML = 'Акция завершена';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            let timeString = '';
            if (days > 0) timeString += `${days}${Utils.declension(days, ['день', 'дня', 'дней'])} `;
            if (hours > 0) timeString += `${hours}${Utils.declension(hours, ['час', 'часа', 'часов'])} `;
            if (minutes > 0) timeString += `${minutes}${Utils.declension(minutes, ['минута', 'минуты', 'минут'])} `;
            timeString += `${seconds}${Utils.declension(seconds, ['секунда', 'секунды', 'секунд'])}`;

            element.innerHTML = timeString;
        };

        updateTimer();
        return setInterval(updateTimer, 1000);
    },

    // Плавная прокрутка к элементу
    scrollToElement(elementId, offset = 80) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Загрузка изображения с обработкой ошибок
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    // Генерация случайного цвета
    getRandomColor() {
        const colors = ['#ff3a2d', '#ff9210', '#4CAF50', '#2196F3', '#9C27B0'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    // Форматирование даты
    formatDate(date, format = 'ru-RU') {
        return new Intl.DateTimeFormat(format, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(date));
    }
};
init() 
{
    console.log('🚀 PUBG UC Store initializing...');
    
    try {
        // Проверяем необходимые зависимости
        if (typeof Utils === 'undefined') {
            throw new Error('Utils not loaded');
        }
        
        this.initSystems();
        this.initComponents();
        this.initEventHandlers();
        this.startAnimations();
        
        console.log('✅ PUBG UC Store initialized successfully');
        Utils.showNotification('Добро пожаловать в PUBG UC Store!', 'success');
        
    } catch (error) {
        console.error('💥 Initialization error:', error);
        
        // Показываем понятное сообщение об ошибке
        const errorMessage = `
            Не удалось загрузить приложение. 
            Возможные причины:
            • Проблемы с интернет-соединением
            • Браузер устарел
            • Блокировка скриптов
            
            Пожалуйста, обновите страницу или попробуйте позже.
        `.replace(/\n\s+/g, '\n').trim();
        
        if (typeof Utils !== 'undefined' && Utils.showNotification) {
            Utils.showNotification(errorMessage, 'error');
        } else {
            // Резервное сообщение
            document.body.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: #121212;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                ">
                    <div>
                        <h1 style="color: #ff3a2d; margin-bottom: 20px;">Ошибка загрузки</h1>
                        <p style="margin-bottom: 20px; line-height: 1.5;">${errorMessage}</p>
                        <button onclick="location.reload()" style="
                            background: #ff3a2d;
                            color: white;
                            border: none;
                            padding: 12px 30px;
                            border-radius: 25px;
                            cursor: pointer;
                            font-size: 16px;
                        ">Обновить страницу</button>
                    </div>
                </div>
            `;
        }
    }
}