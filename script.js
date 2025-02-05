document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value;

    if (message.trim() === '') return; // No enviar mensajes vacíos

    displayMessage(message, 'user'); // Mostrar el mensaje del usuario

    const response = generateResponse(message); // Generar respuesta
    displayMessage(response, 'ai'); // Mostrar respuesta de la IA

    input.value = ''; // Limpiar el campo de entrada
}

function displayMessage(message, sender) {
    const messagesContainer = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender;
    messageDiv.innerHTML = message; // Permitir HTML para formatear respuestas
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Desplazar hacia abajo
}

function generateResponse(message) {
    const lowerCaseMessage = message.toLowerCase();

    // Respuestas para saludos, pero continuar procesando el resto del mensaje
    if (lowerCaseMessage.includes("hola") || lowerCaseMessage.includes("buenos días") || lowerCaseMessage.includes("buenas tardes")) {
        const greetingResponse = "¡Hola!";  // Saludo, sin agregar "¿Cómo puedo ayudarte hoy?"
        const messageWithoutGreeting = removeGreeting(message);  // Quita el saludo del mensaje
        const answer = getResponseForMessage(messageWithoutGreeting); // Genera respuesta con el mensaje sin saludo
        return answer ? greetingResponse + " " + answer : greetingResponse;  // Solo responde lo que sea relevante
    }

    // Si no se detecta un saludo, simplemente procesamos el mensaje
    return getResponseForMessage(message);
}

// Función para eliminar saludos comunes del mensaje
function removeGreeting(message) {
    const greetings = ["hola", "buenos días", "buenas tardes", "buenas noches", "qué tal", "cómo estás"];
    let result = message.toLowerCase();
    greetings.forEach(greeting => {
        result = result.replace(new RegExp(`\\b${greeting}\\b`, 'i'), '').trim();
    });
    return result;
}

