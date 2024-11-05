let cart = [];
let orderCounter = 1000; // Starting order number

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
    cart.splice(index, 1);
    updateCart();
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

