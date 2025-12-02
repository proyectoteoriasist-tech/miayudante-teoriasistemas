# 🎓 MiAyudante - Teoría de Sistemas

> Plataforma educativa gamificada para el curso de Teoría de Sistemas de UADE

## 📋 Descripción General

**MiAyudante** es una plataforma web educativa diseñada específicamente para el curso de **Teoría de Sistemas** de la **Universidad Argentina de la Empresa (UADE)**. Su objetivo principal es facilitar el aprendizaje de los estudiantes mediante una experiencia interactiva y gamificada.

### 🎯 Características Principales

- **📚 Contenido Teórico Estructurado**: 5 módulos completos que cubren los temas fundamentales de la materia
- **🎮 Evaluaciones Gamificadas**: 5 tipos diferentes de juegos educativos para evaluar el aprendizaje
- **🏆 Sistema de Insignias**: Recompensas por completar cada módulo exitosamente
- **📝 Notas Personales**: Bloc de notas integrado para cada módulo con soporte para imágenes
- **💾 Guardado Automático**: Todo el progreso se guarda automáticamente en el navegador
- **🔍 Búsqueda Integrada**: Encuentra contenido específico en toda la plataforma
- **🌙 Modo Oscuro/Claro**: Interfaz adaptable a las preferencias del usuario
- **📱 Diseño Responsivo**: Funciona en computadoras, tablets y celulares

---

## 📚 Módulos de Contenido

La plataforma está organizada en 5 unidades principales:

| Módulo | Título | Descripción |
|--------|--------|-------------|
| 1️⃣ | **Teoría General de los Sistemas** | Introducción a los conceptos fundamentales, la visión sistémica y los modelos de sistemas |
| 2️⃣ | **Organizaciones como Sistemas** | Las organizaciones desde la perspectiva sistémica, estructura y dinámica organizacional |
| 3️⃣ | **Información en las Organizaciones** | El rol de la información, flujos de datos y gestión de la información |
| 4️⃣ | **Sistemas de Información** | Tipos de sistemas de información, ERP, CRM, BI y sistemas integrados |
| 5️⃣ | **Tecnologías Disruptivas** | Cloud Computing, IoT, Big Data, IA y transformación digital |

Cada módulo contiene:
- Contenido teórico detallado con ejemplos
- Diagramas e imágenes explicativas
- Cuadros comparativos y resúmenes
- Evaluación gamificada
- Insignia por aprobación

---

## 🎮 Tipos de Evaluaciones

La plataforma incluye **5 tipos diferentes de evaluaciones gamificadas**:

### 🏰 Escape Room
Resuelve acertijos y preguntas para "escapar" de habitaciones temáticas. Cada habitación tiene múltiples desafíos que deben completarse en orden.

### 🔤 Pasapalabra
Inspirado en el famoso juego televisivo. Responde preguntas asociadas a cada letra del abecedario. Debes acertar un porcentaje mínimo para aprobar.

### ⏱️ Quiz con Tiempo
Preguntas de opción múltiple con tiempo limitado. Cada respuesta correcta suma puntos, y el tiempo restante también influye en la puntuación.

### 🔗 Conectar Conceptos
Une conceptos con sus definiciones o características correspondientes. Ideal para reforzar relaciones entre términos.

### 📋 Casos Prácticos
Analiza situaciones reales de empresas y responde preguntas de análisis. Desarrolla el pensamiento crítico aplicado.

---

## 🏆 Sistema de Insignias

Al aprobar la evaluación de cada módulo (≥60%), el estudiante desbloquea una insignia única:

| Insignia | Módulo | Requisito |
|----------|--------|-----------|
| 🌟 Pensador Sistémico | Módulo 1 | Aprobar evaluación |
| 🏢 Analista Organizacional | Módulo 2 | Aprobar evaluación |
| 📊 Maestro de la Información | Módulo 3 | Aprobar evaluación |
| 💻 Arquitecto de SI | Módulo 4 | Aprobar evaluación |
| 🚀 Visionario Digital | Módulo 5 | Aprobar evaluación |

