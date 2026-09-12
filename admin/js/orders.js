const ordersContainer = document.getElementById("orders");


// ===============================
// LOAD ORDERS
// ===============================

async function loadOrders() {

    try {

        const token = localStorage.getItem("token");

const response = await fetch(
    "http://localhost:5000/api/admin/orders",
    {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
);
        const orders = await response.json();

        ordersContainer.innerHTML = "";

        if (orders.length === 0) {

            ordersContainer.innerHTML = `
                <div class="empty-orders">
                    <h3>No Orders Yet</h3>
                    <p>
                        Customer orders will appear here.
                    </p>
                </div>
            `;

            return;
        }


        orders.forEach((order) => {

            const orderCard =
                document.createElement("div");

            orderCard.className = "order-card";


            const statusClass =
                order.status.toLowerCase();


            orderCard.innerHTML = `

                <div class="order-header">

                    <div>

                        <h3>
                            Order #${order._id.slice(-6)}
                        </h3>

                        <p>
                            ${new Date(
                                order.createdAt
                            ).toLocaleString()}
                        </p>

                    </div>

                    <span class="
                        order-status
                        ${statusClass}
                    ">
                        ${order.status}
                    </span>

                </div>


                <div class="order-customer">

                    <div>

                        <strong>Customer</strong>

                        <p>
                            ${order.customerName}
                        </p>

                    </div>


                    <div>

                        <strong>Phone</strong>

                        <p>
                            ${order.phone}
                        </p>

                    </div>


                    <div>

                        <strong>Address</strong>

                        <p>
                            ${order.address}
                        </p>

                    </div>

                </div>


                <div class="order-items">

                    <h4>Order Items</h4>

                    ${order.items.map((item) => `

                        <div class="order-item">

                            <span>
                                ${item.name}
                            </span>

                            <span>
                                ${item.quantity} ×
                                Rs. ${item.price}
                            </span>

                        </div>

                    `).join("")}

                </div>


                <div class="order-footer">

                    <div>

                        <strong>
                            Total Amount
                        </strong>

                        <p class="order-total">
                            Rs. ${order.totalAmount}
                        </p>

                    </div>


                    <div class="status-control">

                        <select
                            id="status-${order._id}"
                        >

                            <option
                                value="Pending"
                                ${order.status === "Pending"
                                    ? "selected"
                                    : ""}
                            >
                                Pending
                            </option>

                            <option
                                value="Confirmed"
                                ${order.status === "Confirmed"
                                    ? "selected"
                                    : ""}
                            >
                                Confirmed
                            </option>

                            <option
                                value="Shipped"
                                ${order.status === "Shipped"
                                    ? "selected"
                                    : ""}
                            >
                                Shipped
                            </option>

                            <option
                                value="Delivered"
                                ${order.status === "Delivered"
                                    ? "selected"
                                    : ""}
                            >
                                Delivered
                            </option>

                        </select>


                        <button
                            onclick="
                                updateStatus('${order._id}')
                            "
                        >
                            Update Status
                        </button>

                    </div>

                </div>

            `;


            ordersContainer.appendChild(orderCard);

        });


    } catch (error) {

        console.error(
            "Failed to load orders:",
            error
        );

        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <h3>Failed to Load Orders</h3>
                <p>
                    Please check your backend server.
                </p>
            </div>
        `;

    }

}


// ===============================
// UPDATE STATUS
// ===============================

async function updateStatus(orderId) {

    const status =
        document.getElementById(
            `status-${orderId}`
        ).value;


    try {

        const token = localStorage.getItem("token");

const response = await fetch(
    `http://localhost:5000/api/admin/orders/${orderId}`,
    {
        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
            status: status
        })
    }
);


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to update status"
            );

            return;
        }


        alert(
            "Order status updated successfully!"
        );


        loadOrders();


    } catch (error) {

        console.error(
            "Failed to update status:",
            error
        );

        alert(
            "Failed to update order status."
        );

    }

}


// ===============================
// START
// ===============================

loadOrders();