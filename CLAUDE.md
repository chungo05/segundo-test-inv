# CLAUDE.md — Invitación Digital Lourdes & Kevin Alfredo

## Proyecto

Invitación de boda digital, sitio estático (HTML + CSS + JS vanilla, sin frameworks).
Boda: **30 de mayo de 2026 · Querétaro, México**.

## Estructura de archivos

```
/
├── index.html              — todo el HTML del sitio
├── css/style.css           — todos los estilos
├── js/main.js              — lógica JS (RSVP, countdown, música, petals)
├── js/apps-script.js       — código para Google Apps Script (RSVP → Sheets)
├── resources/
│   ├── foto-hotel-texturizado.webp     — fondo del hero
│   ├── textura-blanca.webp             — fondo blur sección historia
│   ├── monogramakevylu.webp            — monograma en el hero
│   ├── foto-vertical-lago.webp         — galería
│   ├── foto-vertical-acercamiento-anillo.webp
│   ├── foto-vertical-iglesia-fondo.webp
│   ├── foto-horizontal-lago.webp
│   ├── foto-pareja-con-hijo.webp       — sección cierre (LM = hijo de la pareja)
│   └── videoplayback.webm              — canción: "To Build a Home" (The Cinematic Orchestra)
└── antigravity/
    └── proximos-pasos.md   — documentación interna del proyecto
```

## Paleta de colores

```css
--cream:       #F2EAC9
--bg:          #F5F0E2
--sage:        #8A8467
--dark-olive:  #54582f   /* color principal de texto y UI */
--light-olive: #86895d
--gold:        #9a8a50
--text:        #3a3a2e
```

## Tipografías (Google Fonts)

- **Pinyon Script** — nombres de los novios en el hero
- **Cormorant Garamond** — títulos de sección, texto elegante
- **Cinzel** — labels, números del countdown
- **Jost** — cuerpo de texto, botones, UI general

## Secciones del sitio (en orden)

1. **Sobre animado** (`#envelope-screen`) — pantalla de entrada con sello de cera K&L
2. **Hero** (`#hero`) — fondo `foto-hotel-texturizado.webp` + overlay oscuro, monograma, nombres en Pinyon Script
3. **Countdown** (`#countdown`) — cuenta regresiva a 30 mayo 2026 16:00, fade blur en borde inferior
4. **Nuestra historia** (`#historia`) — fondo `textura-blanca.webp` con blur, cita 1 Corintios 13:4-7, galería 4 fotos
5. **Ceremonia & Recepción** (`#evento`) — dos cards con mapas embebidos de Google Maps
6. **Itinerario** (`#itinerario`) — timeline vertical (4:00 pm, 5:30 pm, 7:00 pm, 8:00 pm)
7. **Dress code** (`#dresscode`) — swatches de color y descripción
8. **Mesa de regalos** (`#regalos`) — Liverpool #51987535 y Amazon
9. **Hospedaje** (`#hospedaje`) — Hotel Plaza Camelinas con tarifas reales
10. **RSVP** (`#rsvp`) — formulario → Google Sheets + botón WhatsApp post-confirmación
11. **Cierre** — foto `foto-pareja-con-hijo.webp`, firma "LM, L & K"
12. **Footer** — nombres y año

## Venues reales

- **Ceremonia:** Templo de Santa Teresita del Niño de Jesús, Querétaro
- **Recepción/Cena/Baile:** Hotel Plaza Camelinas, Querétaro

## RSVP

- Google Apps Script URL en `js/main.js` línea ~96 (`APPS_SCRIPT_URL`)
- `js/apps-script.js` es el código a pegar en Google Apps Script
- localStorage key: `rsvp_lulu_kevinalfredo`
- WhatsApp de confirmación: `5218333009265` (pendiente confirmar con cliente)

## Personalización por URL

`index.html?invitado=NombreInvitado` — saluda por nombre en el hero y pre-llena el formulario RSVP.

## Música

`<audio id="bgMusic" loop>` carga `resources/videoplayback.webm`.
Fade-in al abrir el sobre, toggle con el botón flotante.

## Convenciones de código

- Sin frameworks, sin build tools — editar directamente los 3 archivos (index.html, css/style.css, js/main.js)
- Las animaciones de entrada usan la clase `.reveal` + IntersectionObserver; los delays con `.rd1`, `.rd2`, `.rd3`
- El canvas de pétalos tiene `z-index: 10`; el contenido de secciones `z-index: 15`
- Pseudo-elemento `::before` en `#historia` para el fondo blur (evitar que el blur sangre al contenido)

## Pendientes del cliente

- Confirmar número de WhatsApp (`5218333009265`)
- Datos de contacto del Hotel Plaza Camelinas para sección hospedaje
