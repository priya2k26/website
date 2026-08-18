// Global State Management
let currentState = {
    isLoggedIn: sessionStorage.getItem('isLoggedIn') === 'true',
    userEmail: sessionStorage.getItem('userEmail') || '',
    selectedTable: sessionStorage.getItem('selectedTable') ? parseInt(sessionStorage.getItem('selectedTable')) : null,
    selectedItems: JSON.parse(sessionStorage.getItem('selectedItems')) || [],
    currentOrderId: sessionStorage.getItem('currentOrderId') || null,
    currentOrder: JSON.parse(sessionStorage.getItem('currentOrder')) || null,
    orders: JSON.parse(localStorage.getItem('orders')) || [],
    tableStatuses: JSON.parse(localStorage.getItem('tableStatuses')) || {}
};

// Initialize table statuses
function initializeTableStatuses() {
    let changed = false;
    TABLES.forEach(table => {
        if (!currentState.tableStatuses[table.id]) {
            currentState.tableStatuses[table.id] = { status: 'available', orderId: null };
            changed = true;
        }
    });
    if (changed) {
        localStorage.setItem('tableStatuses', JSON.stringify(currentState.tableStatuses));
    }
}

// ==================== LOGIN PAGE ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeTableStatuses();
    
    // Check if on login page
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }
    
    // Check if user is logged in for other pages
    if (document.title.includes('Login') === false && 
        !currentState.isLoggedIn && 
        window.location.pathname !== '/website/index.html') {
        // Don't redirect if on login page
        if (!window.location.pathname.includes('index.html')) {
            // User is not logged in, let them access pages (they'll handle redirect)
        }
    }
    
    // Initialize table management page
    if (document.getElementById('tablesContainer')) {
        loadTableManagement();
    }
    
    // Initialize food selection page
    if (document.getElementById('menuContainer')) {
        loadFoodSelection();
    }
    
    // Initialize order confirmation page
    if (document.getElementById('confirmItemsList')) {
        loadOrderConfirmation();
    }
    
    // Initialize category pages
    if (document.getElementById('mainDishesContainer')) {
        loadMainDishes();
    }
    if (document.getElementById('sideDishesContainer')) {
        loadSideDishes();
    }
    if (document.getElementById('drinksContainer')) {
        loadDrinks();
    }
    if (document.getElementById('snacksContainer')) {
        loadSnacks();
    }
    if (document.getElementById('sweetsContainer')) {
        loadSweets();
    }
    if (document.getElementById('iceCreamContainer')) {
        loadIceCream();
    }
    
    // Initialize food categories page
    if (document.getElementById('categorySummary')) {
        loadFoodCategories();
    }
    
    // Initialize preparation tracking page
    if (document.getElementById('trackingItemsContainer')) {
        loadPreparationTracking();
    }
    
    // Initialize ready orders page
    if (document.getElementById('readyTablesContainer')) {
        loadReadyOrders();
    }
    
    // Initialize bill page
    if (document.getElementById('billItemsList')) {
        loadBill();
    }
    
    // Resume simulation for active orders
    currentState.orders.forEach(order => {
        if (!order.completed && order.orderStatus && order.orderStatus !== 'delivered') {
            simulateOrderPreparation(order.orderId);
        }
    });
    
    updateUserDisplay();
});

// ==================== AUTHENTICATION ====================
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate credentials
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
        currentState.isLoggedIn = true;
        currentState.userEmail = email;
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
        
        // Redirect to tables page
        transitionToPage('tables.html');
    } else {
        alert('Invalid email or password. Please try again.\nDemo: admin@restaurant.com / 123456');
    }
}

function logout() {
    currentState.isLoggedIn = false;
    currentState.userEmail = '';
    currentState.selectedTable = null;
    currentState.selectedItems = [];
    currentState.currentOrderId = null;
    
    sessionStorage.clear();
    
    transitionToPage('index.html');
}

function updateUserDisplay() {
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
        userDisplay.textContent = currentState.isLoggedIn ? currentState.userEmail : 'User';
    }
}

