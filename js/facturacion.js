// Obtener las reservas del localStorage
function obtenerReservas() {
    return JSON.parse(localStorage.getItem('reservas')) || [];
}

// Manejo del formulario de facturación
document.getElementById('facturaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const cedulaCliente = document.getElementById('cedulaClienteReserva').value.trim();
    const numeroReserva = parseInt(document.getElementById('numeroReserva').value);

    // Buscar reserva por número de reserva
    const reservas = obtenerReservas();
    const reserva = reservas.find(res => res.numeroReserva === numeroReserva);

    if (!reserva) {
        alert('Número de reserva no encontrado.');
        return;
    }

    // Verificar que la cédula coincida con la de la reserva
    if (cedulaCliente !== reserva.cedulaCliente) {
        alert('La cédula no coincide con la de la reserva.');
        return;
    }

    // Calcular monto total basado en condiciones
    let montoTotal = 0;
    reserva.condiciones.forEach(condicion => {
        if (condicion === "niño" || condicion === "adultoMayor") {
            montoTotal += 15; // Precio especial para niños y adultos mayores
        } else {
            montoTotal += 30; // Precio normal para adultos
        }
    });

    // Mostrar detalles de la factura
    document.getElementById('facturaCliente').textContent = reserva.facturaCliente;
    document.getElementById('facturaNumeroReserva').textContent = reserva.numeroReserva;
    document.getElementById('facturaEmpleado').textContent = reserva.empleado;
    document.getElementById('facturaMontoTotal').textContent = montoTotal.toFixed(2);

    // Guardar la facturación en localStorage
    let facturaciones = JSON.parse(localStorage.getItem('facturaciones')) || [];

    const nuevaFactura = {
        cliente: reserva.facturaCliente,
        numeroReserva: reserva.numeroReserva,
        empleados: reserva.empleado,
        montoTotal: montoTotal.toFixed(2),
        condiciones: reserva.condiciones
    };

    facturaciones.push(nuevaFactura);
    localStorage.setItem('facturaciones', JSON.stringify(facturaciones));
    
    // Verifica si debe mostrarse el botón
    verificarYMostrarBotonFactura();

    const condicionesTexto = reserva.condiciones.map(cond => {
        if (cond === "niño") return "Niño";
        if (cond === "adultoMayor") return "Adulto Mayor";
        return "Adulto";
    }).join(", ");
    document.getElementById('facturaCondiciones').textContent = condicionesTexto;

    // Mostrar la sección de factura
    document.getElementById('facturaDetalle').style.display = 'block';
});

// Obtener clientes del localStorage o iniciar vacío
function obtenerClientes() {
    return JSON.parse(localStorage.getItem('clientes')) || [];
}


document.addEventListener("DOMContentLoaded", function () {
    // Obtener los clientes y cargar los nombres en el select
    const clientes = obtenerClientes();  // Llama a la función obtenerClientes del otro JS
    const selectClientes = document.getElementById("nombreClienteReserva");

    const reservas = obtenerReservas();  // Llama a la función obtenerClientes del otro JS
    const selectReservas = document.getElementById("numeroReservaSelec");

    // Limpiar cualquier opción existente
    selectClientes.innerHTML = "<option value=''>Seleccione un cliente</option>";
    selectReservas.innerHTML = "<option value=''>Seleccione la reserva</option>";

    // Cargar los clientes en el select
    clientes.forEach(cliente => {
        const option = document.createElement("option");
        option.value = cliente.cedula;  // Usar la cédula como valor
        option.textContent = cliente.nombre;  // Mostrar el nombre en la opción
        selectClientes.appendChild(option);
    });

    reservas.forEach(reserva => {
        const option = document.createElement("option");
        option.value = reserva.numeroReserva;  // Usar la cédula como valor
        option.textContent = "#" + reserva.numeroReserva + " / " + reserva.nombreCliente;  // Mostrar el nombre en la opción
        selectReservas.appendChild(option);
    });
    // Asignar el valor de la cédula automáticamente cuando se seleccione un cliente
    selectClientes.addEventListener("change", function() {
        const cedulaClienteReserva = document.getElementById("cedulaClienteReserva");
        cedulaClienteReserva.value = selectClientes.value;  // Cambiar el valor de la cédula
    });

    selectReservas.addEventListener("change", function() {
        const numeroReserva = document.getElementById("numeroReserva");
        numeroReserva.value = selectReservas.value;  // Cambiar el valor de la cédula
    });
});

document.getElementById("btnImprimirFactura").addEventListener("click", function () {
    const facturaDetalle = document.getElementById("facturaDetalle");

    // Mostrar la factura si está oculta
    facturaDetalle.style.display = "block";

    html2canvas(facturaDetalle, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth - 20; // Margen izquierdo y derecho
        const imgHeight = canvas.height * imgWidth / canvas.width;

        const marginTop = 10; // Espacio superior
        const marginLeft = (pageWidth - imgWidth) / 2;

        pdf.addImage(imgData, 'PNG', marginLeft, marginTop, imgWidth, imgHeight);
        pdf.save("factura.pdf");

        // Ocultar nuevamente y refrescar
        facturaDetalle.style.display = "none";
        location.reload();
    });
});



function verificarYMostrarBotonFactura() {
    const facturaDetalle = document.getElementById("facturaDetalle");
    const spans = facturaDetalle.querySelectorAll("span");
    let tieneDatos = false;

    spans.forEach(span => {
        if (span.textContent.trim() !== "") {
            tieneDatos = true;
        }
    });

    const boton = document.getElementById("btnImprimirFactura");
    boton.style.display = tieneDatos ? "inline-block" : "none";
}

