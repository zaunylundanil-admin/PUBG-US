// Функционал FAQ
const FAQ = {
    // Данные вопросов и ответов
    questions: [
        {
            id: 1,
            question: "Безопасно ли покупать UC у вас?",
            answer: "Да, абсолютно безопасно. Мы используем официальные методы пополнения счета и не требуем доступ к вашему аккаунту. Все операции проводятся через официальные платформы оплаты. Наш сервис работает с 2018 года и имеет тысячи довольных клиентов.",
            category: "safety",
            featured: true
        },
        {
            id: 2,
            question: "Как быстро я получу UC после оплаты?",
            answer: "В большинстве случаев доставка происходит в течение 5-15 минут после оплаты. В редких случаях, при высокой нагрузке на серверы PUBG Mobile, доставка может занять до 24 часов. Мы всегда уведомляем клиентов о статусе заказа.",
            category: "delivery",
            featured: true
        },
        {
            id: 3,
            question: "Что если я не получу свой заказ?",
            answer: "Мы гарантируем возврат средств в полном объеме, если вы не получите свой заказ в течение 24 часов. Для этого необходимо обратиться в нашу службу поддержки с номером заказа. Возврат производится в течение 1-3 рабочих дней.",
            category: "payments",
            featured: true
        },
        {
            id: 4,
            question: "Какие способы оплаты вы принимаете?",
            answer: "Мы принимаем банковские карты Visa и Mastercard, электронные кошельки (QIWI, WebMoney, Яндекс.Деньги), а также оплату с мобильного счета. Все платежи защищены SSL-шифрованием и проходят через проверенные платежные системы.",
            category: "payments",
            featured: false
        },
        {
            id: 5,
            question: "Нужно ли предоставлять пароль от аккаунта?",
            answer: "Нет, мы никогда не запрашиваем пароль от вашего аккаунта PUBG Mobile. Для доставки UC нам необходим только ваш PUBG ID и никнейм. Берегите свои данные и никому их не сообщайте.",
            category: "safety",
            featured: true
        },
        {
            id: 6,
            question: "Есть ли ограничения по количеству покупок?",
            answer: "Да, существуют ограничения, установленные разработчиками PUBG Mobile. Обычно можно приобретать до 20,000 UC в сутки. При превышении лимита доставка может быть отложена до следующих суток.",
            category: "limits",
            featured: false
        },
        {
            id: 7,
            question: "Работаете ли вы с регионами кроме России?",
            answer: "Да, мы работаем со всеми регионами, где доступна PUBG Mobile. Однако способы оплаты и цены могут отличаться в зависимости от региона. Уточняйте детали у нашего менеджера.",
            category: "regions",
            featured: false
        },
        {
            id: 8,
            question: "Предоставляете ли вы чек или подтверждение покупки?",
            answer: "Да, после успешной оплаты мы отправляем на вашу почту электронный чек с деталями заказа. Также вы всегда можете запросить его у службы поддержки.",
            category: "documents",
            featured: false
        },
        {
            id: 9,
            question: "Что такое бонусные UC и как их получить?",
            answer: "Бонусные UC - это дополнительные монеты, которые мы дарим к каждому пакету. Они автоматически добавляются к основной сумме. Также мы регулярно проводим акции с увеличенными бонусами.",
            category: "bonuses",
            featured: false
        },
        {
            id: 10,
            question: "Можно ли купить UC в подарок другу?",
            answer: "Да, конечно! При оформлении заказа укажите PUBG ID и никнейм друга. Мы доставим UC на его аккаунт. Также у нас есть специальные подарочные сертификаты.",
            category: "gifts",
            featured: true
        }
    ],

    // Текущая категория
    currentCategory: 'all',
    
    // Поисковый запрос
    searchQuery: '',

    // Инициализация
    init() {
        this.renderFAQ();
        this.initSearch();
        this.initCategories();
        this.initAccordions();
        this.initEventListeners();
    },

    // Рендер FAQ
    renderFAQ() {
        const container = document.querySelector('.faq-container');
        if (!container) return;

        const filteredQuestions = this.getFilteredQuestions();
        
        container.innerHTML = `
            ${this.createSearch()}
            ${this.createCategories()}
            <div class="faq-accordions">
                ${filteredQuestions.map(q => this.createAccordion(q)).join('')}
            </div>
            ${this.createContactPrompt()}
        `;

        this.initAccordions();
    },

    // Создание поиска
    createSearch() {
        return `
            <div class="faq-search">
                <input type="text" placeholder="Поиск по вопросам..." id="faqSearch">
                <i class="fas fa-search"></i>
            </div>
        `;
    },

    // Создание категорий
    createCategories() {
        const categories = this.getCategories();
        
        return `
            <div class="faq-categories">
                <button class="faq-category active" data-category="all">Все вопросы</button>
                ${categories.map(cat => `
                    <button class="faq-category" data-category="${cat.id}">
                        ${cat.name} (${cat.count})
                    </button>
                `).join('')}
            </div>
        `;
    },

    // Создание аккордеона
    createAccordion(question) {
        const isFeatured = question.featured ? 'featured' : '';
        
        return `
            <div class="accordion ${isFeatured}" data-category="${question.category}" data-question-id="${question.id}">
                <div class="accordion-header">
                    <span>${question.question}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="accordion-content">
                    <p>${question.answer}</p>
                    ${this.createQuestionMeta(question)}
                </div>
            </div>
        `;
    },

    // Создание мета-информации вопроса
    createQuestionMeta(question) {
        return `
            <div class="question-meta">
                <span class="question-category">Категория: ${this.getCategoryName(question.category)}</span>
                ${question.featured ? '<span class="question-featured">⭐ Частый вопрос</span>' : ''}
            </div>
        `;
    },

    // Создание призыва к обращению
    createContactPrompt() {
        return `
            <div class="faq-contact">
                <h3>Не нашли ответ на свой вопрос?</h3>
                <p>Наша служба поддержки готова помочь вам 24/7</p>
                <a href="#support" class="btn">Связаться с поддержкой</a>
            </div>
        `;
    },

    // Получить отфильтрованные вопросы
    getFilteredQuestions() {
        let filtered = this.questions;

        // Фильтр по категории
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(q => q.category === this.currentCategory);
        }

        // Фильтр по поиску
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(q => 
                q.question.toLowerCase().includes(query) || 
                q.answer.toLowerCase().includes(query)
            );
        }

        return filtered;
    },

    // Получить категории
    getCategories() {
        const categories = {};
        
        this.questions.forEach(q => {
            if (!categories[q.category]) {
                categories[q.category] = {
                    id: q.category,
                    name: this.getCategoryName(q.category),
                    count: 0
                };
            }
            categories[q.category].count++;
        });

        return Object.values(categories);
    },

    // Получить название категории
    getCategoryName(categoryId) {
        const names = {
            'safety': 'Безопасность',
            'delivery': 'Доставка',
            'payments': 'Оплата',
            'limits': 'Лимиты',
            'regions': 'Регионы',
            'documents': 'Документы',
            'bonuses': 'Бонусы',
            'gifts': 'Подарки'
        };
        
        return names[categoryId] || categoryId;
    },

    // Инициализация поиска
    initSearch() {
        const searchInput = document.getElementById('faqSearch');
        if (!searchInput) return;

        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                this.searchQuery = e.target.value.trim();
                this.renderFAQ();
            }, 300);
        });

        // Очистка поиска
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.target.value = '';
                this.searchQuery = '';
                this.renderFAQ();
            }
        });
    },

    // Инициализация категорий
    initCategories() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('faq-category')) {
                const category = e.target.dataset.category;
                this.setCategory(category);
            }
        });
    },

    // Установить категорию
    setCategory(category) {
        this.currentCategory = category;
        
        // Обновляем активную кнопку
        document.querySelectorAll('.faq-category').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.renderFAQ();
    },

    // Инициализация аккордеонов
    initAccordions() {
        document.querySelectorAll('.accordion-header').forEach(button => {
            button.addEventListener('click', () => {
                this.toggleAccordion(button);
            });
        });
    },

    // Переключение аккордеона
    toggleAccordion(button) {
        const accordion = button.parentElement;
        const content = button.nextElementSibling;
        const icon = button.querySelector('i');

        // Закрываем другие аккордеоны
        document.querySelectorAll('.accordion-content').forEach(item => {
            if (item !== content && item.classList.contains('active')) {
                item.classList.remove('active');
                item.parentElement.classList.remove('active');
                item.previousElementSibling.querySelector('i').style.transform = 'rotate(0deg)';
            }
        });

        // Переключаем текущий аккордеон
        content.classList.toggle('active');
        accordion.classList.toggle('active');
        
        if (content.classList.contains('active')) {
            icon.style.transform = 'rotate(180deg)';
            this.trackQuestionView(accordion.dataset.questionId);
        } else {
            icon.style.transform = 'rotate(0deg)';
        }
    },

    // Отслеживание просмотра вопроса
    trackQuestionView(questionId) {
        // Можно добавить аналитику
        console.log('Question viewed:', questionId);
    },

    // Инициализация обработчиков событий
    initEventListeners() {
        // Плавная прокрутка к FAQ из других разделов
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href="#faq"]')) {
                e.preventDefault();
                Utils.scrollToElement('faq');
            }
        });

        // Быстрые ссылки
        this.initQuickLinks();
    },

    // Инициализация быстрых ссылок
    initQuickLinks() {
        const quickLinksHTML = `
            <div class="faq-quick-links">
                <a href="#support" class="quick-link">
                    <i class="fas fa-headset"></i>
                    <span>Онлайн-поддержка</span>
                </a>
                <a href="tel:+79991234567" class="quick-link">
                    <i class="fas fa-phone"></i>
                    <span>Позвонить нам</span>
                </a>
                <a href="mailto:support@pubguc.ru" class="quick-link">
                    <i class="fas fa-envelope"></i>
                    <span>Написать на почту</span>
                </a>
                <a href="#" class="quick-link" onclick="Utils.copyToClipboard('@pubguc_support')">
                    <i class="fab fa-vk"></i>
                    <span>Вконтакте</span>
                </a>
            </div>
        `;

        const contactPrompt = document.querySelector('.faq-contact');
        if (contactPrompt) {
            contactPrompt.insertAdjacentHTML('afterend', quickLinksHTML);
        }
    },

    // Поиск вопроса по ключевым словам
    searchQuestions(keywords) {
        return this.questions.filter(q => 
            keywords.some(keyword => 
                q.question.toLowerCase().includes(keyword.toLowerCase()) ||
                q.answer.toLowerCase().includes(keyword.toLowerCase())
            )
        );
    },

    // Получить популярные вопросы
    getPopularQuestions() {
        return this.questions.filter(q => q.featured);
    },

    // Добавить новый вопрос
    addQuestion(question, answer, category = 'general') {
        const newQuestion = {
            id: this.questions.length + 1,
            question: question,
            answer: answer,
            category: category,
            featured: false
        };

        this.questions.push(newQuestion);
        this.renderFAQ();
        
        return newQuestion.id;
    }
};