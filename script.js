const municipiosPorDepartamento = {
    "Ahuachapán": ["Ahuachapán Norte", "Ahuachapán Centro", "Ahuachapán Sur"],
    "Cabañas": ["Cabañas Este", "Cabañas Oeste"],
    "Chalatenango": ["Chalatenango Norte", "Chalatenango Centro", "Chalatenango Sur"],
    "Cuscatlán": ["Cuscatlán Norte", "Cuscatlán Sur"],
    "La Libertad": ["La Libertad Norte", "La Libertad Centro", "La Libertad Oeste", "La Libertad Este", "La Libertad Costa", "La Libertad Sur"],
    "La Paz": ["La Paz Oeste", "La Paz Centro", "La Paz Este"],
    "La Unión": ["La Unión Norte", "La Unión Sur"],
    "Morazán": ["Morazán Norte", "Morazán Sur"],
    "San Miguel": ["San Miguel Norte", "San Miguel Centro", "San Miguel Oeste"],
    "San Salvador": ["San Salvador Norte", "San Salvador Oeste", "San Salvador Este", "San Salvador Centro", "San Salvador Sur"],
    "San Vicente": ["San Vicente Norte", "San Vicente Sur"],
    "Santa Ana": ["Santa Ana Norte", "Santa Ana Centro", "Santa Ana Este", "Santa Ana Oeste"],
    "Sonsonate": ["Sonsonate Norte", "Sonsonate Centro", "Sonsonate Este", "Sonsonate Oeste"],
    "Usulután": ["Usulután Norte", "Usulután Este", "Usulután Oeste"]
};

let temporizadorMensaje;

// ==========================================
// INICIALIZACIÓN Y EVENTOS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    cargarDepartamentos();

    const formRegistro = document.getElementById("formRegistro");
    const selectDept = document.getElementById("departamento");
    const btnReiniciar = document.getElementById("btnReiniciar");

    if (formRegistro) formRegistro.addEventListener("submit", registrarUsuario);
    if (selectDept) selectDept.addEventListener("change", cargarMunicipios);

    // VINCULACIÓN DIRECTA DEL BOTÓN REINICIAR
    if (btnReiniciar) {
        btnReiniciar.addEventListener("click", reiniciarCuenta);
    }

    // Mensajes de validación en ESPAÑOL
    const camposRequeridos = document.querySelectorAll("#formRegistro [required]");
    camposRequeridos.forEach(campo => {
        campo.addEventListener("invalid", (e) => {
            e.target.setCustomValidity("Por favor, complete este campo.");
        });
        campo.addEventListener("input", (e) => {
            e.target.setCustomValidity("");
        });
    });

    comprobarRegistroExistente();
});

// Carga la lista inicial de departamentos
function cargarDepartamentos() {
    const selectDepartamento = document.getElementById("departamento");
    if (!selectDepartamento) return;

    selectDepartamento.innerHTML = '<option value="">Seleccione un departamento</option>';
    
    Object.keys(municipiosPorDepartamento).forEach(depto => {
        const option = document.createElement("option");
        option.value = depto;
        option.textContent = depto;
        selectDepartamento.appendChild(option);
    });
}

// Actualiza municipios según el departamento seleccionado
function cargarMunicipios() {
    const deptoSeleccionado = document.getElementById("departamento").value;
    const selectMunicipio = document.getElementById("municipio");

    selectMunicipio.innerHTML = '<option value="">Seleccione un municipio</option>';

    if (deptoSeleccionado && municipiosPorDepartamento[deptoSeleccionado]) {
        selectMunicipio.disabled = false;
        municipiosPorDepartamento[deptoSeleccionado].forEach(mun => {
            const option = document.createElement("option");
            option.value = mun;
            option.textContent = mun;
            selectMunicipio.appendChild(option);
        });
    } else {
        selectMunicipio.disabled = true;
        selectMunicipio.innerHTML = '<option value="">Primero seleccione un departamento</option>';
    }
}

// ==========================================
// REGISTRO Y LOGIN
// ==========================================

function comprobarRegistroExistente() {
    const datosGuardados = localStorage.getItem("usuarioEmergencia");
    
    if (datosGuardados) {
        const usuario = JSON.parse(datosGuardados);
        const elemUbicacion = document.getElementById("ubicacionLogin");
        if (elemUbicacion) {
            elemUbicacion.textContent = `📍 Registrado en: Municipio de ${usuario.municipio}, ${usuario.departamento}`;
        }
        mostrarPantalla("pantallaLogin");
    } else {
        mostrarPantalla("pantallaRegistro");
    }
}

