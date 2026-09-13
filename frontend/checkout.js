// ===============================
// GET ELEMENTS
// ===============================

const checkoutForm =
    document.getElementById("checkout-form");

const message =
    document.getElementById("message");

const customerNameInput =
    document.getElementById("customerName");

const phoneInput =
    document.getElementById("phone");


// ===============================
// CHECK CUSTOMER LOGIN
// ===============================

const customerToken =
    localStorage.getItem("customerToken");

if (!customerToken) {

    window.location.href =
        "login.html";

}


// ===============================
// GET CUSTOMER INFORMATION
// ===============================

const customerData =
    JSON.parse(
        localStorage.getItem("customer")
    );


if (customerData) {

    customerNameInput.value =
        customerData.name || "";

    phoneInput.value =
        customerData.phone || "";

}


// ===============================
// GET CART
// ===============================

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


// ===============================
// PLACE ORDER
// ===============================

checkoutForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ===============================
        // CHECK CART
        // ===============================

        if (cart.length === 0) {

            message.textContent =
                "Your cart is empty.";

            return;

        }


        // ===============================
        // GET JWT TOKEN
        // ===============================

        const token =
            localStorage.getItem(
                "customerToken"
            );


        if (!token) {

            window.location.href =
                "login.html";

            return;

        }


        // ===============================
        // GET ADDRESS
        // ===============================

        const address =
            document
                .getElementById("address")
                .value
                .trim();


        if (!address) {

            message.textContent =
                "Please enter your delivery address.";

            return;

        }


        // ===============================
        // PREPARE ORDER ITEMS
        // ===============================

        const items =
            cart.map((product) => ({

                productId:
                    product._id,

                name:
                    product.name,

                price:
                    product.price,

                quantity:
                    product.quantity || 1

            }));


        // ===============================
        // CALCULATE TOTAL
        // ===============================

        const totalAmount =
            cart.reduce(
                (total, product) =>
                    total +
                    product.price *
                    (product.quantity || 1),
                0
            );

        // ===============================
        // GET PAYMENT METHOD
        // ===============================

        const paymentMethod =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            )?.value || "COD";

        // ===============================
        // ONLINE PAYMENT CHECK
        // ===============================

        if (paymentMethod === "ONLINE") {

            localStorage.setItem(
                "pendingOrder",
                JSON.stringify({
                    address,
                    items,
                    totalAmount,
                    paymentMethod
                })
            );

            window.location.href =
                "payment.html";

            return;
        }


        // ===============================
        // SEND ORDER TO BACKEND
        // ===============================

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/orders",
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            address,

                            items,

                            totalAmount,

                            paymentMethod

                        })

                    }
                );


            const data =
                await response.json();


            // ===============================
            // HANDLE ERROR
            // ===============================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to place order"
                );

            }


            // ===============================
            // SAVE ORDER INFORMATION
            // ===============================

            localStorage.setItem(
                "lastOrderId",
                data.order._id
            );


            localStorage.setItem(
                "lastOrderTotal",
                data.order.totalAmount
            );


            localStorage.setItem(
                "lastOrderStatus",
                data.order.status
            );


            // ===============================
            // CLEAR CART
            // ===============================

            localStorage.removeItem(
                "cart"
            );


            // ===============================
            // GO TO SUCCESS PAGE
            // ===============================

            window.location.href =
                "order-success.html";


        } catch (error) {

            console.error(
                "Order error:",
                error
            );


            // ===============================
            // TOKEN EXPIRED / INVALID
            // ===============================

            if (
                error.message
                    .toLowerCase()
                    .includes("not authorized")
            ) {

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


            message.textContent =
                error.message ||
                "Failed to place order.";

        }

    }
);


// ===============================
// CUSTOMER LOGOUT
// ===============================

const logoutBtn =
    document.getElementById(
        "logout-btn"
    );


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