function scroll() {
    const { hash } = window.location;
    if (!hash) return;
    const el = document.querySelector(hash);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.parentElement.classList.add("highlighted");
    setTimeout(() => el.parentElement.classList.remove("highlighted"), 2100);
}

window.addEventListener("hashchange", scroll);

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

setTimeout(scroll, 1000);

export { }