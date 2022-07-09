const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const scoreText = document.querySelector('#scoreText')
const statText = document.querySelector('#statText')
const waveText = document.querySelector('#waveText')
const heartHUD = document.querySelector('#heartHUD')
const titleText = document.querySelector('#titleText')

const scoreEl = document.querySelector('#scoreEl')
const enemiesStatEl = document.querySelector('#enemiesStatEl')
const moveStatEl = document.querySelector('#moveStatEl')
const damageStatEl = document.querySelector('#damageStatEl')
const fireStatEl = document.querySelector('#fireStatEl')
const bulletStatEl = document.querySelector('#bulletStatEl')
const enemyHealthEl = document.querySelector('#enemyHealthEl')

const gameOverPopup = document.querySelector('#gameOverPopup')
const gameOverScore = document.querySelector('#gameOverScore')
const enemiesSlainScore = document.querySelector('#enemiesSlainScore')

const buttonEl = document.querySelector('#buttonEl')
const copybuttonEl = document.querySelector('#copybuttonEl')
const startButtonEl = document.querySelector('#startButtonEl')
const startGamePopup = document.querySelector('#startGamePopup')

const classRifleButtonEl = document.querySelector('#classRifleButtonEl')
const classSniperButtonEl = document.querySelector('#classSniperButtonEl')

canvas.width = 800
canvas.height = 600

let titleHeight = 110

//STYLES THE STATS AND HEARTS TO THE CORRECT LOCATION
//titleText.style.width = canvas.width + 'px'

heartHUD.style.left = (innerWidth - canvas.width)/2 + 'px'

startGamePopup.style.left = (innerWidth - canvas.width)/2 + 'px'
startGamePopup.style.top = titleHeight + 'px'
startGamePopup.style.width = canvas.width + 'px'
startGamePopup.style.height = canvas.height + 'px'

gameOverPopup.style.left = (innerWidth - canvas.width)/2 + 'px'
gameOverPopup.style.top = titleHeight + 'px'
gameOverPopup.style.width = canvas.width + 'px'
gameOverPopup.style.height = canvas.height + 'px'

const x = canvas.width/2
const y = canvas.height/2

let projectiles = []
let enemies = []

let animationID 
let intervalID

let game = {
    active: false
}

let score = 0
let waveNum = 1

let enemiesSlain = 0
let enemiesSpawned = 0

let lastKey

let scoreShowing = false
let canShoot = true
let isInvincible = false

let facing = 'right'
let isMoving = false
let isShooting = false

player = new Player( {
    position: {x:x, y:y}, 
    velocity: {x:0, y:0},
    width: 50,
    height: 75,
    lives: 3, 
    movementSpeed: 1.8, 
    damage: 1, 
    fireRate: 3, 
    bulletSpeed: 5, 
    imageSrc: './img/playerSprites/PlayerIdle_Right.png', 
    scale: 0.4, 
    framesMax: 2,
    sprites: {
        idle: {
            imageSrc: './img/playerSprites/PlayerIdle.png', 
            framesMax: 5,
        },

        run: {
            imageSrc: './img/playerSprites/PlayerRun.png', 
            framesMax: 6,
        }
    }
})

const background = new Background({ 
    position:{x:0, y:0}, 
    width: 800,
    height: 600,
    imageSrc: './img/backgrounds/background_grass.png',
    scale: 0.667,
})


