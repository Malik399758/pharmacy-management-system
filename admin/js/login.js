const loginForm = document.getElementById("login-form");

const loginMessage =
    document.getElementById("login-message");


loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;


        try {

            const response = await fetch(
                "http://localhost:5000/api/admin/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                loginMessage.textContent =
                    data.message ||
                    "Login failed.";

                return;
            }


            // Save admin information

            localStorage.setItem(
                "admin",
                JSON.stringify(data.admin)
            );

            localStorage.setItem(
    "token",
    data.token
);


            loginMessage.textContent =
                "Login successful!";


            // Go to dashboard

            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 500);


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            loginMessage.textContent =
                "Unable to connect to server.";

        }

    }
);