// Función para obtener respuesta basada en el contenido del mensaje
function getResponseForMessage(message) {
    const lowerCaseMessage = message.toLowerCase();

    // Base de datos de palabras clave y sinónimos
    const keywords = {
        "pagina web": [
            "web", "página", "pagina", "pgina", "sitio", "sitio web", "página web", "crear una web", "diseño web", "diseñar página", "hacer una página",
            "crear sitio", "desarrollar una página", "sitio para mi negocio", "páginas web simples", "páginas web económicas"
        ],
      
        "Sistema de Gestión de Inventario": [
            "inventario", "invetario","invenario", "invetarios","stock", "gestión de inventarios", "control de stock", "gestionar inventarios", "sistema de inventarios", "gestión de productos", 
            "almacenaje", "registro de productos", "gestión de existencias", "control de mercancías", "software para inventarios",
            "inventarios", "almcenaje", "gestionar almacenaje"
        ],
        "Software de Recursos Humanos": [
            "recursos humanos", "humanos", "recursos", "personal", "gestión de personal", "gestión de empleados", "administración de personal", "software de recursos humanos", "rrhh", "RRHH", 
            "gestión laboral", "software para empleados", "gestión de nómina", "control de personal"
        ],
        "Sistema de Gestión de Proyectos": [
            "gestión de proyectos","proyectos", "tareas", "planificación de proyectos", "gestión de tareas", "software de proyectos", "control de proyectos", "gestión de actividades", 
            "seguimiento de proyectos", "planificación de tareas", "herramienta para proyectos", "administración de proyectos"
        ],
        "Plataforma de Gestión de Clientes (CRM)": [
            "gestión de clientes","clientes", "crm", "gestión de relaciones con clientes", "software de CRM", "plataforma para clientes", "atención al cliente", 
            "seguimiento de clientes", "gestión de relaciones", "relaciones comerciales", "gestión de ventas", "plataforma de clientes"
        ],
        "Sistema de Gestión de Tareas": [
            "gestión de tareas", "tareas", "asignación", "organización de tareas", "priorización de tareas", "software de tareas", "gestión de actividades", "herramienta para tareas", 
            "planificación de tareas", "organizar trabajo", "gestión de proyectos", "asignación de tareas"
        ],
        "Software de Reservas": [
            "gestión de reservas","reservas", "citas", "sistema de reservas", "reservas en línea", "reservas para empresas", "reservas de citas", "sistema para citas", 
            "gestionar reservas", "software de reservas", "reservar online", "control de citas"
        ],
        "Aplicación de Gestión de Documentos": [
            "gestión de documentos","documentos", "documental", "gestión documental", "archivos digitales", "documentos en la nube", "software de documentos", "digitalización de documentos", 
            "almacenamiento de archivos", "gestión de archivos", "documentos electrónicos", "organización de documentos"
        ],
        "Sistema de Control de Calidad": [
            "gestión de calidad", "calidad", "control de calidad", "sistema de calidad", "gestión de procesos de calidad", "software de control de calidad", "mejora continua", "mejora",
            "gestión de estándares de calidad", "plataforma de calidad", "gestión de calidad empresarial"
        ],
        "Software de Gestión de Eventos": [
            "gestión de eventos","eventos","conferencias", "organización de eventos", "software de eventos", "planificación de eventos", "gestión de conferencias", "eventos corporativos", 
            "registro de eventos", "control de eventos", "plataforma de eventos"
        ],
        "Sistema de Gestión de Flotas": [
            "gestión de flotas","flotas","flota","camiones", "taxis", "motos","vehículos", "gestión de transporte", "flota de vehículos", "control de vehículos", "seguimiento de vehículos", 
            "gestión de transporte empresarial", "sistema para flotas"
        ],
        "Plataforma de Encuestas y Feedback": [
            "plataforma de encuestas","encuestas","encuesta", "feedback", "retroalimentación", "encuestas en línea", "recopilación de datos", "gestión de encuestas", "feedback", "opiniones de clientes", "encuestas de satisfacción", 
            "plataforma de feedback", "recopilación de opiniones", "sistema de encuestas"
        ],
        "Software de Gestión de Tiempos y Asistencia": [
            "gestión de asistencia","asistencia","asistencias", "control de tiempo", "gestión de horas de trabajo", "software de asistencia", "registro de asistencia", "control de personal", 
            "horarios de trabajo", "gestión de tiempos"
        ],
        "Aplicación de Gestión de Conocimientos": [
            "gestión de conocimientos", "repositorio de conocimientos", "gestión del saber", "plataforma de conocimiento", "gestión de información", "sistema de conocimientos", 
            "repositorio empresarial", "gestión de datos internos"
        ],
        "Sistema de Gestión de Mantenimiento": [
            "gestión de mantenimiento","mantenimiento","mantenimientos", "control de mantenimiento", "mantenimiento preventivo", "sistema de mantenimiento", "planificación de mantenimiento", 
            "gestión de equipos", "gestión de instalaciones", "mantenimiento industrial", "software de mantenimiento"
        ],
       "juegos 2d": [
            "juegos 2D","juegos", "videojuegos 2D", "juegos interactivos", "videojuegos educativos 2D", "juegos arcade", "juegos de plataformas", "juegos de acción 2D", 
            "juegos de aventuras 2D", "juegos pixel art", "juegos retro 2D", "diseño de juegos 2D", "desarrollo de juegos 2D", "juegos en 2D para móviles", 
            "juegos para navegador 2D", "juegos 2D multiplataforma", "videojuegos con gráficos 2D", "juegos con física 2D", "desarrollo de videojuegos 2D"
        ],
        "juegos educativos": [
            "juegos educativos", "educativo","educativos", "videojuegos educativos", "juegos didácticos", "aprendizaje a través del juego", "juegos para niños", "juegos interactivos educativos", 
            "juegos de matemáticas", "juegos de ciencia", "juegos para aprender idiomas", "juegos para educación infantil", "videojuegos educativos 2D", "juegos de lógica", 
            "juegos de memoria", "juegos educativos interactivos", "juegos para enseñar habilidades", "plataformas educativas", "juegos de geografía", "juegos de historia", 
            "aplicaciones educativas", "juegos para mejorar el pensamiento crítico", "videojuegos para el aula", "gamificacion", "gamificación"
        ]

    };

    // Comprobar por términos clave y respuestas asociadas
    for (const category in keywords) {
        for (const keyword of keywords[category]) {
            if (lowerCaseMessage.includes(keyword)) {
                const productDetails = getProductDetails(category);
                return `Parece que estás buscando información sobre <strong>${category}</strong>.<br>${productDetails.description}<br>Precio: ${productDetails.price}`;
            }
        }
    }

    // Respuesta por defecto si no se encuentra coincidencia
    return 'Lo siento, no entiendo exactamente lo que buscas. ¿Podrías ser más específico?';
}