function registrarUsuario(event) {
    event.preventDefault();

    const nuevoUsuario = {
        nombre: document.getElementById("nombre").value,
        edad: document.getElementById("edad").value,
        sexo: document.getElementById("sexo").value,
        departamento: document.getElementById("departamento").value,
        municipio: document.getElementById("municipio").value,
        telefono: document.getElementById("telefono").value
    };

    localStorage.setItem("usuarioEmergencia", JSON.stringify(nuevoUsuario));

    const elemUbicacion = document.getElementById("ubicacionLogin");
    if (elemUbicacion) {
        elemUbicacion.textContent = `📍 Registrado en: Municipio de ${nuevoUsuario.municipio}, ${nuevoUsuario.departamento}`;
    }
    mostrarPantalla("pantallaLogin");
}

function iniciarSesion() {
    const passInput = document.getElementById("passwordLogin");
    const pass = passInput ? passInput.value : "";
    const mensaje = document.getElementById("mensajeLogin");

    if (pass === "2010") {
        if (passInput) passInput.value = "";
        if (mensaje) mensaje.textContent = "";
        cargarDatosPantallaPrincipal();
        mostrarPantalla("pantallaPrincipal");
    } else {
        mostrarMensaje(mensaje, "Contraseña incorrecta. Intente con '2010'.", "error", 8);
    }
}

function cargarDatosPantallaPrincipal() {
    const usuario = JSON.parse(localStorage.getItem("usuarioEmergencia"));
    if (!usuario) return;

    document.getElementById("mostrarNombre").textContent = usuario.nombre;
    document.getElementById("mostrarEdad").textContent = usuario.edad + " años";
    document.getElementById("mostrarSexo").textContent = usuario.sexo;
    document.getElementById("mostrarUbicacion").textContent = `${usuario.municipio}, ${usuario.departamento}`;
    document.getElementById("mostrarTelefono").textContent = usuario.telefono;
}

function solicitarAyuda() {
    const usuario = JSON.parse(localStorage.getItem("usuarioEmergencia"));
    const mensaje = document.getElementById("mensajeEmergencia");
    
    if (usuario) {
        mostrarMensaje(
            mensaje, 
            `🚨 ¡ALERTA ENVIADA! Notificación remitida para la zona de ${usuario.municipio}, ${usuario.departamento}. Contactando al ${usuario.telefono}...`, 
            "exito",
            10
        );
    }
}

function cerrarSesion() {
    const mensaje = document.getElementById("mensajeEmergencia");
    if (mensaje) mensaje.textContent = "";
    mostrarPantalla("pantallaLogin");
}

// ==========================================
// FUNCIÓN DEL BOTÓN "VOLVER A LLENAR CUENTA"
// ==========================================
function reiniciarCuenta() {
    const confirmacion = window.confirm("¿Desea borrar la cuenta registrada y volver a llenar el formulario desde cero?");
    
    if (confirmacion) {
        // 1. Borra los datos almacenados
        localStorage.removeItem("usuarioEmergencia");
        
        // 2. Limpia el formulario
        const form = document.getElementById("formRegistro");
        if (form) form.reset();

        // 3. Limpia mensajes
        const msjs = ["mensajeRegistro", "mensajeLogin", "mensajeEmergencia"];
        msjs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = "";
        });

        // 4. Resetea los selecciones
        cargarDepartamentos();
        cargarMunicipios();
        
        // 5. Muestra la pantalla inicial
        mostrarPantalla("pantallaRegistro");
    }
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function mostrarPantalla(idPantalla) {
    const pantallas = ["pantallaRegistro", "pantallaLogin", "pantallaPrincipal"];
    pantallas.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("oculto");
    });
    const objetivo = document.getElementById(idPantalla);
    if (objetivo) objetivo.classList.remove("oculto");
}

function mostrarMensaje(elemento, texto, tipo, segundos = 8) {
    if (!elemento) return;

    clearTimeout(temporizadorMensaje);

    elemento.textContent = texto;
    elemento.style.color = tipo === "error" ? "#d90429" : "#2a9d8f";
    elemento.style.fontWeight = "bold";

    temporizadorMensaje = setTimeout(() => {
        elemento.textContent = "";
    }, segundos * 1000);
}