// ==================== TABLE MANAGEMENT ====================
function loadTableManagement() {
    const container = document.getElementById('tablesContainer');
    if (!container) return;
    container.innerHTML = '';
    
    TABLES.forEach((table, index) => {
        const status = currentState.tableStatuses[table.id] || { status: 'available' };
        const colorIndex = (index % 5) + 1; // 1 to 5
        const isOccupied = status.status === 'occupied';
        
        const row = document.createElement('div');
        row.className = `ro-table-row row-color-${colorIndex}`;
        row.style.animationDelay = `${index * 0.1}s`;
        
        let actionButtons = '';
        if (isOccupied) {
            actionButtons = `
                <div class="ro-badge" style="background:#ff5722; color:white; cursor:pointer; margin-right:15px; border: 1px solid #ff5722;" onclick="clearTable(${table.id})">
                    🗑️ CLEAR TABLE
                </div>
                <div class="ro-action-btn" onclick="goToTrackingForTable('${table.id}')" title="View Order" style="background:#ff5722; color:white; border-color:#ff5722;">
                    >
                </div>
            `;
        } else {
            actionButtons = `
                <div class="ro-badge badge-avail">
                    ✓ OPEN
                </div>
                <div class="ro-action-btn" style="background:#ff5722; color:white; border-color:#ff5722; width: 120px; border-radius: 8px;" onclick="selectTable(${table.id})" title="New Order">
                    + NEW ORDER
                </div>
            `;
        }

        row.innerHTML = `
            <div class="ro-table-pill pill-${colorIndex}">
                <div class="ro-pill-title">TABLE</div>
                <div class="ro-pill-number">${table.number}</div>
                <div class="ro-pill-icon">🪑</div>
            </div>
            <div class="ro-table-info">
                <div class="ro-status-line">
                    <div class="ro-dot ${isOccupied ? 'dot-occ' : 'dot-avail'}"></div>
                    <span class="${isOccupied ? 'text-occ' : `text-avail-${colorIndex}`}">${status.status.toUpperCase()}</span>
                </div>
                <div class="ro-order-details">
                    ${isOccupied ? `📄 Order ID: ${status.orderId}` : 'Ready for guests'}
                </div>
            </div>
            
            ${actionButtons}
        `;
        
        container.appendChild(row);
    });
}

function clearTable(tableId) {
    if (confirm('Are you sure you want to clear this table?')) {
        if (currentState.tableStatuses[tableId]) {
            currentState.tableStatuses[tableId] = { status: 'available', orderId: null };
            localStorage.setItem('tableStatuses', JSON.stringify(currentState.tableStatuses));
            loadTableManagement();
        }
    }
}

function selectTable(tableId) {
    currentState.selectedTable = tableId;
    sessionStorage.setItem('selectedTable', tableId);
    
    // Clear previous order data when selecting a new table for a new order
    currentState.selectedItems = [];
    sessionStorage.removeItem('selectedItems');
    currentState.currentOrderId = null;
    sessionStorage.removeItem('currentOrderId');
    currentState.currentOrder = null;
    sessionStorage.removeItem('currentOrder');
    
    window.location.href = 'food-selection.html'; // Direct navigation to guarantee it works
}

function transitionToPage(url) {
    const container = document.querySelector('.container') || document.querySelector('.login-container');
    if (container) {
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    } else {
        window.location.href = url;
    }
}

// ==================== FOOD SELECTION ====================
function loadFoodSelection() {
    const tableNumber = currentState.selectedTable;
    if (!tableNumber) {
        transitionToPage('tables.html');
        return;
    }
    
    document.getElementById('tableNumber').textContent = tableNumber;
    
    updateSelectedItemsPanel();
    // Default initialization
    if (typeof activeCategory === 'undefined') {
        window.activeCategory = 'Main Dish';
        window.activeTime = 'Morning';
    }
    renderMenuItems();
}

function filterMenu(category, btnElement) {
    window.activeCategory = category;
    
    // Update active class
    const tabs = document.querySelectorAll('.category-tab');
    if (tabs.length > 0) {
        tabs.forEach(btn => btn.classList.remove('active'));
        if (btnElement) btnElement.classList.add('active');
    }
    
    // Toggle time tabs
    const timeTabs = document.getElementById('timeTabsContainer');
    if (timeTabs) {
        if (category === 'Sweets' || category === 'Ice Cream') {
            timeTabs.style.display = 'none';
        } else {
            timeTabs.style.display = 'flex';
            if (window.activeTime === 'All' || !window.activeTime) {
                window.activeTime = 'Morning';
                document.querySelectorAll('.time-tab').forEach(b => b.classList.remove('active'));
                document.querySelector('.time-tab').classList.add('active');
            }
        }
    }
    
    renderMenuItems();
}

