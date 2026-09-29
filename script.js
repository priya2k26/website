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
        syncTableStatusesToFirebase();
    }
}

// ==================== FIREBASE SYNC ====================
function syncOrdersToFirebase() {
    if (window.firebaseDb && window.dbSet && window.dbRef) {
        window.dbSet(window.dbRef(window.firebaseDb, 'orders'), currentState.orders);
    } else {
        localStorage.setItem('orders', JSON.stringify(currentState.orders));
    }
}

function syncTableStatusesToFirebase() {
    if (window.firebaseDb && window.dbSet && window.dbRef) {
        window.dbSet(window.dbRef(window.firebaseDb, 'tableStatuses'), currentState.tableStatuses);
    } else {
        localStorage.setItem('tableStatuses', JSON.stringify(currentState.tableStatuses));
    }
}

// ==================== INITIALIZE DATA ====================
async function initializeData() {
    if (!window.firebaseDb) {
        setTimeout(initializeData, 500); // Wait for Firebase to load
        return;
    }
    
    // Listen to orders
    window.dbOnValue(window.dbRef(window.firebaseDb, 'orders'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Firebase converts sparse arrays to objects, so we ensure it stays an array
            if (Array.isArray(data)) {
                currentState.orders = data.filter(Boolean);
            } else {
                currentState.orders = Object.values(data).filter(Boolean);
            }
        } else if (currentState.orders.length > 0) {
            // Seed firebase if it's empty but we have local orders
            syncOrdersToFirebase();
        } else {
            currentState.orders = [];
        }
        
        // Refresh UI if on relevant pages
        if (document.getElementById('readyOrdersList')) loadReadyOrders();
        if (document.getElementById('preparationList')) loadPreparationOrders();
    });

    // Listen to table statuses
    window.dbOnValue(window.dbRef(window.firebaseDb, 'tableStatuses'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            currentState.tableStatuses = data;
            
            let missing = false;
            TABLES.forEach(table => {
                if (!currentState.tableStatuses[table.id]) {
                    currentState.tableStatuses[table.id] = { status: 'available', orderId: null };
                    missing = true;
                }
            });
            
            if (missing) syncTableStatusesToFirebase();
        } else {
            // Seed firebase with initialized tables
            initializeTableStatuses();
        }
        
        // Refresh UI if on relevant pages
        if (document.getElementById('tablesContainer')) loadTableManagement();
    });
}

// ==================== TOAST NOTIFICATIONS ====================
function showNotification(message, icon = '🔔') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 400); // Wait for animation
    }, 4000);
}

// ==================== LOGIN PAGE ====================
document.addEventListener('DOMContentLoaded', async function() {
    if (currentState.isLoggedIn) {
        await initializeData();
    }
    initializeTableStatuses();
    
    // Check if on login page
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }
    
    // Check if on register page
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
    }
    
    // Check if user is logged in for other pages
    if (document.title.includes('Login') === false && 
        document.title.includes('Home') === false &&
        !currentState.isLoggedIn && 
        !window.location.pathname.includes('index.html') &&
        !window.location.pathname.includes('login.html')) {
        // They are not logged in and not on login or home, they should probably be redirected to login
        // But for now just keeping original logic
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
    
    // Initialize dashboard page
    if (document.getElementById('dashboardContainer')) {
        loadDashboard();
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
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        if (!window.firebaseSignIn || !window.firebaseAuth) {
            alert("Firebase is still initializing. Please wait a moment and try again.");
            return;
        }
        
        const userCredential = await window.firebaseSignIn(window.firebaseAuth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        
        sessionStorage.setItem('token', token);
        currentState.isLoggedIn = true;
        currentState.userEmail = user.email;
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', user.email);
        
        await saveUserToFirebase(user);
        
        transitionToPage('tables.html');
    } catch (error) {
        console.error('Login error:', error);
        alert(error.message || 'Invalid email or password. Please try again.');
    }
}

async function handleGoogleLogin() {
    try {
        if (!window.firebaseSignInWithPopup || !window.firebaseAuth || !window.firebaseGoogleProvider) {
            alert("Firebase is still initializing. Please wait a moment and try again.");
            return;
        }
        
        const result = await window.firebaseSignInWithPopup(window.firebaseAuth, window.firebaseGoogleProvider);
        const user = result.user;
        const token = await user.getIdToken();
        
        sessionStorage.setItem('token', token);
        currentState.isLoggedIn = true;
        currentState.userEmail = user.email;
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', user.email);
        
        await saveUserToFirebase(user);
        
        transitionToPage('tables.html');
    } catch (error) {
        console.error('Google Login error:', error);
        alert(error.message || 'Google login failed. Please try again.');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }
    
    try {
        if (!window.firebaseSignUp || !window.firebaseAuth) {
            alert("Firebase is still initializing. Please wait a moment and try again.");
            return;
        }
        
        await window.firebaseSignUp(window.firebaseAuth, email, password);
        alert('Registration successful! Please login.');
        transitionToPage('login.html');
    } catch (error) {
        console.error('Registration error:', error);
        alert(error.message || 'Registration failed. Please try again.');
    }
}

async function saveUserToFirebase(user) {
    if (!window.firebaseDb || !window.dbSet || !window.dbRef) {
        console.warn("Firebase Database is not ready.");
        return;
    }

    const userData = {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        provider: user.providerData && user.providerData.length > 0 ? user.providerData[0].providerId : "Custom",
        loginAt: new Date().toISOString()
    };

    try {
        await window.dbSet(
            window.dbRef(window.firebaseDb, `users/${user.uid}`),
            userData
        );

        console.log("User saved to Realtime Database:", userData);
    } catch (error) {
        console.error("Error saving user to Realtime Database:", error);
    }
}

async function logout() {
    currentState.isLoggedIn = false;
    currentState.userEmail = '';
    currentState.selectedTable = null;
    currentState.selectedItems = [];
    currentState.currentOrderId = null;
    
    sessionStorage.clear();
    
    if (window.firebaseSignOut && window.firebaseAuth) {
        try {
            await window.firebaseSignOut(window.firebaseAuth);
        } catch(e) {
            console.error('Firebase signout error:', e);
        }
    }
    
    transitionToPage('login.html');
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
        const isOccupied = status.status === 'occupied';
        
        const row = document.createElement('div');
        row.className = `table-card ${isOccupied ? 'occupied' : ''}`;
        
        row.innerHTML = `
            <div class="card-top">
                <div class="image-circle">
                    <img src="images/special_table_bg.png" alt="Table">
                </div>
                <div class="info">
                    <h3>Table ${table.id}</h3>
                    <p class="capacity">👥 ${table.capacity || 4} (Capacity)</p>
                    <p class="status-indicator">
                        <span class="dot"></span> ${isOccupied ? 'Occupied' : 'Available'}
                    </p>
                </div>
            </div>
            <div class="card-action">
                ${isOccupied 
                    ? `<button class="btn-occupied" onclick="goToTrackingForTable('${table.id}')">👁 View Order</button>`
                    : `<button class="btn-available" onclick="selectTable(${table.id})">&gt; View / Take Order</button>`
                }
            </div>
        `;
        
        container.appendChild(row);
    });
}

