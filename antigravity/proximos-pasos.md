# Invitación Digital — Kevin & Lourdes
## Documentación de próximos pasos para Cursor

---

## Estado actual

El prototipo HTML está funcional con:
- Pantalla de sobre animado con sello de cera
- Hero con nombres y fecha
- Countdown en tiempo real (30 mayo 2026)
- Galería con fotos placeholder de Unsplash
- Sección de evento (ceremonia y recepción)
- Dress code con swatches de color
- Mesa de regalos (Liverpool y Amazon)
- RSVP conectado a Google Sheets via Apps Script
- Música ambient generada con Web Audio API
- Partículas flotantes (hojas/pétalos) en canvas permanente
- Animaciones de hover en todos los botones

**Paleta de colores:**
```
--cream:       #F2EAC9
--sage:        #8A8467
--dark-olive:  #54582f
--light-olive: #86895d
--gold:        #9a8a50
```

**Stack:**
- HTML vanilla + CSS + JS (sin frameworks)
- Google Sheets + Apps Script para RSVP
- Deploy: Netlify o Vercel (archivo estático)

---

## Funcionalidades pendientes (Completadas)

### 1. Confirmación por WhatsApp [COMPLETADO]
Al hacer submit exitoso del RSVP, mostrar un botón secundario que abra WhatsApp con mensaje pre-llenado.

**Comportamiento esperado:**
- Solo aparece después de confirmar exitosamente
- Abre `https://wa.me/521XXXXXXXXXX?text=...` con el número de tu hermano
- El mensaje pre-llenado incluye nombre e información de asistencia

**Código a agregar** en `handleRSVP()`, dentro del bloque de éxito después de actualizar el botón:

```javascript
// Después de la línea: btn.style.background = ...

const waMsg = encodeURIComponent(
  attending
    ? `Hola! Soy ${nombre}, confirmo mi asistencia a la boda de Kevin & Lourdes el 30 de mayo. Seremos ${adultos} adultos y ${ninos} niños. 🌿`
    : `Hola! Soy ${nombre}, lamentablemente no podré asistir a la boda de Kevin & Lourdes. ¡Felicidades a los novios!`
);
const waNumber = '521XXXXXXXXXX'; // reemplazar con número real de Kevin

const waBtn = document.createElement('a');
waBtn.href = `https://wa.me/${waNumber}?text=${waMsg}`;
waBtn.target = '_blank';
waBtn.className = 'btn-wa';
waBtn.innerHTML = '<span>Enviar confirmación por WhatsApp 💬</span>';
form.appendChild(waBtn);
```

**CSS a agregar:**
```css
.btn-wa {
  display: block;
  margin-top: 0.75rem;
  padding: 0.85rem 2rem;
  background: #25D366;
  color: white;
  text-align: center;
  font-family: 'Jost', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.3s ease, transform 0.3s ease;
}
.btn-wa:hover {
  background: #1ebe5d;
  transform: translateY(-2px);
}
```

---

### 2. Nombre personalizado por URL [COMPLETADO]
El invitado recibe un link como `index.html?invitado=Juan` y la página lo saluda por nombre en el hero.

**Comportamiento esperado:**
- Si hay parámetro `?invitado=Nombre`, el eyebrow del hero cambia de "Los invitan a celebrar" a "Hola Nombre, los invitan a celebrar"
- Si no hay parámetro, se muestra el texto genérico normal
- El nombre también se pre-llena en el campo del formulario RSVP

**Código a agregar** al inicio del bloque `<script>`, antes de cualquier función:

```javascript
// Personalización por URL
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('invitado');

if (guestName) {
  const eyebrow = document.querySelector('.hero-eyebrow');
  if (eyebrow) eyebrow.textContent = `Hola ${guestName}, los invitan a celebrar`;

  const nameInput = document.querySelector('#rsvp input[type="text"]');
  if (nameInput) nameInput.value = guestName;
}
```

---

### 3. Mapa embebido de Google Maps [COMPLETADO]
Reemplazar los botones "Ver en mapa" por un embed de Google Maps dentro de cada card de evento.

**Comportamiento esperado:**
- Mapa interactivo dentro de la card, debajo de la dirección
- Altura fija de 180px
- Al hacer click abre Google Maps en una nueva pestaña

**HTML a reemplazar** en cada `.event-card`, después del botón `.btn-map`:

```html
<!-- Quitar el <button class="btn-map"> existente y reemplazar con: -->
<div class="map-embed">
  <iframe
    src="https://www.google.com/maps/embed?pb=REEMPLAZAR_CON_EMBED_URL"
    width="100%"
    height="180"
    style="border:0; filter: saturate(0.6) sepia(0.2);"
    allowfullscreen=""
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade">
  </iframe>
  <a href="https://maps.google.com/?q=DIRECCION" target="_blank" class="btn-map">
    Abrir en Google Maps →
  </a>
