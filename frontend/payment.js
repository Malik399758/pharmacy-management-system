// ===============================
// GET PENDING ORDER
// ===============================

const pendingOrder =
    JSON.parse(
        localStorage.getItem("pendingOrder")
    );


// ===============================
// CHECK PENDING ORDER
// ===============================

if (!pendingOrder) {

    window.location.href =
        "checkout.html";

}


// ===============================
// GET ELEMENTS
// ===============================

const paymentTotal =
    document.getElementById(
        "payment-total"
    );

const paymentForm =
    document.getElementById(
        "payment-form"
    );

const paymentMessage =
    document.getElementById(
        "payment-message"
    );


// ===============================
// SHOW ORDER TOTAL
// ===============================

if (pendingOrder) {

    paymentTotal.textContent =
        `Rs. ${pendingOrder.totalAmount}`;

}


// ===============================
// TEST PAYMENT
// ===============================

if (paymentForm) {

    paymentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ===============================
            // GET CUSTOMER TOKEN
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
            // GET CARD DETAILS
            // ===============================

            const cardNumber =
                document
                    .getElementById("card-number")
                    .value
                    .replace(/\s/g, "");

            const expiry =
                document
                    .getElementById("expiry")
                    .value
                    .trim();

            const cvv =
                document
                    .getElementById("cvv")
                    .value
                    .trim();


            // ===============================
            // TEST CARD VALIDATION
            // ===============================

            if (
                cardNumber !==
                "4242424242424242"
            ) {

                paymentMessage.textContent =
                    "Use the test card: 4242 4242 4242 4242";

                paymentMessage.style.color =
                    "#dc2626";

                return;

            }


            if (
                !/^\d{2}\/\d{2}$/.test(
                    expiry
                )
            ) {

                paymentMessage.textContent =
                    "Enter expiry as MM/YY.";

                paymentMessage.style.color =
                    "#dc2626";

                return;

            }


            if (
                !/^\d{3}$/.test(
                    cvv
                )
            ) {

                paymentMessage.textContent =
                    "Enter a 3-digit CVV.";

                paymentMessage.style.color =
                    "#dc2626";

                return;

            }


            // ===============================
            // SHOW PROCESSING
            // ===============================

            paymentMessage.textContent =
                "Processing payment...";

            paymentMessage.style.color =
                "#2563eb";


            try {

                // ===============================
                // SEND PAID ORDER TO BACKEND
                // ===============================

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

                                address:
                                    pendingOrder.address,

                                items:
                                    pendingOrder.items,

                                totalAmount:
                                    pendingOrder.totalAmount,

                                paymentMethod:
                                    "ONLINE",

                                paymentStatus:
                                    "Paid"

                            })

                        }
                    );


                const data =
                    await response.json();


                // ===============================
                // HANDLE BACKEND ERROR
                // ===============================

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to place order"
                    );

                }


                // ===============================
                // PAYMENT SUCCESS
                // ===============================

                paymentMessage.textContent =
                    "Payment successful!";

                paymentMessage.style.color =
                    "#16a34a";


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
                // CLEAR PENDING ORDER
                // ===============================

                localStorage.removeItem(
                    "pendingOrder"
                );


                // ===============================
                // GO TO SUCCESS PAGE
                // ===============================

                setTimeout(
                    function () {

                        window.location.href =
                            "order-success.html";

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Payment error:",
                    error
                );


                // ===============================
                // TOKEN ERROR
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


                // ===============================
                // SHOW ERROR
                // ===============================

                paymentMessage.textContent =
                    error.message ||
                    "Payment failed.";

                paymentMessage.style.color =
                    "#dc2626";

            }

        }
    );

}
