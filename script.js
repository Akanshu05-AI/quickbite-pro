// Meal Data with enhanced information
const meals = {
    breakfast: {
        s: 8.0,
        e: 10.5,
        n: "Breakfast",
        img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500",
        d: "8:00 AM - 10:30 AM",
        price: 40,
        items: [
            { name: "Poha", tags: ["veg", "jain"], calories: 250 },
            { name: "Bread Omelette", tags: ["nonveg", "protein"], calories: 300 },
            { name: "Idli Sambar", tags: ["veg"], calories: 200 },
            { name: "Upma", tags: ["veg", "jain"], calories: 220 }
        ]
    },
    lunch: {
        s: 12.5,
        e: 14.5,
        n: "Lunch",
        img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500",
        d: "12:30 PM - 2:30 PM",
        price: 60,
        items: [
            { name: "Dal Chawal", tags: ["veg", "jain"], calories: 400 },
            { name: "Chicken Curry", tags: ["nonveg", "protein"], calories: 550 },
            { name: "Paneer Butter Masala", tags: ["veg"], calories: 480 },
            { name: "Mix Veg", tags: ["veg", "jain"], calories: 300 }
        ]
    },
    snacks: {
        s: 16.5,
        e: 17.5,
        n: "Snacks",
        img: "https://images.unsplash.com/photo-1601050690597-df056fb04791?w=500",
        d: "4:30 PM - 5:30 PM",
        price: 25,
        items: [
            { name: "Samosa", tags: ["veg", "jain"], calories: 180 },
            { name: "Pakora", tags: ["veg"], calories: 200 },
            { name: "Sandwich", tags: ["veg"], calories: 220 },
            { name: "Tea/Coffee", tags: ["veg", "jain"], calories: 50 }
        ]
    },
    dinner: {
        s: 20.0,
        e: 22.0,
        n: "Dinner",
        img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500",
        d: "8:00 PM - 10:00 PM",
        price: 60,
        items: [
            { name: "Roti Sabzi", tags: ["veg", "jain"], calories: 400 },
            { name: "Fish Curry", tags: ["nonveg", "protein"], calories: 500 },
            { name: "Rajma Chawal", tags: ["veg", "protein"], calories: 450 },
            { name: "Curd Rice", tags: ["veg", "jain"], calories: 250 }
        ]
    }
};

// Local Storage Keys
const STORAGE_KEYS = {
    users: 'qb_users',
    currentUser: 'qb_current_user',
    bookings: 'qb_bookings',
    logs: 'qb_logs',
    security: 'qb_sec',
    payments: 'qb_payments',
    ratings: 'qb_ratings'
};

// Global State
let currentUser = null;
let allBookings = [];
let userLogs = [];
let securityLogs = [];
let payments = [];
let ratings = [];
let adminClicks = 0;
let currentFilter = 'all';

// Initialize App
function init() {
    loadFromStorage();
    checkAuth();
    setMinDate();
    updateClock();
    setInterval(updateClock, 1000);
    setInterval(updateApp, 60000); // Update every minute
}

// Load data from localStorage
function loadFromStorage() {
    userLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.logs)) || [];
    securityLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.security)) || [];
    allBookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookings)) || [];
    payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.payments)) || [];
    ratings = JSON.parse(localStorage.getItem(STORAGE_KEYS.ratings)) || [];
}

// Save to localStorage
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Authentication Functions
function checkAuth() {
    const savedUser = localStorage.getItem(STORAGE_KEYS.currentUser);
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    hideAllScreens();
    document.getElementById('login-screen').classList.add('active');
}

function showSignup() {
    hideAllScreens();
    document.getElementById('signup-screen').classList.add('active');
}

function showDashboard() {
    hideAllScreens();
    document.getElementById('main-dashboard').classList.add('active');
    updateApp();
    loadUserBookings();
    loadPaymentHistory();
    updateWalletBalance();
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        return alert('Please fill all fields');
    }

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users)) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
        showDashboard();
    } else {
        alert('Invalid credentials. Please try again or sign up.');
    }
}

