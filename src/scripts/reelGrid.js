import { renderReelGrid } from "./uiRenderer.js";

export const populateFeed = (container, reels) => {
    renderReelGrid(container, reels);
    requestAnimationFrame(() => {
        const cards = container.querySelectorAll(".reel-card");
        cards.forEach((card, index) => {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                scale: 1,
                delay: index * 0.03,
                duration: 0.35,
                ease: "back.out(1.4)",
                onStart() {
                    card.classList.add("is-visible");
                },
            });
        });
    });
};

export const captureFeedTexture = async (container) => {
    // Placeholder: convert the grid into a canvas snapshot to use as a sphere texture.
    const { width, height } = container.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1024, Math.floor(width));
    canvas.height = Math.max(1024, Math.floor(height));
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(12, 13, 30, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cards = Array.from(container.querySelectorAll(".reel-card"));
    cards.forEach((card, idx) => {
        const shade = 0.12 + (idx % 5) * 0.05;
        ctx.fillStyle = `rgba(255, 255, 255, ${shade})`;
        const cardWidth = canvas.width / 4 - 24;
        const cardHeight = cardWidth * (16 / 9);
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        const x = col * (cardWidth + 18) + 24;
        const y = row * (cardHeight + 36) + 24;

        const radius = 18;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + cardWidth - radius, y);
        ctx.quadraticCurveTo(x + cardWidth, y, x + cardWidth, y + radius);
        ctx.lineTo(x + cardWidth, y + cardHeight - radius);
        ctx.quadraticCurveTo(x + cardWidth, y + cardHeight, x + cardWidth - radius, y + cardHeight);
        ctx.lineTo(x + radius, y + cardHeight);
        ctx.quadraticCurveTo(x, y + cardHeight, x, y + cardHeight - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    });

    return canvas;
};
