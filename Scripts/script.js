// This is Parallax and it is integral part of the game for immersion
// Inspiration and the source to include the parallax was a youtube channel Jack's Labarotory 

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;
let gameSpeed = 1;


const backgroundLayer1 = new Image();
backgroundLayer1.src = '/Assets/Layers/layer1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = '/Assets/Layers/layer2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = '/Assets/Layers/layer3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = '/Assets/Layers/layer4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = '/Assets/Layers/layer5.png';
const backgroundLayer6 = new Image();
backgroundLayer6.src = '/Assets/Layers/layer6.png';
const backgroundLayer7 = new Image();
backgroundLayer7.src = '/Assets/Layers/layer7.png';
const backgroundLayer8 = new Image();
backgroundLayer8.src = '/Assets/Layers/layer8.png';
const backgroundLayer9 = new Image();
backgroundLayer9.src = '/Assets/Layers/layer9.png';
const backgroundLayer10 = new Image();
backgroundLayer10.src = '/Assets/Layers/layer10.png';
const backgroundLayer11 = new Image();
backgroundLayer11.src = '/Assets/Layers/layer11.png';


class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update() {
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width) {
            this.x = 0;
        }
        this.x = this.x - this.speed;
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);

    }
}

const layer1 = new Layer(backgroundLayer1, 0.2);
const layer2 = new Layer(backgroundLayer2, 0.2);
const layer3 = new Layer(backgroundLayer3, 0.4);
const layer4 = new Layer(backgroundLayer4, 0.4);
const layer5 = new Layer(backgroundLayer5, 0.5);
const layer6 = new Layer(backgroundLayer6, 0.6);
const layer7 = new Layer(backgroundLayer7, 0.8);
const layer8 = new Layer(backgroundLayer8, 1.2);
const layer9 = new Layer(backgroundLayer9, 1);
const layer10 = new Layer(backgroundLayer10, 1.2);
const layer11 = new Layer(backgroundLayer11, 2);

const gameObject = [layer1, layer2, layer3, layer4, layer5, layer6,
    layer7, layer8, layer9, layer10, layer11];

