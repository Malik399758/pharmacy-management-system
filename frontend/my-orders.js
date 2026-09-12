const ordersContainer =
    document.getElementById("orders-container");

const message =
    document.getElementById("message");


// ===============================
// CHECK CUSTOMER LOGIN
// ===============================

const token =
    localStorage.getItem("customerToken");


// If not logged in → login page

if (!token) {

    window.location.href =
        "login.html";

}


// ===============================
// LOAD MY ORDERS
// ===============================

async function loadOrders() {

    ordersContainer.innerHTML = "";

    message.textContent =
        "Loading orders...";


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/orders/my-orders",
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const orders =
            await response.json();


        // Token invalid/expired

        if (response.status === 401) {

            localStorage.removeItem(
                "customerToken"
            );

            localStorage.removeItem(
                "customer"
            );

            window.location.href =
                "login.html";

            return;

        }


        if (!response.ok) {

            throw new Error(
                orders.message ||
                "Failed to fetch orders"
            );

        }


        // ===============================
        // NO ORDERS
        // ===============================

        if (orders.length === 0) {

            message.textContent =
                "No orders found.";

            return;

        }


        message.textContent =
            `${orders.length} order(s) found.`;


        // ===============================
        // DISPLAY ORDERS
        // ===============================

        orders.forEach((order) => {

            const orderCard =
                document.createElement("div");


            orderCard.className =
                "product-card";


            const orderDate =
                new Date(
                    order.createdAt
                ).toLocaleString();


            let itemsHTML = "";


            order.items.forEach((item) => {

                itemsHTML += `
                    <p>
                        ${item.name}
                        × ${item.quantity}
                        — Rs.
                        ${
                            item.price *
                            item.quantity
                        }
                    </p>
                `;

            });


            orderCard.innerHTML = `

                <h3>
                    Order #${order._id}
                </h3>

                <p>
                    <strong>Status:</strong>
                    ${order.status}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${orderDate}
                </p>

                <h4>
                    Products
                </h4>

                ${itemsHTML}

                <h3>
                    Total: Rs.
                    ${order.totalAmount}
                </h3>

                <p>
                    <strong>
                        Delivery Address:
                    </strong>

                    ${order.address}
                </p>

            `;


            ordersContainer.appendChild(
                orderCard
            );

        });


    } catch (error) {

        console.error(
            "Failed to load orders:",
            error
        );


        message.textContent =
            error.message ||
            "Failed to load orders.";

    }

}


// ===============================
// START
// ===============================

loadOrders();