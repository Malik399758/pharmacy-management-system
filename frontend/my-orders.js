const ordersContainer =
    document.getElementById("orders-container");

const message =
    document.getElementById("message");


// ===============================
// CHECK CUSTOMER LOGIN
// ===============================

const token =
    localStorage.getItem("customerToken");


if (!token) {

    window.location.href =
        "login.html";

}


// ===============================
// GET STATUS STEP
// ===============================

function getStatusStep(status) {

    const statusSteps = [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered"
    ];

    const index =
        statusSteps.indexOf(status);

    return index === -1 ? 0 : index;

}


// ===============================
// CREATE ORDER TRACKER
// ===============================

function createOrderTracker(status) {

    const steps = [
        {
            name: "Order Placed",
            icon: "✓"
        },
        {
            name: "Confirmed",
            icon: "✓"
        },
        {
            name: "Processing",
            icon: "⚙"
        },
        {
            name: "Shipped",
            icon: "🚚"
        },
        {
            name: "Delivered",
            icon: "✓"
        }
    ];


    const currentStep =
        getStatusStep(status);


    let trackerHTML = `

        <div class="order-tracker">

            <div class="tracker-title">
                <h3>
                    Order Tracking
                </h3>

                <span>
                    ${status}
                </span>
            </div>

            <div class="tracker-steps">
    `;


    steps.forEach((step, index) => {

        const completed =
            index <= currentStep;

        const active =
            index === currentStep;


        trackerHTML += `

            <div class="
                tracker-step
                ${completed ? "completed" : ""}
                ${active ? "active" : ""}
            ">

                <div class="tracker-circle">
                    ${completed
                        ? step.icon
                        : index + 1}
                </div>

                <span>
                    ${step.name}
                </span>

            </div>
        `;


        if (index < steps.length - 1) {

            trackerHTML += `

                <div class="
                    tracker-line
                    ${index < currentStep
                        ? "completed"
                        : ""}
                ">
                </div>

            `;

        }

    });


    trackerHTML += `

            </div>

        </div>

    `;


    return trackerHTML;

}


// ===============================
// LOAD MY ORDERS
// ===============================

async function loadOrders() {

    ordersContainer.innerHTML = "";

    message.textContent =
        "Loading your orders...";


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


        // ===============================
        // INVALID / EXPIRED TOKEN
        // ===============================

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

            message.textContent = "";

            ordersContainer.innerHTML = `

                <div class="empty-orders">

                    <div class="empty-orders-icon">
                        📦
                    </div>

                    <h3>
                        No Orders Yet
                    </h3>

                    <p>
                        You haven't placed any orders yet.
                        Start shopping and your orders
                        will appear here.
                    </p>

                    <a
                        href="index.html#products-section"
                        class="shop-now-btn"
                    >
                        Start Shopping →
                    </a>

                </div>

            `;

            return;

        }


        // ===============================
        // ORDER COUNT
        // ===============================

        message.textContent =
            `${orders.length} order${orders.length > 1 ? "s" : ""} found`;


        // ===============================
        // DISPLAY ORDERS
        // ===============================

        orders.forEach((order) => {

            const orderCard =
                document.createElement("div");

            orderCard.className =
                "order-card";


            // ===============================
            // DATE
            // ===============================

            const orderDate =
                new Date(
                    order.createdAt
                );


            const formattedDate =
                orderDate.toLocaleDateString(
                    "en-US",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            const formattedTime =
                orderDate.toLocaleTimeString(
                    "en-US",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );


            // ===============================
            // STATUS
            // ===============================

            const status =
                order.status ||
                "Pending";


            const statusClass =
                status
                    .toLowerCase()
                    .replace(/\s+/g, "-");


            // ===============================
            // PRODUCTS
            // ===============================

            let itemsHTML = "";


            order.items.forEach((item) => {

                const quantity =
                    item.quantity || 1;


                const subtotal =
                    item.price *
                    quantity;


                itemsHTML += `

                    <div class="order-product">

                        <div class="order-product-icon">
                            💊
                        </div>


                        <div class="order-product-info">

                            <h4>
                                ${item.name}
                            </h4>

                            <p>
                                Rs. ${item.price}
                                × ${quantity}
                            </p>

                        </div>


                        <strong
                            class="order-product-price"
                        >
                            Rs. ${subtotal}
                        </strong>

                    </div>

                `;

            });


            // ===============================
            // ORDER CARD
            // ===============================

            orderCard.innerHTML = `

                <div class="order-card-header">

                    <div>

                        <span class="order-label">
                            ORDER ID
                        </span>

                        <h3>
                            #${order._id}
                        </h3>

                    </div>


                    <span
                        class="order-status ${statusClass}"
                    >
                        ${status}
                    </span>

                </div>


                <div class="order-meta">

                    <div>

                        <span>
                            📅 Date
                        </span>

                        <strong>
                            ${formattedDate}
                        </strong>

                    </div>


                    <div>

                        <span>
                            🕐 Time
                        </span>

                        <strong>
                            ${formattedTime}
                        </strong>

                    </div>


                    <div>

                        <span>
                            📦 Items
                        </span>

                        <strong>
                            ${order.items.length}
                        </strong>

                    </div>

                </div>


                <!-- ORDER TRACKER -->

                ${createOrderTracker(status)}


                <!-- ORDER PRODUCTS -->

                <div class="order-products">

                    <div class="order-products-title">

                        <h3>
                            Order Items
                        </h3>

                    </div>

                    ${itemsHTML}

                </div>


                <!-- ORDER FOOTER -->

                <div class="order-footer">

                    <div class="delivery-info">

                        <span>
                            📍 Delivery Address
                        </span>

                        <p>
                            ${order.address}
                        </p>

                    </div>


                    <div class="order-total">

                        <span>
                            Order Total
                        </span>

                        <strong>
                            Rs. ${order.totalAmount}
                        </strong>

                    </div>

                </div>

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
// CUSTOMER LOGOUT
// ===============================

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


// ===============================
// START
// ===============================

loadOrders();