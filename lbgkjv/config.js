// Конфигурация приложения
const CONFIG = {
    APP: {
        NAME: "PUBG UC STORE",
        VERSION: "1.0.0",
        CURRENCY: "руб.",
        CURRENCY_SYMBOL: "₽"
    },
    FEATURES: {
        ENABLE_REVIEWS: true,
        ENABLE_PROMO_TIMERS: true,
        ENABLE_CART: true,
        ENABLE_RATING_SYSTEM: true
    }
};

// Данные пакетов UC
const UC_PACKAGES = [
    {
        id: 1,
        name: "Начальный",
        uc: 325,
        price: 299,
        bonus: 5,
        popular: false,
        savings: "Экономия 10%",
        features: ["Мгновенная доставка", "Поддержка 24/7", "Безопасная оплата"]
    },
    {
        id: 2,
        name: "Игровой",
        uc: 660,
        price: 599,
        bonus: 15,
        popular: false,
        savings: "Экономия 15%",
        features: ["Мгновенная доставка", "Поддержка 24/7", "Безопасная оплата", "Бонусные UC"]
    },
    {
        id: 3,
        name: "Боевой",
        uc: 1800,
        price: 1499,
        bonus: 50,
        popular: true,
        savings: "Экономия 20%",
        features: ["Мгновенная доставка", "Поддержка 24/7", "Безопасная оплата", "Бонусные UC", "Приоритетная доставка"]
    },
    {
        id: 4,
        name: "Королевский",
        uc: 3850,
        price: 2999,
        bonus: 150,
        popular: false,
        savings: "Экономия 25%",
        features: ["Мгновенная доставка", "Поддержка 24/7", "Безопасная оплата", "Бонусные UC", "Приоритетная доставка", "Персональный менеджер"]
    },
    {
        id: 5,
        name: "Легендарный",
        uc: 8100,
        price: 5999,
        bonus: 400,
        popular: false,
        savings: "Экономия 30%",
        features: ["Мгновенная доставка", "Поддержка 24/7", "Безопасная оплата", "Бонусные UC", "Приоритетная доставка", "Персональный менеджер", "Эксклюзивные бонусы"]
    }
];

// Данные акций
const PROMOTIONS = [
    {
        id: 1,
        title: "Бонус за первую покупку",
        description: "Получите дополнительно 10% UC к вашему первому заказу! Акция действует для новых клиентов.",
        icon: "fas fa-gift",
        badge: "НОВИНКА",
        featured: true,
        timer: "2024-12-31T23:59:59",
        features: ["+10% бонусных UC", "Только для новых клиентов", "Действует 30 дней"]
    },
    {
        id: 2,
        title: "Приведи друга",
        description: "Приведите друга и получите 500 UC на ваш счет после его первой покупки",
        icon: "fas fa-users",
        badge: "ПОПУЛЯРНО",
        featured: false,
        features: ["500 UC за каждого друга", "Неограниченное количество", "Мгновенное начисление"]
    }
];

// Данные шагов покупки
const STEPS = [
    {
        number: 1,
        icon: "fas fa-gamepad",
        title: "Выберите пакет UC",
        description: "Выберите подходящий пакет UC из доступных вариантов",
        duration: "1 минута"
    },
    {
        number: 2,
        icon: "fas fa-user",
        title: "Введите данные аккаунта",
        description: "Укажите свой PUBG ID и никнейм для доставки UC",
        duration: "2 минуты"
    },
    {
        number: 3,
        icon: "fas fa-credit-card",
        title: "Оплатите заказ",
        description: "Выберите удобный способ оплаты из доступных вариантов",
        duration: "3 минуты"
    },
    {
        number: 4,
        icon: "fas fa-gift",
        title: "Получите UC",
        description: "Получите UC в течение 15 минут после успешной оплаты",
        duration: "5-15 минут"
    }
];

// Данные преимуществ
const ADVANTAGES = [
    {
        icon: "fas fa-bolt",
        title: "Мгновенная доставка",
        description: "UC зачисляются на ваш аккаунт в течение 5-15 минут после оплаты. Максимальное время доставки - 24 часа.",
        featured: true
    },
    {
        icon: "fas fa-shield-alt",
        title: "Безопасность",
        description: "Гарантируем безопасность вашего аккаунта и данных. Все платежи защищены SSL-шифрованием.",
        featured: true
    },
    {
        icon: "fas fa-percentage",
        title: "Лучшие цены",
        description: "Предлагаем UC по самым выгодным ценам на рынке с регулярными акциями и скидками.",
        featured: false
    },
    {
        icon: "fas fa-headset",
        title: "Поддержка 24/7",
        description: "Наша служба поддержки готова помочь в любое время суток на русском языке.",
        featured: false
    },
    {
        icon: "fas fa-gift",
        title: "Бонусы при покупке",
        description: "Дополнительные бонусные UC к каждому пакету и специальные предложения для постоянных клиентов.",
        featured: false
    },
    {
        icon: "fas fa-undo",
        title: "Гарантия возврата",
        description: "Вернем деньги в полном объеме, если UC не поступят на ваш аккаунт в течение 24 часов.",
        featured: false
    }
];