function signup() {
    const name = document.getElementById('signup-name').value;
    const roll = document.getElementById('signup-roll').value;
    const email = document.getElementById('signup-email').value;
    const year = document.getElementById('signup-year').value;
    const password = document.getElementById('signup-password').value;

    if (!name || !roll || !email || !year || !password) {
        return alert('Please fill all fields');
    }

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users)) || [];
    
    if (users.find(u => u.email === email)) {
        return alert('Email already registered');
    }

    const newUser = {
        id: Date.now(),
        name,
        roll,
        email,
        year,
        password,
        balance: 500, // Initial balance
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.users, users);
    
    currentUser = newUser;
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(newUser));
    
    alert('Account created successfully!');
    showDashboard();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.currentUser);
        showLogin();
    }
}

// Update Clock
function updateClock() {
    const clock = document.getElementById('live-clock');
    if (clock) {
        clock.innerText = new Date().toLocaleTimeString();
    }
}

// Tab Switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('tab-' + tabName).classList.add('active');

    // Load specific tab data
    if (tabName === 'menu') {
        renderMenu();
    } else if (tabName === 'mybookings') {
        loadUserBookings();
    } else if (tabName === 'wallet') {
        loadPaymentHistory();
    }
}

// Menu Functions
function renderMenu() {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';

    const currentMeal = getCurrentMeal();
    const items = currentMeal ? meals[currentMeal].items : [];

    items.forEach((item, index) => {
        if (currentFilter !== 'all' && !item.tags.includes(currentFilter)) {
            return;
        }

        const card = document.createElement('div');
        card.className = 'meal-card';
        card.innerHTML = `
            <img src="${meals[currentMeal].img}" alt="${item.name}">
            <div class="meal-info">
                <h3>${item.name}</h3>
                <div class="meal-tags">
                    ${item.tags.map(tag => `<span class="tag ${tag}">${tag}</span>`).join('')}
                </div>
                <div class="calories">${item.calories} kcal</div>
            </div>
        `;
        container.appendChild(card);
    });

    if (container.innerHTML === '') {
        container.innerHTML = '<p style="text-align: center; color: #999;">No items match the selected filter.</p>';
    }

    updateCrowdStatus();
}

function filterMenu(filter) {
    currentFilter = filter;
    
    // Update chips
    document.querySelectorAll('.chip').forEach(chip => chip.classList.remove('active'));
    event.target.classList.add('active');
    
    renderMenu();
}

function getCurrentMeal() {
    const hour = new Date().getHours() + (new Date().getMinutes() / 60);
    
    if (hour >= meals.breakfast.s && hour < meals.breakfast.e) return 'breakfast';
    if (hour >= meals.lunch.s && hour < meals.lunch.e) return 'lunch';
    if (hour >= meals.snacks.s && hour < meals.snacks.e) return 'snacks';
    if (hour >= meals.dinner.s && hour < meals.dinner.e) return 'dinner';
    
    // Return next meal
    if (hour < meals.breakfast.s) return 'breakfast';
    if (hour < meals.lunch.s) return 'lunch';
    if (hour < meals.snacks.s) return 'snacks';
    if (hour < meals.dinner.s) return 'dinner';
    
    return 'breakfast'; // Default to next day breakfast
}

function updateCrowdStatus() {
    const badge = document.getElementById('crowd-badge');
    const count = userLogs.length;
    
    if (count < 50) {
        badge.className = 'badge-green';
        badge.innerHTML = '🟢 Low Crowd';
    } else if (count < 100) {
        badge.className = 'badge-green';
        badge.style.background = '#fff3cd';
        badge.style.color = '#856404';
        badge.innerHTML = '🟡 Medium Crowd';
    } else {
        badge.className = 'badge-green';
        badge.style.background = '#ffebee';
        badge.style.color = '#c62828';
        badge.innerHTML = '🔴 High Crowd';
    }
}

// Booking Functions
function setMinDate() {
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
}

function bookMeal() {
    if (!currentUser) {
        return alert('Please login first');
    }

    const date = document.getElementById('booking-date').value;
    const meal = document.getElementById('booking-meal').value;
    const type = document.getElementById('booking-type').value;

    if (!date || !meal || !type) {
        return alert('Please fill all fields');
    }

    const price = meals[meal]?.price || 60;

    if (currentUser.balance < price) {
        return alert('Insufficient balance. Please add money to your wallet.');
    }

    // Check for duplicate booking
    const existingBooking = allBookings.find(b => 
        b.userId === currentUser.id && 
        b.date === date && 
        b.meal === meal &&
        b.status !== 'cancelled'
    );

    if (existingBooking) {
        return alert('You already have a booking for this meal on this date.');
    }

    const booking = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userRoll: currentUser.roll,
        date,
        meal,
        type,
        price,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
    };

    allBookings.push(booking);
    saveToStorage(STORAGE_KEYS.bookings, allBookings);

    // Deduct from wallet
    updateUserBalance(-price);
    
    // Add payment record
    addPaymentRecord('debit', price, `Booked ${meals[meal].n} for ${date}`);

    alert('Booking confirmed! QR code will be available in "My Bookings".');
    switchTab('mybookings');
}

