const music = document.getElementById("bgMusic");

document.addEventListener("click", () => {
  if (music.paused) music.play();
}, { once: true });

const sections      = document.querySelectorAll(".section");
const navLinks      = document.querySelectorAll(".nav-links a");
const sectionHeader = document.getElementById("sectionHeader");

const sectionNames = {
  home:     "Intro",
  about:    "Letter",
  reasons:  "Reasons",
  projects: "Memories",
  contact:  "Question"
};

// ─── GALLERY: use appendChild instead of innerHTML += ───────────────────────
// Avoids re-parsing the entire DOM on every iteration (43 images = 43 re-parses
// with innerHTML +=). appendChild touches the DOM just once per image.

const totalPhotos = 43;
const gallery     = document.getElementById("gallery");

for (let i = 1; i <= totalPhotos; i++) {
  const src = `photo/p${i}.jpg`;

  const box = document.createElement("div");
  box.className = "img-box";
  box.addEventListener("click", () => openLightbox(src));

  const img = document.createElement("img");
  img.src     = src;
  img.alt     = `Memory ${i}`;
  img.loading = "lazy";   // native lazy-load: only fetches when near viewport

  box.appendChild(img);
  gallery.appendChild(box);
}

// ─── INTERSECTION OBSERVER: replaces scroll listener ────────────────────────
// IntersectionObserver fires only when a section crosses the threshold,
// not hundreds of times per second like a scroll event. No offsetTop reads.

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const id = entry.target.getAttribute("id");

    // Update sticky header text
    sectionHeader.textContent = sectionNames[id] || "Intro";

    // Update nav active state
    navLinks.forEach(link => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isActive);
    });
  });
}, {
  threshold: 0.5   // section must be ≥50% visible to trigger
});

sections.forEach(section => observer.observe(section));

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────

const lightbox    = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add("active");

  // Lock body scroll so the page doesn't scroll behind the overlay
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightboxImg.src = "";          // free memory / cancel any in-flight load

  // Restore body scroll
  document.body.style.overflow = "";
}

// Clicking the IMAGE ITSELF should not close the lightbox —
// only clicking the dark backdrop should. stopPropagation prevents
// the click from bubbling up to the backdrop's onclick handler.
lightboxImg.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Close with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});