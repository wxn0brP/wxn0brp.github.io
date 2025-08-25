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

/** @type {HTMLDivElement} */
const hamburger = document.querySelector(".hamburger");
/** @type {HTMLDivElement} */
const nav = document.querySelector("nav");

hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
    hamburger.classList.toggle("active");
});

/** @type {HTMLDivElement} */
const flyingObject = document.querySelector("#flying-object");
let mouseX = 0;
let mouseY = 0;
let objectX = 0;
let objectY = 0;
const objectSize = 20;
const latency = 0.1;
const maxDeformation = 2;

document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function animate() {
    objectX += (mouseX - objectX) * latency;
    objectY += (mouseY - objectY) * latency;

    flyingObject.style.transform = `translate(${objectX - 15}px, ${objectY - objectSize * 2 + 5}px)`;

    const speedX = Math.abs(mouseX - objectX);
    const speedY = Math.abs(mouseY - objectY);
    const speed = Math.sqrt(speedX * speedX + speedY * speedY);

    let deformationX = 0;
    let deformationY = 0;

    if (speedX > speedY) {
        deformationX = Math.min(maxDeformation, speed / 2);
        deformationY = -Math.min(maxDeformation, speed / 4);
    } else {
        deformationY = Math.min(maxDeformation, speed / 2);
        deformationX = -Math.min(maxDeformation, speed / 4);
    }

    const newWidth = objectSize + deformationX;
    const newHeight = objectSize + deformationY;
    flyingObject.style.width = `${newWidth}px`;
    flyingObject.style.height = `${newHeight}px`;

    const newWidthRound = Math.round(newWidth * 10) / 10;
    const newHeightRound = Math.round(newHeight * 10) / 10;
    const isSameSize = newWidthRound === objectSize && newHeightRound === objectSize;
    flyingObject.className = !isSameSize ? "fo-bg" : "";

    requestAnimationFrame(animate);
}

animate();

fetch("https://api.github.com/users/wxn0brP/repos?per_page=100").then(res => res.json()).then(repos => {
    /**
     * @param {string} qs querySelector
     * @param {string} prefix
     * @param {string} [npm]
     */
    function render(qs, prefix, npm) {
        /** @type {HTMLUListElement} */
        let list = document.querySelector(qs);
        list.innerHTML = "";
        const filtered = repos.filter(r => r.name.startsWith(prefix + "-"))
        if (npm) {
            filtered.push({
                name: "NPM package",
                html_url: `https://www.npmjs.com/package/${npm}`
            })
        }
        filtered.sort((a, b) => a.name.localeCompare(b.name))
            .forEach(r => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="${r.html_url}" target="_blank">${r.name}</a>`;
                if (r.description) {
                    const desc = r.description;
                    li.innerHTML += " - ";
                    li.innerHTML += desc.startsWith(prefix) ? desc.replace(prefix, "") : desc;
                }
                list.appendChild(li);
            });
    }

    render("#valtheradb-links", "ValtheraDB", "@wxn0brp/db");
    render("#vql-links", "VQL", "@wxn0brp/vql");
})