/* ====================================================================
  File: slider.js
  Description: Index page slider engine
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-11-26
  Updated: NA

  Purpose:
    - Used to activate and switch images in the main slider.
    - Renders images manually or every six seconds.
===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll("#hero-slider .slide");
  const nextBtn = document.querySelector(".slider-btn.next");
  const prevBtn = document.querySelector(".slider-btn.prev");

  let index = 0;

  function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
  }

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    showSlide(index);
  });

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  });

  // Auto-slide every 6 seconds
  setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 6000);
});