function loadUserBookings() {
    if (!currentUser) return;

    const upcomingContainer = document.getElementById('upcoming-bookings');
    const pastContainer = document.getElementById('past-bookings');
    
    const userBookings = allBookings.filter(b => b.userId === currentUser.id);
    const today = new Date().toISOString().split('T')[0];

    const upcoming = userBookings.filter(b => b.date >= today && b.status === 'confirmed');
    const past = userBookings.filter(b => b.date < today || b.status === 'cancelled');

    // Render upcoming bookings
    if (upcoming.length === 0) {
        upcomingContainer.innerHTML = '<p style="text-align: center; color: #999;">No upcoming bookings</p>';
    } else {
        upcomingContainer.innerHTML = upcoming.map(b => `
            <div class="booking-item">
                <div class="booking-info">
                    <h4>${meals[b.meal].n} - ${b.type}</h4>
                    <p>📅 ${new Date(b.date).toLocaleDateString()} | ₹${b.price}</p>
                </div>
                <div class="booking-actions">
                    <button class="btn-qr" onclick="showBookingQR('${b.id}')">Show QR</button>
                    <button class="btn-cancel" onclick="cancelBooking('${b.id}')">Cancel</button>
                </div>
            </div>
        `).join('');
    }

    // Render past bookings
    if (past.length === 0) {
        pastContainer.innerHTML = '<p style="text-align: center; color: #999;">No past bookings</p>';
    } else {
        pastContainer.innerHTML = past.slice(-10).reverse().map(b => `
            <div class="booking-item">
                <div class="booking-info">
                    <h4>${meals[b.meal].n} - ${b.type} ${b.status === 'cancelled' ? '(Cancelled)' : ''}</h4>
                    <p>📅 ${new Date(b.date).toLocaleDateString()} | ₹${b.price}</p>
                </div>
            </div>
        `).join('');
    }
}

function cancelBooking(bookingId) {
    const booking = allBookings.find(b => b.id == bookingId);
    
    if (!booking) {
        return alert('Booking not found');
    }

    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursUntil = (bookingDate - now) / (1000 * 60 * 60);

    if (hoursUntil < 2) {
        return alert('Cannot cancel booking less than 2 hours before meal time');
    }

    if (confirm('Are you sure you want to cancel this booking?')) {
        booking.status = 'cancelled';
        saveToStorage(STORAGE_KEYS.bookings, allBookings);

        // Refund to wallet
        updateUserBalance(booking.price);
        addPaymentRecord('credit', booking.price, `Refund for cancelled ${booking.meal}`);

        alert('Booking cancelled and amount refunded to wallet');
        loadUserBookings();
    }
}

function showBookingQR(bookingId) {
    const booking = allBookings.find(b => b.id == bookingId);
    if (!booking) return;

    const qrData = `QB|${booking.userRoll}|${booking.meal}|${booking.date}|${booking.id}`;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 20px; text-align: center;">
            <h3 style="margin-bottom: 20px;">Meal Pass</h3>
            <div id="temp-qr"></div>
            <p style="margin: 20px 0;"><strong>${currentUser.name}</strong></p>
            <p>${meals[booking.meal].n} - ${new Date(booking.date).toLocaleDateString()}</p>
            <button class="btn-main" style="margin-top: 20px;" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    new QRCode(document.getElementById("temp-qr"), {
        text: qrData,
        width: 200,
        height: 200
    });
}

function createGroupBooking() {
    const friendsInput = document.getElementById('group-friends').value;
    if (!friendsInput) {
        return alert('Please enter friend emails');
    }

    alert('Group booking feature will notify your friends via email (Feature under development)');
}

