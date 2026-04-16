window.addEventListener('load', () => {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.style.display = 'none');
    loadProducts();
    loadOrders();
    loadEmployees();
    loadAdmins();
    loadUsers();
    loadMessages();
    loadDashboard();
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
        setupCartEventListeners();
    }
    checkLoginStatus();
    handleContactForm();
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Popup Logic
const loginBtn = document.getElementById('login-btn');
const userNameBtn = document.getElementById('user-name-btn');
const loginChoicePopup = document.getElementById('login-choice-popup');
const userLoginBtn = document.getElementById('user-login-btn');
const adminLoginBtn = document.getElementById('admin-login-btn');
const closeChoice = document.getElementById('close-choice');
const userLoginPopup = document.getElementById('user-login-popup');
const closeUserLogin = document.getElementById('close-user-login');
const cancelUserLogin = document.getElementById('cancel-user-login');
const signupLink = document.getElementById('signup-link');
const signupPopup = document.getElementById('signup-popup');
const closeSignup = document.getElementById('close-signup');
const cancelSignup = document.getElementById('cancel-signup');
const loginLink = document.getElementById('login-link');
const adminLoginPopup = document.getElementById('admin-login-popup');
const closeAdminLogin = document.getElementById('close-admin-login');
const cancelAdminLogin = document.getElementById('cancel-admin-login');
const logoutPopup = document.getElementById('logout-popup');
const closeLogout = document.getElementById('close-logout');
const logoutConfirmBtn = document.getElementById('logout-confirm-btn');
const cancelLogout = document.getElementById('cancel-logout');
const addProductBtn = document.getElementById('add-product-btn');
const addProductPopup = document.getElementById('add-product-popup');
const closeProduct = document.getElementById('close-product');
const cancelProduct = document.getElementById('cancel-product');
const updateProductPopup = document.getElementById('update-product-popup');
const closeUpdateProduct = document.getElementById('close-update-product');
const cancelUpdateProduct = document.getElementById('cancel-update-product');
const addEmployeeBtn = document.getElementById('add-employee-btn');
const addEmployeePopup = document.getElementById('add-employee-popup');
const closeEmployee = document.getElementById('close-employee');
const cancelEmployee = document.getElementById('cancel-employee');
const updateEmployeePopup = document.getElementById('update-employee-popup');
const closeUpdateEmployee = document.getElementById('close-update-employee');
const cancelUpdateEmployee = document.getElementById('cancel-update-employee');
const addAdminBtn = document.getElementById('add-admin-btn');
const addAdminPopup = document.getElementById('add-admin-popup');
const closeAdmin = document.getElementById('close-admin');
const cancelAdmin = document.getElementById('cancel-admin');
const updateAdminPopup = document.getElementById('update-admin-popup');
const closeUpdateAdmin = document.getElementById('close-update-admin');
const cancelUpdateAdmin = document.getElementById('cancel-update-admin');
const addUserBtn = document.getElementById('add-user-btn');
const addUserPopup = document.getElementById('add-user-popup');
const closeUser = document.getElementById('close-user');
const cancelUser = document.getElementById('cancel-user');
const updateUserPopup = document.getElementById('update-user-popup');
const closeUpdateUser = document.getElementById('close-update-user');
const cancelUpdateUser = document.getElementById('cancel-update-user');
const updateOrderPopup = document.getElementById('update-order-popup');
const closeUpdateOrder = document.getElementById('close-update-order');
const cancelUpdateOrder = document.getElementById('cancel-update-order');

// Check Login Status
async function checkLoginStatus() {
    try {
        const response = await fetch('api/check-login.php', { credentials: 'same-origin' });
        const result = await response.json();
        if (result.loggedIn && result.display_name) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userNameBtn) {
                userNameBtn.style.display = 'inline-block';
                userNameBtn.textContent = result.display_name;
            }
            if (window.location.pathname.includes('admin.html') && result.type !== 'admin') {
                window.location.href = 'index.html';
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (userNameBtn) userNameBtn.style.display = 'none';
            if (window.location.pathname.includes('admin.html')) {
                window.location.href = 'index.html';
            }
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (userNameBtn) userNameBtn.style.display = 'none';
    }
}

// Open Login Choice Popup
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginChoicePopup) loginChoicePopup.style.display = 'flex';
    });
}

// Open User Login Popup
if (userLoginBtn) {
    userLoginBtn.addEventListener('click', () => {
        if (loginChoicePopup) loginChoicePopup.style.display = 'none';
        if (userLoginPopup) userLoginPopup.style.display = 'flex';
    });
}

// Open Admin Login Popup
if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => {
        if (loginChoicePopup) loginChoicePopup.style.display = 'none';
        if (adminLoginPopup) adminLoginPopup.style.display = 'flex';
    });
}

// Open SignUp Popup
if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (userLoginPopup) userLoginPopup.style.display = 'none';
        if (signupPopup) signupPopup.style.display = 'flex';
    });
}

// Open Login Popup from SignUp
if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (signupPopup) signupPopup.style.display = 'none';
        if (userLoginPopup) userLoginPopup.style.display = 'flex';
    });
}

// Open Logout Popup
if (userNameBtn) {
    userNameBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (logoutPopup) logoutPopup.style.display = 'flex';
    });
}

// Handle Logout
if (logoutConfirmBtn) {
    logoutConfirmBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('api/logout.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'
            });
            const result = await response.json();
            if (result.success) {
                if (logoutPopup) logoutPopup.style.display = 'none';
                if (loginBtn) loginBtn.style.display = 'inline-block';
                if (userNameBtn) userNameBtn.style.display = 'none';
                if (window.location.pathname.includes('admin.html')) {
                    window.location.href = 'index.html';
                } else {
                    window.location.reload();
                }
                alert(result.message);
            } else {
                alert('Logout failed: ' + result.message);
            }
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Logout failed. Please try again.');
        }
    });
}

