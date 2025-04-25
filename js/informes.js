// Obtener las reservas y facturaciones desde el localStorage
function obtenerReservas() {
    return JSON.parse(localStorage.getItem('reservas')) || [];
}

function obtenerFacturaciones() {
    return JSON.parse(localStorage.getItem('facturaciones')) || [];
}

// Informe 1: Cantidad de personas atendidas por día
function generarInformePersonasAtendidas() {
    const reservas = obtenerReservas();
    const resultados = {};

    reservas.forEach(reserva => {
        const hora = reserva.horario;
        reserva.condiciones.forEach(cond => {
            const condicion = cond === "niño" ? "Niño" : cond === "adultoMayor" ? "Adulto Mayor" : "Adulto";
            if (!resultados[hora]) resultados[hora] = {};
            if (!resultados[hora][condicion]) resultados[hora][condicion] = 0;
            resultados[hora][condicion]++;
        });
    });

    mostrarInforme(resultados);
}

// Informe 2: Cantidad de dinero generado por día
function generarInformeDineroGenerado() {
    const facturaciones = obtenerFacturaciones();
    const resultados = {
        "adultos": "₡" +  0,
        "niños": "₡" + 0,
        "adultosMayores": "₡" + 0
    };

    facturaciones.forEach(factura => {
        factura.condiciones.forEach(cond => {
            if (cond === "adulto") resultados.adultos += 4000;
            else if (cond === "niño" || cond === "adultoMayor") resultados.niños += 2500;
        });
    });

    mostrarInforme(resultados);
}

// Informe 3: Horarios de mayor y menor afluencia
function generarInformeAfiliacionHorarios() {
    const reservas = obtenerReservas();
    const conteoHorarios = {};

    reservas.forEach(reserva => {
        const hora = reserva.horario;
        if (!conteoHorarios[hora]) conteoHorarios[hora] = 0;
        conteoHorarios[hora]++;
    });

    let maxAfluencia = 0;
    let minAfluencia = Infinity;
    let maxHora = "";
    let minHora = "";

    for (const hora in conteoHorarios) {
        if (conteoHorarios[hora] > maxAfluencia) {
            maxAfluencia = conteoHorarios[hora];
            maxHora = hora;
        }
        if (conteoHorarios[hora] < minAfluencia) {
            minAfluencia = conteoHorarios[hora];
            minHora = hora;
        }
    }

    mostrarInforme({
        "Mayor afluencia": `${maxHora} con ${maxAfluencia} personas`,
        "Menor afluencia": `${minHora} con ${minAfluencia} personas`
    });
}

// Mostrar los resultados de los informes
function mostrarInforme(resultados) {
    const informeDiv = document.getElementById('informesResultado');
    informeDiv.innerHTML = '<h3>Resultados del Informe:</h3>';
    
    for (const key in resultados) {
        const p = document.createElement('p');
        p.textContent = `${key}: ${JSON.stringify(resultados[key])}`;
        informeDiv.appendChild(p);
    }
}