// Base de datos de productos
function getProductDetails(category) {
    const products = {
        "pagina web": {
            description: "Desarrollamos páginas web atractivas y funcionales.",
            price: "$150,000"
        },
      
        "Sistema de Gestión de Inventario": {
            description: "Permite a las empresas controlar su stock y gestionar órdenes.",
            price: "$3,000,000 - $20,000,000"
        },
        "Software de Recursos Humanos": {
            description: "Para gestionar la información de empleados y generación de informes.",
            price: "$4,000,000 - $25,000,000"
        },
        "Sistema de Gestión de Proyectos": {
            description: "Herramienta para planificar, ejecutar y monitorear proyectos.",
            price: "$3,500,000 - $22,000,000"
        },
        "Plataforma de Gestión de Clientes (CRM)": {
            description: "Ayuda a gestionar relaciones con clientes y seguimiento de interacciones.",
            price: "$4,000,000 - $28,000,000"
        },
        "Sistema de Gestión de Tareas": {
            description: "Herramienta para organizar y priorizar tareas.",
            price: "$2,500,000 - $15,000,000"
        },
        "Software de Reservas": {
            description: "Para gestionar citas o reservas en empresas.",
            price: "$3,000,000 - $20,000,000"
        },
        "Aplicación de Gestión de Documentos": {
            description: "Para digitalizar y gestionar documentos en la nube.",
            price: "$3,500,000 - $23,000,000"
        },
        "Sistema de Control de Calidad": {
            description: "Herramienta para establecer y gestionar procesos de control de calidad.",
            price: "$3,000,000 - $20,000,000"
        },
        "Software de Gestión de Eventos": {
            description: "Para planificar y gestionar eventos, incluyendo registro y logística.",
            price: "$2,500,000 - $18,000,000"
        },
        "Sistema de Gestión de Flotas": {
            description: "Para empresas de transporte que necesitan rastrear vehículos y mantenimiento.",
            price: "$4,000,000 - $25,000,000"
        },
        "Plataforma de Encuestas y Feedback": {
            description: "Para recopilar opiniones de clientes o empleados.",
            price: "$2,000,000 - $15,000,000"
        },
        "Software de Gestión de Tiempos y Asistencia": {
            description: "Para monitorear la asistencia y el tiempo de trabajo de los empleados.",
            price: "$3,000,000 - $20,000,000"
        },
        "Aplicación de Gestión de Conocimientos": {
            description: "Para crear un repositorio de información accesible a todos los empleados.",
            price: "$2,500,000 - $18,000,000"
        },
        "Sistema de Gestión de Mantenimiento": {
            description: "Para planificar y realizar el mantenimiento de equipos e instalaciones.",
            price: "$3,500,000 - $23,000,000"
        },
        "juegos 2d":{
            description: "Desarrollamos juegos 2D entretenidos para disfrutar en cualquier dispositivo",
            price: "$150,000 - 3,000,000"
        },
        "juegos educativos":{
            description: "Desarrollamos juegos interactivos y educativos para que los niños aprendan mientras se divierten, a partir de $150,000.",
            price: "$150,000 - 3,000,000"
        }
    };

    return products[category];
}



function showCategory(category) {
    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
        if (category === 'todos' || project.classList.contains(category)) {
            project.style.display = 'flex';
        } else {
            project.style.display = 'none';
        }
    });
}

// Mostrar el chat y ocultar el botón flotante
document.getElementById('chatButton').addEventListener('click', function() {
    document.getElementById('chatbot').style.display = 'block'; // Mostrar el chat
    document.getElementById('chatButton').style.display = 'none'; // Ocultar el botón
});

// Cerrar el chat cuando se haga clic en la "X"
document.getElementById('closeChat').addEventListener('click', function() {
    document.getElementById('chatbot').style.display = 'none'; // Ocultar el chat
    document.getElementById('chatButton').style.display = 'block'; // Volver a mostrar el botón
});

document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío inmediato del formulario

    // Mostrar el modal
    document.getElementById("successModal").style.display = "flex";

    // Enviar el formulario después de 2 segundos 
    setTimeout(function () {
        
        event.target.submit();
    }, 2000); // El formulario se enviará después de 2 segundos
});

// Esto cierra el modal después de 3 segundos
setTimeout(function () {
    document.getElementById("successModal").style.display = "none";
}, 3000);