// Close Popups
[closeChoice, closeUserLogin, closeSignup, closeAdminLogin, closeLogout, closeProduct, cancelProduct, closeUpdateProduct, cancelUpdateProduct, closeEmployee, cancelEmployee, closeUpdateEmployee, cancelUpdateEmployee, closeAdmin, cancelAdmin, closeUpdateAdmin, cancelUpdateAdmin, closeUser, cancelUser, closeUpdateUser, cancelUpdateUser, closeUpdateOrder, cancelUpdateOrder].forEach(closeBtn => {
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            [loginChoicePopup, userLoginPopup, signupPopup, adminLoginPopup, logoutPopup, addProductPopup, updateProductPopup, addEmployeePopup, updateEmployeePopup, addAdminPopup, updateAdminPopup, addUserPopup, updateUserPopup, updateOrderPopup].forEach(popup => {
                if (popup) popup.style.display = 'none';
            });
        });
    }
});

// Close Popup on Outside Click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup')) {
        [loginChoicePopup, userLoginPopup, signupPopup, adminLoginPopup, logoutPopup, addProductPopup, updateProductPopup, addEmployeePopup, updateEmployeePopup, addAdminPopup, updateAdminPopup, addUserPopup, updateUserPopup, updateOrderPopup].forEach(popup => {
            if (popup) popup.style.display = 'none';
        });
    }
});

// Password Visibility Toggle
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const passwordField = this.previousElementSibling;
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
});

// Input Validation
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^\+?\d{10,15}$/.test(phone);
}

function validatePassword(password) {
    return password.length >= 6;
}

// User Signup
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            first_name: document.getElementById('first-name').value.trim(),
            last_name: document.getElementById('last-name').value.trim(),
            address: document.getElementById('address').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('signup-password').value,
            confirm_password: document.getElementById('confirm-password').value
        };

        if (!formData.first_name || !formData.last_name || !formData.address || !formData.phone || !formData.email || !formData.password) {
            alert('All fields are required');
            return;
        }
        if (!validateEmail(formData.email)) {
            alert('Invalid email format');
            return;
        }
        if (!validatePhone(formData.phone)) {
            alert('Invalid phone number');
            return;
        }
        if (!validatePassword(formData.password)) {
            alert('Password must be at least 6 characters');
            return;
        }
        if (formData.password !== formData.confirm_password) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('api/signup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (signupPopup) signupPopup.style.display = 'none';
                if (userLoginPopup) userLoginPopup.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Signup failed. Please try again.');
        }
    });
}

// User Login
const userLoginForm = document.getElementById('user-login-form');
if (userLoginForm) {
    userLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            username_email: document.getElementById('username-email').value.trim(),
            password: document.getElementById('password').value,
            type: 'user'
        };

        if (!formData.username_email || !formData.password) {
            alert('All fields are required');
            return;
        }

        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (userLoginPopup) userLoginPopup.style.display = 'none';
                if (loginBtn) loginBtn.style.display = 'none';
                if (userNameBtn) {
                    userNameBtn.style.display = 'inline-block';
                    userNameBtn.textContent = result.display_name;
                }
                window.location.reload();
            }
        } catch (error) {
            console.error('Error during user login:', error);
            alert('Login failed. Please try again.');
        }
    });
}

// Admin Login
const adminLoginForm = document.getElementById('admin-login-form');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            username_email: document.getElementById('admin-username-email').value.trim(),
            password: document.getElementById('admin-password').value,
            type: 'admin'
        };

        if (!formData.username_email || !formData.password) {
            alert('All fields are required');
            return;
        }

        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (adminLoginPopup) adminLoginPopup.style.display = 'none';
                if (loginBtn) loginBtn.style.display = 'none';
                if (userNameBtn) {
                    userNameBtn.style.display = 'inline-block';
                    userNameBtn.textContent = result.display_name;
                }
                window.location.href = 'admin.html';
            }
        } catch (error) {
            console.error('Error during admin login:', error);
            alert('Login failed. Please try again.');
        }
    });
}

// Contact Form Submission
function handleContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('contact-name').value.trim(),
                email: document.getElementById('contact-email').value.trim(),
                message: document.getElementById('contact-message').value.trim()
            };

            if (!formData.name || !formData.email || !formData.message) {
                alert('All fields are required');
                return;
            }
            if (!validateEmail(formData.email)) {
                alert('Invalid email format');
                return;
            }

            try {
                const response = await fetch('api/contact.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                alert(result.message);
                if (result.success) {
                    contactForm.reset();
                }
            } catch (error) {
                console.error('Error submitting contact form:', error);
                alert('Failed to send message. Please try again.');
            }
        });
    }
}