//INITILIZES THE GAME
function init() {
        player = new Player( {
            position: {x:x, y:y}, 
            velocity: {x:0, y:0},
            width: 49,
            height: 62,
            lives: 3, 
            movementSpeed: 1.4, 
            damage: 1, 
            fireRate: 3, 
            bulletSpeed: 4, 
            imageSrc: './img/playerSprites/PlayerIdle_Right.png', 
            scale: 3.5, 
            framesMax: 5,
            sprites: {
                idleUp: {
                    imageSrc: './img/playerSprites/PlayerIdle_Up.png', 
                    framesMax: 5,
                },

                idleLeft: {
                    imageSrc: './img/playerSprites/PlayerIdle_Left.png', 
                    framesMax: 5,
                },

                idleDown: {
                    imageSrc: './img/playerSprites/PlayerIdle_Down.png', 
                    framesMax: 5,
                },

                idleRight: {
                    imageSrc: './img/playerSprites/PlayerIdle_Right.png', 
                    framesMax: 5,
                },

                runRight: {
                    imageSrc: './img/playerSprites/PlayerRun_Right.png', 
                    framesMax: 6,
                },

                runLeft: {
                    imageSrc: './img/playerSprites/PlayerRun_Left.png', 
                    framesMax: 6,
                },
            }
        })

    projectiles = []
    enemies = []
    animationID 

    score = 0
    copybuttonEl.innerHTML = 'SHARE'
    enemiesSlain = 0

    waveNum = 1
    enemiesSpawned = 0

    game = {
        active: true
    }

    document.getElementById('heart1').src="./img/heartFilled.png"
    document.getElementById('heart2').src="./img/heartFilled.png"
    document.getElementById('heart3').src="./img/heartFilled.png"


    scoreEl.innerHTML = 0
    enemiesStatEl.innerHTML = 0
    enemyHealthEl.innerHTML = 5
    waveText.style.display = 'block'
    scoreText.style.display = 'block'
    heartHUD.style.display = 'block'
    
    moveStatEl.innerHTML = player.movementSpeed
    damageStatEl.innerHTML = player.damage
    fireStatEl.innerHTML = player.fireRate
    bulletStatEl.innerHTML = player.bulletSpeed
}

//CONTROLS RANDOM ENEMY SPAWNING
function spawnEnemies() {
    intervalID = setInterval(() => {
        const enemySizeBuffer = 40
        enemiesSpawned += 1

        //SPAWN ENEMIES FROM THE SIDES, TOP, AND BOTTOM
        let x
        let y

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - enemySizeBuffer : canvas.width + enemySizeBuffer
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - enemySizeBuffer : canvas.height + enemySizeBuffer
        }

        const color = '#fe5c6f'

        const angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x)
        const velocity = { x:Math.cos(angle), y:Math.sin(angle)}


        //INCREASE HITPOINTS AT CERTAIN SCORE 
        let hitPoints = 5
        if(waveNum === 2) {
            hitPoints = 7
            enemyHealthEl.innerHTML = '7'
        }
        if(waveNum === 3){
            hitPoints = 10
            enemyHealthEl.innerHTML = '10'
        }
        if(waveNum === 4){
            hitPoints = 10
            enemyHealthEl.innerHTML = '10'
        }
        if(waveNum === 5){
            hitPoints = 10
            enemyHealthEl.innerHTML = '10'
        }
        enemies.push(new Enemy( {
            position: {x:x, y:y},
            width: 56, 
            height: 60,
            color: color, 
            velocity: velocity, 
            hitPoints: hitPoints,
            imageSrc: './img/Enemy_Slime.png',
            scale: 4,
            framesMax: 9
        }))
    }, 3000) //TIME BETWEEN ENEMY SPAWNS
}

//SHOOTING WITH TOUCH/MOUSE
function shoot({x, y}) {
    if(game.active){
        //ANGLE OF SHOOTING
        const angle = Math.atan2(y - player.position.y, x - player.position.x)
        const velocity = { x:Math.cos(angle) * player.bulletSpeed, y:Math.sin(angle) * player.bulletSpeed}

        //WHERE PROJECTILES ARE SPAWNED FROM
        if(canShoot) {
            canShoot = false
            projectiles.push(new Projectile({
                x: player.position.x, 
                y: player.position.y, 
                width: player.bulletSize, 
                height: player.bulletSize, 
                color: '#e8df$df', 
                velocity: velocity
            }))
            audio.shoot.play()
            setTimeout(() => {  canShoot = true }, 1000 / player.fireRate);
        }
    }
}

