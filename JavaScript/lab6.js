// 修复登录模态框功能
function initLoginModal() {
    const navLoginBtn = document.getElementById('navLoginBtn'); // 修改为新的ID
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeModal = document.getElementById('closeModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const registerLink = document.getElementById('registerLink');
    const loginLink = document.getElementById('loginLink');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // 打开登录模态框
    navLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'flex';
        registerModal.style.display = 'none';
    });

    // 关闭登录模态框
    closeModal.addEventListener('click', function() {
        loginModal.style.display = 'none';
    });

    // 关闭注册模态框
    closeRegisterModal.addEventListener('click', function() {
        registerModal.style.display = 'none';
    });

    // 点击模态框外部关闭
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    registerModal.addEventListener('click', function(e) {
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });

    // 注册链接点击事件 - 切换到注册模态框
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'flex';
    });

    // 登录链接点击事件 - 切换到登录模态框
    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });

    // 登录表单提交
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        showMessage(`欢迎回来，${username}！`);
        loginModal.style.display = 'none';
    });

    // 注册表单提交
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致！');
            return;
        }
        
        showMessage(`注册成功，欢迎 ${username}！`);
        registerModal.style.display = 'none';
    });

    // 密码强度实时验证
    function checkPasswordStrength(password) {
        const bar = document.getElementById('strength-bar');
        const text = document.getElementById('strength-text');

        // 重置
        bar.className = 'strength-bar';
        text.textContent = '请开始输入密码';

        if (!password) {
            return;
        }

        let strength = 0;
        // 长度检查
        if (password.length >= 8) strength += 1;
        // 包含小写字母
        if (/[a-z]/.test(password)) strength += 1;
        // 包含大写字母
        if (/[A-Z]/.test(password)) strength += 1;
        // 包含数字
        if (/[0-9]/.test(password)) strength += 1;
        // 包含特殊字符
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        // 根据得分判断强度
        if (password.length < 6) {
            bar.classList.add('strength-weak');
            text.textContent = '密码强度：弱 (建议至少6位)';
            text.style.color = '#e53935';
        } else if (strength < 4) {
            bar.classList.add('strength-medium');
            text.textContent = '密码强度：中';
            text.style.color = '#ffb300';
        } else {
            bar.classList.add('strength-strong');
            text.textContent = '密码强度：强';
            text.style.color = '#4caf50';
        }
    }

    // 在注册表单的密码输入框上绑定输入事件
    document.getElementById('reg-password').addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });
}

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showMessage('页面加载完成！');
        
        // 初始化所有功能
        initLoginModal(); // 添加这行代码！
        initBookInteractions();
        initFilterFunctionality();
        initPreviewModal();
        initCart();
        initDetailPopupActions();
        initImageZoom();
    }, 1500);
});

        // 购物车数据
        let cart = [];
        let cartCount = 0;
        let cartTotal = 0;
        
        // 筛选条件
        let activeFilters = {
            category: [],
            price: null,
            rating: null
        };
        
        document.addEventListener('DOMContentLoaded', function() {
            showLoading();
            setTimeout(() => {
                hideLoading();
                showMessage('页面加载完成！');
            }, 1500);
            
        });
        
        function showLoading() {
            document.querySelector('.loading-overlay').classList.add('show');
        }
        
        function hideLoading() {
            document.querySelector('.loading-overlay').classList.remove('show');
        }
        
        function showMessage(text) {
            const toast = document.querySelector('.message-toast');
            toast.querySelector('.toast-text').textContent = text;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
        
        // 其他原有函数保持不变...
        // [此处保留所有原有的JavaScript函数，包括initFilterFunctionality, updateActiveFilters, filterBooks等]
        
        // 初始化筛选功能
        function initFilterFunctionality() {
            // 分类筛选
            document.querySelectorAll('input[name="category"]').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        activeFilters.category.push(this.value);
                    } else {
                        activeFilters.category = activeFilters.category.filter(cat => cat !== this.value);
                    }
                    updateActiveFilters();
                    filterBooks();
                });
            });
            
            // 价格筛选
            document.querySelectorAll('input[name="price"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    if (this.checked) {
                        activeFilters.price = this.value;
                    } else if (activeFilters.price === this.value) {
                        activeFilters.price = null;
                    }
                    updateActiveFilters();
                    filterBooks();
                });
            });
            
            // 评分筛选
            document.querySelectorAll('input[name="rating"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    if (this.checked) {
                        activeFilters.rating = this.value;
                    } else if (activeFilters.rating === this.value) {
                        activeFilters.rating = null;
                    }
                    updateActiveFilters();
                    filterBooks();
                });
            });
        }
        
        // 更新活动筛选条件显示
        function updateActiveFilters() {
            const activeFiltersContainer = document.getElementById('activeFilters');
            activeFiltersContainer.innerHTML = '';
            
            // 分类筛选
            activeFilters.category.forEach(cat => {
                const filterElement = document.createElement('div');
                filterElement.className = 'active-filter';
                filterElement.innerHTML = `分类: ${getCategoryName(cat)} <span class="remove-filter" data-type="category" data-value="${cat}">×</span>`;
                activeFiltersContainer.appendChild(filterElement);
            });
            
            // 价格筛选
            if (activeFilters.price) {
                const filterElement = document.createElement('div');
                filterElement.className = 'active-filter';
                filterElement.innerHTML = `价格: ${getPriceRangeName(activeFilters.price)} <span class="remove-filter" data-type="price" data-value="${activeFilters.price}">×</span>`;
                activeFiltersContainer.appendChild(filterElement);
            }
            
            // 评分筛选
            if (activeFilters.rating) {
                const filterElement = document.createElement('div');
                filterElement.className = 'active-filter';
                filterElement.innerHTML = `评分: ${getRatingName(activeFilters.rating)} <span class="remove-filter" data-type="rating" data-value="${activeFilters.rating}">×</span>`;
                activeFiltersContainer.appendChild(filterElement);
            }
            
            // 添加移除筛选条件的事件
            document.querySelectorAll('.remove-filter').forEach(button => {
                button.addEventListener('click', function() {
                    const type = this.dataset.type;
                    const value = this.dataset.value;
                    
                    if (type === 'category') {
                        activeFilters.category = activeFilters.category.filter(cat => cat !== value);
                        document.querySelector(`input[name="category"][value="${value}"]`).checked = false;
                    } else if (type === 'price') {
                        activeFilters.price = null;
                        document.querySelector(`input[name="price"][value="${value}"]`).checked = false;
                    } else if (type === 'rating') {
                        activeFilters.rating = null;
                        document.querySelector(`input[name="rating"][value="${value}"]`).checked = false;
                    }
                    
                    updateActiveFilters();
                    filterBooks();
                });
            });
        }
        
        // 获取分类名称
        function getCategoryName(value) {
            const names = {
                'classic': '古典文学',
                'modern': '现代文学',
                'romance': '浪漫主义'
            };
            return names[value] || value;
        }
        
        // 获取价格范围名称
        function getPriceRangeName(value) {
            const names = {
                '0-50': '0-50元',
                '50-100': '50-100元',
                '100+': '100元以上'
            };
            return names[value] || value;
        }
        
        // 获取评分名称
        function getRatingName(value) {
            const names = {
                '4+': '4星以上',
                '3+': '3星以上',
                'all': '全部评分'
            };
            return names[value] || value;
        }
        
        // 筛选书籍
        function filterBooks() {
            const bookItems = document.querySelectorAll('.book-item');
            
            bookItems.forEach(item => {
                let show = true;
                
                // 分类筛选
                if (activeFilters.category.length > 0) {
                    const category = item.dataset.category;
                    if (!activeFilters.category.includes(category)) {
                        show = false;
                    }
                }
                
                // 价格筛选
                if (activeFilters.price) {
                    const price = parseFloat(item.dataset.price);
                    if (activeFilters.price === '0-50' && (price < 0 || price > 50)) {
                        show = false;
                    } else if (activeFilters.price === '50-100' && (price < 50 || price > 100)) {
                        show = false;
                    } else if (activeFilters.price === '100+' && price < 100) {
                        show = false;
                    }
                }
                
                // 评分筛选
                if (activeFilters.rating) {
                    const rating = parseFloat(item.dataset.rating);
                    if (activeFilters.rating === '4+' && rating < 4) {
                        show = false;
                    } else if (activeFilters.rating === '3+' && rating < 3) {
                        show = false;
                    }
                }
                
                // 显示或隐藏书籍
                if (show) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
        function initImageZoom() {
    const containers = document.querySelectorAll('.image-zoom-container');
    
    containers.forEach(container => {
        const img = container.querySelector('img');
        const lens = container.querySelector('.zoom-lens');
        const result = container.querySelector('.zoom-result');
        
        if (!img || !lens || !result) return;
        
        // 计算放大比例
        const cx = result.offsetWidth / lens.offsetWidth;
        const cy = result.offsetHeight / lens.offsetHeight;
        
        // 设置放大背景
        result.style.backgroundImage = `url('${img.src}')`;
        result.style.backgroundSize = `${img.width * cx}px ${img.height * cy}px`;
        
        container.addEventListener('mousemove', function(e) {
            const pos = getCursorPos(e, img);
            let x = pos.x - lens.offsetWidth / 2;
            let y = pos.y - lens.offsetHeight / 2;
            
            // 边界检查
            x = Math.max(0, Math.min(x, img.width - lens.offsetWidth));
            y = Math.max(0, Math.min(y, img.height - lens.offsetHeight));
            
            lens.style.left = x + 'px';
            lens.style.top = y + 'px';
            result.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
        });
        
        container.addEventListener('mouseenter', function() {
            lens.style.display = 'block';
            result.style.display = 'block';
        });
        
        container.addEventListener('mouseleave', function() {
            lens.style.display = 'none';
            result.style.display = 'none';
        });
    });
}     function getCursorPos(e, img) {
    const rect = img.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}  
        function initCart() {
            // 为所有"加入购物车"按钮添加事件
            document.querySelectorAll('.add-cart-btn').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    addToCart(this);
                });
            });
            // 加载本地存储的购物车数据
            loadCartFromStorage();
        }
        function addToCart(button) {
            const bookItem = button.closest('.book-item');
            const bookId = bookItem.dataset.bookId;
            const bookTitle = bookItem.querySelector('.book-title').textContent;
            const bookPrice = parseFloat(bookItem.querySelector('.price').textContent.replace('¥', ''));
            const bookImage = bookItem.querySelector('.book-image img').src;
            
            // 检查是否已在购物车
            const existingItem = cart.find(item => item.id === bookId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: bookId,
                    title: bookTitle,
                    price: bookPrice,
                    image: bookImage,
                    quantity: 1
                });
            }
            
            // 更新购物车
            updateCart();
            showMessage(`《${bookTitle}》已加入购物车`);
            
            // 添加点击动画
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        }
        
        function removeFromCart(bookId) {
            cart = cart.filter(item => item.id !== bookId);
            updateCart();
            showMessage('商品已从购物车移除');
        }
        
        function updateQuantity(bookId, change) {
            const item = cart.find(item => item.id === bookId);
            if (item) {
                item.quantity += change;
                if (item.quantity < 1) item.quantity = 1;
                updateCart();
            }
        }
        
        function updateCart() {
            // 计算总数量和总价
            cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            
            // 更新购物车徽章
            document.querySelectorAll('.cart-badge').forEach(badge => {
                badge.textContent = cartCount;
                if (cartCount > 0) {
                    badge.style.animation = 'none';
                    void badge.offsetWidth; // 触发重绘
                    badge.style.animation = 'bounce 0.5s';
                }
            });
            
            // 更新购物车下拉内容
            const cartItems = document.getElementById('cartItems');
            
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>购物车是空的</p>
                    </div>
                `;
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image"><img src="${item.image}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;"> </div>
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.title}</div>
                            <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                                <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                                <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                            </div>
                        </div>
                        <button class="remove-item" onclick="removeFromCart('${item.id}')">&times;</button>
                    </div>
                `).join('');
            }
            
            // 更新总价
            document.getElementById('cartTotal').textContent = cartTotal.toFixed(2);
            
            // 保存到本地存储
            saveCartToStorage();
        }
        
        function clearCart() {
            if (cart.length === 0) return;
            
            if (confirm('确定要清空购物车吗？')) {
                cart = [];
                updateCart();
                showMessage('购物车已清空');
            }
        }
        
        function checkout() {
            if (cart.length === 0) {
                showMessage('购物车是空的，请先添加商品');
                return;
            }
            
            showMessage(`开始结算，总计：¥${cartTotal.toFixed(2)}`);
            // 这里可以添加实际的结算逻辑
        }
        
        function saveCartToStorage() {
            localStorage.setItem('bookstore_cart', JSON.stringify(cart));
        }
        
        function loadCartFromStorage() {
            const savedCart = localStorage.getItem('bookstore_cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                updateCart();
            }
        }
        
        function initBookInteractions() {
            const actionButtons = document.querySelectorAll('.action-btn');
            
            actionButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const bookItem = this.closest('.book-item');
                    const bookTitle = bookItem.querySelector('.book-title').textContent;
                    
                    if (this.classList.contains('buy-now-btn')) {
                        showMessage(`开始购买《${bookTitle}》`);
                    } else if (this.classList.contains('view-detail-btn')) {
                        showMessage(`查看《${bookTitle}》详情`);
                    }
                });
            });
            
            const bookImages = document.querySelectorAll('.book-image');
            bookImages.forEach(image => {
                image.addEventListener('click', function() {
                    const bookTitle = this.closest('.book-item').querySelector('.book-title').textContent;
                    const modal = document.querySelector('.preview-modal');
                    const modalContent = modal.querySelector('.modal-content');
                    
                    while(modalContent.children.length > 1) {
                        modalContent.removeChild(modalContent.lastChild);
                    }
                    
                    const previewContent = document.createElement('div');
                    previewContent.style.padding = '2rem';
                    previewContent.innerHTML = `<h2>${bookTitle}</h2><p style="margin-top:1rem;color:#666">本书预览内容即将呈现...</p><div style="margin-top:2rem;display:flex;gap:1rem"><button style="padding:0.8rem 1.5rem;background:var(--primary-color);color:white;border:none;border-radius:4px;cursor:pointer">加入购物车</button><button style="padding:0.8rem 1.5rem;background:var(--accent-color);color:white;border:none;border-radius:4px;cursor:pointer">立即购买</button></div>`;
                    modalContent.appendChild(previewContent);
                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                });
            });
            
            // 关闭模态框
            document.querySelector('.close-modal').addEventListener('click', function() {
                document.querySelector('.preview-modal').classList.remove('show');
                document.body.style.overflow = 'auto';
            });
        }
        
        function initPreviewModal() {
            // 点击模态框外部关闭
            document.querySelector('.preview-modal').addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
            });
        }
         document.addEventListener('DOMContentLoaded', function() {
            // 初始化3D环形展示
                        init3DCarousel();
        });
        function init3DCarousel() {
            const track = document.getElementById('carouselTrack');
            const items = document.querySelectorAll('.carousel-item');
            const prevBtn = document.querySelector('.carousel-btn.prev');
            const nextBtn = document.querySelector('.carousel-btn.next');
            const speedUpBtn = document.getElementById('speedUp');
            const slowDownBtn = document.getElementById('slowDown');
            const toggleBtn = document.getElementById('toggleRotation');
            const indicatorsContainer = document.getElementById('carouselIndicators');
            
            const itemCount = items.length;
            const radius = 350; // 增加环形半径，避免图片交叉
            let currentAngle = 0;
            let autoRotate = true;
            let rotationSpeed = 0.008; // 降低默认旋转速度
            let rotationInterval;
            
            // 创建指示器
            items.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = 'carousel-indicator';
                if (index === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => rotateTo(index));
                indicatorsContainer.appendChild(indicator);
            });
            
            const indicators = document.querySelectorAll('.carousel-indicator');
            
            // 初始化3D布局
            function layoutItems() {
                const angleStep = (2 * Math.PI) / itemCount;
                
                items.forEach((item, index) => {
                    const angle = index * angleStep + currentAngle;
                    const x = Math.sin(angle) * radius;
                    const z = Math.cos(angle) * radius;
                    
                    // 设置3D变换，增加间距避免交叉
                    item.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${-angle}rad)`;
                    
                    // 根据Z轴位置调整层级、透明度和缩放
                    const scale = 0.8 + (z + radius) / (radius * 2) * 0.4; // 调整缩放范围
                    const opacity = 0.6 + (z + radius) / (radius * 2) * 0.4; // 调整透明度范围
                    
                    item.style.zIndex = Math.round(z + radius);
                    item.style.opacity = opacity;
                    
                    // 确保图片完全适应容器
                    const img = item.querySelector('img');
                    if (img) {
                        img.style.transform = `scale(${scale})`;
                        img.style.objectFit = 'cover';
                        img.style.width = '100%';
                        img.style.height = '100%';
                    }
                });
            }
            
            // 旋转到特定索引
            function rotateTo(index) {
                const targetAngle = -index * (2 * Math.PI) / itemCount;
                currentAngle = targetAngle;
                layoutItems();
                updateIndicators(index);
            }
            
            // 旋转指定角度
            function rotate(angle) {
                currentAngle += angle;
                layoutItems();
                
                // 计算当前激活的索引
                const activeIndex = Math.round((currentAngle % (2 * Math.PI)) / (2 * Math.PI) * itemCount) % itemCount;
                const normalizedIndex = activeIndex < 0 ? itemCount + activeIndex : activeIndex;
                updateIndicators(normalizedIndex);
            }
            
            // 更新指示器状态
            function updateIndicators(activeIndex) {
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === activeIndex);
                });
            }
            
            // 自动旋转
            function startAutoRotation() {
                if (autoRotate) {
                    rotationInterval = setInterval(() => {
                        rotate(-rotationSpeed);
                    }, 30);
                }
            }
            
            // 停止自动旋转
            function stopAutoRotation() {
                clearInterval(rotationInterval);
            }
            
            // 加速旋转
            function speedUp() {
                if (rotationSpeed < 0.03) {
                    rotationSpeed += 0.002;
                }
            }
            
            // 减速旋转
            function slowDown() {
                if (rotationSpeed > 0.005) {
                    rotationSpeed -= 0.002;
                }
            }
            
            // 切换旋转状态
            function toggleRotation() {
                autoRotate = !autoRotate;
                if (autoRotate) {
                    startAutoRotation();
                    toggleBtn.textContent = '暂停';
                } else {
                    stopAutoRotation();
                    toggleBtn.textContent = '继续';
                }
            }
            
            // 事件监听
            prevBtn.addEventListener('click', () => {
                stopAutoRotation();
                rotate((2 * Math.PI) / itemCount);
                setTimeout(() => {
                    if (autoRotate) startAutoRotation();
                }, 3000);
            });
            
            nextBtn.addEventListener('click', () => {
                stopAutoRotation();
                rotate(-(2 * Math.PI) / itemCount);
                setTimeout(() => {
                    if (autoRotate) startAutoRotation();
                }, 3000);
            });
            
            speedUpBtn.addEventListener('click', speedUp);
            slowDownBtn.addEventListener('click', slowDown);
            toggleBtn.addEventListener('click', toggleRotation);
            
            // 鼠标拖动控制
            let isDragging = false;
            let startX = 0;
            let startAngle = 0;
            
            track.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startAngle = currentAngle;
                stopAutoRotation();
                toggleBtn.textContent = '继续';
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const deltaX = e.clientX - startX;
                // 根据鼠标移动距离计算旋转角度
                currentAngle = startAngle + deltaX * 0.008; // 降低拖动灵敏度
                layoutItems();
            });
            
            document.addEventListener('mouseup', () => {
                isDragging = false;
                setTimeout(() => {
                    if (autoRotate) startAutoRotation();
                }, 2000);
            });
            
            // 触摸设备支持
            track.addEventListener('touchstart', (e) => {
                isDragging = true;
                startX = e.touches[0].clientX;
                startAngle = currentAngle;
                stopAutoRotation();
                toggleBtn.textContent = '继续';
            });
            
            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                
                const deltaX = e.touches[0].clientX - startX;
                currentAngle = startAngle + deltaX * 0.008;
                layoutItems();
            });
            
            document.addEventListener('touchend', () => {
                isDragging = false;
                setTimeout(() => {
                    if (autoRotate) startAutoRotation();
                }, 2000);
            });
            
            // 悬停暂停自动旋转
            track.addEventListener('mouseenter', () => {
                if (autoRotate) {
                    stopAutoRotation();
                }
            });
            
            track.addEventListener('mouseleave', () => {
                if (autoRotate) {
                    startAutoRotation();
                }
            });
            
            // 初始化
            layoutItems();
            startAutoRotation();
            
            // 窗口大小变化时重新布局
            window.addEventListener('resize', layoutItems);
            
            // 预加载图片
            preloadImages();
        }
        
        function preloadImages() {
            const images = [
                '../image/三体.jpg',
                '../image/月亮与六便士.jpg',
                '../image/老人与海.jpg',
                '../image/龙族.jpg',
                '../image/狼图腾.jpg',
                '../image/围城.jpg'
            ];
            
            images.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        }
      