
let container = null;
let teeth = 10;
const radius = 10;
const height = 10;
const thickness = 1;
const angle = 45;

function setTeeth(value) {
    teeth = value;
    document.getElementById("teethValue").innerText = value;
    update();
}

function update() {
    if (container) {
        const size = `${radius * 3}vmin`;
        const step = 360 / teeth;
        const side = 2 * Math.PI * radius / (teeth * (Math.PI / 2));
        const displacement = radius * 1.5;

        container.style.width = size;
        container.style.height = size;
        container.style.transform = `rotate(${angle}deg)`;
        container.innerHTML = '';

        for (let i = 0; i < teeth; i++) {
            const tooth = document.createElement("div");
            tooth.className = "tooth";
            tooth.style.height = `${side}vmin`;
            tooth.style.width = `${side * 0.5}vmin`;
            tooth.style.transform = `rotateZ(${i * step}deg) translateX(${displacement}vmin)`;
            container.appendChild(tooth);
        }

        const cover = document.createElement("div");
        cover.className = "cover";
        container.appendChild(cover);
    }
}

function init() {
    container = document.getElementById("container");
    update();
}

init();
