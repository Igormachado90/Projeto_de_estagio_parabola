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


document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const linksMenu = document.getElementById('links-menu');
    const navLinks = document.querySelectorAll('.nav-links > li');
    
    // Toggle menu principal
    menuToggle.addEventListener('click', function() {
        linksMenu.classList.toggle('active');
    });
    
    // Handle submenus on mobile
    navLinks.forEach(item => {
        if (item.querySelector('.submenu')) {
            const link = item.querySelector('a:first-child');
            
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    item.classList.toggle('menu-open');
                    
                    // Fecha outros submenus abertos
                    navLinks.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('menu-open')) {
                            otherItem.classList.remove('menu-open');
                        }
                    });
                }
            });
        }
    });
    
    // Fecha o menu ao clicar em um link (opcional)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992 && !this.parentElement.querySelector('.submenu')) {
                linksMenu.classList.remove('active');
            }
        });
    });
});