function filterTime(time, btnElement) {
    window.activeTime = time;
    
    const tabs = document.querySelectorAll('.time-tab');
    if (tabs.length > 0) {
        tabs.forEach(btn => btn.classList.remove('active'));
        if (btnElement) btnElement.classList.add('active');
    }
    
    renderMenuItems();
}

function renderMenuItems() {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;
    menuContainer.innerHTML = '';
    
    let cat = window.activeCategory || 'Main Dish';
    let time = window.activeTime || 'Morning';
    
    // If Sweets or Ice Cream, ignore time filter
    if (cat === 'Sweets' || cat === 'Ice Cream') {
        time = 'All';
    }
    
    const filteredItems = MENU_ITEMS.filter(item => {
        return item.category === cat && (item.timeOfDay === time || item.timeOfDay === 'All' || time === 'All');
    });
    
    const activeOrder = currentState.orders.find(o => o.tableNumber === currentState.selectedTable && !o.completed);
    const isDelivered = activeOrder && activeOrder.orderStatus === 'delivered';

    filteredItems.forEach(item => {
        const isOrdered = activeOrder && activeOrder.items.some(i => i.id === item.id);
        const itemCard = document.createElement('div');
        itemCard.className = 'menu-item-card' + (isOrdered && isDelivered ? ' delivered-item' : '');
        
        let onClickAction = '';
        let checkmarkHtml = '';
        
        if (isOrdered && isDelivered) {
            checkmarkHtml = '<div class="item-delivered-check">✓</div>';
            onClickAction = `onclick="openImageModal('${item.image || ''}', '${item.name}')"`;
            itemCard.style.cursor = 'pointer';
        }

        itemCard.innerHTML = `
            ${checkmarkHtml}
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="item-image" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 15px; display: block;" ${onClickAction}/>` : ''}
            <div class="item-header">
                <h4>${item.name}</h4>
                <span class="item-category">${item.category}</span>
            </div>
            <p class="item-description">${item.description}</p>
            <div class="item-footer">
                <span class="item-price">₹${item.price}</span>
                <button class="btn-add" onclick="addToSelectedItems(${item.id}, '${item.name}', ${item.price}, '${item.category}')">+ ADD</button>
            </div>
        `;
        
        menuContainer.appendChild(itemCard);
    });
}

function addToSelectedItems(itemId, itemName, itemPrice, itemCategory) {
    // Check if item already exists
    const existingItem = currentState.selectedItems.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        currentState.selectedItems.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            category: itemCategory,
            quantity: 1
        });
    }
    
    sessionStorage.setItem('selectedItems', JSON.stringify(currentState.selectedItems));
    updateSelectedItemsPanel();
}

function updateSelectedItemsPanel() {
    const listContainer = document.getElementById('selectedItemsList');
    listContainer.innerHTML = '';
    
    let totalPrice = 0;
    let totalItems = 0;
    
    currentState.selectedItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        totalItems += item.quantity;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'selected-item';
        
        itemElement.innerHTML = `
            <div class="selected-item-info">
                <h5>${item.name}</h5>
                <p class="item-category-small">${item.category}</p>
            </div>
            <div class="selected-item-quantity">
                <button onclick="decreaseQuantity(${item.id})">−</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <div class="selected-item-price">
                <p>₹${itemTotal}</p>
                <button class="btn-remove" onclick="removeFromSelectedItems(${item.id})">Remove</button>
            </div>
        `;
        
        listContainer.appendChild(itemElement);
    });
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = totalPrice;
    
    // Enable confirm button only if items are selected
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.disabled = currentState.selectedItems.length === 0;
}

function increaseQuantity(itemId) {
    const item = currentState.selectedItems.find(i => i.id === itemId);
    if (item) {
        item.quantity += 1;
        sessionStorage.setItem('selectedItems', JSON.stringify(currentState.selectedItems));
        updateSelectedItemsPanel();
    }
}

function decreaseQuantity(itemId) {
    const item = currentState.selectedItems.find(i => i.id === itemId);
    if (item) {
        item.quantity -= 1;
        if (item.quantity === 0) {
            removeFromSelectedItems(itemId);
        } else {
            sessionStorage.setItem('selectedItems', JSON.stringify(currentState.selectedItems));
            updateSelectedItemsPanel();
        }
    }
}

function removeFromSelectedItems(itemId) {
    currentState.selectedItems = currentState.selectedItems.filter(i => i.id !== itemId);
    sessionStorage.setItem('selectedItems', JSON.stringify(currentState.selectedItems));
    updateSelectedItemsPanel();
}

function proceedToConfirmation() {
    if (currentState.selectedItems.length === 0) {
        alert('Please select at least one item');
        return;
    }
    
    transitionToPage('order-confirmation.html');
}

// ==================== ORDER CONFIRMATION ====================
function loadOrderConfirmation() {
    if (!currentState.selectedTable || currentState.selectedItems.length === 0) {
        transitionToPage('tables.html');
        return;
    }
    
    // Generate Order ID
    currentState.currentOrderId = generateOrderId();
    
    document.getElementById('confirmTableNumber').textContent = currentState.selectedTable;
    document.getElementById('confirmOrderId').textContent = currentState.currentOrderId;
    
    const itemsList = document.getElementById('confirmItemsList');
    itemsList.innerHTML = '';
    
    let totalPrice = 0;
    
    currentState.selectedItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
            <td>₹${itemTotal}</td>
        `;
        itemsList.appendChild(row);
    });
    
    document.getElementById('confirmTotal').textContent = totalPrice;
}