//FUNCTION TO SHOOT LINEARLY WITH KEYBOARD INPUTS
function shootLinear( direction ) {
    if(game.active) {
        if(canShoot) {
            canShoot = false
            projectiles.push(new Projectile( {
                x: player.position.x, 
                y: player.position.y, 
                width: player.bulletSize, 
                height: player.bulletSize, 
                color: '#ffffff', 
                velocity: direction
            }))
            audio.shoot.play()
            setTimeout(() => {  canShoot = true }, 1000 / player.fireRate);
        }
    }
}

function isCollision( x1, y1, width1, height1, x2, y2, width2, height2) {
    let originalx1 = x1 - width1/2
    let originaly1 = y1 - height1/2
    let originalx2 = x2 - width2/2
    let originaly2 = y2 - height2/2

    if(
        originalx1 > originalx2 + width2 ||
        originalx1 + width1 < originalx2 ||
        originaly1 > originaly2 + height2 ||
        originaly1 + height1 < originaly2
    ){ 
        return false
    } else {
        return true
    }
}

function updateHearts(){
    if(player.lives === 2) {
        document.getElementById('heart3').src="./img/heartEmpty.png"
    }
    if(player.lives === 1) {
        document.getElementById('heart2').src="./img/heartEmpty.png"
    }
    if(player.lives === 0) {
        document.getElementById('heart1').src="./img/heartEmpty.png"
    }
}

//CREATES DAMAGE COUNTER ON HIT
function createDamageLabel({ position , color = 'white'}) {
    const damageLabel = document.createElement('label')
    damageLabel.innerHTML = player.damage
    damageLabel.style.color = color
    damageLabel.style.position = 'absolute'
    damageLabel.style.left = (innerWidth - canvas.width)/2 + position.x + 'px'
    damageLabel.style.top = titleHeight + position.y + 'px'
    damageLabel.style.userSelect = 'none'
    damageLabel.style.fontSize = '38px'
    document.body.appendChild(damageLabel)

    gsap.to(damageLabel, {
        opacity: 0,
        y: -10,
        duration: 1,
        onComplete: () => {
            damageLabel.parentNode.removeChild(damageLabel)
        }
    })
}

//FUNCTION TO MOVE PLAYER FROM KEYBOARD INPUTS
function movePlayer(moveX, amt) {
    if(moveX) {
        player.velocity.x = amt
    } else {
        player.velocity.y = amt
    }
}


//CONTROLS ALL INPUTS EVEN CONSECUTIVELY !!!!
const controller = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
}

//EXECUTES ALL INPUTS WASD or ARROWKEYS
const executeMoves = () => {
    Object.keys(controller).forEach(key=> {
      if(key === 'w' && controller[key].pressed) {
        movePlayer( false, -player.movementSpeed)
      } 
      if(key === 'a' && controller[key].pressed) {
        movePlayer( true, -player.movementSpeed)
        facing = 'left'
      } 
      if(key === 's' && controller[key].pressed) {
        movePlayer( false, player.movementSpeed)
      } 
      if(key === 'd' && controller[key].pressed) {
        movePlayer(true, player.movementSpeed)
        facing = 'right'
      } 

      if(key === 'ArrowUp' && controller[key].pressed) {
        shootLinear( { x:0, y:-player.bulletSpeed } )
        facing = 'up'
      } 
      if(key === 'ArrowLeft' && controller[key].pressed) {
        shootLinear( { x:-player.bulletSpeed, y:0 } )
        facing = 'left'
      } 
      if(key === 'ArrowDown' && controller[key].pressed) {
        shootLinear( { x:0, y:player.bulletSpeed } )
        facing = 'down'
      } 
      if(key === 'ArrowRight' && controller[key].pressed) {
        shootLinear( { x:player.bulletSpeed, y:0 } )
        facing = 'right'
      } 
    })
}