// Load Dashboard Data
async function loadDashboard() {
    const inStockProductsElement = document.getElementById('in-stock-products');
    const pendingOrdersElement = document.getElementById('pending-orders');
    const completedOrdersElement = document.getElementById('completed-orders');
    const cancelledOrdersElement = document.getElementById('cancelled-orders');
    const totalUsersElement = document.getElementById('total-users');
    const totalEmployeesElement = document.getElementById('total-employees');
    const salesChartCanvas = document.getElementById('sales-chart');
    const statusPieChartCanvas = document.getElementById('status-pie-chart');

    if (!inStockProductsElement || !pendingOrdersElement || !completedOrdersElement || !cancelledOrdersElement || !totalUsersElement || !totalEmployeesElement || !salesChartCanvas || !statusPieChartCanvas) {
        console.error('Dashboard elements missing');
        return;
    }

    // Initialize elements to prevent partial updates
    inStockProductsElement.textContent = 'Loading...';
    pendingOrdersElement.textContent = 'Loading...';
    completedOrdersElement.textContent = 'Loading...';
    cancelledOrdersElement.textContent = 'Loading...';
    totalUsersElement.textContent = 'Loading...';
    totalEmployeesElement.textContent = 'Loading...';

    try {
        // Fetch orders data
        let orders = [];
        try {
            const ordersResponse = await fetch('api/orders.php', { credentials: 'same-origin' });
            if (!ordersResponse.ok) {
                throw new Error(`Orders fetch failed: ${ordersResponse.status} ${ordersResponse.statusText}`);
            }
            orders = await ordersResponse.json();
            if (!Array.isArray(orders)) {
                throw new Error(orders.message || 'Invalid orders response');
            }
        } catch (error) {
            console.error('Orders error:', error.message);
            pendingOrdersElement.textContent = 'Error: Orders';
            completedOrdersElement.textContent = 'Error: Orders';
            cancelledOrdersElement.textContent = 'Error: Orders';
            throw error; // Stop if orders fail, as they're needed for charts
        }

        // Calculate order counts
        const pendingCount = orders.filter(order => order.status.toLowerCase() === 'pending').length;
        const completedCount = orders.filter(order => order.status.toLowerCase() === 'completed').length;
        const cancelledCount = orders.filter(order => order.status.toLowerCase() === 'cancelled').length;

        // Update order counts
        pendingOrdersElement.textContent = pendingCount;
        completedOrdersElement.textContent = completedCount;
        cancelledOrdersElement.textContent = cancelledCount;

        // Fetch in-stock products count
        try {
            const productsResponse = await fetch('api/products.php?category=all', { credentials: 'same-origin' });
            if (!productsResponse.ok) {
                throw new Error(`Products fetch failed: ${productsResponse.status} ${productsResponse.statusText}`);
            }
            const products = await productsResponse.json();
            if (!Array.isArray(products)) {
                throw new Error(products.message || 'Invalid products response');
            }
            const inStockCount = products.filter(product => product.availability === 'in_stock').length;
            inStockProductsElement.textContent = inStockCount;
        } catch (error) {
            console.error('Products error:', error.message);
            inStockProductsElement.textContent = 'Error: Products';
        }

        // Fetch total users count
        try {
            const usersResponse = await fetch('api/users.php', { credentials: 'same-origin' });
            if (!usersResponse.ok) {
                throw new Error(`Users fetch failed: ${usersResponse.status} ${usersResponse.statusText}`);
            }
            const users = await usersResponse.json();
            if (!Array.isArray(users)) {
                throw new Error(users.message || 'Invalid users response');
            }
            totalUsersElement.textContent = users.length;
        } catch (error) {
            console.error('Users error:', error.message);
            totalUsersElement.textContent = 'Error: Users';
        }

        // Fetch total employees count
        try {
            const employeesResponse = await fetch('api/employees.php', { credentials: 'same-origin' });
            if (!employeesResponse.ok) {
                throw new Error(`Employees fetch failed: ${employeesResponse.status} ${employeesResponse.statusText}`);
            }
            const employees = await employeesResponse.json();
            if (!Array.isArray(employees)) {
                throw new Error(employees.message || 'Invalid employees response');
            }
            totalEmployeesElement.textContent = employees.length;
        } catch (error) {
            console.error('Employees error:', error.message);
            totalEmployeesElement.textContent = 'Error: Employees';
        }

        // Pie Chart: Order Status Distribution
        new Chart(statusPieChartCanvas, {
            type: 'pie',
            data: {
                labels: ['Pending', 'Completed', 'Cancelled'],
                datasets: [{
                    data: [pendingCount, completedCount, cancelledCount],
                    backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
                    borderColor: ['#fff', '#fff', '#fff'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#333',
                            font: {
                                size: 14
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Order Status Distribution',
                        color: '#333',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });

        // Line Chart: Daily Sales Trend
        try {
            const salesResponse = await fetch('api/order-log.php', { credentials: 'same-origin' });
            const salesResult = await salesResponse.json();
            if (!salesResult.success) {
                throw new Error(salesResult.message || 'Failed to load sales data');
            }
            const sales = salesResult.sales || [];
            const labels = sales.map(sale => sale.date);
            const data = sales.map(sale => sale.total);
            new Chart(salesChartCanvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Daily Sales (LKR)',
                        data: data,
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date',
                                color: '#333',
                                font: {
                                    size: 14
                                }
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Sales (LKR)',
                                color: '#333',
                                font: {
                                    size: 14
                                }
                            },
                            beginAtZero: true,
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 12
                                }
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Daily Sales Trend',
                            color: '#333',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            labels: {
                                color: '#333',
                                font: {
                                    size: 14
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Sales chart error:', error.message);
        }
    } catch (error) {
        console.error('Dashboard error:', error.message);
    }
}

// Load Products
async function loadProducts() {
    const category = document.getElementById('category')?.value || 'all';
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    try {
        const response = await fetch(`api/products.php?category=${category}`, { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        let products;
        try {
            products = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON:', text.substring(0, 100) + '...');
            throw new Error(`Invalid JSON response: ${e.message}`);
        }

        if (!Array.isArray(products)) {
            throw new Error(products.message || 'Invalid response from server');
        }

        productsGrid.innerHTML = '';
        if (products.length === 0) {
            productsGrid.innerHTML = '<p>No products found.</p>';
            return;
        }

        const isAdminPage = window.location.pathname.includes('admin.html');

        products.forEach(product => {
            const price = parseFloat(product.price);
            const formattedPrice = isNaN(price) ? '0.00' : price.toFixed(2);
            // Always use get-image.php for image URL, fallback to placeholder if invalid
            const imageSrc = product.image && product.image.startsWith('get-image.php') ? `api/${product.image}` : 'images/placeholder.jpg';
            const productCard = `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${imageSrc}" alt="${product.name}" onerror="this.src='images/placeholder.jpg';">
                    </div>
                    <div class="product-details">
                        <h3>${product.name}</h3>
                        <p>Category: ${product.category}</p>
                        <p>Availability: ${product.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}</p>
                        <p class="price">LKR ${formattedPrice}</p>
                        ${isAdminPage ? `
                            <div class="admin-controls">
                                <button class="update-btn" data-product-id="${product.id}">Update</button>
                                <button class="delete-btn product-delete-btn" data-product-id="${product.id}">Delete</button>
                            </div>
                        ` : `
                            <button class="add-to-cart-btn" data-product-id="${product.id}" ${product.availability === 'out_of_stock' ? 'disabled' : ''}>Add To Cart</button>
                        `}
                    </div>
                </div>
            `;
            productsGrid.innerHTML += productCard;
        });

        if (isAdminPage) {
            document.querySelectorAll('.products-grid .update-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const productId = btn.getAttribute('data-product-id');
                    try {
                        const response = await fetch(`api/products.php?id=${productId}`, { credentials: 'same-origin' });
                        if (!response.ok) {
                            throw new Error(`Server error: ${response.status} ${response.statusText}`);
                        }
                        const product = await response.json();
                        if (product.success === false) {
                            throw new Error(product.message || 'Product not found');
                        }
                        const formElements = {
                            id: document.getElementById('update-product-id'),
                            name: document.getElementById('update-product-name'),
                            category: document.getElementById('update-category'),
                            price: document.getElementById('update-price'),
                            availability: document.getElementById('update-availability'),
                            image: document.getElementById('update-product-image')
                        };
                        if (!formElements.id || !formElements.name || !formElements.category || !formElements.price || !formElements.availability || !formElements.image) {
                            throw new Error('One or more form elements are missing');
                        }
                        formElements.id.value = product.id || '';
                        formElements.name.value = product.name || '';
                        formElements.category.value = product.category || '';
                        formElements.price.value = product.price ? parseFloat(product.price).toFixed(2) : '';
                        formElements.availability.value = product.availability || '';
                        formElements.image.value = '';
                        if (updateProductPopup) {
                            updateProductPopup.style.display = 'flex';
                        } else {
                            throw new Error('Update popup element not found');
                        }
                    } catch (error) {
                        console.error('Error fetching product:', error);
                        alert(`Failed to load product details: ${error.message}`);
                    }
                });
            });

            document.querySelectorAll('.products-grid .product-delete-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const productId = btn.getAttribute('data-product-id');
                    if (confirm(`Are you sure you want to delete product ID ${productId}?`)) {
                        try {
                            const response = await fetch('api/delete-product.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'same-origin',
                                body: JSON.stringify({ product_id: productId })
                            });
                            const result = await response.json();
                            alert(result.message);
                            if (result.success) {
                                loadProducts();
                            }
                        } catch (error) {
                            console.error('Error deleting product:', error);
                            alert('Failed to delete product. Please try again.');
                        }
                    }
                });
            });
        } else {
            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const productId = btn.getAttribute('data-product-id');
                    try {
                        const response = await fetch('api/cart.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'same-origin',
                            body: JSON.stringify({ product_id: productId, quantity: 1 })
                        });
                        const result = await response.json();
                        if (!result.success && result.message === 'Please log in to manage cart') {
                            if (loginChoicePopup) loginChoicePopup.style.display = 'flex';
                        } else {
                            alert(result.message);
                            if (result.success && window.location.pathname.includes('cart.html')) {
                                loadCart();
                            }
                        }
                    } catch (error) {
                        console.error('Error adding to cart:', error);
                        alert('Failed to add to cart. Please try again.');
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error loading products:', error.message, error.stack);
        if (productsGrid) {
            let errorMessage = 'Failed to load products. Please try again later.';
            if (error.message.includes('Server error')) {
                errorMessage = `Unable to connect to the server: ${error.message}`;
            } else if (error.message.includes('Invalid JSON')) {
                errorMessage = `Server returned invalid data: ${error.message}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            productsGrid.innerHTML = `<p class="error">${errorMessage}</p>`;
        }
    }
}

// Category Dropdown Change Handler
const categoryDropdown = document.getElementById('category');
if (categoryDropdown) {
    categoryDropdown.addEventListener('change', () => {
        loadProducts();
    });
}

// Load Orders
async function loadOrders() {
    const ordersGrid = document.querySelector('.orders-grid');
    if (!ordersGrid) return;

    try {
        const response = await fetch('api/orders.php', { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        const orders = await response.json();

        if (!Array.isArray(orders)) {
            throw new Error(orders.message || 'Invalid response from server');
        }

        ordersGrid.innerHTML = '';
        if (orders.length === 0) {
            ordersGrid.innerHTML = '<p>No orders found.</p>';
            return;
        }

        orders.forEach(order => {
            const itemsList = order.items;
            const orderCard = `
                <div class="order-card">
                    <p>Order #${order.id} - ${itemsList}</p>
                    <p>Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                    <p>Total: LKR ${parseFloat(order.total).toFixed(2)}</p>
                    <p>Created: ${order.created_at}</p>
                    <div class="admin-controls">
                        <button class="update-btn order-update-btn" data-order-id="${order.id}" data-order-status="${order.status}">Update Status</button>
                        <button class="delete-btn order-delete-btn" data-order-id="${order.id}">Delete</button>
                    </div>
                </div>
            `;
            ordersGrid.innerHTML += orderCard;
        });

        document.querySelectorAll('.orders-grid .order-update-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const orderId = btn.getAttribute('data-order-id');
                let orderStatus = btn.getAttribute('data-order-status').toLowerCase();
                if (!['pending', 'completed', 'cancelled'].includes(orderStatus)) {
                    orderStatus = 'pending';
                }
                const formElements = {
                    id: document.getElementById('update-order-id'),
                    status: document.getElementById('update-order-status')
                };
                if (!formElements.id || !formElements.status) {
                    alert('Form elements missing for order update');
                    return;
                }
                formElements.id.value = orderId;
                formElements.status.value = orderStatus;
                if (updateOrderPopup) {
                    updateOrderPopup.style.display = 'flex';
                } else {
                    alert('Update order popup not found');
                }
            });
        });

        document.querySelectorAll('.orders-grid .order-delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const orderId = btn.getAttribute('data-order-id');
                if (confirm(`Are you sure you want to delete order ID ${orderId}?`)) {
                    try {
                        const response = await fetch('api/delete-order.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'same-origin',
                            body: JSON.stringify({ order_id: orderId })
                        });
                        const result = await response.json();
                        alert(result.message);
                        if (result.success) {
                            loadOrders();
                        }
                    } catch (error) {
                        console.error('Error deleting order:', error);
                        alert('Failed to delete order. Please try again.');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading orders:', error.message, error.stack);
        if (ordersGrid) {
            let errorMessage = 'Failed to load orders. Please try again later.';
            if (error.message.includes('Server error')) {
                errorMessage = `Unable to connect to the server: ${error.message}`;
            } else if (error.message.includes('Invalid response')) {
                errorMessage = `Server error: ${error.message}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            ordersGrid.innerHTML = `<p class="error">${errorMessage}</p>`;
        }
    }
}

// Load Employees
async function loadEmployees() {
    const employeesGrid = document.querySelector('.employees-grid');
    if (!employeesGrid) return;

    try {
        const response = await fetch('api/employees.php', { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        const employees = await response.json();

        if (!Array.isArray(employees)) {
            throw new Error(employees.message || 'Invalid response from server');
        }

        employeesGrid.innerHTML = '';
        if (employees.length === 0) {
            employeesGrid.innerHTML = '<p>No employees found.</p>';
            return;
        }

        employeesGrid.innerHTML = `
            <table class="employee-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Hire Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${employees.map(employee => `
                        <tr>
                            <td>${employee.id}</td>
                            <td>${employee.name}</td>
                            <td>${employee.email}</td>
                            <td>${employee.role}</td>
                            <td>${employee.hire_date}</td>
                            <td>
                                <button class="update-btn" data-employee-id="${employee.id}">Update</button>
                                <button class="delete-btn employee-delete-btn" data-employee-id="${employee.id}">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.querySelectorAll('.employee-table .update-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const employeeId = btn.getAttribute('data-employee-id');
                try {
                    const response = await fetch(`api/employees.php?id=${employeeId}`, { credentials: 'same-origin' });
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status} ${response.statusText}`);
                    }
                    const employee = await response.json();
                    if (employee.success === false) {
                        throw new Error(employee.message || 'Employee not found');
                    }
                    const formElements = {
                        id: document.getElementById('update-employee-id'),
                        name: document.getElementById('update-employee-name'),
                        email: document.getElementById('update-employee-email'),
                        role: document.getElementById('update-employee-role'),
                        hire_date: document.getElementById('update-employee-hire-date')
                    };
                    if (!formElements.id || !formElements.name || !formElements.email || !formElements.role || !formElements.hire_date) {
                        throw new Error('One or more form elements are missing');
                    }
                    formElements.id.value = employee.id || '';
                    formElements.name.value = employee.name || '';
                    formElements.email.value = employee.email || '';
                    formElements.role.value = employee.role || '';
                    formElements.hire_date.value = employee.hire_date || '';
                    if (updateEmployeePopup) {
                        updateEmployeePopup.style.display = 'flex';
                    } else {
                        throw new Error('Update employee popup not found');
                    }
                } catch (error) {
                    console.error('Error fetching employee:', error);
                    alert(`Failed to load employee details: ${error.message}`);
                }
            });
        });

        document.querySelectorAll('.employee-table .employee-delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const employeeId = btn.getAttribute('data-employee-id');
                if (confirm(`Are you sure you want to delete employee ID ${employeeId}?`)) {
                    try {
                        const response = await fetch('api/delete-employee.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'same-origin',
                            body: JSON.stringify({ employee_id: employeeId })
                        });
                        const result = await response.json();
                        alert(result.message);
                        if (result.success) {
                            loadEmployees();
                        }
                    } catch (error) {
                        console.error('Error deleting employee:', error);
                        alert('Failed to delete employee. Please try again.');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading employees:', error.message, error.stack);
        if (employeesGrid) {
            let errorMessage = 'Failed to load employees. Please try again later.';
            if (error.message.includes('Server error')) {
                errorMessage = `Unable to connect to the server: ${error.message}`;
            } else if (error.message.includes('Invalid response')) {
                errorMessage = `Server error: ${error.message}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            employeesGrid.innerHTML = `<p class="error">${errorMessage}</p>`;
        }
    }
}

// Load Admins
async function loadAdmins() {
    const adminsGrid = document.querySelector('.admins-grid');
    if (!adminsGrid) return;

    try {
        const response = await fetch('api/admins.php', { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        const admins = await response.json();

        if (!Array.isArray(admins)) {
            throw new Error(admins.message || 'Invalid response from server');
        }

        adminsGrid.innerHTML = '';
        if (admins.length === 0) {
            adminsGrid.innerHTML = '<p>No admins found.</p>';
            return;
        }

        admins.forEach(admin => {
            const adminCard = `
                <div class="admin-card">
                    <p>Username: ${admin.username}</p>
                    <p>Email: ${admin.email}</p>
                    <div class="admin-controls">
                        <button class="update-btn admin-update-btn" data-admin-id="${admin.id}">Update</button>
                        <button class="delete-btn admin-delete-btn" data-admin-id="${admin.id}">Delete</button>
                    </div>
                </div>
            `;
            adminsGrid.innerHTML += adminCard;
        });

        document.querySelectorAll('.admins-grid .admin-update-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const adminId = btn.getAttribute('data-admin-id');
                try {
                    const response = await fetch(`api/admins.php?id=${adminId}`, { credentials: 'same-origin' });
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status} ${response.statusText}`);
                    }
                    const admin = await response.json();
                    if (admin.success === false) {
                        throw new Error(admin.message || 'Admin not found');
                    }
                    const formElements = {
                        id: document.getElementById('update-admin-id'),
                        username: document.getElementById('update-admin-username'),
                        email: document.getElementById('update-admin-email'),
                        password: document.getElementById('update-admin-password')
                    };
                    if (!formElements.id || !formElements.username || !formElements.email || !formElements.password) {
                        throw new Error('One or more form elements are missing');
                    }
                    formElements.id.value = admin.id || '';
                    formElements.username.value = admin.username || '';
                    formElements.email.value = admin.email || '';
                    formElements.password.value = '';
                    if (updateAdminPopup) {
                        updateAdminPopup.style.display = 'flex';
                    } else {
                        throw new Error('Update admin popup not found');
                    }
                } catch (error) {
                    console.error('Error fetching admin:', error);
                    alert(`Failed to load admin details: ${error.message}`);
                }
            });
        });

        document.querySelectorAll('.admins-grid .admin-delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const adminId = btn.getAttribute('data-admin-id');
                if (confirm(`Are you sure you want to delete admin ID ${adminId}?`)) {
                    try {
                        const response = await fetch('api/delete-admin.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'same-origin',
                            body: JSON.stringify({ admin_id: adminId })
                        });
                        const result = await response.json();
                        alert(result.message);
                        if (result.success) {
                            loadAdmins();
                        }
                    } catch (error) {
                        console.error('Error deleting admin:', error);
                        alert('Failed to delete admin. Please try again.');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading admins:', error.message, error.stack);
        if (adminsGrid) {
            let errorMessage = 'Failed to load admins. Please try again later.';
            if (error.message.includes('Server error')) {
                errorMessage = `Unable to connect to the server: ${error.message}`;
            } else if (error.message.includes('Invalid response')) {
                errorMessage = `Server error: ${error.message}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            adminsGrid.innerHTML = `<p class="error">${errorMessage}</p>`;
        }
    }
}

// Load Users
async function loadUsers() {
    const usersGrid = document.querySelector('.users-grid');
    if (!usersGrid) return;

    try {
        const response = await fetch('api/users.php', { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        const users = await response.json();

        if (!Array.isArray(users)) {
            throw new Error(users.message || 'Invalid response from server');
        }

        usersGrid.innerHTML = '';
        if (users.length === 0) {
            usersGrid.innerHTML = '<p>No users found.</p>';
            return;
        }

        users.forEach(user => {
            const userCard = `
                <div class="user-card">
                    <p>Name: ${user.first_name} ${user.last_name}</p>
                    <p>Email: ${user.email}</p>
                    <p>Phone: ${user.phone}</p>
                    <p>Address: ${user.address}</p>
                    <div class="admin-controls">
                        <button class="update-btn user-update-btn" data-user-id="${user.id}">Update</button>
                        <button class="delete-btn user-delete-btn" data-user-id="${user.id}">Delete</button>
                    </div>
                </div>
            `;
            usersGrid.innerHTML += userCard;
        });

        document.querySelectorAll('.users-grid .user-update-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const userId = btn.getAttribute('data-user-id');
                try {
                    const response = await fetch(`api/users.php?id=${userId}`, { credentials: 'same-origin' });
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status} ${response.statusText}`);
                    }
                    const user = await response.json();
                    if (user.success === false) {
                        throw new Error(user.message || 'User not found');
                    }
                    const formElements = {
                        id: document.getElementById('update-user-id'),
                        first_name: document.getElementById('update-first-name'),
                        last_name: document.getElementById('update-last-name'),
                        address: document.getElementById('update-address'),
                        phone: document.getElementById('update-phone'),
                        email: document.getElementById('update-user-email'),
                        password: document.getElementById('update-user-password')
                    };
                    if (!formElements.id || !formElements.first_name || !formElements.last_name || !formElements.address || !formElements.phone || !formElements.email || !formElements.password) {
                        throw new Error('One or more form elements are missing');
                    }
                    formElements.id.value = user.id || '';
                    formElements.first_name.value = user.first_name || '';
                    formElements.last_name.value = user.last_name || '';
                    formElements.address.value = user.address || '';
                    formElements.phone.value = user.phone || '';
                    formElements.email.value = user.email || '';
                    formElements.password.value = '';
                    if (updateUserPopup) {
                        updateUserPopup.style.display = 'flex';
                    } else {
                        throw new Error('Update user popup not found');
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                    alert(`Failed to load user details: ${error.message}`);
                }
            });
        });

        document.querySelectorAll('.users-grid .user-delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const userId = btn.getAttribute('data-user-id');
                if (confirm(`Are you sure you want to delete user ID ${userId}?`)) {
                    try {
                        const response = await fetch('api/delete-user.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'same-origin',
                            body: JSON.stringify({ user_id: userId })
                        });
                        const result = await response.json();
                        alert(result.message);
                        if (result.success) {
                            loadUsers();
                        }
                    } catch (error) {
                        console.error('Error deleting user:', error);
                        alert('Failed to delete user. Please try again.');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading users:', error.message, error.stack);
        if (usersGrid) {
            let errorMessage = 'Failed to load users. Please try again later.';
            if (error.message.includes('Server error')) {
                errorMessage = `Unable to connect to the server: ${error.message}`;
            } else if (error.message.includes('Invalid response')) {
                errorMessage = `Server error: ${error.message}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            usersGrid.innerHTML = `<p class="error">${errorMessage}</p>`;
        }
    }
}

// Load Messages
async function loadMessages() {
    const messagesGrid = document.querySelector('.messages-grid');
    if (!messagesGrid) return;

    try {
        const response = await fetch('api/contact.php', { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        const messages = await response.json();

        if (!Array.isArray(messages)) {
            throw new Error(messages.message || 'Invalid response from server');
        }

        messagesGrid.innerHTML = '';
        if (messages.length === 0) {
            messagesGrid.innerHTML = '<p>No messages found.</p>';
            return;
        }

        messages.forEach(message => {
            const isRead = message.status === 'read';
            const messageCard = `
                <div class="message-card">
                    <p>Name: ${message.name}</p>
                    <p>Email: ${message.email}</p>
                    <p>Message: ${message.message}</p>
                    <p>Received: ${message.created_at}</p>
                    <button class="mark-read-btn ${isRead ? 'marked' : ''}" data-message-id="${message.id}" ${isRead ? 'disabled' : ''}>
                        ${isRead ? 'Marked' : 'Mark as Read'}
                    </button>
                    <button class="delete-btn message-delete-btn" data-message-id="${message.id}">Delete</button>
                </div>
            `;
            messagesGrid.innerHTML += messageCard;
        });

        // Event listener for Mark as Read buttons
        document.querySelectorAll('.messages-grid .mark-read-btn:not(.marked)').forEach(btn => {
            btn.addEventListener('click', async () => {
                const messageId = btn.getAttribute('data-message-id');
                try {
                    const response = await fetch('api/mark-message-read.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'same-origin',
                        body: JSON.stringify({ message_id: messageId })
                    });
                    const result = await response.json();
                    if (result.success) {
                        btn.textContent = 'Marked';
                        btn.classList.add('marked');
                        btn.disabled = true;
                        alert(result.message);
                    } else {
                        alert('Failed to mark message as read: ' + result.message);
                    }
                } catch (error) {
                    console.error('Error marking message as read:', error);
                    alert('Failed to mark message as read. Please try again.');
                }
            });
        });

        // Event listener for Delete buttons
        document.querySelectorAll('.messages-grid .message-delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const messageId = btn.getAttribute('data-message-id');
                if (confirm(`Are you sure you want to delete message ID ${messageId}?`)) {
                    try {
                        const response = await fetch('api/delete-message.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'same-origin',
                            body: JSON.stringify({ message_id: messageId })
                        });
                        const result = await response.json();
                        alert(result.message);
                        if (result.success) {
                            loadMessages();
                        }
                    } catch (error) {
                        console.error('Error deleting message:', error);
                        alert('Failed to delete message. Please try again.');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading messages:', error.message, error.stack);
        if (messagesGrid) {
            let errorMessage = 'Failed to load messages. Please try again later.';
            if (error.message.includes('Server error')) {
                errorMessage = `Unable to connect to the server: ${error.message}`;
            } else if (error.message.includes('Invalid response')) {
                errorMessage = `Server error: ${error.message}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            messagesGrid.innerHTML = `<p class="error">${errorMessage}</p>`;
        }
    }
}

// Load Cart
// Load Cart
async function loadCart() {
    const cartTableBody = document.querySelector('.cart-table tbody');
    const cartSummary = document.querySelector('.summary-details');
    if (!cartTableBody || !cartSummary) return;

    try {
        const response = await fetch('api/cart.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to load cart');
        }

        cartTableBody.innerHTML = '';
        cartSummary.innerHTML = '';

        const items = result.items || [];
        if (items.length === 0) {
            cartTableBody.innerHTML = '<tr><td colspan="5" class="error">Your cart is empty.</td></tr>';
            cartSummary.innerHTML = '<p class="total">Total: LKR 0.00</p>';
            return;
        }

        let subtotal = 0;
        items.forEach(item => {
            const itemSubtotal = parseFloat(item.price) * parseInt(item.quantity);
            subtotal += itemSubtotal;

            const imageUrl = item.product_id ? `api/get-image.php?id=${item.product_id}` : 'images/placeholder.png';
            const row = `
                <tr>
                    <td class="product-info">
                        <img src="${imageUrl}" alt="${item.name}" onerror="this.src='images/placeholder.png'; console.warn('Failed to load image for product ID ${item.product_id}: ${imageUrl}');">
                        <span>${item.name}</span>
                    </td>
                    <td>LKR ${parseFloat(item.price).toFixed(2)}</td>
                    <td>
                        <input type="number" class="quantity-input" data-cart-id="${item.id}" value="${item.quantity}" min="1">
                    </td>
                    <td>LKR ${itemSubtotal.toFixed(2)}</td>
                    <td>
                        <button class="remove-btn" data-cart-id="${item.id}">✖</button>
                    </td>
                </tr>
            `;
            cartTableBody.innerHTML += row;
        });

        const shipping = subtotal > 0 ? 500 : 0; // Example: LKR 500 shipping, free if cart is empty
        const total = subtotal + shipping;

        cartSummary.innerHTML = `
            <p><span>Subtotal:</span> <span>LKR ${subtotal.toFixed(2)}</span></p>
            <p><span>Shipping:</span> <span>LKR ${shipping.toFixed(2)}</span></p>
            <p class="total"><span>Total:</span> <span>LKR ${total.toFixed(2)}</span></p>
        `;
    } catch (error) {
        console.error('Error loading cart:', error);
        cartTableBody.innerHTML = `<tr><td colspan="5" class="error">Error: ${error.message}</td></tr>`;
        cartSummary.innerHTML = '<p class="total">Total: LKR 0.00</p>';
    }
}

// Setup Cart Event Listeners
function setupCartEventListeners() {
    const cartTableBody = document.querySelector('.cart-table tbody');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (!cartTableBody || !checkoutBtn) return;

    // Quantity update
    cartTableBody.addEventListener('change', async (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const cartId = e.target.dataset.cartId;
            const quantity = parseInt(e.target.value);

            if (quantity < 1) {
                e.target.value = 1;
                return;
            }

            try {
                const response = await fetch('api/cart.php', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ cart_id: cartId, quantity })
                });
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message || 'Failed to update quantity');
                }

                loadCart();
            } catch (error) {
                console.error('Error updating quantity:', error);
                alert(`Error: ${error.message}`);
            }
        }
    });

    // Remove item
    cartTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const cartId = e.target.dataset.cartId;

            try {
                const response = await fetch('api/cart.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ cart_id: cartId })
                });
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message || 'Failed to remove item');
                }

                loadCart();
            } catch (error) {
                console.error('Error removing item:', error);
                alert(`Error: ${error.message}`);
            }
        }
    });

    // Checkout
    checkoutBtn.addEventListener('click', async () => {
        const totalElement = document.querySelector('.summary-details .total span:last-child');
        if (!totalElement) {
            alert('Error: Cart total not found.');
            return;
        }

        const subtotal = parseFloat(totalElement.textContent.replace('LKR ', '')) - 500; // Exclude shipping
        const shipping = 500; // Fixed shipping
        const total = subtotal + shipping;

        try {
            const response = await fetch('api/checkout.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ subtotal, shipping, total })
            });
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Checkout failed');
            }

            alert('Checkout successful! Your order has been placed.');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error during checkout:', error);
            alert(`Error: ${error.message}`);
        }
    });
}

// Add Product
if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        if (addProductPopup) addProductPopup.style.display = 'flex';
    });
}

const addProductForm = document.getElementById('add-product-form');
if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', document.getElementById('product-name').value.trim());
        formData.append('category', document.getElementById('category').value);
        formData.append('price', document.getElementById('price').value);
        formData.append('availability', document.getElementById('availability').value);
        const imageFile = document.getElementById('product-image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        if (!formData.get('name') || !formData.get('category') || !formData.get('price') || !formData.get('availability') || !imageFile) {
            alert('All fields are required');
            return;
        }

        try {
            const response = await fetch('api/add-products.php', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (addProductPopup) addProductPopup.style.display = 'none';
                addProductForm.reset();
                loadProducts();
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        }
    });
}

// Update Product
const updateProductForm = document.getElementById('update-product-form');
if (updateProductForm) {
    updateProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('product_id', document.getElementById('update-product-id').value);
        formData.append('name', document.getElementById('update-product-name').value.trim());
        formData.append('category', document.getElementById('update-category').value);
        formData.append('price', document.getElementById('update-price').value);
        formData.append('availability', document.getElementById('update-availability').value);
        const imageFile = document.getElementById('update-product-image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        if (!formData.get('product_id') || !formData.get('name') || !formData.get('category') || !formData.get('price') || !formData.get('availability')) {
            alert('All fields are required');
            return;
        }

        try {
            const response = await fetch('api/update-product.php', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (updateProductPopup) updateProductPopup.style.display = 'none';
                updateProductForm.reset();
                loadProducts();
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again.');
        }
    });
}

// Add Employee
if (addEmployeeBtn) {
    addEmployeeBtn.addEventListener('click', () => {
        if (addEmployeePopup) addEmployeePopup.style.display = 'flex';
    });
}

const addEmployeeForm = document.getElementById('add-employee-form');
if (addEmployeeForm) {
    addEmployeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('employee-name').value.trim(),
            email: document.getElementById('employee-email').value.trim(),
            role: document.getElementById('employee-role').value,
            hire_date: document.getElementById('employee-hire-date').value
        };

        if (!formData.name || !formData.email || !formData.role || !formData.hire_date) {
            alert('All fields are required');
            return;
        }
        if (!validateEmail(formData.email)) {
            alert('Invalid email format');
            return;
        }

        try {
            const response = await fetch('api/add-employee.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (addEmployeePopup) addEmployeePopup.style.display = 'none';
                addEmployeeForm.reset();
                loadEmployees();
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('Failed to add employee. Please try again.');
        }
    });
}

// Update Employee
const updateEmployeeForm = document.getElementById('update-employee-form');
if (updateEmployeeForm) {
    updateEmployeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            employee_id: document.getElementById('update-employee-id').value,
            name: document.getElementById('update-employee-name').value.trim(),
            email: document.getElementById('update-employee-email').value.trim(),
            role: document.getElementById('update-employee-role').value,
            hire_date: document.getElementById('update-employee-hire-date').value
        };

        if (!formData.employee_id || !formData.name || !formData.email || !formData.role || !formData.hire_date) {
            alert('All fields are required');
            return;
        }
        if (!validateEmail(formData.email)) {
            alert('Invalid email format');
            return;
        }

        try {
            const response = await fetch('api/update-employee.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (updateEmployeePopup) updateEmployeePopup.style.display = 'none';
                updateEmployeeForm.reset();
                loadEmployees();
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            alert('Failed to update employee. Please try again.');
        }
    });
}

// Add Admin
if (addAdminBtn) {
    addAdminBtn.addEventListener('click', () => {
        if (addAdminPopup) addAdminPopup.style.display = 'flex';
    });
}

const addAdminForm = document.getElementById('add-admin-form');
if (addAdminForm) {
    addAdminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            username: document.getElementById('admin-username').value.trim(),
            email: document.getElementById('admin-email').value.trim(),
            password: document.getElementById('admin-password').value
        };

        if (!formData.username || !formData.email || !formData.password) {
            alert('All fields are required');
            return;
        }
        if (!validateEmail(formData.email)) {
            alert('Invalid email format');
            return;
        }
        if (!validatePassword(formData.password)) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('api/add-admin.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (addAdminPopup) addAdminPopup.style.display = 'none';
                addAdminForm.reset();
                loadAdmins();
            }
        } catch (error) {
            console.error('Error adding admin:', error);
            alert('Failed to add admin. Please try again.');
        }
    });
}

// Update Admin
const updateAdminForm = document.getElementById('update-admin-form');
if (updateAdminForm) {
    updateAdminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            admin_id: document.getElementById('update-admin-id').value,
            username: document.getElementById('update-admin-username').value.trim(),
            email: document.getElementById('update-admin-email').value.trim(),
            password: document.getElementById('update-admin-password').value
        };

        if (!formData.admin_id || !formData.username || !formData.email) {
            alert('Username and email are required');
            return;
        }
        if (!validateEmail(formData.email)) {
            alert('Invalid email format');
            return;
        }
        if (formData.password && !validatePassword(formData.password)) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('api/update-admin.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (updateAdminPopup) updateAdminPopup.style.display = 'none';
                updateAdminForm.reset();
                loadAdmins();
            }
        } catch (error) {
            console.error('Error updating admin:', error);
            alert('Failed to update admin. Please try again.');
        }
    });
}

// Add User
if (addUserBtn) {
    addUserBtn.addEventListener('click', () => {
        if (addUserPopup) addUserPopup.style.display = 'flex';
    });
}

const addUserForm = document.getElementById('add-user-form');
if (addUserForm) {
    addUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            first_name: document.getElementById('first-name').value.trim(),
            last_name: document.getElementById('last-name').value.trim(),
            address: document.getElementById('address').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('user-email').value.trim(),
            password: document.getElementById('user-password').value,
            confirm_password: document.getElementById('confirm-password').value
        };

        if (!formData.first_name || !formData.last_name || !formData.address || !formData.phone || !formData.email || !formData.password) {
            alert('All fields are required');
            return;
        }
        if (!validateEmail(formData.email)) {
            alert('Invalid email format');
            return;
        }
        if (!validatePhone(formData.phone)) {
            alert('Invalid phone number');
            return;
        }
        if (!validatePassword(formData.password)) {
            alert('Password must be at least 6 characters');
            return;
        }
        if (formData.password !== formData.confirm_password) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('api/add-user.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (addUserPopup) addUserPopup.style.display = 'none';
                addUserForm.reset();
                loadUsers();
            }
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user. Please try again.');
        }
    });
}

// Update User
const updateUserForm = document.getElementById('update-user-form');
if (updateUserForm) {
    updateUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            user_id: document.getElementById('update-user-id').value,
            first_name: document.getElementById('update-first-name').value.trim(),
            last_name: document.getElementById('update-last-name').value.trim(),
            address: document.getElementById('update-address').value.trim(),
            phone: document.getElementById('update-phone').value.trim(),
            email: document.getElementById('update-user-email').value.trim(),
            password: document.getElementById('update-user-password').value
        };

        if (!formData.user_id || !formData.first_name || !formData.last_name || !formData.address || !formData.phone || !formData.email) {
            alert('All fields except password are required');
            return;
        }
        if (!validateEmail(formData.email)) {
            alert('Invalid email format');
            return;
        }
        if (!validatePhone(formData.phone)) {
            alert('Invalid phone number');
            return;
        }
        if (formData.password && !validatePassword(formData.password)) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('api/update-user.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (updateUserPopup) updateUserPopup.style.display = 'none';
                updateUserForm.reset();
                loadUsers();
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user. Please try again.');
        }
    });
}

// Update Order
const updateOrderForm = document.getElementById('update-order-form');
if (updateOrderForm) {
    updateOrderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            order_id: document.getElementById('update-order-id').value,
            status: document.getElementById('update-order-status').value
        };

        if (!formData.order_id || !formData.status) {
            alert('All fields are required');
            return;
        }

        try {
            const response = await fetch('api/update-order.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                if (updateOrderPopup) updateOrderPopup.style.display = 'none';
                updateOrderForm.reset();
                loadOrders();
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order. Please try again.');
        }
    });
}