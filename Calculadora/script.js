
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

function getInputValue(id) {
    return Number(document.getElementById(id).value);
}

function showError(message) {
    document.getElementById("errorMessage").textContent = message;
}
let calculationHistory = [];

function calculateLink() {
    if (!validateInputs()) {
        return;
    }
    showError("");

    // 1. Obtener los valores del formulario
    const distance = getInputValue("distance");
    const frequency = getInputValue("frequency");
    const power = getInputValue("power");
    const txGain = getInputValue("txGain");
    const rxGain = getInputValue("rxGain");
    const losses = getInputValue("losses");
    const sensitivity = getInputValue("sensitivity");

    const inputs = [
        "distance", "frequency", "power",
        "txGain", "rxGain", "losses", "sensitivity"
    ];

    // 2. Validar campos vacíos y valores
    const hasEmptyFields = inputs.some(id =>
        document.getElementById(id).value.trim() === ""
    );

    const values = [
        distance, frequency, power,
        txGain, rxGain, losses, sensitivity
    ];

    if (hasEmptyFields || !values.every(Number.isFinite)) {
        showError("Verifica que todos los campos tengan valores numéricos válidos.");
        return;
    }

    if (distance <= 0 || frequency <= 0 || losses < 0) {
        showError("La distancia y la frecuencia deben ser mayores que cero. Las pérdidas no pueden ser negativas.");
        return;
    }

    // 3. Realizar los cálculos técnicos

    // Pérdida en espacio libre (FSPL)
    const fspl = 32.44
        + 20 * Math.log10(distance)
        + 20 * Math.log10(frequency);

    // Potencia isotrópica radiada equivalente (EIRP)
    const eirp = power + txGain;

    // Potencia recibida estimada
    const receivedPower =
        power + txGain + rxGain - fspl - losses;

    // Margen del enlace
    const linkMargin = receivedPower - sensitivity;

    // 4. Mostrar los resultados
    document.getElementById("fsplResult").textContent =
        fspl.toFixed(2) + " dB";

    document.getElementById("receivedResult").textContent =
        receivedPower.toFixed(2) + " dBm";

    document.getElementById("marginResult").textContent =
        linkMargin.toFixed(2);

    document.getElementById("eirpResult").textContent =
        eirp.toFixed(2) + " dBm";

    document.getElementById("sensitivityResult").textContent =
        sensitivity.toFixed(2) + " dBm";

    // 5. Interpretar el resultado
    updateStatus(linkMargin);
    updateDiagram({
        distance,
        frequency,
        receivedPower,
        linkMargin
    });
    saveCalculation({
        distance,
        frequency,
        receivedPower,
        linkMargin
    });
}

function updateStatus(margin) {
    const status = document.getElementById("status");
    const interpretation = document.getElementById("interpretation");

    status.className = "status";

    if (margin >= 20) {
        status.classList.add("good");
        status.textContent = "Margen favorable en esta estimación";

        interpretation.textContent =
            "La potencia recibida estimada supera la sensibilidad del receptor con un margen de 20 dB o más. Es un resultado preliminar favorable, que todavía requiere verificar otros factores técnicos.";
    } else if (margin >= 0) {
        status.classList.add("warning");
        status.textContent = "Margen positivo: requiere revisión";

        interpretation.textContent =
            "La potencia recibida estimada supera la sensibilidad del receptor, pero el margen es inferior a 20 dB. Se recomienda revisar las pérdidas y las condiciones reales de propagación.";
    } else {
        status.classList.add("bad");
        status.textContent = "Margen insuficiente en esta estimación";

        interpretation.textContent =
            "La potencia recibida estimada se encuentra por debajo de la sensibilidad del receptor. Con los parámetros ingresados, el enlace no cumpliría este criterio básico de recepción.";
    }
}

function resetCalculator() {
    // Restaurar valores iniciales
    document.getElementById("distance").value = 5;
    document.getElementById("frequency").value = 5800;
    document.getElementById("power").value = 20;
    document.getElementById("txGain").value = 23;
    document.getElementById("rxGain").value = 23;
    document.getElementById("losses").value = 3;
    document.getElementById("sensitivity").value = -75;

    // Limpiar resultados
    document.getElementById("fsplResult").textContent = "-- dB";
    document.getElementById("receivedResult").textContent = "-- dBm";
    document.getElementById("marginResult").textContent = "--";
    document.getElementById("eirpResult").textContent = "-- dBm";
    document.getElementById("sensitivityResult").textContent = "-- dBm";

    // Restaurar estado inicial
    const status = document.getElementById("status");
    status.className = "status neutral";
    status.textContent = "Pendiente de cálculo";

    document.getElementById("interpretation").textContent =
        "Los resultados aparecerán cuando ejecutes el cálculo.";

    showError("");
}

