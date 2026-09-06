// ==========================================
// 1. STAR BACKGROUND GENERATION
// ==========================================
const starContainer = document.getElementById("stars");
const totalStars = 50;

if (starContainer) {
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
}

// ==========================================
// 2. AUDIO & MUSIC CONTROLS
// ==========================================
// Single persistent audio instance for proposal yes music
const music = new Audio("music.mp3");

// Web Audio API Synthesizer for Page 1 & 2 Birthday Song
let audioCtx = null;
let bdayInterval = null;

const bdayNotes = [
    261.63, 261.63, 293.66, 261.63, 349.23, 329.63, // Happy birthday to you
    261.63, 261.63, 293.66, 261.63, 392.00, 349.23, // Happy birthday to you
    261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66, // Happy birthday dear Noor
    466.16, 466.16, 440.00, 349.23, 392.00, 349.23  // Happy birthday to you
];
const noteDurations = [
    0.4, 0.4, 0.8, 0.8, 0.8, 1.4,
    0.4, 0.4, 0.8, 0.8, 0.8, 1.4,
    0.4, 0.4, 0.8, 0.8, 0.8, 0.8, 1.4,
    0.4, 0.4, 0.8, 0.8, 0.8, 1.6
];

function playBdayTone(freq, duration) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration - 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.log("Audio not allowed yet:", e);
    }
}

let currentNoteIdx = 0;
function startBdayMusic() {
    if (bdayInterval) return;
    currentNoteIdx = 0;
    
    function playNextNote() {
        const freq = bdayNotes[currentNoteIdx];
        const dur = noteDurations[currentNoteIdx];
        playBdayTone(freq, dur);
        
        currentNoteIdx = (currentNoteIdx + 1) % bdayNotes.length;
        const delay = dur * 1000 + 50;
        bdayInterval = setTimeout(playNextNote, delay);
    }

    playNextNote();
}

function stopBdayMusic() {
    if (bdayInterval) {
        clearTimeout(bdayInterval);
        bdayInterval = null;
    }
}

// User interaction unlocks audio
document.addEventListener("click", () => {
    if (currentPage === 1 || currentPage === 2) {
        if (!bdayInterval) startBdayMusic();
    }
}, { once: true });

// ==========================================
// 3. PAGE SWITCHING SYSTEM
// ==========================================
let currentPage = 1;
const totalPages = 5;

function updatePageDisplay() {
    // Pause any playing videos when switching pages
    document.querySelectorAll("video").forEach(v => {
        try { v.pause(); } catch (e) {}
    });

    for (let i = 1; i <= totalPages; i++) {
        const p = document.getElementById(`page-${i}`);
        if (p) {
            p.classList.toggle("active", i === currentPage);
        }
    }

    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx + 1 === currentPage);
    });

    // Reset No button position on proposal page
    if (noButton) {
        noButton.style.position = "";
        noButton.style.left = "";
        noButton.style.top = "";
    }

    // Control birthday music: active on page 1 & 2
    if (currentPage === 1 || currentPage === 2) {
        startBdayMusic();
    } else {
        stopBdayMusic();
    }
    if (currentPage === 4) {
        music.play().catch(() => {});
    } else {
         music.pause();
    }
}

function goToPage(pageNum) {
    if (pageNum >= 1 && pageNum <= totalPages) {
        currentPage = pageNum;
        updatePageDisplay();
    }
}

function changePage(delta) {
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        updatePageDisplay();
    }
}

// ==========================================
// 4. CAKE CUTTING (PAGE 2)
// ==========================================
function blowCandles() {
    const flames = document.querySelectorAll(".candle-flame");
    flames.forEach(flame => flame.classList.add("blown"));

    const alertMsg = document.getElementById("cake-wish-alert");
    if (alertMsg) alertMsg.style.display = "block";

    createHeartBubbles();
}

// Floating heart bubbles animation

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

// ==========================================
// 5. PROPOSAL PAGE (PAGE 3 - EXACT PREVIOUS LOGIC)
// ==========================================
const yesButton = document.getElementById("yes");
const noButton = document.getElementById("no");
const question = document.getElementById("question");
const container = document.getElementById("container");

if (yesButton) {
    yesButton.addEventListener("click", () => {
        // Stop birthday music
        stopBdayMusic();

        // Restart music.mp3 from beginning if already playing or stopped
        music.pause();
        music.currentTime = 0;
        

        // Reset No button back to its original position next to Yes button
        if (noButton) {
            noButton.style.position = "";
            noButton.style.left = "";
            noButton.style.top = "";
        }

        alert("Thanks a lot baby for saying yes! 😘💖 Read a small letter from my heart & Feel The Music🎶");
        if (question) question.style.display = "none";
        if (container) {
            container.style.display = "flex";
            container.style.flexDirection = "column";

        }
        music.play().catch(() => {});
        changePage(1); // Move to the next page after clicking Yes
    });
}

function moveNoButton() {
    if (!noButton) return;
    const padding = 15;
    const btnWidth = noButton.offsetWidth || 85;
    const btnHeight = noButton.offsetHeight || 36;
    const topNavOffset = 80;

    const maxX = Math.max(padding, window.innerWidth - btnWidth - padding);
    const maxY = Math.max(topNavOffset + 10, window.innerHeight - btnHeight - padding);

    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(topNavOffset, Math.floor(Math.random() * maxY));

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

// ==========================================
// 6. VIDEO PLAYBACK CONTROL
// ==========================================
const allVideos = document.querySelectorAll("video");
allVideos.forEach(video => {
    video.addEventListener("play", () => {
        allVideos.forEach(v => {
            if (v !== video) {
                v.pause();
            }
        });
    });
});
