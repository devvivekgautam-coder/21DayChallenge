const slides = document.getElementById("slides");
const totalSlides = slides.children.length;
let index = 0;

function showSlide() {
    slides.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    index = (index + 1) % totalSlides;
    showSlide();
}

function prevSlide() {
    index = (index - 1 + totalSlides) % totalSlides;
    showSlide();
}

// setInterval(nextSlide, 3000);