</div>
```

**Cómo obtener la URL del embed:**
1. Busca el lugar en Google Maps
2. Click en Compartir → Insertar mapa
3. Copia solo la URL del atributo `src` del iframe

**CSS a agregar:**
```css
.map-embed {
  margin-top: 1rem;
  overflow: hidden;
  border: 1px solid rgba(138,132,103,0.2);
}
.map-embed .btn-map {
  display: block;
  width: 100%;
  text-align: center;
  padding: 0.6rem;
  border: none;
  border-top: 1px solid rgba(138,132,103,0.2);
}
```

---

### 4. Memoria de confirmación (localStorage) [COMPLETADO]
Si el invitado ya confirmó y regresa a la página, mostrar su confirmación en lugar del form vacío.

**Comportamiento esperado:**
- Al confirmar exitosamente, guardar en `localStorage` el nombre y tipo de respuesta
- Al cargar la página, revisar si ya existe una confirmación guardada
- Si existe, mostrar mensaje de confirmación en lugar del form

**Código a agregar** en `handleRSVP()`, en el bloque de éxito:

```javascript
// Guardar confirmación en localStorage
localStorage.setItem('rsvp_kevin_lourdes', JSON.stringify({
  nombre,
  asistencia: attending ? 'si' : 'no',
  timestamp: new Date().toISOString()
}));
```

**Código a agregar** al inicio del script (antes de las funciones), para revisar al cargar:

```javascript
// Revisar si ya confirmó
const savedRSVP = localStorage.getItem('rsvp_kevin_lourdes');
if (savedRSVP) {
  const saved = JSON.parse(savedRSVP);
  const rsvpSection = document.querySelector('.rsvp-form');
  if (rsvpSection) {
    rsvpSection.innerHTML = `
      <div style="text-align:center; padding: 2rem; border: 1px solid rgba(138,132,103,0.3);">
        <p style="font-family:'Cormorant Garamond',serif; font-style:italic; font-size:1.4rem; color:var(--dark-olive); margin-bottom:0.5rem;">
          ${saved.asistencia === 'si' ? '¡Ya confirmaste tu asistencia! 🌿' : 'Ya registramos que no podrás asistir.'}
        </p>
        <p style="font-size:0.75rem; color:var(--sage); letter-spacing:0.15em;">
          ${saved.nombre}
        </p>
      </div>
    `;
  }
}
```

---

### 5. Itinerario del día [COMPLETADO]
Timeline visual con los momentos clave de la boda.

**Comportamiento esperado:**
- Sección nueva entre Evento y Dress Code
- Timeline vertical con iconos, hora y descripción de cada momento

**HTML a agregar** después de `</section>` de `#evento`:

```html
<section id="itinerario">
  <div class="section-inner">
    <div class="divider reveal"><span>✦ ✦ ✦</span></div>
    <p class="section-label reveal">El gran día</p>
    <h2 class="section-title reveal rd1">Itinerario</h2>
    <div class="timeline">
      <div class="timeline-item reveal rd1">
        <span class="tl-time">16:00</span>
        <div class="tl-dot"></div>
        <div class="tl-content">
          <h4>Ceremonia religiosa</h4>
          <p>Templo San Francisco</p>
        </div>
      </div>
      <div class="timeline-item reveal rd2">
        <span class="tl-time">17:30</span>
        <div class="tl-dot"></div>
        <div class="tl-content">
          <h4>Coctel de bienvenida</h4>
          <p>Jardín La Hacienda</p>
        </div>
      </div>
      <div class="timeline-item reveal rd3">
        <span class="tl-time">19:00</span>
        <div class="tl-dot"></div>
        <div class="tl-content">
          <h4>Recepción y cena</h4>
          <p>Salón principal</p>
        </div>
      </div>
      <div class="timeline-item reveal">
        <span class="tl-time">21:00</span>
        <div class="tl-dot"></div>
        <div class="tl-content">
          <h4>Baile y celebración</h4>
          <p>Hasta el amanecer 🌿</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

**CSS a agregar:**
```css
.timeline {
  max-width: 480px;
  margin: 2.5rem auto 0;
  position: relative;
  padding-left: 2rem;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 80px;
  top: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--gold), transparent);
}
.timeline-item {
  display: grid;
  grid-template-columns: 60px 20px 1fr;
  gap: 0 1rem;
  align-items: flex-start;
  margin-bottom: 2.5rem;
}
.tl-time {
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  color: var(--gold);
  padding-top: 0.1rem;
  text-align: right;
}
.tl-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--gold);
  border: 2px solid var(--cream);
  box-shadow: 0 0 0 2px var(--gold);
  margin-top: 0.2rem;
  justify-self: center;
}
.tl-content h4 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  color: var(--dark-olive);
  margin-bottom: 0.2rem;
}
.tl-content p {
  font-size: 0.78rem;
  color: var(--sage);
  font-weight: 200;
}
```

---

### 6. Canción especial (reemplazar Web Audio) [COMPLETADO]
Cambiar el ambient generado por Web Audio por un archivo de audio real.

**Comportamiento esperado:**
- Mismo botón flotante de música
- Carga el archivo de audio que elijan los novios
- Hace loop automáticamente

**HTML a reemplazar** — busca `<audio id="bgMusic" loop>` y reemplaza todo el bloque:

```html
<audio id="bgMusic" loop preload="none">
  <source src="./audio/cancion.mp3" type="audio/mpeg">
  <source src="./audio/cancion.ogg" type="audio/ogg">
