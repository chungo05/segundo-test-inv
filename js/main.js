/* ══════════════════════════════
   ENVELOPE
══════════════════════════════ */
function openEnvelope() {
  const screen = document.getElementById('envelope-screen');
  const main   = document.getElementById('main-content');
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
  document.getElementById('cd-d').textContent = String(d).padStart(2,'0');
  document.getElementById('cd-h').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-m').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-s').textContent = String(s).padStart(2,'0');
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
let attending = true;
function pickAttend(el, val) {
  attending = val;
  document.querySelectorAll('.toggle-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('guest-row').style.display = val ? 'grid' : 'none';
}
function handleRSVP(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit span');
  btn.textContent = attending ? '¡Confirmado! 🌿' : 'Recibido, gracias';
  setTimeout(() => { btn.textContent = 'Confirmar asistencia'; }, 4000);
}

/* ══════════════════════════════
   AMBIENT MUSIC (Web Audio API)
   Generates a gentle pad / ambient
   tone without external files
══════════════════════════════ */
let audioCtx = null;
let musicNodes = [];
let musicPlaying = false;

function startAmbientMusic() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  playAmbient();
}

function playAmbient() {
  if (!audioCtx) return;
  musicNodes.forEach(n => { try { n.stop(); } catch(e){} });
  musicNodes = [];

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 3);
  masterGain.connect(audioCtx.destination);

  // Gentle reverb via convolver
  const convolver = audioCtx.createConvolver();
  const bufLen = audioCtx.sampleRate * 3;
  const irBuffer = audioCtx.createBuffer(2, bufLen, audioCtx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = irBuffer.getChannelData(ch);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 2.5);
    }
  }
  convolver.buffer = irBuffer;
  convolver.connect(masterGain);

  const dryGain = audioCtx.createGain();
  dryGain.gain.value = 0.4;
  dryGain.connect(masterGain);

  const wetGain = audioCtx.createGain();
  wetGain.gain.value = 0.6;
  wetGain.connect(convolver);

  // Soft pad notes (C major pentatonic)
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
  const times = [0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20];

  notes.forEach((freq, i) => {
    times.forEach((t, j) => {
      const start = t + (i * 0.3) + Math.random() * 0.5;
      const osc = audioCtx.createOscillator();
      const envGain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq * (Math.random() > 0.7 ? 0.5 : 1);
      osc.connect(envGain);
      envGain.connect(dryGain);
      envGain.connect(wetGain);

      envGain.gain.setValueAtTime(0, audioCtx.currentTime + start);
      envGain.gain.linearRampToValueAtTime(0.06 + Math.random()*0.04, audioCtx.currentTime + start + 1.5);
      envGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + start + 4 + Math.random()*2);

      osc.start(audioCtx.currentTime + start);
      osc.stop(audioCtx.currentTime + start + 7);
      musicNodes.push(osc);
    });
  });

  // Low drone
  const drone = audioCtx.createOscillator();
  const droneGain = audioCtx.createGain();
  drone.type = 'sine';
  drone.frequency.value = 65.41;
  droneGain.gain.value = 0.06;
  drone.connect(droneGain);
  droneGain.connect(masterGain);
  drone.start();
  musicNodes.push(drone);
  musicNodes.push(masterGain);

  musicPlaying = true;
  document.getElementById('music-toggle').textContent = '⏸';
  document.getElementById('music-bars').classList.add('playing');

  // Loop
  setTimeout(() => { if (musicPlaying) playAmbient(); }, 22000);
}

function stopAmbient() {
  musicNodes.forEach(n => {
    try {
      if (n.gain) {
        n.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
      } else {
        n.stop(audioCtx.currentTime + 1.5);
      }
    } catch(e){}
  });
  musicPlaying = false;
  document.getElementById('music-toggle').textContent = '▶';
  document.getElementById('music-bars').classList.remove('playing');
}

function toggleMusic() {
  if (!audioCtx) { startAmbientMusic(); return; }
  if (musicPlaying) stopAmbient();
  else playAmbient();
}

/* ══════════════════════════════
   FLOATING PETALS / BOTANICALS
   Canvas particle system
══════════════════════════════ */
(function initPetals() {
  const canvas = document.getElementById('petal-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, petals = [];

  const COLORS = ['#8A8467','#86895d','#54582f','#c9a84c','#F2EAC9','#a8ab7a'];

  function resize() {
    W = canvas.width  = window.innerWidth;
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
