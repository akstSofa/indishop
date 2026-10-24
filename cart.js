
function addToCart(productName, productPrice, buttonElement, productImage, productCategory) {
  
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItemIndex = cart.findIndex(item => item.name === productName);
    
    if (existingItemIndex !== -1) {
      
        cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
        
        cart.push({
            id: Date.now() + Math.random(),
            name: productName,
            price: productPrice,
            image: productImage || getProductImage(productName),
            category: productCategory || getProductCategory(productName),
            quantity: 1,
            timestamp: new Date()
        });
    }
    

    localStorage.setItem('cart', JSON.stringify(cart));
    

    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    localStorage.setItem('cartCount', totalItems);
    

    updateCartCount();
    
    
    createFlyingAnimation(buttonElement);
    
    
    showNotification(productName);
    

}


function getProductImage(productName) {
    const images = {
        'Тренч': 'https://st-cdn.tsum.com/sig/5f74146dbb5d623de6459ce8df34a97d/width/400/i/a7/c0/47/9f/a7c5067c-ca87-4dc8-beef-8b15d64b1ebc.jpg',
        'Джинсы свободного кроя': 'https://st-cdn.tsum.com/sig/c5c0b01f8aa5874fb5939a3fd76a6383/width/400/i/25/fb/e7/77/f7b73741-dc2c-4e5c-a8ea-e865b07ec835.jpg',
        'Свитшот с вышивкой': 'https://st-cdn.tsum.com/sig/bdd972e01866ea3ca722867f7fcee025/width/400/i/0b/58/38/15/a16ea260-6f31-416a-957a-7331b76bd1b8.jpg',
        'Платье-мини джинсовое': 'https://st-cdn.tsum.com/sig/22302ecb1a4d4fef1acdd7824afad85e/width/400/i/68/a9/85/36/f0174c07-485f-469c-8d4e-225084f829a3.jpg',
        'Куртка демисезонная': 'https://st-cdn.tsum.com/sig/6e0c41572a3caeab1c53e15a635b390a/width/400/i/6b/26/b3/c3/d714be99-dc4b-4a4e-868c-c698ada9c10e.jpg',
        'Кроссовки белые': 'https://st-cdn.tsum.com/sig/a3fa4ebfba2f2d4d2c7dd41d6ed888c6/width/400/i/29/72/20/7d/f820e352-6cb4-4fe7-a5b6-5d5a8acd27d1.jpg',
        'Шарф': 'https://st-cdn.tsum.com/sig/d70baf812b57aeb9aeab65f1504ba196/width/400/i/58/0d/f9/11/16fac8f6-93ed-4db1-801d-8301e039547d.jpg',
        'Пижама шелковая': 'https://st-cdn.tsum.com/sig/41f445fd3fe709427332b9db8dbb898c/width/400/i/e2/ae/53/93/bb715f03-19a7-4e32-833d-0a428928cce4.jpg'
    };
    
    return images[productName] || 'https://via.placeholder.com/100x133?text=👕';
}


function getProductCategory(productName) {
    const categories = {
        'Тренч': 'Верхняя одежда',
        'Джинсы свободного кроя': 'Джинсы',
        'Свитшот с вышивкой': 'Свитшоты',
        'Платье-мини джинсовое': 'Платья',
        'Куртка демисезонная': 'Верхняя одежда',
        'Кроссовки белые': 'Обувь',
        'Шарф': 'Аксессуары',
        'Пижама шелковая': 'Домашняя одежда'
    };
    
    return categories[productName] || 'Одежда';
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


window.updateCartCount = function() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
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
        if (totalItems > 0) {
            cartCounter.textContent = totalItems > 99 ? '99+' : totalItems;
            cartCounter.style.display = 'inline-flex';
        } else {
            cartCounter.style.display = 'none';
        }
    }
};


function handleAddToCart(e) {
    e.preventDefault();
    
    const productCard = this.closest('.product-card');
    if (!productCard) return;
    
    const productName = productCard.querySelector('.product-title')?.textContent;
    const productPrice = productCard.querySelector('.product-price')?.textContent;
    const productCategory = productCard.querySelector('.product-category')?.textContent;
    
    let productImage = '';
    const productImageDiv = productCard.querySelector('.product-image');
    if (productImageDiv) {
        const bgImage = productImageDiv.style.backgroundImage;
        if (bgImage && bgImage !== 'none') {
            productImage = bgImage.replace(/url\(["']?(.*?)["']?\)/, '$1');
        }
    }
    
    if (productName && productPrice) {
        addToCart(productName, productPrice, this, productImage, productCategory);
    }
}


function initAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach(button => {
        button.removeEventListener('click', handleAddToCart);
        button.addEventListener('click', handleAddToCart);
    });
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
    updateCartCount();
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