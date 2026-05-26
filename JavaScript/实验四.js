// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 显示加载动画
    showLoading();
    
    // 模拟数据加载
    setTimeout(() => {
        hideLoading();
        showMessage('页面加载完成！');
    }, 1500);
    
    // 返回顶部按钮逻辑
    initBackToTop();
    
    // 购物车功能
    initCart();
    
    // 图片预览功能
    initPreview();
    
    // 筛选功能
    initFilters();
    
    // 悬停效果
    initHoverEffects();
});

// 返回顶部功能
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 购物车功能
function initCart() {
    let cartCount = 0;
    const cartButtons = document.querySelectorAll('.add-cart');
    const cartBadges = document.querySelectorAll('.cart-count, .cart-badge');
    
    cartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const bookCard = this.closest('.book-card');
            const bookTitle = bookCard.querySelector('h3').textContent;
            const bookPrice = bookCard.querySelector('.price').textContent;
            
            cartCount++;
            updateCartCount(cartCount);
            showMessage(`《${bookTitle}》已加入购物车 - ${bookPrice}`);
            
            // 添加动画效果
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // 悬浮购物车点击事件
    document.querySelector('.floating-cart').addEventListener('click', () => {
        showMessage(`购物车中有 ${cartCount} 件商品`);
    });
}

// 更新购物车数量
function updateCartCount(count) {
    const cartBadges = document.querySelectorAll('.cart-count, .cart-badge');
    cartBadges.forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
            badge.style.animation = 'bounce 0.5s';
            setTimeout(() => {
                badge.style.animation = '';
            }, 500);
        }
    });
}

// 图片预览功能
function initPreview() {
    const previewButtons = document.querySelectorAll('.preview-btn');
    const previewModal = document.querySelector('.preview-modal');
    const closeModal = document.querySelector('.close-modal');
    const previewImage = document.querySelector('.preview-image');
    const previewTitle = document.querySelector('.preview-title');
    const previewAuthor = document.querySelector('.preview-author');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const bookCard = this.closest('.book-card');
            const imgSrc = bookCard.querySelector('img').src;
            const title = bookCard.querySelector('h3').textContent;
            const author = bookCard.querySelector('.author').textContent;
            
            previewImage.src = imgSrc;
            previewTitle.textContent = title;
            previewAuthor.textContent = author;
            
            previewModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // 关闭模态框
    closeModal.addEventListener('click', closePreview);
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            closePreview();
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePreview();
        }
    });
}

function closePreview() {
    document.querySelector('.preview-modal').classList.remove('show');
    document.body.style.overflow = '';
}

// 筛选功能
function initFilters() {
    const filterInputs = document.querySelectorAll('.filter-menu input');
    
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            showLoading();
            
            // 模拟筛选请求
            setTimeout(() => {
                hideLoading();
                showMessage('筛选条件已更新');
                
                // 这里可以添加实际的筛选逻辑
                filterBooks();
            }, 800);
        });
    });
}

function filterBooks() {
    // 实际的筛选逻辑实现
    console.log('执行图书筛选...');
}

// 悬停效果增强
function initHoverEffects() {
    const bookCards = document.querySelectorAll('.book-card');
    
    bookCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });
}

// 显示消息提示
function showMessage(text) {
    const toast = document.querySelector('.message-toast');
    const toastText = toast.querySelector('.toast-text');
    
    toastText.textContent = text;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 显示加载动画
function showLoading() {
    document.querySelector('.loading-overlay').classList.add('show');
}

// 隐藏加载动画
function hideLoading() {
    document.querySelector('.loading-overlay').classList.remove('show');
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: scale(1);
        }
        40%, 43% {
            transform: scale(1.3);
        }
        70% {
            transform: scale(1.1);
        }
        90% {
            transform: scale(1.03);
        }
    }
    
    .book-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(style);