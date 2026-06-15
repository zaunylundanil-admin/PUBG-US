// Функционал отзывов
const Reviews = {
    // Данные отзывов
    reviews: [
        {
            id: 1,
            name: "Александр",
            rating: 5,
            text: "Заказывал UC впервые, все пришло за 5 минут! Очень доволен сервисом, буду обращаться еще. Поддержка отвечает быстро, все объяснили.",
            date: "2024-01-15",
            verified: true,
            helpful: 24,
            featured: true
        },
        {
            id: 2,
            name: "Мария",
            rating: 4,
            text: "Пользуюсь услугами этого магазина уже полгода, всегда все быстро и без проблем. Рекомендую! Цены адекватные, доставка мгновенная.",
            date: "2024-01-12",
            verified: true,
            helpful: 18,
            featured: false
        },
        {
            id: 3,
            name: "Дмитрий",
            rating: 5,
            text: "Лучшие цены, которые я нашел. Плюс быстрая доставка и отличная поддержка. 10/10! Уже порекомендовал друзьям.",
            date: "2024-01-10",
            verified: true,
            helpful: 32,
            featured: true
        },
        {
            id: 4,
            name: "Екатерина",
            rating: 5,
            text: "Очень переживала за безопасность, но все прошло идеально! UC пришли через 7 минут. Теперь только здесь покупаю.",
            date: "2024-01-08",
            verified: false,
            helpful: 15,
            featured: false
        },
        {
            id: 5,
            name: "Иван",
            rating: 4,
            text: "Хороший сервис, приятные цены. Единственное - один раз была задержка на 20 минут, но поддержка сразу все объяснила.",
            date: "2024-01-05",
            verified: true,
            helpful: 9,
            featured: false
        },
        {
            id: 6,
            name: "Ольга",
            rating: 5,
            text: "Покупала несколько раз, всегда все четко. Бонусы радуют! Отдельное спасибо менеджеру Алексею за помощь.",
            date: "2024-01-03",
            verified: true,
            helpful: 21,
            featured: false
        },
        {
            id: 7,
            name: "Сергей",
            rating: 5,
            text: "Быстрее всех на рынке! Проверил несколько магазинов - здесь лучшая комбинация цены и скорости. Рекомендую!",
            date: "2024-01-01",
            verified: true,
            helpful: 27,
            featured: true
        },
        {
            id: 8,
            name: "Анна",
            rating: 4,
            text: "Хороший магазин, все как обещают. Иногда бывают небольшие задержки в чате поддержки, но в целом все отлично.",
            date: "2023-12-28",
            verified: false,
            helpful: 6,
            featured: false
        }
    ],

    // Текущий фильтр
    currentFilter: 'all',
    
    // Видимые отзывы
    visibleReviews: 4,

    // Инициализация
    init() {
        this.renderReviews();
        this.initFilters();
        this.initReviewModal();
        this.initEventListeners();
        this.renderReviewsSummary();
    },

    // Рендер отзывов
    renderReviews() {
        const container = document.querySelector('.review-cards');
        if (!container) return;

        const filteredReviews = this.getFilteredReviews();
        const reviewsToShow = filteredReviews.slice(0, this.visibleReviews);

        container.innerHTML = reviewsToShow.map(review => this.createReviewCard(review)).join('');
        
        // Обновляем кнопку "Показать еще"
        this.updateLoadMoreButton(filteredReviews.length);
    },

    // Создание карточки отзыва
    createReviewCard(review) {
        const isFeatured = review.featured ? 'featured' : '';
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const date = new Date(review.date).toLocaleDateString('ru-RU');
        
        return `
            <div class="review ${isFeatured}" data-review-id="${review.id}">
                <div class="reviewer">
                    <div class="reviewer-avatar">${review.name[0]}</div>
                    <div class="reviewer-info">
                        <h4>${review.name} ${review.verified ? '✓' : ''}</h4>
                        <div class="review-date">${date}</div>
                        <div class="rating">${stars}</div>
                    </div>
                </div>
                <p>${review.text}</p>
                <div class="review-stats">
                    <div class="review-helpful" onclick="Reviews.markHelpful(${review.id})">
                        <i class="fas fa-thumbs-up"></i>
                        <span>Полезно (${review.helpful})</span>
                    </div>
                    <div class="review-verified">
                        ${review.verified ? '✓ Проверенная покупка' : ''}
                    </div>
                </div>
            </div>
        `;
    },

    // Получить отфильтрованные отзывы
    getFilteredReviews() {
        switch (this.currentFilter) {
            case '5-stars':
                return this.reviews.filter(r => r.rating === 5);
            case '4-stars':
                return this.reviews.filter(r => r.rating === 4);
            case 'verified':
                return this.reviews.filter(r => r.verified);
            case 'featured':
                return this.reviews.filter(r => r.featured);
            default:
                return this.reviews;
        }
    },

    // Инициализация фильтров
    initFilters() {
        const filtersContainer = document.querySelector('.review-filters');
        if (!filtersContainer) return;

        filtersContainer.innerHTML = `
            <button class="filter-btn active" data-filter="all">Все отзывы</button>
            <button class="filter-btn" data-filter="5-stars">⭐ 5 звезд</button>
            <button class="filter-btn" data-filter="4-stars">⭐ 4 звезды</button>
            <button class="filter-btn" data-filter="verified">✓ Проверенные</button>
            <button class="filter-btn" data-filter="featured">🔥 Лучшие</button>
        `;

        // Обработчики для фильтров
        filtersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            }
        });
    },

    // Установить фильтр
    setFilter(filter) {
        this.currentFilter = filter;
        this.visibleReviews = 4;
        
        // Обновляем активную кнопку
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.renderReviews();
    },

    // Инициализация модального окна отзыва
    initReviewModal() {
        const modal = document.getElementById('reviewModal');
        if (!modal) return;

        // Закрытие модального окна
        modal.querySelector('.close').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Закрытие при клике вне окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Обработка отправки формы
        document.getElementById('reviewForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReview();
        });

        // Рейтинг звездами
        this.initStarRating();
    },

    // Инициализация рейтинга звездами
    initStarRating() {
        const stars = document.querySelectorAll('.rating-input .star');
        let currentRating = 0;

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                currentRating = index + 1;
                this.updateStarRating(currentRating);
            });

            star.addEventListener('mouseenter', () => {
                this.updateStarRating(index + 1, true);
            });
        });

        document.querySelector('.rating-input').addEventListener('mouseleave', () => {
            this.updateStarRating(currentRating);
        });
    },

    // Обновление отображения звезд рейтинга
    updateStarRating(rating, isHover = false) {
        const stars = document.querySelectorAll('.rating-input .star');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
            star.style.color = index < rating ? 'var(--pubg-orange)' : '#666';
        });
    },

    // Отправить отзыв
    submitReview() {
        const name = document.getElementById('reviewName').value;
        const text = document.getElementById('reviewText').value;
        const stars = document.querySelectorAll('.rating-input .star.active').length;

        if (!name || !text || stars === 0) {
            Utils.showNotification('Заполните все поля и поставьте оценку', 'error');
            return;
        }

        const newReview = {
            id: this.reviews.length + 1,
            name: name,
            rating: stars,
            text: text,
            date: new Date().toISOString().split('T')[0],
            verified: false,
            helpful: 0,
            featured: false
        };

        this.reviews.unshift(newReview);
        this.visibleReviews = 4;
        this.renderReviews();
        this.renderReviewsSummary();

        document.getElementById('reviewModal').style.display = 'none';
        document.getElementById('reviewForm').reset();
        
        Utils.showNotification('Спасибо за ваш отзыв!', 'success');
    },

    // Отметить отзыв как полезный
    markHelpful(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.helpful++;
            this.renderReviews();
            Utils.showNotification('Спасибо за вашу оценку!', 'success');
        }
    },

    // Показать еще отзывы
    loadMoreReviews() {
        this.visibleReviews += 4;
        this.renderReviews();
    },

    // Обновить кнопку "Показать еще"
    updateLoadMoreButton(totalReviews) {
        const button = document.getElementById('load-more-reviews');
        if (button) {
            button.style.display = this.visibleReviews >= totalReviews ? 'none' : 'block';
        }
    },

    // Рендер сводки по отзывам
    renderReviewsSummary() {
        const totalReviews = this.reviews.length;
        const averageRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        const ratingDistribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};

        this.reviews.forEach(review => {
            ratingDistribution[review.rating]++;
        });

        const summaryHTML = `
            <div class="reviews-summary">
                <div class="average-rating">${averageRating.toFixed(1)}</div>
                <div class="rating-stars">${'★'.repeat(5)}</div>
                <div class="rating-count">На основе ${totalReviews} отзывов</div>
                
                <div class="rating-bars">
                    ${[5, 4, 3, 2, 1].map(stars => `
                        <div class="rating-bar">
                            <span>${stars} звезд</span>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: ${(ratingDistribution[stars] / totalReviews) * 100}%"></div>
                            </div>
                            <span>${ratingDistribution[stars]}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const summaryContainer = document.querySelector('.reviews-summary');
        if (summaryContainer) {
            summaryContainer.innerHTML = summaryHTML;
        }
    },

    // Инициализация обработчиков событий
    initEventListeners() {
        // Кнопка "Показать еще"
        document.getElementById('load-more-reviews')?.addEventListener('click', () => {
            this.loadMoreReviews();
        });

        // Кнопка "Оставить отзыв"
        document.getElementById('add-review-btn')?.addEventListener('click', () => {
            document.getElementById('reviewModal').style.display = 'block';
        });
    }
};