Las insignias se muestran en el perfil del estudiante y en la sección de logros del dashboard.

---

## 💾 Almacenamiento de Datos

La plataforma utiliza **localStorage** del navegador para guardar:

- **Nombre del estudiante**: Personalización de la experiencia
- **Progreso del curso**: Módulos y secciones visitadas
- **Módulos completados**: Estado de cada evaluación
- **Mejores puntajes**: Record de puntuación en cada evaluación
- **Insignias desbloqueadas**: Logros obtenidos
- **Notas personales**: Contenido del bloc de notas de cada módulo
- **Preferencias**: Tema claro/oscuro

> ⚠️ **Importante**: Los datos se guardan localmente en el navegador. Si se borra el historial o se cambia de navegador/dispositivo, el progreso se reiniciará.

---

## 🔐 Panel de Administración

La plataforma incluye un **panel de administración oculto** para que el profesor pueda gestionar todo el contenido sin tocar código.

### Acceso al Panel Admin

**Opción 1 - Atajo de teclado:**
```
Ctrl + Shift + A (Windows/Linux)
Cmd + Shift + A (Mac)
```

**Opción 2 - URL directa:**
```
https://tu-sitio.vercel.app/?admin=true
```

**Contraseña por defecto:** `uade2025`

### Funcionalidades del Panel

- **📚 Gestionar Módulos**: Agregar, editar y eliminar módulos. Modificar títulos, iconos y contenido de cada sección con un editor visual tipo Word.
- **🎮 Configurar Evaluaciones**: Editar preguntas, opciones, respuestas correctas y explicaciones de cada tipo de evaluación.
- **🏆 Editar Insignias**: Personalizar emoji, nombre y descripción de cada insignia.
- **💾 Exportar JSON**: Descargar toda la configuración para publicar cambios.

---

## 🚀 Infraestructura y Hosting

### Plataformas Utilizadas

