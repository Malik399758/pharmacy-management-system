const checkoutForm =
    document.getElementById("checkout-form");

const message =
    document.getElementById("message");


let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

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
// PLACE ORDER
// ===============================

checkoutForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (cart.length === 0) {

            message.textContent =
                "Your cart is empty.";

            return;

        }


        // Get JWT token

        const token =
            localStorage.getItem("customerToken");


        if (!token) {

            message.textContent =
                "Please login before placing an order.";

            return;

        }


        const address =
            document
                .getElementById("address")
                .value;


        const items =
            cart.map((product) => ({

                productId: product._id,

                name: product.name,

                price: product.price,

                quantity:
                    product.quantity || 1

            }));


        const totalAmount =
            cart.reduce(
                (total, product) =>
                    total +
                    product.price *
                    (product.quantity || 1),
                0
            );


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

                            totalAmount

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to place order"
                );

            }


            // Save order information

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


            // Clear cart

            localStorage.removeItem("cart");


            // Clear form

            checkoutForm.reset();


            // Go to success page

            window.location.href =
                "order-success.html";


        } catch (error) {

            console.error(
                "Order error:",
                error
            );


            message.textContent =
                error.message ||
                "Failed to place order.";

        }

    }
);