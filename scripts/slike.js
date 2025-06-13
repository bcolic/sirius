// Popis slika (koristi stvarna imena iz Pictures/Slike/)
const slike = [
  "Pictures/Slike/ACDC7257.jpg",
  "Pictures/Slike/ACDC7300.jpg",
  "Pictures/Slike/ACDC7335-2.jpg",
  // "Pictures/Slike/acdc7353.jpg",
  // "Pictures/Slike/ACDC7388-2.jpg",
  // "Pictures/Slike/ACDC7488-2.jpg",
  // "Pictures/Slike/ACDC7519.jpg",
  // "Pictures/Slike/ACDC7562-2.jpg",
  // "Pictures/Slike/ACDC7576-Edit-2.jpg",
  // "Pictures/Slike/ACDC7597.jpg",
  // "Pictures/Slike/ACDC7621.jpg",
  // "Pictures/Slike/ACDC7642.jpg",
  // "Pictures/Slike/ACDC7654-2.jpg",
  "Pictures/Slike/ACDC7696-Edit.jpg",
  "Pictures/Slike/ACDC7714.jpg",
  // "Pictures/Slike/ACDC7718.jpg",
  // "Pictures/Slike/ACDC7747-2.jpg",
  // "Pictures/Slike/ACDC7759.jpg",
  // "Pictures/Slike/ACDC7779.jpg",
  // "Pictures/Slike/ACDC7787.jpg",
  // "Pictures/Slike/ACDC7813-Edit.jpg",
  // "Pictures/Slike/ACDC7852.jpg",
  // "Pictures/Slike/ACDC7863-Edit.jpg",
  // "Pictures/Slike/ACDC7879.jpg",
  // "Pictures/Slike/ACDC7900-Edit-2.jpg",
  // "Pictures/Slike/ACDC7901.jpg",
  // "Pictures/Slike/ACDC7910.jpg",
  // "Pictures/Slike/ACDC7915.jpg",
  // "Pictures/Slike/ACDC7924.jpg",
  // "Pictures/Slike/ACDC7932-Edit-Edit.jpg",
  // "Pictures/Slike/ACDC7947-Edit.jpg",
  // "Pictures/Slike/ACDC7953.jpg",
  // "Pictures/Slike/ACDC7978.jpg",
  // "Pictures/Slike/ACDC7992.jpg",
  // "Pictures/Slike/ACDC8010.jpg",
  // "Pictures/Slike/ACDC8061.jpg",
  // "Pictures/Slike/ACDC8072.jpg",
  // "Pictures/Slike/ACDC8082-editbc.jpg",
  // "Pictures/Slike/ACDC8141-Edit.jpg",
  // "Pictures/Slike/ACDC8162.jpg",
];

let trenutniIndex = null;

function ucitajGaleriju() {
  const grid = document.getElementById("slike-grid");
  if (!grid) return;
  grid.innerHTML = "";
  slike.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Slika ${i + 1}`;
    img.className = "slike-thumb";
    img.tabIndex = 0;
    img.addEventListener("click", () => otvoriLightbox(i));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") otvoriLightbox(i);
    });
    grid.appendChild(img);
  });
}

function otvoriLightbox(index) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  if (!lightbox || !lightboxImg) return;
  trenutniIndex = index;
  lightboxImg.src = slike[trenutniIndex];
  lightbox.style.display = "flex";
  document.body.style.overflow = "hidden";
  azurirajStrelice();
}

function zatvoriLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  if (!lightbox || !lightboxImg) return;
  lightbox.style.display = "none";
  lightboxImg.src = "";
  document.body.style.overflow = "";
  trenutniIndex = null;
}

function promijeniSliku(delta) {
  if (trenutniIndex === null) return;
  let noviIndex = trenutniIndex + delta;
  if (noviIndex < 0) noviIndex = 0;
  if (noviIndex >= slike.length) noviIndex = slike.length - 1;
  if (noviIndex !== trenutniIndex) {
    otvoriLightbox(noviIndex);
  }
}

function azurirajStrelice() {
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  if (!prevBtn || !nextBtn) return;
  prevBtn.style.display = trenutniIndex > 0 ? "flex" : "none";
  nextBtn.style.display = trenutniIndex < slike.length - 1 ? "flex" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
  ucitajGaleriju();
  const closeBtn = document.getElementById("lightbox-close");
  const lightbox = document.getElementById("lightbox");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  if (closeBtn) closeBtn.addEventListener("click", zatvoriLightbox);
  if (prevBtn)
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      promijeniSliku(-1);
    });
  if (nextBtn)
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      promijeniSliku(1);
    });

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) zatvoriLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (lightbox.style.display === "flex") {
        if (e.key === "Escape" || e.key === "Esc") {
          zatvoriLightbox();
        } else if (e.key === "ArrowLeft") {
          promijeniSliku(-1);
        } else if (e.key === "ArrowRight") {
          promijeniSliku(1);
        }
      }
    });
  }
});