// Eventos de los botones
calculateBtn.addEventListener("click", calculateLink);
resetBtn.addEventListener("click", resetCalculator);

function updateDiagram(data) {
    const {
        distance,
        frequency,
        receivedPower,
        linkMargin
    } = data;

    const connectionLine =
        document.getElementById("connectionLine");

    const diagramStatus =
        document.getElementById("diagramStatus");

    // Actualizar información del enlace
    document.getElementById("diagramDistance").textContent =
        `Distancia: ${distance} km`;

    document.getElementById("diagramFrequency").textContent =
        `Frecuencia: ${frequency} MHz`;

    document.getElementById("diagramPower").textContent =
        `${receivedPower.toFixed(2)} dBm`;

    document.getElementById("diagramMargin").textContent =
        `${linkMargin.toFixed(2)} dB`;

    // Reiniciar estados visuales
    connectionLine.classList.remove(
        "connection-good",
        "connection-warning",
        "connection-bad"
    );

    // Cambiar el estado según el margen
    if (linkMargin >= 20) {
        connectionLine.classList.add("connection-good");
        diagramStatus.textContent = "Margen favorable";
        diagramStatus.style.color = "#218653";

    } else if (linkMargin >= 0) {
        connectionLine.classList.add("connection-warning");
        diagramStatus.textContent = "Requiere revisión";
        diagramStatus.style.color = "#b7791f";

    } else {
        connectionLine.classList.add("connection-bad");
        diagramStatus.textContent = "Margen insuficiente";
        diagramStatus.style.color = "#bd4545";
    }
}

function validateInputs() {
    const fields = [
        { id: "distance", name: "Distancia", positive: true },
        { id: "frequency", name: "Frecuencia", positive: true },
        { id: "power", name: "Potencia de transmisión" },
        { id: "txGain", name: "Ganancia de antena transmisora" },
        { id: "rxGain", name: "Ganancia de antena receptora" },
        { id: "losses", name: "Pérdidas", nonNegative: true },
        { id: "sensitivity", name: "Sensibilidad del receptor" }
    ];

    const errorBox = document.getElementById("formError");
    const errors = [];

    // Limpiar errores anteriores
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        input.classList.remove("input-error");
    });

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const value = input.value.trim();
        const number = Number(value);

        if (value === "" || !Number.isFinite(number)) {
            errors.push(`${field.name}: ingresa un valor numérico válido.`);
            input.classList.add("input-error");
            return;
        }

        if (field.positive && number <= 0) {
            errors.push(`${field.name}: debe ser mayor que cero.`);
            input.classList.add("input-error");
        }

        if (field.nonNegative && number < 0) {
            errors.push(`${field.name}: no puede ser negativo.`);
            input.classList.add("input-error");
        }
    });

    if (errors.length > 0) {
        errorBox.innerHTML = errors
            .map(error => `• ${error}`)
            .join("<br>");

        errorBox.hidden = false;

        const firstError = document.querySelector(".input-error");
        if (firstError) {
            firstError.focus();
        }

        return false;
    }

    errorBox.hidden = true;
    errorBox.innerHTML = "";

    return true;
}

function saveCalculation(data) {
    const calculation = {
        id: calculationHistory.length + 1,
        date: new Date(),
        distance: data.distance,
        frequency: data.frequency,
        receivedPower: data.receivedPower,
        linkMargin: data.linkMargin
    };

    calculationHistory.push(calculation);

    renderHistory();
}

function renderHistory() {
    const historyBody = document.getElementById("historyBody");
    const historyCount = document.getElementById("historyCount");

    historyBody.innerHTML = "";

    if (calculationHistory.length === 0) {
        historyBody.innerHTML = `
            <tr>
                <td colspan="7" class="history-empty">
                    Aún no hay cálculos registrados.
                </td>
            </tr>
        `;

        historyCount.textContent = "0 cálculos registrados";
        return;
    }

    calculationHistory.forEach(item => {
        let status = "";
        let statusClass = "";

        if (item.linkMargin >= 20) {
            status = "Favorable";
            statusClass = "good";
        } else if (item.linkMargin >= 0) {
            status = "Requiere revisión";
            statusClass = "warning";
        } else {
            status = "Insuficiente";
            statusClass = "bad";
        }

        const row = document.createElement("tr");

        const values = [
            item.id,
            item.date.toLocaleString("es-CO"),
            `${item.distance} km`,
            `${item.frequency} MHz`,
            `${item.receivedPower.toFixed(2)} dBm`,
            `${item.linkMargin.toFixed(2)} dB`
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.className = `history-status ${statusClass}`;
        statusBadge.textContent = status;

        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        historyBody.appendChild(row);
    });

    historyCount.textContent =
        `${calculationHistory.length} cálculos registrados`;
}

function clearHistory() {
    calculationHistory = [];
    renderHistory();
}

