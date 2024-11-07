let menu = document.querySelector('#menu-btn');

let navbar = document.querySelector('.navbar');



menu.onclick = () => {

    menu.classList.toggle('fa-times');

    navbar.classList.toggle('active');

};



window.onscroll = () => {

    menu.classList.remove('fa-times');

    navbar.classList.remove('active');

};



document.querySelectorAll('.image-slider img').forEach(images => {

    images.onclick = () => {

        var src = images.getAttribute('src');

        document.querySelector('.main-home-image').src = src;

    };

});



var swiper = new Swiper(".review-slider", {

    spaceBetween: 20,

    pagination: {

        el: ".swiper-pagination",

        clickable: true,

    },

    loop: true,

    grabCursor: true,

    autoplay: {

        delay: 7500,

        disableOnInteraction: false,

    },

    breakpoints: {

        0: {

            slidesPerView: 1

        },

        768: {

            slidesPerView: 2

        }

    },

});

//cart

let cart = [];
let orderCounter = 1000; // Starting order number
let cartCount = 0;

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
});

document.querySelector('.btn:last-child').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('checkoutBtn').addEventListener('click', initiateCheckout);
document.getElementById('closeConfirmation').addEventListener('click', closeConfirmation);

function addToCart(event) {
    event.preventDefault();
    const box = event.target.closest('.box');
    const name = box.querySelector('h3').textContent;
    const selectedSizeElement = box.querySelector('input[name="size"]:checked');
    
    if (!selectedSizeElement) {
        alert("Please select an Item or size.");
        return;
    }

    const selectedSize = selectedSizeElement.value;
    const price = parseFloat(selectedSizeElement.getAttribute("data-price"));

    // Check if item with same name and size already exists in the cart
    const existingItem = cart.find(item => item.name === name && item.size === selectedSize);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, size: selectedSize, price, quantity: 1 });
    }
    
    updateCart();
    alert(`Added to cart: ${selectedSize} at ₱${price}.00`);
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    const cartCountPopupElement = document.getElementById('cart-count-popup');
    
    cartCountElement.textContent = cartCount;
    cartCountPopupElement.textContent = cartCount;
    
    cartCountElement.style.display = cartCount > 0 ? 'block' : 'none';
    
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} (${item.size}) - ₱${item.price.toFixed()}
            <div class="quantity-controls">
                <button onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) {
        removeFromCart(index);
    } else {
        updateCart();
    }
}

function removeFromCart(index) {
    const item = cart[index];
    if (confirm(`Do you want to remove "${item.name} (${item.size})" from your cart?\n\nClick OK for YES or Cancel for NO.`)) {
        cart.splice(index, 1);
        updateCart();
        alert(`"${item.name} (${item.size})" has been removed from your cart.`);
    }
}

function openCart() {
    document.getElementById('cartPopup').style.display = 'block';
}

function closeCart() {
    document.getElementById('cartPopup').style.display = 'none';
    document.getElementById('customerInfo').style.display = 'none';
}

function initiateCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return;
    }
    document.getElementById('customerInfo').style.display = 'block';
    document.getElementById('checkoutBtn').onclick = processCheckout;
}

function processCheckout() {
    const customerName = document.getElementById('customerName').value.trim();
    if (!customerName) {
        alert('Please enter your name before checking out.');
        return;
    }

    orderCounter++;
    const orderNumber = `HM${orderCounter}`; // HM for Hungry Mama
    const orderDate = new Date().toLocaleString();

    const order = {
        orderNumber: orderNumber,
        customerName: customerName,
        items: cart.map(item => ({
            name: item.name,
            size: item.size,
            price: item.price,
            quantity: item.quantity
        })),
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        date: orderDate
    };

    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    document.getElementById('confirmationName').textContent = customerName;
    document.getElementById('orderNumber').textContent = orderNumber;

    document.getElementById('cartPopup').style.display = 'none';
    document.getElementById('orderConfirmation').style.display = 'block';

    cart = [];
    updateCart();
}
function closeConfirmation() {
    document.getElementById('orderConfirmation').style.display = 'none';
    document.getElementById('customerName').value = '';
}

// Login 
document.addEventListener('DOMContentLoaded', function() {
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLoginPopup = document.getElementById('admin-login-popup');
    const closeAdminLogin = document.getElementById('close-admin-login');
    const adminLoginForm = document.getElementById('admin-login-form');

    adminLoginBtn.addEventListener('click', function() {
        adminLoginPopup.style.display = 'block';
    });

    closeAdminLogin.addEventListener('click', function() {
        adminLoginPopup.style.display = 'none';
    });

    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        // This is a simple check. In a real application, you'd validate against a server.
        if (username === 'admin' && password === '12345') {
            sessionStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'admin.html';
        } else {
            alert('Invalid admin credentials. Please try again.');
        }
    });

    // Close the popup if clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === adminLoginPopup) {
            adminLoginPopup.style.display = 'none';
        }
    });
});