document.addEventListener('DOMContentLoaded', function() {
    const orderTableBody = document.getElementById('orderTableBody');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    orders.forEach(order => {
        const row = document.createElement('tr');
        
        const orderDetails = order.items.map(item => 
            `${item.name} (${item.size}) - Quantity: ${item.quantity}`
        ).join('<br>');

        row.innerHTML = `
            <td>${order.orderNumber}</td>
            <td>${order.customerName}</td>
            <td>${orderDetails}</td>
            <td>₱${order.total.toFixed(2)}</td>
            <td>${order.date}</td>
        `;

        orderTableBody.appendChild(row);
    });
});