function subscribePlan(planType) {
    const prices = {
        basic: 3500,
        premium: 5200
    };

    const price = prices[planType];

    if (currentUser.balance < price) {
        return alert('Insufficient balance. Please add money to your wallet.');
    }

    if (confirm(`Subscribe to ${planType} plan for ₹${price}?`)) {
        updateUserBalance(-price);
        addPaymentRecord('debit', price, `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan Subscription`);
        alert('Plan subscribed successfully!');
    }
}

// Wallet Functions
function updateWalletBalance() {
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users)) || [];
    const user = users.find(u => u.id === currentUser.id);
    
    if (user) {
        currentUser.balance = user.balance;
    }

    const balanceElements = document.querySelectorAll('#user-balance, .wallet-balance h1');
    balanceElements.forEach(el => {
        if (el.tagName === 'H1') {
            el.innerText = `₹${currentUser.balance.toFixed(2)}`;
        } else {
            el.innerText = `₹${currentUser.balance}`;
        }
    });
}

function updateUserBalance(amount) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users)) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].balance += amount;
        currentUser.balance = users[userIndex].balance;
        saveToStorage(STORAGE_KEYS.users, users);
        localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
        updateWalletBalance();
    }
}

function selectAmount(amount) {
    document.querySelectorAll('.amount-chip').forEach(chip => chip.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('custom-amount').value = amount;
}

function addMoney() {
    const amount = parseInt(document.getElementById('custom-amount').value);
    
    if (!amount || amount < 100) {
        return alert('Please enter amount (minimum ₹100)');
    }

    if (confirm(`Add ₹${amount} to wallet?`)) {
        updateUserBalance(amount);
        addPaymentRecord('credit', amount, 'Added to wallet');
        alert('Money added successfully!');
        loadPaymentHistory();
    }
}

function addPaymentRecord(type, amount, description) {
    const payment = {
        id: Date.now(),
        userId: currentUser.id,
        type,
        amount,
        description,
        timestamp: new Date().toISOString()
    };

    payments.push(payment);
    saveToStorage(STORAGE_KEYS.payments, payments);
}

function loadPaymentHistory() {
    if (!currentUser) return;

    const container = document.getElementById('payment-list');
    const userPayments = payments.filter(p => p.userId === currentUser.id);

    if (userPayments.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No transactions yet</p>';
    } else {
        container.innerHTML = userPayments.slice(-20).reverse().map(p => `
            <div class="transaction-item ${p.type}">
                <div class="transaction-info">
                    <p><strong>${p.description}</strong></p>
                    <p class="time">${new Date(p.timestamp).toLocaleString()}</p>
                </div>
                <div class="transaction-amount ${p.type}">
                    ${p.type === 'credit' ? '+' : '-'}₹${p.amount}
                </div>
            </div>
        `).join('');
    }
}

// Rating System
function rateMeal(category, rating) {
    const stars = document.querySelector(`.stars[data-category="${category}"]`);
    const allStars = stars.querySelectorAll('span');
    
    allStars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });

    stars.dataset.rating = rating;
}

function submitFeedback() {
    const tasteRating = document.querySelector('.stars[data-category="taste"]')?.dataset.rating || 0;
    const hygieneRating = document.querySelector('.stars[data-category="hygiene"]')?.dataset.rating || 0;
    const feedback = document.getElementById('feedback-text').value;

    if (!tasteRating || !hygieneRating) {
        return alert('Please provide ratings for both categories');
    }

    const rating = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        taste: parseInt(tasteRating),
        hygiene: parseInt(hygieneRating),
        feedback,
        timestamp: new Date().toISOString()
    };

    ratings.push(rating);
    saveToStorage(STORAGE_KEYS.ratings, ratings);

    alert('Thank you for your feedback!');
    
    // Reset form
    document.querySelectorAll('.stars span').forEach(star => star.classList.remove('active'));
    document.getElementById('feedback-text').value = '';
    delete document.querySelector('.stars[data-category="taste"]').dataset.rating;
    delete document.querySelector('.stars[data-category="hygiene"]').dataset.rating;
}

// More Tab Functions
function compareMessMenus() {
    const selector = document.getElementById('mess-selector');
    alert(`Comparing with ${selector.value}... (Feature under development)`);
}

function toggleNotif(type) {
    console.log(`Toggled ${type} notifications`);
}

