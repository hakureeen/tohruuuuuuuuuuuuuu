const music         = document.getElementById("bgMusic");
const musicBtn      = document.getElementById("musicBtn");
const musicIcon     = document.getElementById("musicIcon");
const musicLabel    = document.getElementById("musicLabel");
const musicFloat    = document.getElementById("musicFloat");
const floatPlayBtn  = document.getElementById("floatPlayBtn");
const volumeSlider  = document.getElementById("volumeSlider");
const floatSlider   = document.getElementById("floatSlider");
const volIcon       = document.getElementById("volIcon");
const volPct        = document.getElementById("volPct");

music.volume = 0.7;

function toggleMusic() {
  if (music.paused) {
    music.play();
    musicIcon.textContent    = "❚❚";
    musicLabel.textContent   = "Now playing";
    musicBtn.classList.add("playing");
    floatPlayBtn.textContent = "❚❚";
    musicFloat.classList.add("playing");
  } else {
    music.pause();
    musicIcon.textContent    = "▶";
    musicLabel.textContent   = "Play the vibe";
    musicBtn.classList.remove("playing");
    floatPlayBtn.textContent = "♪";
    musicFloat.classList.remove("playing");
  }
}

function getVolIcon(v) {
  if (v === 0)  return "🔇";
  if (v < 0.4)  return "🔈";
  if (v < 0.75) return "🔉";
  return "🔊";
}

function updateSliderFill(slider, value) {
  const pct = value * 100;
  slider.style.background =
    `linear-gradient(to right, #d46a92 ${pct}%, #f3c6d6 ${pct}%)`;
}

function syncVolume(value) {
  const v = parseFloat(value);
  music.volume = v;
  volumeSlider.value = v;
  floatSlider.value  = v;
  updateSliderFill(volumeSlider, v);
  updateSliderFill(floatSlider, v);
  volIcon.textContent = getVolIcon(v);
  volPct.textContent  = `${Math.round(v * 100)}%`;
}

updateSliderFill(volumeSlider, 0.7);
updateSliderFill(floatSlider, 0.7);

volumeSlider.addEventListener("input", () => syncVolume(volumeSlider.value));
floatSlider.addEventListener("input",  () => syncVolume(floatSlider.value));

/* ═══════════════════════════════════════════
   SECTION OBSERVER
═══════════════════════════════════════════ */
/* ═══════════════════════════════════════════
   SECTION OBSERVER (FIXED TYPEWRITER TRIGGER)
═══════════════════════════════════════════ */

const sections      = document.querySelectorAll(".section");
const navLinks      = document.querySelectorAll(".nav-links a");
const sectionHeader = document.getElementById("sectionHeader");

const sectionNames = {
  home: "Intro",
  about: "Letter",
  reasons: "Reasons",
  projects: "Memories",
  contact: "Question"
};

let activeSectionId = null;

const observer = new IntersectionObserver((entries) => {
  let mostVisible = null;

  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    if (
      !mostVisible ||
      entry.intersectionRatio > mostVisible.intersectionRatio
    ) {
      mostVisible = entry;
    }
  });

  if (!mostVisible) return;

  const id = mostVisible.target.getAttribute("id");

  // prevent re-triggering same section
  if (activeSectionId === id) return;
  activeSectionId = id;

  // header update
  sectionHeader.textContent = sectionNames[id] || "Intro";

  // nav highlight
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });

  // floating music UI visibility
  if (id === "home") {
    musicFloat.classList.remove("visible");
  } else {
    musicFloat.classList.add("visible");
  }

  // ✅ TYPEWRITER ONLY WHEN SECTION BECOMES ACTIVE
  if (id === "about") {
    startTypewriter("letter1");
  }

  if (id === "reasons") {
    startTypewriter("letter2");
  }

}, {
  threshold: [0.6, 0.75, 0.85]
});

sections.forEach(section => observer.observe(section));

/* ═══════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════ */
const twState = {};

function startTypewriter(id) {
  if (twState[id]) return;
  twState[id] = true;

  const el = document.getElementById(id);
  if (!el) return;

  const text = el.getAttribute("data-text") || "";
  el.textContent = "";

  let i = 0;
  const speed = 28;

  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;

      // ✅ AUTO SCROLL INSIDE LETTER BOX
      el.scrollTop = el.scrollHeight;

      setTimeout(type, speed);
    } else {
      el.classList.add("done");
    }
  }

  type();
}