const executeSprites = () => {
    if(isMoving && isShooting) {

    } else if(isMoving) {
        if(facing === 'left') {
            player.switchSprite('runLeft')
        } else if(facing === 'right'){
            player.switchSprite('runRight')
        } else if(facing === 'up'){
            player.switchSprite('idleUp')
        } else if(facing === 'down'){
            player.switchSprite('idleDown')
        }
    } else {
        if(facing === 'left') {
            player.switchSprite('idleLeft')
        } else if(facing === 'right'){
            player.switchSprite('idleRight')
        } else if(facing === 'up'){
            player.switchSprite('idleUp')
        } else if(facing === 'down'){
            player.switchSprite('idleDown')
        }
    }
}

//ANIMATES EACH FRAME USING requestAnimationFrame!!!
function animate() {
    animationID = requestAnimationFrame(animate)
    c.fillStyle = '#51585b'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update() //UNCOMMENT FOR BACKGROUND IMAGE!!!

    player.update()

    player.velocity.x = 0
    player.velocity.y = 0

    executeMoves()
    executeSprites()

    if(controller.w.pressed || controller.a.pressed || controller.s.pressed || controller.d.pressed){
        isMoving = true
    }
    if(!controller.w.pressed && !controller.a.pressed && !controller.s.pressed && !controller.d.pressed){
        isMoving = false
    }

    for(let index = projectiles.length - 1; index >= 0; index--){
        const projectile = projectiles[index]
        projectile.update()

        // REMOVES PROJECTILES ONCE THEY GO OFF SCREEN
        if (projectile.x + projectile.width < 0 || projectile.x - projectile.width > canvas.width || projectile.y + projectile.height < 0 || projectile.y - projectile.height > canvas.height) {
            projectiles.splice(index, 1)  
        }
    }

    for(let index = enemies.length - 1; index >= 0; index--){
        const enemy = enemies[index]
        enemy.update()

        //PLAYER HIT
        if(isCollision(player.position.x, player.position.y, player.width, player.height, enemy.position.x, enemy.position.y, enemy.width, enemy.height) ){
            if(!isInvincible) {
                isInvincible = true
                player.lives -= 1
                updateHearts()
                audio.playerDamage.play()
                player.velocity.x = (player.position.x - enemy.position.x) /2
                player.velocity.y = (player.position.y - enemy.position.y) /2
                setTimeout(() => {  isInvincible = false }, 700);
            }
        }

        // GAME OVER
        if(player.lives < 1) {
            audio.gameover.play()
            cancelAnimationFrame(animationID)
            clearInterval(intervalID)
            game.active = false
            audio.background.pause()
            gameOverPopup.style.display = 'block'
            gsap.fromTo('#gameOverPopup', {scale: 0.8, opacity: 0}, {
                scale: 1,
                opacity: 1,
                ease: 'power1.inOut',
                duration: 2,
            })
            gameOverScore.innerHTML = score
            enemiesSlainScore.innerHTML = enemiesSlain
        }

        for(let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex--){
            const projectile = projectiles[projectileIndex]

            //SHOOT ENEMY
            if(isCollision(projectile.x, projectile.y, projectile.width, projectile.height, enemy.position.x, enemy.position.y, enemy.width, enemy.height)){
                //KNOCKBACK
                enemy.position.x += projectile.velocity.x * 8
                enemy.position.y += projectile.velocity.y * 8
                if(enemy.hitPoints - player.damage > 0){
                    enemy.hitPoints -= player.damage
                    audio.enemyDamage.play()
                    createDamageLabel( {position:{ x:projectile.x, y:projectile.y }} )
                    projectiles.splice(projectileIndex, 1)
                } else {
                    // PROJECTILE KILLS ENEMY
                    score += 100
                    audio.gameover.play()
                    scoreEl.innerHTML = score
                    
                    enemiesSlain += 1
                    enemiesStatEl.innerHTML = enemiesSlain

                    createDamageLabel( {position:{ x:projectile.x, y:projectile.y }} )
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)  
                }
            }
        }
    }
}


