const admin = localStorage.getItem("admin");


// ===============================
// PROTECT ADMIN PAGES
// ===============================

if (!admin) {

    window.location.href = "login.html";

}


// ===============================
// LOGOUT
// ===============================

function logout() {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}