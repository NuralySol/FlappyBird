class Bird {
    constructor() {
        this.x = 150;
        this.y = 300;
        this.width = 34;  // Adjust based on your image's aspect ratio
        this.height = 24; // Adjust based on your image's aspect ratio      
        this.gravity = 0.6;
        this.lift = -15;
        this.velocity = 0;
        this.image = new Image();
        this.image.src = '/Assets/flying.gif';  
    }

    update() {
        this.velocity += this.gravity;
        this.velocity *= 0.9; // air resistance
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

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObject.forEach(object => {
        object.update();
        object.draw();
    });
    bird.update();
    bird.draw();
    requestAnimationFrame(animate);
}

animate();