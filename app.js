// ===== CONFIGURACIÓN Y DATOS =====

// Definición de módulos temáticos de Teoría de Sistemas
// Módulo 0 es la bienvenida (sin evaluación)
// Unidades 1-5 son las unidades oficiales de la materia
let MODULOS = [
    {
        id: 0,
        numero: 0,
        titulo: "Bienvenida al Curso",
        icono: "👋",
        parte: 0,
        clases: "Introducción",
        insignia: null, // Sin insignia para bienvenida
        estado: "no-iniciado",
        sinEvaluacion: true // Marca para no mostrar evaluación
    },
    {
        id: 1,
        numero: 1,
        titulo: "Unidad I: Teoría General de Sistemas y Enfoque de Sistemas",
        icono: "🧠",
        parte: 1,
        clases: "Unidad I",
        insignia: { nombre: "Maestro de TGS", emoji: "🌀", descripcion: "Completaste la Unidad I." },
        estado: "no-iniciado"
    },
    {
        id: 2,
        numero: 2,
        titulo: "Unidad II: Complejidad",
        icono: "🔗",
        parte: 1,
        clases: "Unidad II",
        insignia: { nombre: "Experto en Complejidad", emoji: "🎯", descripcion: "Dominaste la complejidad sistémica." },
        estado: "no-iniciado"
    },
    {
        id: 3,
        numero: 3,
        titulo: "Unidad III: Cibernética",
        icono: "🤖",
        parte: 1,
        clases: "Unidad III",
        insignia: { nombre: "Ingeniero Cibernético", emoji: "⚙️", descripcion: "Dominaste la cibernética." },
        estado: "no-iniciado"
    },
    {
        id: 4,
        numero: 4,
        titulo: "Unidad IV: Resolución de Problemas",
        icono: "🛠️",
        parte: 2,
        clases: "Unidad IV",
        insignia: { nombre: "Solucionador Experto", emoji: "🔧", descripcion: "Dominaste la resolución de problemas." },
        estado: "no-iniciado"
    },
    {
        id: 5,
        numero: 5,
        titulo: "Unidad V: Pensamiento Sistémico y Organizaciones",
        icono: "📈",
        parte: 2,
        clases: "Unidad V",
        insignia: { nombre: "Pensador Sistémico Avanzado", emoji: "🌟", descripcion: "Completaste el pensamiento sistémico." },
        estado: "no-iniciado"
    }
];

// Contenido teórico completo por módulo
// Contenido teórico y evaluaciones (se cargan desde contenido-teorico.json)
let CONTENIDO_TEORICO = {};
let CONTENIDO_EVALUACION = {};

// ===== CARGA DE CONTENIDO DESDE JSON =====

// Función para cargar el contenido desde el archivo JSON
async function cargarContenidoTeorico() {
    try {
        const response = await fetch('contenido-teorico.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el contenido teórico');
        }
        const datos = await response.json();
        CONTENIDO_TEORICO = datos.modulos;
        CONTENIDO_EVALUACION = datos.evaluaciones;
        console.log('✅ Contenido teórico cargado exitosamente');
        return true;
    } catch (error) {
        console.error('❌ Error cargando contenido teórico:', error);
        mostrarErrorCarga();
        return false;
    }
}

function mostrarErrorCarga() {
    const mensajeError = document.createElement('div');
    mensajeError.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        text-align: center;
        z-index: 10000;
        max-width: 500px;
    `;
    mensajeError.innerHTML = `
        <h2 style="color: #f44336; margin-top: 0;">⚠️ Error de Carga</h2>
        <p>No se pudo cargar el contenido teórico.</p>
        <p style="font-size: 0.9em; color: #666;">
            Si estás abriendo el archivo localmente, asegúrate de usar un servidor local 
            o abre el archivo con un navegador que permita fetch de archivos locales.
        </p>
        <button onclick="location.reload()" 
                style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: var(--color-primario); 
                       color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
            Reintentar
        </button>
    `;
    document.body.appendChild(mensajeError);
}


// Insignia secreta
const INSIGNIA_SECRETA = {
    nombre: "Maestro del Universo Sistémico",
    emoji: "🌌",
    descripcion: "Desbloqueada al completar todos los módulos",
    especial: true
};

// Preguntas de diagnóstico
const PREGUNTAS_DIAGNOSTICO = [
    {
        pregunta: "¿Qué es un sistema?",
        opciones: [
            "Un conjunto de elementos conectados que forman un todo",
            "Una máquina complicada",
            "Un software de computadora"
        ],
        correcta: 0,
        puntaje: 33
    },
    {
        pregunta: "¿Cuál es la característica principal del pensamiento sistémico?",
        opciones: [
            "Ver las partes de forma aislada",
            "Entender las conexiones e interdependencias entre componentes",
            "Enfocarse solo en el resultado final"
        ],
        correcta: 1,
        puntaje: 33
    },
    {
        pregunta: "¿Qué es la entropía en un sistema?",
        opciones: [
            "El nivel de energía del sistema",
            "La tendencia natural hacia el desorden",
            "La velocidad de cambio"
        ],
        correcta: 1,
        puntaje: 34
    }
];

// Variables globales
let estadoGlobal = {
    nombreUsuario: "",
    moduloActual: 0, // Empezar en el módulo de bienvenida
    seccionActual: 0, // Índice de la sección actual en el módulo
    modulosCompletados: [],
    seccionesCompletadas: {}, // {moduloId: [indices de secciones completadas]}
    insigniasDesbloqueadas: [],
    modoNoche: false,
    notasModulos: {} // {moduloId: HTML}
};

// ===== FUNCIONES DE INICIALIZACIÓN =====

function inicializarApp() {
    cargarEstado();
    configurarEventos();
    inicializarBuscador();
    
    if (estadoGlobal.nombreUsuario) {
        mostrarPantallaAprendizaje();
    } else {
        mostrarPantallaInicio();
    }

    // Aplicar modo noche si estaba activo
    if (estadoGlobal.modoNoche) {
        document.body.classList.add("modo-noche");
    }
}

function configurarEventos() {
    // Pantalla de inicio
    const formularioInicio = document.getElementById("formularioInicio");
    if (formularioInicio) {
        formularioInicio.addEventListener("submit", manejarInicio);
    }
    
    // Diagnóstico (opcional)
    const botonDiagnostico = document.getElementById("botonDiagnostico");
    if (botonDiagnostico) {
        botonDiagnostico.addEventListener("click", abrirDiagnostico);
    }
    const botonCerrarDiagnostico = document.getElementById("botonCerrarDiagnostico");
    if (botonCerrarDiagnostico) {
        botonCerrarDiagnostico.addEventListener("click", cerrarDiagnostico);
    }
    
    // Modal info
    const botonCerrarInfo = document.getElementById("botonCerrarInfo");
    if (botonCerrarInfo) {
        botonCerrarInfo.addEventListener("click", cerrarInfoProyecto);
    }
    const modalInfo = document.getElementById("modalInfo");
    if (modalInfo) {
        modalInfo.addEventListener("click", function(e) {
        if (e.target === this) {
            cerrarInfoProyecto();
        }
    });
    }
    
    // Modal de confirmación de reinicio
    const botonCancelarReiniciar = document.getElementById("botonCancelarReiniciar");
    if (botonCancelarReiniciar) {
        botonCancelarReiniciar.addEventListener("click", cerrarModalReiniciar);
    }
    const botonConfirmarReiniciar = document.getElementById("botonConfirmarReiniciar");
    if (botonConfirmarReiniciar) {
        botonConfirmarReiniciar.addEventListener("click", confirmarReinicio);
    }

    // Modal de confirmación de limpiar notas
    const botonCancelarLimpiar = document.getElementById("botonCancelarLimpiar");
    if (botonCancelarLimpiar) {
        botonCancelarLimpiar.addEventListener("click", cerrarModalLimpiar);
    }
    const botonConfirmarLimpiar = document.getElementById("botonConfirmarLimpiar");
    if (botonConfirmarLimpiar) {
        botonConfirmarLimpiar.addEventListener("click", confirmarLimpiar);
    }

    // Cerrar sidebar al hacer click en el overlay
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", cerrarSidebar);
    }
    
    // Botones del navbar superior
    const botonMenuNavbar = document.getElementById("botonMenuNavbar");
    if (botonMenuNavbar) {
        botonMenuNavbar.addEventListener("click", () => {
            document.getElementById("sidebar")?.classList.toggle("abierto");
            document.getElementById("sidebarOverlay")?.classList.toggle("activo");
    });
    }
    const botonLogrosNavbar = document.getElementById("botonLogrosNavbar");
    if (botonLogrosNavbar) {
        botonLogrosNavbar.addEventListener("click", mostrarVistaLogros);
    }
    const botonInfoNavbar = document.getElementById("botonInfoNavbar");
    if (botonInfoNavbar) {
        botonInfoNavbar.addEventListener("click", abrirInfoProyecto);
    }
    const botonReiniciarNavbar = document.getElementById("botonReiniciarNavbar");
    if (botonReiniciarNavbar) {
        botonReiniciarNavbar.addEventListener("click", reiniciarProgreso);
    }
    const botonTemaNavbar = document.getElementById("botonTemaNavbar");
    if (botonTemaNavbar) {
        botonTemaNavbar.addEventListener("click", alternarModoNoche);
    }
    
    document.addEventListener("click", function(e) {
        if (!e.target.closest(".imagen-wrapper-redimensionable")) {
            document.querySelectorAll(".imagen-wrapper-redimensionable.seleccionada")
                .forEach(wrapper => wrapper.classList.remove("seleccionada"));
        }
    });
    
    // Tarjeta de insignias en dashboard (clickable)
    const tarjetaInsignias = document.querySelector(".tarjeta-insignias-clickable");
    if (tarjetaInsignias) {
        tarjetaInsignias.addEventListener("click", () => {
            mostrarVistaLogros();
            cerrarSidebar();
        });
    }
    
    // Botones del sidebar
    const botonDashboard = document.getElementById("botonDashboard");
    if (botonDashboard) {
        botonDashboard.addEventListener("click", mostrarVistaDashboard);
    }
    const botonVolverLogros = document.getElementById("botonVolverLogros");
    if (botonVolverLogros) {
        botonVolverLogros.addEventListener("click", mostrarVistaDashboard);
    }
    
    // Modal cambiar nombre
    const saludoEl = document.getElementById("saludoUsuario");
    const modalNombreEl = document.getElementById("modalCambiarNombre");
    const inputNombreEl = document.getElementById("inputNuevoNombre");
    
    if (saludoEl) {
        saludoEl.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            abrirModalCambiarNombre();
        });
    }
    if (document.getElementById("botonCancelarNombre")) {
        document.getElementById("botonCancelarNombre").addEventListener("click", cerrarModalCambiarNombre);
    }
    if (document.getElementById("botonConfirmarNombre")) {
        document.getElementById("botonConfirmarNombre").addEventListener("click", confirmarCambiarNombre);
    }
    if (inputNombreEl) {
        inputNombreEl.addEventListener("keypress", (e) => {
            if (e.key === "Enter") confirmarCambiarNombre();
        });
    }
    if (modalNombreEl) {
        modalNombreEl.addEventListener("click", (e) => {
            if (e.target.id === "modalCambiarNombre") cerrarModalCambiarNombre();
        });
    }
    
    // Event listeners para modal de salir del Escape Room
    const botonCancelarSalir = document.getElementById("botonCancelarSalir");
    const botonConfirmarSalir = document.getElementById("botonConfirmarSalir");
    const modalSalirEscape = document.getElementById("modalSalirEscape");
    
    if (botonCancelarSalir) {
        botonCancelarSalir.addEventListener("click", cancelarSalirEscape);
    }
    if (botonConfirmarSalir) {
        botonConfirmarSalir.addEventListener("click", confirmarSalirEscape);
    }
    if (modalSalirEscape) {
        modalSalirEscape.addEventListener("click", (e) => {
            if (e.target.id === "modalSalirEscape") cancelarSalirEscape();
        });
    }
}

// ===== CAMBIAR NOMBRE (MODAL) =====

function abrirModalCambiarNombre() {
    const modal = document.getElementById("modalCambiarNombre");
    const input = document.getElementById("inputNuevoNombre");
    input.value = estadoGlobal.nombreUsuario;
    modal.classList.remove("oculta");
    setTimeout(() => input.focus(), 100);
}

function cerrarModalCambiarNombre() {
    document.getElementById("modalCambiarNombre").classList.add("oculta");
}

function confirmarCambiarNombre() {
    const input = document.getElementById("inputNuevoNombre");
    const nuevoNombre = input.value.trim();
    
    if (nuevoNombre.length >= 2) {
        estadoGlobal.nombreUsuario = nuevoNombre;
        guardarEstado();
        document.getElementById("nombreUsuario").textContent = estadoGlobal.nombreUsuario;
        cerrarModalCambiarNombre();
        mostrarNotificacion("✅ Nombre actualizado correctamente");
    } else {
        input.classList.add("input-error");
        setTimeout(() => input.classList.remove("input-error"), 500);
    }
}

// ===== GESTIÓN DE ESTADO Y localStorage =====

function guardarEstado() {
    localStorage.setItem("estadoTeoriaSistemas", JSON.stringify(estadoGlobal));
}

function cargarEstado() {
    const estado = localStorage.getItem("estadoTeoriaSistemas");
    if (estado) {
        estadoGlobal = JSON.parse(estado);
        // Asegurar que existan todas las propiedades necesarias
        if (!estadoGlobal.notasModulos) {
            estadoGlobal.notasModulos = {};
        }
        if (!estadoGlobal.seccionesCompletadas) {
            estadoGlobal.seccionesCompletadas = {};
        }
        if (estadoGlobal.seccionActual === undefined) {
            estadoGlobal.seccionActual = 0;
        }
        if (!estadoGlobal.modulosExpandidos) {
            estadoGlobal.modulosExpandidos = {};
        }
        
        // Migrar notas antiguas (formato objeto) al nuevo formato (HTML)
        Object.keys(estadoGlobal.notasModulos).forEach(moduloId => {
            const notas = estadoGlobal.notasModulos[moduloId];
            // Si es un objeto con texto e imágenes (formato antiguo)
            if (typeof notas === 'object' && notas !== null && !Array.isArray(notas)) {
                let htmlContenido = '';
                
                // Convertir texto a HTML con párrafos
                if (notas.texto) {
                    const parrafos = notas.texto.split('\n').filter(p => p.trim());
                    htmlContenido = parrafos.map(p => `<p>${p}</p>`).join('');
                }
                
                // Agregar imágenes al final
                if (notas.imagenes && notas.imagenes.length > 0) {
                    const imagenesHTML = notas.imagenes.map(img => 
                        `<img src="${img}" class="imagen-en-editor" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; cursor: pointer;">`
                    ).join('');
                    htmlContenido += imagenesHTML;
                }
                
                estadoGlobal.notasModulos[moduloId] = htmlContenido;
            }
        });
    }
}

function reiniciarProgreso() {
    document.getElementById("modalReiniciar").classList.remove("oculta");
}

function cerrarModalReiniciar() {
    document.getElementById("modalReiniciar").classList.add("oculta");
}

function confirmarReinicio() {
    estadoGlobal = {
        nombreUsuario: estadoGlobal.nombreUsuario,
        moduloActual: 0,
        seccionActual: 0,
        modulosCompletados: [],
        seccionesCompletadas: {},
        insigniasDesbloqueadas: [],
        modoNoche: estadoGlobal.modoNoche,
        notasModulos: {} // Reiniciar también las notas
    };
    
    // Limpiar mejores puntajes de evaluaciones
    localStorage.removeItem('mejoresPuntajes');
    
    guardarEstado();
    MODULOS.forEach(m => m.estado = "no-iniciado");
    cerrarModalReiniciar();
    mostrarVistaDashboard();
    actualizarUI();
    mostrarNotificacion("✅ Progreso reiniciado correctamente");
}

// ===== PANTALLA DE INICIO =====

function manejarInicio(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombreAlumno").value.trim();
    
    if (nombre.length < 2) {
        alert("Por favor, ingresa un nombre válido.");
        return;
    }
    
    estadoGlobal.nombreUsuario = nombre;
    guardarEstado();
    mostrarPantallaAprendizaje();
}

function mostrarPantallaInicio() {
    document.getElementById("pantallaInicio").classList.remove("oculta");
    document.getElementById("pantallaAprendizaje").classList.add("oculta");
}

// CHANGE: Added diagnosis modal functions
function abrirDiagnostico() {
    document.getElementById("modalDiagnostico").classList.remove("oculta");
    renderizarDiagnostico();
}

function cerrarDiagnostico() {
    document.getElementById("modalDiagnostico").classList.add("oculta");
}

function abrirInfoProyecto() {
    document.getElementById("modalInfo").classList.remove("oculta");
}

function cerrarInfoProyecto() {
    document.getElementById("modalInfo").classList.add("oculta");
}

function renderizarDiagnostico() {
    const contenido = document.getElementById("contenidoDiagnostico");
    contenido.innerHTML = "";

    PREGUNTAS_DIAGNOSTICO.forEach((pregunta, indice) => {
        const divPregunta = document.createElement("div");
        divPregunta.className = "pregunta-diagnostico";
        
        divPregunta.innerHTML = `
            <h3>Pregunta ${indice + 1}: ${pregunta.pregunta}</h3>
            <div class="opciones-respuesta">
                ${pregunta.opciones.map((opcion, idx) => `
                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin: 0;">
                        <input type="radio" name="pregunta-${indice}" value="${idx}" style="cursor: pointer;">
                        <span>${opcion}</span>
                    </label>
                `).join("")}
            </div>
        `;
        
        contenido.appendChild(divPregunta);
    });

    const boton = document.createElement("button");
    boton.className = "boton-enviar-diagnostico";
    boton.textContent = "Enviar Respuestas";
    boton.addEventListener("click", procesarDiagnostico);
    contenido.appendChild(boton);
}

function procesarDiagnostico() {
    let puntajeFinal = 0;
    let respuestasValidas = 0;

    PREGUNTAS_DIAGNOSTICO.forEach((pregunta, indice) => {
        const respuesta = document.querySelector(`input[name="pregunta-${indice}"]:checked`);
        if (respuesta) {
            respuestasValidas++;
            if (parseInt(respuesta.value) === pregunta.correcta) {
                puntajeFinal += pregunta.puntaje;
            }
        }
    });

    if (respuestasValidas < PREGUNTAS_DIAGNOSTICO.length) {
        alert("Por favor responde todas las preguntas.");
        return;
    }

    mostrarResultadoDiagnostico(puntajeFinal);
}

function mostrarResultadoDiagnostico(puntaje) {
    const contenido = document.getElementById("contenidoDiagnostico");
    contenido.innerHTML = "";

    let mensaje = "";
    let nivel = "";

    if (puntaje <= 33) {
        mensaje = "Tranquilo, este curso te va a ayudar mucho a entender los sistemas.";
        nivel = "Principiante";
    } else if (puntaje <= 66) {
        mensaje = "Buen comienzo, ¡a seguir aprendiendo y profundizando!";
        nivel = "Intermedio";
    } else {
        mensaje = "¡Wow, ya sabés bastante! Prepárate para conceptos más avanzados.";
        nivel = "Avanzado";
    }

    contenido.innerHTML = `
        <div class="resultado-diagnostico">
            <h3>Diagnóstico Completado</h3>
            <p><strong>Tu Nivel:</strong> ${nivel}</p>
            <p><strong>Puntaje:</strong> ${puntaje}/100</p>
            <p style="margin-top: 1rem; font-size: 1.05rem;">${mensaje}</p>
            <button class="boton-comenzar-curso" onclick="document.getElementById('modalDiagnostico').classList.add('oculta')">
                Comenzar el Curso
            </button>
        </div>
    `;

    generarConfetti();
}

// ===== PANTALLA DE APRENDIZAJE =====

function mostrarPantallaAprendizaje() {
    document.getElementById("pantallaInicio").classList.add("oculta");
    document.getElementById("pantallaAprendizaje").classList.remove("oculta");
    
    actualizarUI();
    cerrarSidebar();
    
    // Siempre mostrar el dashboard al iniciar
    mostrarVistaDashboard();
}

function actualizarUI() {
    actualizarSidebar();
    actualizarVistaPrincipal();
    actualizarVistaLogros();
    actualizarDashboard();
}

// ===== ACTUALIZAR SIDEBAR =====

function actualizarSidebar() {
    // Nombre de usuario
    document.getElementById("nombreUsuario").textContent = estadoGlobal.nombreUsuario;

    // Progreso global (excluir módulo 0 de bienvenida del cálculo)
    const totalUnidades = MODULOS.filter(m => m.insignia !== null).length;
    const completadas = estadoGlobal.modulosCompletados.filter(id => id !== 0).length;
    const porcentaje = Math.round((completadas / totalUnidades) * 100);
    document.getElementById("barraProgreso").style.width = porcentaje + "%";
    document.getElementById("porcentajeProgreso").textContent = porcentaje;

    // Inicializar estado de expansión si no existe
    if (!estadoGlobal.modulosExpandidos) {
        estadoGlobal.modulosExpandidos = {};
    }

    // Lista de módulos
    const listaModulos = document.getElementById("listaModulos");
    listaModulos.innerHTML = "";

    MODULOS.forEach(modulo => {
        const esModuloActual = modulo.id === estadoGlobal.moduloActual;
        const seccionesModulo = obtenerSeccionesModulo(modulo.id);
        const tieneSecciones = seccionesModulo.length > 0;
        // El estado de expansión se mantiene independiente, sin expandir automáticamente
        const estaExpandido = estadoGlobal.modulosExpandidos[modulo.id] === true;
        
        // Determinar estado visual del módulo
        const completado = estadoGlobal.modulosCompletados.includes(modulo.id);
        let estado;
        
        if (completado) {
            estado = "🟢";
            modulo.estado = "completado";
        } else if (modulo.estado === "en-curso" || esModuloActual) {
            estado = "🟡";
            if (!completado) {
                modulo.estado = "en-curso";
            }
        } else {
            estado = "⚪";
        }

        // Mostrar título completo, sin truncar
        const nombreCompleto = modulo.titulo;
        
        // Crear contenedor del módulo
        const contenedorModulo = document.createElement("div");
        contenedorModulo.className = "contenedor-modulo-sidebar";
        
        // Item del módulo
        const div = document.createElement("div");
        div.className = `item-modulo ${esModuloActual ? 'activo' : ''}`;
        
        // Crear el HTML del módulo
        const iconoHTML = tieneSecciones ? '<span class="icono-expandir-modulo">▼</span>' : '';
        div.innerHTML = `
            <div class="numero-modulo">${modulo.numero}</div>
            <span class="nombre-modulo">${nombreCompleto}</span>
            <span class="estado-modulo">${estado}</span>
            ${iconoHTML}
        `;

        // Manejar click en el icono de expandir (evento separado)
        if (tieneSecciones) {
            const icono = div.querySelector('.icono-expandir-modulo');
            if (icono) {
                icono.addEventListener("click", (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const contenedor = contenedorModulo.querySelector('.secciones-modulo-sidebar');
                    if (contenedor) {
                        const nuevoEstado = !contenedor.classList.contains('expandido');
                        contenedor.classList.toggle('expandido');
                        estadoGlobal.modulosExpandidos[modulo.id] = nuevoEstado;
                        guardarEstado();
                        
                        if (contenedor.classList.contains('expandido')) {
                            icono.style.transform = 'rotate(180deg)';
                        } else {
                            icono.style.transform = 'rotate(0deg)';
                        }
                    }
                });
            }
        }
        
        // Manejar click en el módulo (para cambiar de módulo)
        div.addEventListener("click", (e) => {
            // Si clickeó en el icono, no cambiar de módulo (solo expandir/colapsar)
            // El evento del icono ya se maneja arriba con stopPropagation
            if (e.target.classList.contains('icono-expandir-modulo') || e.target.closest('.icono-expandir-modulo')) {
                return;
            }
            
            // Cambiar de módulo (sin expandir automáticamente)
            // SIEMPRE navegar, incluso si ya estamos en ese módulo (para que funcione desde dashboard)
            estadoGlobal.moduloActual = modulo.id;
            estadoGlobal.seccionActual = 0; // Resetear a primera sección al cambiar de módulo
            guardarEstado();
            mostrarVistaPrincipal();
            cerrarSidebar();
            actualizarUI();
        });

        contenedorModulo.appendChild(div);
        
        // Agregar secciones si el módulo tiene secciones
        if (tieneSecciones) {
            const seccionesCompletadas = estadoGlobal.seccionesCompletadas[modulo.id] || [];
            const contenedorSecciones = document.createElement("div");
            contenedorSecciones.className = `secciones-modulo-sidebar ${estaExpandido ? 'expandido' : ''}`;
            
            contenedorSecciones.innerHTML = seccionesModulo.map((seccion, index) => {
                const esActual = esModuloActual && index === estadoGlobal.seccionActual;
                
                return `
                    <div class="item-seccion-sidebar ${esActual ? 'activa' : ''}" 
                         onclick="navegarSeccion(${modulo.id}, ${index}); event.stopPropagation();">
                        <span class="numero-seccion-sidebar">${index + 1}</span>
                        <span class="emoji-seccion-sidebar">${seccion.emoji}</span>
                        <span class="titulo-seccion-sidebar">${seccion.titulo}</span>
                    </div>
                `;
            }).join('');
            
            contenedorModulo.appendChild(contenedorSecciones);
            
            // Configurar icono según estado de expansión (después de agregar al DOM)
            setTimeout(() => {
                const icono = div.querySelector('.icono-expandir-modulo');
                if (icono) {
                    icono.style.transform = estaExpandido ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            }, 0);
        }

        listaModulos.appendChild(contenedorModulo);
    });
}

// CHANGE: Added dashboard view function
function actualizarDashboard() {
    // Contar solo unidades (excluir módulo 0 - Bienvenida)
    const totalUnidades = MODULOS.filter(m => m.id !== 0 && m.insignia !== null).length;
    const totalInsignias = MODULOS.filter(m => m.insignia !== null).length;
    const unidadesCompletadas = estadoGlobal.modulosCompletados.filter(id => id !== 0).length;
    const insigniasObtenidasNum = estadoGlobal.insigniasDesbloqueadas.length;
    
    // Actualizar contadores de completadas
    const elemUnidades = document.getElementById("unidadesCompletadasNum");
    if (elemUnidades) {
        elemUnidades.textContent = unidadesCompletadas;
    }
    
    const elemInsignias = document.getElementById("insigniasObtenidasNum");
    if (elemInsignias) {
        elemInsignias.textContent = insigniasObtenidasNum;
    }
    
    // Actualizar totales dinámicos
    const elemTotalUnidades = document.getElementById("totalUnidadesNum");
    if (elemTotalUnidades) {
        elemTotalUnidades.textContent = totalUnidades;
    }
    
    const elemTotalInsignias = document.getElementById("totalInsigniasNum");
    if (elemTotalInsignias) {
        elemTotalInsignias.textContent = totalInsignias;
    }

    // Renderizar rejilla de módulos (solo unidades 1-5, no módulo 0)
    const rejilla = document.getElementById("rejillaModulos");
    if (rejilla) {
        rejilla.innerHTML = "";
        
        // Filtrar solo módulos con insignia (excluir módulo 0)
        const unidades = MODULOS.filter(m => m.insignia !== null);
        
        unidades.forEach(modulo => {
            const tarjeta = document.createElement("div");
            const completado = estadoGlobal.modulosCompletados.includes(modulo.id);
            const iniciado = modulo.estado === "en-curso" && !completado;
            
            let claseEstado = 'sin-iniciar';
            let textoEstado = 'No iniciado';
            
            if (completado) {
                claseEstado = 'completado';
                textoEstado = '✓ Completado';
            } else if (iniciado) {
                claseEstado = 'en-curso';
                textoEstado = '⏳ En curso';
            }
            
            tarjeta.className = `tarjeta-modulo modulo-${modulo.numero} ${claseEstado}`;
            
            tarjeta.innerHTML = `
                <div class="numero-tarjeta">${modulo.numero}</div>
                <div class="icono-tarjeta">${modulo.icono}</div>
                <div class="titulo-tarjeta">${modulo.titulo}</div>
                <div class="estado-tarjeta">${textoEstado}</div>
            `;
            
            tarjeta.addEventListener("click", () => {
                estadoGlobal.moduloActual = modulo.id;
                estadoGlobal.seccionActual = 0;
                guardarEstado();
                mostrarVistaPrincipal();
                cerrarSidebar();
                actualizarUI();
            });
            
            rejilla.appendChild(tarjeta);
        });
    }
}

// ===== FUNCIÓN PARA PROCESAR CONTENIDO INTERACTIVO (NAVEGACIÓN SECUENCIAL) =====

// Almacenar información de secciones globalmente
let seccionesModuloActual = [];

// Función para obtener secciones de cualquier módulo sin renderizar
function obtenerSeccionesModulo(moduloId) {
    const contenidoHTML = obtenerContenidoModulo(moduloId);
    if (!contenidoHTML || contenidoHTML.trim() === '') return [];
    
    const contenidoMejorado = mejorarFormatoHTML(contenidoHTML);
    
    // Dividir por h2 y h3 (método simple y efectivo)
    const secciones = contenidoMejorado.split(/(?=<h[23][^>]*>)/i).filter(s => s.trim());
    
    // Si no hay secciones o solo hay una, verificar si hay contenido significativo
    if (secciones.length <= 1) {
        const contenidoSinTags = contenidoMejorado.replace(/<[^>]+>/g, '').trim();
        if (contenidoSinTags.length > 50) {
            // Si hay contenido pero sin encabezados claros, crear una sección única
            return [{
                index: 0,
                titulo: 'Contenido',
                emoji: '📖',
                contenido: contenidoMejorado
            }];
        }
        return [];
    }
    
    // Procesar cada sección
    return secciones.map((seccion, index) => {
        const titulo = extraerTitulo(seccion);
        const emoji = obtenerEmojiPorIndice(index);
        return {
            index: index,
            titulo: titulo || `Sección ${index + 1}`,
            emoji: emoji,
            contenido: seccion
        };
    });
}

function procesarContenidoInteractivo(htmlContent, moduloId) {
    if (!htmlContent) return '<p class="placeholder-texto">Contenido en desarrollo.</p>';
    
    // Mejorar formato primero
    const contenidoMejorado = mejorarFormatoHTML(htmlContent);
    
    // Dividir por h2 y h3 usando regex
    const secciones = contenidoMejorado.split(/(?=<h[23][^>]*>)/i).filter(s => s.trim());
    
    if (secciones.length <= 1) {
        // Si no hay secciones, devolver el contenido con mejor formato
        return `<div class="contenido-mejorado">${contenidoMejorado}</div>`;
    }
    
    // Guardar información de secciones
    seccionesModuloActual = secciones.map((seccion, index) => {
        const titulo = extraerTitulo(seccion);
        const emoji = obtenerEmojiPorIndice(index);
        return { index, titulo, emoji, contenido: seccion };
    });
    
    // Obtener sección actual
    const seccionActual = estadoGlobal.seccionActual || 0;
    const seccionesCompletadas = estadoGlobal.seccionesCompletadas[moduloId] || [];
    
    // Renderizar sección actual
    return crearVistaSecuencial(moduloId, seccionActual, seccionesCompletadas);
}

function crearVistaSecuencial(moduloId, seccionActual, seccionesCompletadas) {
    if (seccionesModuloActual.length === 0) return '';
    
    const seccion = seccionesModuloActual[seccionActual];
    if (!seccion) return '';
    
    const esPrimera = seccionActual === 0;
    const esUltima = seccionActual === seccionesModuloActual.length - 1;
    // Remover el h2/h3 del contenido
    const contenidoSinTitulo = seccion.contenido.replace(/<h[23][^>]*>.*?<\/h[23]>/i, '').trim();
    
    return `
        <div class="contenedor-secuencial">
            <!-- Sección actual -->
            <div class="seccion-secuencial activa" data-seccion="${seccionActual}">
                <div class="header-seccion-secuencial">
                    <span class="emoji-seccion">${seccion.emoji}</span>
                    <h2 class="titulo-seccion-secuencial">${seccion.titulo}</h2>
                </div>
                <div class="contenido-seccion-secuencial">
                    ${contenidoSinTitulo}
                </div>
            </div>
            
            <!-- Navegación -->
            <div class="navegacion-secciones">
                <button class="boton-navegacion ${esPrimera ? 'deshabilitado' : ''}" 
                        onclick="navegarSeccion(${moduloId}, ${seccionActual - 1})" 
                        ${esPrimera ? 'disabled' : ''}>
                    <span class="flecha">←</span> Anterior
                </button>
                
                <div class="indicador-seccion">
                    ${seccionesModuloActual.map((s, i) => `
                        <span class="punto-seccion ${i === seccionActual ? 'activa' : ''} ${seccionesCompletadas.includes(i) ? 'completada' : ''}" 
                              onclick="navegarSeccion(${moduloId}, ${i})" 
                              title="${s.titulo}">
                        </span>
                    `).join('')}
                </div>
                
                ${!esUltima ? `
                    <button class="boton-navegacion" onclick="navegarSeccion(${moduloId}, ${seccionActual + 1})">
                        Siguiente <span class="flecha">→</span>
                    </button>
                ` : moduloId === 0 ? `
                    <button class="boton-navegacion boton-ir-unidad-1" onclick="irAEvaluacion(${moduloId})">
                        Ir a Unidad I <span class="flecha">→</span>
                    </button>
                ` : `
                    <button class="boton-navegacion" onclick="irAEvaluacion(${moduloId})">
                        Ir a Evaluación <span class="flecha">→</span>
                    </button>
                `}
            </div>
        </div>
    `;
}

function mejorarFormatoHTML(html) {
    if (!html) return '';
    
    // Mejorar espaciado de párrafos
    let mejorado = html
        .replace(/<p>/g, '<p class="parrafo-mejorado">')
        .replace(/<ul>/g, '<ul class="lista-mejorada">')
        .replace(/<ol>/g, '<ol class="lista-mejorada">')
        .replace(/<li>/g, '<li class="item-lista-mejorado">')
        // Asegurar que los h2, h3, h4 tengan clases apropiadas
        .replace(/<h2>/g, '<h2 class="titulo-principal">')
        .replace(/<h3>/g, '<h3 class="titulo-secundario">')
        .replace(/<h4>/g, '<h4 class="titulo-terciario">')
        .replace(/<h5>/g, '<h5 class="titulo-cuaternario">')
        // Mejorar tablas
        .replace(/<table>/g, '<table class="tabla-mejorada">')
        // Asegurar que strong tenga mejor estilo
        .replace(/<strong>/g, '<strong class="texto-destacado">');
    
    return mejorado;
}

function extraerTitulo(html) {
    const match = html.match(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/i);
    if (match) {
        return match[1].replace(/<[^>]+>/g, '').trim();
    }
    // Si no hay título, intentar extraer el primer texto significativo
    const texto = html.replace(/<[^>]+>/g, ' ').trim().substring(0, 50);
    return texto || 'Sección';
}

function obtenerEmojiPorIndice(indice) {
    // Sin emojis en las secciones
    return '';
}

// ===== FUNCIONES DE NAVEGACIÓN SECUENCIAL =====

function navegarSeccion(moduloId, nuevaSeccion) {
    // Si venimos del dashboard u otra vista, primero mostrar la vista principal
    const vistaDashboard = document.getElementById('vistaDashboard');
    const vistaLogros = document.getElementById('vistaLogros');
    if (!vistaDashboard.classList.contains('oculta') || !vistaLogros.classList.contains('oculta')) {
        // Estamos en dashboard o logros, mostrar vista principal primero
        mostrarVistaPrincipal();
    }
    
    // Actualizar el módulo actual si es diferente
    if (estadoGlobal.moduloActual !== moduloId) {
        estadoGlobal.moduloActual = moduloId;
        // Necesitamos recargar las secciones del módulo
        procesarContenidoInteractivo(obtenerContenidoModulo(moduloId), moduloId);
    }
    
    if (nuevaSeccion < 0 || nuevaSeccion >= seccionesModuloActual.length) return;
    
    estadoGlobal.seccionActual = nuevaSeccion;
    guardarEstado();
    
    // Scroll al inicio - tanto del contenedor principal como de la ventana
    const contenidoPrincipal = document.getElementById('contenidoPrincipal');
    if (contenidoPrincipal) {
        contenidoPrincipal.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    // Actualizar vista con transición fluida y optimizada
    const contenedor = document.querySelector('.contenedor-secuencial');
    if (contenedor) {
        // Remover clase fade-in si existe
        contenedor.classList.remove('fade-in');
        // Aplicar fade-out
        contenedor.classList.add('fade-out');
        
        // Usar requestAnimationFrame para mejor performance
        requestAnimationFrame(() => {
            setTimeout(() => {
                actualizarVistaPrincipal();
                actualizarSidebar();
                
                // Aplicar fade-in inmediatamente después de actualizar
                requestAnimationFrame(() => {
                    const nuevoContenedor = document.querySelector('.contenedor-secuencial');
                    if (nuevoContenedor) {
                        nuevoContenedor.classList.remove('fade-out');
                        nuevoContenedor.classList.add('fade-in');
                    }
                    
                    // Asegurar scroll después de actualizar el contenido
                    if (contenidoPrincipal) {
                        contenidoPrincipal.scrollTop = 0;
                    }
                });
            }, 150);
        });
    } else {
        actualizarVistaPrincipal();
        actualizarSidebar();
        
        // Scroll también después de actualizar
        setTimeout(() => {
            if (contenidoPrincipal) {
                contenidoPrincipal.scrollTop = 0;
            }
        }, 50);
    }
}

function irAEvaluacion(moduloId) {
    // Si es el módulo 0 (bienvenida), completarlo y ir a la Unidad I
    if (moduloId === 0) {
        // Marcar módulo 0 como completado
        if (!estadoGlobal.modulosCompletados.includes(0)) {
            estadoGlobal.modulosCompletados.push(0);
        }
        
        // Ir a Unidad I
        estadoGlobal.moduloActual = 1;
        estadoGlobal.seccionActual = 0;
        guardarEstado();
        
        // Mostrar la vista principal (no dashboard)
        document.getElementById("vistaDashboard").classList.add("oculta");
        document.getElementById("vistaLogros").classList.add("oculta");
        document.getElementById("vistaPrincipal").classList.remove("oculta");
        
        // Actualizar todo el UI incluyendo sidebar
        actualizarUI();
        mostrarNotificacion('✅ ¡Bienvenida completada! Comenzando con la Unidad I');
        return;
    }
    
    cambiarPestana('actividad', moduloId);
}

// ===== ACTUALIZAR VISTA PRINCIPAL (MÓDULOS) =====

function actualizarVistaPrincipal() {
    const modulo = MODULOS.find(m => m.id === estadoGlobal.moduloActual);
    if (!modulo) return;

    // Actualizar estado visual
    modulo.estado = estadoGlobal.modulosCompletados.includes(modulo.id) ? "completado" : "en-curso";

    const vistaPrincipal = document.getElementById("vistaPrincipal");
    const completado = estadoGlobal.modulosCompletados.includes(modulo.id);
    
    // Procesar contenido para obtener secciones
    const contenidoHTML = obtenerContenidoModulo(modulo.id);
    procesarContenidoInteractivo(contenidoHTML, modulo.id);
    
    // Solo resetear sección si NO venimos de una búsqueda
    const moduloAnterior = vistaPrincipal.dataset.moduloId;
    if (moduloAnterior && moduloAnterior != modulo.id && !navegandoDesdeBusqueda) {
        estadoGlobal.seccionActual = 0;
    }
    
    // Si venimos de búsqueda, forzar la sección destino
    if (navegandoDesdeBusqueda) {
        estadoGlobal.seccionActual = seccionBusquedaDestino;
    }
    
    vistaPrincipal.dataset.moduloId = modulo.id;

    // Siempre iniciar en la pestaña de teoría al cambiar de módulo
    let pestanaActiva = 'teoria';
    
    // Obtener notas del módulo (ahora solo HTML)
    const contenidoNotas = estadoGlobal.notasModulos[modulo.id] || "";

    vistaPrincipal.innerHTML = `
        <div class="encabezado-modulo">
            <div class="info-modulo">
                <span class="numero-titulo">Módulo ${modulo.numero} de ${MODULOS.filter(m => m.id !== 0).length}</span>
                <h2>${modulo.icono} ${modulo.titulo}</h2>
            </div>
            ${completado ? `
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <div class="badge-completado">
                        <span class="icono-completado">✓</span>
                        <span class="texto-completado">Completado</span>
                    </div>
                    ${MODULOS.find(m => m.id === modulo.id + 1) ? `
                        <button class="boton-siguiente-modulo" onclick="avanzarSiguienteModulo()" title="Avanzar al siguiente módulo">
                            Siguiente Módulo →
                        </button>
                    ` : ''}
                </div>
            ` : ''}
        </div>

        <!-- Pestañas de navegación -->
        <div class="pestanas-modulo">
            <button class="pestana activa" data-pestana="teoria" onclick="cambiarPestana('teoria', ${modulo.id})">
                📚 Teoría
            </button>
            <button class="pestana" data-pestana="actividad" onclick="cambiarPestana('actividad', ${modulo.id})">
                🎯 Evaluación
            </button>
            <button class="pestana" data-pestana="notas" onclick="cambiarPestana('notas', ${modulo.id})">
                📝 Mis Notas
            </button>
        </div>

        <!-- Contenido de teoría -->
        <div id="contenido-teoria" class="contenido-pestana activo">
            <div class="seccion-modulo">
                <div class="contenido-seccion">
                    ${procesarContenidoInteractivo(obtenerContenidoModulo(modulo.id), modulo.id) || `<p class="placeholder-texto">Contenido teórico en desarrollo para el módulo "${modulo.titulo}".</p>`}
                </div>
            </div>
        </div>

        <!-- Contenido de actividad -->
        <div id="contenido-actividad" class="contenido-pestana">
            <div class="seccion-modulo">
                <h3 class="titulo-seccion">🎯 Evaluación</h3>
                <div class="contenido-seccion">
                    ${modulo.sinEvaluacion ? `
                        <div class="nota-info" style="padding: 2rem; text-align: center;">
                            <p style="font-size: 1.2em; margin: 0;">
                                ℹ️ <strong>Este módulo no tiene evaluación</strong>
                    </p>
                            <p style="margin-top: 1rem; font-size: 1em;">
                                Es solo una introducción al curso. Continúa a la Unidad I para comenzar con el contenido teórico.
                        </p>
                    </div>
                    ` : `
                        <div id="contenedor-evaluacion-${modulo.id}">
                            ${renderizarEvaluacion(modulo.id)}
                        </div>
                    `}
                </div>
            </div>
        </div>

        <!-- Contenido de notas -->
        <div id="contenido-notas" class="contenido-pestana">
            <div class="seccion-modulo seccion-notas">
                <h3 class="titulo-seccion">📝 Mis Notas de Clase</h3>
                <div class="contenido-seccion">
                    <div class="instrucciones-editor">
                        <p>💡 <strong>Tip:</strong> Puedes escribir texto, pegar imágenes (Ctrl+V / Cmd+V) y arrastrar archivos. ¡Como en Word!</p>
                    </div>
                    
                    <div class="barra-herramientas-editor">
                        <button class="boton-herramienta" onclick="formatearTexto('bold')" title="Negrita (Ctrl+B)">
                            <strong>B</strong>
                        </button>
                        <button class="boton-herramienta" onclick="formatearTexto('italic')" title="Cursiva (Ctrl+I)">
                            <em>I</em>
                        </button>
                        <button class="boton-herramienta" onclick="formatearTexto('underline')" title="Subrayado (Ctrl+U)">
                            <u>U</u>
                        </button>
                        <button class="boton-herramienta" onclick="formatearTexto('strikeThrough')" title="Tachado">
                            <s>S</s>
                        </button>
                        <div class="separador-herramientas"></div>
                        <button class="boton-herramienta" onclick="formatearTexto('justifyLeft')" title="Alinear a la izquierda">
                            ⬅️
                        </button>
                        <button class="boton-herramienta" onclick="formatearTexto('justifyCenter')" title="Centrar">
                            ↔️
                        </button>
                        <button class="boton-herramienta" onclick="formatearTexto('justifyRight')" title="Alinear a la derecha">
                            ➡️
                        </button>
                        <div class="separador-herramientas"></div>
                        <button class="boton-herramienta" onclick="formatearTexto('insertUnorderedList')" title="Lista con viñetas">
                            • Lista
                        </button>
                        <button class="boton-herramienta" onclick="formatearTexto('insertOrderedList')" title="Lista numerada">
                            1. Lista
                        </button>
                        <div class="separador-herramientas"></div>
                        <button class="boton-herramienta boton-peligro" onclick="mostrarModalLimpiar(${modulo.id})" title="Borrar todo">
                            🗑️ Limpiar
                        </button>
                    </div>
                    
                    <div 
                        id="editor-notas-${modulo.id}" 
                        class="editor-rich-text" 
                        contenteditable="true"
                        data-modulo-id="${modulo.id}"
                        data-placeholder="Escribe tus notas aquí... 

Puedes:
• Escribir texto normal
• Pegar imágenes (Ctrl+V o Cmd+V)
• Arrastrar y soltar archivos
• Dar formato con tu teclado

¡Todo se guarda automáticamente!"
                    ></div>
                </div>
            </div>
        </div>

    `;
    
    // Inicializar componentes después de regenerar el HTML
    setTimeout(() => {
        // Siempre mostrar la pestaña de teoría al cambiar de módulo
        inicializarEditorNotas(modulo.id, contenidoNotas);
        actualizarSidebar(); // Actualizar sidebar para mostrar secciones
    }, 100);
}

/**
 * Completa un módulo y desbloquea su insignia
 * 
 * NOTA PARA IMPLEMENTACIÓN FUTURA:
 * Esta función debería ser llamada automáticamente cuando el estudiante
 * apruebe la evaluación final del módulo. 
 * 
 * Para implementar esto:
 * 1. Crear función verificarEvaluacion(idModulo, respuestas)
 * 2. Si la calificación >= 70%, llamar a completarModulo(idModulo)
 * 3. Eliminar el botón manual "Completar" del encabezado
 * 
 * Ejemplo:
 * if (calificacion >= 70) {
 *     completarModulo(idModulo);
 *     mostrarNotificacion("🎉 ¡Módulo completado con " + calificacion + "%!");
 * }
 */
function completarModulo(idModulo) {
    if (estadoGlobal.modulosCompletados.includes(idModulo)) {
        return;
    }
    
    // Verificar que todas las secciones estén completadas
    const seccionesCompletadas = estadoGlobal.seccionesCompletadas[idModulo] || [];
    const todasCompletadas = seccionesCompletadas.length === seccionesModuloActual.length && seccionesModuloActual.length > 0;
    
    if (!todasCompletadas && seccionesModuloActual.length > 0) {
        mostrarNotificacion('⚠️ Debes completar todas las secciones antes de marcar el módulo como completado.', 3000);
        return;
    }

    estadoGlobal.modulosCompletados.push(idModulo);
    
    // Actualizar el estado del módulo en el array MODULOS
    const modulo = MODULOS.find(m => m.id === idModulo);
    if (modulo) {
        modulo.estado = "completado";
        
        // Desbloquear insignia correspondiente
        if (!estadoGlobal.insigniasDesbloqueadas.includes(modulo.insignia.nombre)) {
            estadoGlobal.insigniasDesbloqueadas.push(modulo.insignia.nombre);
            mostrarAnimacionDesbloqueo(modulo);
        }
    }

    // Verificar si completó todas las unidades (excluir módulo 0 de bienvenida)
    const unidadesConInsignia = MODULOS.filter(m => m.insignia !== null).length;
    const unidadesCompletadas = estadoGlobal.modulosCompletados.filter(id => id !== 0).length;
    
    if (unidadesCompletadas === unidadesConInsignia) {
        if (!estadoGlobal.insigniasDesbloqueadas.includes(INSIGNIA_SECRETA.nombre)) {
            estadoGlobal.insigniasDesbloqueadas.push(INSIGNIA_SECRETA.nombre);
            mostrarAnimacionInsigniaSecreta();
        }
    }

    guardarEstado();
    actualizarUI();
    
    // Mostrar opción de avanzar al siguiente módulo
    const siguienteModulo = MODULOS.find(m => m.id === idModulo + 1);
    if (siguienteModulo) {
        setTimeout(() => {
            mostrarNotificacion(`🎉 ¡Módulo completado! ¿Deseas avanzar al siguiente módulo?`, 4000);
            // Agregar botón para avanzar (se puede hacer con un modal o directamente)
        }, 1000);
    }
}

function avanzarSiguienteModulo() {
    const siguienteModulo = MODULOS.find(m => m.id === estadoGlobal.moduloActual + 1);
    if (siguienteModulo) {
        estadoGlobal.moduloActual = siguienteModulo.id;
        estadoGlobal.seccionActual = 0;
        guardarEstado();
        
        // Mostrar la vista principal (no dashboard)
        document.getElementById("vistaDashboard").classList.add("oculta");
        document.getElementById("vistaLogros").classList.add("oculta");
        document.getElementById("vistaPrincipal").classList.remove("oculta");
        
        // Actualizar todo el UI incluyendo sidebar
        actualizarUI();
        
        mostrarNotificacion(`📚 Avanzaste al módulo ${siguienteModulo.numero}: ${siguienteModulo.titulo}`);
    } else {
        mostrarNotificacion('🎉 ¡Has completado todos los módulos!');
    }
}


// ===== ANIMACIONES DE DESBLOQUEO =====

function mostrarAnimacionDesbloqueo(modulo) {
    const vistaPrincipal = document.getElementById("vistaPrincipal");
    const botonCompletado = vistaPrincipal.querySelector(".boton-completar");
    
    if (botonCompletado) {
        botonCompletado.textContent = "🎉 ¡Insignia Desbloqueada!";
        botonCompletado.disabled = true;
        
        // Crear confetti
        generarConfetti();
        
        // Mostrar notificación
        mostrarNotificacion(`¡Ganaste la insignia: "${modulo.insignia.nombre}" ${modulo.insignia.emoji}`);
    }
}

function mostrarAnimacionInsigniaSecreta() {
    generarConfetti();
    mostrarNotificacion(`¡🌌 INSIGNIA SECRETA DESBLOQUEADA! ¡Completaste todos los módulos!`);
}

function generarConfetti() {
    for (let i = 0; i < 30; i++) {
        const particula = document.createElement("div");
        particula.className = "particula-confetti";
        particula.style.left = Math.random() * 100 + "%";
        particula.style.top = Math.random() * 100 + "%";
        particula.textContent = ["🎉", "⭐", "🎊", "✨", "🏆"][Math.floor(Math.random() * 5)];
        particula.style.fontSize = Math.random() * 20 + 20 + "px";
        document.body.appendChild(particula);
        
        setTimeout(() => particula.remove(), 1000);
    }
}

function mostrarNotificacion(mensaje) {
    const div = document.createElement("div");
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
        font-weight: 600;
        max-width: 400px;
        animation: slideIn 0.4s ease;
        z-index: 99999;
    `;
    div.textContent = mensaje;
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.style.opacity = '0';
        div.style.transform = 'translateX(100%)';
        div.style.transition = 'all 0.3s ease';
        setTimeout(() => div.remove(), 300);
    }, 3500);
}

function mostrarNotificacionError(mensaje) {
    const div = document.createElement("div");
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
        font-weight: 600;
        max-width: 400px;
        animation: slideIn 0.4s ease;
        z-index: 99999;
    `;
    div.textContent = mensaje;
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.style.opacity = '0';
        div.style.transform = 'translateX(100%)';
        div.style.transition = 'all 0.3s ease';
        setTimeout(() => div.remove(), 300);
    }, 3500);
}

