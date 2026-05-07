    // Revisar si ya confirmó
    const savedRSVP = localStorage.getItem('rsvp_lulu_kevinalfredo');
    if (savedRSVP) {
      const saved = JSON.parse(savedRSVP);
      const rsvpSection = document.querySelector('.rsvp-form');
      if (rsvpSection) {
        rsvpSection.innerHTML = `
          <div style="text-align:center; padding: 2rem; border: 1px solid rgba(138,132,103,0.3);">
            <p style="font-family:'Cormorant Garamond',serif; font-style:italic; font-size:1.4rem; color:var(--dark-olive); margin-bottom:0.5rem;">
              ${saved.asistencia === 'si' ? '¡Ya confirmaste tu asistencia! 🌿' : 'Ya registramos que no podrás asistir.'}
            </p>
            <p style="font-size:0.75rem; color:var(--sage); letter-spacing:0.15em; margin-bottom: 1.5rem;">
              ${saved.nombre}
            </p>
            <button onclick="resetRSVP()" style="background:transparent; border:1px solid var(--gold); color:var(--gold); padding:0.5rem 1rem; font-family:'Jost', sans-serif; font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; transition:all 0.3s;" onmouseover="this.style.background='rgba(154,138,80,0.1)'" onmouseout="this.style.background='transparent'">
              Modificar respuesta
            </button>
          </div>
        `;
      }
    }

    function resetRSVP() {
      localStorage.removeItem('rsvp_lulu_kevinalfredo');
      window.location.reload();
    }

    // Personalización por URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('invitado');

    if (guestName) {
      const eyebrow = document.querySelector('.hero-eyebrow');
      if (eyebrow) eyebrow.textContent = `Hola ${guestName}, los invitan a celebrar`;

      const nameInput = document.querySelector('#rsvp input[type="text"]');
      if (nameInput) nameInput.value = guestName;
    }

    /* ══════════════════════════════
       ENVELOPE
    ══════════════════════════════ */
    function openEnvelope() {
      const screen = document.getElementById('envelope-screen');
      const main = document.getElementById('main-content');
      const player = document.getElementById('music-player');

      screen.classList.add('opening');

      setTimeout(() => {
        screen.style.display = 'none';
        main.classList.add('visible');
        player.classList.remove('hidden');
        startAmbientMusic();
      }, 1000);
    }

    /* ══════════════════════════════
       COUNTDOWN
    ══════════════════════════════ */
    const wedding = new Date('2026-05-30T16:00:00');

    function tick() {
      const diff = wedding - new Date();
      if (diff <= 0) return;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      document.getElementById('cd-d').textContent = String(d).padStart(2, '0');
      document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
      document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
      document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);

    /* ══════════════════════════════
       SCROLL REVEAL
    ══════════════════════════════ */
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    /* ══════════════════════════════
       RSVP
    ══════════════════════════════ */

    // ⚠️ Reemplaza esta URL con la que te dio Google al publicar el Apps Script
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxwHzwNOGh2H8gNbI8tYIMAF1n5ou9tEpupvWqoU3EM20Zk1bKKjevCIeGwqq16yTA/exec';

    let attending = true;

    function pickAttend(el, val) {
      attending = val;
      document.querySelectorAll('.toggle-opt').forEach(o => o.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('guest-row').style.display = val ? 'grid' : 'none';
    }

    async function handleRSVP(e) {
      e.preventDefault();

      const form = e.target;
      const btnSpan = form.querySelector('.btn-submit span');
      const btn = form.querySelector('.btn-submit');

      // Leer valores del form
      const nombre = form.querySelector('input[type="text"]').value.trim();
      const adultos = attending ? form.querySelector('#select-adultos').value : 0;
      const ninos = attending ? form.querySelector('#select-ninos').value : 0;

      // Validación mínima
      if (!nombre) {
        form.querySelector('input[type="text"]').style.borderColor = '#c0392b';
        return;
      }

      // Estado: enviando
      btn.disabled = true;
      btnSpan.textContent = 'Enviando...';

      const payload = {
        nombre,
        asistencia: attending ? 'si' : 'no',
        adultos,
        ninos,
      };

      try {
        // Google Apps Script no soporta JSON POST con CORS limpio,
        // usamos no-cors y asumimos éxito si no hay error de red
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        // Éxito visual
        btnSpan.textContent = attending ? '¡Confirmado! 🌿' : 'Recibido, ¡gracias!';
        btn.style.background = attending
          ? 'rgba(84,88,47,0.15)'
          : 'rgba(138,132,103,0.15)';

        const waMsg = encodeURIComponent(
          attending
            ? `Hola! Soy ${nombre}, confirmo mi asistencia a la boda de Lourdes & Kevin Alfredo el 30 de mayo. Seremos ${adultos} adultos y ${ninos} niños.`
            : `Hola! Soy ${nombre}, lamentablemente no podré asistir a la boda de Lourdes & Kevin Alfredo. ¡Felicidades a los novios!`
        );
        const waNumber = '5218333009265'; // reemplazar con número real de Kevin

        const waBtn = document.createElement('a');
        waBtn.href = `https://wa.me/${waNumber}?text=${waMsg}`;
        waBtn.target = '_blank';
        waBtn.className = 'btn-wa';
        waBtn.innerHTML = '<span>Enviar confirmación por WhatsApp 💬</span>';
        form.appendChild(waBtn);

        // Guardar confirmación en localStorage
        localStorage.setItem('rsvp_lulu_kevinalfredo', JSON.stringify({
          nombre,
          asistencia: attending ? 'si' : 'no',
          timestamp: new Date().toISOString()
        }));

        form.querySelectorAll('input, select').forEach(el => el.disabled = true);
        document.querySelectorAll('.toggle-opt').forEach(el => el.style.pointerEvents = 'none');

      } catch (err) {
        // Error de red
        btnSpan.textContent = 'Error al enviar, intenta de nuevo';
        btn.disabled = false;
        console.error('RSVP error:', err);
      }
    }

    /* ══════════════════════════════
       MUSIC PLAYER
    ══════════════════════════════ */
    const bgMusic = document.getElementById('bgMusic');
    let musicPlaying = false;

    function startAmbientMusic() {
      bgMusic.volume = 0;
      bgMusic.play().catch(() => { }); // catch por autoplay policy
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

    function toggleMusic() {
      if (musicPlaying) {
        fadeOutMusic();
        musicPlaying = false;
        document.getElementById('music-toggle').textContent = '▶';
        document.getElementById('music-bars').classList.remove('playing');
      } else {
        if (bgMusic.paused) bgMusic.play().catch(() => { });
        fadeInMusic();
        musicPlaying = true;
        document.getElementById('music-toggle').textContent = '⏸';
        document.getElementById('music-bars').classList.add('playing');
      }
    }

    /* ══════════════════════════════
       FLOATING PETALS / BOTANICALS
       Canvas particle system
    ══════════════════════════════ */
    (function initPetals() {
      const canvas = document.getElementById('petal-canvas');
      const ctx = canvas.getContext('2d');
      let W, H, petals = [];

      const COLORS = ['#8A8467', '#86895d', '#54582f', '#c9a84c', '#F2EAC9', '#a8ab7a'];

      function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resize);
      resize();

      // Draw a leaf/petal shape
      function drawLeaf(ctx, x, y, size, angle, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.bezierCurveTo(size * 0.6, -size * 0.5, size * 0.6, size * 0.5, 0, size);
        ctx.bezierCurveTo(-size * 0.6, size * 0.5, -size * 0.6, -size * 0.5, 0, -size);
        ctx.fill();
        ctx.restore();
      }

      // Alcatraz / calla lily petal variant
      function drawPetal(ctx, x, y, size, angle, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.fillStyle = 'transparent';
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.3, size, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      function spawnPetal() {
        return {
          x: Math.random() * W,
          y: -30 - Math.random() * 100,
          size: 4 + Math.random() * 10,
          angle: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.4,
          vy: 0.3 + Math.random() * 0.6,
          va: (Math.random() - 0.5) * 0.015,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: 0.08 + Math.random() * 0.14,
          type: Math.random() > 0.5 ? 'leaf' : 'petal',
        };
      }

      // Pre-populate
      for (let i = 0; i < 35; i++) {
        const p = spawnPetal();
        p.y = Math.random() * H;
        petals.push(p);
      }

      function frame() {
        ctx.clearRect(0, 0, W, H);

        petals.forEach((p, i) => {
          p.x += p.vx + Math.sin(Date.now() * 0.001 + i) * 0.15;
          p.y += p.vy;
          p.angle += p.va;

          if (p.type === 'leaf') drawLeaf(ctx, p.x, p.y, p.size, p.angle, p.color, p.alpha);
          else drawPetal(ctx, p.x, p.y, p.size, p.angle, p.color, p.alpha);

          if (p.y > H + 40) {
            petals[i] = spawnPetal();
          }
        });

        // Occasionally add new petals
        if (petals.length < 45 && Math.random() < 0.02) petals.push(spawnPetal());

        requestAnimationFrame(frame);
      }
      frame();
    })();