function confirmOrder() {
    if (!currentState.currentOrderId) {
        currentState.currentOrderId = generateOrderId();
    }
    
    // Create order object
    currentState.currentOrder = {
        orderId: currentState.currentOrderId,
        tableNumber: currentState.selectedTable,
        items: JSON.parse(JSON.stringify(currentState.selectedItems)),
        status: 'confirmed',
        orderStatus: 'start_cooking',
        timeTracking: {
            'start_cooking': new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            'end_cooking': null,
            'on_the_way': null,
            'delivered': null
        },
        totalPrice: currentState.selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        preparationProgress: {},
        createdAt: new Date().toLocaleString(),
        paid: false,
        completed: false
    };
    
    // Initialize preparation progress for each item
    currentState.currentOrder.items.forEach(item => {
        currentState.currentOrder.preparationProgress[item.id] = {
            status: 'pending',
            progress: 0
        };
    });
    
    // Save order
    currentState.orders.push(currentState.currentOrder);
    localStorage.setItem('orders', JSON.stringify(currentState.orders));
    
    // Update table status
    currentState.tableStatuses[currentState.selectedTable] = {
        status: 'occupied',
        orderId: currentState.currentOrderId
    };
    localStorage.setItem('tableStatuses', JSON.stringify(currentState.tableStatuses));
    
    // Set current order in session for the tracking pages
    sessionStorage.setItem('currentOrderId', currentState.currentOrderId);
    sessionStorage.setItem('currentOrder', JSON.stringify(currentState.currentOrder));
    
    // Start simulation
    simulateOrderPreparation(currentState.currentOrderId);
    
    // Navigate to tracking
    transitionToPage('preparation-tracking.html');
}

function goBackToConfirmation() {
    transitionToPage('order-confirmation.html');
}

