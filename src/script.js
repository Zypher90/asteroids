const canvasContainer = document.querySelector('.canvas-container')
const startButton = document.querySelector('.start-button')
const initOverlay = document.querySelector('.initial-overlay')
const playerNameInput = document.querySelector('#player-name')
const scoreBoard = document.querySelector('.score-board')

let playerName = ""
let playerScore = 0

const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Game state initialization
startButton.addEventListener('click', () => {     
    playerName = playerNameInput.value.trim() === "" ? "Player1" : playerNameInput.value.trim()
    scoreBoard.textContent = `${playerName} : ${playerScore}`
    
    canvasContainer.style.display = 'block'
    initOverlay.style.display = 'none'

    //Spawning asteroids
    window.setInterval(() => { 
        console.log("Firing");
        
        const dir = Math.floor(Math.random()*4)    
        let X, Y, heading, vx, vy
        let velocity = 0
        heading = (-30+Math.floor(Math.random()*60))

        switch(dir) {
            case 0:  //Left
                X=-50,
                Y=Math.random()*window.innerHeight
                vx=0.3+Math.abs(Math.cos(heading))
                vy=Math.sin(heading)
                break;
            case 1:  //Bottom
                X=Math.random()*window.innerWidth
                Y=window.innerHeight + 50;
                vx=Math.sin(heading)
                vy=-0.3-Math.abs(Math.cos(heading))
                break;
            case 2:  //Right
                X=window.innerWidth+50;
                Y=Math.random()*window.innerHeight
                vx=-0.3-Math.abs(Math.cos(heading))
                vy=Math.sin(heading)
                break;
            case 3:  //Top
                X=Math.random()*window.innerWidth
                Y=-50
                vx=Math.sin(heading)
                vy=0.3+Math.abs(Math.cos(heading))
                break;
        }    
        

        asteroids.push(new Asteroid({
            position: {x: X, y: Y},
            velocity: {x: vx, y: vy},
            color: fillStyles[Math.floor(Math.random()*6)]
        }))
        
    }, 2500)
})

const c = canvas.getContext('2d')

c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.height)

//Player object
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

        this.position.x += this.velocity * Math.sin(this.rotation + Math.PI * 0.5);
        this.position.y += this.velocity * Math.cos(this.rotation - Math.PI * 0.5);
    }
}


//Bullet class
class Bullet {
    constructor ({position, velocity, orientation}) {
        this.position = position
        this.velocity = velocity
        this.orientation = orientation
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x + 15*Math.sin(this.orientation + Math.PI*0.5), this.position.y + 15*Math.cos(this.orientation - Math.PI*0.5), 4, 0, Math.PI*2, false)
        c.closePath()
        c.fillStyle = 'white'
        c.fill()
    }

    update() {
        this.draw()

        this.position.x += this.velocity * Math.sin(this.orientation + Math.PI*0.5)
        this.position.y += this.velocity * Math.cos(this.orientation - Math.PI*0.5)
    }
}


//Asteroid class
class Asteroid {
    constructor ({
        position,
        velocity,
        heading,
        color
    }) {
        this.position = position
        this.color = color
        this.velocity = velocity
        this.radius = 20 + Math.random() * 20
    }

    
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false)
        c.closePath()
        c.strokeStyle = this.color
        c.stroke()
    }
    
    update() {
        this.draw()
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
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


//Key enum
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

//Declarations
const VMAX = 2.25
const bullets = []
fillStyles = ['white', 'green', 'blue', 'orange', 'cyan', 'pink']
const asteroids = []
let shoot = true;


//Main game loop
function animate() {
    //Initialize animating canvas
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    //Checking bullet bounds and collision
    for (let bullet of bullets) {
        bullet.update();

        if(bullet.position.x < 0 || bullet.position.x > window.innerWidth || bullet.position.y < 0 || bullet.position.y > window.innerHeight){
            bullets.splice(bullets.indexOf(bullet), 1);      
        }
    }

    //Checking asteroid bounds and collision
    for (let asteroid of asteroids) {
        asteroid.update();

        if(asteroid.position.x < -100 || asteroid.position.x > window.innerWidth+100 || asteroid.position.y < -100 || asteroid.position.y > window.innerHeight+100){
            asteroids.splice(asteroids.indexOf(asteroid), 1);      
        }
    }

    player1.update();

    //Player movement edge cases
    player1.velocity*=0.98;
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

    //Shooting bullets
    if(keys.space.isPressed && shoot) {
        keys.space.isPressed = false
        
        bullets.push(new Bullet({
            position: {
                x: player1.position.x,
                y: player1.position.y,
            },
            velocity: 6,
            orientation: player1.rotation
        }))
        shoot = false
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
            shoot = true
            break;
    }
})