const cartItemsContainer =
    document.getElementById("cart-items");

const cartTotal =
    document.getElementById("cart-total");

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// ==========================================
// DISPLAY CART
// ==========================================

function displayCart() {

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <div class="empty-cart">

                <div style="font-size: 45px;">
                    🛒
                </div>

                <h3>Your cart is empty</h3>

                <p>
                    Add some healthcare products
                    to your cart to continue.
                </p>

            </div>
        `;

        cartTotal.textContent =
            "Total: Rs. 0";

        return;
    }


    let total = 0;


    cart.forEach((product, index) => {

        const quantity =
            product.quantity || 1;

        const subtotal =
            product.price * quantity;


        const item =
            document.createElement("div");

        item.className =
            "cart-item";


        item.innerHTML = `

            <div class="cart-item-info">

                <div class="cart-product-icon">
                    💊
                </div>

                <div class="cart-product-details">

                    <h3>
                        ${product.name}
                    </h3>

                    <span class="category-badge">
                        ${product.category}
                    </span>

                    <p>
                        Price: Rs. ${product.price}
                    </p>

                    <p class="cart-stock">
                        ✓ In Stock
                    </p>

                </div>

            </div>


            <div class="cart-quantity">

                <span class="quantity-label">
                    Quantity
                </span>

                <div class="quantity-controls">

                    <button
                        onclick="decreaseQuantity(${index})"
                        class="quantity-btn"
                    >
                        −
                    </button>

                    <span class="quantity-number">
                        ${quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${index})"
                        class="quantity-btn"
                    >
                        +
                    </button>

                </div>

            </div>


            <div class="cart-subtotal">

                <span>
                    Subtotal
                </span>

                <strong>
                    Rs. ${subtotal}
                </strong>

            </div>


            <button
                onclick="removeFromCart(${index})"
                class="remove-cart-btn"
            >
                🗑 Remove
            </button>

        `;


        cartItemsContainer.appendChild(item);


        total += subtotal;

    });


    cartTotal.textContent =
        `Total: Rs. ${total}`;

}



// ==========================================
// INCREASE QUANTITY
// ==========================================

function increaseQuantity(index) {

    if (!cart[index].quantity) {
        cart[index].quantity = 1;
    }


    if (
        cart[index].quantity >=
        cart[index].stock
    ) {

        alert(
            "Sorry, available stock is only " +
            cart[index].stock
        );

        return;
    }


    cart[index].quantity++;

    saveCart();

}



// ==========================================
// DECREASE QUANTITY
// ==========================================

function decreaseQuantity(index) {

    if (!cart[index].quantity) {
        cart[index].quantity = 1;
    }


    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    }


    saveCart();

}



// ==========================================
// REMOVE PRODUCT
// ==========================================

function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

}



// ==========================================
// SAVE CART
// ==========================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();

}



// ==========================================
// START
// ==========================================

displayCart();
// ==========================================
// CHECKOUT LOGIN PROTECTION
// ==========================================

const checkoutBtn =
    document.getElementById("checkout-btn");

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        function () {

            const customerToken =
                localStorage.getItem("customerToken");

            if (!customerToken) {

                alert(
                    "Please login before proceeding to checkout."
                );

                window.location.href =
                    "login.html";

                return;
            }

            window.location.href =
                "checkout.html";

        }
    );

}

// ==========================================
// CUSTOMER LOGOUT
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