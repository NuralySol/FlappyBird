class Bird {
    constructor() {
        this.x = 150;
        this.y = 300;
        this.width = 34;  // Adjust based on your image's aspect ratio
        this.height = 24; // Adjust based on your image's aspect ratio      
        this.gravity = 0.5; 
        this.lift = -28;
        this.velocity = 0;
        this.image = new Image();
        this.image.src = '/Assets/A1.png';  
    }

    update() {
        this.velocity += this.gravity;
        this.velocity *= 0.7; // air resistance
        this.y += this.velocity;

        if (this.y > CANVAS_HEIGHT - this.height) {
            this.y = CANVAS_HEIGHT - this.height;
            this.velocity = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    jump() {
        this.velocity += this.lift;
    }
}

const bird = new Bird();

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        bird.jump();
    }
});

const pipeNorth = new Image();
pipeNorth.src = '/Assets/pipeNorth.png';
const pipeSouth = new Image();
pipeSouth.src = '/Assets/pipeSouth.png';

//Get the sound for successful pass of the pipes
const passSound = new Audio('/Assets/Audio/point.mp3');
const dieSound = new Audio('/Assets/Audio/die.mp3');

//Give the function to play the point sound
function playSound(){
    passSound.play();
}

let score = 0;  // This is global 

function updateScoreButton() {
    const scoreButton = document.getElementById('scoreButton');
    scoreButton.textContent = 'Score: ' + score/2;
}

class Pipe {
    constructor(image, x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    update() {
        this.x -= gameSpeed; if (!this.passed && this.x + this.width < bird.x) {
            this.passed = true;
            score++;
            updateScoreButton();
            playSound();
    }}

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    collidesWith(bird) {
        if (bird.x < this.x + this.width &&
            bird.x + bird.width > this.x &&
            bird.y < this.y + this.height &&
            bird.y + bird.height > this.y) {
            return true;
        }
        return false;
    }
}

let pipes = [];
let pipeWidth = 52; // Adjust based on your image's aspect ratio
let pipeHeight = 160; // Adjust based on your image's aspect ratio
let gap = 160; // Gap between the top and bottom pipes
let pipeInterval = 2700; // Interval in milliseconds to push new pipes
let lastPipeTime = 0;

function managePipes() {
    let timeSinceLastPipe = Date.now() - lastPipeTime;
    if (timeSinceLastPipe > pipeInterval) {
        let pipePosition = Math.floor(Math.random() * (CANVAS_HEIGHT - pipeHeight - gap - 20)) + 10; // Random y position for top pipe
        pipes.push(new Pipe(pipeNorth, CANVAS_WIDTH, 0, pipeWidth, pipePosition));
        pipes.push(new Pipe(pipeSouth, CANVAS_WIDTH, pipePosition + gap, pipeWidth, CANVAS_HEIGHT - pipePosition - gap));
        lastPipeTime = Date.now();
    }

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
    pipes.forEach(pipe => {
        pipe.update();
        pipe.draw();
    });
}

function checkCollisions() {
    for (let pipe of pipes) {
        if (pipe.collidesWith(bird)) {
            console.log("Collision Detected! Restarting game...");
            
            dieSound.play();
            
            // Reset bird's position and velocity
            bird.y = 300;
            bird.velocity = 0;

            // Need to update the score Button
            score = 0;
            updateScoreButton();

            // Clear existing pipes
            pipes = [];

            // Reset the last pipe time to now
            lastPipeTime = Date.now();

            // Restart the animation
            requestAnimationFrame(animate);
            return true;
        }
    }
    return false;
}

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObject.forEach(object => {
        object.update();
        object.draw();
    });
    bird.update();
    bird.draw();
    managePipes();
    if (!checkCollisions()) {
        requestAnimationFrame(animate);
    }
}

animate();