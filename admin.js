// admin.js
const AdminManager = {
    currentSort: { field: 'id', direction: 'desc' },
    currentFilters: {},

    init() {
        this.checkAdminAccess();
        this.setupEventListeners();
        this.loadDashboard();
        this.loadTransactions();
        this.loadUsers();
    },

    checkAdminAccess() {
        const currentUser = AuthManager.getCurrentUser();
        if (!currentUser || !AuthManager.isAdmin(currentUser)) {
            alert('Доступ запрещен. Только для администраторов.');
            window.location.href = 'index.html';
            return;
        }
    },

    setupEventListeners() {
        // Табы
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Сортировка таблиц
        document.querySelectorAll('th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const field = th.getAttribute('data-sort');
                this.sortTable(field);
            });
        });

        // Фильтры транзакций
        const statusFilter = document.getElementById('status-filter');
        const userFilter = document.getElementById('user-filter');
        const searchTransactions = document.getElementById('search-transactions');
        const resetFilters = document.getElementById('reset-filters');

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.loadTransactions();
            });
        }

        if (userFilter) {
            userFilter.addEventListener('change', (e) => {
                this.currentFilters.userId = e.target.value;
                this.loadTransactions();
            });
        }

        if (searchTransactions) {
            searchTransactions.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.loadTransactions();
            });
        }

        if (resetFilters) {
            resetFilters.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Фильтры пользователей
        const roleFilter = document.getElementById('role-filter');
        const searchUsers = document.getElementById('search-users');

        if (roleFilter) {
            roleFilter.addEventListener('change', (e) => {
                this.currentFilters.role = e.target.value;
                this.loadUsers();
            });
        }

        if (searchUsers) {
            searchUsers.addEventListener('input', (e) => {
                this.currentFilters.userSearch = e.target.value;
                this.loadUsers();
            });
        }

        // Экспорт
        const exportCsv = document.getElementById('export-csv');
        const exportJson = document.getElementById('export-json');

        if (exportCsv) {
            exportCsv.addEventListener('click', () => {
                this.exportToCSV();
            });
        }

        if (exportJson) {
            exportJson.addEventListener('click', () => {
                this.exportToJSON();
            });
        }
    },

    switchTab(tabName) {
        // Обновляем активные табы
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });

        document.querySelectorAll('.admin-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
    },

    loadDashboard() {
        const transactions = AuthManager.getAllTransactions();
        const users = AuthManager.getAllUsers();

        // Общая статистика
        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalUC = transactions.reduce((sum, t) => sum + t.ucAmount, 0);
        const regularUsers = users.filter(u => !u.isAdmin).length;

        document.getElementById('total-revenue').textContent = totalRevenue + ' руб.';
        document.getElementById('total-transactions').textContent = transactions.length;
        document.getElementById('total-users').textContent = regularUsers;
        document.getElementById('total-uc').textContent = totalUC;

        // Аналитика
        const avgOrderValue = transactions.length > 0 ? Math.round(totalRevenue / transactions.length) : 0;
        const revenueToday = this.getTodayRevenue(transactions);
        const activeUsers = this.getActiveUsersCount(transactions);

        document.getElementById('avg-order-value').textContent = avgOrderValue + ' руб.';
        document.getElementById('revenue-today').textContent = revenueToday + ' руб.';
        document.getElementById('active-users').textContent = activeUsers;

        // Последние транзакции
        this.loadRecentTransactions(transactions.slice(-5).reverse());
    },

    loadRecentTransactions(transactions) {
        const container = document.getElementById('recent-transactions');
        
        if (transactions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #aaa;">Нет транзакций</p>';
            return;
        }

        let html = '<table><thead><tr><th>ID</th><th>Пользователь</th><th>Товар</th><th>Сумма</th><th>Дата</th><th>Статус</th></tr></thead><tbody>';
        
        transactions.forEach(transaction => {
            const user = this.getUserById(transaction.userId);
            html += `
                <tr>
                    <td>${transaction.id}</td>
                    <td>${user ? user.name : 'Неизвестный'}</td>
                    <td>${transaction.productName}</td>
                    <td>${transaction.amount} руб.</td>
                    <td>${new Date(transaction.date).toLocaleDateString()}</td>
                    <td class="status-${transaction.status}">${this.getStatusText(transaction.status)}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    },

    loadTransactions() {
        let transactions = AuthManager.getAllTransactions();
        const users = AuthManager.getAllUsers();

        // Применяем фильтры
        if (this.currentFilters.status && this.currentFilters.status !== 'all') {
            transactions = transactions.filter(t => t.status === this.currentFilters.status);
        }

        if (this.currentFilters.userId && this.currentFilters.userId !== 'all') {
            transactions = transactions.filter(t => t.userId === parseInt(this.currentFilters.userId));
        }

        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            transactions = transactions.filter(t => 
                t.id.toString().includes(searchTerm) ||
                t.productName.toLowerCase().includes(searchTerm) ||
                t.pubgId.includes(searchTerm)
            );
        }

        // Сортируем
        transactions.sort((a, b) => {
            const aValue = a[this.currentSort.field];
            const bValue = b[this.currentSort.field];
            
            if (this.currentSort.direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        // Заполняем фильтр пользователей
        this.populateUserFilter(users);

        const tbody = document.getElementById('transactions-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #aaa;">Нет транзакций</td></tr>';
            return;
        }

        transactions.forEach(transaction => {
            const user = this.getUserById(transaction.userId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.id}</td>
                <td>
                    <div style="font-weight: 600;">${user ? user.name : 'Неизвестный'}</div>
                    <div style="font-size: 0.8em; color: #aaa;">${user ? user.email : 'N/A'}</div>
                </td>
                <td>${transaction.productName}</td>
                <td>${transaction.amount} руб.</td>
                <td>${transaction.ucAmount} UC</td>
                <td>${transaction.pubgId || 'N/A'}</td>
                <td>${new Date(transaction.date).toLocaleString()}</td>
                <td class="status-${transaction.status}">${this.getStatusText(transaction.status)}</td>
            `;
            tbody.appendChild(row);
        });
    },

    loadUsers() {
        let users = AuthManager.getAllUsers();
        const transactions = AuthManager.getAllTransactions();

        // Применяем фильтры
        if (this.currentFilters.role && this.currentFilters.role !== 'all') {
            users = users.filter(u => 
                this.currentFilters.role === 'admin' ? u.isAdmin : !u.isAdmin
            );
        }

        if (this.currentFilters.userSearch) {
            const searchTerm = this.currentFilters.userSearch.toLowerCase();
            users = users.filter(u => 
                u.name.toLowerCase().includes(searchTerm) ||
                u.email.toLowerCase().includes(searchTerm)
            );
        }

        const tbody = document.getElementById('users-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        users.forEach(user => {
            const userTransactions = transactions.filter(t => t.userId === user.id);
            const totalSpent = userTransactions.reduce((sum, t) => sum + t.amount, 0);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.pubgId || 'N/A'}</td>
                <td>${new Date(user.registrationDate).toLocaleDateString()}</td>
                <td>${userTransactions.length}</td>
                <td>${totalSpent} руб.</td>
                <td>
                    <span class="user-role ${user.isAdmin ? 'role-admin' : 'role-user'}">
                        ${user.isAdmin ? 'Админ' : 'Пользователь'}
                    </span>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    populateUserFilter(users) {
        const select = document.getElementById('user-filter');
        if (!select) return;
        
        // Сохраняем текущее значение
        const currentValue = select.value;
        
        // Очищаем и добавляем опции
        select.innerHTML = '<option value="all">Все пользователи</option>';
        
        users.forEach(user => {
            if (!user.isAdmin) { // Показываем только обычных пользователей
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.name} (${user.email})`;
                select.appendChild(option);
            }
        });
        
        // Восстанавливаем значение
        if (currentValue && select.querySelector(`option[value="${currentValue}"]`)) {
            select.value = currentValue;
        }
    },

    sortTable(field) {
        // Обновляем индикатор сортировки
        document.querySelectorAll('th').forEach(th => {
            th.innerHTML = th.innerHTML.replace(' ▼', '').replace(' ▲', '');
        });

        const currentTh = document.querySelector(`th[data-sort="${field}"]`);
        
        if (this.currentSort.field === field) {
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort.field = field;
            this.currentSort.direction = 'desc';
        }

        if (currentTh) {
            currentTh.innerHTML += this.currentSort.direction === 'asc' ? ' ▲' : ' ▼';
        }

        // Перезагружаем данные
        if (document.getElementById('transactions-tab')?.classList.contains('active')) {
            this.loadTransactions();
        } else if (document.getElementById('users-tab')?.classList.contains('active')) {
            this.loadUsers();
        }
    },

    resetFilters() {
        this.currentFilters = {};
        const statusFilter = document.getElementById('status-filter');
        const userFilter = document.getElementById('user-filter');
        const searchTransactions = document.getElementById('search-transactions');
        
        if (statusFilter) statusFilter.value = 'all';
        if (userFilter) userFilter.value = 'all';
        if (searchTransactions) searchTransactions.value = '';
        
        this.loadTransactions();
    },

    getStatusText(status) {
        const statusMap = {
            'completed': 'Завершено',
            'pending': 'В обработке',
            'cancelled': 'Отменено'
        };
        return statusMap[status] || status;
    },

    getUserById(userId) {
        const users = AuthManager.getAllUsers();
        return users.find(u => u.id === userId);
    },

    getTodayRevenue(transactions) {
        const today = new Date().toDateString();
        return transactions
            .filter(t => new Date(t.date).toDateString() === today)
            .reduce((sum, t) => sum + t.amount, 0);
    },

    getActiveUsersCount(transactions) {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        
        const activeUserIds = new Set(
            transactions
                .filter(t => new Date(t.date) > last30Days)
                .map(t => t.userId)
        );
        
        return activeUserIds.size;
    },

    exportToCSV() {
        const transactions = AuthManager.getAllTransactions();
        const users = AuthManager.getAllUsers();
        
        let csv = 'ID,Пользователь,Email,Товар,Сумма,UC,PUBG ID,Дата,Статус\n';
        
        transactions.forEach(transaction => {
            const user = this.getUserById(transaction.userId);
            csv += `"${transaction.id}","${user ? user.name : 'Неизвестный'}","${user ? user.email : 'N/A'}","${transaction.productName}","${transaction.amount}","${transaction.ucAmount}","${transaction.pubgId || 'N/A'}","${transaction.date}","${transaction.status}"\n`;
        });
        
        this.downloadFile(csv, 'transactions.csv', 'text/csv');
    },

    exportToJSON() {
        const transactions = AuthManager.getAllTransactions();
        const data = {
            exportDate: new Date().toISOString(),
            totalTransactions: transactions.length,
            transactions: transactions
        };
        
        this.downloadFile(JSON.stringify(data, null, 2), 'transactions.json', 'application/json');
    },

    downloadFile(content, fileName, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }
};