async function clearTable(tableId) {
    if (confirm('Are you sure you want to clear this table?')) {
        try {
            try {
                await fetch(`${API_URL}/tables/${tableId}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ status: 'Available', current_order_id: null })
                });
            } catch (backendError) {
                console.warn('Backend server not reachable. Continuing with local state.', backendError);
            }
            
            if (currentState.tableStatuses[tableId]) {
                currentState.tableStatuses[tableId] = { status: 'available', orderId: null };
                syncTableStatusesToFirebase();
                loadTableManagement();
            }
        } catch(e) {
            console.error('Error clearing table:', e);
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
        window.activeCategory = 'Main Dishes';
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
    
    let cat = window.activeCategory || 'Main Dishes';
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

async function confirmOrder() {
    if (!currentState.currentOrderId) {
        currentState.currentOrderId = generateOrderId();
    }
    
    // Create order object
    currentState.currentOrder = {
        orderId: currentState.currentOrderId,
        tableNumber: currentState.selectedTable,
        items: JSON.parse(JSON.stringify(currentState.selectedItems)),
        status: 'confirmed',
        orderStatus: 'pending',
        timeTracking: {
            'pending': new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            'start_cooking': null,
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
    
    try {
        try {
            await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: currentState.currentOrderId,
                    tableNumber: currentState.selectedTable,
                    totalAmount: currentState.currentOrder.totalPrice,
                    items: currentState.currentOrder.items
                })
            });
        } catch (backendError) {
            console.warn('Backend server not reachable. Continuing with local state and Firebase.', backendError);
        }
        
        // Save order locally for other pages that depend on local state
        currentState.orders.push(currentState.currentOrder);
        syncOrdersToFirebase();
        
        // Update table status locally
        currentState.tableStatuses[currentState.selectedTable] = {
            status: 'occupied',
            orderId: currentState.currentOrderId
        };
        syncTableStatusesToFirebase();
        
        // Set current order in session for the tracking pages
        sessionStorage.setItem('currentOrderId', currentState.currentOrderId);
        sessionStorage.setItem('currentOrder', JSON.stringify(currentState.currentOrder));
        
        // Start simulation
        simulateOrderPreparation(currentState.currentOrderId);
        
        showNotification(`New order received - Table ${currentState.selectedTable}`, '🛎️');
        setTimeout(() => {
            showNotification(`Order ${currentState.currentOrderId} is pending`, '⏳');
        }, 1500);
        
        // Navigate to tracking
        transitionToPage('preparation-tracking.html');
    } catch(e) {
        console.error('Error confirming order:', e);
        alert('Could not place order on server');
    }
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
    
    const mainDishCount = counts['Main Dishes'] || 0;
    const sideDishCount = counts['Side Dishes'] || 0;
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
    loadCategoryPage('Main Dishes', 'mainDishesContainer');
}

function loadSideDishes() {
    loadCategoryPage('Side Dishes', 'sideDishesContainer');
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
    const states = ['pending', 'start_cooking', 'end_cooking', 'on_the_way', 'delivered'];
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
            
            syncOrdersToFirebase();
            
            // Fire Notifications
            if (order.orderStatus === 'pending') {
                showNotification(`Order ${order.orderId} is pending`, '⏳');
            } else if (order.orderStatus === 'start_cooking') {
                showNotification(`Order ${order.orderId} is now cooking`, '👨‍🍳');
            } else if (order.orderStatus === 'end_cooking') {
                showNotification(`Order ${order.orderId} cooking completed`, '✅');
            } else if (order.orderStatus === 'on_the_way') {
                showNotification(`Order ${order.orderId} is ready for server pickup`, '🚶‍♂️');
            } else if (order.orderStatus === 'delivered') {
                showNotification(`Order ${order.orderId} has been served to Table ${order.tableNumber}`, '🍽️');
            }

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
    const status = order.orderStatus || 'pending';
    const states = ['pending', 'start_cooking', 'end_cooking', 'on_the_way', 'delivered'];
    const labels = ['Pending', 'Start Cooking', 'End Cooking', 'On the Way to Table', 'Delivered to Table'];
    const icons = ['⏳', '👨‍🍳', '🍲', '🚶‍♂️', '🍽️'];
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
                <div class="ro-pill-number">${table.id}</div>
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
        syncOrdersToFirebase();
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
            syncTableStatusesToFirebase();
        }
        
        currentState.orders = currentState.orders.filter(o => o.orderId !== currentState.currentOrder.orderId);
        syncOrdersToFirebase();
        
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
    
    if (!currentState.currentOrder.paid) {
        alert('Please receive payment before completing the order.');
        return;
    }
    
    currentState.currentOrder.completed = true;
    
    // Update table status
    const tableId = currentState.currentOrder.tableNumber;
    if (currentState.tableStatuses[tableId]) {
        currentState.tableStatuses[tableId] = { status: 'available', orderId: null };
    }
    syncTableStatusesToFirebase();
    
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
        syncOrdersToFirebase();
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

// ==================== DASHBOARD ====================
function loadDashboard() {
    // 1. Total Orders Received
    const totalOrdersCount = currentState.orders.length;
    document.getElementById('dashTotalOrders').textContent = totalOrdersCount;

    // 2. Total Payment Amount
    let totalPayment = 0;
    currentState.orders.forEach(order => {
        totalPayment += (order.totalPrice || 0);
    });
    document.getElementById('dashTotalPayment').textContent = `₹${totalPayment}`;

    // 3. Tables Ready/Available
    let availableTables = 0;
    let totalTables = TABLES.length;
    
    // We assume tableStatuses holds all initialized tables
    Object.values(currentState.tableStatuses).forEach(status => {
        if (status.status === 'available') {
            availableTables++;
        }
    });
    
    // If tableStatuses hasn't been initialized fully for all TABLES, count missing as available
    const initializedTablesCount = Object.keys(currentState.tableStatuses).length;
    if (initializedTablesCount < totalTables) {
        availableTables += (totalTables - initializedTablesCount);
    }
    
    document.getElementById('dashAvailableTables').textContent = `${availableTables} / ${totalTables}`;

    // 4. Other important order/table details
    // Render a brief list of recent orders or active tables
    const recentOrdersList = document.getElementById('dashRecentOrdersList');
    if (recentOrdersList) {
        recentOrdersList.innerHTML = '';
        if (currentState.orders.length === 0) {
            recentOrdersList.innerHTML = '<div style="color: #666; padding: 10px;">No orders yet.</div>';
        } else {
            // Get last 5 orders
            const recentOrders = [...currentState.orders].reverse().slice(0, 5);
            recentOrders.forEach(order => {
                const item = document.createElement('div');
                item.style.padding = '10px';
                item.style.borderBottom = '1px solid #eee';
                item.style.display = 'flex';
                item.style.justifyContent = 'space-between';
                
                const tableText = `Table ${order.tableNumber}`;
                const statusText = order.completed ? 'Completed' : (order.orderStatus || 'Pending').replace(/_/g, ' ');
                const priceText = `₹${order.totalPrice}`;
                
                item.innerHTML = `
                    <span style="font-weight: 600;">#${order.orderId} - ${tableText}</span>
                    <span style="color: ${order.completed ? '#4CAF50' : '#ff5722'}; font-size: 0.9em; font-weight: 600; text-transform: uppercase;">${statusText}</span>
                    <span style="font-weight: 600;">${priceText}</span>
                `;
                recentOrdersList.appendChild(item);
            });
        }
    }
}