function generateUserQR() {
    if (!currentUser) return;

    const qrContainer = document.getElementById('user-qr');
    qrContainer.innerHTML = '';
    
    new QRCode(qrContainer, {
        text: `USER|${currentUser.roll}|${currentUser.name}|${currentUser.id}`,
        width: 200,
        height: 200
    });
}

// Notification System
function showNotifications() {
    const panel = document.getElementById('notification-panel');
    panel.style.display = 'block';
    setTimeout(() => panel.classList.add('open'), 10);
}

function closeNotifications() {
    const panel = document.getElementById('notification-panel');
    panel.classList.remove('open');
    setTimeout(() => panel.style.display = 'none', 300);
}

// Admin Functions
function checkAdminTrigger() {
    if (++adminClicks === 3) {
        if (prompt("Secure Management Passcode:") === "admin123") {
            document.getElementById('admin-panel').style.display = 'block';
            updateAdmin();
        }
        adminClicks = 0;
    }
}

function updateAdmin() {
    document.getElementById('live-count').innerText = userLogs.length;
    document.getElementById('alert-count').innerText = securityLogs.length;
    document.getElementById('booking-count').innerText = allBookings.filter(b => b.status === 'confirmed').length;
    
    const totalRevenue = payments
        .filter(p => p.type === 'debit' && p.description.includes('Booked'))
        .reduce((sum, p) => sum + p.amount, 0);
    document.getElementById('revenue-count').innerText = `₹${totalRevenue}`;
    
    // Crowd density
    const density = Math.min((userLogs.length / 40) * 100, 100);
    const fill = document.getElementById('crowd-fill');
    const status = document.getElementById('crowd-status');
    fill.style.width = density + "%";
    
    if (density < 40) {
        fill.style.background = "#00b894";
        status.innerText = "Status: Optimal Service";
    } else if (density < 80) {
        fill.style.background = "#fdcb6e";
        status.innerText = "Status: Busy (Expect Delays)";
    } else {
        fill.style.background = "#ff7675";
        status.innerText = "Status: High Congestion (Critical)";
    }

    // Update logs
    document.getElementById('log-body').innerHTML = userLogs
        .slice(-20)
        .reverse()
        .map(u => `<tr><td>${u.name}</td><td>${u.roll}</td><td>${u.meal}</td><td>${u.time}</td></tr>`)
        .join('');
    
    document.getElementById('sec-body').innerHTML = securityLogs
        .slice(-20)
        .reverse()
        .map(s => `<tr><td>${s.roll}</td><td>${s.meal}</td><td>${s.time}</td></tr>`)
        .join('');

    // Update feedback log
    const feedbackLog = document.getElementById('feedback-log');
    if (ratings.length === 0) {
        feedbackLog.innerHTML = '<p style="color: #999;">No feedback yet</p>';
    } else {
        feedbackLog.innerHTML = ratings.slice(-10).reverse().map(r => `
            <div class="feedback-item">
                <p><strong>${r.userName}</strong> - Taste: ${r.taste}⭐ Hygiene: ${r.hygiene}⭐</p>
                <p style="font-size: 0.85rem; color: #999;">${r.feedback || 'No comment'}</p>
                <p style="font-size: 0.75rem; color: #666;">${new Date(r.timestamp).toLocaleString()}</p>
            </div>
        `).join('');
    }
}

function downloadCSV() {
    if (allBookings.length === 0) {
        return alert('No data available for export.');
    }
    
    let csv = "Name,Roll,Date,Meal,Type,Price,Status\n";
    csv += allBookings.map(b => 
        `${b.userName},${b.userRoll},${b.date},${b.meal},${b.type},${b.price},${b.status}`
    ).join("\n");
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QuickBite_Report_${new Date().toLocaleDateString()}.csv`;
    a.click();
}

function clearLogs() {
    if (confirm("DANGER: Wiping daily attendance and security data. Confirm?")) {
        userLogs = [];
        securityLogs = [];
        localStorage.removeItem(STORAGE_KEYS.logs);
        localStorage.removeItem(STORAGE_KEYS.security);
        updateAdmin();
        alert('Logs cleared successfully');
    }
}

function closeAdmin() {
    document.getElementById('admin-panel').style.display = 'none';
}

// Update App State
function updateApp() {
    renderMenu();
    updateCrowdStatus();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
