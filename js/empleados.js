// Obtener empleados del localStorage o iniciar vacío
function obtenerEmpleados() {
    return JSON.parse(localStorage.getItem('empleados')) || [];
}

function guardarEmpleados(empleados) {
    localStorage.setItem('empleados', JSON.stringify(empleados));
}

function renderEmpleados() {
    const empleados = obtenerEmpleados();
    const tbody = document.querySelector("#tablaEmpleados tbody");
    tbody.innerHTML = "";

    empleados.forEach((emp, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${emp.cedula}</td>
            <td>${emp.nombre}</td>
            <td>${emp.direccion}</td>
            <td>${emp.telefono}</td>
            <td>${emp.correo}</td>
            <td>${emp.comision}%</td>
            <td>
                <button onclick="editarEmpleado(${index})">✏️</button>
                <button onclick="eliminarEmpleado(${index})">🗑️</button>
            </td>
        `;

        tbody.appendChild(fila);
    });
}

function editarEmpleado(index) {
    const empleados = obtenerEmpleados();
    const emp = empleados[index];

    document.getElementById("cedula").value = emp.cedula;
    document.getElementById("nombre").value = emp.nombre;
    document.getElementById("direccion").value = emp.direccion;
    document.getElementById("telefono").value = emp.telefono;
    document.getElementById("correo").value = emp.correo;
    document.getElementById("comision").value = emp.comision;

    // Elimina y deja listo para actualizar
    empleados.splice(index, 1);
    guardarEmpleados(empleados);
    renderEmpleados();
}

function eliminarEmpleado(index) {
    const empleados = obtenerEmpleados();
    empleados.splice(index, 1);
    guardarEmpleados(empleados);
    renderEmpleados();
}

// Manejo del formulario
document.getElementById("empleadoForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const cedula = document.getElementById("cedula").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const comision = parseFloat(document.getElementById("comision").value.trim());

    const empleados = obtenerEmpleados();

    // 🔍 Validar si ya existe una cédula igual
    const existe = empleados.some(emp => emp.cedula === cedula);
    if (existe) {
        alert("Ya existe un empleado con esa cédula.");
        return;
    }

    const nuevoEmpleado = {
        cedula,
        nombre,
        direccion,
        telefono,
        correo,
        comision
    };

    empleados.push(nuevoEmpleado);
    guardarEmpleados(empleados);
    renderEmpleados();
    this.reset();
});


// Render inicial
renderEmpleados();
