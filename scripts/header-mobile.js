document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("header-hamburger");
  const mobileNav = document.getElementById("header-mobile-nav");
  const overlay = document.getElementById("header-mobile-overlay");

  function closeMenu() {
    hamburger.classList.remove("active");
    mobileNav.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  function openMenu() {
    hamburger.classList.add("active");
    mobileNav.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  if (hamburger && mobileNav && overlay) {
    hamburger.addEventListener("click", function () {
      if (hamburger.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    overlay.addEventListener("click", closeMenu);
    // Zatvori na klik linka
    mobileNav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
    // Escape tipka
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && hamburger.classList.contains("active")) {
        closeMenu();
      }
    });
  }
});
