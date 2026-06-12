/**
 * Main application logic
 */
const imageArea = document.querySelector('.image-placeholder');
const hexText = document.getElementById('hex-text');
const nameText = document.getElementById('color-name'); // Targets the name div
const copyBtn = document.getElementById('copy-btn');
const polaroid = document.querySelector('.polaroid');

async function applyRandomColor() {
    try {
        const response = await fetch('hexcolors.json'); // Fetches the color data
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const data = await response.json();
        const allColors = data.flatMap(book => book.colors); // Flattens color list
        const randomColor = allColors[Math.floor(Math.random() * allColors.length)];

        if (randomColor?.hex) {
            updateUI(randomColor.name, randomColor.hex); // Passes name and hex
        }
    } catch (err) {
        console.error("Color Load Error:", err);
        updateUI("Error", "#FF00FF"); 
    }
}

function updateUI(name, hex) {
    imageArea.style.backgroundColor = hex;
    document.body.style.setProperty('--dynamic-color', hex);
    hexText.innerText = hex;
    nameText.innerText = name || "Unnamed Color"; // Updates UI with name and hex
    updateFavicon(hex);
}

function updateFavicon(hex) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // Draw the circle
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, 2 * Math.PI);
    ctx.fillStyle = hex;
    ctx.fill();

    // Set the favicon
    const link = document.getElementById('favicon');
    link.href = canvas.toDataURL('image/png');
}

// 1. Copy to clipboard
if (copyBtn) {
    copyBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents triggering the randomizer
        navigator.clipboard.writeText(hexText.innerText).then(() => {
            const original = copyBtn.innerText;
            copyBtn.innerText = '✔';
            setTimeout(() => copyBtn.innerText = original, 1000);
        });
    });
}

// 2. Prevent clicks on the name text from triggering the randomizer
nameText.addEventListener('click', (event) => {
    event.stopPropagation(); // Allows selecting/highlighting text
});

// 3. Shuffle on click
polaroid.addEventListener('click', (event) => {
    if (event.target !== copyBtn) {
        applyRandomColor(); // Shuffles on click, unless button is clicked
    }
});

// Initial load
document.addEventListener('DOMContentLoaded', applyRandomColor);