// ==================== FOOD CATEGORIES ====================
function loadFoodCategories() {
    if (!currentState.currentOrder) {
        transitionToPage('tables.html');
        return;
    }
    
    document.getElementById('orderIdDisplay').textContent = currentState.currentOrder.orderId;
    
    // Display category counts
    const counts = getCategoryCounts(currentState.currentOrder.items);
    
    const mainDishCount = counts['Main Dish'] || 0;
    const sideDishCount = counts['Side Dish'] || 0;
    const drinksCount = counts['Drinks'] || 0;
    
    document.getElementById('mainDishCount').innerHTML = `${mainDishCount} items`;
    document.getElementById('sideDishCount').innerHTML = `${sideDishCount} items`;
    document.getElementById('drinksCount').innerHTML = `${drinksCount} items`;
    
    // Display order summary
    const summaryBody = document.getElementById('categorySummary');
    summaryBody.innerHTML = '';
    
    let totalPrice = 0;
    
    currentState.currentOrder.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
        `;
        summaryBody.appendChild(row);
    });
    
    document.getElementById('categoryTotal').textContent = totalPrice;
    document.getElementById('orderIdInfo').textContent = currentState.currentOrder.orderId;
}

function goToMainDishes() {
    transitionToPage('main-dishes.html');
}

function goToSideDishes() {
    transitionToPage('side-dishes.html');
}

function goToDrinks() {
    transitionToPage('drinks.html');
}

// ==================== CATEGORY PAGES ====================
function loadMainDishes() {
    loadCategoryPage('Main Dish', 'mainDishesContainer');
}

function loadSideDishes() {
    loadCategoryPage('Side Dish', 'sideDishesContainer');
}

function loadDrinks() {
    loadCategoryPage('Drinks', 'drinksContainer');
}

function loadSnacks() {
    loadCategoryPage('Snacks', 'snacksContainer');
}

function loadSweets() {
    loadCategoryPage('Sweets', 'sweetsContainer');
}

function loadIceCream() {
    loadCategoryPage('Ice Cream', 'iceCreamContainer');
}

function loadCategoryPage(category, containerId) {
    if (!currentState.currentOrder) {
        transitionToPage('tables.html');
        return;
    }
    
    document.getElementById('orderIdDisplay').textContent = currentState.currentOrder.orderId;
    document.getElementById('orderIdInfo').textContent = currentState.currentOrder.orderId;
    
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const categoryItems = currentState.currentOrder.items.filter(item => item.category === category);
    
    if (categoryItems.length === 0) {
        container.innerHTML = '<p class="no-items">No items in this category for this order.</p>';
        return;
    }
    
    categoryItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'category-item-card';
        
        const prep = currentState.currentOrder.preparationProgress[item.id] || { status: 'pending' };
        if (prep.status === 'served') {
            itemCard.classList.add('served');
        }
        
        let actionButtons = '';
        if (prep.status === 'pending') {
            actionButtons = `<button class="btn-small" onclick="updateItemStatus(${item.id}, 'cooking')">Start Cooking</button>`;
        } else if (prep.status === 'cooking') {
            actionButtons = `<button class="btn-small" onclick="updateItemStatus(${item.id}, 'cooked')">Mark Cooked</button>`;
        } else if (prep.status === 'cooked') {
            actionButtons = `<button class="btn-small" onclick="updateItemStatus(${item.id}, 'served')">Mark Served</button>`;
        }

        itemCard.innerHTML = `
            ${prep.status === 'served' ? '<div class="checkmark-overlay">✓</div>' : ''}
            <div class="category-item-header">
                <h4>${item.name}</h4>
                <span class="quantity-badge">${item.quantity}</span>
            </div>
            <p class="category-item-price">₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</p>
            <div class="category-item-footer">
                ${actionButtons}
            </div>
        `;
        
        container.appendChild(itemCard);
    });
}

function updateItemStatus(itemId, newStatus) {
    // Legacy function, no longer used
}

function simulatePreparation(itemId) {
    // Legacy function, no longer used
}

function simulateOrderPreparation(orderId) {
    const states = ['start_cooking', 'end_cooking', 'on_the_way', 'delivered'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
        currentState.orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = currentState.orders.findIndex(o => o.orderId === orderId);
        
        if (orderIndex === -1) {
            clearInterval(interval);
            return;
        }
        
        const order = currentState.orders[orderIndex];
        currentIndex = states.indexOf(order.orderStatus);
        
        if (currentIndex < states.length - 1) {
            order.orderStatus = states[currentIndex + 1];
            
            if (!order.timeTracking) order.timeTracking = {};
            order.timeTracking[order.orderStatus] = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            // Sync with old format for other pages
            if (order.orderStatus === 'end_cooking') {
                order.items.forEach(item => {
                    order.preparationProgress[item.id] = { status: 'cooked', progress: 100 };
                });
            } else if (order.orderStatus === 'delivered') {
                order.items.forEach(item => {
                    order.preparationProgress[item.id] = { status: 'served', progress: 100 };
                });
            }
            
            localStorage.setItem('orders', JSON.stringify(currentState.orders));
            
            if (document.getElementById('trackingItemsContainer') && currentState.currentOrderId === orderId) {
                currentState.currentOrder = order;
                sessionStorage.setItem('currentOrder', JSON.stringify(order));
                loadPreparationTracking();
            }
        } else {
            clearInterval(interval);
        }
    }, 5000); 
}

function goBackToCategories() {
    transitionToPage('food-categories.html');
}

// ==================== PREPARATION TRACKING ====================
function loadPreparationTracking() {
    if (!currentState.currentOrder) {
        transitionToPage('tables.html');
        return;
    }
    
    const orderIdDisplay = document.getElementById('orderIdDisplay');
    if (orderIdDisplay) {
        orderIdDisplay.textContent = currentState.currentOrder.orderId;
    }
    document.getElementById('trackingTableNumber').textContent = currentState.currentOrder.tableNumber;
    document.getElementById('trackingOrderId').textContent = currentState.currentOrder.orderId;
    document.getElementById('trackingTotalItems').textContent = currentState.currentOrder.items.length;
    
    const container = document.getElementById('trackingItemsContainer');
    container.innerHTML = '';
    
    const order = currentState.currentOrder;
    const status = order.orderStatus || 'start_cooking';
    const states = ['start_cooking', 'end_cooking', 'on_the_way', 'delivered'];
    const labels = ['Start Cooking', 'End Cooking', 'On the Way to Table', 'Delivered to Table'];
    const icons = ['👨‍🍳', '🍲', '🚶‍♂️', '🍽️'];
    const currentIndex = states.indexOf(status);
    
    let html = '<div class="single-line-tracker">';
    states.forEach((state, index) => {
        const isCompleted = index <= currentIndex;
        const isActive = index === currentIndex;
        const timeStr = (order.timeTracking && order.timeTracking[state]) ? order.timeTracking[state] : '--:-- --';
        
        html += `
            <div class="tracker-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}" style="animation: scaleIn 0.5s ease-out ${0.3 + index * 0.15}s forwards; opacity: 0;">
                <div class="step-circle">${icons[index]}</div>
                <div class="step-label">${labels[index]}</div>
                <div class="step-time">${timeStr}</div>
                ${isCompleted && index === states.length - 1 ? '<div class="final-check">✓</div>' : ''}
            </div>
            ${index < states.length - 1 ? '<div class="step-connector"></div>' : ''}
        `;
    });
    html += '</div>';

    // Order Details Section
    const allDelivered = currentIndex === states.length - 1;
    html += `
        <div class="order-details-section">
            <div class="order-details-header">
                <h2>🍽️ Order Details</h2>
                <div class="status-badge ${allDelivered ? 'delivered' : 'pending'}">
                    ${allDelivered ? '✓ All Items Delivered to Table' : 'Preparing...'}
                </div>
            </div>
            <table class="order-items-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Dish</th>
                        <th>Quantity</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;

    order.items.forEach((item, index) => {
        const itemProg = order.preparationProgress[item.id];
        const isItemReady = itemProg && (itemProg.status === 'cooked' || itemProg.status === 'served');
        const itemStatusBadge = isItemReady 
            ? '<span class="item-badge delivered">✓ Ready</span>'
            : '<span class="item-badge pending">Preparing...</span>';
            
        // If the order item doesn't have an image, look it up from the master MENU_ITEMS
        const menuItem = typeof MENU_ITEMS !== 'undefined' ? MENU_ITEMS.find(m => m.id === item.id) : null;
        const imgSrc = item.image || (menuItem ? menuItem.image : '');
            
        html += `
            <tr>
                <td class="item-no"><div class="no-circle">${index + 1}</div></td>
                <td>
                    <div class="dish-info">
                        <img src="${imgSrc}" alt="${item.name}" class="dish-img" onerror="this.style.display='none'">
                        <div>
                            <div class="dish-name">${item.name}</div>
                            <div class="dish-price">₹${item.price.toFixed(2)}</div>
                        </div>
                    </div>
                </td>
                <td class="item-qty">${item.quantity}</td>
                <td>${itemStatusBadge}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
        <div class="tracking-actions">
            <button class="btn-purple-gradient" onclick="goToReadyOrders()">
                👁️ VIEW READY ORDERS →
            </button>
            <button class="btn-success" onclick="goToBillPage()" style="margin-left: 10px;">
                🧾 VIEW BILL →
            </button>
        </div>
    `;

    container.innerHTML = html;
}

function goToPreparationTracking() {
    transitionToPage('preparation-tracking.html');
}

function goToReadyOrders() {
    transitionToPage('ready-orders.html');
}

function goToBillPage() {
    transitionToPage('bill.html');
}

// ==================== READY ORDERS ====================
function loadReadyOrders() {
    const readyTablesContainer = document.getElementById('readyTablesContainer');
    if (!readyTablesContainer) return;
    
    readyTablesContainer.innerHTML = '';
    
    TABLES.forEach((table, index) => {
        const status = currentState.tableStatuses[table.id] || { status: 'available' };
        const colorIndex = (index % 5) + 1; // 1 to 5
        
        let readyCount = 0;
        let totalCount = 0;
        let orderIdStr = '';
        
        if (status.orderId) {
            orderIdStr = status.orderId;
            const tableOrder = currentState.orders.find(o => o.orderId === status.orderId);
            if (tableOrder && tableOrder.preparationProgress) {
                Object.values(tableOrder.preparationProgress).forEach(item => {
                    totalCount++;
                    if (item.status === 'cooked' || item.status === 'served') readyCount++;
                });
            }
        }
        
        const isOccupied = status.status === 'occupied';
        
        const row = document.createElement('div');
        row.className = `ro-table-row row-color-${colorIndex}`;
        row.style.animationDelay = `${index * 0.15}s`;
        
        row.innerHTML = `
            <div class="ro-table-pill pill-${colorIndex}">
                <div class="ro-pill-title">TABLE</div>
                <div class="ro-pill-number">${table.number}</div>
                <div class="ro-pill-icon">🪑</div>
            </div>
            <div class="ro-table-info">
                <div class="ro-status-line">
                    <div class="ro-dot ${isOccupied ? 'dot-occ' : 'dot-avail'}"></div>
                    <span class="${isOccupied ? 'text-occ' : `text-avail-${colorIndex}`}">${status.status.toUpperCase()}</span>
                </div>
                ${isOccupied ? `
                    <div class="ro-order-details">
                        <div class="ro-detail-item">📄 Order ID: ${orderIdStr}</div>
                        <div class="ro-detail-item">👥 ${readyCount}/${totalCount} Ready</div>
                    </div>
                ` : `
                    <div class="ro-order-details">
                        No Order
                    </div>
                `}
            </div>
            
            <div class="ro-badge ${isOccupied ? 'badge-ready' : 'badge-avail'}">
                ${isOccupied ? '🍴 READY TO SERVE' : '✓ AVAILABLE'}
            </div>
            
            <div class="ro-action-btn" onclick="goToTrackingForTable('${table.id}')">
                >
            </div>
        `;
        
        readyTablesContainer.appendChild(row);
    });
}

function goToTrackingForTable(tableId) {
    const status = currentState.tableStatuses[tableId];
    if (status && status.orderId) {
        const order = currentState.orders.find(o => o.orderId === status.orderId);
        if (order) {
            currentState.currentOrder = order;
            sessionStorage.setItem('currentOrder', JSON.stringify(order));
            sessionStorage.setItem('currentOrderId', order.orderId);
            transitionToPage('preparation-tracking.html');
            return;
        }
    }
    transitionToPage('tables.html');
}

function goBackToTracking() {
    transitionToPage('preparation-tracking.html');
}

function viewOrderBill(orderId) {
    const order = currentState.orders.find(o => o.orderId === orderId);
    if (order) {
        currentState.currentOrder = order;
        sessionStorage.setItem('currentOrder', JSON.stringify(order));
        sessionStorage.setItem('currentOrderId', order.orderId);
        transitionToPage('bill.html');
    }
}

// ==================== BILL PAGE ====================
function loadBill() {
    if (!currentState.currentOrder) {
        transitionToPage('tables.html');
        return;
    }
    
    const order = currentState.currentOrder;
    
    document.getElementById('billTableNumber').textContent = order.tableNumber;
    document.getElementById('billOrderId').textContent = order.orderId;
    
    const d = new Date(order.createdAt || Date.now());
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('billDateTime').textContent = `${day} ${month} ${year}, ${time}`;
    
    const billItemsList = document.getElementById('billItemsList');
    billItemsList.innerHTML = '';
    
    let subtotal = 0;
    
    order.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        // If the order item doesn't have an image, look it up from the master MENU_ITEMS
        const menuItem = typeof MENU_ITEMS !== 'undefined' ? MENU_ITEMS.find(m => m.id === item.id) : null;
        const imgSrc = item.image || (menuItem ? menuItem.image : '');
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="item-name-cell">
                <img src="${imgSrc}" alt="${item.name}" class="bill-item-img" onerror="this.style.display='none'">
                <span>${item.name}</span>
            </td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>₹${itemTotal.toFixed(2)}</td>
        `;
        billItemsList.appendChild(row);
    });
    
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    
    document.getElementById('billSubtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('billTax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('billTotal').textContent = `₹${total.toFixed(2)}`;
    
    const statusText = document.getElementById('paymentStatusText');
    const statusIcon = document.getElementById('paymentStatusIcon');
    const statusBox = document.getElementById('paymentStatusBox');
    
    if (order.paid) {
        statusText.textContent = 'Paid';
        statusText.className = 'paid-text';
        statusIcon.textContent = '✓';
        statusBox.style.background = '#fff3e0';
        statusBox.style.borderColor = '#ffe0b2';
        statusIcon.style.color = '#e65100';
        statusIcon.style.borderColor = '#e65100';
    } else {
        statusText.textContent = 'Pending';
        statusText.className = 'pending-text';
        statusIcon.textContent = '!';
        statusBox.style.background = '#fff3e0';
        statusBox.style.borderColor = '#ffe0b2';
        statusIcon.style.color = '#e65100';
        statusIcon.style.borderColor = '#e65100';
    }
}

function markAsPaid() {
    if (!currentState.currentOrder) return;
    
    currentState.currentOrder.paid = true;
    
    // Update in localStorage
    const index = currentState.orders.findIndex(o => o.orderId === currentState.currentOrder.orderId);
    if (index !== -1) {
        currentState.orders[index] = currentState.currentOrder;
        localStorage.setItem('orders', JSON.stringify(currentState.orders));
    }
    
    const statusText = document.getElementById('paymentStatusText');
    const statusIcon = document.getElementById('paymentStatusIcon');
    const statusBox = document.getElementById('paymentStatusBox');
    
    statusText.textContent = 'Paid';
    statusText.className = 'paid-text';
    statusIcon.textContent = '✓';
    statusBox.style.background = '#fff3e0';
    statusBox.style.borderColor = '#ffe0b2';
    statusIcon.style.color = '#e65100';
    statusIcon.style.borderColor = '#e65100';
    
    alert('Payment marked as received!');
}

function cancelOrder() {
    if (!currentState.currentOrder) return;
    
    if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
        const tableId = currentState.currentOrder.tableNumber;
        if (currentState.tableStatuses[tableId]) {
            currentState.tableStatuses[tableId] = { status: 'available', orderId: null };
            localStorage.setItem('tableStatuses', JSON.stringify(currentState.tableStatuses));
        }
        
        currentState.orders = currentState.orders.filter(o => o.orderId !== currentState.currentOrder.orderId);
        localStorage.setItem('orders', JSON.stringify(currentState.orders));
        
        sessionStorage.removeItem('currentOrderId');
        sessionStorage.removeItem('currentOrder');
        sessionStorage.removeItem('selectedItems');
        sessionStorage.removeItem('selectedTable');
        
        alert('Order cancelled successfully.');
        transitionToPage('tables.html');
    }
}

function completeOrder() {
    if (!currentState.currentOrder) return;
    
    currentState.currentOrder.completed = true;
    
    // Update table status
    const tableId = currentState.currentOrder.tableNumber;
    if (currentState.tableStatuses[tableId]) {
        currentState.tableStatuses[tableId] = { status: 'available', orderId: null };
    }
    localStorage.setItem('tableStatuses', JSON.stringify(currentState.tableStatuses));
    
    // Clear session current order if it matches
    if (currentState.currentOrderId === currentState.currentOrder.orderId) {
        sessionStorage.removeItem('currentOrderId');
        sessionStorage.removeItem('currentOrder');
        sessionStorage.removeItem('selectedItems');
        sessionStorage.removeItem('selectedTable');
    }
    
    // Update in localStorage
    const index = currentState.orders.findIndex(o => o.orderId === currentState.currentOrder.orderId);
    if (index !== -1) {
        currentState.orders[index] = currentState.currentOrder;
        localStorage.setItem('orders', JSON.stringify(currentState.orders));
    }
    
    alert('Order completed! Table is now available.');
    transitionToPage('ready-orders.html');
}

function printBill() {
    window.print();
}

function goBackToReadyOrders() {
    transitionToPage('ready-orders.html');
}

// ==================== NAVIGATION HELPERS ====================
function goBackToTables() {
    currentState.selectedTable = null;
    sessionStorage.removeItem('selectedTable');
    currentState.selectedItems = [];
    sessionStorage.removeItem('selectedItems');
    currentState.currentOrderId = null;
    sessionStorage.removeItem('currentOrderId');
    currentState.currentOrder = null;
    sessionStorage.removeItem('currentOrder');
    transitionToPage('tables.html');
}

function goBackToFoodSelection() {
    transitionToPage('food-selection.html');
}

function openImageModal(imageSrc, captionText) {
    if (!imageSrc) return;
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('fullScreenImage');
    const caption = document.getElementById('modalCaption');
    
    modal.style.display = 'flex';
    modalImg.src = imageSrc;
    caption.innerHTML = captionText;
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}
