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
// GET ELEMENTS
// ===============================

const profileName =
    document.getElementById(
        "profile-name"
    );

const profileNameDetail =
    document.getElementById(
        "profile-name-detail"
    );

const profileEmail =
    document.getElementById(
        "profile-email"
    );

const profilePhone =
    document.getElementById(
        "profile-phone"
    );

const profileCreated =
    document.getElementById(
        "profile-created"
    );

const profileMessage =
    document.getElementById(
        "profile-message"
    );


    // ===============================
// UPDATE CUSTOMER PROFILE
// ===============================

const editProfileForm =
    document.getElementById(
        "edit-profile-form"
    );

const editProfileMessage =
    document.getElementById(
        "edit-profile-message"
    );

const saveProfileBtn =
    document.getElementById(
        "save-profile-btn"
    );


if (editProfileForm) {

    editProfileForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("edit-name")
                    .value
                    .trim();

            const phone =
                document
                    .getElementById("edit-phone")
                    .value
                    .trim();


            if (!name || !phone) {

                editProfileMessage.textContent =
                    "Name and phone are required.";

                return;

            }


            saveProfileBtn.disabled = true;

            saveProfileBtn.textContent =
                "Saving...";

            editProfileMessage.textContent =
                "";


            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/customers/profile",
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                name: name,
                                phone: phone
                            })
                        }
                    );


                const data =
                    await response.json();


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
                        data.message ||
                        "Failed to update profile"
                    );

                }


                // Update local customer data
                const customer =
                    data.customer;

                localStorage.setItem(
                    "customer",
                    JSON.stringify(customer)
                );


                // Update profile page
                profileName.textContent =
                    customer.name;

                profileNameDetail.textContent =
                    customer.name;

                profilePhone.textContent =
                    customer.phone;


                editProfileMessage.textContent =
                    "Profile updated successfully!";

                editProfileMessage.style.color =
                    "#16a34a";


            } catch (error) {

                console.error(
                    "Update profile error:",
                    error
                );

                editProfileMessage.textContent =
                    error.message ||
                    "Failed to update profile.";

                editProfileMessage.style.color =
                    "#dc2626";

            }


            saveProfileBtn.disabled = false;

            saveProfileBtn.textContent =
                "Save Changes";

        }
    );

}

// ===============================
// LOAD CUSTOMER PROFILE
// ===============================

async function loadProfile() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/customers/profile",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();


        // ===============================
        // INVALID TOKEN
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


        // ===============================
        // API ERROR
        // ===============================

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load profile"
            );

        }


        // ===============================
        // CUSTOMER DATA
        // ===============================

        const customer =
            data.customer;


        // ===============================
        // DISPLAY PROFILE
        // ===============================

        profileName.textContent =
            customer.name;

        profileNameDetail.textContent =
            customer.name;

        profileEmail.textContent =
            customer.email;

        profilePhone.textContent =
            customer.phone;


        // ===============================
        // FILL EDIT PROFILE FORM
        // ===============================

        document.getElementById(
            "edit-name"
        ).value =
            customer.name;

        document.getElementById(
            "edit-phone"
        ).value =
            customer.phone;

        document.getElementById(
            "edit-email"
        ).value =
            customer.email;


        // ===============================
        // ACCOUNT CREATED DATE
        // ===============================

        const createdDate =
            new Date(
                customer.createdAt
            );

        profileCreated.textContent =
            createdDate.toLocaleDateString(
                "en-US",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );


    } catch (error) {

        console.error(
            "Profile error:",
            error
        );

        profileMessage.textContent =
            error.message ||
            "Failed to load profile.";

    }

}

// ===============================
// LOGOUT
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


// ===============================
// START
// ===============================

loadProfile();