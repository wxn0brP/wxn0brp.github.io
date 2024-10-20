document.querySelectorAll(`a[data-scroll]`).forEach(anchor => {
    anchor.addEventListener("click", e => {
        e.preventDefault();
        const targetId = anchor.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        const offset = 80; // Offset in pixels
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });
    });
});

const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector("nav");

hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
    hamburger.classList.toggle("active");
});