/* ═══════════════════════════════════════
   HEAVEN SMP — script.js
═══════════════════════════════════════ */

/* ── CUSTOM CURSOR ── */
const cdot  = document.getElementById('cdot');
const cring = document.getElementById('cring');
let mx = -100, my = -100, rx = -100, ry = -100;

if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => { cdot.style.opacity = '0'; cring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cdot.style.opacity = '1'; cring.style.opacity = '1'; });

  // Hover expand on interactive elements
  document.querySelectorAll('a, button, .g-item, .feat-card, .step').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cdot.style.width  = '12px';
      cdot.style.height = '12px';
      cring.style.width  = '50px';
      cring.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cdot.style.width  = '';
      cdot.style.height = '';
      cring.style.width  = '';
      cring.style.height = '';
    });
  });

  (function tickCursor() {
    cdot.style.left = mx + 'px';
    cdot.style.top  = my + 'px';
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    cring.style.left = rx + 'px';
    cring.style.top  = ry + 'px';
    requestAnimationFrame(tickCursor);
  })();
}

/* ── PARTICLE STARS ── */
const cvs = document.getElementById('stars');
const ctx = cvs.getContext('2d');
let W, H;

function resize() { W = cvs.width = window.innerWidth; H = cvs.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

function mkStar() {
  return {
    x:     Math.random() * W,
    y:     Math.random() * H,
    r:     Math.random() * 1.3 + 0.2,
    vy:    -(Math.random() * 0.38 + 0.08),
    a:     Math.random() * 0.55 + 0.06,
    phase: Math.random() * Math.PI * 2,
    freq:  Math.random() * 0.018 + 0.005,
    warm:  Math.random() > 0.42,
  };
}
const stars = Array.from({ length: 140 }, mkStar);

(function drawStars() {
  ctx.clearRect(0, 0, W, H);
  for (const p of stars) {
    p.y += p.vy;
    p.phase += p.freq;
    if (p.y < -6) { p.y = H + 4; p.x = Math.random() * W; }
    const alpha = p.a * (0.62 + 0.38 * Math.sin(p.phase));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.warm
      ? `rgba(210,175,80,${alpha})`
      : `rgba(165,150,220,${alpha * 0.5})`;
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
})();

/* ── TYPED TEXT EFFECT ── */
const typedEl  = document.getElementById('typed');
const phrases  = [
  'Where legends are forged.',
  'Where empires rise.',
  'Where your story begins.',
  'Claim your throne.'
];
let pIdx = 0, cIdx = 0, deleting = false;

function type() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++cIdx);
    if (cIdx === phrase.length) {
      deleting = true;
      setTimeout(type, 2200);
      return;
    }
    setTimeout(type, 55);
  } else {
    typedEl.textContent = phrase.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      setTimeout(type, 300);
      return;
    }
    setTimeout(type, 28);
  }
}
setTimeout(type, 2000);

/* ── ANIMATED COUNTER (stats bar) ── */
function animateCounter(el, target, duration) {
  const start = performance.now();
  (function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target);
    if (t < 1) requestAnimationFrame(step);
  })(performance.now());
}

/* ── NAV SCROLL + ACTIVE SECTION ── */
const nav = document.getElementById('nav');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 60);

  // Active nav link
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });

/* ── HAMBURGER ── */
const hbgBtn = document.getElementById('hbg');
const mobEl  = document.getElementById('mob');

hbgBtn.addEventListener('click', () => {
  const open = hbgBtn.classList.toggle('open');
  mobEl.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
function closeMob() {
  hbgBtn.classList.remove('open');
  mobEl.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── COPY IP ── */
const IP = 'heavensmp.aternos.me';

function fbCopy(text, cb) {
  const el = Object.assign(document.createElement('textarea'), {
    value: text, style: 'position:fixed;opacity:0;pointer-events:none;top:0;left:0'
  });
  document.body.appendChild(el); el.select();
  try { document.execCommand('copy'); cb(); } catch(_) {}
  el.remove();
}

function triggerCopy(btn, lbl) {
  if (!btn || !lbl) return;
  const done = () => {
    lbl.textContent = '✓  Copied';
    btn.classList.add('copied');
    setTimeout(() => { lbl.textContent = 'Copy IP'; btn.classList.remove('copied'); }, 2400);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(IP).then(done).catch(() => fbCopy(IP, done));
  } else { fbCopy(IP, done); }
}

// Wire hero copy button
const cpBtn1 = document.getElementById('cpBtn');
const cpLbl1 = document.getElementById('cpLbl');
if (cpBtn1) cpBtn1.addEventListener('click', () => triggerCopy(cpBtn1, cpLbl1));

// Wire join section copy button
const cpBtn2 = document.querySelector('.btn-alt');
const cpLbl2 = document.getElementById('cpLbl2');
if (cpBtn2) cpBtn2.addEventListener('click', () => triggerCopy(cpBtn2, cpLbl2));

/* ── SCROLL REVEAL + STAGGER ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('vis');
    io.unobserve(e.target);
  });
}, { threshold: 0.08 });

// Stagger cards/rules/gallery
['.cards-grid .reveal', '.rules-grid .reveal', '.gallery-grid .reveal'].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.style.transitionDelay = (i * 0.1) + 's';
  });
});
document.querySelectorAll('.steps .reveal').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.12) + 's';
});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Trigger counter when stats bar enters view
const statsBar = document.querySelector('.stats-bar');
const statIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = document.getElementById('statPlayers');
    if (el) animateCounter(el, 47, 1800);
    statIO.unobserve(e.target);
  });
}, { threshold: 0.5 });
if (statsBar) statIO.observe(statsBar);

/* ── 3D CARD TILT ── */
document.querySelectorAll('.tilt-card').forEach(card => {
  const inner = card.querySelector('.tilt-inner');
  const shine = card.querySelector('.card-shine');

  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    inner.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 10}deg) translateZ(6px)`;
    if (shine) {
      const px = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const py = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      shine.style.setProperty('--mx', px + '%');
      shine.style.setProperty('--my', py + '%');
    }
  });
  card.addEventListener('mouseleave', () => {
    inner.style.transform = '';
  });
});

/* ── GALLERY LIGHTBOX ── */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbCap    = document.getElementById('lbCap');
const lbClose  = document.getElementById('lbClose');
const lbBack   = document.getElementById('lbBack');

document.querySelectorAll('.g-item').forEach(item => {
  item.addEventListener('click', () => {
    const imgEl = item.querySelector('.g-img');
    const cap   = item.dataset.caption || '';

    // Clone background style into lightbox
    lbImg.style.background = window.getComputedStyle(imgEl).background;
    lbCap.textContent = cap;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLB() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
lbClose.addEventListener('click', closeLB);
lbBack.addEventListener('click', closeLB);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

/* ── PARALLAX HERO BG ── */
window.addEventListener('scroll', () => {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }
}, { passive: true });

/* ── ACTIVE NAV LINK STYLE ── */
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--gold-lt); }
.nav-links a.active::after { transform: scaleX(1); }`;
document.head.appendChild(style);