</audio>
```

**Cambios en JS** — reemplazar `startAmbientMusic()`, `playAmbient()`, `stopAmbient()` y `toggleMusic()` con:

```javascript
const bgMusic = document.getElementById('bgMusic');

function startAmbientMusic() {
  bgMusic.volume = 0;
  bgMusic.play().catch(() => {}); // catch por autoplay policy
  fadeInMusic();
}

function fadeInMusic() {
  let vol = 0;
  const interval = setInterval(() => {
    vol = Math.min(vol + 0.02, 0.35);
    bgMusic.volume = vol;
    if (vol >= 0.35) clearInterval(interval);
  }, 100);
}

function fadeOutMusic() {
  let vol = bgMusic.volume;
  const interval = setInterval(() => {
    vol = Math.max(vol - 0.02, 0);
    bgMusic.volume = vol;
    if (vol <= 0) {
      bgMusic.pause();
      clearInterval(interval);
    }
  }, 100);
}

let musicPlaying = false;

function toggleMusic() {
  if (musicPlaying) {
    fadeOutMusic();
    musicPlaying = false;
    document.getElementById('music-toggle').textContent = '▶';
    document.getElementById('music-bars').classList.remove('playing');
  } else {
    if (bgMusic.paused) bgMusic.play().catch(() => {});
    fadeInMusic();
    musicPlaying = true;
    document.getElementById('music-toggle').textContent = '⏸';
    document.getElementById('music-bars').classList.add('playing');
  }
}
```

**Instrucciones para el archivo de audio:**
- Crear carpeta `audio/` junto al `index.html`
- Poner el archivo como `cancion.mp3`
- Formato recomendado: MP3 128kbps (buen balance calidad/peso)
- Peso máximo recomendado: 5MB para carga rápida en móvil

---

## Checklist de contenido pendiente del cliente

Antes de hacer deploy final, Kevin & Lourdes deben entregar:

```
[ ] Dirección exacta de ceremonia (para embed de Maps)
[ ] Dirección exacta de recepción (para embed de Maps)
[ ] Número de WhatsApp para confirmaciones (formato: 521XXXXXXXXXX)
[ ] Número de evento Liverpool (o link directo)
[ ] Link de lista Amazon
[ ] 5-8 fotos de la pareja (preferible vertical, mín 800px)
[ ] Hora exacta de cada momento del itinerario
[ ] Canción especial (archivo MP3 o link de referencia)
[ ] Texto de bienvenida personalizado (o aprobación del texto actual)
[ ] ¿Habrá hospedaje recomendado para invitados foráneos?
```

---

## Deploy

El archivo es HTML estático, no requiere servidor.

**Opción recomendada — Netlify:**
1. Crear cuenta en [netlify.com](https://netlify.com)
2. Arrastrar la carpeta del proyecto al dashboard
3. Netlify genera un link tipo `https://kevin-lourdes.netlify.app`
4. Opcional: dominio custom en Namecheap ~$10 USD

**Estructura de carpetas para deploy:**
```
/
├── index.html
├── audio/
│   └── cancion.mp3
└── (fotos se cargan desde Unsplash o se agregan aquí)
```

---

## Notas técnicas para Cursor

- Todo el código está en un solo archivo `index.html` (HTML + CSS + JS inline)
- El canvas de pétalos usa `z-index: 10`, el contenido de secciones usa `z-index: 15`
- El Apps Script URL está en la constante `APPS_SCRIPT_URL` al inicio del bloque script
- Las fuentes se cargan de Google Fonts: Cormorant Garamond, Cinzel, Jost
- La música ambient usa Web Audio API nativo, sin librerías externas
- `localStorage` key para RSVP: `rsvp_kevin_lourdes`
