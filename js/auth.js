document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorText = document.getElementById('loginError');

    // Credenciales básicas (puedes extender esto con localStorage o archivos JSON)
    const validUsers = [
        { user: "admin", pass: "1234" },
        { user: "peluquero1", pass: "abcd" },
        { user: "peluquero2", pass: "abcd" }
    ];

    const found = validUsers.find(u => u.user === username && u.pass === password);

    if (found) {
        localStorage.setItem("userLoggedIn", username);
        window.location.href = "dashboard.html"; // Redirigir al menú principal
    } else {
        errorText.textContent = "Usuario o contraseña incorrectos.";
    }
});
