const orderId =
    localStorage.getItem("lastOrderId");

const orderTotal =
    localStorage.getItem("lastOrderTotal");

const orderStatus =
    localStorage.getItem("lastOrderStatus");


// ==========================================
// CHECK CUSTOMER LOGIN
// ==========================================

const customerToken =
    localStorage.getItem("customerToken");

if (!customerToken) {

    window.location.href =
        "login.html";

}


// ==========================================
// CHECK ORDER DATA
// ==========================================

if (!orderId) {

    window.location.href =
        "index.html";

}


// ==========================================
// DISPLAY ORDER INFORMATION
// ==========================================

document.getElementById(
    "order-id"
).textContent =
    orderId || "N/A";


document.getElementById(
    "order-total"
).textContent =
    `Rs. ${orderTotal || 0}`;


document.getElementById(
    "order-status"
).textContent =
    orderStatus || "Pending";


// ==========================================
// STATUS CLASS
// ==========================================

const statusElement =
    document.getElementById("order-status");

if (statusElement) {

    statusElement.classList.add(
        (orderStatus || "Pending")
            .toLowerCase()
            .replace(/\s+/g, "-")
    );

}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById("logout-btn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "customerToken"
            );

            localStorage.removeItem(
                "customer"
            );

            window.location.href =
                "login.html";

        }
    );

}