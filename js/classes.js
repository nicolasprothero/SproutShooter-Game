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
        c.imageSmoothingEnabled = false;
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
    constructor( {position, velocity, width, height, lives, movementSpeed, damage, fireRate, bulletSpeed, imageSrc, scale = 1, framesMax = 1, sprites}) {
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
        this.framesHold = 15
        this.sprites = sprites

        for(const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
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

    switchSprite(sprite) {
        switch (sprite) {
          case 'idleUp':
            if (this.image !== this.sprites.idleUp.image) {
              this.image = this.sprites.idleUp.image
              this.framesMax = this.sprites.idleUp.framesMax
              this.framesCurrent = 0
            }
            break

          case 'idleLeft':
            if (this.image !== this.sprites.idleLeft.image) {
              this.image = this.sprites.idleLeft.image
              this.framesMax = this.sprites.idleLeft.framesMax
              this.framesCurrent = 0
            }
            break

          case 'idleDown':
            if (this.image !== this.sprites.idleDown.image) {
              this.image = this.sprites.idleDown.image
              this.framesMax = this.sprites.idleDown.framesMax
              this.framesCurrent = 0
            }
            break
    
          case 'idleRight':
            if (this.image !== this.sprites.idleRight.image) {
              this.image = this.sprites.idleRight.image
              this.framesMax = this.sprites.idleRight.framesMax
              this.framesCurrent = 0
            }
            break

            case 'runRight':
            if (this.image !== this.sprites.runRight.image) {
              this.image = this.sprites.runRight.image
              this.framesMax = this.sprites.runRight.framesMax
              this.framesCurrent = 0
            }
            break

          case 'runLeft':
            if (this.image !== this.sprites.runLeft.image) {
              this.image = this.sprites.runLeft.image
              this.framesMax = this.sprites.runLeft.framesMax
              this.framesCurrent = 0
            }
            break
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
        this.velocity.x = Math.cos(angle) * 0.7
        this.velocity.y = Math.sin(angle) * 0.7
        this.position.x = this.position.x + this.velocity.x
        this.position.y = this.position.y + this.velocity.y
    }
}