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
// CHANGE CUSTOMER PASSWORD
// ===============================

const changePasswordForm =
    document.getElementById(
        "change-password-form"
    );

const changePasswordMessage =
    document.getElementById(
        "change-password-message"
    );

const changePasswordBtn =
    document.getElementById(
        "change-password-btn"
    );


if (changePasswordForm) {

    changePasswordForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const currentPassword =
                document
                    .getElementById("current-password")
                    .value;

            const newPassword =
                document
                    .getElementById("new-password")
                    .value;

            const confirmPassword =
                document
                    .getElementById("confirm-password")
                    .value;


            // Check passwords
            if (
                newPassword !==
                confirmPassword
            ) {

                changePasswordMessage.textContent =
                    "New passwords do not match.";

                changePasswordMessage.style.color =
                    "#dc2626";

                return;

            }


            if (newPassword.length < 6) {

                changePasswordMessage.textContent =
                    "New password must be at least 6 characters.";

                changePasswordMessage.style.color =
                    "#dc2626";

                return;

            }


            changePasswordBtn.disabled =
                true;

            changePasswordBtn.textContent =
                "Changing...";

            changePasswordMessage.textContent =
                "";


            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/customers/change-password",
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({

                                currentPassword:
                                    currentPassword,

                                newPassword:
                                    newPassword

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
                        "Failed to change password"
                    );

                }


                changePasswordMessage.textContent =
                    "Password changed successfully!";

                changePasswordMessage.style.color =
                    "#16a34a";


                // Clear password fields
                document.getElementById(
                    "current-password"
                ).value = "";

                document.getElementById(
                    "new-password"
                ).value = "";

                document.getElementById(
                    "confirm-password"
                ).value = "";

                // Reset password strength
strengthBar.style.width = "0%";
strengthBar.style.background = "#e5e7eb";

strengthText.textContent =
    "Enter password";

strengthText.style.color =
    "#6b7280";

lengthCheck.textContent =
    "✓ At least 6 characters";

lengthCheck.style.color =
    "#6b7280";

matchCheck.textContent =
    "✓ Passwords must match";

matchCheck.style.color =
    "#6b7280";


            } catch (error) {

                console.error(
                    "Change password error:",
                    error
                );

                changePasswordMessage.textContent =
                    error.message ||
                    "Failed to change password.";

                changePasswordMessage.style.color =
                    "#dc2626";

            }


            changePasswordBtn.disabled =
                false;

            changePasswordBtn.textContent =
                "Change Password";

        }
    );

}

// ===============================
// PASSWORD SHOW / HIDE
// ===============================

const passwordToggles =
    document.querySelectorAll(
        ".password-toggle"
    );

passwordToggles.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    button.getAttribute(
                        "data-target"
                    );

                const input =
                    document.getElementById(
                        targetId
                    );

                if (input.type === "password") {

                    input.type = "text";

                    button.textContent = "🙈";

                } else {

                    input.type = "password";

                    button.textContent = "👁️";

                }

            }
        );

    }
);



// ===============================
// ===============================
// PROFESSIONAL PASSWORD STRENGTH
// ===============================

const newPasswordInput =
    document.getElementById("new-password");

const strengthBar =
    document.getElementById("password-strength-bar");

const strengthText =
    document.getElementById("password-strength-text");

const lengthCheck =
    document.getElementById("length-check");

if (newPasswordInput) {

    newPasswordInput.addEventListener(
        "input",
        function () {

            const password =
                newPasswordInput.value;

            let score = 0;

            // Empty
            if (!password) {

                strengthBar.style.width = "0%";
                strengthBar.style.background = "#e5e7eb";

                strengthText.textContent =
                    "Enter password";

                strengthText.style.color =
                    "#6b7280";

                lengthCheck.textContent =
                    "✓ At least 6 characters";

                lengthCheck.style.color =
                    "#6b7280";

                return;
            }

            // Requirements
            const hasLength =
                password.length >= 6;

            const hasUppercase =
                /[A-Z]/.test(password);

            const hasNumber =
                /[0-9]/.test(password);

            const hasSpecial =
                /[^A-Za-z0-9]/.test(password);

            // Score
            if (hasLength) score++;
            if (hasUppercase) score++;
            if (hasNumber) score++;
            if (hasSpecial) score++;

            // Length check
            if (hasLength) {

                lengthCheck.textContent =
                    "✓ At least 6 characters";

                lengthCheck.style.color =
                    "#16a34a";

            } else {

                lengthCheck.textContent =
                    "✗ At least 6 characters";

                lengthCheck.style.color =
                    "#dc2626";
            }

            // Strength
            if (score === 1) {

                strengthBar.style.width = "25%";
                strengthBar.style.background = "#dc2626";

                strengthText.textContent =
                    "Weak";

                strengthText.style.color =
                    "#dc2626";

            }

            else if (score === 2) {

                strengthBar.style.width = "50%";
                strengthBar.style.background = "#f59e0b";

                strengthText.textContent =
                    "Fair";

                strengthText.style.color =
                    "#f59e0b";

            }

            else if (score === 3) {

                strengthBar.style.width = "75%";
                strengthBar.style.background = "#2563eb";

                strengthText.textContent =
                    "Good";

                strengthText.style.color =
                    "#2563eb";

            }

            else if (score === 4) {

                strengthBar.style.width = "100%";
                strengthBar.style.background = "#16a34a";

                strengthText.textContent =
                    "Strong";

                strengthText.style.color =
                    "#16a34a";
            }

        }
    );

}

// ===============================
// CONFIRM PASSWORD CHECK
// ===============================

const confirmPasswordInput =
    document.getElementById(
        "confirm-password"
    );

const matchCheck =
    document.getElementById(
        "match-check"
    );

function checkPasswordMatch() {

    if (
        !confirmPasswordInput ||
        !newPasswordInput ||
        !matchCheck
    ) {
        return;
    }

    const newPassword =
        newPasswordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;

    if (!confirmPassword) {

        matchCheck.textContent =
            "✓ Passwords must match";

        matchCheck.style.color =
            "#6b7280";

        return;
    }

    if (
        newPassword ===
        confirmPassword
    ) {

        matchCheck.textContent =
            "✓ Passwords match";

        matchCheck.style.color =
            "#16a34a";

    } else {

        matchCheck.textContent =
            "✗ Passwords do not match";

        matchCheck.style.color =
            "#dc2626";
    }

}

if (newPasswordInput) {

    newPasswordInput.addEventListener(
        "input",
        checkPasswordMatch
    );

}

if (confirmPasswordInput) {

    confirmPasswordInput.addEventListener(
        "input",
        checkPasswordMatch
    );

}
// ===============================
// START
// ===============================


loadProfile();