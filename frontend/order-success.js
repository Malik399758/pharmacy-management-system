const orderId = localStorage.getItem("lastOrderId");
const orderTotal = localStorage.getItem("lastOrderTotal");
const orderStatus = localStorage.getItem("lastOrderStatus");

document.getElementById("order-id").textContent =
    `Order ID: ${orderId || "N/A"}`;

document.getElementById("order-total").textContent =
    `Total: Rs. ${orderTotal || 0}`;

document.getElementById("order-status").textContent =
    `Status: ${orderStatus || "Pending"}`;