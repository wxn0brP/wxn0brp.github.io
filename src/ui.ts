

const hamburger = document.querySelector<HTMLDivElement>(".hamburger");
const nav = document.querySelector<HTMLDivElement>("nav");

hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
    hamburger.classList.toggle("active");
});

const flyingObject = document.querySelector<HTMLDivElement>("#flying-object");
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

export function animate() {
    const hasMouse =
        window.matchMedia("(any-hover: hover)").matches &&
        window.matchMedia("(any-pointer: fine)").matches;

    flyingObject.style.display = hasMouse ? "" : "none";

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