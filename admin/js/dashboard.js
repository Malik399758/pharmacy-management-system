async function loadDashboard() {

    try {

        const token =
            localStorage.getItem("token");


        // ===============================
        // DASHBOARD STATISTICS
        // ===============================

        const response =
            await fetch(
                "http://localhost:5000/api/admin/dashboard",
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        // ===============================
        // EXISTING STATISTICS
        // ===============================

        document.getElementById(
            "total-products"
        ).textContent =
            data.totalProducts;


        document.getElementById(
            "total-orders"
        ).textContent =
            data.totalOrders;


        document.getElementById(
            "pending-orders"
        ).textContent =
            data.pendingOrders;


        document.getElementById(
            "total-sales"
        ).textContent =
            `${data.totalSales}`;


        // ===============================
        // PAYMENT STATISTICS
        // ===============================

        const onlinePaidElement =
            document.getElementById(
                "online-paid-orders"
            );

        const codElement =
            document.getElementById(
                "cod-orders"
            );

        const pendingPaymentElement =
            document.getElementById(
                "pending-payments"
            );


        if (onlinePaidElement) {

            onlinePaidElement.textContent =
                data.onlinePaidOrders;

        }


        if (codElement) {

            codElement.textContent =
                data.codOrders;

        }


        if (pendingPaymentElement) {

            pendingPaymentElement.textContent =
                data.pendingPayments;

        }


        // ===============================
        // RECENT ORDERS
        // ===============================

        const recentResponse =
            await fetch(
                "http://localhost:5000/api/admin/dashboard/recent-orders",
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const orders =
            await recentResponse.json();


        const ordersContainer =
            document.getElementById(
                "recent-orders-container"
            );


        ordersContainer.innerHTML = "";


        if (orders.length === 0) {

            ordersContainer.innerHTML =
                "<p>No orders found.</p>";

            return;

        }


        // ===============================
        // DISPLAY RECENT ORDERS
        // ===============================

        orders.forEach((order) => {

            const orderCard =
                document.createElement("div");


            orderCard.className =
                "recent-order-card";


            const orderDate =
                new Date(
                    order.createdAt
                ).toLocaleString();


            // Payment Method
            const paymentMethod =
                order.paymentMethod === "ONLINE"
                    ? "💳 Online Payment"
                    : "💵 Cash on Delivery";


            // Payment Status
            const paymentStatus =
                order.paymentStatus || "Pending";


            // Payment Status Class
            const paymentStatusClass =
                paymentStatus
                    .toLowerCase();


    orderCard.innerHTML = `

    <div class="recent-order-main">

        <div class="recent-order-id">
            <span>ORDER</span>
            <h3>#${order._id.slice(-6)}</h3>
        </div>

        <div class="recent-order-customer">
            <span>CUSTOMER</span>
            <p>${order.customerName}</p>
        </div>

        <div class="recent-order-payment">

            <span class="recent-order-label">
                PAYMENT
            </span>

            <span class="recent-payment-method">
                ${paymentMethod}
            </span>

            <span class="recent-payment-status ${paymentStatusClass}">
                ${paymentStatus}
            </span>

        </div>

        <div class="recent-order-total">
            <span>TOTAL</span>
            <strong>
                Rs. ${order.totalAmount}
            </strong>
        </div>

        <div class="recent-order-date">
            <span>DATE</span>
            <p>${orderDate}</p>
        </div>

    </div>

    <div class="recent-order-status">

        <span>STATUS</span>

        <strong class="order-status-${order.status.toLowerCase()}">
            ${order.status}
        </strong>

    </div>

`;


            ordersContainer.appendChild(
                orderCard
            );

        });


    } catch (error) {

        console.error(
            "Failed to load dashboard:",
            error
        );

    }

}


loadDashboard();