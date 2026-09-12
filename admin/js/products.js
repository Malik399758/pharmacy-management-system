const productsContainer = document.getElementById("products");
const productForm = document.getElementById("product-form");
const editFormContainer = document.getElementById("edit-form-container");


// ===============================
// LOAD PRODUCTS
// ===============================

async function loadProducts() {

    try {

        const token = localStorage.getItem("token");

const response = await fetch(
    "http://localhost:5000/api/admin/products",
    {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
);
        const products = await response.json();

        productsContainer.innerHTML = "";

        products.forEach((product) => {

            const productCard = document.createElement("div");

            productCard.className = "product-card";

            productCard.innerHTML = `
    <h2>${product.name}</h2>

    <p>
        <strong>Price:</strong>
        Rs. ${product.price}
    </p>

    <p>
        <strong>Category:</strong>
        ${product.category}
    </p>

    <p>
        <strong>Description:</strong>
        ${product.description}
    </p>

    <p>
        <strong>Stock:</strong>
        ${product.stock}
    </p>

    <button onclick="editProduct('${product._id}')">
        Edit Product
    </button>

    <button onclick="deleteProduct('${product._id}')">
        Delete Product
    </button>
`;
            productsContainer.appendChild(productCard);
        });

    } catch (error) {

        console.error("Error:", error);

        productsContainer.innerHTML =
            "<p>Failed to load products.</p>";
    }
}


// ===============================
// ADD PRODUCT
// ===============================

productForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value;

    const price =
        document.getElementById("price").value;

    const category =
        document.getElementById("category").value;

    const description =
        document.getElementById("description").value;

    const stock =
        document.getElementById("stock").value;


    try {

        const token = localStorage.getItem("token");

const response = await fetch(
    "http://localhost:5000/api/admin/products",
    {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
            name,
            price,
            category,
            description,
            stock
        })
    }
);


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to add product"
            );

            return;
        }


        alert("Product added successfully!");


        productForm.reset();


        loadProducts();

    } catch (error) {

        console.error("Error:", error);

        alert("Failed to add product.");
    }

});


// ===============================
// EDIT PRODUCT
// ===============================

async function editProduct(productId) {

    try {

        const token = localStorage.getItem("token");

const response = await fetch(
    `http://localhost:5000/api/admin/products/${productId}`,
    {
        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
            name,
            price,
            category,
            description,
            stock
        })
    }
);

        const products = await response.json();


        const product = products.find(
            (item) => item._id === productId
        );


        if (!product) {

            alert("Product not found.");

            return;
        }


        editFormContainer.innerHTML = `

            <section class="admin-section">

                <h2>Edit Product</h2>

                <form id="edit-product-form">

                    <div class="form-group">

                        <label>
                            Product Name
                        </label>

                        <input
                            type="text"
                            id="edit-name"
                            value="${product.name}"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Price
                        </label>

                        <input
                            type="number"
                            id="edit-price"
                            value="${product.price}"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Category
                        </label>

                        <input
                            type="text"
                            id="edit-category"
                            value="${product.category}"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Stock
                        </label>

                        <input
                            type="number"
                            id="edit-stock"
                            value="${product.stock}"
                            required
                        >

                    </div>


                    <div class="form-group full-width">

                        <label>
                            Description
                        </label>

                        <textarea
                            id="edit-description"
                            required
                        >${product.description}</textarea>

                    </div>


                    <div class="full-width">

                        <button
                            type="submit"
                            class="add-product-btn"
                        >
                            Update Product
                        </button>

                    </div>

                </form>

            </section>
        `;


        document
            .getElementById("edit-product-form")
            .addEventListener(
                "submit",
                function (event) {

                    updateProduct(
                        event,
                        productId
                    );

                }
            );


        editFormContainer.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error("Error:", error);

        alert("Failed to load product.");
    }
}


// ===============================
// UPDATE PRODUCT
// ===============================

async function updateProduct(event, productId) {

    event.preventDefault();


    const name =
        document.getElementById("edit-name").value;

    const price =
        document.getElementById("edit-price").value;

    const category =
        document.getElementById("edit-category").value;

    const description =
        document.getElementById("edit-description").value;

    const stock =
        document.getElementById("edit-stock").value;


    try {

        const response = await fetch(
            `http://localhost:5000/api/admin/products/${productId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    price: Number(price),
                    category: category,
                    description: description,
                    stock: Number(stock)
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to update product"
            );

            return;
        }


        alert("Product updated successfully!");


        editFormContainer.innerHTML = "";


        loadProducts();

    } catch (error) {

        console.error("Error:", error);

        alert("Failed to update product.");
    }
}

async function deleteProduct(productId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const token = localStorage.getItem("token");

const response = await fetch(
    `http://localhost:5000/api/admin/products/${productId}`,
    {
        method: "DELETE",

        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
);

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to delete product");
            return;
        }

        alert("Product deleted successfully!");

        loadProducts();

    } catch (error) {

        console.error("Error:", error);

        alert("Failed to delete product.");
    }
}

// ===============================
// START
// ===============================

loadProducts();