//PLAYER SHOOTING WITH MOUSE
/*
addEventListener('click', (event) => {
    shoot({x: event.clientX, y: event.clientY})
})
*/
//START BUTTON

startButtonEl.addEventListener('click', () => {
    audio.select.play()
    audio.background.play()
    setTimeout(() => {  document.getElementById('titleText').src="./img/titleText.png" }, 200);
    
    init()
    animate()
    spawnEnemies()
    //startGamePopup.style.display = 'none'
    gsap.to('#startGamePopup', {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'expo.in',
        onComplete: () => {
            startGamePopup.style.display = 'none'
        }
    })
})

copybuttonEl.addEventListener('click', () => {
    audio.success.play()
    copybuttonEl.innerHTML = 'COPIED!'
    navigator.clipboard.writeText(String.fromCodePoint(0x1F331) + ' Sprout Shooter \nWave: ' + waveNum + '\nScore: ' +score+ ' \nhttps://sproutshooter.com');
})

//RESTART BUTTON

buttonEl.addEventListener('click', () => {
    audio.select.play()
    audio.background.play()
    init()
    animate()
    spawnEnemies()
    gsap.to('#gameOverPopup', {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'expo.in',
        onComplete: () => {
            gameOverPopup.style.display = 'none'
        }
    })
})

//TAKES IN ALL KEYDOWN AND THEN KEYUP AND RECORDS THEM IN CONTROLLER

window.addEventListener('keydown', (event) => {
    if(controller[event.key]){
        controller[event.key].pressed = true
      }
})

window.addEventListener('keyup', (event) => {
    if(controller[event.key]){
        controller[event.key].pressed = false
      }
})

//USED TO VIEW SCORE AND STATS

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'i':
            if(scoreShowing){
                audio.select.play()
                statText.style.display = 'none'
                scoreShowing = false
                break
            } else {
                audio.select.play()
                statText.style.display = 'block'
                scoreShowing = true
                break
            }
    }
})


//CHOOSE CLASS
classRifleButtonEl.addEventListener('click', () => {
    audio.select.play()
    classRifleButtonEl.style = "border: 5px solid #59ce7c;"
    classSniperButtonEl.style = "border: 0px solid #fe5c6f;"
})

classSniperButtonEl.addEventListener('click', () => {
    audio.enemyDamage.play()
})

//ON RESIZE THE CANVAS SIZE CHANGES

window.addEventListener('resize', () => {

    canvas.width = 800
    canvas.height = 600 

    //STYLES THE STATS AND HEARTS TO THE CORRECT LOCATION
    //titleText.style.width = canvas.width + 'px'

    heartHUD.style.left = (innerWidth - canvas.width)/2 + 'px'

    startGamePopup.style.left = (innerWidth - canvas.width)/2 + 'px'
    startGamePopup.style.top = titleHeight + 'px'
    startGamePopup.style.width = canvas.width + 'px'
    startGamePopup.style.height = canvas.height + 'px'

    gameOverPopup.style.left = (innerWidth - canvas.width)/2 + 'px'
    gameOverPopup.style.top = titleHeight + 'px'
    gameOverPopup.style.width = canvas.width + 'px'
    gameOverPopup.style.height = canvas.height + 'px'

    //  FOR FULLSCREEN MODE
    //canvas.width = innerWidth 
    //canvas.height = innerHeight
})

//MOBILE TOUCH TO SHOOT
/*
window.addEventListener('touchstart', (event) => {
    const x = event.touches[0].clientX
    const y = event.touches[0].clientY

    shoot({x, y})
})
*/
document.addEventListener('visibilitychange', () => {
    if(game.active) {
        if(document.hidden) {
            clearInterval(intervalID)
        } else {
            spawnEnemies()
        }
    }
})