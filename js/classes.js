class Sprite {
    constructor( {position, width, height, imageSrc, scale = 1, framesMax = 1 }){
        this.position = position
        this.width = width
        this.height = height
        this.image = new Image()
        this.image.src = imageSrc

        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
    }

    draw() {
        c.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.width/2,
            this.position.y - this.height/2,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
            this.framesCurrent++
            } else {
            this.framesCurrent = 0
            }
        }
    }
    
    update() {
    this.draw()
    this.animateFrames()
    }
}

class Background extends Sprite{
    constructor( {position, width, height, imageSrc, scale = 1, framesMax = 1 } ) {
        super( {position, width, height, imageSrc, scale, framesMax} )
        this.position = position
        this.width = width
        this.height = height
        this.image = new Image()
        this.image.src = imageSrc

        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5

    }

    draw() {
        c.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Player extends Sprite{
    constructor( {position, velocity, width, height, lives, movementSpeed, damage, fireRate, bulletSpeed, imageSrc, scale = 1, framesMax = 1 }) {
        super( { position, width, height, imageSrc, scale, framesMax } ) 

        this.width = width
        this.height = height
        this.velocity = velocity
        this.lives = lives

        this.movementSpeed = movementSpeed
        this.damage = damage
        this.fireRate = fireRate
        this.bulletSpeed = bulletSpeed
        this.bulletSize = 10 + (damage * 2)

        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 20
    }


    drawHitbox() {
        c.strokeStyle = 'red'
        c.strokeRect(
            this.position.x - this.width/2,
            this.position.y - this.height/2,
            this.width,
            this.height,
        )
    }

    update() {
        this.draw()
        //this.drawHitbox()
        this.animateFrames()
        //WALL COLLISION DETECTION

        //RIGHT & LEFT
        if(this.position.x + this.width/2 + this.velocity.x <= canvas.width && this.position.x - this.width/2 + this.velocity.x >= 0) {
            this.position.x += this.velocity.x
        } else {
            this.velocity.x = 0
        }
        //TOP & BOTTOM
        if(this.position.y + this.height/2 + this.velocity.y <= canvas.height && this.position.y - this.height/2 + this.velocity.y >= 0) {
            this.position.y += this.velocity.y
        } else {
            this.velocity.y = 0
        }
    }
}

class Projectile {
    constructor( {x, y, width, height, color, velocity }){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(
            this.x - this.width/2,
            this.y - this.height/2,
            this.width,
            this.height,
        )
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy extends Sprite{
    constructor( {position, width, height, color, velocity, hitPoints, imageSrc, scale = 1, framesMax = 1 } ){
        super( { position, width, height, imageSrc, scale, framesMax } ) 
        this.width = width
        this.height = height
        this.color = color
        this.velocity = velocity
        this.hitPoints = hitPoints

        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
    }

    drawHitbox() {
        c.strokeStyle = 'red'
        c.strokeRect(
            this.position.x - this.width/2,
            this.position.y - this.height/2,
            this.width,
            this.height,
        )
    }

    update() {
        this.draw()
        //this.drawHitbox()
        this.animateFrames()

        const angle = Math.atan2(player.position.y - this.position.y, player.position.x - this.position.x)
        this.velocity.x = Math.cos(angle)
        this.velocity.y = Math.sin(angle)
        this.position.x = this.position.x + this.velocity.x
        this.position.y = this.position.y + this.velocity.y
    }
}