document.addEventListener('DOMContentLoaded', function() {
    // Main theme 8 bit song
    let backgroundMusic = new Audio('/Assets/Audio/8bitMainTheme.mp3');
    backgroundMusic.loop = true;
    
    document.addEventListener('birdHitGround', () => {
        displayMessage('Fly faster, fool!');
    });

    // Function to fade out the music
    function fadeOutMusic() {
        let fadeInterval = setInterval(() => {
            // Reduce the volume by 0.1 every 300 ms
            if (backgroundMusic.volume > 0.1) {
                backgroundMusic.volume -= 0.1;
            } else {
                // When volume is very low, stop the interval and set volume to desired low level
                backgroundMusic.volume = 0.1; // Set to a lower but audible volume
                clearInterval(fadeInterval);
            }
        }, 300); // Adjust time here to manage how quickly the volume decreases
    }

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            if (!animationActive) return; // Prevent jumping if the game hasn't started
            bird.jump();
            flySound.play();
            setTimeout(() => {
                swooshSound.play();
            }, 250);
            event.preventDefault();
        }
    });

    // Start button event listener
    document.getElementById('startButton').addEventListener('click', function() {
        if (!animationActive) {
            backgroundMusic.play();
            resetGameAndRestart();
            this.style.opacity = '0';
            
            setTimeout(()=> {
                fadeOutMusic();
            },3000); // Main theme fade out after 3 seconds or 3000 milliseconds
            
        }
    });
});

// Independent message display so that it does not mess up canvas

function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.style.position = 'absolute';
    messageElement.style.top = '12%';
    messageElement.style.left = '50%'; // Centering horizontally
    messageElement.style.transform = 'translateX(-50%)'; // Only horizontally centering
    messageElement.style.color = 'white'; // Bright, readable color
    messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent black background
    messageElement.style.padding = '10px 20px'; // Padding for better text visibility
    messageElement.style.border = '2px solid yellow'; // Border color
    messageElement.style.borderRadius = '10px'; // Rounded corners
    messageElement.style.fontSize = '20px'; // Large font size for visibility
    messageElement.style.fontFamily = '"Lucida Console", Monaco, monospace'; // Monospaced font for a digital look
    messageElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)'; // Soft shadow for 3D effect
    messageElement.style.zIndex = '1000'; // Ensure it's on top of other elements
    messageElement.innerText = message;

document.body.appendChild(messageElement);

    // Optionally remove the message after a few seconds
    setTimeout(() => {
        document.body.removeChild(messageElement);
    }, 1500);
}

let animationActive = false;
let animationFrameId;

function resetGameAndRestart() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    // Reset the bird's properties
    bird.y = 300;
    bird.velocity = 0;
    bird.gravity = 0.5; // Reset to default if it changes in the game
    bird.lift = -34; // Reset to default if it changes in the game

    // Reset game speed if it's a global modifier that changes
    gameSpeed = 1; // Assuming you have a gameSpeed variable that might change

    // Clear and reset pipes, scores, etc.
    pipes = [];
    score = 0;
    lastPipeTime = Date.now();
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    animationActive = true;
    animationFrameId = requestAnimationFrame(animate);
}

// Game becomes harder if you hit the ground!
function resetTheBirdOnGroundCollision() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);  // Cancel any ongoing animation frame
    }

    // Reset bird's properties
    bird.y = 300;
    bird.velocity = 0;
    bird.gravity = 0.35;
    bird.lift = -44;

    // Reset other game state variables
    gameSpeed = 1*1.15;
    pipes = [];
    score = 0;
    lastPipeTime = Date.now();
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Log reset action
    console.log("Game reset because the bird hit the ground.");

    // Reinitialize the game
    animationActive = true;
    animationFrameId = requestAnimationFrame(animate);
}

class Bird {
    constructor() {
        this.x = 150;
        this.y = 300;
        this.width = 41;           // Each sprite's frame width
        this.height = 30;          // Each sprite's frame height
        this.gravity = 0.5;
        this.lift = -32;           // Lift of the bird
        this.velocity = 0;
        this.frameIndex = 0;       // Start at the first frame
        this.tickCount = 0;        // Counter to manage animation timing
        this.ticksPerFrame = 8;    // Ticks per frame for controlling speed
        this.numFrames = 8;        // Total frames in the sprite sheet
        this.image = new Image();
        this.image.src = '/Assets/Sprite/spritesheet.png';
    }