function mostrarNotificacionInfo(mensaje) {
    const div = document.createElement("div");
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #7c3aed, #6366f1);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
        font-weight: 600;
        max-width: 400px;
        animation: slideIn 0.4s ease;
        z-index: 99999;
    `;
    div.textContent = mensaje;
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.style.opacity = '0';
        div.style.transform = 'translateX(100%)';
        div.style.transition = 'all 0.3s ease';
        setTimeout(() => div.remove(), 300);
    }, 2500);
}

// Modal de confirmación personalizado (reemplaza confirm())
function mostrarModalConfirmacion(mensaje, onConfirm) {
    const overlay = document.createElement('div');
    overlay.id = 'modalConfirmacionOverlay';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.2s ease;
    `;
    
    overlay.innerHTML = `
        <div style="
            background: white;
            border-radius: 16px;
            padding: 2rem;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        ">
            <p style="font-size: 1.1rem; color: #374151; margin-bottom: 1.5rem;">${mensaje}</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="cerrarModalConfirmacion()" style="
                    padding: 0.75rem 1.5rem;
                    border: 2px solid #e5e7eb;
                    background: white;
                    color: #374151;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                ">Cancelar</button>
                <button onclick="confirmarAccion()" style="
                    padding: 0.75rem 1.5rem;
                    border: none;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                ">Eliminar</button>
            </div>
        </div>
    `;
    
    // Guardar callback
    window._confirmCallback = onConfirm;
    document.body.appendChild(overlay);
}

function cerrarModalConfirmacion() {
    const overlay = document.getElementById('modalConfirmacionOverlay');
    if (overlay) overlay.remove();
    window._confirmCallback = null;
}

function confirmarAccion() {
    if (window._confirmCallback) {
        window._confirmCallback();
    }
    cerrarModalConfirmacion();
}

// ===== ACTUALIZAR VISTA DE LOGROS =====

function actualizarVistaLogros() {
    // Total de insignias: 5 unidades + 1 secreta (excluir módulo 0)
    const totalInsignias = MODULOS.filter(m => m.insignia !== null).length + 1;
    const porcentajeLogros = Math.round((estadoGlobal.insigniasDesbloqueadas.length / totalInsignias) * 100);
    const barraLogros = document.getElementById("barraLogros");
    if (barraLogros) {
        barraLogros.style.width = porcentajeLogros + "%";
    }
    document.getElementById("porcentajeLogros").textContent = porcentajeLogros;

    // Generar rejilla de insignias
    const rejilla = document.getElementById("rejillaInsignias");
    if (!rejilla) return;
    
    rejilla.innerHTML = "";

    // Insignias de módulos (solo los que tienen insignia - excluir módulo 0)
    MODULOS.filter(m => m.insignia !== null).forEach(modulo => {
        const desbloqueada = estadoGlobal.insigniasDesbloqueadas.includes(modulo.insignia.nombre);
        const div = crearElementoInsignia(modulo.insignia, desbloqueada);
        rejilla.appendChild(div);
    });

    // Insignia secreta
    const desbloqueada = estadoGlobal.insigniasDesbloqueadas.includes(INSIGNIA_SECRETA.nombre);
    const divSecreto = crearElementoInsignia(INSIGNIA_SECRETA, desbloqueada, true);
    rejilla.appendChild(divSecreto);
}

function crearElementoInsignia(insignia, desbloqueada, esSecreta = false) {
    const div = document.createElement("div");
    div.className = `insignia ${desbloqueada ? "desbloqueada" : "bloqueada"}`;

    const nombreBtn = insignia.nombre === "?" ? "?" : insignia.nombre;
    const descripcionTxt = esSecreta && !desbloqueada 
        ? "¿Podés descubrir cómo desbloquearla?"
        : insignia.descripcion;

    div.innerHTML = `
        <div class="tooltip">${insignia.descripcion}</div>
        <span class="icono-insignia">${insignia.emoji}</span>
        <div class="nombre-insignia">${nombreBtn}</div>
        <div class="descripcion-insignia">${descripcionTxt}</div>
        ${!desbloqueada ? `<span class="etiqueta-bloqueada">🔒 Bloqueada</span>` : ''}
        ${esSecreta && desbloqueada ? `<span class="etiqueta-secreta">⭐ SECRETA</span>` : ''}
    `;

    return div;
}

// ===== NAVEGACIÓN ENTRE VISTAS =====

// CHANGE: Added dashboard view navigation
function mostrarVistaDashboard() {
    // Quitar selección del sidebar cuando estamos en dashboard
    estadoGlobal.moduloActual = null;
    
    document.getElementById("vistaDashboard").classList.remove("oculta");
    document.getElementById("vistaPrincipal").classList.add("oculta");
    document.getElementById("vistaLogros").classList.add("oculta");
    cerrarSidebar();
    actualizarDashboard();
    
    // Actualizar sidebar para quitar selección
    actualizarSidebar();
}

function mostrarVistaLogros() {
    document.getElementById("vistaPrincipal").classList.add("oculta");
    document.getElementById("vistaLogros").classList.remove("oculta");
    document.getElementById("vistaDashboard").classList.add("oculta");
    cerrarSidebar();
}

function mostrarVistaPrincipal() {
    document.getElementById("vistaLogros").classList.add("oculta");
    document.getElementById("vistaPrincipal").classList.remove("oculta");
    document.getElementById("vistaDashboard").classList.add("oculta");
    cerrarSidebar();
}

function cerrarSidebar() {
    document.getElementById("sidebar").classList.remove("abierto");
    document.getElementById("sidebarOverlay").classList.remove("activo");
}

// ===== SISTEMA DE NOTAS CON EDITOR RICO =====

function cambiarPestana(nombrePestana, moduloId) {
    // Actualizar pestañas activas
    document.querySelectorAll('.pestana').forEach(p => p.classList.remove('activa'));
    const pestana = document.querySelector(`.pestana[data-pestana="${nombrePestana}"]`);
    if (pestana) {
        pestana.classList.add('activa');
    }
    
    // Actualizar contenido activo
    document.querySelectorAll('.contenido-pestana').forEach(c => c.classList.remove('activo'));
    document.getElementById(`contenido-${nombrePestana}`).classList.add('activo');
}

function inicializarEditorNotas(moduloId, contenidoInicial) {
    const editor = document.getElementById(`editor-notas-${moduloId}`);
    const inputFile = document.getElementById(`input-imagen-${moduloId}`);
    
    if (!editor) return;
    
    // Cargar contenido existente
    editor.innerHTML = contenidoInicial || '';
    
    // Envolver imágenes existentes para hacerlas redimensionables
    envolverImagenesExistentes(editor, moduloId);
    
    // Evento de paste para capturar imágenes del portapapeles
    editor.addEventListener('paste', function(e) {
        const items = e.clipboardData.items;
        
        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = item.getAsFile();
                insertarImagenEnEditor(editor, file, moduloId);
            }
        }
    });
    
    // Drag and drop
    editor.addEventListener('dragover', function(e) {
        e.preventDefault();
        editor.style.borderColor = 'var(--color-primario)';
        editor.style.backgroundColor = 'rgba(124, 58, 237, 0.05)';
    });
    
    editor.addEventListener('dragleave', function(e) {
        editor.style.borderColor = '';
        editor.style.backgroundColor = '';
    });
    
    editor.addEventListener('drop', function(e) {
        e.preventDefault();
        editor.style.borderColor = '';
        editor.style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                insertarImagenEnEditor(editor, file, moduloId);
            }
        }
    });
    
    // Guardar automáticamente al escribir y reinicializar controles (undo/redo)
    let timeoutGuardado;
    let timeoutReinicializar;
    editor.addEventListener('input', function() {
        clearTimeout(timeoutGuardado);
        timeoutGuardado = setTimeout(() => {
            guardarEditorNotas(moduloId);
        }, 500); // Guardar 500ms después de dejar de escribir
        
        // Reinicializar controles de imágenes (para undo/redo)
        clearTimeout(timeoutReinicializar);
        timeoutReinicializar = setTimeout(() => {
            envolverImagenesExistentes(editor, moduloId);
        }, 100);
    });
    
    // Input de archivo
    inputFile.addEventListener('change', function(e) {
        const files = e.target.files;
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                insertarImagenEnEditor(editor, file, moduloId);
            }
        }
        inputFile.value = ''; // Limpiar input
    });
}

function insertarImagenEnEditor(editor, file, moduloId) {
    // Validar tamaño
    if (file.size > 2 * 1024 * 1024) {
        mostrarNotificacion("⚠️ Imagen muy grande. Máximo 2MB");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Comprimir imagen
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            const maxDimension = 1200;
            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = (height / width) * maxDimension;
                    width = maxDimension;
                } else {
                    width = (width / height) * maxDimension;
                    height = maxDimension;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            const imagenComprimida = canvas.toDataURL('image/jpeg', 0.7);
            
            // Crear wrapper redimensionable para la imagen
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'imagen-wrapper-redimensionable';
            imgWrapper.contentEditable = false;
            imgWrapper.style.width = '100%';
            imgWrapper.style.maxWidth = '800px';
            
            // Crear imagen
            const imgElement = document.createElement('img');
            imgElement.src = imagenComprimida;
            imgElement.className = 'imagen-en-editor';
            imgElement.draggable = false;
            
            // Crear controles de redimensionamiento con handles en las esquinas
            const controles = document.createElement('div');
            controles.className = 'controles-imagen';
            controles.innerHTML = `
                <div class="handle-resize handle-ne"></div>
                <div class="handle-resize handle-se"></div>
                <div class="handle-resize handle-sw"></div>
                <div class="handle-resize handle-nw"></div>
            `;
            
            // Hacer el wrapper seleccionable y eliminable con backspace/delete
            imgWrapper.setAttribute('tabindex', '0');
            imgWrapper.addEventListener('click', function(e) {
                e.stopPropagation();
                // Remover selección de otras imágenes
                document.querySelectorAll('.imagen-wrapper-redimensionable.seleccionada').forEach(w => {
                    w.classList.remove('seleccionada');
                });
                // Seleccionar esta imagen
                this.classList.add('seleccionada');
                this.focus();
            });
            
            imgWrapper.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    e.preventDefault();
                    this.remove();
                    guardarEditorNotas(moduloId);
                }
            });
            
            // Agregar funcionalidad de redimensionamiento por arrastre
            agregarRedimensionamientoArrastre(imgWrapper, controles, moduloId);
            
            // No agregar onclick para ampliar - ya no es necesario
            
            // Ensamblar
            imgWrapper.appendChild(imgElement);
            imgWrapper.appendChild(controles);
            
            // Insertar en la posición del cursor o al final
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(imgWrapper);
                
                // Agregar salto de línea después de la imagen
                const br = document.createElement('br');
                imgWrapper.parentNode.insertBefore(br, imgWrapper.nextSibling);
            } else {
                editor.appendChild(imgWrapper);
                editor.appendChild(document.createElement('br'));
            }
            
            // Guardar cambios
            guardarEditorNotas(moduloId);
            mostrarNotificacion("✅ Imagen insertada");
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function guardarEditorNotas(moduloId) {
    const editor = document.getElementById(`editor-notas-${moduloId}`);
    if (!editor) return;
    
    try {
        estadoGlobal.notasModulos[moduloId] = editor.innerHTML;
        guardarEstado();
    } catch (e) {
        mostrarNotificacion("❌ Error al guardar. localStorage lleno.");
    }
}

// Variable global para el módulo que se va a limpiar
let moduloALimpiar = null;

function mostrarModalLimpiar(moduloId) {
    moduloALimpiar = moduloId;
    document.getElementById("modalLimpiarNotas").classList.remove("oculta");
}

function cerrarModalLimpiar() {
    moduloALimpiar = null;
    document.getElementById("modalLimpiarNotas").classList.add("oculta");
}

function confirmarLimpiar() {
    if (moduloALimpiar === null) return;
    
    const editor = document.getElementById(`editor-notas-${moduloALimpiar}`);
    if (editor) {
        editor.innerHTML = '';
        estadoGlobal.notasModulos[moduloALimpiar] = '';
        guardarEstado();
    }
    
    cerrarModalLimpiar();
    mostrarNotificacion("✅ Notas borradas correctamente");
}

function formatearTexto(comando) {
    document.execCommand(comando, false, null);
}

// Envolver imágenes existentes con controles de redimensionamiento
function envolverImagenesExistentes(editor, moduloId) {
    // Buscar todas las imágenes en el editor
    const todasLasImagenes = editor.querySelectorAll('img');
    
    todasLasImagenes.forEach(img => {
        const wrapper = img.closest('.imagen-wrapper-redimensionable');
        
        // Caso 1: La imagen ya tiene un wrapper (cargado desde localStorage)
        if (wrapper) {
            // Eliminar controles antiguos y crear nuevos
            let controles = wrapper.querySelector('.controles-imagen');
            if (controles) {
                controles.remove();
            }
            
            // Crear nuevos controles con handles en las esquinas
            controles = document.createElement('div');
            controles.className = 'controles-imagen';
            controles.innerHTML = `
                <div class="handle-resize handle-ne"></div>
                <div class="handle-resize handle-se"></div>
                <div class="handle-resize handle-sw"></div>
                <div class="handle-resize handle-nw"></div>
            `;
            
            // Agregar al wrapper
            wrapper.appendChild(controles);
            
            // Hacer el wrapper seleccionable y eliminable con backspace/delete
            wrapper.setAttribute('tabindex', '0');
            
            // Remover listeners anteriores clonando el wrapper
            const nuevoWrapper = wrapper.cloneNode(true);
            wrapper.parentNode.replaceChild(nuevoWrapper, wrapper);
            
            // Re-obtener controles del nuevo wrapper
            const nuevosControles = nuevoWrapper.querySelector('.controles-imagen');
            
            nuevoWrapper.addEventListener('click', function(e) {
                e.stopPropagation();
                // Remover selección de otras imágenes
                document.querySelectorAll('.imagen-wrapper-redimensionable.seleccionada').forEach(w => {
                    w.classList.remove('seleccionada');
                });
                // Seleccionar esta imagen
                this.classList.add('seleccionada');
                this.focus();
            });
            
            nuevoWrapper.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    e.preventDefault();
                    this.remove();
                    guardarEditorNotas(moduloId);
                }
            });
            
            // Agregar funcionalidad de redimensionamiento por arrastre
            agregarRedimensionamientoArrastre(nuevoWrapper, nuevosControles, moduloId);
            
            return; // Ya procesada
        }
        
        // Caso 2: La imagen NO tiene wrapper - envolverla
        const imagenSrc = img.src;
        
        // Crear wrapper redimensionable
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'imagen-wrapper-redimensionable';
        imgWrapper.contentEditable = false;
        imgWrapper.style.width = '100%';
        imgWrapper.style.maxWidth = '800px';
        
        // Crear nueva imagen con clase correcta
        const nuevaImg = document.createElement('img');
        nuevaImg.src = imagenSrc;
        nuevaImg.className = 'imagen-en-editor';
        nuevaImg.draggable = false;
        
        // Crear controles de redimensionamiento con handles en las esquinas
        const controles = document.createElement('div');
        controles.className = 'controles-imagen';
        controles.innerHTML = `
            <div class="handle-resize handle-ne"></div>
            <div class="handle-resize handle-se"></div>
            <div class="handle-resize handle-sw"></div>
            <div class="handle-resize handle-nw"></div>
        `;
        
        // Hacer el wrapper seleccionable y eliminable con backspace/delete
        imgWrapper.setAttribute('tabindex', '0');
        imgWrapper.addEventListener('click', function(e) {
            e.stopPropagation();
            // Remover selección de otras imágenes
            document.querySelectorAll('.imagen-wrapper-redimensionable.seleccionada').forEach(w => {
                w.classList.remove('seleccionada');
            });
            // Seleccionar esta imagen
            this.classList.add('seleccionada');
            this.focus();
        });
        
        imgWrapper.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                e.preventDefault();
                this.remove();
                guardarEditorNotas(moduloId);
            }
        });
        
        // Agregar funcionalidad de redimensionamiento por arrastre
        agregarRedimensionamientoArrastre(imgWrapper, controles, moduloId);
        
        // Ya no necesitamos ampliar la imagen
        
        // Ensamblar
        imgWrapper.appendChild(nuevaImg);
        imgWrapper.appendChild(controles);
        
        // Reemplazar la imagen original con el wrapper
        img.parentNode.replaceChild(imgWrapper, img);
    });
}

