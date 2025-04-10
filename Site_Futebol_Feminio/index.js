const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const container = document.querySelector('.carousel-container');
let currentIndex = 0;
let interval;

function showSlide(index) {
    container.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
    currentIndex = index;
}

function startAutoSlide() {
    interval = setInterval(() => {
        let nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }, 4000); // troca a cada 4 segundos
}

function stopAutoSlide() {
    clearInterval(interval);
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        stopAutoSlide();
        showSlide(index);
        startAutoSlide(); // reinicia o autoplay após clique
    });
});

// Iniciar com o primeiro slide
showSlide(0);
startAutoSlide();