    update() {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            // Cycle through frames
            this.frameIndex = (this.frameIndex + 1) % this.numFrames;
        }
        this.applyPhysics();
    }

    applyPhysics() {
        this.velocity += this.gravity;
        this.velocity *= 0.7; // Simulating air resistance
        this.y += this.velocity;

        
        // Boundary checks 
        if (this.y > CANVAS_HEIGHT - this.height) {
            this.y = CANVAS_HEIGHT - this.height;
            this.velocity = 0;
            this.resetOnGroundCollision();
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }

    draw() {
        let frameX = this.width * this.frameIndex;
        ctx.drawImage(this.image, frameX, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    jump() {
        this.velocity += this.lift;
        this.frameIndex = 0;  // Reset to first animation in the spritesheet
    }
    resetOnGroundCollision = () => { // Arrow function to reset the game
        console.log("Bird has hit the bottom. Resetting game...");
        resetTheBirdOnGroundCollision();
        wilhelmscream(); 
         // Dispatch an event indicating that the bird has hit the ground
        const event = new Event('birdHitGround');
        document.dispatchEvent(event);
    
    }
}

// need to create a dead Bird class for different behavior
class DeadBird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 41;  // Adjust based on your spritesheet frame size
        this.height = 33;  // Adjust based on your spritesheet frame size
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 15;  // Adjust for desired animation speed
        this.numFrames = 8;  // Total frames in your ascending spritesheet
        this.image = new Image();
        this.image.src = '/Assets/Sprite/deadbirdsprite.png';  // Path to your ascending spritesheet
    }

    update() {
        this.y -= 2;  // Adjust the rate of ascent
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex++;
            if (this.frameIndex >= this.numFrames) {
                this.frameIndex = 0;  // Loop the animation or handle the end of ascent
            }
        }
    }

    draw(ctx) {
        let frameX = this.width * this.frameIndex;
        ctx.drawImage(this.image, frameX, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

// need to store the deadBird 
let deadBird = null;

// this bird exists at all times
const bird = new Bird();

const pipeNorth = new Image();
pipeNorth.src = '/Assets/pipeNorth.png';
const pipeSouth = new Image();
pipeSouth.src = '/Assets/pipeSouth.png';

//Get the sound for successful pass of the pipes
const passSound = new Audio('/Assets/Audio/sfx_point.wav');
const hitSound = new Audio('/Assets/Audio/sfx_hit.wav');
const flySound = new Audio('/Assets/Audio/sfx_wing.wav');
const swooshSound = new Audio('/Assets/Audio/sfx_swooshing.wav');
const dieSound = new Audio('/Assets/Audio/sfx_die.wav');
const wilhelmSound = new Audio('/Assets/Audio/wilhelmscream.mp3');

// Function to play the wilhelm scream when bird hits the ground
function wilhelmscream(){
    wilhelmSound.play();
}

// Function to play the point sound
function playSound() {
    passSound.play();
}

let score = 0;  // This is global for tracking scores + highScore which is static
let highScore = 0;
let deathRestart = "";

function popScoreAnimation() {
    const scoreButton = document.getElementById('scoreButton');
    scoreButton.style.transition = 'transform 0.3s, color 0.3s'; // Smooth transition for transformation and color
    scoreButton.style.transform = 'scale(1.5)'; // Enlarge the score display
    scoreButton.style.color = 'yellow'; // Change color to make it pop

    // Revert back after some time
    setTimeout(() => {
        scoreButton.style.transform = 'scale(1)';
        scoreButton.style.color = 'black'; // Assume black is the original color
    }, 220); // Time in milliseconds after which it reverts back
}

function updateScoreButton() {
    const scoreButton = document.getElementById('scoreButton');
    scoreButton.textContent = 'Score: ' + score / 2; //score has to be divided by 2 because bird passes two towers
}

function updateHighScoreButton () {
    const highScoreButton =  document.getElementById('highestButton'); //track the highest score function
    highScoreButton.textContent = 'Highest Score: ' + highScore / 2;
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
        this.x -= gameSpeed;
        if (!this.passed && this.x + this.width < bird.x) {
            this.passed = true;
            score++;
            if (score > highScore) {                   
                highScore = Math.floor(highScore + 1);  // Using Math.floor to ensure it's an integer
            }
            updateScoreButton();
            updateHighScoreButton();
            playSound();
            popScoreAnimation(); 
        }
    }

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
let gap = 170; // Gap between the top and bottom pipes
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
function displayDeathMessage() {
    const deathMessageButton = document.getElementById('youHaveDied');
    deathMessageButton.textContent = "Dead! Restarting";
    deathMessageButton.style.display = 'block';  // Make the button visible

    // Optionally, hide the button after some time and restart the game
    setTimeout(() => {
        deathMessageButton.style.display = 'none';  // Hide the button
        resetGameAndRestart();  // Call a function to reset the game state and restart the animation
    }, 1700); // Display message for 1700 milliseconds 
}

// You might ask why I need two functions for bird collission so that it does not mess up the spee
// Otherwise I found Out that if there is only one function for pipe collision it speeds up the game
// The below code just works 

function checkCollisionsWithBird() {
    pipes.forEach(pipe => {
        if (bird.collidesWith(pipe)) {
            console.log("Collision detected, game will reset.");
            resetGameAndRestart();
        }
    });
}

function checkCollisions() {
    for (let pipe of pipes) {
        if (pipe.collidesWith(bird)) {
            console.log("You Have Died. Restarting...")
            //Death Message
            displayDeathMessage();
            //Die sound is played after 600 milliseconds
            setTimeout(() => {
                dieSound.play();
            }, 600);
            //Hit the pipe play sound
            hitSound.play();
            deadBird = new DeadBird(bird.x, bird.y);
            animateDeadBird();
            // Reset bird's position and velocity
            bird.y = 300;
        
            // Need to update the score Button
            score = 0;
            updateScoreButton();

            // Clear existing pipes
            pipes = [];

            // Reset the last pipe time to now
            lastPipeTime = Date.now();

            return true;
        }
    }
    return false;
}
function animateDeadBird() {
    if (deadBird.y > -deadBird.height) {  // Continue while the bird is visible on the canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        deadBird.update();
        deadBird.draw(ctx);
        requestAnimationFrame(animateDeadBird);
    } else {
        // Optionally reset the game or end the animation when finished
        resetGameAndRestart();
    }
}

// Ensure the animate function and all other functions are defined correctly
function animate() {
    if (animationActive) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        gameObject.forEach(object => object.update());
        gameObject.forEach(object => object.draw());
        bird.update();
        bird.draw();
        managePipes();

        if (!checkCollisions()) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            animationActive = false; // Stop animation on collision
        }
    }
}

