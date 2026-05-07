# Invitación Digital — Lourdes & Kevin Alfredo
## Documentación de próximos pasos

---

## Estado actual

El prototipo HTML está funcional con:
- Pantalla de sobre animado con sello de cera
- Hero con nombres y fecha, fondo foto real, overlay oscuro para legibilidad
- Countdown en tiempo real (30 mayo 2026)
- Sección "Nuestra historia" con textura de fondo blur, galería de 4 fotos reales y texto en verde olivo
- Sección de evento con mapas embebidos de Google Maps (Templo Santa Teresita + Hotel Plaza Camelinas)
- Itinerario del día con horarios y venues reales
- Dress code con swatches de color
- Mesa de regalos con links reales (Liverpool #51987535 + Amazon)
- Sección de hospedaje con tarifas reales del Hotel Plaza Camelinas
- RSVP conectado a Google Sheets via Apps Script
- Música ambient (archivo MP3 externo via `<audio>`)
- Partículas flotantes (hojas/pétalos) en canvas permanente
- Confirmación por WhatsApp post-RSVP
- Personalización por URL `?invitado=Nombre`
- Memoria de confirmación via localStorage

**Nombres en todo el sitio:** Lourdes & Kevin Alfredo

**Paleta de colores:**
```
--cream:       #F2EAC9
--sage:        #8A8467
--dark-olive:  #54582f
--light-olive: #86895d
--gold:        #9a8a50
--text:        #3a3a2e
```

**Stack:**
- HTML vanilla + CSS + JS (sin frameworks)
- Google Sheets + Apps Script para RSVP
- Deploy: Netlify o Vercel (archivo estático)

---

## Itinerario actual

| Hora    | Evento                          | Lugar                                    |
|---------|---------------------------------|------------------------------------------|
| 4:00 pm | Ceremonia Religiosa             | Templo de Santa Teresita del Niño de Jesús |
| 5:30 pm | Coctel de bienvenida y recepción| Hotel Plaza Camelinas                    |
| 7:00 pm | Cena                            | Salón Principal                          |
| 8:00 pm | Baile y celebración             | Pista de baile                           |

---

## Checklist de contenido pendiente del cliente

```
[ ] Número de WhatsApp para confirmaciones (formato: 521XXXXXXXXXX)
    — actualmente: 5218333009265 (¿confirmar?)
[ ] Nombre del hotel en sección hospedaje (actualmente placeholder)
[ ] Teléfono del hotel para reservaciones
[ ] ¿Habrá hospedaje recomendado adicional para invitados foráneos?
[ ] Canción especial (archivo MP3 en /audio/cancion.mp3)
[ ] ¿Texto de bienvenida personalizado o se aprueba el actual?
```

---

## Funcionalidades completadas

1. ✅ Confirmación por WhatsApp
2. ✅ Nombre personalizado por URL (`?invitado=`)
3. ✅ Mapa embebido de Google Maps (ambas venues)
4. ✅ Memoria de confirmación (localStorage)
5. ✅ Itinerario del día (horarios y venues reales)
6. ✅ Canción especial (estructura lista, falta archivo MP3)
7. ✅ Mesa de regalos con links reales
8. ✅ Sección de hospedaje con tarifas reales
9. ✅ Nombres unificados: "Lourdes & Kevin Alfredo"
10. ✅ Texto de "Nuestra historia" en verde olivo

---

## Posibles mejoras pendientes

### A. Datos del hotel en hospedaje
Rellenar nombre, teléfono y datos de contacto reales del Hotel Plaza Camelinas en la sección de hospedaje.

### B. Número de WhatsApp
Confirmar o corregir el número `5218333009265` usado en los mensajes de confirmación RSVP.

### C. Fotos
- Agregar foto del archivo `audio/cancion.mp3` cuando el cliente la entregue
- Revisar si alguna foto placeholder de Unsplash sigue activa y reemplazar

### D. Deploy final
El archivo es HTML estático, no requiere servidor.

**Opción recomendada — Netlify:**
1. Crear cuenta en [netlify.com](https://netlify.com)
2. Arrastrar la carpeta del proyecto al dashboard
3. Netlify genera un link tipo `https://lourdes-kevinalfredo.netlify.app`
4. Opcional: dominio custom en Namecheap ~$10 USD

**Estructura de carpetas para deploy:**
```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── audio/
│   └── cancion.mp3          ← pendiente
└── resources/
    ├── foto-pareja-con-hijo.webp
    ├── foto-vertical-lago.webp
    ├── foto-vertical-acercamiento-anillo.webp
    ├── foto-vertical-iglesia-fondo.webp
    ├── foto-horizontal-lago.webp
    ├── monogramakevylu.webp
    ├── foto-hotel-texturizado.webp
    └── textura-blanca.webp
```

---

## Notas técnicas

- Todo el CSS está en `css/style.css`, JS en `js/main.js`
- El canvas de pétalos usa `z-index: 10`, el contenido de secciones usa `z-index: 15`
- `APPS_SCRIPT_URL` está en `js/main.js` línea ~96
- `localStorage` key para RSVP: `rsvp_lulu_kevinalfredo`
- Las fuentes se cargan de Google Fonts: Cormorant Garamond, Cinzel, Jost, Pinyon Script
