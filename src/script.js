const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.height)

class Player {
    constructor({position, velocity, color, friction, acceleration}) {
        this.position = position
        this.velocity = velocity
        this.color = color
        this.friction = friction
        this.acceleration = acceleration
        this.rotation = Math.PI * -0.5
    }

    draw() {
        c.save()

        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)

        c.beginPath();
        c.moveTo(this.position.x + 15, this.position.y);
        c.lineTo(this.position.x - 15, this.position.y - 10);
        c.lineTo(this.position.x - 15, this.position.y + 10);
        c.closePath();

        c.strokeStyle = this.color;
        c.stroke();

        c.restore();
    }

    update() {
        this.draw()

        this.position.x += this.velocity * Math.sin(this.rotation + Math.PI * 0.5);
        this.position.y += this.velocity * Math.cos(this.rotation - Math.PI * 0.5);
    }
}

const player1 = new Player(
    {
        position: {x: canvas.width/2, y: canvas.height/2},
        velocity: 0,
        color: 'orange',
        friction: 0.01,
        acceleration: 0.045
    },
);



player1.draw();

const keys = {
    w: {
        isPressed: false
    },
    a: {
        isPressed: false
    },
    d: {
        isPressed: false
    },
    s: {
        isPressed: false
    }
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player1.update();

    if(player1.velocity > 0){
        player1.velocity -= player1.friction
    }
    if(keys.w.isPressed){
        player1.velocity<1.75?player1.velocity+=player1.acceleration:player1.velocity=1.75;
    }
    if(keys.d.isPressed) {
        player1.rotation += 0.015
    }
    if(keys.s.isPressed) {
        player1.velocity>-1.75?player1.velocity-=player1.acceleration:player1.velocity=-1.75;
    }
    if(keys.a.isPressed){
        player1.rotation -= 0.015
    }
    // keys.s.isPressed?player1.velocity.y=1:player1.velocity.y=0;
}

animate()

window.addEventListener('keydown', (e) => {
    switch(e.code){
        case "KeyW": 
            keys.w.isPressed = true;
            break;
        case "KeyA": 
            keys.a.isPressed = true;
            break;
        case "KeyD": 
            keys.d.isPressed = true;
            break;
        case "KeyS": 
            keys.s.isPressed = true;
            break;
    }
})

window.addEventListener('keyup', (e) => {
    switch(e.code) {
        case 'KeyW': 
            keys.w.isPressed = false;           
            break;
        case "KeyA": 
            keys.a.isPressed = false;
            break;
        case "KeyD": 
            keys.d.isPressed = false;
            break;
        case "KeyS": 
            keys.s.isPressed = false;
            break;
    }
})