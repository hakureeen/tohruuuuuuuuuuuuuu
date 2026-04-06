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
    musicIcon.textContent  = "❚❚";
    musicLabel.textContent = "Now playing";
    musicBtn.classList.add("playing");
    floatPlayBtn.textContent = "❚❚";
    musicFloat.classList.add("playing");
  } else {
    music.pause();
    musicIcon.textContent  = "▶";
    musicLabel.textContent = "Play the vibe";
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

const sections      = document.querySelectorAll(".section");
const navLinks      = document.querySelectorAll(".nav-links a");
const sectionHeader = document.getElementById("sectionHeader");

const sectionNames = {
  home: "Intro", about: "Letter", reasons: "Reasons",
  projects: "Memories", contact: "Question"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const id = entry.target.getAttribute("id");
    sectionHeader.textContent = sectionNames[id] || "Intro";

    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });

    if (id === "home") {
      musicFloat.classList.remove("visible");
    } else {
      musicFloat.classList.add("visible");
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => observer.observe(section));

const totalPhotos = 43;
const gallery     = document.getElementById("gallery");

for (let i = 1; i <= totalPhotos; i++) {
  const src = `photo/p${i}.jpg`;
  const box = document.createElement("div");
  box.className = "img-box";
  box.addEventListener("click", () => openLightbox(src));

  const img = document.createElement("img");
  img.src = src; img.alt = `Memory ${i}`; img.loading = "lazy";

  box.appendChild(img);
  gallery.appendChild(box);
}

const lightbox    = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightboxImg.src = "";
  document.body.style.overflow = "";
}

lightboxImg.addEventListener("click", (e) => e.stopPropagation());
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });