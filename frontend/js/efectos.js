// js/efectos.js
// ── Carrusel / Slider ────────────────────────────────────────────────────────
const slides = document.querySelectorAll('.sliddes');
let index = 0;

function showSlide(i) {
    slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        slide.style.display = 'none';
        if (idx === i) {
            slide.classList.add('active');
            slide.style.display = 'block';
        }
    });
}

function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
}

function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
}

// CORRECCIÓN: se usaba coma (,) en lugar de punto (.) antes de addEventListener
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (prevBtn) prevBtn.addEventListener('click', prevSlide);

if (slides.length > 0) {
    showSlide(index);
    setInterval(nextSlide, 5000);
}

// ── Animación de opiniones al hacer scroll ───────────────────────────────────
const opiniones = document.querySelectorAll('.opinion');

function revealOnScroll() {
    const windowHeight = window.innerHeight;
    opiniones.forEach(opinion => {
        const rect = opinion.getBoundingClientRect();
        if (rect.top < windowHeight - 80) {
            opinion.classList.add('visible');
        }
    });
}

if (opiniones.length > 0) {
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // ejecutar al cargar por si ya son visibles
}
