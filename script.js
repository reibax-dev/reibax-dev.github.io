"use strict";

/* ==========================================================================
   Disclaimer banner
   ========================================================================== */

const disclaimer = document.getElementById("disclaimer");
const disclaimerClose = document.getElementById("disclaimerClose");

disclaimerClose.addEventListener("click", () => {
  disclaimer.remove();
});

/* ==========================================================================
   Mobile navigation
   ========================================================================== */

const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu.addEventListener("click", (event) => {
  if (event.target.matches(".nav-link")) {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

/* ==========================================================================
   Header border on scroll
   ========================================================================== */

const siteHeader = document.getElementById("siteHeader");

window.addEventListener("scroll", () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 10);
});

/* ==========================================================================
   Active navigation link based on visible section
   ========================================================================== */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const setActiveLink = (sectionId) => {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

/* ==========================================================================
   Scroll reveal animations
   ========================================================================== */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => revealObserver.observe(element));

/* ==========================================================================
   Contact form (demo only, no backend)
   ========================================================================== */

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    formStatus.textContent = "Por favor completa todos los campos correctamente.";
    return;
  }

  // Placeholder behavior: replace with a real submission endpoint later.
  formStatus.textContent = "¡Gracias! Este formulario es de demostración y no envía datos.";
  contactForm.reset();
});

/* ==========================================================================
   Footer year
   ========================================================================== */

document.getElementById("currentYear").textContent = new Date().getFullYear();
