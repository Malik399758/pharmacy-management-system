const productsContainer = document.getElementById("products");
const searchInput =
    document.getElementById("product-search");

let cartCount = 0;
let currentProducts = [];

function updateCartCount() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const totalItems = cart.reduce(
        (total, item) =>
            total + (item.quantity || 1),
        0
    );

    document.getElementById("cart-count").textContent =
        totalItems;
}

searchInput.addEventListener("input", function () {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedCategory =
        categoryFilter.value;

    const filteredProducts =
        currentProducts.filter((product) => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText);

            const matchesCategory =
                selectedCategory === "" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

    displayProducts(filteredProducts);
});

const categoryFilter =
    document.getElementById("category-filter");

categoryFilter.addEventListener("change", function () {

    const selectedCategory =
        categoryFilter.value;

    const filteredProducts =
        currentProducts.filter((product) => {

            if (selectedCategory === "") {
                return true;
            }

            return product.category === selectedCategory;
        });

    displayProducts(filteredProducts);
});

function displayProducts(products) {

    productsContainer.innerHTML = "";

    products.forEach((product) => {

        const productCard =
            document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `
            <h3>${product.name}</h3>

            <p class="product-price">
                Rs. ${product.price}
            </p>

            <span class="category-badge">
    ${product.category}
</span>

            <p>
                ${product.description}
            </p>

            <p class="product-stock">
    ${product.stock > 0
        ? `In Stock: ${product.stock}`
        : "Out of Stock"}
</p>

            ${
                product.stock > 0
                    ? `
                        <button class="add-cart-btn"
                            onclick="addToCart('${product._id}')">
                            Add to Cart
                        </button>
                      `
                    : `
                        <button disabled>
                            Out of Stock
                        </button>
                      `
            }
        `;

        productsContainer.appendChild(productCard);
    });
}



async function loadProducts() {
    try {
        const response = await fetch("http://localhost:5000/api/products");

        const products = await response.json();
        currentProducts = products;
        const categoryFilter =
    document.getElementById("category-filter");

const categories = [
    ...new Set(
        products.map((product) => product.category)
    )
];

categories.forEach((category) => {

    const option =
        document.createElement("option");

    option.value = category;
    option.textContent = category;

    categoryFilter.appendChild(option);
});

        productsContainer.innerHTML = "";

      displayProducts(products);

    } catch (error) {

        console.error("Error:", error);

        productsContainer.innerHTML =
            "<p>Failed to load products.</p>";
    }
}


function addToCart(productId) {

    const product = currentProducts.find(
        (item) => item._id === productId
    );

    if (!product) {
        return;
    }

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
        (item) => item._id === productId
    );

    if (existingProduct) {

        if (existingProduct.quantity >= product.stock) {
            alert(
                `Sorry, available stock is only ${product.stock}`
            );
            return;
        }

        existingProduct.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    cartCount = cart.reduce(
        (total, item) =>
            total + (item.quantity || 1),
        0
    );

    document.getElementById("cart-count").textContent =
        cartCount;

    alert(`${product.name} added to cart!`);
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

            // Remove customer login data
            localStorage.removeItem(
                "customerToken"
            );

            localStorage.removeItem(
                "customer"
            );

            // Go to login page
            window.location.href =
                "login.html";

        }
    );

}

loadProducts();
updateCartCount();