// Función para agregar redimensionamiento por arrastre desde las esquinas
function agregarRedimensionamientoArrastre(wrapper, controles, moduloId) {
    const handles = controles.querySelectorAll('.handle-resize');
    
    handles.forEach(handle => {
        handle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = wrapper.offsetWidth;
            const startHeight = wrapper.offsetHeight;
            const handleClass = handle.className;
            const aspectRatio = startWidth / startHeight;
            
            // Cambiar cursor del editor
            const editor = wrapper.closest('.editor-rich-text');
            if (editor) {
                editor.style.userSelect = 'none';
            }
            
            function onMouseMove(e) {
                e.preventDefault();
                
                let newWidth = startWidth;
                let deltaX = 0;
                
                // Calcular cambio según la esquina desde la que se arrastra
                if (handleClass.includes('handle-ne') || handleClass.includes('handle-se')) {
                    // Esquinas derechas
                    deltaX = e.clientX - startX;
                    newWidth = startWidth + deltaX;
                } else if (handleClass.includes('handle-nw') || handleClass.includes('handle-sw')) {
                    // Esquinas izquierdas
                    deltaX = startX - e.clientX;
                    newWidth = startWidth + deltaX;
                }
                
                // Limitar tamaño mínimo y máximo
                const editorWidth = editor ? editor.offsetWidth : 800;
                newWidth = Math.max(100, Math.min(newWidth, editorWidth));
                
                // Aplicar nuevo tamaño
                wrapper.style.width = newWidth + 'px';
                wrapper.style.maxWidth = 'none'; // Permitir tamaño personalizado
            }
            
            function onMouseUp(e) {
                e.preventDefault();
                
                // Restaurar estado del editor
                if (editor) {
                    editor.style.userSelect = '';
                }
                
                // Guardar cambios
                guardarEditorNotas(moduloId);
                
                // Remover listeners
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
}

function ampliarImagenModal(src) {
    const modal = document.createElement('div');
    modal.className = 'modal-imagen-ampliada';
    modal.innerHTML = `
        <div class="contenedor-imagen-ampliada">
            <button class="boton-cerrar-imagen" onclick="this.parentElement.parentElement.remove()">×</button>
            <img src="${src}" alt="Imagen ampliada" class="imagen-ampliada"/>
        </div>
    `;
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
    document.body.appendChild(modal);
}

// ===== MODO NOCHE =====

function alternarModoNoche() {
    estadoGlobal.modoNoche = !estadoGlobal.modoNoche;
    document.body.classList.toggle("modo-noche");
    
    const botonNavbar = document.getElementById("botonTemaNavbar");
    botonNavbar.textContent = estadoGlobal.modoNoche ? "☀️" : "🌙";
    botonNavbar.title = estadoGlobal.modoNoche ? "Modo Día" : "Modo Noche";
    
    guardarEstado();
}

// ===== SISTEMA DE EVALUACIÓN - ESCAPE ROOM =====

// Estado de la evaluación actual
let estadoEvaluacion = {
    moduloId: null,
    habitacionActual: 0,
    respuestasHabitacion: {},
    correctasTotales: 0,
    totalPreguntas: 0,
    verificado: false,
    historialRespuestas: [] // Para guardar todas las respuestas de todas las habitaciones
};

// Obtener mejor puntaje guardado
function obtenerMejorPuntaje(moduloId) {
    const mejores = JSON.parse(localStorage.getItem('mejoresPuntajes') || '{}');
    return mejores[moduloId] || null;
}

// Guardar mejor puntaje
function guardarMejorPuntaje(moduloId, porcentaje, correctas, total) {
    const mejores = JSON.parse(localStorage.getItem('mejoresPuntajes') || '{}');
    const actual = mejores[moduloId];
    
    if (!actual || porcentaje > actual.porcentaje) {
        mejores[moduloId] = { porcentaje, correctas, total, fecha: new Date().toLocaleDateString() };
        localStorage.setItem('mejoresPuntajes', JSON.stringify(mejores));
    }
}

function renderizarEvaluacion(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    
    if (!evaluacion || (!evaluacion.habitaciones && !evaluacion.letras && !evaluacion.preguntas && !evaluacion.rondas && !evaluacion.casos)) {
        return `
            <div class="evaluacion-placeholder">
                <div class="icono-placeholder">🚧</div>
                <h3>Evaluación en Desarrollo</h3>
                <p>La evaluación gamificada para este módulo está siendo creada.</p>
                <p>¡Pronto estará disponible!</p>
            </div>
        `;
    }
    
    // Detectar tipo de evaluación
    if (evaluacion.tipo === 'pasapalabra') {
        return renderizarPasapalabra(moduloId, evaluacion);
    }
    
    if (evaluacion.tipo === 'quiz-tiempo') {
        return renderizarQuizTiempo(moduloId, evaluacion);
    }
    
    if (evaluacion.tipo === 'conectar') {
        return renderizarConectar(moduloId, evaluacion);
    }
    
    if (evaluacion.tipo === 'casos-practicos') {
        return renderizarCasosPracticos(moduloId);
    }
    
    const totalPreguntas = evaluacion.habitaciones.reduce((acc, h) => acc + h.preguntas.length, 0);
    
    // Resetear estado
    estadoEvaluacion = {
        moduloId: moduloId,
        habitacionActual: 0,
        respuestasHabitacion: {},
        correctasTotales: 0,
        totalPreguntas: totalPreguntas,
        verificado: false,
        historialRespuestas: []
    };
    
    const mejorPuntaje = obtenerMejorPuntaje(moduloId);
    
    return `
        <div class="escape-room-container" id="escape-room-${moduloId}">
            <div class="escape-header">
                <div class="escape-icono">🏰</div>
                <h2 class="escape-titulo">${evaluacion.titulo}</h2>
            </div>
            <p class="escape-descripcion">${evaluacion.descripcion}</p>
            
            <div class="mejor-puntaje-box ${mejorPuntaje ? 'con-puntaje' : 'sin-puntaje'}">
                <span class="mejor-puntaje-icono">${mejorPuntaje ? '🏆' : '🎯'}</span>
                <div class="mejor-puntaje-info">
                    ${mejorPuntaje ? `
                        <span class="mejor-puntaje-label">Tu mejor intento</span>
                        <span class="mejor-puntaje-valor">${mejorPuntaje.porcentaje}%</span>
                        <span class="mejor-puntaje-detalle">(${mejorPuntaje.correctas}/${mejorPuntaje.total} correctas)</span>
                    ` : `
                        <span class="mejor-puntaje-label">Tu mejor intento</span>
                        <span class="mejor-puntaje-valor sin-intento">Sin intentos</span>
                        <span class="mejor-puntaje-detalle">¡Demuestra lo que sabes!</span>
                    `}
                </div>
            </div>
            
            <div class="escape-info-grid">
                <div class="escape-info-item">
                    <span class="info-numero">${evaluacion.habitaciones.length}</span>
                    <span class="info-label">Habitaciones</span>
                </div>
                <div class="escape-info-item">
                    <span class="info-numero">${totalPreguntas}</span>
                    <span class="info-label">Preguntas</span>
                </div>
                <div class="escape-info-item">
                    <span class="info-numero">${evaluacion.aprobacion}%</span>
                    <span class="info-label">Para Aprobar</span>
                </div>
            </div>
            
            <div class="escape-habitaciones-preview">
                ${evaluacion.habitaciones.map((h, i) => `
                    <div class="habitacion-preview">
                        <span class="habitacion-numero">${i + 1}</span>
                        <span class="habitacion-nombre">${h.nombre}</span>
                    </div>
                `).join('')}
            </div>
            
            <button class="boton-iniciar-escape" onclick="iniciarEscapeRoom(${moduloId})">
                🚀 Iniciar Escape Room
            </button>
        </div>
    `;
}

function iniciarEscapeRoom(moduloId) {
    estadoEvaluacion.habitacionActual = 0;
    estadoEvaluacion.respuestasHabitacion = {};
    estadoEvaluacion.correctasTotales = 0;
    estadoEvaluacion.verificado = false;
    
    renderizarHabitacion(moduloId);
    
    // Scroll hacia arriba al iniciar
    const container = document.getElementById(`escape-room-${moduloId}`);
    if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let moduloIdParaSalir = null;

function salirEscapeRoom(moduloId) {
    moduloIdParaSalir = moduloId;
    actualizarModalSalir('Escape Room', '🏰');
    const modal = document.getElementById('modalSalirEscape');
    if (modal) {
        modal.classList.remove('oculta');
    }
}

function actualizarModalSalir(nombreEvaluacion, icono) {
    const modalTitulo = document.querySelector('#modalSalirEscape h2');
    const modalIcono = document.querySelector('#modalSalirEscape .icono-modal-salir');
    if (modalTitulo) {
        modalTitulo.textContent = `¿Salir de ${nombreEvaluacion}?`;
    }
    if (modalIcono) {
        modalIcono.textContent = icono;
    }
}

function confirmarSalirEscape() {
    const modal = document.getElementById('modalSalirEscape');
    if (modal) {
        modal.classList.add('oculta');
    }
    if (moduloIdParaSalir !== null) {
        // Detectar qué tipo de evaluación es y reiniciar apropiadamente
        const evaluacion = CONTENIDO_EVALUACION[moduloIdParaSalir];
        if (evaluacion) {
            if (evaluacion.tipo === 'pasapalabra') {
                reiniciarPasapalabra(moduloIdParaSalir);
            } else if (evaluacion.tipo === 'quiz-tiempo') {
                reiniciarQuizTiempo(moduloIdParaSalir);
            } else if (evaluacion.tipo === 'conectar') {
                reiniciarConectar(moduloIdParaSalir);
            } else if (evaluacion.tipo === 'casos-practicos') {
                reiniciarCasos(moduloIdParaSalir);
            } else {
                reiniciarEscapeRoom(moduloIdParaSalir);
            }
        }
        moduloIdParaSalir = null;
    }
}

function cancelarSalirEscape() {
    const modal = document.getElementById('modalSalirEscape');
    if (modal) {
        modal.classList.add('oculta');
    }
    moduloIdParaSalir = null;
}

function renderizarHabitacion(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const habitacion = evaluacion.habitaciones[estadoEvaluacion.habitacionActual];
    const container = document.getElementById(`escape-room-${moduloId}`);
    const progreso = (estadoEvaluacion.habitacionActual / evaluacion.habitaciones.length) * 100;
    
    estadoEvaluacion.respuestasHabitacion = {};
    estadoEvaluacion.verificado = false;
    
    container.innerHTML = `
        <div class="habitacion-escape">
            <!-- Header con progreso y salir -->
            <div class="habitacion-top-bar">
                <button class="boton-salir-escape" onclick="salirEscapeRoom(${moduloId})">
                    ← Salir
                </button>
                <div class="escape-progreso-texto">
                    🚪 Habitación ${estadoEvaluacion.habitacionActual + 1} de ${evaluacion.habitaciones.length}
                </div>
            </div>
            <div class="escape-progreso-bar">
                <div class="progreso-relleno" style="width: ${progreso}%"></div>
            </div>
            
            <!-- Narrativa de entrada -->
            <div class="narrativa-box">
                <div class="narrativa-icono">📜</div>
                <p class="narrativa-texto">${habitacion.narrativa_entrada}</p>
            </div>
            
            <!-- Header de habitación -->
            <div class="habitacion-header-game">
                <h3 class="habitacion-nombre-grande">${habitacion.nombre}</h3>
                <span class="habitacion-tema">${habitacion.tema}</span>
            </div>
            
            <!-- Preguntas de la habitación -->
            <div class="preguntas-habitacion">
                ${habitacion.preguntas.map((p, idx) => `
                    <div class="pregunta-card" id="pregunta-${idx}">
                        <div class="pregunta-header-card">
                            <span class="pregunta-badge">Acertijo ${idx + 1}</span>
                        </div>
                        <p class="pregunta-texto-card">${p.pregunta}</p>
                        <div class="opciones-grid">
                            ${p.opciones.map((op, opIdx) => `
                                <button class="opcion-card" id="opcion-${idx}-${opIdx}" 
                                        onclick="seleccionarOpcionHabitacion(${idx}, ${opIdx}, ${p.correcta})">
                                    <span class="opcion-letra-card">${String.fromCharCode(65 + opIdx)}</span>
                                    <span class="opcion-texto-card">${op}</span>
                                </button>
                            `).join('')}
                        </div>
                        <div class="resultado-pregunta oculto" id="resultado-${idx}">
                            <!-- Se muestra después de verificar -->
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Botón verificar -->
            <div class="acciones-habitacion">
                <button class="boton-verificar-escape" id="btn-verificar" onclick="verificarHabitacion(${moduloId})">
                    🔍 Verificar Respuestas
                </button>
            </div>
            
            <!-- Mensaje de éxito (oculto inicialmente) -->
            <div class="narrativa-exito oculto" id="narrativa-exito">
                <div class="narrativa-icono">✨</div>
                <p class="narrativa-texto">${habitacion.narrativa_exito}</p>
            </div>
        </div>
    `;
}

function seleccionarOpcionHabitacion(preguntaIdx, opcionIdx, correctaIdx) {
    if (estadoEvaluacion.verificado) return;
    
    // Guardar respuesta
    estadoEvaluacion.respuestasHabitacion[preguntaIdx] = {
        seleccionada: opcionIdx,
        correcta: correctaIdx
    };
    
    // Marcar visualmente
    const opciones = document.querySelectorAll(`[id^="opcion-${preguntaIdx}-"]`);
    opciones.forEach(op => op.classList.remove('seleccionada'));
    document.getElementById(`opcion-${preguntaIdx}-${opcionIdx}`).classList.add('seleccionada');
}

function verificarHabitacion(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const habitacion = evaluacion.habitaciones[estadoEvaluacion.habitacionActual];
    
    // Verificar que todas estén respondidas
    const totalPreguntas = habitacion.preguntas.length;
    const respondidas = Object.keys(estadoEvaluacion.respuestasHabitacion).length;
    
    if (respondidas < totalPreguntas) {
        mostrarNotificacion('⚠️ Debes responder todos los acertijos antes de verificar', 3000);
        return;
    }
    
    estadoEvaluacion.verificado = true;
    let correctasHabitacion = 0;
    
    // Mostrar resultados por pregunta y guardar en historial
    habitacion.preguntas.forEach((p, idx) => {
        const respuesta = estadoEvaluacion.respuestasHabitacion[idx];
        const esCorrecta = respuesta.seleccionada === respuesta.correcta;
        
        // Guardar en historial para el resumen final
        estadoEvaluacion.historialRespuestas.push({
            habitacion: estadoEvaluacion.habitacionActual,
            habitacionNombre: habitacion.nombre,
            pregunta: p.pregunta,
            opciones: p.opciones,
            seleccionada: respuesta.seleccionada,
            correcta: respuesta.correcta,
            esCorrecta: esCorrecta,
            explicacion: p.explicacion || ''
        });
        
        if (esCorrecta) {
            correctasHabitacion++;
            estadoEvaluacion.correctasTotales++;
        }
        
        // Marcar opciones
        const opciones = document.querySelectorAll(`[id^="opcion-${idx}-"]`);
        opciones.forEach((op, opIdx) => {
            op.disabled = true;
            if (opIdx === respuesta.correcta) {
                op.classList.add('correcta');
            } else if (opIdx === respuesta.seleccionada && !esCorrecta) {
                op.classList.add('incorrecta');
            }
        });
        
        // Mostrar resultado de la pregunta
        const resultadoEl = document.getElementById(`resultado-${idx}`);
        resultadoEl.classList.remove('oculto');
        resultadoEl.innerHTML = `
            <div class="resultado-inline ${esCorrecta ? 'resultado-correcto' : 'resultado-incorrecto'}">
                <span class="resultado-icon">${esCorrecta ? '✅' : '❌'}</span>
                <span class="resultado-text">${esCorrecta ? '¡Correcto!' : 'Incorrecto'}</span>
                <button class="btn-explicacion-mini" onclick="toggleExplicacion(${idx})">
                    💡 Ver por qué
                </button>
            </div>
            <div class="explicacion-inline oculto" id="explicacion-${idx}">
                <p class="explicacion-text">${p.explicacion}</p>
        </div>
        `;
    });
    
    // Mostrar narrativa de éxito
    document.getElementById('narrativa-exito').classList.remove('oculto');
    
    // Cambiar botón
    const btnVerificar = document.getElementById('btn-verificar');
    const esUltimaHabitacion = estadoEvaluacion.habitacionActual >= evaluacion.habitaciones.length - 1;
    
    if (esUltimaHabitacion) {
        btnVerificar.innerHTML = '🏆 Ver Resultados Finales';
        btnVerificar.onclick = () => mostrarResultadosFinales(moduloId);
    } else {
        btnVerificar.innerHTML = '🚪 Avanzar a la Siguiente Habitación →';
        btnVerificar.onclick = () => avanzarHabitacion(moduloId);
    }
    btnVerificar.classList.add('boton-avanzar');
}

function toggleExplicacion(preguntaIdx) {
    const explicacion = document.getElementById(`explicacion-${preguntaIdx}`);
    explicacion.classList.toggle('oculto');
}

function avanzarHabitacion(moduloId) {
    estadoEvaluacion.habitacionActual++;
    renderizarHabitacion(moduloId);
    
    // Scroll al inicio
    document.getElementById(`escape-room-${moduloId}`).scrollIntoView({ behavior: 'smooth' });
}

function mostrarResultadosFinales(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const porcentaje = Math.round((estadoEvaluacion.correctasTotales / estadoEvaluacion.totalPreguntas) * 100);
    const aprobado = porcentaje >= evaluacion.aprobacion;
    
    // Guardar el mejor puntaje
    guardarMejorPuntaje(moduloId, porcentaje, estadoEvaluacion.correctasTotales, estadoEvaluacion.totalPreguntas);
    
    const container = document.getElementById(`escape-room-${moduloId}`);
    
    // Si aprobó, marcar módulo como completado ANTES de renderizar
    if (aprobado) {
        if (!estadoGlobal.modulosCompletados.includes(moduloId)) {
            estadoGlobal.modulosCompletados.push(moduloId);
        }
        
        const modulo = MODULOS.find(m => m.id === moduloId);
        if (modulo && modulo.insignia && !estadoGlobal.insigniasDesbloqueadas.includes(modulo.insignia.nombre)) {
            estadoGlobal.insigniasDesbloqueadas.push(modulo.insignia.nombre);
        }
        
        guardarEstado();
        // Actualizar sidebar y vista de logros
        actualizarSidebar();
        actualizarVistaLogros();
        actualizarDashboard();
    }
    
    container.innerHTML = `
        <div class="resultado-final-escape ${aprobado ? 'escape-exitoso' : 'escape-fallido'}">
            <div class="resultado-header">
                <div class="resultado-icono-grande">${aprobado ? '🎉' : '😔'}</div>
                <h2 class="resultado-titulo-grande">
                    ${aprobado ? '¡ESCAPASTE DEL LABERINTO!' : 'No lograste escapar... aún'}
                </h2>
            </div>
            
            <div class="resultado-narrativa">
                <p>${aprobado 
                    ? 'La puerta final se abre de par en par. La luz del exterior te envuelve mientras la voz mecánica anuncia: "Has demostrado ser un verdadero conocedor de los sistemas. ¡Eres libre!"' 
                    : 'Las puertas permanecen cerradas. La voz mecánica susurra: "Aún no dominas los secretos de los sistemas. Pero puedes intentarlo de nuevo..."'
                }</p>
            </div>
            
            <div class="resultado-stats">
                <div class="stat-circulo ${aprobado ? 'stat-aprobado' : 'stat-desaprobado'}">
                    <span class="stat-porcentaje">${porcentaje}%</span>
                </div>
                <div class="stat-detalle">
                    <p class="stat-correctas">${estadoEvaluacion.correctasTotales} de ${estadoEvaluacion.totalPreguntas} respuestas correctas</p>
                    <p class="stat-estado ${aprobado ? 'estado-aprobado' : 'estado-desaprobado'}">
                        ${aprobado ? '✅ APROBADO' : '❌ DESAPROBADO'}
                    </p>
                    <p class="stat-minimo">Mínimo requerido: ${evaluacion.aprobacion}% (${Math.ceil(estadoEvaluacion.totalPreguntas * evaluacion.aprobacion / 100)} correctas)</p>
                </div>
            </div>
            
            <!-- Resumen detallado de respuestas -->
            <div class="resumen-detallado">
                <h3 class="resumen-titulo">📋 Resumen de Respuestas</h3>
                <div class="resumen-lista">
                    ${estadoEvaluacion.historialRespuestas.map((resp, i) => `
                        <div class="resumen-item ${resp.esCorrecta ? 'resumen-correcto' : 'resumen-incorrecto'}">
                            <div class="resumen-numero">${i + 1}</div>
                            <div class="resumen-contenido">
                                <p class="resumen-habitacion">🏠 ${resp.habitacionNombre}</p>
                                <p class="resumen-definicion">${resp.pregunta}</p>
                                <p class="resumen-respuesta">
                                    <strong>Correcta:</strong> ${resp.opciones[resp.correcta]}
                                </p>
                                ${!resp.esCorrecta ? `
                                    <p class="resumen-tu-respuesta">
                                        <strong>Tu respuesta:</strong> ${resp.opciones[resp.seleccionada]}
                                    </p>
                                ` : ''}
                                ${resp.explicacion ? `<p class="resumen-explicacion">💡 ${resp.explicacion}</p>` : ''}
                            </div>
                            <div class="resumen-estado">
                                ${resp.esCorrecta ? '✅' : '❌'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="resultado-acciones-final">
                ${aprobado ? `
                    <button class="boton-accion boton-continuar-modulo" onclick="cerrarEvaluacionYAvanzar()">
                        Continuar al siguiente módulo →
                    </button>
                ` : `
                    <button class="boton-accion boton-reintentar-escape" onclick="reiniciarEscapeRoom(${moduloId})">
                        🔄 Reintentar Escape Room
                    </button>
                    <button class="boton-accion boton-revisar-teoria" onclick="cambiarPestana('teoria', ${moduloId})">
                        📚 Revisar Teoría
                    </button>
                `}
            </div>
        </div>
    `;
    
    // Mostrar animación de desbloqueo si aprobó
    if (aprobado) {
        const modulo = MODULOS.find(m => m.id === moduloId);
        if (modulo && modulo.insignia) {
            setTimeout(() => mostrarAnimacionDesbloqueo(modulo), 500);
        }
    }
}

function cerrarEvaluacionYAvanzar() {
    avanzarSiguienteModulo();
}

function reiniciarEscapeRoom(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const totalPreguntas = evaluacion.habitaciones.reduce((acc, h) => acc + h.preguntas.length, 0);
    const mejorPuntaje = obtenerMejorPuntaje(moduloId);
    
    estadoEvaluacion = {
        moduloId: moduloId,
        habitacionActual: 0,
        respuestasHabitacion: {},
        correctasTotales: 0,
        totalPreguntas: totalPreguntas,
        verificado: false,
        historialRespuestas: []
    };
    
    // Reconstruir la intro del Escape Room
    const container = document.getElementById(`escape-room-${moduloId}`);
    container.innerHTML = `
        <div class="escape-header">
            <div class="escape-icono">🏰</div>
            <h2 class="escape-titulo">${evaluacion.titulo}</h2>
        </div>
        <p class="escape-descripcion">${evaluacion.descripcion}</p>
        
        <div class="mejor-puntaje-box ${mejorPuntaje ? 'con-puntaje' : 'sin-puntaje'}">
            <span class="mejor-puntaje-icono">${mejorPuntaje ? '🏆' : '🎯'}</span>
            <div class="mejor-puntaje-info">
                ${mejorPuntaje ? `
                    <span class="mejor-puntaje-label">Tu mejor intento</span>
                    <span class="mejor-puntaje-valor">${mejorPuntaje.porcentaje}%</span>
                    <span class="mejor-puntaje-detalle">(${mejorPuntaje.correctas}/${mejorPuntaje.total} correctas)</span>
                ` : `
                    <span class="mejor-puntaje-label">Tu mejor intento</span>
                    <span class="mejor-puntaje-valor sin-intento">Sin intentos</span>
                    <span class="mejor-puntaje-detalle">¡Demuestra lo que sabes!</span>
                `}
            </div>
        </div>
        
        <div class="escape-info-grid">
            <div class="escape-info-item">
                <span class="info-numero">${evaluacion.habitaciones.length}</span>
                <span class="info-label">Habitaciones</span>
            </div>
            <div class="escape-info-item">
                <span class="info-numero">${totalPreguntas}</span>
                <span class="info-label">Preguntas</span>
            </div>
            <div class="escape-info-item">
                <span class="info-numero">${evaluacion.aprobacion}%</span>
                <span class="info-label">Para Aprobar</span>
            </div>
        </div>
        
        <div class="escape-habitaciones-preview">
            ${evaluacion.habitaciones.map((h, i) => `
                <div class="habitacion-preview">
                    <span class="habitacion-numero">${i + 1}</span>
                    <span class="habitacion-nombre">${h.nombre}</span>
                </div>
            `).join('')}
        </div>
        
        <button class="boton-iniciar-escape" onclick="iniciarEscapeRoom(${moduloId})">
            🚀 Iniciar Escape Room
        </button>
    `;
}

// ===== PASAPALABRA - EVALUACIÓN UNIDAD II =====

let estadoPasapalabra = {
    moduloId: null,
    letraActual: 0,
    respuestas: {},
    correctas: 0,
    incorrectas: 0,
    pasadas: [],
    segundaVuelta: false,
    totalLetras: 0,
    tiempoRestante: 0,
    timerInterval: null
};

const TIEMPO_PASAPALABRA = 180; // 3 minutos en segundos

// ===== ESTADO DEL QUIZ POR TIEMPO =====
let estadoQuizTiempo = {
    moduloId: null,
    preguntaActual: 0,
    respuestas: [],
    correctas: 0,
    puntosTotales: 0,
    tiempoRestante: 0,
    timerInterval: null,
    totalPreguntas: 0,
    tiempoPorPregunta: 15
};

// ===== ESTADO DE CONECTAR CONCEPTOS =====
let estadoConectar = {
    moduloId: null,
    rondaActual: 0,
    seleccionIzquierda: null,
    paresConectados: [],
    paresCorrectos: 0,
    totalPares: 0,
    totalRondas: 0,
    resultadosRondas: []
};

// Tipos de preguntas del Pasapalabra
const TIPOS_PREGUNTA = {
    EMPIEZA: 'empieza',
    CONTIENE: 'contiene',
    COMPLETA: 'completa'
};

function obtenerTextoPregunta(letraData) {
    const tipo = letraData.tipo || TIPOS_PREGUNTA.EMPIEZA;
    const letra = letraData.letra;
    
    switch(tipo) {
        case TIPOS_PREGUNTA.CONTIENE:
            return `<span class="tipo-pregunta tipo-contiene">Contiene la "${letra}"</span>`;
        case TIPOS_PREGUNTA.COMPLETA:
            return `<span class="tipo-pregunta tipo-completa">Completa (empieza con "${letra}")</span>`;
        default:
            return `<span class="tipo-pregunta tipo-empieza">Empieza con "${letra}"</span>`;
    }
}

function renderizarPasapalabra(moduloId, evaluacion) {
    const mejorPuntaje = obtenerMejorPuntaje(moduloId);
    const totalLetras = evaluacion.letras.length;
    
    // Resetear estado
    estadoPasapalabra = {
        moduloId: moduloId,
        letraActual: 0,
        respuestas: {},
        correctas: 0,
        incorrectas: 0,
        pasadas: [],
        segundaVuelta: false,
        totalLetras: totalLetras
    };
    
    return `
        <div class="pasapalabra-container" id="pasapalabra-${moduloId}">
            <div class="pasapalabra-header">
                <div class="pasapalabra-icono">🔤</div>
                <h2 class="pasapalabra-titulo">${evaluacion.titulo}</h2>
            </div>
            <p class="pasapalabra-descripcion">${evaluacion.descripcion}</p>
            
            <div class="mejor-puntaje-box ${mejorPuntaje ? 'con-puntaje' : 'sin-puntaje'}">
                <span class="mejor-puntaje-icono">${mejorPuntaje ? '🏆' : '🎯'}</span>
                <div class="mejor-puntaje-info">
                    ${mejorPuntaje ? `
                        <span class="mejor-puntaje-label">Tu mejor intento</span>
                        <span class="mejor-puntaje-valor">${mejorPuntaje.porcentaje}%</span>
                        <span class="mejor-puntaje-detalle">(${mejorPuntaje.correctas}/${mejorPuntaje.total} correctas)</span>
                    ` : `
                        <span class="mejor-puntaje-label">Tu mejor intento</span>
                        <span class="mejor-puntaje-valor sin-intento">Sin intentos</span>
                        <span class="mejor-puntaje-detalle">¡Demuestra lo que sabes!</span>
                    `}
                </div>
            </div>
            
            <div class="pasapalabra-reglas">
                <h4>¿Cómo jugar?</h4>
                <ul>
                    <li>🔤 Cada letra tiene una definición</li>
                    <li>✅ Selecciona la respuesta correcta que empieza con esa letra</li>
                    <li>⏭️ Puedes "Pasapalabra" si no sabes y volver después</li>
                    <li>🔄 Las letras pasadas vuelven en una segunda ronda</li>
                </ul>
            </div>
            
            <div class="escape-info-grid">
                <div class="escape-info-item">
                    <span class="info-numero">${totalLetras}</span>
                    <span class="info-label">Letras</span>
                </div>
                <div class="escape-info-item">
                    <span class="info-numero">${Math.floor(TIEMPO_PASAPALABRA / 60)}:00</span>
                    <span class="info-label">Tiempo</span>
                </div>
                <div class="escape-info-item">
                    <span class="info-numero">${evaluacion.aprobacion}%</span>
                    <span class="info-label">Para Aprobar</span>
                </div>
            </div>
            
            <div class="pasapalabra-rosco-preview">
                ${evaluacion.letras.map(l => `
                    <span class="letra-preview">${l.letra}</span>
                `).join('')}
            </div>
            
            <button class="boton-iniciar-pasapalabra" onclick="iniciarPasapalabra(${moduloId})">
                🎮 Iniciar Pasapalabra
            </button>
        </div>
    `;
}

function iniciarPasapalabra(moduloId) {
    // Limpiar timer anterior si existe
    if (estadoPasapalabra.timerInterval) {
        clearInterval(estadoPasapalabra.timerInterval);
    }
    
    estadoPasapalabra.letraActual = 0;
    estadoPasapalabra.respuestas = {};
    estadoPasapalabra.correctas = 0;
    estadoPasapalabra.incorrectas = 0;
    estadoPasapalabra.pasadas = [];
    estadoPasapalabra.segundaVuelta = false;
    estadoPasapalabra.tiempoRestante = TIEMPO_PASAPALABRA;
    
    // Iniciar temporizador
    estadoPasapalabra.timerInterval = setInterval(() => {
        estadoPasapalabra.tiempoRestante--;
        actualizarTimerPasapalabra();
        
        if (estadoPasapalabra.tiempoRestante <= 0) {
            clearInterval(estadoPasapalabra.timerInterval);
            tiempoAgotadoPasapalabra(moduloId);
        }
    }, 1000);
    
    renderizarLetraPasapalabra(moduloId);
    
    // Scroll hacia arriba
    const container = document.getElementById(`pasapalabra-${moduloId}`);
    if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function actualizarTimerPasapalabra() {
    const timerEl = document.getElementById('timer-pasapalabra');
    if (timerEl) {
        const minutos = Math.floor(estadoPasapalabra.tiempoRestante / 60);
        const segundos = estadoPasapalabra.tiempoRestante % 60;
        timerEl.textContent = `${minutos}:${segundos.toString().padStart(2, '0')}`;
        
        // Cambiar color si queda poco tiempo
        if (estadoPasapalabra.tiempoRestante <= 30) {
            timerEl.classList.add('tiempo-critico');
        } else if (estadoPasapalabra.tiempoRestante <= 60) {
            timerEl.classList.add('tiempo-bajo');
        }
    }
}

function tiempoAgotadoPasapalabra(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    
    // Marcar letras no respondidas como incorrectas
    evaluacion.letras.forEach((letra, idx) => {
        if (!estadoPasapalabra.respuestas.hasOwnProperty(idx)) {
            estadoPasapalabra.respuestas[idx] = false;
            estadoPasapalabra.incorrectas++;
        }
    });
    
    mostrarResultadosPasapalabra(moduloId, true);
}

function renderizarLetraPasapalabra(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const letras = evaluacion.letras;
    
    // Encontrar la siguiente letra a mostrar
    let letraIndex = -1;
    
    if (estadoPasapalabra.segundaVuelta) {
        // En segunda vuelta, buscar en las pasadas que no hayan sido respondidas
        for (const idx of estadoPasapalabra.pasadas) {
            if (!estadoPasapalabra.respuestas.hasOwnProperty(idx)) {
                letraIndex = idx;
                break;
            }
        }
    } else {
        // Primera vuelta: buscar la primera letra no respondida y no pasada
        for (let i = 0; i < letras.length; i++) {
            if (!estadoPasapalabra.respuestas.hasOwnProperty(i) && !estadoPasapalabra.pasadas.includes(i)) {
                letraIndex = i;
                break;
            }
        }
        
        // Si no hay más letras en primera vuelta, iniciar segunda vuelta
        if (letraIndex === -1 && estadoPasapalabra.pasadas.length > 0) {
            estadoPasapalabra.segundaVuelta = true;
            for (const idx of estadoPasapalabra.pasadas) {
                if (!estadoPasapalabra.respuestas.hasOwnProperty(idx)) {
                    letraIndex = idx;
                    break;
                }
            }
        }
    }
    
    // Si no quedan letras, mostrar resultados
    if (letraIndex === -1) {
        clearInterval(estadoPasapalabra.timerInterval);
        mostrarResultadosPasapalabra(moduloId, false);
        return;
    }
    
    const letraData = { ...letras[letraIndex], originalIndex: letraIndex };
    const progreso = ((estadoPasapalabra.correctas + estadoPasapalabra.incorrectas) / estadoPasapalabra.totalLetras) * 100;
    const minutos = Math.floor(estadoPasapalabra.tiempoRestante / 60);
    const segundos = estadoPasapalabra.tiempoRestante % 60;
    const tiempoClase = estadoPasapalabra.tiempoRestante <= 30 ? 'tiempo-critico' : estadoPasapalabra.tiempoRestante <= 60 ? 'tiempo-bajo' : '';
    
    // Contar letras pasadas pendientes
    const pasadasPendientes = estadoPasapalabra.pasadas.filter(idx => !estadoPasapalabra.respuestas.hasOwnProperty(idx)).length;
    
    const container = document.getElementById(`pasapalabra-${moduloId}`);
    container.innerHTML = `
        <div class="pasapalabra-juego">
            <!-- Top bar -->
            <div class="pasapalabra-top-bar">
                <button class="boton-salir-pasapalabra" onclick="salirPasapalabra(${moduloId})">
                    ← Salir
                </button>
                <div class="timer-pasapalabra ${tiempoClase}" id="timer-pasapalabra">
                    ⏱️ ${minutos}:${segundos.toString().padStart(2, '0')}
                </div>
                <div class="pasapalabra-stats">
                    <span class="stat-correctas">✅ ${estadoPasapalabra.correctas}</span>
                    <span class="stat-incorrectas">❌ ${estadoPasapalabra.incorrectas}</span>
                    <span class="stat-pasadas">⏭️ ${pasadasPendientes}</span>
                </div>
            </div>
            
            <!-- Barra de progreso -->
            <div class="pasapalabra-progreso-bar">
                <div class="progreso-relleno" style="width: ${progreso}%"></div>
            </div>
            
            ${estadoPasapalabra.segundaVuelta ? `
                <div class="segunda-vuelta-aviso">
                    🔄 Segunda vuelta - Letras pasadas (${pasadasPendientes} restantes)
                </div>
            ` : ''}
            
            <!-- Rosco visual -->
            <div class="pasapalabra-rosco">
                ${evaluacion.letras.map((l, i) => {
                    let estado = 'pendiente';
                    const resp = estadoPasapalabra.respuestas[i];
                    if (resp && resp.correcta === true) estado = 'correcta';
                    else if (resp && resp.correcta === false) estado = 'incorrecta';
                    else if (estadoPasapalabra.pasadas.includes(i)) estado = 'pasada';
                    const esActual = letraIndex === i;
                    return `<span class="rosco-letra ${estado} ${esActual ? 'actual' : ''}">${l.letra}</span>`;
                }).join('')}
            </div>
            
            <!-- Pregunta actual -->
            <div class="pasapalabra-pregunta-card">
                <div class="letra-grande">${letraData.letra}</div>
                ${obtenerTextoPregunta(letraData)}
                <p class="definicion-pasapalabra">${letraData.definicion}</p>
                
                <div class="opciones-pasapalabra">
                    ${letraData.opciones.map((op, idx) => `
                        <button class="opcion-pasapalabra" onclick="responderPasapalabra(${moduloId}, ${letraData.originalIndex}, ${idx}, ${letraData.correcta})">
                            ${op}
                        </button>
                    `).join('')}
                </div>
                
                ${!estadoPasapalabra.segundaVuelta ? `
                    <button class="boton-pasapalabra-skip" onclick="pasarLetra(${moduloId}, ${letraData.originalIndex})">
                        ⏭️ Pasapalabra
                    </button>
                ` : `
                    <p class="aviso-segunda-vuelta">En la segunda vuelta debes responder</p>
                `}
            </div>
            
            <!-- Feedback (oculto inicialmente) -->
            <div class="pasapalabra-feedback oculto" id="feedback-pasapalabra">
            </div>
        </div>
    `;
}

function responderPasapalabra(moduloId, letraIndex, opcionSeleccionada, correcta) {
    const esCorrecta = opcionSeleccionada === correcta;
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const letraData = evaluacion.letras[letraIndex];
    
    // Registrar respuesta con detalles para el resumen
    estadoPasapalabra.respuestas[letraIndex] = {
        correcta: esCorrecta,
        seleccionada: opcionSeleccionada,
        correctaIndex: correcta
    };
    
    if (esCorrecta) {
        estadoPasapalabra.correctas++;
    } else {
        estadoPasapalabra.incorrectas++;
    }
    
    // Quitar de pasadas si estaba
    const idxPasada = estadoPasapalabra.pasadas.indexOf(letraIndex);
    if (idxPasada > -1) {
        estadoPasapalabra.pasadas.splice(idxPasada, 1);
    }
    
    // Marcar opciones visualmente
    const opciones = document.querySelectorAll('.opcion-pasapalabra');
    opciones.forEach((op, idx) => {
        op.disabled = true;
        if (idx === correcta) {
            op.classList.add('correcta');
        } else if (idx === opcionSeleccionada && !esCorrecta) {
            op.classList.add('incorrecta');
        }
    });
    
    // Ocultar botón pasapalabra si existe
    const btnSkip = document.querySelector('.boton-pasapalabra-skip');
    if (btnSkip) btnSkip.style.display = 'none';
    
    // Actualizar rosco
    const roscoLetras = document.querySelectorAll('.rosco-letra');
    roscoLetras[letraIndex].classList.remove('pendiente', 'pasada', 'actual');
    roscoLetras[letraIndex].classList.add(esCorrecta ? 'correcta' : 'incorrecta');
    
    // Mostrar feedback
    const feedbackEl = document.getElementById('feedback-pasapalabra');
    feedbackEl.classList.remove('oculto');
    
    if (esCorrecta) {
        feedbackEl.innerHTML = `
            <div class="feedback-content feedback-correcto feedback-rapido">
                <span class="feedback-icon">✅</span>
                <span class="feedback-text">¡Correcto!</span>
            </div>
        `;
        
        // Avanzar después de 600ms
        setTimeout(() => {
            siguienteLetraPasapalabra(moduloId);
        }, 600);
    } else {
        feedbackEl.innerHTML = `
            <div class="feedback-content feedback-incorrecto feedback-rapido">
                <span class="feedback-icon">❌</span>
                <span class="feedback-text">Incorrecto</span>
            </div>
            <div class="explicacion-pasapalabra-rapida">
                <p><strong>Correcta:</strong> ${letraData.opciones[correcta]}</p>
            </div>
        `;
        
        // Avanzar después de 1.5 segundos para leer la respuesta correcta
        setTimeout(() => {
            siguienteLetraPasapalabra(moduloId);
        }, 1500);
    }
}

function toggleExplicacionPasapalabra() {
    const explicacion = document.getElementById('explicacion-pasapalabra');
    explicacion.classList.toggle('oculto');
}

function pasarLetra(moduloId, letraIndex) {
    // Solo pasar en primera vuelta
    if (!estadoPasapalabra.segundaVuelta && !estadoPasapalabra.pasadas.includes(letraIndex)) {
        estadoPasapalabra.pasadas.push(letraIndex);
    }
    
    // Actualizar rosco visual
    const roscoLetras = document.querySelectorAll('.rosco-letra');
    roscoLetras[letraIndex].classList.remove('actual');
    roscoLetras[letraIndex].classList.add('pasada');
    
    siguienteLetraPasapalabra(moduloId);
}

function siguienteLetraPasapalabra(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const totalLetras = evaluacion.letras.length;
    
    // Contar letras respondidas
    const respondidas = Object.keys(estadoPasapalabra.respuestas).length;
    
    if (respondidas >= totalLetras) {
        // Todas respondidas
        mostrarResultadosPasapalabra(moduloId);
        return;
    }
    
    // Verificar si quedan letras en primera vuelta
    if (!estadoPasapalabra.segundaVuelta) {
        // Buscar siguiente letra no respondida ni pasada
        let siguienteEncontrada = false;
        for (let i = 0; i < totalLetras; i++) {
            if (!estadoPasapalabra.respuestas.hasOwnProperty(i) && !estadoPasapalabra.pasadas.includes(i)) {
                siguienteEncontrada = true;
                break;
            }
        }
        
        if (!siguienteEncontrada) {
            // Pasar a segunda vuelta si hay letras pasadas
            if (estadoPasapalabra.pasadas.length > 0) {
                estadoPasapalabra.segundaVuelta = true;
            } else {
                // No hay más letras
                mostrarResultadosPasapalabra(moduloId);
                return;
            }
        }
    }
    
    renderizarLetraPasapalabra(moduloId);
}

function mostrarResultadosPasapalabra(moduloId, tiempoAgotado = false) {
    // Limpiar timer
    if (estadoPasapalabra.timerInterval) {
        clearInterval(estadoPasapalabra.timerInterval);
        estadoPasapalabra.timerInterval = null;
    }
    
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const total = estadoPasapalabra.totalLetras;
    const correctas = estadoPasapalabra.correctas;
    const porcentaje = Math.round((correctas / total) * 100);
    const aprobado = porcentaje >= evaluacion.aprobacion;
    
    // Guardar mejor puntaje
    guardarMejorPuntaje(moduloId, porcentaje, correctas, total);
    
    // Marcar módulo como completado si aprobó
    if (aprobado) {
        if (!estadoGlobal.modulosCompletados.includes(moduloId)) {
            estadoGlobal.modulosCompletados.push(moduloId);
        }
        
        const modulo = MODULOS.find(m => m.id === moduloId);
        if (modulo && modulo.insignia && !estadoGlobal.insigniasDesbloqueadas.includes(modulo.insignia.nombre)) {
            estadoGlobal.insigniasDesbloqueadas.push(modulo.insignia.nombre);
        }
        
        guardarEstado();
        actualizarSidebar();
        actualizarVistaLogros();
        actualizarDashboard();
    }
    
    // Generar resumen detallado de respuestas
    const resumenHTML = evaluacion.letras.map((l, i) => {
        const respuesta = estadoPasapalabra.respuestas[i];
        const esCorrecta = respuesta && respuesta.correcta;
        const noRespondida = !respuesta;
        const tipoTexto = obtenerTextoPregunta(l);
        
        return `
            <div class="resumen-item ${esCorrecta ? 'resumen-correcto' : noRespondida ? 'resumen-no-respondida' : 'resumen-incorrecto'}">
                <div class="resumen-letra">${l.letra}</div>
                <div class="resumen-contenido">
                    <p class="resumen-definicion">${l.definicion}</p>
                    <p class="resumen-respuesta">
                        <strong>Correcta:</strong> ${l.opciones[l.correcta]}
                    </p>
                    ${!esCorrecta && !noRespondida ? `
                        <p class="resumen-tu-respuesta">
                            <strong>Tu respuesta:</strong> ${l.opciones[respuesta.seleccionada]}
                        </p>
                    ` : ''}
                    ${noRespondida ? `<p class="resumen-tu-respuesta"><strong>No respondida</strong> (tiempo agotado)</p>` : ''}
                    ${l.explicacion ? `<p class="resumen-explicacion">💡 ${l.explicacion}</p>` : ''}
                </div>
                <div class="resumen-estado">
                    ${esCorrecta ? '✅' : noRespondida ? '⏰' : '❌'}
                </div>
            </div>
        `;
    }).join('');
    
    const container = document.getElementById(`pasapalabra-${moduloId}`);
    container.innerHTML = `
        <div class="resultado-final-pasapalabra ${aprobado ? 'pasapalabra-exitoso' : 'pasapalabra-fallido'}">
            <div class="resultado-header">
                <div class="resultado-icono-grande">${aprobado ? '🏆' : '😔'}</div>
                <h2 class="resultado-titulo-grande">
                    ${aprobado ? '¡PASAPALABRA COMPLETADO!' : 'No lograste completar el rosco... aún'}
                </h2>
            </div>
            
            <div class="resultado-narrativa">
                <p>${tiempoAgotado 
                    ? '⏰ ¡Se acabó el tiempo! ' + (aprobado ? 'Pero aún así lograste aprobar. ¡Bien hecho!' : 'El rosco quedó incompleto.')
                    : (aprobado 
                        ? '¡Excelente! Has demostrado un gran dominio de los conceptos de Complejidad y Sistemas Abiertos.' 
                        : 'El rosco quedó incompleto, pero no te preocupes. Repasa los conceptos y vuelve a intentarlo.')
                }</p>
            </div>
            
            <div class="resultado-rosco-final">
                ${evaluacion.letras.map((l, i) => {
                    let estado = 'pendiente';
                    const resp = estadoPasapalabra.respuestas[i];
                    if (resp && resp.correcta) estado = 'correcta';
                    else if (resp && !resp.correcta) estado = 'incorrecta';
                    return `<span class="rosco-letra-final ${estado}">${l.letra}</span>`;
                }).join('')}
            </div>
            
            <div class="resultado-stats">
                <div class="stat-circulo ${aprobado ? 'stat-aprobado' : 'stat-desaprobado'}">
                    <span class="stat-porcentaje">${porcentaje}%</span>
                </div>
                <div class="stat-detalle">
                    <p class="stat-correctas">${correctas} de ${total} respuestas correctas</p>
                    <p class="stat-estado ${aprobado ? 'estado-aprobado' : 'estado-desaprobado'}">
                        ${aprobado ? '✅ APROBADO' : '❌ DESAPROBADO'}
                    </p>
                    <p class="stat-minimo">Mínimo requerido: ${evaluacion.aprobacion}%</p>
                </div>
            </div>
            
            <!-- Resumen detallado -->
            <div class="resumen-detallado">
                <h3 class="resumen-titulo">📋 Resumen de Respuestas</h3>
                <div class="resumen-lista">
                    ${resumenHTML}
                </div>
            </div>
            
            <div class="resultado-acciones-final">
                ${aprobado ? `
                    <button class="boton-accion boton-continuar-modulo" onclick="cerrarEvaluacionYAvanzar()">
                        Continuar al siguiente módulo →
                    </button>
                ` : `
                    <button class="boton-accion boton-reintentar-pasapalabra" onclick="reiniciarPasapalabra(${moduloId})">
                        🔄 Reintentar Pasapalabra
                    </button>
                    <button class="boton-accion boton-revisar-teoria" onclick="cambiarPestana('teoria', ${moduloId})">
                        📚 Revisar Teoría
                    </button>
                `}
            </div>
        </div>
    `;
    
    // Mostrar animación de desbloqueo si aprobó
    if (aprobado) {
        const modulo = MODULOS.find(m => m.id === moduloId);
        if (modulo && modulo.insignia) {
            setTimeout(() => mostrarAnimacionDesbloqueo(modulo), 500);
        }
    }
}

function salirPasapalabra(moduloId) {
    moduloIdParaSalir = moduloId;
    actualizarModalSalir('Pasapalabra', '🔤');
    const modal = document.getElementById('modalSalirEscape');
    if (modal) {
        modal.classList.remove('oculta');
    }
}

function reiniciarPasapalabra(moduloId) {
    // Limpiar timer anterior
    if (estadoPasapalabra.timerInterval) {
        clearInterval(estadoPasapalabra.timerInterval);
    }
    
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const mejorPuntaje = obtenerMejorPuntaje(moduloId);
    
    estadoPasapalabra = {
        moduloId: moduloId,
        letraActual: 0,
        respuestas: {},
        correctas: 0,
        incorrectas: 0,
        pasadas: [],
        segundaVuelta: false,
        totalLetras: evaluacion.letras.length,
        tiempoRestante: 0,
        timerInterval: null
    };
    
    const container = document.getElementById(`pasapalabra-${moduloId}`);
    container.innerHTML = `
        <div class="pasapalabra-header">
            <div class="pasapalabra-icono">🔤</div>
            <h2 class="pasapalabra-titulo">${evaluacion.titulo}</h2>
        </div>
        <p class="pasapalabra-descripcion">${evaluacion.descripcion}</p>
        
        <div class="mejor-puntaje-box ${mejorPuntaje ? 'con-puntaje' : 'sin-puntaje'}">
            <span class="mejor-puntaje-icono">${mejorPuntaje ? '🏆' : '🎯'}</span>
            <div class="mejor-puntaje-info">
                ${mejorPuntaje ? `
                    <span class="mejor-puntaje-label">Tu mejor intento</span>
                    <span class="mejor-puntaje-valor">${mejorPuntaje.porcentaje}%</span>
                    <span class="mejor-puntaje-detalle">(${mejorPuntaje.correctas}/${mejorPuntaje.total} correctas)</span>
                ` : `
                    <span class="mejor-puntaje-label">Tu mejor intento</span>
                    <span class="mejor-puntaje-valor sin-intento">Sin intentos</span>
                    <span class="mejor-puntaje-detalle">¡Demuestra lo que sabes!</span>
                `}
            </div>
        </div>
        
        <div class="pasapalabra-reglas">
            <h4>¿Cómo jugar?</h4>
            <ul>
                <li>🔤 Cada letra tiene una definición</li>
                <li>✅ Selecciona la respuesta correcta que empieza con esa letra</li>
                <li>⏭️ Puedes "Pasapalabra" si no sabes y volver después</li>
                <li>🔄 Las letras pasadas vuelven en una segunda ronda</li>
            </ul>
        </div>
        
        <div class="escape-info-grid">
            <div class="escape-info-item">
                <span class="info-numero">${evaluacion.letras.length}</span>
                <span class="info-label">Letras</span>
            </div>
            <div class="escape-info-item">
                <span class="info-numero">${Math.floor(TIEMPO_PASAPALABRA / 60)}:00</span>
                <span class="info-label">Tiempo</span>
            </div>
            <div class="escape-info-item">
                <span class="info-numero">${evaluacion.aprobacion}%</span>
                <span class="info-label">Para Aprobar</span>
            </div>
        </div>
        
        <div class="pasapalabra-rosco-preview">
            ${evaluacion.letras.map(l => `
                <span class="letra-preview">${l.letra}</span>
            `).join('')}
        </div>
        
        <button class="boton-iniciar-pasapalabra" onclick="iniciarPasapalabra(${moduloId})">
            🎮 Iniciar Pasapalabra
        </button>
    `;
}

// ===== QUIZ POR TIEMPO =====

function renderizarQuizTiempo(moduloId, evaluacion) {
    const mejorPuntaje = obtenerMejorPuntaje(moduloId);
    const totalPreguntas = evaluacion.preguntas.length;
    
    estadoQuizTiempo = {
        moduloId: moduloId,
        preguntaActual: 0,
        respuestas: [],
        correctas: 0,
        puntosTotales: 0,
        tiempoRestante: 0,
        timerInterval: null,
        totalPreguntas: totalPreguntas,
        tiempoPorPregunta: evaluacion.tiempoPorPregunta || 15
    };
    
    return `
        <div class="quiz-tiempo-container" id="quiz-tiempo-${moduloId}">
            <div class="quiz-tiempo-intro">
                <div class="quiz-tiempo-header">
                    <div class="quiz-tiempo-icono">⚡</div>
                    <h2 class="quiz-tiempo-titulo">${evaluacion.titulo}</h2>
                </div>
                <p class="quiz-tiempo-descripcion">${evaluacion.descripcion}</p>
                
                <div class="mejor-puntaje-box ${mejorPuntaje ? 'con-puntaje' : 'sin-puntaje'}">
                    <span class="mejor-puntaje-icono">${mejorPuntaje ? '🏆' : '🎯'}</span>
                    <div class="mejor-puntaje-info">
                        ${mejorPuntaje ? `
                            <span class="mejor-puntaje-label">Tu mejor intento</span>
                            <span class="mejor-puntaje-valor">${mejorPuntaje.porcentaje}%</span>
                            <span class="mejor-puntaje-detalle">(${mejorPuntaje.correctas}/${mejorPuntaje.total} correctas)</span>
                        ` : `
                            <span class="mejor-puntaje-label">Tu mejor intento</span>
                            <span class="mejor-puntaje-valor sin-intento">Sin intentos</span>
                            <span class="mejor-puntaje-detalle">¡Demuestra lo que sabes!</span>
                        `}
                    </div>
                </div>
                
                <div class="quiz-tiempo-reglas">
                    <h4>¿Cómo jugar?</h4>
                    <ul>
                        <li>⏱️ Tienes <strong>${evaluacion.tiempoPorPregunta} segundos</strong> por pregunta</li>
                        <li>⚡ Respuestas rápidas = más puntos</li>
                        <li>❌ Si no respondes a tiempo, se pasa automáticamente</li>
                        <li>🎯 Necesitas ${evaluacion.aprobacion}% para aprobar</li>
                    </ul>
                </div>
                
                <div class="escape-info-grid">
                    <div class="escape-info-item">
                        <span class="info-numero">${totalPreguntas}</span>
                        <span class="info-label">Preguntas</span>
                    </div>
                    <div class="escape-info-item">
                        <span class="info-numero">${evaluacion.tiempoPorPregunta}s</span>
                        <span class="info-label">Por pregunta</span>
                    </div>
                    <div class="escape-info-item">
                        <span class="info-numero">${evaluacion.aprobacion}%</span>
                        <span class="info-label">Para Aprobar</span>
                    </div>
                </div>
                
                <button class="boton-iniciar-quiz" onclick="iniciarQuizTiempo(${moduloId})">
                    ⚡ Iniciar Quiz Contrarreloj
                </button>
            </div>
        </div>
    `;
}

function iniciarQuizTiempo(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    
    estadoQuizTiempo = {
        moduloId: moduloId,
        preguntaActual: 0,
        respuestas: [],
        correctas: 0,
        puntosTotales: 0,
        tiempoRestante: evaluacion.tiempoPorPregunta,
        timerInterval: null,
        totalPreguntas: evaluacion.preguntas.length,
        tiempoPorPregunta: evaluacion.tiempoPorPregunta || 15
    };
    
    renderizarPreguntaQuiz(moduloId);
    
    // Scroll arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderizarPreguntaQuiz(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const pregunta = evaluacion.preguntas[estadoQuizTiempo.preguntaActual];
    const progreso = ((estadoQuizTiempo.preguntaActual) / estadoQuizTiempo.totalPreguntas) * 100;
    
    estadoQuizTiempo.tiempoRestante = estadoQuizTiempo.tiempoPorPregunta;
    
    const container = document.getElementById(`quiz-tiempo-${moduloId}`);
    container.innerHTML = `
        <div class="quiz-tiempo-juego">
            <div class="quiz-tiempo-top-bar">
                <button class="boton-salir-quiz" onclick="salirQuizTiempo(${moduloId})">
                    ← Salir
                </button>
                <div class="quiz-tiempo-timer" id="quiz-timer">
                    <div class="timer-circulo">
                        <span class="timer-numero">${estadoQuizTiempo.tiempoRestante}</span>
                    </div>
                </div>
                <div class="quiz-tiempo-stats">
                    <span class="stat-pregunta">${estadoQuizTiempo.preguntaActual + 1}/${estadoQuizTiempo.totalPreguntas}</span>
                    <span class="stat-correctas">✅ ${estadoQuizTiempo.correctas}</span>
                </div>
            </div>
            
            <div class="quiz-tiempo-progreso">
                <div class="progreso-relleno" style="width: ${progreso}%"></div>
            </div>
            
            <div class="quiz-tiempo-pregunta-card">
                <p class="quiz-pregunta-texto">${pregunta.pregunta}</p>
                
                <div class="quiz-tiempo-opciones">
                    ${pregunta.opciones.map((op, idx) => `
                        <button class="quiz-tiempo-opcion" onclick="responderQuizTiempo(${moduloId}, ${idx}, ${pregunta.correcta})" data-index="${idx}">
                            <span class="opcion-letra">${String.fromCharCode(65 + idx)}</span>
                            <span class="opcion-texto">${op}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div class="quiz-tiempo-feedback oculto" id="feedback-quiz">
            </div>
        </div>
    `;
    
    // Iniciar timer
    iniciarTimerPregunta(moduloId);
}

function iniciarTimerPregunta(moduloId) {
    // Limpiar timer anterior
    if (estadoQuizTiempo.timerInterval) {
        clearInterval(estadoQuizTiempo.timerInterval);
    }
    
    estadoQuizTiempo.timerInterval = setInterval(() => {
        estadoQuizTiempo.tiempoRestante--;
        
        const timerEl = document.getElementById('quiz-timer');
        if (timerEl) {
            const timerNumero = timerEl.querySelector('.timer-numero');
            const timerCirculo = timerEl.querySelector('.timer-circulo');
            
            timerNumero.textContent = estadoQuizTiempo.tiempoRestante;
            
            // Cambiar color según tiempo
            if (estadoQuizTiempo.tiempoRestante <= 5) {
                timerCirculo.classList.add('tiempo-critico');
            } else if (estadoQuizTiempo.tiempoRestante <= 10) {
                timerCirculo.classList.add('tiempo-bajo');
            }
        }
        
        if (estadoQuizTiempo.tiempoRestante <= 0) {
            clearInterval(estadoQuizTiempo.timerInterval);
            tiempoAgotadoQuiz(moduloId);
        }
    }, 1000);
}

function tiempoAgotadoQuiz(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const pregunta = evaluacion.preguntas[estadoQuizTiempo.preguntaActual];
    
    // Registrar como incorrecta
    estadoQuizTiempo.respuestas.push({
        pregunta: estadoQuizTiempo.preguntaActual,
        correcta: false,
        seleccionada: null,
        correctaIndex: pregunta.correcta,
        tiempoAgotado: true
    });
    
    // Deshabilitar opciones
    const opciones = document.querySelectorAll('.quiz-tiempo-opcion');
    opciones.forEach((op, idx) => {
        op.disabled = true;
        if (idx === pregunta.correcta) {
            op.classList.add('correcta');
        }
    });
    
    // Mostrar feedback
    const feedbackEl = document.getElementById('feedback-quiz');
    feedbackEl.classList.remove('oculto');
    feedbackEl.innerHTML = `
        <div class="feedback-content feedback-timeout">
            <span class="feedback-icon">⏰</span>
            <span class="feedback-text">¡Tiempo agotado!</span>
        </div>
        <div class="explicacion-quiz">
            <p><strong>Respuesta correcta:</strong> ${pregunta.opciones[pregunta.correcta]}</p>
        </div>
    `;
    
    // Avanzar después de 1.5 segundos
    setTimeout(() => {
        siguientePreguntaQuiz(moduloId);
    }, 1500);
}

function responderQuizTiempo(moduloId, seleccionada, correcta) {
    // Detener timer
    clearInterval(estadoQuizTiempo.timerInterval);
    
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const pregunta = evaluacion.preguntas[estadoQuizTiempo.preguntaActual];
    const esCorrecta = seleccionada === correcta;
    const tiempoUsado = estadoQuizTiempo.tiempoPorPregunta - estadoQuizTiempo.tiempoRestante;
    
    // Calcular puntos (más puntos por respuesta rápida)
    let puntos = 0;
    if (esCorrecta) {
        estadoQuizTiempo.correctas++;
        // Puntos base + bonus por velocidad
        puntos = 100 + Math.max(0, (estadoQuizTiempo.tiempoRestante * 10));
        estadoQuizTiempo.puntosTotales += puntos;
    }
    
    // Registrar respuesta
    estadoQuizTiempo.respuestas.push({
        pregunta: estadoQuizTiempo.preguntaActual,
        correcta: esCorrecta,
        seleccionada: seleccionada,
        correctaIndex: correcta,
        tiempoUsado: tiempoUsado,
        puntos: puntos
    });
    
    // Marcar opciones visualmente
    const opciones = document.querySelectorAll('.quiz-tiempo-opcion');
    opciones.forEach((op, idx) => {
        op.disabled = true;
        if (idx === correcta) {
            op.classList.add('correcta');
        } else if (idx === seleccionada && !esCorrecta) {
            op.classList.add('incorrecta');
        }
    });
    
    // Mostrar feedback
    const feedbackEl = document.getElementById('feedback-quiz');
    feedbackEl.classList.remove('oculto');
    
    if (esCorrecta) {
        feedbackEl.innerHTML = `
            <div class="feedback-content feedback-correcto feedback-rapido">
                <span class="feedback-icon">✅</span>
                <span class="feedback-text">¡Correcto! +${puntos} pts</span>
            </div>
        `;
        setTimeout(() => {
            siguientePreguntaQuiz(moduloId);
        }, 800);
    } else {
        feedbackEl.innerHTML = `
            <div class="feedback-content feedback-incorrecto feedback-rapido">
                <span class="feedback-icon">❌</span>
                <span class="feedback-text">Incorrecto</span>
            </div>
            <div class="explicacion-quiz">
                <p><strong>Correcta:</strong> ${pregunta.opciones[correcta]}</p>
            </div>
        `;
        setTimeout(() => {
            siguientePreguntaQuiz(moduloId);
        }, 1500);
    }
}

function siguientePreguntaQuiz(moduloId) {
    estadoQuizTiempo.preguntaActual++;
    
    if (estadoQuizTiempo.preguntaActual >= estadoQuizTiempo.totalPreguntas) {
        mostrarResultadosQuiz(moduloId);
    } else {
        renderizarPreguntaQuiz(moduloId);
    }
}

function mostrarResultadosQuiz(moduloId) {
    // Limpiar timer
    if (estadoQuizTiempo.timerInterval) {
        clearInterval(estadoQuizTiempo.timerInterval);
    }
    
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const total = estadoQuizTiempo.totalPreguntas;
    const correctas = estadoQuizTiempo.correctas;
    const porcentaje = Math.round((correctas / total) * 100);
    const aprobado = porcentaje >= evaluacion.aprobacion;
    
    // Guardar mejor puntaje
    guardarMejorPuntaje(moduloId, porcentaje, correctas, total);
    
    // Marcar módulo como completado si aprobó
    if (aprobado) {
        if (!estadoGlobal.modulosCompletados.includes(moduloId)) {
            estadoGlobal.modulosCompletados.push(moduloId);
        }
        
        const modulo = MODULOS.find(m => m.id === moduloId);
        if (modulo && modulo.insignia && !estadoGlobal.insigniasDesbloqueadas.includes(modulo.insignia.nombre)) {
            estadoGlobal.insigniasDesbloqueadas.push(modulo.insignia.nombre);
        }
    
        guardarEstado();
        actualizarSidebar();
        actualizarVistaLogros();
        actualizarDashboard();
    }
    
    // Generar resumen
    const resumenHTML = estadoQuizTiempo.respuestas.map((resp, i) => {
        const pregData = evaluacion.preguntas[i];
        return `
            <div class="resumen-item ${resp.correcta ? 'resumen-correcto' : resp.tiempoAgotado ? 'resumen-no-respondida' : 'resumen-incorrecto'}">
                <div class="resumen-numero">${i + 1}</div>
                <div class="resumen-contenido">
                    <p class="resumen-definicion">${pregData.pregunta}</p>
                    <p class="resumen-respuesta">
                        <strong>Correcta:</strong> ${pregData.opciones[pregData.correcta]}
                    </p>
                    ${!resp.correcta && !resp.tiempoAgotado ? `
                        <p class="resumen-tu-respuesta">
                            <strong>Tu respuesta:</strong> ${pregData.opciones[resp.seleccionada]}
                        </p>
                    ` : ''}
                    ${resp.tiempoAgotado ? `<p class="resumen-tu-respuesta"><strong>Tiempo agotado</strong></p>` : ''}
                    ${pregData.explicacion ? `<p class="resumen-explicacion">💡 ${pregData.explicacion}</p>` : ''}
                </div>
                <div class="resumen-estado">
                    ${resp.correcta ? '✅' : resp.tiempoAgotado ? '⏰' : '❌'}
                </div>
            </div>
        `;
    }).join('');
    
    const container = document.getElementById(`quiz-tiempo-${moduloId}`);
    container.innerHTML = `
        <div class="resultado-final-quiz ${aprobado ? 'quiz-exitoso' : 'quiz-fallido'}">
            <div class="resultado-header">
                <div class="resultado-icono-grande">${aprobado ? '🏆' : '😔'}</div>
                <h2 class="resultado-titulo-grande">
                    ${aprobado ? '¡QUIZ COMPLETADO!' : 'No lograste aprobar... aún'}
                </h2>
            </div>
            
            <div class="resultado-narrativa">
                <p>${aprobado 
                    ? '¡Excelente velocidad y conocimiento! Has demostrado dominar los conceptos de Cibernética y Control.' 
                    : 'No te preocupes, repasa los conceptos y vuelve a intentarlo. ¡Cada intento te hace más rápido!'
                }</p>
            </div>
            
            <div class="resultado-stats-quiz">
                <div class="stat-circulo ${aprobado ? 'stat-aprobado' : 'stat-desaprobado'}">
                    <span class="stat-porcentaje">${porcentaje}%</span>
                </div>
                <div class="stat-detalle">
                    <p class="stat-correctas">${correctas} de ${total} respuestas correctas</p>
                    <p class="stat-puntos">⚡ ${estadoQuizTiempo.puntosTotales} puntos totales</p>
                    <p class="stat-estado ${aprobado ? 'estado-aprobado' : 'estado-desaprobado'}">
                        ${aprobado ? '✅ APROBADO' : '❌ DESAPROBADO'}
                    </p>
                    <p class="stat-minimo">Mínimo requerido: ${evaluacion.aprobacion}%</p>
                </div>
            </div>
            
            <div class="resumen-detallado">
                <h3 class="resumen-titulo">📋 Resumen de Respuestas</h3>
                <div class="resumen-lista">
                    ${resumenHTML}
                </div>
            </div>
            
            <div class="resultado-acciones-final">
                ${aprobado ? `
                    <button class="boton-accion boton-continuar-modulo" onclick="cerrarEvaluacionYAvanzar()">
                        Continuar al siguiente módulo →
                    </button>
                ` : `
                    <button class="boton-accion boton-reintentar-quiz" onclick="reiniciarQuizTiempo(${moduloId})">
                        🔄 Reintentar Quiz
                    </button>
                    <button class="boton-accion boton-revisar" onclick="irATeoria(${moduloId})">
                        📚 Revisar Teoría
                    </button>
                `}
            </div>
        </div>
    `;
}

function reiniciarQuizTiempo(moduloId) {
    if (estadoQuizTiempo.timerInterval) {
        clearInterval(estadoQuizTiempo.timerInterval);
    }
    
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const mejorPuntaje = obtenerMejorPuntaje(moduloId);
    
    const container = document.getElementById(`quiz-tiempo-${moduloId}`);
    container.innerHTML = `
        <div class="quiz-tiempo-intro">
            <div class="quiz-tiempo-header">
                <div class="quiz-tiempo-icono">⚡</div>
                <h2 class="quiz-tiempo-titulo">${evaluacion.titulo}</h2>
            </div>
            <p class="quiz-tiempo-descripcion">${evaluacion.descripcion}</p>
            
            <div class="mejor-puntaje-box ${mejorPuntaje ? 'con-puntaje' : 'sin-puntaje'}">
                <span class="mejor-puntaje-icono">${mejorPuntaje ? '🏆' : '🎯'}</span>
                <div class="mejor-puntaje-info">
                    ${mejorPuntaje ? `
                        <span class="mejor-puntaje-label">Tu mejor intento</span>
                        <span class="mejor-puntaje-valor">${mejorPuntaje.porcentaje}%</span>
                        <span class="mejor-puntaje-detalle">(${mejorPuntaje.correctas}/${mejorPuntaje.total} correctas)</span>
                    ` : `
                        <span class="mejor-puntaje-label">Tu mejor intento</span>
                        <span class="mejor-puntaje-valor sin-intento">Sin intentos</span>
                    `}
                </div>
            </div>
            
            <div class="escape-info-grid">
                <div class="escape-info-item">
                    <span class="info-numero">${evaluacion.preguntas.length}</span>
                    <span class="info-label">Preguntas</span>
                </div>
                <div class="escape-info-item">
                    <span class="info-numero">${evaluacion.tiempoPorPregunta}s</span>
                    <span class="info-label">Por pregunta</span>
                </div>
                <div class="escape-info-item">
                    <span class="info-numero">${evaluacion.aprobacion}%</span>
                    <span class="info-label">Para Aprobar</span>
                </div>
            </div>
            
            <button class="boton-iniciar-quiz" onclick="iniciarQuizTiempo(${moduloId})">
                ⚡ Iniciar Quiz Contrarreloj
            </button>
        </div>
    `;
}

function salirQuizTiempo(moduloId) {
    if (estadoQuizTiempo.timerInterval) {
        clearInterval(estadoQuizTiempo.timerInterval);
    }
    
    moduloIdParaSalir = moduloId;
    actualizarModalSalir('Quiz por Tiempo', '⏱️');
    const modal = document.getElementById('modalSalirEscape');
    if (modal) {
        modal.classList.remove('oculta');
    }
}

// ===== CONECTAR CONCEPTOS =====

function renderizarConectar(moduloId, evaluacion) {
    const mejorPuntaje = obtenerMejorPuntaje(moduloId);
    const totalPares = evaluacion.rondas.reduce((acc, r) => acc + r.pares.length, 0);
    
    estadoConectar = {
        moduloId: moduloId,
        rondaActual: 0,
        seleccionIzquierda: null,
        paresConectados: [],
        paresCorrectos: 0,
        totalPares: totalPares,
        totalRondas: evaluacion.rondas.length,
        resultadosRondas: []
    };
    
    let html = '<div class="conectar-container" id="conectar-' + moduloId + '">';
    html += '<div class="conectar-intro">';
    html += '<div class="conectar-header">';
    html += '<div class="conectar-icono">🔗</div>';
    html += '<h2 class="conectar-titulo">' + evaluacion.titulo + '</h2>';
    html += '</div>';
    html += '<p class="conectar-descripcion">' + evaluacion.descripcion + '</p>';
    
    html += '<div class="mejor-puntaje-box ' + (mejorPuntaje ? 'con-puntaje' : 'sin-puntaje') + '">';
    html += '<span class="mejor-puntaje-icono">' + (mejorPuntaje ? '🏆' : '🎯') + '</span>';
    html += '<div class="mejor-puntaje-info">';
    if (mejorPuntaje) {
        html += '<span class="mejor-puntaje-label">Tu mejor intento</span>';
        html += '<span class="mejor-puntaje-valor">' + mejorPuntaje.porcentaje + '%</span>';
        html += '<span class="mejor-puntaje-detalle">(' + mejorPuntaje.correctas + '/' + mejorPuntaje.total + ' pares)</span>';
    } else {
        html += '<span class="mejor-puntaje-label">Tu mejor intento</span>';
        html += '<span class="mejor-puntaje-valor sin-intento">Sin intentos</span>';
        html += '<span class="mejor-puntaje-detalle">¡Conecta los conceptos!</span>';
    }
    html += '</div></div>';
    
    html += '<div class="conectar-reglas"><h4>¿Cómo jugar?</h4><ul>';
    html += '<li>👆 Haz clic en un concepto de la izquierda</li>';
    html += '<li>👆 Luego haz clic en su definición de la derecha</li>';
    html += '<li>✅ Si es correcto, el par se conecta</li>';
    html += '<li>❌ Si es incorrecto, intenta de nuevo</li>';
    html += '<li>🎯 Completa todas las rondas para terminar</li>';
    html += '</ul></div>';
    
    html += '<div class="escape-info-grid">';
    html += '<div class="escape-info-item"><span class="info-numero">' + evaluacion.rondas.length + '</span><span class="info-label">Rondas</span></div>';
    html += '<div class="escape-info-item"><span class="info-numero">' + totalPares + '</span><span class="info-label">Pares</span></div>';
    html += '<div class="escape-info-item"><span class="info-numero">' + evaluacion.aprobacion + '%</span><span class="info-label">Para Aprobar</span></div>';
    html += '</div>';
    
    html += '<button class="boton-iniciar-conectar" onclick="iniciarConectar(' + moduloId + ')">🔗 Iniciar Juego</button>';
    html += '</div></div>';
    
    return html;
}

function iniciarConectar(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    
    estadoConectar = {
        moduloId: moduloId,
        rondaActual: 0,
        seleccionIzquierda: null,
        paresConectados: [],
        paresCorrectos: 0,
        totalPares: evaluacion.rondas.reduce((acc, r) => acc + r.pares.length, 0),
        totalRondas: evaluacion.rondas.length,
        resultadosRondas: []
    };
    
    renderizarRondaConectar(moduloId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderizarRondaConectar(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const ronda = evaluacion.rondas[estadoConectar.rondaActual];
    const progreso = ((estadoConectar.rondaActual) / estadoConectar.totalRondas) * 100;
    
    estadoConectar.seleccionIzquierda = null;
    estadoConectar.paresConectados = [];
    
    const derechasMezcladas = [...ronda.pares].sort(() => Math.random() - 0.5);
    
    let html = '<div class="conectar-juego">';
    html += '<div class="conectar-top-bar">';
    html += '<button class="boton-salir-conectar" onclick="salirConectar(' + moduloId + ')">← Salir</button>';
    html += '<div class="conectar-ronda-info">Ronda ' + (estadoConectar.rondaActual + 1) + ' de ' + estadoConectar.totalRondas + '</div>';
    html += '<div class="conectar-stats">✅ ' + estadoConectar.paresCorrectos + '</div>';
    html += '</div>';
    
    html += '<div class="conectar-progreso"><div class="progreso-relleno" style="width:' + progreso + '%"></div></div>';
    html += '<h3 class="conectar-ronda-titulo">' + ronda.titulo + '</h3>';
    
    html += '<div class="conectar-tablero">';
    html += '<div class="conectar-columna conectar-izquierda">';
    ronda.pares.forEach((par, idx) => {
        const izqEscaped = par.izquierda.replace(/'/g, "\\'");
        html += '<div class="conectar-item conectar-item-izq" data-index="' + idx + '" onclick="seleccionarConectar(' + moduloId + ",'izquierda'," + idx + ",'" + izqEscaped + "')\">" + par.izquierda + '</div>';
    });
    html += '</div>';
    html += '<div class="conectar-lineas"></div>';
    html += '<div class="conectar-columna conectar-derecha">';
    derechasMezcladas.forEach((par, idx) => {
        const derEscaped = par.derecha.replace(/'/g, "\\'");
        html += '<div class="conectar-item conectar-item-der" data-derecha="' + par.derecha.replace(/"/g, '&quot;') + '" onclick="seleccionarConectar(' + moduloId + ",'derecha'," + idx + ",'" + derEscaped + "')\">" + par.derecha + '</div>';
    });
    html += '</div></div></div>';
    
    document.getElementById('conectar-' + moduloId).innerHTML = html;
}

function seleccionarConectar(moduloId, lado, index, valor) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const ronda = evaluacion.rondas[estadoConectar.rondaActual];
    
    if (lado === 'izquierda') {
        document.querySelectorAll('.conectar-item-izq').forEach(el => el.classList.remove('seleccionado'));
        // Solo bloquear izquierda si ya fue usada
        if (estadoConectar.paresConectados.some(p => p.izquierda === valor)) return;
        const item = document.querySelector('.conectar-item-izq[data-index="' + index + '"]');
        if (item) {
            item.classList.add('seleccionado');
            estadoConectar.seleccionIzquierda = { index, valor };
        }
    } else if (lado === 'derecha' && estadoConectar.seleccionIzquierda) {
        // Solo bloquear derecha si ya está CORRECTAMENTE conectada
        const yaConectadaCorrectamente = estadoConectar.paresConectados.some(p => p.derecha === valor && p.correcto);
        if (yaConectadaCorrectamente) return;
        
        const parCorrecto = ronda.pares.find(p => p.izquierda === estadoConectar.seleccionIzquierda.valor);
        const esCorrecta = parCorrecto && parCorrecto.derecha === valor;
        
        const itemIzq = document.querySelector('.conectar-item-izq[data-index="' + estadoConectar.seleccionIzquierda.index + '"]');
        const itemDer = document.querySelector('.conectar-item-der[data-derecha="' + valor.replace(/"/g, '&quot;') + '"]');
        
        // Registrar el par (solo la izquierda queda "usada" en caso de error)
        estadoConectar.paresConectados.push({ 
            izquierda: estadoConectar.seleccionIzquierda.valor, 
            derecha: esCorrecta ? valor : null, // Solo guardar derecha si es correcta
            correcto: esCorrecta
        });
        
        if (esCorrecta) {
            if (itemIzq) { itemIzq.classList.remove('seleccionado'); itemIzq.classList.add('conectado'); }
            if (itemDer) { itemDer.classList.add('conectado'); }
            estadoConectar.paresCorrectos++;
        } else {
            // Marcar izquierda como fallada (ya no se puede usar)
            if (itemIzq) { itemIzq.classList.remove('seleccionado'); itemIzq.classList.add('fallado'); }
            
            // Mostrar error en la derecha brevemente, pero NO bloquearla
            if (itemDer) { 
                itemDer.classList.add('error');
                setTimeout(() => {
                    itemDer.classList.remove('error');
                }, 800);
            }
            
            // Mostrar cuál era la correcta
            const respuestaCorrecta = parCorrecto ? parCorrecto.derecha : null;
            if (respuestaCorrecta) {
                const itemCorrecto = document.querySelector('.conectar-item-der[data-derecha="' + respuestaCorrecta.replace(/"/g, '&quot;') + '"]');
                if (itemCorrecto && !itemCorrecto.classList.contains('conectado')) {
                    itemCorrecto.classList.add('mostrar-correcta');
                    setTimeout(() => {
                        itemCorrecto.classList.remove('mostrar-correcta');
                    }, 1000);
                }
            }
        }
        
        // Actualizar stats
        const statsEl = document.querySelector('.conectar-stats');
        const errores = estadoConectar.paresConectados.filter(p => !p.correcto).length;
        if (statsEl) statsEl.innerHTML = '✅ ' + estadoConectar.paresCorrectos + ' ❌ ' + errores;
        
        // Verificar si terminó la ronda (todos los conceptos de izquierda fueron intentados)
        const paresIzquierdaUsados = estadoConectar.paresConectados.map(p => p.izquierda);
        const todosIntentados = ronda.pares.every(p => paresIzquierdaUsados.includes(p.izquierda));
        
        if (todosIntentados) {
            const correctosRonda = estadoConectar.paresConectados.filter(p => p.correcto).length - 
                (estadoConectar.resultadosRondas.reduce((acc, r) => acc + r.correctos, 0));
            
            setTimeout(() => {
                estadoConectar.resultadosRondas.push({
                    ronda: estadoConectar.rondaActual,
                    correctos: correctosRonda,
                    total: ronda.pares.length
                });
                estadoConectar.rondaActual++;
                
                if (estadoConectar.rondaActual >= estadoConectar.totalRondas) {
                    mostrarResultadosConectar(moduloId);
                } else {
                    renderizarRondaConectar(moduloId);
                }
            }, 800);
        }
        
        estadoConectar.seleccionIzquierda = null;
    }
}

function mostrarResultadosConectar(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const total = estadoConectar.totalPares;
    const correctas = estadoConectar.paresCorrectos;
    const porcentaje = Math.round((correctas / total) * 100);
    const aprobado = porcentaje >= evaluacion.aprobacion;
    
    guardarMejorPuntaje(moduloId, porcentaje, correctas, total);
    
    if (aprobado) {
        if (!estadoGlobal.modulosCompletados.includes(moduloId)) {
            estadoGlobal.modulosCompletados.push(moduloId);
        }
        const modulo = MODULOS.find(m => m.id === moduloId);
        if (modulo && modulo.insignia && !estadoGlobal.insigniasDesbloqueadas.includes(modulo.insignia.nombre)) {
            estadoGlobal.insigniasDesbloqueadas.push(modulo.insignia.nombre);
        }
        guardarEstado();
        actualizarSidebar();
        actualizarVistaLogros();
        actualizarDashboard();
    }
    
    let html = '<div class="resultado-final-conectar ' + (aprobado ? 'conectar-exitoso' : 'conectar-fallido') + '">';
    html += '<div class="resultado-header">';
    html += '<div class="resultado-icono-grande">' + (aprobado ? '🏆' : '😔') + '</div>';
    html += '<h2 class="resultado-titulo-grande">' + (aprobado ? '¡CONEXIONES COMPLETADAS!' : 'Casi lo logras...') + '</h2>';
    html += '</div>';
    html += '<div class="resultado-narrativa"><p>' + (aprobado 
        ? '¡Excelente! Has demostrado dominar las relaciones entre los conceptos.' 
        : 'No te preocupes, repasa los conceptos y vuelve a intentarlo.') + '</p></div>';
    
    html += '<div class="resultado-stats">';
    html += '<div class="stat-circulo ' + (aprobado ? 'stat-aprobado' : 'stat-desaprobado') + '">';
    html += '<span class="stat-porcentaje">' + porcentaje + '%</span></div>';
    html += '<div class="stat-detalle">';
    html += '<p class="stat-correctas">' + correctas + ' de ' + total + ' pares conectados</p>';
    html += '<p class="stat-estado ' + (aprobado ? 'estado-aprobado' : 'estado-desaprobado') + '">' + (aprobado ? '✅ APROBADO' : '❌ DESAPROBADO') + '</p>';
    html += '<p class="stat-minimo">Mínimo requerido: ' + evaluacion.aprobacion + '%</p>';
    html += '</div></div>';
    
    html += '<div class="resumen-rondas"><h3>Resumen por Rondas</h3>';
    estadoConectar.resultadosRondas.forEach((r, i) => {
        html += '<div class="resumen-ronda-item"><span class="ronda-nombre">Ronda ' + (i + 1) + '</span><span class="ronda-resultado">✅ ' + r.correctos + '/' + r.total + '</span></div>';
    });
    html += '</div>';
    
    html += '<div class="resultado-acciones-final">';
    if (aprobado) {
        html += '<button class="boton-accion boton-continuar-modulo" onclick="cerrarEvaluacionYAvanzar()">Continuar al siguiente módulo →</button>';
    } else {
        html += '<button class="boton-accion boton-reintentar-conectar" onclick="reiniciarConectar(' + moduloId + ')">🔄 Reintentar</button>';
        html += '<button class="boton-accion boton-revisar" onclick="irATeoria(' + moduloId + ')">📚 Revisar Teoría</button>';
    }
    html += '</div></div>';
    
    document.getElementById('conectar-' + moduloId).innerHTML = html;
}

function reiniciarConectar(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const mejorPuntaje = obtenerMejorPuntaje(moduloId);
    const totalPares = evaluacion.rondas.reduce((acc, r) => acc + r.pares.length, 0);
    
    let html = '<div class="conectar-intro">';
    html += '<div class="conectar-header"><div class="conectar-icono">🔗</div>';
    html += '<h2 class="conectar-titulo">' + evaluacion.titulo + '</h2></div>';
    html += '<p class="conectar-descripcion">' + evaluacion.descripcion + '</p>';
    
    html += '<div class="mejor-puntaje-box ' + (mejorPuntaje ? 'con-puntaje' : 'sin-puntaje') + '">';
    html += '<span class="mejor-puntaje-icono">' + (mejorPuntaje ? '🏆' : '🎯') + '</span>';
    html += '<div class="mejor-puntaje-info">';
    if (mejorPuntaje) {
        html += '<span class="mejor-puntaje-label">Tu mejor intento</span>';
        html += '<span class="mejor-puntaje-valor">' + mejorPuntaje.porcentaje + '%</span>';
        html += '<span class="mejor-puntaje-detalle">(' + mejorPuntaje.correctas + '/' + mejorPuntaje.total + ' pares)</span>';
    } else {
        html += '<span class="mejor-puntaje-label">Tu mejor intento</span>';
        html += '<span class="mejor-puntaje-valor sin-intento">Sin intentos</span>';
    }
    html += '</div></div>';
    
    html += '<div class="escape-info-grid">';
    html += '<div class="escape-info-item"><span class="info-numero">' + evaluacion.rondas.length + '</span><span class="info-label">Rondas</span></div>';
    html += '<div class="escape-info-item"><span class="info-numero">' + totalPares + '</span><span class="info-label">Pares</span></div>';
    html += '<div class="escape-info-item"><span class="info-numero">' + evaluacion.aprobacion + '%</span><span class="info-label">Para Aprobar</span></div>';
    html += '</div>';
    
    html += '<button class="boton-iniciar-conectar" onclick="iniciarConectar(' + moduloId + ')">🔗 Iniciar Juego</button>';
    html += '</div>';
    
    document.getElementById('conectar-' + moduloId).innerHTML = html;
}

function salirConectar(moduloId) {
    moduloIdParaSalir = moduloId;
    actualizarModalSalir('Conectar Conceptos', '🔗');
    const modal = document.getElementById('modalSalirEscape');
    if (modal) {
        modal.classList.remove('oculta');
    }
}

// ===== EVALUACIÓN CASOS PRÁCTICOS (UNIDAD V) =====

let estadoCasos = {
    casoActual: 0,
    preguntaActualCaso: 0,
    respuestas: [],
    correctas: 0,
    totalPreguntas: 0
};

function renderizarCasosPracticos(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    if (!evaluacion || !evaluacion.casos) {
        return '<p>Evaluación no disponible</p>';
    }
    
    const totalPreguntas = evaluacion.casos.reduce((acc, caso) => acc + caso.preguntas.length, 0);
    const mejorPuntaje = obtenerMejorPuntaje(moduloId);
    
    let mejorPuntajeHTML = '';
    if (mejorPuntaje !== null && mejorPuntaje) {
        const porcentaje = typeof mejorPuntaje === 'object' ? mejorPuntaje.porcentaje : mejorPuntaje;
        mejorPuntajeHTML = `
            <div class="mejor-puntaje-box">
                <div class="mejor-puntaje-icono">🏆</div>
                <div class="mejor-puntaje-info">
                    <div class="mejor-puntaje-label">TU MEJOR INTENTO</div>
                    <div class="mejor-puntaje-valor">${porcentaje}%</div>
                </div>
            </div>`;
    } else {
        mejorPuntajeHTML = `
            <div class="mejor-puntaje-box sin-intento">
                <div class="mejor-puntaje-icono">🎯</div>
                <div class="mejor-puntaje-info">
                    <div class="mejor-puntaje-label">TU MEJOR INTENTO</div>
                    <div class="mejor-puntaje-valor sin-puntaje">Sin intentos</div>
                </div>
            </div>`;
    }
    
    return `
        <div class="casos-container">
            <div class="casos-intro" id="casosIntro">
                <h3 style="font-size: 1.8rem; color: var(--color-primario); margin-bottom: 1rem;">${evaluacion.titulo}</h3>
                <p style="color: var(--color-texto-secundario); font-size: 1.1rem; margin-bottom: 1.5rem;">${evaluacion.descripcion}</p>
                
                ${mejorPuntajeHTML}
                
                <div class="casos-info">
                    <div class="info-item">📚 <strong>${evaluacion.casos.length}</strong> casos de estudio</div>
                    <div class="info-item">❓ <strong>${totalPreguntas}</strong> preguntas en total</div>
                    <div class="info-item">✅ Aprobación: <strong>${evaluacion.aprobacion}%</strong></div>
                </div>
                
                <p class="instrucciones-casos">${evaluacion.instrucciones}</p>
                
                <div style="margin-top: 2rem; text-align: center;">
                    <button style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; border: none; padding: 1rem 2.5rem; font-size: 1.1rem; font-weight: 600; border-radius: 12px; cursor: pointer;" onclick="iniciarCasosPracticos('${moduloId}')">
                        🎭 Comenzar Análisis de Casos
                    </button>
                </div>
            </div>
            
            <div class="casos-juego oculto" id="casosJuego"></div>
        </div>
    `;
}

function iniciarCasosPracticos(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    
    estadoCasos = {
        casoActual: 0,
        preguntaActualCaso: 0,
        respuestas: [],
        correctas: 0,
        totalPreguntas: evaluacion.casos.reduce((acc, caso) => acc + caso.preguntas.length, 0)
    };
    
    document.getElementById('casosIntro').classList.add('oculto');
    document.getElementById('casosJuego').classList.remove('oculto');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    renderizarCaso(moduloId);
}

function renderizarCaso(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const caso = evaluacion.casos[estadoCasos.casoActual];
    const pregunta = caso.preguntas[estadoCasos.preguntaActualCaso];
    
    const preguntaGlobalIndex = evaluacion.casos.slice(0, estadoCasos.casoActual).reduce((acc, c) => acc + c.preguntas.length, 0) + estadoCasos.preguntaActualCaso + 1;
    const progreso = (preguntaGlobalIndex / estadoCasos.totalPreguntas) * 100;
    
    const container = document.getElementById('casosJuego');
    container.innerHTML = `
        <div class="casos-top-bar">
            <button class="boton-salir-casos" onclick="salirCasos('${moduloId}')">← Salir</button>
            <div class="casos-progreso-texto">Pregunta ${preguntaGlobalIndex} de ${estadoCasos.totalPreguntas}</div>
            <div class="casos-stats">✅ ${estadoCasos.correctas}</div>
        </div>
        
        <div class="casos-progreso-bar">
            <div class="casos-progreso-fill" style="width: ${progreso}%"></div>
        </div>
        
        <div class="caso-card">
            <div class="caso-header">
                <span class="caso-numero">Caso ${estadoCasos.casoActual + 1} de ${evaluacion.casos.length}</span>
                <h4 class="caso-titulo">${caso.titulo}</h4>
            </div>
            
            <div class="caso-narrativa">
                <p>${caso.narrativa}</p>
            </div>
            
            <div class="caso-pregunta">
                <div class="pregunta-numero">Pregunta ${estadoCasos.preguntaActualCaso + 1} de ${caso.preguntas.length}</div>
                <p class="pregunta-texto">${pregunta.pregunta}</p>
                
                <div class="caso-opciones" id="casoOpciones">
                    ${pregunta.opciones.map((opcion, idx) => `
                        <button class="caso-opcion-btn" onclick="responderCaso('${moduloId}', ${idx})">
                            ${opcion}
                        </button>
                    `).join('')}
                </div>
                
                <div class="caso-feedback oculto" id="casoFeedback"></div>
            </div>
        </div>
    `;
}

function responderCaso(moduloId, respuestaIdx) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const caso = evaluacion.casos[estadoCasos.casoActual];
    const pregunta = caso.preguntas[estadoCasos.preguntaActualCaso];
    const esCorrecta = respuestaIdx === pregunta.correcta;
    
    // Deshabilitar botones
    const botones = document.querySelectorAll('.caso-opcion-btn');
    botones.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === pregunta.correcta) {
            btn.classList.add('correcta');
        } else if (idx === respuestaIdx && !esCorrecta) {
            btn.classList.add('incorrecta');
        }
    });
    
    if (esCorrecta) {
        estadoCasos.correctas++;
    }
    
    estadoCasos.respuestas.push({
        caso: estadoCasos.casoActual,
        pregunta: estadoCasos.preguntaActualCaso,
        respuesta: respuestaIdx,
        correcta: esCorrecta
    });
    
    // Actualizar stats
    const statsEl = document.querySelector('.casos-stats');
    if (statsEl) statsEl.textContent = '✅ ' + estadoCasos.correctas;
    
    // Mostrar feedback breve y avanzar automáticamente
    const feedbackEl = document.getElementById('casoFeedback');
    feedbackEl.innerHTML = `
        <div class="feedback-resultado ${esCorrecta ? 'correcto' : 'incorrecto'}">
            ${esCorrecta ? '✅ ¡Correcto!' : '❌ Incorrecto'}
        </div>
        <div class="feedback-explicacion">
            <strong>Explicación:</strong> ${pregunta.explicacion}
        </div>
    `;
    feedbackEl.classList.remove('oculto');
    
    // Avanzar automáticamente después de 2 segundos
    setTimeout(() => {
        siguientePreguntaCaso(moduloId);
    }, 2000);
}

function siguientePreguntaCaso(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const caso = evaluacion.casos[estadoCasos.casoActual];
    
    estadoCasos.preguntaActualCaso++;
    
    if (estadoCasos.preguntaActualCaso >= caso.preguntas.length) {
        // Siguiente caso
        estadoCasos.casoActual++;
        estadoCasos.preguntaActualCaso = 0;
        
        if (estadoCasos.casoActual >= evaluacion.casos.length) {
            // Terminó
            mostrarResultadosCasos(moduloId);
            return;
        }
    }
    
    renderizarCaso(moduloId);
}

function mostrarResultadosCasos(moduloId) {
    const evaluacion = obtenerEvaluacionModulo(moduloId);
    const porcentaje = Math.round((estadoCasos.correctas / estadoCasos.totalPreguntas) * 100);
    const aprobado = porcentaje >= evaluacion.aprobacion;
    
    // Guardar mejor puntaje
    guardarMejorPuntaje(moduloId, porcentaje);
    
    // Marcar módulo si aprobó y otorgar insignia
    if (aprobado) {
        if (!estadoGlobal.modulosCompletados.includes(parseInt(moduloId))) {
            estadoGlobal.modulosCompletados.push(parseInt(moduloId));
        }
        
        const modulo = MODULOS.find(m => m.id === parseInt(moduloId));
        if (modulo && modulo.insignia && !estadoGlobal.insigniasDesbloqueadas.includes(modulo.insignia.nombre)) {
            estadoGlobal.insigniasDesbloqueadas.push(modulo.insignia.nombre);
        }
        
        guardarEstado();
        actualizarSidebar();
        actualizarVistaLogros();
        actualizarDashboard();
    }
    
    // Resumen detallado por caso con preguntas y explicaciones
    let resumenCasos = '';
    evaluacion.casos.forEach((caso, casoIdx) => {
        const respuestasCaso = estadoCasos.respuestas.filter(r => r.caso === casoIdx);
        const correctasCaso = respuestasCaso.filter(r => r.correcta).length;
        
        let preguntasHTML = '';
        caso.preguntas.forEach((preg, pregIdx) => {
            const respuesta = respuestasCaso.find(r => r.pregunta === pregIdx);
            const esCorrecta = respuesta && respuesta.correcta;
            const noRespondida = !respuesta;
            
            preguntasHTML += `
                <div class="resumen-pregunta-caso ${esCorrecta ? 'correcto' : 'incorrecto'}">
                    <div class="pregunta-header-resumen">
                        <span class="pregunta-num">P${pregIdx + 1}</span>
                        <span class="pregunta-estado">${esCorrecta ? '✅' : noRespondida ? '⏰' : '❌'}</span>
                    </div>
                    <p class="pregunta-texto-resumen">${preg.pregunta}</p>
                    <p class="respuesta-correcta-resumen"><strong>Correcta:</strong> ${preg.opciones[preg.correcta]}</p>
                    ${!esCorrecta && respuesta ? `<p class="tu-respuesta-resumen"><strong>Tu respuesta:</strong> ${preg.opciones[respuesta.seleccionada]}</p>` : ''}
                    ${preg.explicacion ? `<p class="explicacion-resumen">💡 ${preg.explicacion}</p>` : ''}
                </div>
            `;
        });
        
        resumenCasos += `
            <div class="resumen-caso-completo">
                <div class="resumen-caso-header">
                    <span class="caso-nombre">${caso.titulo}</span>
                    <span class="caso-resultado ${correctasCaso === caso.preguntas.length ? 'perfecto' : correctasCaso > 0 ? 'parcial' : 'fallido'}">
                        ${correctasCaso}/${caso.preguntas.length}
                    </span>
                </div>
                <div class="resumen-preguntas-caso">
                    ${preguntasHTML}
                </div>
            </div>
        `;
    });
    
    const container = document.getElementById('casosJuego');
    container.innerHTML = `
        <div class="resultado-final-casos ${aprobado ? 'aprobado' : 'desaprobado'}">
            <div class="resultado-icono">${aprobado ? '🎉' : '📚'}</div>
            <h3>${aprobado ? '¡Excelente Análisis Sistémico!' : 'Necesitas Repasar'}</h3>
            
            <div class="resultado-puntaje">
                <span class="puntaje-numero">${porcentaje}%</span>
                <span class="puntaje-estado ${aprobado ? 'aprobado' : 'desaprobado'}">
                    ${aprobado ? 'APROBADO' : 'DESAPROBADO'}
                </span>
            </div>
            
            <div class="resultado-detalle">
                <p>Respondiste correctamente <strong>${estadoCasos.correctas}</strong> de <strong>${estadoCasos.totalPreguntas}</strong> preguntas</p>
            </div>
            
            <div class="resumen-casos">
                <h4>Resultados por Caso:</h4>
                ${resumenCasos}
            </div>
            
            <div class="resultado-acciones-final">
                ${aprobado ? `
                    <button class="boton-accion primario" onclick="avanzarSiguienteModulo()">
                        🎓 ¡Curso Completado!
                    </button>
                ` : `
                    <button class="boton-accion primario" onclick="reiniciarCasos('${moduloId}')">
                        🔄 Reintentar
                    </button>
                    <button class="boton-accion secundario" onclick="volverTeoria('${moduloId}')">
                        📖 Revisar Teoría
                    </button>
                `}
            </div>
        </div>
    `;
    
    actualizarSidebar();
}

function reiniciarCasos(moduloId) {
    document.getElementById('casosJuego').classList.add('oculto');
    document.getElementById('casosIntro').classList.remove('oculto');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function salirCasos(moduloId) {
    moduloIdParaSalir = moduloId;
    actualizarModalSalir('Análisis de Casos', '🎭');
    const modal = document.getElementById('modalSalirEscape');
    if (modal) {
        modal.classList.remove('oculta');
    }
}

// ===== BUSCADOR =====

let buscadorTimeout = null;

function dividirEnSecciones(contenido) {
    // Procesar igual que en procesarContenidoInteractivo para mantener índices consistentes
    const contenidoMejorado = mejorarFormatoHTML(contenido);
    // Dividir por h2 o h3 - mismo regex que procesarContenidoInteractivo
    const secciones = contenidoMejorado.split(/(?=<h[23][^>]*>)/i).filter(s => s.trim());
    return secciones;
}

function inicializarBuscador() {
    const input = document.getElementById('buscadorInput');
    const resultados = document.getElementById('buscadorResultados');
    const cerrar = document.getElementById('buscadorCerrar');
    
    if (!input || !resultados) return;
    
    // Evento de escritura
    input.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Mostrar/ocultar botón cerrar
        if (cerrar) {
            cerrar.classList.toggle('oculto', query.length === 0);
        }
        
        // Debounce para no buscar en cada tecla
        clearTimeout(buscadorTimeout);
        
        if (query.length < 2) {
            resultados.classList.add('oculto');
            return;
        }
        
        buscadorTimeout = setTimeout(() => {
            realizarBusqueda(query);
        }, 300);
    });
    
    // Cerrar resultados
    if (cerrar) {
        cerrar.addEventListener('click', function() {
            input.value = '';
            resultados.classList.add('oculto');
            this.classList.add('oculto');
        });
    }
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', function(e) {
        const container = document.querySelector('.buscador-container');
        if (container && !container.contains(e.target)) {
            resultados.classList.add('oculto');
        }
    });
    
    // Abrir al hacer focus
    input.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            resultados.classList.remove('oculto');
        }
    });
}

function realizarBusqueda(query) {
    const resultados = document.getElementById('buscadorResultados');
    if (!resultados) return;
    
    const queryLower = query.toLowerCase();
    const resultadosEncontrados = [];
    
    // Buscar en todos los módulos
    for (const [moduloId, contenido] of Object.entries(CONTENIDO_TEORICO)) {
        const modulo = MODULOS.find(m => m.id === parseInt(moduloId));
        if (!modulo) continue;
        
        // Dividir en secciones
        const secciones = dividirEnSecciones(contenido);
        
        secciones.forEach((seccion, seccionIdx) => {
            // Buscar en el texto de la sección
            const textoPlano = seccion.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
            const posicion = textoPlano.toLowerCase().indexOf(queryLower);
            
            if (posicion !== -1) {
                // Extraer contexto alrededor de la coincidencia
                const inicio = Math.max(0, posicion - 40);
                const fin = Math.min(textoPlano.length, posicion + query.length + 60);
                let extracto = textoPlano.substring(inicio, fin);
                
                if (inicio > 0) extracto = '...' + extracto;
                if (fin < textoPlano.length) extracto = extracto + '...';
                
                // Resaltar la palabra buscada
                const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
                extracto = extracto.replace(regex, '<mark>$1</mark>');
                
                // Obtener título de la sección
                const tituloSeccion = extraerTitulo(seccion);
                
                resultadosEncontrados.push({
                    moduloId: parseInt(moduloId),
                    moduloNombre: modulo.nombre,
                    seccionIdx: seccionIdx,
                    seccionNombre: tituloSeccion,
                    extracto: extracto
                });
            }
        });
    }
    
    // Mostrar resultados
    mostrarResultadosBusqueda(resultadosEncontrados, query);
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mostrarResultadosBusqueda(resultados, query) {
    const container = document.getElementById('buscadorResultados');
    if (!container) return;
    
    if (resultados.length === 0) {
        container.innerHTML = `
            <div class="buscador-sin-resultados">
                <div class="icono">🔍</div>
                <p>No se encontraron resultados para "<strong>${query}</strong>"</p>
            </div>
        `;
    } else {
        // Limitar a 15 resultados máximo
        const limitados = resultados.slice(0, 15);
        
        let html = `
            <div class="buscador-resultado-contador">
                ${resultados.length} resultado${resultados.length !== 1 ? 's' : ''} encontrado${resultados.length !== 1 ? 's' : ''}
            </div>
        `;
        
        limitados.forEach(r => {
            html += `
                <div class="buscador-resultado-item" onclick="irAResultadoBusqueda(${r.moduloId}, ${r.seccionIdx})">
                    <div class="buscador-resultado-ubicacion">
                        <span class="buscador-resultado-modulo">${r.moduloId === 0 ? 'Bienvenida' : 'Unidad ' + r.moduloId}</span>
                        <span class="buscador-resultado-seccion">› ${r.seccionNombre}</span>
                    </div>
                    <div class="buscador-resultado-texto">${r.extracto}</div>
                </div>
            `;
        });
        
        if (resultados.length > 15) {
            html += `
                <div class="buscador-resultado-contador" style="text-align: center; border-top: 1px solid var(--color-borde); border-bottom: none;">
                    Y ${resultados.length - 15} resultados más...
                </div>
            `;
        }
        
        container.innerHTML = html;
    }
    
    container.classList.remove('oculto');
}

// Variables para la búsqueda
let palabraBusquedaActual = '';
let navegandoDesdeBusqueda = false;
let seccionBusquedaDestino = 0;

function irAResultadoBusqueda(moduloId, seccionIdx) {
    console.log('Navegando a búsqueda:', { moduloId, seccionIdx });
    
    // Guardar la palabra buscada antes de cerrar
    const input = document.getElementById('buscadorInput');
    palabraBusquedaActual = input ? input.value.trim() : '';
    
    // Cerrar el buscador
    const resultadosDiv = document.getElementById('buscadorResultados');
    const cerrar = document.getElementById('buscadorCerrar');
    
    if (input) input.value = '';
    if (resultadosDiv) resultadosDiv.classList.add('oculto');
    if (cerrar) cerrar.classList.add('oculto');
    
    // Convertir a números
    const modId = typeof moduloId === 'string' ? parseInt(moduloId) : moduloId;
    const secIdx = typeof seccionIdx === 'string' ? parseInt(seccionIdx) : seccionIdx;
    
    // Establecer flag de navegación desde búsqueda
    navegandoDesdeBusqueda = true;
    seccionBusquedaDestino = secIdx;
    
    // Establecer la sección y módulo
    estadoGlobal.seccionActual = secIdx;
    estadoGlobal.moduloActual = modId;
    
    // Mostrar vista principal si estamos en dashboard/logros
    const vistaDashboard = document.getElementById('vistaDashboard');
    const vistaLogros = document.getElementById('vistaLogros');
    if (vistaDashboard && !vistaDashboard.classList.contains('oculta')) {
        mostrarVistaPrincipal();
    } else if (vistaLogros && !vistaLogros.classList.contains('oculta')) {
        mostrarVistaPrincipal();
    }
    
    // Procesar contenido del módulo
    procesarContenidoInteractivo(obtenerContenidoModulo(modId), modId);
    
    // Forzar la sección correcta después de procesar
    estadoGlobal.seccionActual = secIdx;
    
    // Actualizar la UI
    actualizarVistaPrincipal();
    actualizarSidebar();
    guardarEstado();
    
    // Reset del flag
    navegandoDesdeBusqueda = false;
    
    // Resaltar la palabra buscada después de renderizar
    setTimeout(() => {
        if (palabraBusquedaActual) {
            resaltarPalabraEnContenido(palabraBusquedaActual);
        }
    }, 300);
}

function resaltarPalabraEnContenido(palabra) {
    // Buscar el contenedor correcto del contenido
    const contenido = document.querySelector('.contenido-seccion-secuencial');
    if (!contenido || !palabra) {
        console.log('Resaltado: No se encontró contenedor o palabra');
        return;
    }
    
    // Limpiar resaltados anteriores
    limpiarResaltados();
    
    // Usar CSS.highlights API si está disponible, sino usar innerHTML
    const html = contenido.innerHTML;
    const palabraEscapada = palabra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${palabraEscapada})`, 'gi');
    
    // Contar coincidencias en texto plano
    const textoPlano = contenido.textContent || '';
    const coincidenciasTexto = textoPlano.match(regex);
    
    if (!coincidenciasTexto || coincidenciasTexto.length === 0) {
        console.log('Resaltado: No se encontraron coincidencias para:', palabra);
        return;
    }
    
    // Reemplazar solo en texto visible (entre tags), no en atributos HTML
    const nuevoHTML = html.replace(/>([^<]+)</g, function(match, texto) {
        const textoResaltado = texto.replace(regex, '<mark class="resaltado-busqueda">$1</mark>');
        return '>' + textoResaltado + '<';
    });
    contenido.innerHTML = nuevoHTML;
    
    console.log('Resaltado: Se encontraron', coincidenciasTexto.length, 'coincidencias');
    
    // Mostrar botón para limpiar resaltado
    mostrarBotonLimpiarResaltado(coincidenciasTexto.length);
    
    // Scroll al primer resultado
    setTimeout(() => {
        const primerResaltado = document.querySelector('.resaltado-busqueda');
        if (primerResaltado) {
            primerResaltado.scrollIntoView({ behavior: 'smooth', block: 'center' });
            console.log('Resaltado: Scroll hacia primera coincidencia');
        }
    }, 150);
}

function mostrarBotonLimpiarResaltado(cantidad) {
    // Eliminar botón existente si hay
    const existente = document.getElementById('botonLimpiarResaltado');
    if (existente) existente.remove();
    
    // Crear botón flotante
    const boton = document.createElement('button');
    boton.id = 'botonLimpiarResaltado';
    boton.className = 'boton-limpiar-resaltado';
    boton.innerHTML = `<span class="cantidad-resaltados">${cantidad}</span> resultados encontrados <span class="cerrar-resaltado">✕ Limpiar</span>`;
    boton.onclick = limpiarResaltados;
    
    document.body.appendChild(boton);
}

function limpiarResaltados() {
    // Quitar botón
    const boton = document.getElementById('botonLimpiarResaltado');
    if (boton) boton.remove();
    
    // Quitar resaltados de todo el documento
    const resaltados = document.querySelectorAll('.resaltado-busqueda');
    resaltados.forEach(mark => {
        const texto = document.createTextNode(mark.textContent);
        if (mark.parentNode) {
            mark.parentNode.replaceChild(texto, mark);
            mark.parentNode.normalize();
        }
    });
}

// ===== PANEL DE ADMINISTRACIÓN =====

// Contraseña por defecto (puede cambiarse en localStorage)
const PASSWORD_ADMIN_DEFAULT = "uade2025";

// Estado del panel admin
let estadoAdmin = {
    autenticado: false,
    modulosEditados: null,
    evaluacionesEditadas: null,
    moduloEnEdicion: null,
    modoEdicionSeccion: true, // Siempre editar sección por sección
    seccionActualEdicion: 0,
    seccionesTemporales: null
};

// ===== FUNCIONES AUXILIARES PARA OBTENER CONTENIDO (EDITADO O ORIGINAL) =====

function obtenerContenidoModulo(moduloId) {
    // Si hay datos editados en el admin, usar esos; si no, usar los originales
    if (estadoAdmin.modulosEditados && estadoAdmin.modulosEditados[moduloId] !== undefined) {
        return estadoAdmin.modulosEditados[moduloId];
    }
    return CONTENIDO_TEORICO[moduloId] || '';
}

function obtenerEvaluacionModulo(moduloId) {
    // Si hay evaluaciones editadas en el admin, usar esas; si no, usar las originales
    if (estadoAdmin.evaluacionesEditadas && estadoAdmin.evaluacionesEditadas[moduloId] !== undefined) {
        return estadoAdmin.evaluacionesEditadas[moduloId];
    }
    return CONTENIDO_EVALUACION[moduloId] || null;
}

// Detectar combinación de teclas Ctrl+Shift+A para abrir panel admin
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        abrirModalAdmin();
    }
});

// Detectar URL con ?admin=true
if (window.location.search.includes('admin=true')) {
    setTimeout(() => abrirModalAdmin(), 500);
}

function abrirModalAdmin() {
    const modal = document.getElementById('modalAdmin');
    modal.classList.remove('oculta');
    
    if (!estadoAdmin.autenticado) {
        document.getElementById('loginAdmin').classList.remove('oculta');
        document.getElementById('panelAdmin').classList.add('oculta');
        document.getElementById('passwordAdmin').focus();
    } else {
        document.getElementById('loginAdmin').classList.add('oculta');
        document.getElementById('panelAdmin').classList.remove('oculta');
        cargarDatosAdmin();
    }
}

function cerrarModalAdmin() {
    document.getElementById('modalAdmin').classList.add('oculta');
}

// Event listener para login
document.addEventListener('DOMContentLoaded', () => {
    const btnLogin = document.getElementById('btnLoginAdmin');
    const passwordInput = document.getElementById('passwordAdmin');
    const cerrarLogin = document.getElementById('cerrarLoginAdmin');
    const cerrarPanel = document.getElementById('cerrarPanelAdmin');
    
    if (btnLogin) {
        btnLogin.addEventListener('click', intentarLoginAdmin);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') intentarLoginAdmin();
        });
    }
    
    if (cerrarLogin) {
        cerrarLogin.addEventListener('click', cerrarModalAdmin);
    }
    
    if (cerrarPanel) {
        cerrarPanel.addEventListener('click', cerrarModalAdmin);
    }
    
    // Tabs
    document.querySelectorAll('.tab-admin').forEach(tab => {
        tab.addEventListener('click', () => cambiarTabAdmin(tab.dataset.tab));
    });
    
    // Botones principales
    const btnExportar = document.getElementById('btnExportarJSON');
    const btnAgregarModulo = document.getElementById('btnAgregarModulo');
    const btnAgregarInsignia = document.getElementById('btnAgregarInsignia');
    
    if (btnExportar) btnExportar.addEventListener('click', exportarJSON);
    if (btnAgregarModulo) btnAgregarModulo.addEventListener('click', agregarNuevoModulo);
    if (btnAgregarInsignia) btnAgregarInsignia.addEventListener('click', agregarNuevaInsignia);
    
    // Selector de módulo para evaluaciones
    const selectorModuloEval = document.getElementById('selectorModuloEval');
    if (selectorModuloEval) {
        selectorModuloEval.addEventListener('change', cargarEditorEvaluacion);
    }
});

function intentarLoginAdmin() {
    const password = document.getElementById('passwordAdmin').value;
    const passwordGuardada = localStorage.getItem('adminPassword') || PASSWORD_ADMIN_DEFAULT;
    const errorEl = document.getElementById('errorLoginAdmin');
    
    if (password === passwordGuardada) {
        estadoAdmin.autenticado = true;
        document.getElementById('loginAdmin').classList.add('oculta');
        document.getElementById('panelAdmin').classList.remove('oculta');
        cargarDatosAdmin();
    } else {
        errorEl.classList.remove('oculta');
        document.getElementById('passwordAdmin').value = '';
        setTimeout(() => errorEl.classList.add('oculta'), 3000);
    }
}

function cambiarTabAdmin(tabName) {
    // Actualizar tabs
    document.querySelectorAll('.tab-admin').forEach(t => t.classList.remove('activa'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('activa');
    
    // Actualizar contenido
    document.querySelectorAll('.contenido-tab-admin').forEach(c => c.classList.remove('activo'));
    
    if (tabName === 'modulos') document.getElementById('tabModulos').classList.add('activo');
    if (tabName === 'evaluaciones') {
        document.getElementById('tabEvaluaciones').classList.add('activo');
        // Cargar la evaluación si hay un módulo seleccionado
        const selector = document.getElementById('selectorModuloEval');
        if (selector && selector.value) {
            cargarEditorEvaluacion();
        }
    }
    if (tabName === 'insignias') document.getElementById('tabInsignias').classList.add('activo');
    if (tabName === 'exportar') document.getElementById('tabExportar').classList.add('activo');
    if (tabName === 'ayuda') document.getElementById('tabAyuda').classList.add('activo');
}

// Helper para normalizar claves de objetos (convertir claves numéricas a strings)
function normalizarClaves(obj) {
    if (!obj) return {};
    const normalizado = {};
    for (const key of Object.keys(obj)) {
        normalizado[String(key)] = obj[key];
    }
    return normalizado;
}

// Helper para obtener evaluación (maneja claves numéricas y string)
function obtenerEvaluacionAdmin(moduloId) {
    const id = String(moduloId);
    if (!estadoAdmin.evaluacionesEditadas) return null;
    return estadoAdmin.evaluacionesEditadas[id] || estadoAdmin.evaluacionesEditadas[moduloId];
}

// Helper para establecer evaluación (siempre usa string)
function establecerEvaluacionAdmin(moduloId, evaluacion) {
    estadoAdmin.evaluacionesEditadas[String(moduloId)] = evaluacion;
}

function cargarDatosAdmin() {
    // Cargar desde localStorage si existe, sino desde las variables globales
    const datosGuardados = localStorage.getItem('adminContentData');
    
    // Siempre empezar con los datos originales del JSON
    const modulosBase = normalizarClaves(JSON.parse(JSON.stringify(CONTENIDO_TEORICO)));
    const evaluacionesBase = normalizarClaves(JSON.parse(JSON.stringify(CONTENIDO_EVALUACION)));
    
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        
        // Merge: datos guardados sobrescriben los originales, pero no eliminan lo que falta
        estadoAdmin.modulosEditados = { ...modulosBase, ...normalizarClaves(datos.modulos || {}) };
        estadoAdmin.evaluacionesEditadas = { ...evaluacionesBase, ...normalizarClaves(datos.evaluaciones || {}) };
        
        // Cargar estructura de módulos si existe
        if (datos.listaModulos && datos.listaModulos.length > 0) {
            MODULOS = datos.listaModulos;
        }
        
        // Aplicar los datos editados a las variables globales para que la app los use
        CONTENIDO_TEORICO = { ...estadoAdmin.modulosEditados };
        CONTENIDO_EVALUACION = { ...estadoAdmin.evaluacionesEditadas };
    } else {
        estadoAdmin.modulosEditados = modulosBase;
        estadoAdmin.evaluacionesEditadas = evaluacionesBase;
    }
    
    renderizarListaModulosAdmin();
    renderizarListaInsigniasAdmin();
    cargarSelectorModulosEval();
}

function guardarDatosAdmin() {
    const datos = {
        modulos: estadoAdmin.modulosEditados,
        evaluaciones: estadoAdmin.evaluacionesEditadas,
        listaModulos: MODULOS  // Guardar también la estructura de módulos
    };
    localStorage.setItem('adminContentData', JSON.stringify(datos));
    
    // Actualizar referencias globales para que la app use los datos editados inmediatamente
    CONTENIDO_TEORICO = { ...estadoAdmin.modulosEditados };
    CONTENIDO_EVALUACION = { ...estadoAdmin.evaluacionesEditadas };
    
    // Actualizar el sidebar y dashboard
    actualizarSidebar();
    actualizarDashboard();
    actualizarVistaLogros();
    
    mostrarNotificacion('💾 Cambios guardados localmente');
}

// ===== GESTIÓN DE MÓDULOS =====

function renderizarListaModulosAdmin() {
    const lista = document.getElementById('listaModulosAdmin');
    lista.innerHTML = '';
    
    const totalModulos = MODULOS.length;
    
    MODULOS.forEach((modulo, index) => {
        const div = document.createElement('div');
        div.className = 'item-modulo-admin';
        
        const contenidoModulo = estadoAdmin.modulosEditados[modulo.id] || '';
        const cantidadSecciones = contenidoModulo ? dividirEnSecciones(contenidoModulo).length : 0;
        
        // El módulo 0 (Bienvenida) no se puede mover ni eliminar
        const esBienvenida = modulo.id === 0;
        const puedeSubir = index > 1; // No puede subir si es el primero después de Bienvenida
        const puedeBajar = index < totalModulos - 1 && index > 0; // No puede bajar si es el último o es Bienvenida
        
        div.innerHTML = `
            <div class="info-modulo-admin">
                <span class="icono-modulo-admin">${modulo.icono}</span>
                <div class="texto-modulo-admin">
                    <h4>${modulo.titulo}</h4>
                    <p>${cantidadSecciones} sección${cantidadSecciones !== 1 ? 'es' : ''} • ID: ${modulo.id}</p>
                </div>
            </div>
            <div class="acciones-modulo-admin">
                ${!esBienvenida ? `
                    <div class="botones-orden-modulo">
                        <button class="btn-orden-modulo ${!puedeSubir ? 'disabled' : ''}" onclick="moverModuloArriba(${index})" title="Mover arriba" ${!puedeSubir ? 'disabled' : ''}>↑</button>
                        <button class="btn-orden-modulo ${!puedeBajar ? 'disabled' : ''}" onclick="moverModuloAbajo(${index})" title="Mover abajo" ${!puedeBajar ? 'disabled' : ''}>↓</button>
                    </div>
                ` : ''}
                <button class="boton-admin-pequeno boton-editar" onclick="editarModuloAdmin(${modulo.id})">✏️ Editar</button>
                ${!esBienvenida ? `
                    <button class="boton-admin-pequeno boton-duplicar" onclick="duplicarModulo(${modulo.id})" title="Duplicar módulo">📋</button>
                    <button class="boton-admin-pequeno boton-eliminar" onclick="eliminarModuloAdmin(${modulo.id})" title="Eliminar módulo">✕</button>
                ` : ''}
            </div>
        `;
        
        lista.appendChild(div);
    });
}

function moverModuloArriba(index) {
    if (index <= 1) return; // No mover Bienvenida ni el primero después de ella
    
    // Intercambiar posiciones en el array
    const temp = MODULOS[index];
    MODULOS[index] = MODULOS[index - 1];
    MODULOS[index - 1] = temp;
    
    guardarDatosAdmin();
    renderizarListaModulosAdmin();
    actualizarSidebar();
    mostrarNotificacion('↑ Módulo movido arriba');
}

function moverModuloAbajo(index) {
    if (index === 0 || index >= MODULOS.length - 1) return;
    
    // Intercambiar posiciones en el array
    const temp = MODULOS[index];
    MODULOS[index] = MODULOS[index + 1];
    MODULOS[index + 1] = temp;
    
    guardarDatosAdmin();
    renderizarListaModulosAdmin();
    actualizarSidebar();
    mostrarNotificacion('↓ Módulo movido abajo');
}

function duplicarModulo(moduloId) {
    const moduloOriginal = MODULOS.find(m => m.id === moduloId);
    if (!moduloOriginal) return;
    
    // Generar nuevo ID
    const nuevoId = Math.max(...MODULOS.map(m => m.id)) + 1;
    
    // Crear copia del módulo
    const nuevoModulo = {
        id: nuevoId,
        numero: nuevoId,
        titulo: `${moduloOriginal.titulo} (Copia)`,
        icono: moduloOriginal.icono,
        parte: moduloOriginal.parte,
        clases: `Copia de ${moduloOriginal.clases}`,
        insignia: moduloOriginal.insignia ? {
            nombre: `${moduloOriginal.insignia.nombre} (Copia)`,
            emoji: moduloOriginal.insignia.emoji,
            descripcion: moduloOriginal.insignia.descripcion
        } : null
    };
    
    // Agregar a la lista de módulos
    MODULOS.push(nuevoModulo);
    
    // Copiar contenido del módulo
    const contenidoOriginal = estadoAdmin.modulosEditados[String(moduloId)] || estadoAdmin.modulosEditados[moduloId] || '';
    estadoAdmin.modulosEditados[String(nuevoId)] = contenidoOriginal;
    
    // Copiar evaluación si existe
    const evaluacionOriginal = obtenerEvaluacionAdmin(moduloId);
    if (evaluacionOriginal) {
        // Hacer copia profunda de la evaluación
        const evaluacionCopia = JSON.parse(JSON.stringify(evaluacionOriginal));
        evaluacionCopia.titulo = `${evaluacionCopia.titulo} (Copia)`;
        estadoAdmin.evaluacionesEditadas[String(nuevoId)] = evaluacionCopia;
    }
    
    guardarDatosAdmin();
    renderizarListaModulosAdmin();
    renderizarListaInsigniasAdmin();
    cargarSelectorModulosEval();
    actualizarSidebar();
    
    mostrarNotificacion(`📋 Módulo duplicado: ${nuevoModulo.titulo}`);
}

// Hacer funciones accesibles globalmente
window.moverModuloArriba = moverModuloArriba;
window.moverModuloAbajo = moverModuloAbajo;
window.duplicarModulo = duplicarModulo;

function agregarNuevoModulo() {
    const nuevoId = MODULOS.length;
    const nuevoModulo = {
        id: nuevoId,
        numero: nuevoId,
        titulo: `Unidad ${nuevoId}: Nuevo Módulo`,
        icono: "📘",
        parte: Math.ceil(nuevoId / 3),
        clases: `Unidad ${nuevoId}`,
        insignia: {
            nombre: `Nueva Insignia ${nuevoId}`,
            emoji: "🎖️",
            descripcion: `Completaste la Unidad ${nuevoId}`
        },
        estado: "no-iniciado"
    };
    
    MODULOS.push(nuevoModulo);
    estadoAdmin.modulosEditados[nuevoId] = '<h2>Introducción</h2>\n<p>Contenido del nuevo módulo...</p>';
    estadoAdmin.evaluacionesEditadas[nuevoId] = {
        tipo: 'escape-room',
        titulo: 'Nueva Evaluación',
        descripcion: 'Descripción de la evaluación',
        aprobacion: 60,
        habitaciones: []
    };
    
    guardarDatosAdmin();
    renderizarListaModulosAdmin();
    renderizarListaInsigniasAdmin();
    cargarSelectorModulosEval();
    mostrarNotificacion('✅ Nuevo módulo agregado exitosamente');
}

function editarModuloAdmin(moduloId) {
    const modulo = MODULOS.find(m => m.id === moduloId);
    if (!modulo) return;
    
    estadoAdmin.moduloEnEdicion = moduloId;
    estadoAdmin.modoEdicionSeccion = true; // Siempre en modo edición por sección
    estadoAdmin.seccionActualEdicion = 0;
    
    const contenidoActual = estadoAdmin.modulosEditados[moduloId] || '';
    const secciones = dividirEnSecciones(contenidoActual);
    const cantidadSecciones = secciones.length || 0;
    
    const modal = crearModalEditor();
    modal.innerHTML = `
        <div class="editor-modulo-admin editor-visual">
            <div class="header-editor-mejorado">
                <div class="titulo-header-editor">
                    <h3>📝 Editar Módulo</h3>
                    <p class="subtitulo-editor">${modulo.titulo}</p>
                </div>
                <div class="acciones-header-editor">
                    <button class="boton-guardar-grande" onclick="guardarEdicionModulo()">
                        <span class="icono-btn">💾</span>
                        <span class="texto-btn">Guardar Cambios</span>
                    </button>
                    <button class="boton-cerrar-grande" onclick="cerrarEditorModulo()">
                        <span class="icono-btn">✕</span>
                        <span class="texto-btn">Cerrar</span>
                    </button>
                </div>
            </div>
            
            <div class="contenido-editor-visual">
                <!-- Panel Lateral ANCHO: Configuración del Módulo -->
                <div class="panel-lateral-editor panel-lateral-ancho">
                    <div class="seccion-panel">
                        <h4>⚙️ Configuración General</h4>
                        
                        <div class="campo-editor">
                            <label>Título del módulo:</label>
                            <input type="text" id="tituloModulo" value="${modulo.titulo}" class="input-admin" placeholder="Ej: Unidad I: Introducción">
                        </div>
                        
                        <div class="campo-editor">
                            <label>Ícono del módulo:</label>
                            <div class="selector-emoji-mejorado">
                                <input type="text" id="iconoModulo" value="${modulo.icono}" class="input-admin input-emoji-grande" maxlength="2" readonly>
                                <div class="sugerencias-emoji-grid">
                                    ${['📚', '🧠', '🔗', '🤖', '🛠️', '📈', '💡', '🎯', '⚙️', '🌟', '📘', '🎓', '🔬', '⚡', '🌀'].map(e => 
                                        `<button class="emoji-sugerido" onclick="seleccionarEmojiModulo('${e}')" type="button">${e}</button>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="seccion-panel">
                        <h4>🏆 Insignia Vinculada</h4>
                        ${modulo.insignia ? `
                            <div class="preview-insignia-vinculada">
                                <div class="insignia-preview-card">
                                    <span class="emoji-insignia-grande">${modulo.insignia.emoji}</span>
                                    <div class="info-insignia-preview">
                                        <strong>${modulo.insignia.nombre}</strong>
                                        <p>${modulo.insignia.descripcion}</p>
                                    </div>
                                </div>
                                <button class="boton-editar-insignia-inline" onclick="editarInsigniaDesdeModulo(${moduloId})" type="button">
                                    ✏️ Editar Insignia
                                </button>
                            </div>
                        ` : '<p class="texto-ayuda-pequeño">Sin insignia vinculada</p>'}
                    </div>
                    
                    <div class="seccion-panel seccion-secciones-navegables">
                        <div class="header-seccion-panel">
                            <h4>📑 Secciones (${cantidadSecciones})</h4>
                        </div>
                        <p class="texto-ayuda-pequeño">Click en una sección para editarla</p>
                        <div id="listaSecciones" class="lista-secciones-navegables">
                            <!-- Se genera dinámicamente -->
                        </div>
                        <button class="boton-agregar-seccion" onclick="agregarNuevaSeccion()" type="button">
                            ➕ Agregar Sección Nueva
                        </button>
                    </div>
                    
                    <div class="seccion-panel">
                        <h4>🎮 Evaluación Vinculada</h4>
                        <select id="evaluacionVinculada" class="select-admin" onchange="cambiarTipoEvaluacion(${moduloId})">
                            <option value="">Sin evaluación</option>
                            ${obtenerOpcionesEvaluaciones(moduloId)}
                        </select>
                        <button class="boton-configurar-eval" onclick="abrirConfiguradorEvaluacion(${moduloId})" type="button">
                            ⚙️ Configurar Preguntas
                        </button>
                    </div>
                </div>
                
                <!-- Panel Principal: Editor de Contenido -->
                <div class="panel-principal-editor">
                    <div class="toolbar-editor">
                        <button class="btn-toolbar" onclick="formatearTextoEditor('bold')" title="Negrita" type="button">
                            <strong>B</strong>
                        </button>
                        <button class="btn-toolbar" onclick="formatearTextoEditor('italic')" title="Cursiva" type="button">
                            <em>I</em>
                        </button>
                        <button class="btn-toolbar" onclick="formatearTextoEditor('underline')" title="Subrayado" type="button">
                            <u>U</u>
                        </button>
                        <span class="separador-toolbar"></span>
                        <select class="select-toolbar select-color" onchange="cambiarColorTexto(this.value); this.value='';" title="Color de Texto">
                            <option value="">🎨 Color</option>
                            <option value="#1f2937">⚫ Negro</option>
                            <option value="#7c3aed">🟣 Morado</option>
                            <option value="#3b82f6">🔵 Azul</option>
                            <option value="#10b981">🟢 Verde</option>
                            <option value="#ef4444">🔴 Rojo</option>
                            <option value="#f59e0b">🟠 Naranja</option>
                        </select>
                        <select class="select-toolbar select-size" onchange="cambiarTamañoTexto(this.value); this.value='';" title="Tamaño de Texto">
                            <option value="">📏 Tamaño</option>
                            <option value="1">Pequeño</option>
                            <option value="3">Normal</option>
                            <option value="5">Grande</option>
                            <option value="7">Muy Grande</option>
                        </select>
                        <span class="separador-toolbar"></span>
                        <button class="btn-toolbar" onclick="formatearTextoEditor('justifyLeft')" title="Alinear Izquierda" type="button">
                            ⬅
                        </button>
                        <button class="btn-toolbar" onclick="formatearTextoEditor('justifyCenter')" title="Centrar" type="button">
                            ⬌
                        </button>
                        <button class="btn-toolbar" onclick="formatearTextoEditor('justifyRight')" title="Alinear Derecha" type="button">
                            ➡
                        </button>
                        <span class="separador-toolbar"></span>
                        <button class="btn-toolbar" onclick="insertarElementoEditor('h2')" title="Título H2 (Crea Sección)" type="button">
                            H2
                        </button>
                        <button class="btn-toolbar" onclick="insertarElementoEditor('h3')" title="Subtítulo H3" type="button">
                            H3
                        </button>
                        <button class="btn-toolbar" onclick="convertirAParrafo()" title="Convertir a Párrafo Normal" type="button">
                            P
                        </button>
                        <span class="separador-toolbar"></span>
                        <button class="btn-toolbar" onclick="formatearTextoEditor('insertUnorderedList')" title="Lista" type="button">
                            ≡
                        </button>
                        <button class="btn-toolbar" onclick="formatearTextoEditor('insertOrderedList')" title="Lista Numerada" type="button">
                            1.
                        </button>
                        <span class="separador-toolbar"></span>
                        <button class="btn-toolbar btn-espacio" onclick="insertarEstiloPredefinido('espacio')" title="Insertar Espacio entre Elementos" type="button">
                            ⬇️
                        </button>
                        <span class="separador-toolbar"></span>
                        <button class="btn-toolbar btn-galeria-elementos" onclick="abrirGaleriaElementos()" title="Galería de Elementos" type="button">
                            🎨 Insertar Elemento
                        </button>
                    </div>
                    
                    <div class="contenedor-editor-contenido">
                        <div id="editorContenidoVisual" class="editor-contenido-visual" contenteditable="true">
                            ${contenidoActual || '<p>Escribe aquí el contenido del módulo...</p>'}
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Inicializar el editor
    inicializarEditorVisual(moduloId);
    actualizarVistaPreviewSecciones();
    
    // Mostrar ayuda temporal que desaparece
    mostrarAyudaTemporal(estadoAdmin.seccionActualEdicion + 1, cantidadSecciones);
}

function mostrarAyudaTemporal(seccionActual, totalSecciones) {
    // Remover ayuda anterior si existe
    const ayudaAnterior = document.getElementById('ayudaEditorTemporal');
    if (ayudaAnterior) ayudaAnterior.remove();
    
    const ayuda = document.createElement('div');
    ayuda.id = 'ayudaEditorTemporal';
    ayuda.className = 'ayuda-editor-flotante';
    ayuda.innerHTML = `
        💡 <strong>Sección ${seccionActual}/${totalSecciones}</strong> — 
        ⬇️ espacio • Ctrl+C/V copia estilos • 🎨 galería
        <button class="btn-cerrar-ayuda-flotante" onclick="this.parentElement.remove()">✕</button>
    `;
    
    const editor = document.querySelector('.contenedor-editor-contenido');
    if (editor) {
        editor.appendChild(ayuda);
        
        // Desaparecer después de 4 segundos
        setTimeout(() => {
            if (ayuda.parentElement) {
                ayuda.classList.add('desvaneciendo');
                setTimeout(() => ayuda.remove(), 500);
            }
        }, 4000);
    }
}

function guardarEdicionModulo() {
    const moduloId = estadoAdmin.moduloEnEdicion;
    const modulo = MODULOS.find(m => m.id === moduloId);
    
    const nuevoTitulo = document.getElementById('tituloModulo').value;
    const nuevoIcono = document.getElementById('iconoModulo').value;
    const editor = document.getElementById('editorContenidoVisual');
    
    // Validaciones básicas
    if (!nuevoTitulo.trim()) {
        mostrarNotificacionError('❌ El título no puede estar vacío');
        return;
    }
    
    if (!nuevoIcono.trim()) {
        mostrarNotificacionError('❌ Debes seleccionar un ícono');
        return;
    }
    
    // Reconstruir contenido completo desde las secciones temporales
    let nuevoContenido;
    if (estadoAdmin.seccionesTemporales && estadoAdmin.seccionesTemporales.length > 0) {
        // Actualizar la sección actual que está en el editor
        estadoAdmin.seccionesTemporales[estadoAdmin.seccionActualEdicion] = editor.innerHTML;
        
        // Validar que ninguna sección tenga título vacío
        for (let i = 0; i < estadoAdmin.seccionesTemporales.length; i++) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(estadoAdmin.seccionesTemporales[i], 'text/html');
            const titulo = doc.querySelector('h2, h3');
            const tituloTexto = titulo ? titulo.textContent.trim() : '';
            
            if (!tituloTexto) {
                mostrarNotificacionError(`❌ La sección ${i + 1} no tiene título. Cada sección debe comenzar con un H2 o H3.`);
                navegarSeccionEditor(i);
                return;
            }
        }
        
        // Unir todas las secciones
        nuevoContenido = estadoAdmin.seccionesTemporales.join('');
    } else {
        nuevoContenido = editor.innerHTML;
    }
    
    // Actualizar en MODULOS (para que se refleje en sidebar y dashboard)
    modulo.titulo = nuevoTitulo;
    modulo.icono = nuevoIcono;
    
    // Actualizar en estadoAdmin
    estadoAdmin.modulosEditados[moduloId] = nuevoContenido;
    
    // Limpiar secciones temporales
    estadoAdmin.seccionesTemporales = null;
    
    // Manejar la evaluación vinculada
    const tipoEvaluacion = document.getElementById('evaluacionVinculada').value;
    if (tipoEvaluacion && !estadoAdmin.evaluacionesEditadas[moduloId]) {
        // Crear evaluación si seleccionó un tipo y no existe
        crearEvaluacion(moduloId, tipoEvaluacion);
    }
    
    // Guardar y actualizar vistas
    guardarDatosAdmin();
    renderizarListaModulosAdmin();
    cerrarEditorModulo();
    mostrarNotificacion('✅ Módulo actualizado exitosamente');
}

function eliminarModuloAdmin(moduloId) {
    mostrarModalConfirmacion(`¿Eliminar el módulo ${moduloId}? Esta acción no se puede deshacer.`, () => {
        ejecutarEliminacionModulo(moduloId);
    });
}

function ejecutarEliminacionModulo(moduloId) {
    
    const index = MODULOS.findIndex(m => m.id === moduloId);
    if (index > -1) {
        MODULOS.splice(index, 1);
        delete estadoAdmin.modulosEditados[moduloId];
        delete estadoAdmin.evaluacionesEditadas[moduloId];
        
        guardarDatosAdmin();
        renderizarListaModulosAdmin();
        renderizarListaInsigniasAdmin();
        cargarSelectorModulosEval();
        mostrarNotificacion('✅ Módulo eliminado. Recarga la página para reflejar los cambios.');
    }
}

function cerrarEditorModulo() {
    const modal = document.getElementById('modalEditorAdmin');
    if (modal) modal.remove();
    estadoAdmin.moduloEnEdicion = null;
    estadoAdmin.seccionesTemporales = null;
    estadoAdmin.seccionActualEdicion = 0;
}

function crearModalEditor() {
    let modal = document.getElementById('modalEditorAdmin');
    if (modal) modal.remove();
    
    modal = document.createElement('div');
    modal.id = 'modalEditorAdmin';
    modal.className = 'modal-editor-admin modal-editor-modulo';
    return modal;
}

// ===== GESTIÓN DE EVALUACIONES =====

function cargarSelectorModulosEval() {
    const selector = document.getElementById('selectorModuloEval');
    const valorAnterior = selector.value; // Guardar valor anterior si existe
    
    selector.innerHTML = '<option value="">-- Seleccione un módulo --</option>';
    
    MODULOS.forEach(modulo => {
        if (modulo.id !== 0) { // Excluir módulo de bienvenida
            const option = document.createElement('option');
            option.value = modulo.id;
            option.textContent = `${modulo.titulo}`;
            selector.appendChild(option);
        }
    });
    
    // Si había un valor anterior, restaurarlo y cargar la evaluación
    if (valorAnterior) {
        selector.value = valorAnterior;
        cargarEditorEvaluacion();
    }
}

function cargarEditorEvaluacion() {
    const selector = document.getElementById('selectorModuloEval');
    const valorSelector = selector ? selector.value : '';
    const moduloId = parseInt(valorSelector);
    
    if (isNaN(moduloId)) {
        document.getElementById('editorEvaluacion').innerHTML = '<p class="texto-placeholder">👈 Selecciona un módulo para editar su evaluación</p>';
        return;
    }
    
    // Usar helper para obtener evaluación (maneja claves numéricas y string)
    const evaluacion = obtenerEvaluacionAdmin(moduloId);
    const container = document.getElementById('editorEvaluacion');
    
    if (!evaluacion) {
        container.innerHTML = `
            <div class="crear-evaluacion">
                <h3>No hay evaluación para este módulo</h3>
                <p>Selecciona el tipo de evaluación que deseas crear:</p>
                <div class="opciones-tipo-eval">
                    <button class="boton-tipo-eval" onclick="crearEvaluacion(${moduloId}, 'escape-room')">🏰 Escape Room</button>
                    <button class="boton-tipo-eval" onclick="crearEvaluacion(${moduloId}, 'pasapalabra')">🔤 Pasapalabra</button>
                    <button class="boton-tipo-eval" onclick="crearEvaluacion(${moduloId}, 'quiz-tiempo')">⏱️ Quiz con Tiempo</button>
                    <button class="boton-tipo-eval" onclick="crearEvaluacion(${moduloId}, 'conectar')">🔗 Conectar Conceptos</button>
                    <button class="boton-tipo-eval" onclick="crearEvaluacion(${moduloId}, 'casos-practicos')">📋 Casos Prácticos</button>
                </div>
            </div>
        `;
        return;
    }
    
    renderizarEditorEvaluacionSegunTipo(moduloId, evaluacion);
}

function crearEvaluacion(moduloId, tipo) {
    const id = String(moduloId); // Normalizar a string
    const plantillas = {
        'escape-room': {
            tipo: 'escape-room',
            titulo: 'Nueva Escape Room',
            descripcion: 'Descripción de la evaluación',
            aprobacion: 60,
            habitaciones: []
        },
        'pasapalabra': {
            tipo: 'pasapalabra',
            titulo: 'Nuevo Pasapalabra',
            descripcion: 'Rosco de letras',
            aprobacion: 60,
            letras: []
        },
        'quiz-tiempo': {
            tipo: 'quiz-tiempo',
            titulo: 'Nuevo Quiz con Tiempo',
            descripcion: 'Preguntas cronometradas',
            aprobacion: 60,
            preguntas: []
        },
        'conectar': {
            tipo: 'conectar',
            titulo: 'Conectar Conceptos',
            descripcion: 'Empareja los conceptos',
            aprobacion: 60,
            rondas: []
        },
        'casos-practicos': {
            tipo: 'casos-practicos',
            titulo: 'Casos Prácticos',
            descripcion: 'Análisis de situaciones',
            aprobacion: 60,
            casos: []
        }
    };
    
    estadoAdmin.evaluacionesEditadas[id] = plantillas[tipo];
    guardarDatosAdmin();
    cargarEditorEvaluacion();
    mostrarNotificacion('✅ Evaluación creada');
}

function renderizarEditorEvaluacionSegunTipo(moduloId, evaluacion) {
    const container = document.getElementById('editorEvaluacion');
    const modulo = MODULOS.find(m => m.id === moduloId);
    
    container.innerHTML = `
        <div class="editor-eval-completo">
            <div class="header-eval-simple">
                <div>
                    <h3>🎮 ${modulo.titulo}</h3>
                    <p class="tipo-eval-badge">Tipo: ${evaluacion.tipo}</p>
                </div>
                <button class="boton-abrir-editor-completo" onclick="abrirConfiguradorEvaluacion(${moduloId})">
                    ⚙️ Abrir Editor Completo
                </button>
            </div>
            
            <div class="form-eval-basico">
                <div class="campo-editor">
                    <label>Título de la evaluación:</label>
                    <input type="text" id="tituloEval" value="${evaluacion.titulo}" class="input-admin">
                </div>
                
                <div class="campo-editor">
                    <label>Descripción:</label>
                    <input type="text" id="descripcionEval" value="${evaluacion.descripcion}" class="input-admin">
                </div>
                
                <div class="campo-editor">
                    <label>Porcentaje para aprobar (%):</label>
                    <input type="number" id="aprobacionEval" value="${evaluacion.aprobacion}" class="input-admin" min="0" max="100">
                </div>
            </div>
            
            <button class="boton-admin boton-guardar" onclick="guardarDatosBasicosEval(${moduloId})">💾 Guardar Configuración Básica</button>
            
            <hr style="margin: 2rem 0;">
            
            <div id="editorContenidoEval">
                ${renderizarEditorContenidoEspecifico(moduloId, evaluacion)}
            </div>
            
            <div class="aviso-editor-completo">
                <p>💡 <strong>Tip:</strong> Para editar cada pregunta, habitación o letra de forma detallada, click en <strong>"⚙️ Abrir Editor Completo"</strong> arriba.</p>
            </div>
        </div>
    `;
}

function guardarDatosBasicosEval(moduloId) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.titulo = document.getElementById('tituloEval').value;
    evaluacion.descripcion = document.getElementById('descripcionEval').value;
    evaluacion.aprobacion = parseInt(document.getElementById('aprobacionEval').value);
    
    guardarDatosAdmin();
    mostrarNotificacion('✅ Datos básicos guardados');
}