/* ═══════════════════════════════════════════
   GALLERY + LIGHTBOX
═══════════════════════════════════════════ */
const totalPhotos = 45;
const gallery     = document.getElementById("gallery");

// Shuffled photo order (Fisher-Yates)
const indices = Array.from({ length: totalPhotos }, (_, i) => i + 1);
for (let i = indices.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [indices[i], indices[j]] = [indices[j], indices[i]];
}

// Store sources for lightbox navigation
const photoSrcs = [];

for (const i of indices) {
  const src = `photo/p${i}.jpg`;
  photoSrcs.push(src);

  const box = document.createElement("div");
  box.className = "img-box";
  const idx = photoSrcs.length - 1;
  box.addEventListener("click", () => openLightbox(idx));

  const img = document.createElement("img");
  img.src = src; img.alt = `Memory ${i}`; img.loading = "lazy";

  box.appendChild(img);
  gallery.appendChild(box);
}

/* Lightbox */
const lightbox    = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lbCounter   = document.getElementById("lbCounter");
let   currentIdx  = 0;

function openLightbox(idx) {
  currentIdx = idx;
  lightboxImg.src = photoSrcs[currentIdx];
  lbCounter.textContent = `${currentIdx + 1} / ${photoSrcs.length}`;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightboxImg.src = "";
  document.body.style.overflow = "";
}

function navigateLightbox(dir) {
  currentIdx = (currentIdx + dir + photoSrcs.length) % photoSrcs.length;
  lightboxImg.style.opacity = "0";
  setTimeout(() => {
    lightboxImg.src = photoSrcs[currentIdx];
    lbCounter.textContent = `${currentIdx + 1} / ${photoSrcs.length}`;
    lightboxImg.style.opacity = "1";
  }, 150);
}

lightboxImg.addEventListener("click", (e) => e.stopPropagation());

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "Escape")      closeLightbox();
  if (e.key === "ArrowRight")  navigateLightbox(1);
  if (e.key === "ArrowLeft")   navigateLightbox(-1);
});

/* ═══════════════════════════════════════════
   FLOATING PETALS (Canvas)
═══════════════════════════════════════════ */
const canvas = document.getElementById("petalCanvas");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Petal color palettes — mixed colorful flowers
const petalColors = [
  "#f7a8c4", // soft pink
  "#f4c2d8", // light pink
  "#e8609a", // deep pink
  "#ff9eb5", // rose
  "#ffb347", // orange
  "#ffd700", // golden yellow
  "#ff6b6b", // coral red
  "#c8a2c8", // lilac
  "#b39ddb", // lavender
  "#80cbc4", // teal
  "#81c784", // sage green
  "#ff8a65", // peach
  "#f06292", // hot pink
  "#ba68c8", // violet
  "#4fc3f7", // sky blue
  "#aed581", // lime green
];

// Petal shapes: we draw simple ellipse petals with rotation
class Petal {
  constructor() {
    this.reset(true);
  }

  reset(initial) {
    this.x     = Math.random() * canvas.width;
    this.y     = initial ? Math.random() * canvas.height : -20;
    this.w     = 6 + Math.random() * 10;   // petal width
    this.h     = this.w * (1.6 + Math.random() * 0.8); // petal height
    this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    this.alpha = 0.55 + Math.random() * 0.4;
    this.angle = Math.random() * Math.PI * 2; // current draw rotation
    this.spin  = (Math.random() - 0.5) * 0.04; // rotation speed
    this.vx    = (Math.random() - 0.5) * 0.8;  // horizontal drift
    this.vy    = 0.6 + Math.random() * 1.2;     // fall speed
    this.sway  = Math.random() * Math.PI * 2;   // sway phase
    this.swaySpeed = 0.015 + Math.random() * 0.02;
    this.swayAmp   = 0.5 + Math.random() * 1.5;
  }

  update() {
    this.sway  += this.swaySpeed;
    this.x     += this.vx + Math.sin(this.sway) * this.swayAmp;
    this.y     += this.vy;
    this.angle += this.spin;

    if (this.y > canvas.height + 30) this.reset(false);
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.alpha;

    ctx.beginPath();
    ctx.ellipse(0, 0, this.w / 2, this.h / 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Slight highlight on petal
    ctx.beginPath();
    ctx.ellipse(-this.w * 0.1, -this.h * 0.15, this.w * 0.2, this.h * 0.25, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fill();

    ctx.restore();
  }
}

const PETAL_COUNT = 38;
const petals = Array.from({ length: PETAL_COUNT }, () => new Petal());

function animatePetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petals.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animatePetals);
}

animatePetals();