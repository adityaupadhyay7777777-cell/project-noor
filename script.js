const starContainer = document.getElementById("stars");
const totalStars = 450;

for (let i = 0; i < totalStars; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";

    const size = Math.random() * 2 + 0.6;
    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.animationDuration = (2 + Math.random() * 5) + "s";
    star.style.animationDelay = Math.random() * 5 + "s";
    star.style.opacity = Math.random() * 0.8 + 0.2;

    if (Math.random() > 0.85) {
        star.style.boxShadow = "0 0 5px rgba(255, 255, 255, 0.9)";
    }

    starContainer.appendChild(star);
}
const yesButton = document.getElementById("yes");
const noButton = document.getElementById("no");
const question = document.getElementById("question");
const container = document.getElementById("container");

// Single persistent audio instance
const music = new Audio("music.mp3");

// Function to spawn floating heart bubbles across the screen
function createHeartBubbles() {
    const hearts = ["💖", "💕", "❤️", "💗", "💓", "✨", "🌸"];
    const bContainer = document.body;

    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const heart = document.createElement("div");
            heart.classList.add("heart-bubble");
            heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 95 + "vw";

            const size = Math.random() * 22 + 18;
            heart.style.fontSize = `${size}px`;

            const duration = Math.random() * 3 + 3.5;
            heart.style.animationDuration = `${duration}s`;

            bContainer.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, duration * 1000);
        }, i * 120);
    }
}

// Play/restart music, create heart bubbles, and reset No button position on clicking Yes
yesButton.addEventListener("click", () => {
    // Restart music from beginning if already playing or stopped
    music.pause();
    music.currentTime = 0;
    music.play().catch(() => {});

    // Reset No button back to its original position next to Yes button
    if (noButton) {
        noButton.style.position = "";
        noButton.style.left = "";
        noButton.style.top = "";
    }

    // Trigger floating heart bubbles background animation
    createHeartBubbles();

    alert("Thank you for saying yes! 🥰💖 Feel The Music🎶 My Baby😘");
    if (question) question.style.display = "none";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    const date=document.createElement("div");
    date.innerText = "7 September";
    container.appendChild(date);
    const video = document.createElement("video");
    video.src = "video.mp4";
    video.autoplay = true;
    video.muted = false;
    container.appendChild(video);
    video.style.height = "500px";
});


// Evasive movement for No button so it cannot be clicked
function moveNoButton() {
    const padding = 20;
    const btnWidth = noButton.offsetWidth || 90;
    const btnHeight = noButton.offsetHeight || 36;

    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;

    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    noButton.style.position = "fixed";
    noButton.style.left = `${randomX}px`;
    noButton.style.top = `${randomY}px`;
}

if (noButton) {
    noButton.addEventListener("mouseover", moveNoButton);
    noButton.addEventListener("mouseenter", moveNoButton);
    noButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        moveNoButton();
    });
    noButton.addEventListener("click", (e) => {
        e.preventDefault();
        moveNoButton();
    });
}

