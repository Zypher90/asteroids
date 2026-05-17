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

class Bullet {
    constructor ({position, velocity, orientation}) {
        this.position = position
        this.velocity = velocity
        this.orientation = orientation
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, 4, 0, Math.PI*2, false)
        c.closePath()
        c.fillStyle = 'white'
        c.fill()
    }

    update() {
        this.draw()

        if(this.position.x > window.innerWidth) {
            this.position.x = window.innerWidth;
        }else if(this.position.x < 0){
            this.position.x = 0
        }
        if(this.position.y > window.innerHeight){
            this.position.y = window.innerHeight
        }else if(this.position.y<0){
            this.position.y = 0
        }
 
        this.position.x += this.velocity * Math.sin(this.orientation + Math.PI*0.5)
        this.position.y += this.velocity * Math.cos(this.orientation - Math.PI*0.5)
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
    },
    space: {
        isPressed: false
    }
}

const VMAX = 2.25

const bullets = []

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    for (let bullet of bullets) {
        bullet.update();

        if(bullet.position.x < 0 || bullet.position.x > window.innerWidth || bullet.position.y < 0 || bullet.position.y > window.innerHeight){
            bullets.splice(bullets.indexOf(bullet), 1);      
        }
    }

    player1.update();

    player1.velocity*=0.99;
    if(keys.w.isPressed){
        player1.velocity<VMAX?player1.velocity+=player1.acceleration:player1.velocity=VMAX;
    }
    if(keys.d.isPressed) {
        player1.rotation += 0.015
    }
    if(keys.s.isPressed) {
        player1.velocity>-VMAX?player1.velocity-=player1.acceleration:player1.velocity=-VMAX;
    }
    if(keys.a.isPressed){
        player1.rotation -= 0.015
    }

    if(keys.space.isPressed) {
        keys.space.isPressed = false
        
        bullets.push(new Bullet({
            position: {
                x: player1.position.x,
                y: player1.position.y,
            },
            velocity: 6,
            orientation: player1.rotation
        }))
        
    }
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
        case "Space":
            keys.space.isPressed = true;
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
        case "Space":
            keys.space.isPressed = false;
            break;
    }
})