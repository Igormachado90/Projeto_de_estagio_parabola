const items = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.indicator');
const prev = document.querySelector('.carousel-control.prev');
const next = document.querySelector('.carousel-control.next');
const inner = document.querySelector('.carousel-inner');
let currentIndex = 0;

function showSlide(index) {
    inner.style.transform = `translateX(-${index * 100}%)`;
    indicators.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
}

prev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showSlide(currentIndex);
});

next.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    showSlide(currentIndex);
});

indicators.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        currentIndex = i;
        showSlide(currentIndex);
    });
});

// Slide automático opcional
setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length;
    showSlide(currentIndex);
}, 6000);