| Plataforma | Uso | URL |
|------------|-----|-----|
| **GitHub** | Repositorio del código fuente | [github.com/proyectoteoriasist-tech/miayudante-teoriasistemas](https://github.com/proyectoteoriasist-tech/miayudante-teoriasistemas) |
| **Vercel** | Hosting y deploy automático | [Vercel Dashboard](https://vercel.com/proyecto-teoria-de-sistemas-uades-projects/miayudante-teoriasistemas) |

### Credenciales de Acceso

Ambas plataformas están configuradas con la siguiente cuenta de Google:

| Campo | Valor |
|-------|-------|
| **Email** | `proyectoteoriasist@gmail.com` |
| **Contraseña** | `PlataformaTSUADE#1` |

> 💡 **Importante**: En GitHub y Vercel, usar la opción **"Continuar con Google"** e ingresar con esta cuenta.

### Arquitectura de Deploy

```
Panel Admin → Exportar JSON → GitHub (commit) → Vercel (deploy automático)
```

1. El profesor edita contenido en el Panel Admin
2. Exporta el archivo JSON con la configuración
3. Sube el archivo a GitHub (reemplaza `contenido-teorico.json`)
4. Vercel detecta el cambio y hace deploy automáticamente (1-2 min)
5. Los cambios están disponibles para todos los estudiantes

---

## 📁 Estructura del Proyecto

```
miayudante-teoriasistemas/
├── index.html              # Página principal
├── styles.css              # Estilos de la aplicación
├── app.js                  # Lógica de la aplicación
├── contenido-teorico.json  # Contenido de módulos y evaluaciones
├── readme.md               # Este archivo
└── imagenes/               # Carpeta de imágenes
    ├── Caja Negra.png
    ├── Caja Blanca.png
    └── ...
```

### Archivos Clave

- **`index.html`**: Estructura HTML de toda la aplicación, incluyendo el panel admin
- **`styles.css`**: Todos los estilos CSS (modo claro, oscuro, responsive, animaciones)
- **`app.js`**: Toda la lógica JavaScript (evaluaciones, guardado, navegación, admin)
- **`contenido-teorico.json`**: Datos de módulos, secciones, evaluaciones e insignias

---

## 🔧 Guía para Publicar Cambios

### Paso a Paso Detallado

#### 1️⃣ Editar contenido en el Panel Admin
- Abre la plataforma y accede al panel admin (Ctrl+Shift+A)
- Ingresa la contraseña: `uade2025`
- Realiza los cambios necesarios en módulos, evaluaciones o insignias
- Los cambios se guardan automáticamente mientras editas

#### 2️⃣ Exportar el archivo JSON
- Ve a la pestaña **"💾 Exportar JSON"**
- Haz clic en **"📥 Exportar JSON"**
- Se descargará `contenido-admin-exportado.json`

#### 3️⃣ Subir a GitHub
- Ingresa a [github.com/proyectoteoriasist-tech/miayudante-teoriasistemas](https://github.com/proyectoteoriasist-tech/miayudante-teoriasistemas)
- Click en **"Sign in with Google"**
- Usa: `proyectoteoriasist@gmail.com` / `PlataformaTSUADE#1`
- Busca el archivo `contenido-teorico.json`
- Click en el archivo → Click en el ícono de lápiz (✏️)
- Borra todo → Pega el contenido del archivo descargado
- Click en **"Commit changes"**

**Método alternativo (más fácil):**
- En el repositorio, click en **"Add file"** → **"Upload files"**
- Arrastra el archivo `contenido-admin-exportado.json`
- Renómbralo a `contenido-teorico.json` si es necesario
- Click en **"Commit changes"**

#### 4️⃣ Esperar el deploy automático
- Vercel detectará el cambio automáticamente
- El deploy toma aproximadamente 1-2 minutos
- No es necesario hacer nada en Vercel

#### 5️⃣ Verificar cambios
- Recarga la plataforma después de 2 minutos
- Los cambios estarán visibles para todos los estudiantes

---

## 🖼️ Manejo de Imágenes

Las imágenes **NO se incluyen** en el archivo JSON exportado. Para agregar nuevas imágenes:

### Pasos para agregar imágenes

1. **Preparar la imagen**: Formato PNG o JPG recomendado
2. **Subir a GitHub**: Navega a `/imagenes` → "Add file" → "Upload files"
3. **Nombrar correctamente**: Sin caracteres especiales (ñ, acentos)
4. **Referenciar en el contenido**: Usar el nombre exacto del archivo

### Nombres de archivo válidos
- ✅ `diagrama-sistemas.png`
- ✅ `Caja Negra.png`
- ❌ `diagrama_año_2025.png` (contiene ñ)

---

## 👨‍🏫 Información del Curso

| Campo | Valor |
|-------|-------|
| **Universidad** | UADE - Universidad Argentina de la Empresa |
| **Materia** | Teoría de Sistemas |
| **Profesor** | Marcelo Castro |
| **Año** | 2025 |

---

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos, animaciones, variables CSS, flexbox, grid
- **JavaScript (ES6+)**: Lógica de la aplicación
- **LocalStorage API**: Persistencia de datos
- **Vercel**: Hosting y CDN
- **GitHub**: Control de versiones

---

## 📞 Soporte

Si tienes problemas con la plataforma:

1. **Verifica las credenciales**: Asegúrate de usar la cuenta correcta
2. **Revisa el estado de Vercel**: [vercel.com](https://vercel.com) → Login con Google
3. **Comprueba el repositorio**: [github.com](https://github.com) → Login con Google
4. **Borra caché del navegador**: Si los cambios no se reflejan

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos para UADE.

© 2025 - Prof. Marcelo Castro - UADE
