// cart.js - добавьте этот метод в конец файла
function processOrder(orderData) {
    // Сохраняем транзакцию через AuthManager
    const transaction = AuthManager.saveTransaction(orderData);
    
    // Показываем уведомление
    AuthManager.showNotification('Заказ успешно оформлен!');
    
    // Очищаем корзину
    clearCart();
    
    return transaction;
}
const Cart = {
    // Ключ для localStorage
    STORAGE_KEY: 'pubg_uc_cart',

    // Получить содержимое корзины
    getCart() {
        return Utils.getLocalStorage(this.STORAGE_KEY, []);
    },

    // Добавить товар в корзину
    addToCart(item) {
        const cart = this.getCart();
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...item,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }

        Utils.setLocalStorage(this.STORAGE_KEY, cart);
        this.updateCartCount();
        this.showAddToCartNotification(item.name);
        
        // Отправляем событие об обновлении корзины
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
        
        return true;
    },

    // Удалить товар из корзины
    removeFromCart(itemId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== itemId);
        Utils.setLocalStorage(this.STORAGE_KEY, cart);
        this.updateCartCount();
        
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
        return true;
    },

    // Обновить количество товара
    updateQuantity(itemId, quantity) {
        if (quantity < 1) {
            return this.removeFromCart(itemId);
        }

        const cart = this.getCart();
        const item = cart.find(item => item.id === itemId);
        
        if (item) {
            item.quantity = quantity;
            Utils.setLocalStorage(this.STORAGE_KEY, cart);
            this.updateCartCount();
            
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
        }
        
        return true;
    },

    // Очистить корзину
    clearCart() {
        Utils.setLocalStorage(this.STORAGE_KEY, []);
        this.updateCartCount();
        
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
        return true;
    },

    // Получить общее количество товаров
    getTotalItems() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Получить общую стоимость
    getTotalPrice() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Обновить счетчик корзины в шапке
    updateCartCount() {
        const countElements = document.querySelectorAll('.cart-count');
        const totalItems = this.getTotalItems();
        
        countElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    },

    // Показать уведомление о добавлении в корзину
    showAddToCartNotification(productName) {
        Utils.showNotification(`"${productName}" добавлен в корзину!`, 'success');
    },

    // Инициализация обработчиков событий корзины
    init() {
        // Обновляем счетчик при загрузке страницы
        this.updateCartCount();

        // Обработчик для кнопок "Добавить в корзину"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
                const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                
                const item = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    uc: parseInt(button.dataset.uc),
                    price: parseInt(button.dataset.price),
                    image: button.dataset.image || ''
                };

                this.addToCart(item);

                // Анимация кнопки
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            }
        });

        // Слушаем события обновления корзины
        window.addEventListener('cartUpdated', (e) => {
            console.log('Корзина обновлена:', e.detail);
        });

        console.log('Cart system initialized');
    }
};
