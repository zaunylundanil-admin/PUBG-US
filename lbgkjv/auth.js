// auth.js - УНИВЕРСАЛЬНАЯ СИСТЕМА АВТОРИЗАЦИИ С АДМИНКОЙ
const AuthManager = {
    STORAGE_KEY: 'pubg_uc_current_user',
    USERS_KEY: 'pubg_uc_users',
    TRANSACTIONS_KEY: 'pubg_uc_transactions',
    ADMIN_EMAIL: 'admin@pubguc.ru',
    
    init() {
        this.createDefaultAdmin();
        this.checkAuthState();
        this.setupEventListeners();
        console.log('🔐 Auth system initialized');
    },

    createDefaultAdmin() {
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
        const adminExists = users.find(user => user.email === this.ADMIN_EMAIL);
        
        if (!adminExists) {
            const adminUser = {
                id: 1,
                name: 'Administrator',
                email: this.ADMIN_EMAIL,
                password: 'admin123',
                isAdmin: true,
                registrationDate: new Date().toISOString(),
                pubgId: ''
            };
            users.push(adminUser);
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            console.log('🔐 Default admin user created');
        }
    },

    checkAuthState() {
        const currentUser = this.getCurrentUser();
        this.updateUI(currentUser);
    },

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    isAdmin(user = null) {
        const currentUser = user || this.getCurrentUser();
        return currentUser && currentUser.isAdmin === true;
    },

    updateUI(user) {
        const guestMenu = document.getElementById('guest-menu');
        const userMenu = document.getElementById('user-menu');
        const userName = document.querySelector('.user-name');
        const userAvatar = document.querySelector('.user-avatar');
        const adminOnlyElements = document.querySelectorAll('.admin-only');

        if (user) {
            // Пользователь авторизован
            if (guestMenu) guestMenu.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
            if (userName) userName.textContent = user.name;
            if (userAvatar) {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                userAvatar.textContent = initials;
                
                // Добавляем корону для админа
                if (this.isAdmin(user)) {
                    userAvatar.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
                    userAvatar.innerHTML = '<i class="fas fa-crown"></i>';
                }
            }

            // Показываем/скрываем элементы для администратора
            adminOnlyElements.forEach(el => {
                el.style.display = this.isAdmin(user) ? 'block' : 'none';
            });

        } else {
            // Гость
            if (guestMenu) guestMenu.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
            
            // Скрываем все элементы для администратора
            adminOnlyElements.forEach(el => {
                el.style.display = 'none';
            });
        }
    },

    setupEventListeners() {
        // Кнопки входа и регистрации
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAuthModal('login');
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Обработчики для модальных окон
        this.setupModalHandlers();
    },

    setupModalHandlers() {
        // Закрытие модальных окон
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('close')) {
                this.closeModals();
            }
        });

        // Переключение между вкладками
        const authTabs = document.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchAuthTab(tabName);
            });
        });

        // Переключение между формами
        const switchToRegister = document.querySelector('.switch-to-register');
        const switchToLogin = document.querySelector('.switch-to-login');

        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchAuthTab('register');
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchAuthTab('login');
            });
        }

        // Обработка форм
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    },

    showAuthModal(defaultTab = 'login') {
        this.closeModals();
        
        // Создаем модальное окно авторизации
        const authModalHTML = `
            <div class="modal auth-modal" id="authModal" style="display: block;">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <div class="auth-tabs">
                        <button class="auth-tab ${defaultTab === 'login' ? 'active' : ''}" data-tab="login">Вход</button>
                        <button class="auth-tab ${defaultTab === 'register' ? 'active' : ''}" data-tab="register">Регистрация</button>
                    </div>
                    
                    <form id="loginForm" class="auth-form ${defaultTab === 'login' ? 'active' : ''}">
                        <div class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" class="form-control" required placeholder="Ваш email">
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Пароль</label>
                            <input type="password" id="loginPassword" class="form-control" required placeholder="Ваш пароль">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-success" style="width: 100%;">Войти</button>
                        </div>
                        <div class="form-footer">
                            Нет аккаунта? <a href="#" class="switch-to-register">Зарегистрироваться</a>
                        </div>
                    </form>

                    <form id="registerForm" class="auth-form ${defaultTab === 'register' ? 'active' : ''}">
                        <div class="form-group">
                            <label for="registerName">Имя</label>
                            <input type="text" id="registerName" class="form-control" required placeholder="Ваше имя">
                        </div>
                        <div class="form-group">
                            <label for="registerEmail">Email</label>
                            <input type="email" id="registerEmail" class="form-control" required placeholder="Ваш email">
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">Пароль</label>
                            <input type="password" id="registerPassword" class="form-control" required placeholder="Придумайте пароль" minlength="6">
                        </div>
                        <div class="form-group">
                            <label for="registerPubgId">PUBG ID (опционально)</label>
                            <input type="text" id="registerPubgId" class="form-control" placeholder="Ваш PUBG ID">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-success" style="width: 100%;">Зарегистрироваться</button>
                        </div>
                        <div class="form-footer">
                            Уже есть аккаунт? <a href="#" class="switch-to-login">Войти</a>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', authModalHTML);
        
        // Переустанавливаем обработчики для нового модального окна
        this.setupModalHandlers();
    },

    switchAuthTab(tabName) {
        // Обновляем активные вкладки
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');

        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });

        forms.forEach(form => {
            form.classList.toggle('active', form.id === `${tabName}Form`);
        });
    },

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.remove();
        });
    },

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const user = this.authenticateUser(email, password);
            if (user) {
                this.setCurrentUser(user);
                this.closeModals();
                this.showNotification('Успешный вход!');
                this.updateUI(user);
            } else {
                this.showNotification('Неверный email или пароль', 'error');
            }
        } catch (error) {
            this.showNotification('Ошибка при входе', 'error');
        }
    },

    async handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const pubgId = document.getElementById('registerPubgId').value;

        try {
            const user = this.registerUser(name, email, password, pubgId);
            if (user) {
                this.setCurrentUser(user);
                this.closeModals();
                this.showNotification('Регистрация успешна!');
                this.updateUI(user);
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    },

    authenticateUser(email, password) {
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
        return users.find(user => user.email === email && user.password === password);
    },

    registerUser(name, email, password, pubgId = '') {
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
        
        // Проверяем, существует ли пользователь
        if (users.find(user => user.email === email)) {
            throw new Error('Пользователь с таким email уже существует');
        }

        // Создаем нового пользователя
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            pubgId,
            isAdmin: false,
            registrationDate: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        
        return newUser;
    },

    setCurrentUser(user) {
        // Не сохраняем пароль в текущей сессии
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userWithoutPassword));
    },

    logout() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateUI(null);
        this.showNotification('Вы вышли из системы');
        
        // Если на странице админки, переходим на главную
        if (window.location.pathname.includes('admin.html') || 
            window.location.pathname.includes('vk-publish.html')) {
            window.location.href = 'index.html';
        }
    },

    showNotification(message, type = 'success') {
        // Универсальная функция показа уведомлений
        const notification = document.createElement('div');
        notification.className = `notification ${type === 'error' ? 'error' : ''}`;
        notification.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.classList.add('hiding');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },

    // Методы для работы с транзакциями
    getAllTransactions() {
        try {
            return JSON.parse(localStorage.getItem(this.TRANSACTIONS_KEY)) || [];
        } catch (error) {
            console.error('Error getting transactions:', error);
            return [];
        }
    },

    getAllUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
        } catch (error) {
            console.error('Error getting users:', error);
            return [];
        }
    },

    saveTransaction(transaction) {
        const transactions = this.getAllTransactions();
        transaction.id = Date.now();
        transaction.date = new Date().toISOString();
        transaction.status = 'completed';
        transactions.push(transaction);
        localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions));
        return transaction;
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    AuthManager.init();
});