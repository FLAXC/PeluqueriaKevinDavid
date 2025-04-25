// Datos de ejemplo de empleados y horarios disponibles
const empleados = [
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "Ana Gómez" },
    { id: 3, nombre: "Luis Martínez" }
];

const horariosDisponibles = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

// Obtener reservas del localStorage
function obtenerReservas() {
    return JSON.parse(localStorage.getItem('reservas')) || [];
}

// Guardar reservas en el localStorage
function guardarReservas(reservas) {
    localStorage.setItem('reservas', JSON.stringify(reservas));
}

// Crear opciones de condiciones (niños, adultos, adultos mayores)
function generarCondiciones() {
    const condicionesContainer = document.getElementById('condicionesContainer');
    // Obtener el valor del input de cantidad de personas
    const cantidadPersonas = document.getElementById('cantidadPersonas').value;

    // Limpiar el contenedor antes de agregar nuevas opciones
    condicionesContainer.innerHTML = '';

    for (let i = 0; i < cantidadPersonas; i++) {
        const div = document.createElement('div');
        div.innerHTML = `
            <label for="condicion${i}">Persona ${i + 1}:</label>
            <select id="condicion${i}" required>
                <option value="adulto">Adulto</option>
                <option value="niño">Niño</option>
                <option value="adultoMayor">Adulto Mayor</option>
            </select>
        `;
        condicionesContainer.appendChild(div);
    }
}

// Llenar los horarios disponibles y deshabilitar los ocupados
function llenarHorarios() {
    const selectHorario = document.getElementById('horario');
    const reservas = obtenerReservas();  // Obtener todas las reservas

    // Limpiar opciones previas
    selectHorario.innerHTML = '';

    horariosDisponibles.forEach(horario => {
        // Contar las reservas para ese horario
        const reservasEnHorario = reservas.filter(reserva => reserva.horario === horario);

        const option = document.createElement('option');
        option.value = horario;
        option.textContent = horario;

        // Si ya hay 3 o más reservas en ese horario, deshabilitar la opción
        if (reservasEnHorario.length >= 3) {
            option.disabled = true; // Deshabilitar
            option.textContent += ' (No disponible)'; // Añadir texto indicando que no está disponible
        }

        selectHorario.appendChild(option);
    });
}


// Rellenar empleados disponibles
function llenarEmpleados() {
    const selectEmpleado = document.getElementById('empleado');
    empleados.forEach(empleado => {
        const option = document.createElement('option');
        option.value = empleado.id;
        option.textContent = empleado.nombre;
        selectEmpleado.appendChild(option);
    });
}

// Manejo del formulario de reserva
document.getElementById('reservaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombreCliente = document.getElementById('nombreClienteReserva').value.trim();
    const cedulaCliente = document.getElementById('cedulaClienteReserva').value.trim();
    const cantidadPersonas = parseInt(document.getElementById('cantidadPersonas').value);
    const horarioSeleccionado = document.getElementById('horario').value;
    const empleadoSeleccionado = document.getElementById('empleado').value;

    // Condiciones de las personas (niño, adulto, adulto mayor)
    const condiciones = [];
    for (let i = 0; i < cantidadPersonas; i++) {
        const condicion = document.getElementById(`condicion${i}`).value;
        condiciones.push(condicion);
    }

    // Verificar disponibilidad del horario
    const reservas = obtenerReservas();
    const reservasEnHorario = reservas.filter(reserva => reserva.horario === horarioSeleccionado);

    // Si ya hay 3 reservas en ese horario, no permitir agregar más
    if (reservasEnHorario.length >= 3) {
        alert('No hay suficiente espacio en ese horario, por favor elija otro.');
        return;
    }

    // Crear las reservas si la cantidad de personas es 3
    const nuevasReservas = [];
    for (let i = 0; i < cantidadPersonas; i++) {
        const nuevaReserva = {
            nombreCliente,
            cedulaCliente,
            cantidadPersonas: 1, // Cada persona tiene su propia reserva
            condiciones: [condiciones[i]], // Solo la condición de esa persona
            horario: horarioSeleccionado,
            empleado: empleados.find(emp => emp.id == empleadoSeleccionado).nombre,
            numeroReserva: reservas.length + i + 1 // Incrementar el número de reserva para cada una
        };
        nuevasReservas.push(nuevaReserva);
    }

    // Agregar las nuevas reservas
    reservas.push(...nuevasReservas);
    guardarReservas(reservas);

    // Mostrar las nuevas reservas en la lista
    renderizarReservas();

    // Actualizar los horarios disponibles (habilitar o deshabilitar)
    llenarHorarios();
});

// Función para renderizar las reservas en la tabla
function renderizarReservas() {
    const tablaReservas = document.getElementById('tablaReservas').getElementsByTagName('tbody')[0];
    tablaReservas.innerHTML = ''; // Limpiar la tabla antes de renderizar nuevas reservas

    const reservas = obtenerReservas();
    reservas.forEach(reserva => {
        // Crear una nueva fila
        const nuevaFila = document.createElement('tr');

        // Crear celdas para cada dato de la reserva
        const celdaNumeroReserva = document.createElement('td');
        celdaNumeroReserva.textContent = `#${reserva.numeroReserva}`;
        
        const celdaNombreCliente = document.createElement('td');
        celdaNombreCliente.textContent = reserva.nombreCliente;
        
        const celdaHorario = document.createElement('td');
        celdaHorario.textContent = reserva.horario;
        
        const celdaEmpleado = document.createElement('td');
        celdaEmpleado.textContent = reserva.empleado;

        // Agregar las celdas a la fila
        nuevaFila.appendChild(celdaNumeroReserva);
        nuevaFila.appendChild(celdaNombreCliente);
        nuevaFila.appendChild(celdaHorario);
        nuevaFila.appendChild(celdaEmpleado);

        // Agregar la fila al cuerpo de la tabla
        tablaReservas.appendChild(nuevaFila);
    });
}

// Obtener clientes del localStorage o iniciar vacío
function obtenerClientes() {
    return JSON.parse(localStorage.getItem('clientes')) || [];
}

document.addEventListener("DOMContentLoaded", function () {
    // Obtener los clientes y cargar los nombres en el select
    const clientes = obtenerClientes();  // Llama a la función obtenerClientes del otro JS
    const selectClientes = document.getElementById("nombreClienteReserva");

    // Limpiar cualquier opción existente
    selectClientes.innerHTML = "<option value=''>Seleccione un cliente</option>";

    // Cargar los clientes en el select
    clientes.forEach(cliente => {
        const option = document.createElement("option");
        option.value = cliente.cedula;  // Usar la cédula como valor
        option.textContent = cliente.nombre;  // Mostrar el nombre en la opción
        selectClientes.appendChild(option);
    });

    // Asignar el valor de la cédula automáticamente cuando se seleccione un cliente
    selectClientes.addEventListener("change", function() {
        const cedulaClienteReserva = document.getElementById("cedulaClienteReserva");
        cedulaClienteReserva.value = selectClientes.value;  // Cambiar el valor de la cédula
    });
});




// Llamadas iniciales
generarCondiciones();
llenarHorarios();
llenarEmpleados();
renderizarReservas();

