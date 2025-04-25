// Obtener clientes del localStorage o iniciar vacío
function obtenerClientes() {
    return JSON.parse(localStorage.getItem('clientes')) || [];
}

function guardarClientes(clientes) {
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

function renderClientes() {
    const clientes = obtenerClientes();
    const tbody = document.querySelector("#tablaClientes tbody");
    tbody.innerHTML = "";

    clientes.forEach((cliente, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${cliente.cedula}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.direccion}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.correo}</td>
            <td>
                <button onclick="editarCliente(${index})">✏️</button>
                <button onclick="eliminarCliente(${index})">🗑️</button>
            </td>
        `;

        tbody.appendChild(fila);
    });
}

function editarCliente(index) {
    const clientes = obtenerClientes();
    const cliente = clientes[index];

    document.getElementById("cedulaCliente").value = cliente.cedula;
    document.getElementById("nombreCliente").value = cliente.nombre;
    document.getElementById("direccionCliente").value = cliente.direccion;
    document.getElementById("telefonoCliente").value = cliente.telefono;
    document.getElementById("correoCliente").value = cliente.correo;

    // Elimina para que luego al guardar se reemplace
    clientes.splice(index, 1);
    guardarClientes(clientes);
    renderClientes();
}

function eliminarCliente(index) {
    const clientes = obtenerClientes();
    clientes.splice(index, 1);
    guardarClientes(clientes);
    renderClientes();
}

// Manejo del formulario
document.getElementById("clienteForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const clientes = obtenerClientes(); // ✅ ahora está antes

    const nuevoCliente = {
        cedula: document.getElementById("cedulaCliente").value.trim(),
        nombre: document.getElementById("nombreCliente").value.trim(),
        direccion: document.getElementById("direccionCliente").value.trim(),
        telefono: document.getElementById("telefonoCliente").value.trim(),
        correo: document.getElementById("correoCliente").value.trim()
    };

    const existe = clientes.some(cliente => cliente.cedula === nuevoCliente.cedula);

    if (existe) {
        alert("Ya existe un cliente con esta cédula.");
    } else {
        clientes.push(nuevoCliente);
        guardarClientes(clientes);
        renderClientes();
        this.reset();
    }
});


// Render inicial
renderClientes();