function renderizarEditorContenidoEspecifico(moduloId, evaluacion) {
    switch (evaluacion.tipo) {
        case 'escape-room':
            return renderizarEditorEscapeRoom(moduloId, evaluacion);
        case 'pasapalabra':
            return renderizarEditorPasapalabra(moduloId, evaluacion);
        case 'quiz-tiempo':
            return renderizarEditorQuizTiempo(moduloId, evaluacion);
        case 'conectar':
            return renderizarEditorConectar(moduloId, evaluacion);
        case 'casos-practicos':
            return renderizarEditorCasos(moduloId, evaluacion);
        default:
            return '<p>Tipo de evaluación no reconocido</p>';
    }
}

function renderizarEditorEscapeRoom(moduloId, evaluacion) {
    let html = `
        <h4>🏰 Habitaciones del Escape Room</h4>
        <p class="texto-ayuda-pequeño">Vista rápida. Para editar preguntas detalladamente, usa el botón "⚙️ Abrir Editor Completo" arriba.</p>
        <button class="boton-admin boton-agregar" onclick="agregarHabitacion(${moduloId})">➕ Agregar Habitación</button>
        <div class="lista-items-eval">
    `;
    
    evaluacion.habitaciones.forEach((hab, index) => {
        html += `
            <div class="item-eval-card-preview">
                <div class="info-item-eval">
                    <h5>🚪 Habitación ${index + 1}: ${hab.nombre}</h5>
                    <p>${hab.preguntas.length} pregunta${hab.preguntas.length !== 1 ? 's' : ''} • Tema: ${hab.tema}</p>
                </div>
                <div class="acciones-item-eval">
                    <button class="boton-admin-pequeno boton-eliminar" onclick="eliminarHabitacion(${moduloId}, ${index})">🗑️</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderizarEditorPasapalabra(moduloId, evaluacion) {
    let html = `
        <h4>🔤 Letras del Pasapalabra</h4>
        <p class="texto-ayuda-pequeño">Vista rápida. Para editar definiciones y opciones, usa el botón "⚙️ Abrir Editor Completo" arriba.</p>
        <button class="boton-admin boton-agregar" onclick="agregarLetraPasapalabra(${moduloId})">➕ Agregar Letra</button>
        <div class="lista-items-eval lista-letras-pasapalabra">
    `;
    
    evaluacion.letras.forEach((letra, index) => {
        html += `
            <div class="item-letra-pp-preview">
                <span class="letra-grande-pp">${letra.letra}</span>
                <p class="def-preview">${letra.definicion.substring(0, 40)}...</p>
                <button class="boton-admin-pequeno boton-eliminar" onclick="eliminarLetraPasapalabra(${moduloId}, ${index})">🗑️</button>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderizarEditorQuizTiempo(moduloId, evaluacion) {
    let html = `
        <h4>⏱️ Preguntas del Quiz</h4>
        <p class="texto-ayuda-pequeño">Vista rápida. Para editar opciones y respuestas correctas, usa el botón "⚙️ Abrir Editor Completo" arriba.</p>
        <button class="boton-admin boton-agregar" onclick="agregarPreguntaQuiz(${moduloId})">➕ Agregar Pregunta</button>
        <div class="lista-items-eval">
    `;
    
    evaluacion.preguntas.forEach((preg, index) => {
        html += `
            <div class="item-eval-card-preview">
                <div class="info-item-eval">
                    <h5>❓ Pregunta ${index + 1}</h5>
                    <p>${preg.pregunta.substring(0, 80)}...</p>
                    <small>⏱️ ${preg.tiempo}s • 🎯 ${preg.puntos} puntos</small>
                </div>
                <div class="acciones-item-eval">
                    <button class="boton-admin-pequeno boton-eliminar" onclick="eliminarPreguntaQuiz(${moduloId}, ${index})">🗑️</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderizarEditorConectar(moduloId, evaluacion) {
    let html = `
        <h4>🔗 Rondas de Conexión</h4>
        <p class="texto-ayuda-pequeño">Vista rápida. Para editar pares de conceptos, usa el botón "⚙️ Abrir Editor Completo" arriba.</p>
        <button class="boton-admin boton-agregar" onclick="agregarRondaConectar(${moduloId})">➕ Agregar Ronda</button>
        <div class="lista-items-eval">
    `;
    
    evaluacion.rondas.forEach((ronda, index) => {
        html += `
            <div class="item-eval-card-preview">
                <div class="info-item-eval">
                    <h5>🔗 ${ronda.titulo}</h5>
                    <p>${ronda.pares.length} par${ronda.pares.length !== 1 ? 'es' : ''} a conectar</p>
                </div>
                <div class="acciones-item-eval">
                    <button class="boton-admin-pequeno boton-eliminar" onclick="eliminarRondaConectar(${moduloId}, ${index})">🗑️</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderizarEditorCasos(moduloId, evaluacion) {
    let html = `
        <h4>📋 Casos Prácticos</h4>
        <p class="texto-ayuda-pequeño">Vista rápida. Para editar situaciones y preguntas, usa el botón "⚙️ Abrir Editor Completo" arriba.</p>
        <button class="boton-admin boton-agregar" onclick="agregarCasoPractico(${moduloId})">➕ Agregar Caso</button>
        <div class="lista-items-eval">
    `;
    
    evaluacion.casos.forEach((caso, index) => {
        const situacionPreview = caso.situacion ? caso.situacion.substring(0, 100) : (caso.narrativa ? caso.narrativa.substring(0, 100) : 'Sin descripción');
        const numPreguntas = caso.preguntas ? caso.preguntas.length : 0;
        html += `
            <div class="item-eval-card-preview">
                <div class="info-item-eval">
                    <h5>📋 ${caso.titulo || 'Caso sin título'}</h5>
                    <p>${situacionPreview}...</p>
                    <small>${numPreguntas} pregunta${numPreguntas !== 1 ? 's' : ''}</small>
                </div>
                <div class="acciones-item-eval">
                    <button class="boton-admin-pequeno boton-eliminar" onclick="eliminarCasoPractico(${moduloId}, ${index})">🗑️</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Funciones auxiliares para agregar/editar/eliminar items de evaluaciones

function agregarHabitacion(moduloId) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.habitaciones.push({
        id: evaluacion.habitaciones.length + 1,
        nombre: `Nueva Habitación ${evaluacion.habitaciones.length + 1}`,
        tema: "Tema nuevo",
        narrativa_entrada: "Narrativa de entrada...",
        narrativa_exito: "¡Excelente!",
        preguntas: []
    });
    cargarEditorEvaluacion();
}

function eliminarHabitacion(moduloId, index) {
    mostrarModalConfirmacion('¿Eliminar esta habitación?', () => {
        const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
        evaluacion.habitaciones.splice(index, 1);
        cargarEditorEvaluacion();
        mostrarNotificacionInfo('🗑️ Habitación eliminada');
    });
}

function agregarLetraPasapalabra(moduloId) {
    const letra = prompt('Ingrese la letra (A-Z):');
    if (!letra || letra.length !== 1) return;
    
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.letras.push({
        letra: letra.toUpperCase(),
        definicion: "Nueva definición...",
        opciones: ["Opción 1", "Opción 2", "Opción 3"],
        correcta: 0,
        tipo: "empieza"
    });
    cargarEditorEvaluacion();
}

function eliminarLetraPasapalabra(moduloId, index) {
    mostrarModalConfirmacion('¿Eliminar esta letra?', () => {
        const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
        evaluacion.letras.splice(index, 1);
        cargarEditorEvaluacion();
        mostrarNotificacionInfo('🗑️ Letra eliminada');
    });
}

function agregarPreguntaQuiz(moduloId) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.preguntas.push({
        pregunta: "Nueva pregunta",
        opciones: ["Opción 1", "Opción 2", "Opción 3"],
        correcta: 0,
        tiempo: 15,
        puntos: 100
    });
    cargarEditorEvaluacion();
}

function eliminarPreguntaQuiz(moduloId, index) {
    mostrarModalConfirmacion('¿Eliminar esta pregunta?', () => {
        const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
        evaluacion.preguntas.splice(index, 1);
        cargarEditorEvaluacion();
        mostrarNotificacionInfo('🗑️ Pregunta eliminada');
    });
}

function agregarRondaConectar(moduloId) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.rondas.push({
        titulo: "Nueva ronda",
        pares: []
    });
    cargarEditorEvaluacion();
}

function eliminarRondaConectar(moduloId, index) {
    mostrarModalConfirmacion('¿Eliminar esta ronda?', () => {
        const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
        evaluacion.rondas.splice(index, 1);
        cargarEditorEvaluacion();
        mostrarNotificacionInfo('🗑️ Ronda eliminada');
    });
}

function agregarCasoPractico(moduloId) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.casos.push({
        titulo: "Nuevo caso",
        narrativa: "Descripción del caso...",
        preguntas: []
    });
    cargarEditorEvaluacion();
}

function eliminarCasoPractico(moduloId, index) {
    mostrarModalConfirmacion('¿Eliminar este caso?', () => {
        const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
        evaluacion.casos.splice(index, 1);
        cargarEditorEvaluacion();
        mostrarNotificacionInfo('🗑️ Caso eliminado');
    });
}

// ===== GESTIÓN DE INSIGNIAS =====

function renderizarListaInsigniasAdmin() {
    const lista = document.getElementById('listaInsigniasAdmin');
    lista.innerHTML = '';
    
    MODULOS.filter(m => m.insignia).forEach(modulo => {
        const div = document.createElement('div');
        div.className = 'item-insignia-admin';
        
        div.innerHTML = `
            <div class="info-insignia-admin">
                <span class="icono-insignia-admin">${modulo.insignia.emoji}</span>
                <div class="texto-insignia-admin">
                    <h4>${modulo.insignia.nombre}</h4>
                    <p>${modulo.insignia.descripcion}</p>
                    <small>Vinculada a: ${modulo.titulo}</small>
                </div>
            </div>
            <div class="acciones-insignia-admin">
                <button class="boton-admin-pequeno boton-editar" onclick="editarInsigniaAdmin(${modulo.id})">✏️ Editar</button>
            </div>
        `;
        
        lista.appendChild(div);
    });
}

function agregarNuevaInsignia() {
    mostrarNotificacionInfo('ℹ️ Las insignias se crean automáticamente al crear un nuevo módulo');
}

function editarInsigniaAdmin(moduloId) {
    const modulo = MODULOS.find(m => m.id === moduloId);
    if (!modulo || !modulo.insignia) return;
    
    // Usar el modal existente si hay uno, o crear uno nuevo
    let modal = document.getElementById('modalEditorAdmin');
    if (!modal) {
        modal = crearModalEditor();
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="editor-insignia-admin">
            <div class="header-editor">
                <h3>🏅 Editar Insignia</h3>
                <button class="boton-cerrar-modal" onclick="cerrarEditorInsignia()">×</button>
            </div>
            
            <div class="form-editor">
                <div class="campo-editor">
                    <label>Emoji:</label>
                    <input type="text" id="emojiInsignia" value="${modulo.insignia.emoji}" class="input-admin" maxlength="2">
                </div>
                
                <div class="campo-editor">
                    <label>Nombre:</label>
                    <input type="text" id="nombreInsignia" value="${modulo.insignia.nombre}" class="input-admin">
                </div>
                
                <div class="campo-editor">
                    <label>Descripción:</label>
                    <input type="text" id="descripcionInsignia" value="${modulo.insignia.descripcion}" class="input-admin">
                </div>
                
                <div class="acciones-editor">
                    <button class="boton-admin boton-guardar" onclick="guardarEdicionInsignia(${moduloId})">💾 Guardar</button>
                    <button class="boton-admin boton-cancelar" onclick="cerrarEditorInsignia()">Cancelar</button>
                </div>
            </div>
        </div>
    `;
}

function guardarEdicionInsignia(moduloId) {
    const modulo = MODULOS.find(m => m.id === moduloId);
    
    modulo.insignia.emoji = document.getElementById('emojiInsignia').value;
    modulo.insignia.nombre = document.getElementById('nombreInsignia').value;
    modulo.insignia.descripcion = document.getElementById('descripcionInsignia').value;
    
    guardarDatosAdmin();
    renderizarListaInsigniasAdmin();
    
    // Volver al editor de módulo si estábamos editando uno
    if (estadoAdmin.moduloEnEdicion !== null) {
        editarModuloAdmin(estadoAdmin.moduloEnEdicion);
        mostrarNotificacion('✅ Insignia actualizada. Volviendo al editor de módulo');
    } else {
        const modal = document.getElementById('modalEditorAdmin');
        if (modal) modal.remove();
        mostrarNotificacion('✅ Insignia actualizada');
    }
}

function cerrarEditorInsignia() {
    // Si hay un módulo en edición, volver a él
    if (estadoAdmin.moduloEnEdicion !== null) {
        editarModuloAdmin(estadoAdmin.moduloEnEdicion);
        mostrarNotificacionInfo('↩️ Volviendo al editor de módulo');
    } else {
        const modal = document.getElementById('modalEditorAdmin');
        if (modal) modal.remove();
    }
}

// ===== EDITOR VISUAL DE CONTENIDO =====

function seleccionarEmoji(emoji) {
    document.getElementById('iconoModulo').value = emoji;
}

function obtenerOpcionesEvaluaciones(moduloId) {
    const evaluacionActual = estadoAdmin.evaluacionesEditadas[moduloId];
    // No incluir '' porque ya hay una opción fija "Sin evaluación" en el HTML
    const tipos = {
        'escape-room': '🏰 Escape Room',
        'pasapalabra': '🔤 Pasapalabra',
        'quiz-tiempo': '⏱️ Quiz con Tiempo',
        'conectar': '🔗 Conectar Conceptos',
        'casos-practicos': '📋 Casos Prácticos'
    };
    
    let html = '';
    for (let [tipo, nombre] of Object.entries(tipos)) {
        const seleccionado = evaluacionActual && evaluacionActual.tipo === tipo ? 'selected' : '';
        html += `<option value="${tipo}" ${seleccionado}>${nombre}</option>`;
    }
    return html;
}

function inicializarEditorVisual(moduloId) {
    const editor = document.getElementById('editorContenidoVisual');
    
    // Inicializar secciones temporales
    const contenidoCompleto = estadoAdmin.modulosEditados[moduloId] || '';
    const secciones = dividirEnSecciones(contenidoCompleto);
    estadoAdmin.seccionesTemporales = [...secciones];
    estadoAdmin.seccionActualEdicion = 0;
    
    // Mostrar la primera sección
    if (secciones.length > 0) {
        editor.innerHTML = secciones[0];
    }
    
    // Auto-ocultar la ayuda después de 5 segundos
    setTimeout(() => {
        cerrarAyudaEditor();
    }, 5000);
    
    // Auto-actualizar preview mientras escribe
    let timeoutGuardado;
    editor.addEventListener('input', () => {
        clearTimeout(timeoutGuardado);
        timeoutGuardado = setTimeout(() => {
            // Guardar la sección actual en temporales
            if (estadoAdmin.seccionesTemporales) {
                estadoAdmin.seccionesTemporales[estadoAdmin.seccionActualEdicion] = editor.innerHTML;
            }
            actualizarVistaPreviewSecciones();
        }, 500);
    });
    
    // Manejo de paste: SIEMPRE mantener HTML con estilos cuando se copia del editor
    editor.addEventListener('paste', (e) => {
        // NO prevenir default - dejar que el navegador maneje el paste normalmente
        // Esto preserva TODOS los estilos, clases CSS, estructura HTML, etc.
        
        // Solo actualizar el preview después del paste
        setTimeout(() => {
            if (estadoAdmin.seccionesTemporales) {
                estadoAdmin.seccionesTemporales[estadoAdmin.seccionActualEdicion] = editor.innerHTML;
            }
            actualizarVistaPreviewSecciones();
            console.log('✅ Contenido pegado con formato preservado');
        }, 100);
    });
    
    // Manejo de copy: asegurar que se copie con HTML
    editor.addEventListener('copy', (e) => {
        console.log('📋 Copiando contenido con formato HTML');
    });
    
    // Manejo de cut: asegurar que se corte con HTML
    editor.addEventListener('cut', (e) => {
        console.log('✂️ Cortando contenido con formato HTML');
        setTimeout(() => {
            if (estadoAdmin.seccionesTemporales) {
                estadoAdmin.seccionesTemporales[estadoAdmin.seccionActualEdicion] = editor.innerHTML;
            }
            actualizarVistaPreviewSecciones();
        }, 100);
    });
}

function formatearTextoEditor(comando) {
    document.execCommand(comando, false, null);
    document.getElementById('editorContenidoVisual').focus();
}

function cambiarColorTexto(color) {
    if (!color) return;
    document.execCommand('foreColor', false, color);
    document.getElementById('editorContenidoVisual').focus();
}

function cambiarTamañoTexto(tamaño) {
    if (!tamaño) return;
    document.execCommand('fontSize', false, tamaño);
    document.getElementById('editorContenidoVisual').focus();
}

function convertirAParrafo() {
    document.execCommand('formatBlock', false, '<p>');
    document.getElementById('editorContenidoVisual').focus();
}

function insertarElementoEditor(tipo) {
    const editor = document.getElementById('editorContenidoVisual');
    
    switch(tipo) {
        case 'h2':
            document.execCommand('formatBlock', false, '<h2>');
            break;
        case 'h3':
            document.execCommand('formatBlock', false, '<h3>');
            break;
    }
    
    editor.focus();
    actualizarVistaPreviewSecciones();
}

function insertarEstiloPredefinido(tipo) {
    const editor = document.getElementById('editorContenidoVisual');
    if (!tipo) return;
    
    let html = '';
    
    switch(tipo) {
        case 'destacado':
            html = `
                <p><br></p>
                <div class="concepto-destacado" contenteditable="true">
                    <p class="titulo-bienvenida">Título Destacado</p>
                    <p>Contenido destacado...</p>
                </div>
                <p class="espacio-editable"><br></p>
            `;
            break;
        case 'bienvenida':
            html = `
                <p><br></p>
                <div class="intro-seccion" contenteditable="true">
                    <div class="bienvenida-box">
                        <p class="titulo-bienvenida">Título de Bienvenida</p>
                        <p>Contenido de introducción...</p>
                    </div>
                </div>
                <p class="espacio-editable"><br></p>
            `;
            break;
        case 'motivacion':
            html = `
                <p><br></p>
                <div class="motivacion-box" contenteditable="true">
                    <p class="titulo-motivacion">Título Motivacional</p>
                    <p>Contenido motivacional...</p>
                </div>
                <p class="espacio-editable"><br></p>
            `;
            break;
        case 'ejemplo':
            html = `
                <p><br></p>
                <div class="ejemplo-box" contenteditable="true">
                    <p><strong>Ejemplo:</strong> Descripción del ejemplo...</p>
                </div>
                <p class="espacio-editable"><br></p>
            `;
            break;
        case 'propiedad':
            html = `
                <p><br></p>
                <div class="propiedad-box" contenteditable="true" style="border-left: 4px solid #7c3aed;">
                    <div class="propiedad-nombre">Nombre de la Propiedad</div>
                    <div class="propiedad-desc">Descripción de la propiedad...</div>
                </div>
                <p class="espacio-editable"><br></p>
            `;
            break;
        case 'tipos-grid':
            html = `
                <p><br></p>
                <div class="tipos-grid" contenteditable="true">
                    <div class="tipo-sistema">
                        <div class="tipo-icono">🎯</div>
                        <div class="tipo-nombre">Nombre del Tipo</div>
                        <div class="tipo-desc">Descripción del tipo...</div>
                    </div>
                    <div class="tipo-sistema">
                        <div class="tipo-icono">🔗</div>
                        <div class="tipo-nombre">Otro Tipo</div>
                        <div class="tipo-desc">Otra descripción...</div>
                    </div>
                </div>
                <p class="espacio-editable"><br></p>
            `;
            break;
        case 'tipo-sistema':
            html = `
                <p><br></p>
                <div class="tipo-sistema" contenteditable="true">
                    <div class="tipo-icono">📌</div>
                    <div class="tipo-nombre">Nombre del Concepto</div>
                    <div class="tipo-desc">Descripción del concepto...</div>
                </div>
                <p class="espacio-editable"><br></p>
            `;
            break;
        case 'tabla':
            html = `
                <p><br></p>
                <table class="tabla-mejorada" contenteditable="true">
                    <thead>
                        <tr><th>Columna 1</th><th>Columna 2</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Dato 1</td><td>Dato 2</td></tr>
                        <tr><td>Dato 3</td><td>Dato 4</td></tr>
                    </tbody>
                </table>
                <p class="espacio-editable"><br></p>
            `;
            break;
        case 'tabla-comparativa':
            html = `
                <p><br></p>
                <table class="tabla-comparativa" contenteditable="true">
                    <thead>
                        <tr><th>Aspecto</th><th>Opción A</th><th>Opción B</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Característica 1</td><td>Valor A1</td><td>Valor B1</td></tr>
                        <tr><td>Característica 2</td><td>Valor A2</td><td>Valor B2</td></tr>
                    </tbody>
                </table>
                <p class="espacio-editable"><br></p>
            `;
            break;
        case 'imagen':
            insertarImagenEditor();
            return;
        case 'espacio':
            html = `<p class="espacio-editable"><br></p>`;
            break;
    }
    
    if (html) {
        document.execCommand('insertHTML', false, html);
        editor.focus();
        actualizarVistaPreviewSecciones();
    }
}

function insertarImagenEditor() {
    const nombreImagen = prompt('Ingresa el nombre del archivo de imagen (debe estar en la carpeta /imagenes):\n\nEjemplo: Caja negra.png');
    if (!nombreImagen) return;
    
    const html = `
        <p><br></p>
        <img src="imagenes/${nombreImagen}" alt="${nombreImagen}" style="max-width: 100%; border-radius: 12px; margin: 1rem 0;">
        <p class="espacio-editable"><br></p>
    `;
    document.execCommand('insertHTML', false, html);
    actualizarVistaPreviewSecciones();
}

// ========== GALERÍA DE ELEMENTOS ==========
const ELEMENTOS_GALERIA = [
    // === CAJAS PRINCIPALES ===
    {
        categoria: 'Cajas Principales',
        elementos: [
            {
                id: 'concepto-destacado',
                nombre: 'Concepto Destacado',
                descripcion: 'Cuadro morado para ideas clave',
                html: `<div class="concepto-destacado"><p class="titulo-bienvenida">Título del Concepto</p><p>Descripción del concepto importante...</p></div>`
            },
            {
                id: 'bienvenida-box',
                nombre: 'Caja de Bienvenida',
                descripcion: 'Introducción con fondo degradado',
                html: `<div class="intro-seccion"><div class="bienvenida-box"><p class="titulo-bienvenida">Título de Bienvenida</p><p>Contenido de introducción al tema...</p></div></div>`
            },
            {
                id: 'motivacion-box',
                nombre: 'Caja de Motivación',
                descripcion: 'Para objetivos y motivación',
                html: `<div class="motivacion-box"><p class="titulo-motivacion">Lo que aprenderás:</p><ul><li>Punto importante 1</li><li>Punto importante 2</li><li>Punto importante 3</li></ul></div>`
            },
            {
                id: 'resumen-unidad',
                nombre: 'Resumen de Unidad',
                descripcion: 'Resumen con fondo suave',
                html: `<div class="resumen-unidad"><p>Este módulo introduce los <strong>conceptos fundamentales</strong> del tema. Se analizan las principales características y aplicaciones prácticas.</p></div>`
            }
        ]
    },
    // === CONCEPTOS Y PROPIEDADES ===
    {
        categoria: 'Conceptos y Propiedades',
        elementos: [
            {
                id: 'concepto-box',
                nombre: 'Caja de Concepto',
                descripcion: 'Definición con borde y icono de diamante',
                html: `<div class="concepto-box"><h4>🔷 Nombre del Concepto</h4><p>Es la <strong>definición principal</strong> del concepto. Descripción detallada de qué significa y cómo se aplica.</p><p><strong>En otras palabras:</strong> Una explicación alternativa más simple.</p></div>`
            },
            {
                id: 'concepto-box-con-ejemplo',
                nombre: 'Concepto con Ejemplo',
                descripcion: 'Concepto con caja de ejemplo anidada',
                html: `<div class="concepto-box"><h4>🔷 Nombre del Concepto</h4><p>Es la <strong>definición principal</strong> del concepto con todos sus atributos y características.</p><p><strong>Importante:</strong> Punto clave a recordar sobre este concepto.</p><div class="ejemplo-box"><p><strong>Ejemplo:</strong> Un caso práctico que ilustra cómo se aplica este concepto en situaciones reales.</p></div></div>`
            },
            {
                id: 'concepto-box-con-lista-ejemplos',
                nombre: 'Concepto con Lista de Ejemplos',
                descripcion: 'Concepto con ejemplos en lista',
                html: `<div class="concepto-box"><h4>🔷 Nombre del Concepto</h4><p>Definición del concepto explicada de manera clara y concisa.</p><div class="ejemplo-box"><h5>📍 Ejemplos:</h5><ul><li><strong>Ejemplo 1:</strong> Descripción del primer ejemplo práctico</li><li><strong>Ejemplo 2:</strong> Descripción del segundo ejemplo práctico</li></ul></div></div>`
            },
            {
                id: 'propiedad-box',
                nombre: 'Propiedad',
                descripcion: 'Propiedad con borde lateral',
                html: `<div class="propiedad-box"><div class="propiedad-nombre">Nombre de la Propiedad</div><div class="propiedad-desc">Descripción de la propiedad y su significado...</div></div>`
            },
            {
                id: 'nota-importante',
                nombre: 'Nota Importante',
                descripcion: 'Nota con icono de advertencia',
                html: `<div class="nota-importante"><p>💡 <strong>Nota:</strong> Información importante que el estudiante debe recordar...</p></div>`
            },
            {
                id: 'alerta-box',
                nombre: 'Alerta',
                descripcion: 'Advertencia o precaución',
                html: `<div class="alerta-box"><p>⚠️ <strong>Atención:</strong> Punto crítico a tener en cuenta...</p></div>`
            },
            {
                id: 'nota-info',
                nombre: 'Nota Informativa',
                descripcion: 'Información adicional',
                html: `<div class="nota-info"><p>ℹ️ Información complementaria sobre el tema...</p></div>`
            },
            {
                id: 'cita-destacada',
                nombre: 'Cita Destacada',
                descripcion: 'Cita de autor o fuente',
                html: `<div class="cita-destacada"><p>"Cita importante o frase célebre relacionada con el tema."</p><p><em>— Nombre del Autor</em></p></div>`
            }
        ]
    },
    // === EJEMPLOS ===
    {
        categoria: 'Ejemplos',
        elementos: [
            {
                id: 'ejemplo-box',
                nombre: 'Ejemplo Simple',
                descripcion: 'Ejemplo con fondo celeste',
                html: `<div class="ejemplo-box"><p><strong>Ejemplo:</strong> Descripción del ejemplo práctico aplicado al contexto del concepto explicado.</p></div>`
            },
            {
                id: 'ejemplo-box-con-titulo',
                nombre: 'Ejemplo con Título',
                descripcion: 'Ejemplo con encabezado destacado',
                html: `<div class="ejemplo-box"><h5>📍 Ejemplos de Aplicación</h5><ul><li><strong>Caso 1:</strong> Descripción del primer caso práctico</li><li><strong>Caso 2:</strong> Descripción del segundo caso práctico</li></ul></div>`
            },
            {
                id: 'ejemplo-practico',
                nombre: 'Ejemplo Práctico',
                descripcion: 'Ejemplo detallado con título',
                html: `<div class="ejemplo-practico"><h4>📝 Caso Práctico</h4><p>Descripción detallada del caso...</p><ul><li>Paso o característica 1</li><li>Paso o característica 2</li></ul></div>`
            },
            {
                id: 'ejemplo-destacado',
                nombre: 'Ejemplo Destacado',
                descripcion: 'Ejemplo con título especial',
                html: `<div class="ejemplo-destacado"><p class="titulo-ejemplo">🎯 Ejemplo Ilustrativo</p><p>Contenido del ejemplo con detalles específicos...</p></div>`
            }
        ]
    },
    // === GRIDS Y TARJETAS ===
    {
        categoria: 'Grids y Tarjetas',
        elementos: [
            {
                id: 'tipos-grid',
                nombre: 'Grid de Tipos (2 items)',
                descripcion: 'Cuadrícula de conceptos',
                html: `<div class="tipos-grid"><div class="tipo-sistema"><div class="tipo-icono">🎯</div><div class="tipo-nombre">Concepto A</div><div class="tipo-desc">Descripción breve del concepto A...</div></div><div class="tipo-sistema"><div class="tipo-icono">🔗</div><div class="tipo-nombre">Concepto B</div><div class="tipo-desc">Descripción breve del concepto B...</div></div></div>`
            },
            {
                id: 'tipos-grid-3',
                nombre: 'Grid de Tipos (3 items)',
                descripcion: 'Cuadrícula con 3 elementos',
                html: `<div class="tipos-grid"><div class="tipo-sistema"><div class="tipo-icono">📊</div><div class="tipo-nombre">Tipo 1</div><div class="tipo-desc">Descripción...</div></div><div class="tipo-sistema"><div class="tipo-icono">🔄</div><div class="tipo-nombre">Tipo 2</div><div class="tipo-desc">Descripción...</div></div><div class="tipo-sistema"><div class="tipo-icono">⚙️</div><div class="tipo-nombre">Tipo 3</div><div class="tipo-desc">Descripción...</div></div></div>`
            },
            {
                id: 'tipo-sistema',
                nombre: 'Tarjeta Individual',
                descripcion: 'Una tarjeta de tipo/concepto',
                html: `<div class="tipo-sistema"><div class="tipo-icono">📌</div><div class="tipo-nombre">Nombre del Concepto</div><div class="tipo-desc">Descripción del concepto o tipo...</div></div>`
            },
            {
                id: 'tipo-card',
                nombre: 'Tarjeta Expandida',
                descripcion: 'Tarjeta con más contenido',
                html: `<div class="tipo-card"><div class="tipo-header"><span class="tipo-icono">🎯</span><span class="tipo-nombre">Título de la Tarjeta</span></div><div class="tipo-content"><div class="tipo-desc">Descripción detallada del contenido de esta tarjeta...</div></div></div>`
            }
        ]
    },
    // === TABLAS ===
    {
        categoria: 'Tablas',
        elementos: [
            {
                id: 'tabla-comparativa',
                nombre: 'Tabla Comparativa',
                descripcion: 'Comparar 2 opciones',
                html: `<table class="tabla-comparativa"><thead><tr><th>Aspecto</th><th>Opción A</th><th>Opción B</th></tr></thead><tbody><tr><td>Característica 1</td><td>Valor A1</td><td>Valor B1</td></tr><tr><td>Característica 2</td><td>Valor A2</td><td>Valor B2</td></tr></tbody></table>`
            },
            {
                id: 'tabla-simple',
                nombre: 'Tabla Simple',
                descripcion: 'Tabla básica de datos',
                html: `<table class="tabla-simple"><thead><tr><th>Columna 1</th><th>Columna 2</th></tr></thead><tbody><tr><td>Dato 1</td><td>Dato 2</td></tr><tr><td>Dato 3</td><td>Dato 4</td></tr></tbody></table>`
            },
            {
                id: 'tabla-ejemplos',
                nombre: 'Tabla de Ejemplos',
                descripcion: 'Tabla con ejemplos',
                html: `<table class="tabla-ejemplos"><thead><tr><th>Concepto</th><th>Ejemplo</th><th>Aplicación</th></tr></thead><tbody><tr><td>Concepto 1</td><td>Ejemplo práctico</td><td>Uso en la práctica</td></tr><tr><td>Concepto 2</td><td>Otro ejemplo</td><td>Otra aplicación</td></tr></tbody></table>`
            }
        ]
    },
    // === LISTAS ===
    {
        categoria: 'Listas Especiales',
        elementos: [
            {
                id: 'lista-destacada',
                nombre: 'Lista Destacada',
                descripcion: 'Lista con estilo especial',
                html: `<ul class="lista-destacada"><li>Punto importante primero</li><li>Segundo punto a destacar</li><li>Tercer punto relevante</li></ul>`
            },
            {
                id: 'lista-consejos',
                nombre: 'Lista de Consejos',
                descripcion: 'Consejos o tips',
                html: `<ul class="lista-consejos"><li>💡 Consejo práctico 1</li><li>💡 Consejo práctico 2</li><li>💡 Consejo práctico 3</li></ul>`
            },
            {
                id: 'consejos-box',
                nombre: 'Caja de Consejos',
                descripcion: 'Sección de consejos',
                html: `<div class="consejos-box"><h4>📌 Consejos Prácticos</h4><ul><li>Primer consejo importante</li><li>Segundo consejo útil</li><li>Tercer consejo clave</li></ul></div>`
            }
        ]
    },
    // === COMPARACIONES ===
    {
        categoria: 'Comparaciones',
        elementos: [
            {
                id: 'concepto-vs',
                nombre: 'Comparación VS',
                descripcion: 'Positivo vs Negativo',
                html: `<div class="concepto-vs"><div class="vs-item positivo"><h5>✅ Ventajas</h5><ul><li>Punto positivo 1</li><li>Punto positivo 2</li></ul></div><div class="vs-item negativo"><h5>❌ Desventajas</h5><ul><li>Punto negativo 1</li><li>Punto negativo 2</li></ul></div></div>`
            },
            {
                id: 'vs-item-positivo',
                nombre: 'Item Positivo',
                descripcion: 'Solo ventajas',
                html: `<div class="vs-item positivo"><h5>✅ Aspectos Positivos</h5><ul><li>Beneficio 1</li><li>Beneficio 2</li><li>Beneficio 3</li></ul></div>`
            },
            {
                id: 'vs-item-negativo',
                nombre: 'Item Negativo',
                descripcion: 'Solo desventajas',
                html: `<div class="vs-item negativo"><h5>❌ Aspectos a Mejorar</h5><ul><li>Limitación 1</li><li>Limitación 2</li></ul></div>`
            }
        ]
    },
    // === PASOS Y PROCESOS ===
    {
        categoria: 'Pasos y Procesos',
        elementos: [
            {
                id: 'paso-guia',
                nombre: 'Guía de Pasos',
                descripcion: 'Pasos numerados',
                html: `<div class="paso-guia"><div class="paso-item"><div class="numero-paso">1</div><div class="contenido-paso"><div class="titulo-paso">Primer Paso</div><p>Descripción del primer paso...</p></div></div><div class="paso-item"><div class="numero-paso">2</div><div class="contenido-paso"><div class="titulo-paso">Segundo Paso</div><p>Descripción del segundo paso...</p></div></div><div class="paso-item"><div class="numero-paso">3</div><div class="contenido-paso"><div class="titulo-paso">Tercer Paso</div><p>Descripción del tercer paso...</p></div></div></div>`
            },
            {
                id: 'paso-item',
                nombre: 'Paso Individual',
                descripcion: 'Un solo paso',
                html: `<div class="paso-item"><div class="numero-paso">1</div><div class="contenido-paso"><div class="titulo-paso">Título del Paso</div><p>Descripción de lo que hay que hacer en este paso...</p></div></div>`
            },
            {
                id: 'proceso-pasos',
                nombre: 'Proceso con Iconos',
                descripcion: 'Pasos con iconos',
                html: `<div class="proceso-pasos"><div class="paso-item"><div class="icono-paso">📋</div><div class="contenido-paso"><div class="titulo-paso">Planificar</div><p>Definir objetivos y alcance</p></div></div><div class="paso-item"><div class="icono-paso">🔧</div><div class="contenido-paso"><div class="titulo-paso">Ejecutar</div><p>Implementar la solución</p></div></div><div class="paso-item"><div class="icono-paso">✅</div><div class="contenido-paso"><div class="titulo-paso">Verificar</div><p>Evaluar resultados</p></div></div></div>`
            }
        ]
    },
    // === OTROS ===
    {
        categoria: 'Otros Elementos',
        elementos: [
            {
                id: 'conclusion-box',
                nombre: 'Conclusión',
                descripcion: 'Cierre de sección',
                html: `<div class="conclusion-box"><h4>📌 Conclusión</h4><p>En resumen, los puntos clave de esta sección son...</p></div>`
            },
            {
                id: 'principios-box',
                nombre: 'Principios',
                descripcion: 'Lista de principios',
                html: `<div class="principios-box"><h4>📜 Principios Fundamentales</h4><ol><li><strong>Primer principio:</strong> Descripción...</li><li><strong>Segundo principio:</strong> Descripción...</li><li><strong>Tercer principio:</strong> Descripción...</li></ol></div>`
            },
            {
                id: 'imagen-arquetipo',
                nombre: 'Contenedor de Imagen',
                descripcion: 'Imagen con estilo',
                html: `<div class="imagen-arquetipo"><img src="imagenes/ejemplo.png" alt="Descripción de la imagen" style="max-width: 100%;"></div>`
            },
            {
                id: 'texto-centrado',
                nombre: 'Texto Centrado',
                descripcion: 'Párrafo centrado',
                html: `<p class="texto-centrado"><strong>Texto importante centrado</strong></p>`
            }
        ]
    }
];

function abrirGaleriaElementos() {
    // Verificar que estamos en modo de edición de módulo
    const modalEdicion = document.querySelector('.modal-editor-modulo');
    if (!modalEdicion) {
        console.error('La galería solo funciona dentro del editor de módulos');
        return;
    }
    
    // Verificar si ya existe una galería abierta
    if (document.getElementById('galeriaElementosOverlay')) {
        return;
    }
    
    // Crear overlay como elemento fijo sobre todo
    const overlay = document.createElement('div');
    overlay.id = 'galeriaElementosOverlay';
    overlay.className = 'galeria-overlay-interno';
    overlay.onclick = (e) => {
        if (e.target === overlay) cerrarGaleriaElementos();
    };
    
    let categoriasHTML = ELEMENTOS_GALERIA.map(cat => `
        <div class="galeria-categoria">
            <h3 class="galeria-categoria-titulo">${cat.categoria}</h3>
            <div class="galeria-elementos-grid">
                ${cat.elementos.map(elem => `
                    <div class="galeria-elemento-card" onclick="seleccionarElementoGaleria('${elem.id}')" data-elemento-id="${elem.id}">
                        <div class="galeria-elemento-preview">
                            ${elem.html}
                        </div>
                        <div class="galeria-elemento-info">
                            <strong>${elem.nombre}</strong>
                            <span>${elem.descripcion}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    overlay.innerHTML = `
        <div class="galeria-modal">
            <div class="galeria-header">
                <h2>🎨 Galería de Elementos</h2>
                <p>Haz clic en un elemento para insertarlo en el editor</p>
                <button class="btn-cerrar-galeria" onclick="cerrarGaleriaElementos()">✕</button>
            </div>
            <div class="galeria-busqueda">
                <input type="text" id="busquedaGaleria" placeholder="🔍 Buscar elemento..." oninput="filtrarGaleria(this.value)">
            </div>
            <div class="galeria-contenido">
                ${categoriasHTML}
            </div>
            <div class="galeria-footer">
                <button class="btn-admin btn-secundario" onclick="insertarImagenEditor(); cerrarGaleriaElementos();">🖼️ Insertar Imagen</button>
                <button class="btn-admin btn-secundario" onclick="cerrarGaleriaElementos()">Cancelar</button>
            </div>
        </div>
    `;
    
    // Agregar al body para que esté sobre todo
    document.body.appendChild(overlay);
    
    // Focus en el buscador
    setTimeout(() => {
        const busqueda = document.getElementById('busquedaGaleria');
        if (busqueda) busqueda.focus();
    }, 100);
}

function cerrarGaleriaElementos() {
    const overlay = document.getElementById('galeriaElementosOverlay');
    if (overlay) {
        overlay.classList.add('cerrando');
        setTimeout(() => overlay.remove(), 200);
    }
}

function filtrarGaleria(texto) {
    texto = texto.toLowerCase();
    document.querySelectorAll('.galeria-elemento-card').forEach(card => {
        const nombre = card.querySelector('.galeria-elemento-info strong').textContent.toLowerCase();
        const desc = card.querySelector('.galeria-elemento-info span').textContent.toLowerCase();
        const visible = nombre.includes(texto) || desc.includes(texto);
        card.style.display = visible ? '' : 'none';
    });
    
    // Ocultar categorías vacías
    document.querySelectorAll('.galeria-categoria').forEach(cat => {
        const visibleCards = cat.querySelectorAll('.galeria-elemento-card:not([style*="display: none"])');
        cat.style.display = visibleCards.length > 0 ? '' : 'none';
    });
}

function seleccionarElementoGaleria(elementoId) {
    let html = '';
    
    // Buscar el elemento en la galería
    for (const cat of ELEMENTOS_GALERIA) {
        const elem = cat.elementos.find(e => e.id === elementoId);
        if (elem) {
            html = `<p><br></p>${elem.html}<p class="espacio-editable"><br></p>`;
            break;
        }
    }
    
    if (html) {
        const editor = document.getElementById('editorContenidoVisual');
        if (editor) {
            editor.focus();
            document.execCommand('insertHTML', false, html);
            actualizarVistaPreviewSecciones();
        }
    }
    
    cerrarGaleriaElementos();
}

// Hacer funciones de galería accesibles globalmente para onclick
window.abrirGaleriaElementos = abrirGaleriaElementos;
window.cerrarGaleriaElementos = cerrarGaleriaElementos;
window.filtrarGaleria = filtrarGaleria;
window.seleccionarElementoGaleria = seleccionarElementoGaleria;

function actualizarVistaPreviewSecciones() {
    const listaSecciones = document.getElementById('listaSecciones');
    if (!listaSecciones) return;
    
    // Usar las secciones temporales si existen, sino dividir el contenido
    let secciones = estadoAdmin.seccionesTemporales;
    if (!secciones) {
        const contenidoCompleto = estadoAdmin.modulosEditados[estadoAdmin.moduloEnEdicion] || '';
        secciones = dividirEnSecciones(contenidoCompleto);
        estadoAdmin.seccionesTemporales = [...secciones];
    }
    
    if (secciones.length === 0) {
        listaSecciones.innerHTML = '<p class="texto-ayuda-pequeño">Sin secciones aún. Usa H2 para crear secciones.</p>';
        return;
    }
    
    listaSecciones.innerHTML = '';
    const totalSecciones = secciones.length;
    
    secciones.forEach((seccionHTML, index) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(seccionHTML, 'text/html');
        const primerTitulo = doc.querySelector('h2, h3');
        const tituloTexto = primerTitulo ? primerTitulo.textContent : `Sección ${index + 1}`;
        const nivel = primerTitulo && primerTitulo.tagName === 'H2' ? 'principal' : 'sub';
        const icono = nivel === 'principal' ? '📑' : '📄';
        
        const div = document.createElement('div');
        div.className = `item-seccion-navegable ${estadoAdmin.seccionActualEdicion === index ? 'activa' : ''}`;
        
        div.innerHTML = `
            <div class="seccion-info" onclick="navegarSeccionEditor(${index})">
                <span class="icono-seccion-preview">${icono}</span>
                <span class="texto-seccion-preview ${nivel}">${tituloTexto}</span>
            </div>
            <div class="seccion-acciones">
                <span class="numero-seccion-badge">${index + 1}</span>
                <button class="btn-seccion-mover ${index === 0 ? 'disabled' : ''}" onclick="moverSeccionArriba(${index}, event)" title="Mover arriba" ${index === 0 ? 'disabled' : ''}>↑</button>
                <button class="btn-seccion-mover ${index === totalSecciones - 1 ? 'disabled' : ''}" onclick="moverSeccionAbajo(${index}, event)" title="Mover abajo" ${index === totalSecciones - 1 ? 'disabled' : ''}>↓</button>
                <button class="btn-seccion-duplicar" onclick="duplicarSeccion(${index}, event)" title="Duplicar sección">📋</button>
                <button class="btn-seccion-eliminar" onclick="eliminarSeccion(${index}, event)" title="Eliminar sección">✕</button>
            </div>
        `;
        
        listaSecciones.appendChild(div);
    });
}

function moverSeccionArriba(index, event) {
    event.stopPropagation();
    if (index <= 0 || !estadoAdmin.seccionesTemporales) return;
    
    // Guardar contenido actual del editor
    const editor = document.getElementById('editorContenidoVisual');
    if (editor && estadoAdmin.seccionActualEdicion !== null) {
        estadoAdmin.seccionesTemporales[estadoAdmin.seccionActualEdicion] = editor.innerHTML;
    }
    
    // Intercambiar secciones
    const temp = estadoAdmin.seccionesTemporales[index];
    estadoAdmin.seccionesTemporales[index] = estadoAdmin.seccionesTemporales[index - 1];
    estadoAdmin.seccionesTemporales[index - 1] = temp;
    
    // Actualizar índice de sección actual si es necesario
    if (estadoAdmin.seccionActualEdicion === index) {
        estadoAdmin.seccionActualEdicion = index - 1;
    } else if (estadoAdmin.seccionActualEdicion === index - 1) {
        estadoAdmin.seccionActualEdicion = index;
    }
    
    // Recargar vista
    navegarSeccionEditor(estadoAdmin.seccionActualEdicion);
    mostrarNotificacion('↑ Sección movida arriba');
}

function moverSeccionAbajo(index, event) {
    event.stopPropagation();
    if (!estadoAdmin.seccionesTemporales || index >= estadoAdmin.seccionesTemporales.length - 1) return;
    
    // Guardar contenido actual del editor
    const editor = document.getElementById('editorContenidoVisual');
    if (editor && estadoAdmin.seccionActualEdicion !== null) {
        estadoAdmin.seccionesTemporales[estadoAdmin.seccionActualEdicion] = editor.innerHTML;
    }
    
    // Intercambiar secciones
    const temp = estadoAdmin.seccionesTemporales[index];
    estadoAdmin.seccionesTemporales[index] = estadoAdmin.seccionesTemporales[index + 1];
    estadoAdmin.seccionesTemporales[index + 1] = temp;
    
    // Actualizar índice de sección actual si es necesario
    if (estadoAdmin.seccionActualEdicion === index) {
        estadoAdmin.seccionActualEdicion = index + 1;
    } else if (estadoAdmin.seccionActualEdicion === index + 1) {
        estadoAdmin.seccionActualEdicion = index;
    }
    
    // Recargar vista
    navegarSeccionEditor(estadoAdmin.seccionActualEdicion);
    mostrarNotificacion('↓ Sección movida abajo');
}

function eliminarSeccion(index, event) {
    event.stopPropagation();
    if (!estadoAdmin.seccionesTemporales || estadoAdmin.seccionesTemporales.length <= 1) {
        mostrarNotificacionError('❌ No puedes eliminar la única sección del módulo');
        return;
    }
    
    // Obtener título de la sección para el mensaje de confirmación
    const parser = new DOMParser();
    const doc = parser.parseFromString(estadoAdmin.seccionesTemporales[index], 'text/html');
    const titulo = doc.querySelector('h2, h3');
    const tituloTexto = titulo ? titulo.textContent : `Sección ${index + 1}`;
    
    mostrarModalConfirmacion(
        `¿Eliminar "${tituloTexto}"? Esta acción no se puede deshacer.`,
        () => {
            // Eliminar la sección
            estadoAdmin.seccionesTemporales.splice(index, 1);
            
            // Ajustar índice de sección actual
            if (estadoAdmin.seccionActualEdicion >= estadoAdmin.seccionesTemporales.length) {
                estadoAdmin.seccionActualEdicion = estadoAdmin.seccionesTemporales.length - 1;
            } else if (estadoAdmin.seccionActualEdicion > index) {
                estadoAdmin.seccionActualEdicion--;
            }
            
            // Recargar vista
            navegarSeccionEditor(estadoAdmin.seccionActualEdicion);
            mostrarNotificacion('🗑️ Sección eliminada');
        }
    );
}

function duplicarSeccion(index, event) {
    event.stopPropagation();
    if (!estadoAdmin.seccionesTemporales) return;
    
    // Guardar contenido actual del editor
    const editor = document.getElementById('editorContenidoVisual');
    if (editor && estadoAdmin.seccionActualEdicion !== null) {
        estadoAdmin.seccionesTemporales[estadoAdmin.seccionActualEdicion] = editor.innerHTML;
    }
    
    // Obtener título de la sección para el mensaje
    const parser = new DOMParser();
    const doc = parser.parseFromString(estadoAdmin.seccionesTemporales[index], 'text/html');
    const titulo = doc.querySelector('h2, h3');
    
    // Crear copia del contenido
    let contenidoCopia = estadoAdmin.seccionesTemporales[index];
    
    // Modificar el título de la copia para indicar que es una copia
    if (titulo) {
        const tituloOriginal = titulo.textContent;
        const nuevoTitulo = `${tituloOriginal} (Copia)`;
        contenidoCopia = contenidoCopia.replace(tituloOriginal, nuevoTitulo);
    }
    
    // Insertar la copia después de la sección original
    estadoAdmin.seccionesTemporales.splice(index + 1, 0, contenidoCopia);
    
    // Navegar a la nueva sección
    navegarSeccionEditor(index + 1);
    
    mostrarNotificacion('📋 Sección duplicada');
}

// Hacer funciones de sección accesibles globalmente
window.moverSeccionArriba = moverSeccionArriba;
window.moverSeccionAbajo = moverSeccionAbajo;
window.eliminarSeccion = eliminarSeccion;
window.duplicarSeccion = duplicarSeccion;

function navegarSeccionEditor(index) {
    const editor = document.getElementById('editorContenidoVisual');
    if (!editor) return;
    
    // Guardar el contenido de la sección ACTUAL antes de cambiar
    const seccionActualAnterior = estadoAdmin.seccionActualEdicion;
    if (estadoAdmin.seccionesTemporales && seccionActualAnterior !== index) {
        estadoAdmin.seccionesTemporales[seccionActualAnterior] = editor.innerHTML;
    }
    
    // Actualizar índice de sección actual
    estadoAdmin.seccionActualEdicion = index;
    
    // Inicializar secciones temporales si no existen
    if (!estadoAdmin.seccionesTemporales) {
        const contenidoCompleto = estadoAdmin.modulosEditados[estadoAdmin.moduloEnEdicion] || '';
        const secciones = dividirEnSecciones(contenidoCompleto);
        estadoAdmin.seccionesTemporales = [...secciones];
    }
    
    // SIEMPRE mostrar solo la sección seleccionada
    editor.innerHTML = estadoAdmin.seccionesTemporales[index] || '<p>Sección vacía. Usa H2 para crear el título.</p>';
    editor.focus();
    
    // Actualizar la lista visual
    actualizarVistaPreviewSecciones();
    
    // Mostrar ayuda temporal
    const totalSecciones = estadoAdmin.seccionesTemporales ? estadoAdmin.seccionesTemporales.length : 1;
    mostrarAyudaTemporal(index + 1, totalSecciones);
}

function toggleModoEdicionSecciones() {
    estadoAdmin.modoEdicionSeccion = !estadoAdmin.modoEdicionSeccion;
    
    const btn = document.getElementById('btnModoEdicionSecciones');
    const editor = document.getElementById('editorContenidoVisual');
    
    if (estadoAdmin.modoEdicionSeccion) {
        // Activar modo edición individual
        btn.textContent = `✏️ Editando Sección ${estadoAdmin.seccionActualEdicion + 1}`;
        btn.classList.add('modo-activo');
        navegarSeccionEditor(estadoAdmin.seccionActualEdicion);
    } else {
        // Ver todas las secciones juntas (modo lectura completo)
        btn.textContent = '📖 Ver Todo';
        btn.classList.remove('modo-activo');
        
        // Reconstruir el contenido completo desde las secciones temporales
        if (estadoAdmin.seccionesTemporales) {
            editor.innerHTML = estadoAdmin.seccionesTemporales.join('');
        } else {
            const contenidoCompleto = estadoAdmin.modulosEditados[estadoAdmin.moduloEnEdicion] || '';
            editor.innerHTML = contenidoCompleto;
        }
        editor.setAttribute('contenteditable', 'false');
    }
}

function editarInsigniaDesdeModulo(moduloId) {
    editarInsigniaAdmin(moduloId);
}

function cambiarTipoEvaluacion(moduloId) {
    const tipo = document.getElementById('evaluacionVinculada').value;
    
    if (!tipo) {
        // Sin evaluación
        delete estadoAdmin.evaluacionesEditadas[moduloId];
        guardarDatosAdmin();
        return;
    }
    
    // Si no existe la evaluación, crearla
    if (!estadoAdmin.evaluacionesEditadas[moduloId] || estadoAdmin.evaluacionesEditadas[moduloId].tipo !== tipo) {
        crearEvaluacion(moduloId, tipo);
    }
}

function abrirConfiguradorEvaluacion(moduloId) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    
    if (!evaluacion) {
        mostrarNotificacionError('⚠️ Primero selecciona un tipo de evaluación');
        return;
    }
    
    // Reemplazar contenido del modal actual en lugar de cerrar y abrir
    const modal = document.getElementById('modalEditorAdmin');
    if (modal) {
        const modulo = MODULOS.find(m => m.id === moduloId);
        modal.innerHTML = generarContenidoEditorEvaluacion(moduloId, evaluacion, modulo);
    } else {
        abrirEditorEvaluacionCompleto(moduloId, evaluacion);
    }
}

// ===== EDITOR COMPLETO DE EVALUACIONES (VISUAL) =====

function generarContenidoEditorEvaluacion(moduloId, evaluacion, modulo) {
    return `
        <div class="editor-evaluacion-completo editor-visual">
            <div class="header-editor-mejorado">
                <div class="titulo-header-editor">
                    <h3>🎮 Configurar Evaluación</h3>
                    <p class="subtitulo-editor">${modulo.titulo}</p>
                </div>
                <div class="acciones-header-editor">
                    <button class="boton-guardar-grande" onclick="guardarEvaluacionCompleta(${moduloId})">
                        <span class="icono-btn">💾</span>
                        <span class="texto-btn">Guardar</span>
                    </button>
                    <button class="boton-cerrar-grande" onclick="cerrarEditorEvaluacion()">
                        <span class="icono-btn">✕</span>
                        <span class="texto-btn">Cerrar</span>
                    </button>
                </div>
            </div>
            
            <div class="contenido-eval-editor">
                <div class="config-basica-eval">
                    <h4>⚙️ Configuración General</h4>
                    <div class="form-inline-eval">
                        <div class="campo-editor">
                            <label>Título:</label>
                            <input type="text" id="tituloEvalCompleta" value="${evaluacion.titulo}" class="input-admin">
                        </div>
                        <div class="campo-editor">
                            <label>Descripción:</label>
                            <input type="text" id="descripcionEvalCompleta" value="${evaluacion.descripcion}" class="input-admin">
                        </div>
                        <div class="campo-editor campo-numero">
                            <label>% para aprobar:</label>
                            <input type="number" id="aprobacionEvalCompleta" value="${evaluacion.aprobacion}" class="input-admin" min="0" max="100">
                        </div>
                    </div>
                </div>
                
                <div id="contenedorEditorEspecifico" class="contenido-eval-especifico">
                    ${renderizarEditorEvaluacionEspecifica(moduloId, evaluacion)}
                </div>
            </div>
        </div>
    `;
}

function abrirEditorEvaluacionCompleto(moduloId, evaluacion) {
    const modulo = MODULOS.find(m => m.id === moduloId);
    
    const modal = crearModalEditor();
    modal.innerHTML = generarContenidoEditorEvaluacion(moduloId, evaluacion, modulo);
    
    document.body.appendChild(modal);
}

function renderizarEditorEvaluacionEspecifica(moduloId, evaluacion) {
    switch (evaluacion.tipo) {
        case 'escape-room':
            return renderizarEditorEscapeRoomCompleto(moduloId, evaluacion);
        case 'pasapalabra':
            return renderizarEditorPasapalabraCompleto(moduloId, evaluacion);
        case 'quiz-tiempo':
            return renderizarEditorQuizCompleto(moduloId, evaluacion);
        case 'conectar':
            return renderizarEditorConectarCompleto(moduloId, evaluacion);
        case 'casos-practicos':
            return renderizarEditorCasosCompleto(moduloId, evaluacion);
        default:
            return '<p>Tipo no reconocido</p>';
    }
}

// Función para actualizar SOLO el contenido sin recrear el modal
function actualizarContenidoEvaluacion(moduloId) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    const contenedor = document.getElementById('contenedorEditorEspecifico');
    if (contenedor && evaluacion) {
        contenedor.innerHTML = renderizarEditorEvaluacionEspecifica(moduloId, evaluacion);
    }
}

// ===== EDITOR ESCAPE ROOM COMPLETO =====

function renderizarEditorEscapeRoomCompleto(moduloId, evaluacion) {
    let html = `
        <h4>🏰 Habitaciones del Escape Room</h4>
        <button class="boton-admin boton-agregar-grande" onclick="agregarHabitacionCompleta(${moduloId})">
            ➕ Agregar Nueva Habitación
        </button>
        <div class="lista-habitaciones-completa">
    `;
    
    evaluacion.habitaciones.forEach((hab, habIndex) => {
        html += `
            <div class="habitacion-card-completa">
                <div class="header-habitacion-card">
                    <h5>🚪 Habitación ${habIndex + 1}</h5>
                    <button class="boton-admin-pequeno boton-eliminar" onclick="eliminarHabitacionCompleta(${moduloId}, ${habIndex})">🗑️</button>
                </div>
                
                <div class="form-habitacion">
                    <div class="campo-editor">
                        <label>Nombre:</label>
                        <input type="text" value="${hab.nombre}" onchange="actualizarHabitacion(${moduloId}, ${habIndex}, 'nombre', this.value)" class="input-admin">
                    </div>
                    <div class="campo-editor">
                        <label>Tema:</label>
                        <input type="text" value="${hab.tema}" onchange="actualizarHabitacion(${moduloId}, ${habIndex}, 'tema', this.value)" class="input-admin">
                    </div>
                    <div class="campo-editor">
                        <label>Narrativa de entrada:</label>
                        <textarea onchange="actualizarHabitacion(${moduloId}, ${habIndex}, 'narrativa_entrada', this.value)" class="textarea-admin-pequeno" rows="2">${hab.narrativa_entrada}</textarea>
                    </div>
                    <div class="campo-editor">
                        <label>Narrativa de éxito:</label>
                        <textarea onchange="actualizarHabitacion(${moduloId}, ${habIndex}, 'narrativa_exito', this.value)" class="textarea-admin-pequeno" rows="2">${hab.narrativa_exito}</textarea>
                    </div>
                </div>
                
                <div class="preguntas-habitacion-editor">
                    <div class="header-preguntas-hab">
                        <h6>📝 Preguntas de la Habitación</h6>
                        <button class="boton-admin-mini boton-agregar" onclick="agregarPreguntaHabitacion(${moduloId}, ${habIndex})">➕ Pregunta</button>
                    </div>
                    ${hab.preguntas.map((preg, pregIndex) => `
                        <div class="pregunta-card-editor">
                            <div class="header-pregunta-editor">
                                <strong>Acertijo ${pregIndex + 1}</strong>
                                <button class="boton-admin-mini boton-eliminar" onclick="eliminarPreguntaHabitacion(${moduloId}, ${habIndex}, ${pregIndex})">🗑️</button>
                            </div>
                            
                            <div class="campo-editor">
                                <label>Pregunta:</label>
                                <input type="text" value="${preg.pregunta}" onchange="actualizarPreguntaHab(${moduloId}, ${habIndex}, ${pregIndex}, 'pregunta', this.value)" class="input-admin">
                            </div>
                            
                            <div class="opciones-pregunta-editor">
                                <label>Opciones (marca la correcta):</label>
                                ${preg.opciones.map((op, opIndex) => `
                                    <div class="opcion-editor-row">
                                        <input type="radio" name="correcta-${habIndex}-${pregIndex}" ${preg.correcta === opIndex ? 'checked' : ''} onchange="actualizarPreguntaHab(${moduloId}, ${habIndex}, ${pregIndex}, 'correcta', ${opIndex})">
                                        <input type="text" value="${op}" onchange="actualizarOpcionHab(${moduloId}, ${habIndex}, ${pregIndex}, ${opIndex}, this.value)" class="input-admin input-opcion">
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="campo-editor">
                                <label>Explicación:</label>
                                <textarea onchange="actualizarPreguntaHab(${moduloId}, ${habIndex}, ${pregIndex}, 'explicacion', this.value)" class="textarea-admin-pequeno" rows="2">${preg.explicacion || ''}</textarea>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function actualizarHabitacion(moduloId, habIndex, campo, valor) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.habitaciones[habIndex][campo] = valor;
    // No guardar automáticamente, solo al presionar Guardar
}

function actualizarPreguntaHab(moduloId, habIndex, pregIndex, campo, valor) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.habitaciones[habIndex].preguntas[pregIndex][campo] = valor;
    // No guardar automáticamente, solo al presionar Guardar
}

function actualizarOpcionHab(moduloId, habIndex, pregIndex, opIndex, valor) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.habitaciones[habIndex].preguntas[pregIndex].opciones[opIndex] = valor;
    // No guardar automáticamente, solo al presionar Guardar
}

function agregarHabitacionCompleta(moduloId) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    const nuevaHab = {
        id: evaluacion.habitaciones.length + 1,
        nombre: `Habitación ${evaluacion.habitaciones.length + 1}`,
        tema: "Tema nuevo",
        narrativa_entrada: "Narrativa de entrada...",
        narrativa_exito: "¡Excelente!",
        preguntas: []
    };
    evaluacion.habitaciones.push(nuevaHab);
    actualizarContenidoEvaluacion(moduloId);
    mostrarNotificacionInfo('🚪 Habitación agregada');
}

function eliminarHabitacionCompleta(moduloId, habIndex) {
    mostrarModalConfirmacion('¿Eliminar esta habitación y todas sus preguntas?', () => {
        const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
        evaluacion.habitaciones.splice(habIndex, 1);
        actualizarContenidoEvaluacion(moduloId);
        mostrarNotificacionInfo('🗑️ Habitación eliminada');
    });
}

function agregarPreguntaHabitacion(moduloId, habIndex) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    const nuevaPregunta = {
        pregunta: "Nueva pregunta",
        opciones: ["Opción A", "Opción B", "Opción C", "Opción D"],
        correcta: 0,
        explicacion: "Explicación de la respuesta correcta"
    };
    evaluacion.habitaciones[habIndex].preguntas.push(nuevaPregunta);
    actualizarContenidoEvaluacion(moduloId);
    mostrarNotificacionInfo('❓ Pregunta agregada');
}

function eliminarPreguntaHabitacion(moduloId, habIndex, pregIndex) {
    mostrarModalConfirmacion('¿Eliminar esta pregunta?', () => {
        const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
        evaluacion.habitaciones[habIndex].preguntas.splice(pregIndex, 1);
        actualizarContenidoEvaluacion(moduloId);
        mostrarNotificacionInfo('🗑️ Pregunta eliminada');
    });
}

// ===== EDITOR PASAPALABRA COMPLETO =====

function renderizarEditorPasapalabraCompleto(moduloId, evaluacion) {
    let html = `
        <h4>🔤 Letras del Pasapalabra</h4>
        <button class="boton-admin boton-agregar-grande" onclick="agregarLetraPasapalabraCompleta(${moduloId})">
            ➕ Agregar Nueva Letra
        </button>
        <div class="lista-letras-completa">
    `;
    
    evaluacion.letras.forEach((letra, index) => {
        html += `
            <div class="letra-card-completa">
                <div class="header-letra-card">
                    <span class="letra-grande-editor">${letra.letra}</span>
                    <button class="boton-admin-pequeno boton-eliminar" onclick="eliminarLetraPasapalabraCompleta(${moduloId}, ${index})">🗑️</button>
                </div>
                
                <div class="form-letra">
                    <div class="campo-editor">
                        <label>Letra:</label>
                        <input type="text" value="${letra.letra}" onchange="actualizarLetra(${moduloId}, ${index}, 'letra', this.value.toUpperCase())" class="input-admin input-letra" maxlength="1">
                    </div>
                    
                    <div class="campo-editor">
                        <label>Tipo de pregunta:</label>
                        <select onchange="actualizarLetra(${moduloId}, ${index}, 'tipo', this.value)" class="select-admin">
                            <option value="empieza" ${letra.tipo === 'empieza' ? 'selected' : ''}>Empieza con...</option>
                            <option value="contiene" ${letra.tipo === 'contiene' ? 'selected' : ''}>Contiene la letra...</option>
                            <option value="completa" ${letra.tipo === 'completa' ? 'selected' : ''}>Palabra completa</option>
                        </select>
                    </div>
                    
                    <div class="campo-editor">
                        <label>Definición:</label>
                        <textarea onchange="actualizarLetra(${moduloId}, ${index}, 'definicion', this.value)" class="textarea-admin-pequeno" rows="2">${letra.definicion}</textarea>
                    </div>
                    
                    <div class="opciones-pregunta-editor">
                        <label>Opciones (marca la correcta):</label>
                        ${letra.opciones.map((op, opIndex) => `
                            <div class="opcion-editor-row">
                                <input type="radio" name="correcta-letra-${index}" ${letra.correcta === opIndex ? 'checked' : ''} onchange="actualizarLetra(${moduloId}, ${index}, 'correcta', ${opIndex})">
                                <input type="text" value="${op}" onchange="actualizarOpcionLetra(${moduloId}, ${index}, ${opIndex}, this.value)" class="input-admin input-opcion">
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="campo-editor">
                        <label>💡 Explicación (se muestra al finalizar):</label>
                        <textarea onchange="actualizarLetra(${moduloId}, ${index}, 'explicacion', this.value)" class="textarea-admin-pequeno" rows="2" placeholder="Explica por qué esta es la respuesta correcta...">${letra.explicacion || ''}</textarea>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function actualizarLetra(moduloId, letraIndex, campo, valor) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.letras[letraIndex][campo] = valor;
    // No guardar automáticamente, solo al presionar Guardar
}

function actualizarOpcionLetra(moduloId, letraIndex, opIndex, valor) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.letras[letraIndex].opciones[opIndex] = valor;
    // No guardar automáticamente, solo al presionar Guardar
}

function agregarLetraPasapalabraCompleta(moduloId) {
    const letra = prompt('Ingrese la letra (A-Z):');
    if (!letra || letra.length !== 1) return;
    
    const evaluacion = obtenerEvaluacionAdmin(moduloId);
    evaluacion.letras.push({
        letra: letra.toUpperCase(),
        definicion: "Nueva definición...",
        opciones: ["Opción 1", "Opción 2", "Opción 3"],
        correcta: 0,
        tipo: "empieza",
        explicacion: ""
    });
    actualizarContenidoEvaluacion(moduloId);
    mostrarNotificacionInfo('🔤 Letra agregada');
}

function eliminarLetraPasapalabraCompleta(moduloId, index) {
    mostrarModalConfirmacion('¿Eliminar esta letra?', () => {
        const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
        evaluacion.letras.splice(index, 1);
        actualizarContenidoEvaluacion(moduloId);
        mostrarNotificacionInfo('🗑️ Letra eliminada');
    });
}

// ===== EDITOR QUIZ TIEMPO COMPLETO =====

function renderizarEditorQuizCompleto(moduloId, evaluacion) {
    let html = `
        <h4>⏱️ Preguntas del Quiz con Tiempo</h4>
        <button class="boton-admin boton-agregar-grande" onclick="agregarPreguntaQuizCompleta(${moduloId})">
            ➕ Agregar Nueva Pregunta
        </button>
        <div class="lista-preguntas-completa">
    `;
    
    evaluacion.preguntas.forEach((preg, index) => {
        html += `
            <div class="pregunta-card-completa">
                <div class="header-pregunta-card">
                    <strong>Pregunta ${index + 1}</strong>
                    <button class="boton-admin-pequeno boton-eliminar" onclick="eliminarPreguntaQuizCompleta(${moduloId}, ${index})">🗑️</button>
                </div>
                
                <div class="form-pregunta">
                    <div class="campo-editor">
                        <label>Pregunta:</label>
                        <input type="text" value="${preg.pregunta}" onchange="actualizarPreguntaQuiz(${moduloId}, ${index}, 'pregunta', this.value)" class="input-admin">
                    </div>
                    
                    <div class="row-inline">
                        <div class="campo-editor">
                            <label>Tiempo (segundos):</label>
                            <input type="number" value="${preg.tiempo}" onchange="actualizarPreguntaQuiz(${moduloId}, ${index}, 'tiempo', parseInt(this.value))" class="input-admin" min="5" max="60">
                        </div>
                        <div class="campo-editor">
                            <label>Puntos:</label>
                            <input type="number" value="${preg.puntos}" onchange="actualizarPreguntaQuiz(${moduloId}, ${index}, 'puntos', parseInt(this.value))" class="input-admin" min="10" max="1000">
                        </div>
                    </div>
                    
                    <div class="opciones-pregunta-editor">
                        <label>Opciones (marca la correcta):</label>
                        ${preg.opciones.map((op, opIndex) => `
                            <div class="opcion-editor-row">
                                <input type="radio" name="correcta-quiz-${index}" ${preg.correcta === opIndex ? 'checked' : ''} onchange="actualizarPreguntaQuiz(${moduloId}, ${index}, 'correcta', ${opIndex})">
                                <input type="text" value="${op}" onchange="actualizarOpcionQuiz(${moduloId}, ${index}, ${opIndex}, this.value)" class="input-admin input-opcion">
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="campo-editor">
                        <label>💡 Explicación (se muestra al finalizar):</label>
                        <textarea onchange="actualizarPreguntaQuiz(${moduloId}, ${index}, 'explicacion', this.value)" class="textarea-admin-pequeno" rows="2" placeholder="Explica por qué esta es la respuesta correcta...">${preg.explicacion || ''}</textarea>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function actualizarPreguntaQuiz(moduloId, pregIndex, campo, valor) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.preguntas[pregIndex][campo] = valor;
    // No guardar automáticamente, solo al presionar Guardar
}

function actualizarOpcionQuiz(moduloId, pregIndex, opIndex, valor) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.preguntas[pregIndex].opciones[opIndex] = valor;
    // No guardar automáticamente, solo al presionar Guardar
}

function agregarPreguntaQuizCompleta(moduloId) {
    const evaluacion = obtenerEvaluacionAdmin(moduloId);
    evaluacion.preguntas.push({
        pregunta: "Nueva pregunta",
        opciones: ["Opción A", "Opción B", "Opción C", "Opción D"],
        correcta: 0,
        tiempo: 15,
        puntos: 100,
        explicacion: ""
    });
    actualizarContenidoEvaluacion(moduloId);
    mostrarNotificacionInfo('❓ Pregunta agregada');
}

function eliminarPreguntaQuizCompleta(moduloId, index) {
    mostrarModalConfirmacion('¿Eliminar esta pregunta?', () => {
        const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
        evaluacion.preguntas.splice(index, 1);
        actualizarContenidoEvaluacion(moduloId);
        mostrarNotificacionInfo('🗑️ Pregunta eliminada');
    });
}

// ===== EDITOR CONECTAR COMPLETO =====

function renderizarEditorConectarCompleto(moduloId, evaluacion) {
    let html = `
        <h4>🔗 Rondas de Conexión</h4>
        <button class="boton-admin boton-agregar-grande" onclick="agregarRondaConectarCompleta(${moduloId})">
            ➕ Agregar Nueva Ronda
        </button>
        <div class="lista-rondas-completa">
    `;
    
    evaluacion.rondas.forEach((ronda, rondaIndex) => {
        html += `
            <div class="ronda-card-completa">
                <div class="header-ronda-card">
                    <h5>Ronda ${rondaIndex + 1}</h5>
                    <button class="boton-admin-pequeno boton-eliminar" onclick="eliminarRondaConectarCompleta(${moduloId}, ${rondaIndex})">🗑️</button>
                </div>
                
                <div class="campo-editor">
                    <label>Título de la ronda:</label>
                    <input type="text" value="${ronda.titulo}" onchange="actualizarRonda(${moduloId}, ${rondaIndex}, 'titulo', this.value)" class="input-admin">
                </div>
                
                <div class="pares-editor">
                    <div class="header-pares">
                        <h6>Pares a conectar</h6>
                        <button class="boton-admin-mini boton-agregar" onclick="agregarParConectar(${moduloId}, ${rondaIndex})">➕ Par</button>
                    </div>
                    ${ronda.pares.map((par, parIndex) => `
                        <div class="par-editor-row">
                            <input type="text" value="${par.izquierda}" onchange="actualizarPar(${moduloId}, ${rondaIndex}, ${parIndex}, 'izquierda', this.value)" class="input-admin input-par" placeholder="Concepto izquierda">
                            <span class="flecha-par">↔️</span>
                            <input type="text" value="${par.derecha}" onchange="actualizarPar(${moduloId}, ${rondaIndex}, ${parIndex}, 'derecha', this.value)" class="input-admin input-par" placeholder="Concepto derecha">
                            <button class="boton-admin-mini boton-eliminar" onclick="eliminarPar(${moduloId}, ${rondaIndex}, ${parIndex})">×</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function actualizarRonda(moduloId, rondaIndex, campo, valor) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.rondas[rondaIndex][campo] = valor;
    // No guardar automáticamente, solo al presionar Guardar
}

function actualizarPar(moduloId, rondaIndex, parIndex, lado, valor) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.rondas[rondaIndex].pares[parIndex][lado] = valor;
    // No guardar automáticamente, solo al presionar Guardar
}

function agregarRondaConectarCompleta(moduloId) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.rondas.push({
        titulo: `Ronda ${evaluacion.rondas.length + 1}`,
        pares: []
    });
    actualizarContenidoEvaluacion(moduloId);
    mostrarNotificacionInfo('🔗 Ronda agregada');
}

function eliminarRondaConectarCompleta(moduloId, rondaIndex) {
    mostrarModalConfirmacion('¿Eliminar esta ronda?', () => {
        const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
        evaluacion.rondas.splice(rondaIndex, 1);
        actualizarContenidoEvaluacion(moduloId);
        mostrarNotificacionInfo('🗑️ Ronda eliminada');
    });
}

function agregarParConectar(moduloId, rondaIndex) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.rondas[rondaIndex].pares.push({
        izquierda: "Concepto",
        derecha: "Definición"
    });
    actualizarContenidoEvaluacion(moduloId);
    mostrarNotificacionInfo('↔️ Par agregado');
}

function eliminarPar(moduloId, rondaIndex, parIndex) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.rondas[rondaIndex].pares.splice(parIndex, 1);
    actualizarContenidoEvaluacion(moduloId);
}

// ===== EDITOR CASOS PRÁCTICOS COMPLETO =====

function renderizarEditorCasosCompleto(moduloId, evaluacion) {
    let html = `
        <h4>📋 Casos Prácticos</h4>
        <button class="boton-admin boton-agregar-grande" onclick="agregarCasoPracticoCompleto(${moduloId})">
            ➕ Agregar Nuevo Caso
        </button>
        <div class="lista-casos-completa">
    `;
    
    evaluacion.casos.forEach((caso, casoIndex) => {
        html += `
            <div class="caso-card-completo">
                <div class="header-caso-card">
                    <h5>Caso ${casoIndex + 1}</h5>
                    <button class="boton-admin-pequeno boton-eliminar" onclick="eliminarCasoPracticoCompleto(${moduloId}, ${casoIndex})">🗑️</button>
                </div>
                
                <div class="form-caso">
                    <div class="campo-editor">
                        <label>Título del caso:</label>
                        <input type="text" value="${caso.titulo}" onchange="actualizarCaso(${moduloId}, ${casoIndex}, 'titulo', this.value)" class="input-admin">
                    </div>
                    
                    <div class="campo-editor">
                        <label>Narrativa / Situación:</label>
                        <textarea onchange="actualizarCaso(${moduloId}, ${casoIndex}, 'narrativa', this.value)" class="textarea-admin-mediana" rows="4">${caso.narrativa || caso.situacion || ''}</textarea>
                    </div>
                    
                    <div class="preguntas-caso-editor">
                        <div class="header-preguntas-caso">
                            <h6>Preguntas del Caso</h6>
                            <button class="boton-admin-mini boton-agregar" onclick="agregarPreguntaCaso(${moduloId}, ${casoIndex})">➕ Pregunta</button>
                        </div>
                        ${caso.preguntas.map((preg, pregIndex) => `
                            <div class="pregunta-caso-card">
                                <div class="header-pregunta-caso">
                                    <strong>Pregunta ${pregIndex + 1}</strong>
                                    <button class="boton-admin-mini boton-eliminar" onclick="eliminarPreguntaCaso(${moduloId}, ${casoIndex}, ${pregIndex})">🗑️</button>
                                </div>
                                
                                <div class="campo-editor">
                                    <label>Pregunta:</label>
                                    <input type="text" value="${preg.pregunta}" onchange="actualizarPreguntaCaso(${moduloId}, ${casoIndex}, ${pregIndex}, 'pregunta', this.value)" class="input-admin">
                                </div>
                                
                                <div class="opciones-pregunta-editor">
                                    <label>Opciones (marca la correcta):</label>
                                    ${preg.opciones.map((op, opIndex) => `
                                        <div class="opcion-editor-row">
                                            <input type="radio" name="correcta-caso-${casoIndex}-${pregIndex}" ${preg.correcta === opIndex ? 'checked' : ''} onchange="actualizarPreguntaCaso(${moduloId}, ${casoIndex}, ${pregIndex}, 'correcta', ${opIndex})">
                                            <input type="text" value="${op}" onchange="actualizarOpcionCaso(${moduloId}, ${casoIndex}, ${pregIndex}, ${opIndex}, this.value)" class="input-admin input-opcion">
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <div class="campo-editor">
                                    <label>💡 Explicación:</label>
                                    <textarea onchange="actualizarPreguntaCaso(${moduloId}, ${casoIndex}, ${pregIndex}, 'explicacion', this.value)" class="textarea-admin-pequeno" rows="2" placeholder="Explica por qué esta es la respuesta correcta...">${preg.explicacion || ''}</textarea>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function actualizarCaso(moduloId, casoIndex, campo, valor) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.casos[casoIndex][campo] = valor;
    // No guardar automáticamente, solo al presionar Guardar
}

function actualizarPreguntaCaso(moduloId, casoIndex, pregIndex, campo, valor) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.casos[casoIndex].preguntas[pregIndex][campo] = valor;
    // No guardar automáticamente, solo al presionar Guardar
}

function actualizarOpcionCaso(moduloId, casoIndex, pregIndex, opIndex, valor) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    evaluacion.casos[casoIndex].preguntas[pregIndex].opciones[opIndex] = valor;
    // No guardar automáticamente, solo al presionar Guardar
}

function agregarCasoPracticoCompleto(moduloId) {
    const evaluacion = obtenerEvaluacionAdmin(moduloId);
    evaluacion.casos.push({
        titulo: `Caso ${evaluacion.casos.length + 1}`,
        narrativa: "Descripción de la situación del caso...",
        preguntas: []
    });
    actualizarContenidoEvaluacion(moduloId);
    mostrarNotificacionInfo('📋 Caso agregado');
}

function eliminarCasoPracticoCompleto(moduloId, casoIndex) {
    mostrarModalConfirmacion('¿Eliminar este caso?', () => {
        const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
        evaluacion.casos.splice(casoIndex, 1);
        actualizarContenidoEvaluacion(moduloId);
        mostrarNotificacionInfo('🗑️ Caso eliminado');
    });
}

function agregarPreguntaCaso(moduloId, casoIndex) {
    const evaluacion = obtenerEvaluacionAdmin(moduloId);
    evaluacion.casos[casoIndex].preguntas.push({
        pregunta: "Nueva pregunta",
        opciones: ["Opción A", "Opción B", "Opción C", "Opción D"],
        correcta: 0,
        explicacion: ""
    });
    actualizarContenidoEvaluacion(moduloId);
    mostrarNotificacionInfo('❓ Pregunta agregada');
}

function eliminarPreguntaCaso(moduloId, casoIndex, pregIndex) {
    mostrarModalConfirmacion('¿Eliminar esta pregunta?', () => {
        const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
        evaluacion.casos[casoIndex].preguntas.splice(pregIndex, 1);
        actualizarContenidoEvaluacion(moduloId);
        mostrarNotificacionInfo('🗑️ Pregunta eliminada');
    });
}

function guardarEvaluacionCompleta(moduloId) {
    const evaluacion = estadoAdmin.evaluacionesEditadas[moduloId];
    
    // Actualizar datos básicos
    const titulo = document.getElementById('tituloEvalCompleta');
    const descripcion = document.getElementById('descripcionEvalCompleta');
    const aprobacion = document.getElementById('aprobacionEvalCompleta');
    
    if (titulo) evaluacion.titulo = titulo.value;
    if (descripcion) evaluacion.descripcion = descripcion.value;
    if (aprobacion) evaluacion.aprobacion = parseInt(aprobacion.value);
    
    guardarDatosAdmin();
    
    // Volver al editor de módulo si estábamos editando uno
    if (estadoAdmin.moduloEnEdicion !== null) {
        editarModuloAdmin(estadoAdmin.moduloEnEdicion);
        mostrarNotificacion('✅ Evaluación guardada. Volviendo al editor de módulo');
    } else {
        const modal = document.getElementById('modalEditorAdmin');
        if (modal) modal.remove();
        mostrarNotificacion('✅ Evaluación guardada exitosamente');
    }
}

function cerrarEditorEvaluacion() {
    // Si hay un módulo en edición, volver a él
    if (estadoAdmin.moduloEnEdicion !== null) {
        editarModuloAdmin(estadoAdmin.moduloEnEdicion);
        mostrarNotificacionInfo('↩️ Volviendo al editor de módulo');
    } else {
        const modal = document.getElementById('modalEditorAdmin');
        if (modal) modal.remove();
    }
}

function seleccionarEmojiModulo(emoji) {
    document.getElementById('iconoModulo').value = emoji;
}

function agregarNuevaSeccion() {
    const editor = document.getElementById('editorContenidoVisual');
    if (!estadoAdmin.seccionesTemporales) {
        estadoAdmin.seccionesTemporales = [];
    }
    
    // Guardar la sección actual primero
    if (estadoAdmin.seccionActualEdicion !== null) {
        estadoAdmin.seccionesTemporales[estadoAdmin.seccionActualEdicion] = editor.innerHTML;
    }
    
    // Agregar nueva sección con contenido placeholder
    const numeroSeccion = estadoAdmin.seccionesTemporales.length + 1;
    const nuevaSeccion = `
        <h2>Sección ${numeroSeccion}</h2>
        <p>Escribe aquí el contenido de esta sección.</p>
        <p>Puedes usar los botones de la toolbar para:</p>
        <ul>
            <li>Aplicar formato (negrita, cursiva, colores)</li>
            <li>Insertar elementos con estilos predefinidos</li>
            <li>Copiar y pegar elementos de otras secciones</li>
        </ul>
    `;
    estadoAdmin.seccionesTemporales.push(nuevaSeccion);
    
    // Navegar a la nueva sección
    navegarSeccionEditor(estadoAdmin.seccionesTemporales.length - 1);
    
    mostrarNotificacion(`✅ Sección ${numeroSeccion} agregada. Puedes editar el título y el contenido.`);
}

// ===== EXPORTAR / IMPORTAR JSON =====

function exportarJSON() {
    const dataExport = {
        modulos: estadoAdmin.modulosEditados,
        evaluaciones: estadoAdmin.evaluacionesEditadas
    };
    
    const jsonString = JSON.stringify(dataExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `contenido-teorico-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    mostrarNotificacion('✅ JSON exportado correctamente');
}

// ===== INICIALIZAR APP =====

// Inicializar la aplicación cuando el DOM esté listo y el contenido cargado
window.addEventListener("DOMContentLoaded", async function() {
    // Primero cargar el contenido teórico desde el JSON
    const cargaExitosa = await cargarContenidoTeorico();
    
    if (cargaExitosa) {
        // Guardar copias de los datos originales del JSON
        const modulosOriginales = { ...CONTENIDO_TEORICO };
        const evaluacionesOriginales = { ...CONTENIDO_EVALUACION };
        
        // Verificar si hay datos editados guardados localmente y hacer merge
        const datosGuardados = localStorage.getItem('adminContentData');
        if (datosGuardados) {
            const datos = JSON.parse(datosGuardados);
            
            // Merge: datos originales + datos editados (los editados sobrescriben)
            if (datos.modulos) {
                CONTENIDO_TEORICO = { ...modulosOriginales, ...datos.modulos };
            }
            
            // Merge: evaluaciones originales + evaluaciones editadas
            if (datos.evaluaciones) {
                CONTENIDO_EVALUACION = { ...evaluacionesOriginales, ...datos.evaluaciones };
            }
            
            // Cargar estructura de módulos (nuevos módulos agregados)
            if (datos.listaModulos && datos.listaModulos.length > 0) {
                MODULOS = datos.listaModulos;
                console.log('✅ Estructura de módulos cargada desde localStorage');
            }
            
            console.log('✅ Contenido editado cargado desde localStorage');
        }
        
        // Luego inicializar la aplicación
        inicializarApp();
    }
});
