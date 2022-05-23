
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './game-assets/imgs/demonBackgournd.png',
})

const executor = new Sprite({
    position: {
        y: 380
    },
    imageSrc: './game-assets/imgs/executor.png',
    scale: 2,
    framesMax: 8
})

const player = new Fighter({
    position: {
        x: 100,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './game-assets/king-character/Sprites/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 100,
        y: 113
    },
    sprites: {
        idle: {
            imageSrc: './game-assets/king-character/Sprites/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './game-assets/king-character/Sprites/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './game-assets/king-character/Sprites/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './game-assets/king-character/Sprites/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './game-assets/king-character/Sprites/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './game-assets/king-character/Sprites/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './game-assets/king-character/Sprites/Death.png',
            framesMax: 6,
        }
    },
    attackBox: {
        offset: {
            x: 120,
            y: 50
        },
        width: 120,
        height: 50
    }
});

const enemy = new Fighter({
    position: {
        x: 770,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './game-assets/kenji-character/Sprites/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 171
    },
    sprites: {
        idle: {
            imageSrc: './game-assets/kenji-character/Sprites/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './game-assets/kenji-character/Sprites/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './game-assets/kenji-character/Sprites/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './game-assets/kenji-character/Sprites/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './game-assets/kenji-character/Sprites/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './game-assets/kenji-character/Sprites/Take Hit - white silhouette.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './game-assets/kenji-character/Sprites/Death.png',
            framesMax: 7,
        }
    },
    attackBox: {
        offset: {
            x: -185,
            y: 50
        },
        width: 185,
        height: 50
    }
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    //spriteTorch.update();

    if(player.dead) {
        executor.position.x = player.position.x
        executor.update();
    } else if(enemy.dead) {
        executor.position.x = enemy.position.x - 100
        executor.update();
    }
    // context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    // context.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement

    if (keys.a.pressed && player.lastKey === 'a') {
        if(player.position.x > -75) {
            player.velocity.x = -5;
        }
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        if(player.position.x < 880) {
            player.velocity.x = 5;
        }
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    // jumping player
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        if(enemy.position.x > 1) {
            enemy.velocity.x = -5;
        }
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        if(enemy.position.x < 960) {
            enemy.velocity.x = 5;
        }
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle')
    }

    // jumping enemy
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // detect for collision

    // player attack & enemy gets hit
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking && player.framesCurrent === 2
    ) {
        enemy.takeHit()
        player.isAttacking = false;

        gsap.to('.enemyCurrentLife', {
            width: `${enemy.health}%`
        })
        //console.log('player atttack')
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 2) {
        player.isAttacking = false;
    }

    // enemy attack & player gets hit
    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking && enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false;

        gsap.to('.playerCurrentLife', { // gsap is a js animation library
            width: `${player.health}%`
        })
        //console.log('enemy atttack')
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

animate();

window.addEventListener('keydown', event => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a'
                break;
            case 'w':
                if(!player.velocity.y > 0){
                    player.velocity.y = -20;
                }
                break;
            case ' ':
                player.attack();
                break;
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight'
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft'
                break;
            case 'ArrowUp':
                if(!enemy.velocity.y > 0){
                    enemy.velocity.y = -20;
                }
                break;
            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }
})

window.addEventListener('keyup', event => {
    switch (event.key) {
        // player keys
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        // enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
}) 