// Variables for the moving "No" button
let noButtonAttempts = 0;
const maxAttempts = 5;
let isExploded = false;

// DOM elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const buttonsContainer = document.querySelector('.buttons');
const body = document.body;

// Create fireworks canvas
const fireworksCanvas = document.createElement('canvas');
fireworksCanvas.id = 'fireworks';
document.body.appendChild(fireworksCanvas);
const ctx = fireworksCanvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Make "No" button move away when hovered
noBtn.addEventListener('mouseover', (e) => {
    if (isExploded) return;
    
    noButtonAttempts++;
    
    if (noButtonAttempts >= maxAttempts) {
        // Stop moving after max attempts
        noBtn.style.cursor = 'not-allowed';
        noBtn.style.opacity = '0.7';
        return;
    }
    
    // Calculate random position
    const containerRect = buttonsContainer.getBoundingClientRect();
    const buttonRect = noBtn.getBoundingClientRect();
    
    // Ensure button stays within container
    const maxX = containerRect.width - buttonRect.width;
    const maxY = containerRect.height - buttonRect.height;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    // Move the button
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.transition = 'all 0.3s ease';
});

// "No" button click - explode and show "Yes" button
noBtn.addEventListener('click', () => {
    if (isExploded) return;
    
    isExploded = true;
    
    // Create explosion effect
    createExplosion(noBtn);
    
    // Hide the "No" button
    noBtn.style.display = 'none';
    
    // Create new "Yes" button with different text
    const newYesBtn = document.createElement('button');
    newYesBtn.id = 'yesBtn2';
    newYesBtn.textContent = 'YES, I AM YOUR VALENTINE!';
    newYesBtn.style.cssText = `
        padding: 18px 50px;
        font-size: 1.3rem;
        border-radius: 50px;
        border: none;
        cursor: pointer;
        background: linear-gradient(135deg, #ff4d6d, #ff758f);
        color: white;
        box-shadow: 0 0 25px rgba(255, 77, 109, 0.9);
        transition: all 0.3s ease;
        margin-top: 20px;
        animation: heartbeat 1.5s ease-in-out infinite;
    `;
    
    // Add hover effect
    newYesBtn.addEventListener('mouseover', () => {
        newYesBtn.style.transform = 'scale(1.1)';
        newYesBtn.style.boxShadow = '0 0 40px rgba(255, 77, 109, 1)';
    });
    
    newYesBtn.addEventListener('mouseout', () => {
        newYesBtn.style.transform = 'scale(1)';
        newYesBtn.style.boxShadow = '0 0 25px rgba(255, 77, 109, 0.9)';
    });
    
    // Click event for new "Yes" button - show fireworks
    newYesBtn.addEventListener('click', () => {
        startFireworks();
        showLoveMessage();
    });
    
    // Replace the original button with new one
    yesBtn.style.display = 'none';
    buttonsContainer.appendChild(newYesBtn);
});

// Original "Yes" button click - show fireworks
yesBtn.addEventListener('click', () => {
    startFireworks();
    showLoveMessage();
});

// Function to create explosion effect
function createExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create explosion particles
    for (let i = 0; i < 50; i++) {
        createParticle(centerX, centerY);
    }
    
    // Add explosion sound effect (optional - you can uncomment if you want)
    // playExplosionSound();
}

// Function to create individual explosion particles
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: linear-gradient(45deg, #ff4d6d, #ffcc00);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${x}px;
        top: ${y}px;
    `;
    
    document.body.appendChild(particle);
    
    // Random velocity
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 3;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    // Random color
    const colors = ['#ff4d6d', '#ff758f', '#ffcc00', '#ff9900', '#ff3366'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Animate particle
    let opacity = 1;
    let size = 8;
    const animation = () => {
        x += vx;
        y += vy;
        opacity -= 0.02;
        size -= 0.1;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = opacity;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        if (opacity > 0 && size > 0) {
            requestAnimationFrame(animation);
        } else {
            particle.remove();
        }
    };
    
    requestAnimationFrame(animation);
}

// Fireworks system
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
        this.size *= 0.99;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

let particles = [];
let fireworksActive = false;

function startFireworks() {
    fireworksActive = true;
    particles = [];
    
    // Create initial burst
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(
            fireworksCanvas.width / 2,
            fireworksCanvas.height / 2
        ));
    }
    
    // Continue adding fireworks
    const fireworksInterval = setInterval(() => {
        if (!fireworksActive) {
            clearInterval(fireworksInterval);
            return;
        }
        
        // Create new firework from random position
        const x = Math.random() * fireworksCanvas.width;
        const y = fireworksCanvas.height;
        
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle(x, y));
        }
        
        // Stop after 10 seconds
        setTimeout(() => {
            fireworksActive = false;
        }, 10000);
        
    }, 800);
    
    animateFireworks();
}

function animateFireworks() {
    if (!fireworksActive && particles.length === 0) return;
    
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].alpha <= 0 || particles[i].size <= 0.5) {
            particles.splice(i, 1);
        }
    }
    
    // Add some sparkle effect
    if (fireworksActive) {
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(
                Math.random() * fireworksCanvas.width,
                Math.random() * fireworksCanvas.height
            ));
        }
    }
    
    requestAnimationFrame(animateFireworks);
}

// Function to show love message
function showLoveMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'love-message';
    messageDiv.innerHTML = `
        <h2>You've Made Me The Happiest! 💖</h2>
        <p>I love you more than words can say.<br>
        Happy Valentine's Day, my love!<br>
        Forever yours... ❤️</p>
    `;
    
    document.body.appendChild(messageDiv);
    messageDiv.style.display = 'block';
    
    // Add CSS for the message if not already present
    if (!document.querySelector('#message-styles')) {
        const style = document.createElement('style');
        style.id = 'message-styles';
        style.textContent = `
            .love-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.95);
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 0 50px rgba(255, 51, 102, 0.5);
                z-index: 1001;
                text-align: center;
                animation: popIn 0.5s ease;
                border: 3px solid #ff4d6d;
            }
            
            .love-message h2 {
                color: #ff3366;
                font-size: 2.2rem;
                margin-bottom: 20px;
                font-family: 'Playfair Display', serif;
            }
            
            .love-message p {
                color: #333;
                font-size: 1.3rem;
                font-family: 'Poppins', sans-serif;
                line-height: 1.6;
            }
            
            @keyframes popIn {
                from {
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove message after 8 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 500);
    }, 8000);
}

// Optional: Add explosion sound effect (uncomment if you want sound)
/*
function playExplosionSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}
*/

// Add CSS for heartbeat animation if not already present
if (!document.querySelector('#button-animations')) {
    const style = document.createElement('style');
    style.id = 'button-animations';
    style.textContent = `
        @keyframes heartbeat {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 0 20px rgba(255, 77, 109, 0.8);
            }
            50% {
                transform: scale(1.05);
                box-shadow: 0 0 30px rgba(255, 77, 109, 1);
            }
        }
    `;
    document.head.appendChild(style);
}