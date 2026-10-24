
let cart = [];
let cartCount = 0;


function addToCart(productName, productPrice, buttonElement) {
   
    cartCount++;
    updateCartCount();
    
   
    cart.push({
        id: Date.now() + Math.random(),
        name: productName,
        price: productPrice,
        timestamp: new Date()
    });
    
    
    createFlyingAnimation(buttonElement);
    
  
    showNotification(productName);
    
    saveCartToLocalStorage();
    
}


function createFlyingAnimation(buttonElement) {
    
    const flyingItem = document.createElement('div');
    flyingItem.innerHTML = '';
    flyingItem.style.cssText = `
        position: fixed;
        left: ${buttonElement.getBoundingClientRect().left}px;
        top: ${buttonElement.getBoundingClientRect().top}px;
        font-size: 24px;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    document.body.appendChild(flyingItem);
    
    
    const cartIcon = document.querySelector('.user-actions a:last-child');
    const cartRect = cartIcon.getBoundingClientRect();
    
    
    setTimeout(() => {
        flyingItem.style.left = cartRect.left + cartRect.width/2 - 12 + 'px';
        flyingItem.style.top = cartRect.top + cartRect.height/2 - 12 + 'px';
        flyingItem.style.transform = 'scale(0.3)';
        flyingItem.style.opacity = '0';
    }, 10);
    
    
    setTimeout(() => {
        flyingItem.remove();
    }, 600);
    
    
    const cartIconElement = cartIcon;
    cartIconElement.style.transform = 'scale(1.2)';
    cartIconElement.style.transition = 'transform 0.3s ease';
    setTimeout(() => {
        cartIconElement.style.transform = 'scale(1)';
    }, 300);
}


function showNotification(productName) {
    
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div style="
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        ">
            <span style="font-size: 20px;">✓</span>
            <span>${productName} добавлен в корзину!</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    

    setTimeout(() => {
        if (notification) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 2000);
}


function updateCartCount() {
    
    let cartCounter = document.querySelector('.cart-counter');
    
    if (!cartCounter) {
        const cartLink = document.querySelector('.user-actions a:last-child');
        if (cartLink) {
            cartCounter = document.createElement('span');
            cartCounter.className = 'cart-counter';
            cartCounter.style.cssText = `
                background-color: #ff4444;
                color: white;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                font-size: 10px;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: -8px;
                right: -8px;
            `;
            cartLink.style.position = 'relative';
            cartLink.appendChild(cartCounter);
        }
    }
    
    if (cartCounter) {
        if (cartCount > 0) {
            cartCounter.textContent = cartCount > 99 ? '99+' : cartCount;
            cartCounter.style.display = 'inline-flex';
            cartCounter.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                if (cartCounter) cartCounter.style.animation = '';
            }, 500);
        } else {
            cartCounter.style.display = 'none';
        }
    }
}


function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount);
}


function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedCount = localStorage.getItem('cartCount');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartCount = parseInt(savedCount) || 0;
        updateCartCount();
    }
}


function clearCart() {
    cart = [];
    cartCount = 0;
    updateCartCount();
    saveCartToLocalStorage();
    showNotification('Корзина очищена', 'info');
}


function getCartTotal() {
    return cart.reduce((total, item) => {
        const price = parseInt(item.price.replace(/[^\d]/g, ''));
        return total + price;
    }, 0);
}


function initAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');
    
    buttons.forEach(button => {
        
        button.removeEventListener('click', handleAddToCart);
        
        button.addEventListener('click', handleAddToCart);
    });
}


function handleAddToCart(e) {
    e.preventDefault();
    
    
    const productCard = this.closest('.product-card');
    if (!productCard) return;
    
    const productName = productCard.querySelector('.product-title')?.textContent;
    const productPrice = productCard.querySelector('.product-price')?.textContent;
    
    if (productName && productPrice) {
        
        addToCart(productName, productPrice, this);
        
        
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    }
}


function showCart() {
    console.log('Корзина:', cart);
    console.log('Общая сумма:', getCartTotal());
    return { items: cart, total: getCartTotal() };
}


function addAnimationStyles() {
    if (document.getElementById('cart-animation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'cart-animation-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }
        
        .add-to-cart {
            transition: transform 0.15s ease, background-color 0.2s;
        }
        
        .add-to-cart:active {
            transform: scale(0.95);
        }
        
        .add-to-cart:hover {
            background-color: #333;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
}


function initCart() {
    addAnimationStyles();
    loadCartFromLocalStorage();
    initAddToCartButtons();
    
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                initAddToCartButtons();
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
} else {
    initCart();
}