function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

const playerName = document.querySelector('.playerName').innerHTML;
const enemyName = document.querySelector('.enemyName').innerHTML;
let displayText = document.querySelector('.displayText');

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    displayText.style.display = 'flex'
    if (player.health === enemy.health) {
        displayText.innerHTML = 'Empate';
    } else if (player.health > enemy.health) {
        displayText.innerHTML = `${playerName} Wins`;
    } else {
        displayText.innerHTML = `${enemyName} Wins`;
    }
}

let timer = 60;
let timerId

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(() => {
            timer--;
            document.querySelector('.timer').innerHTML = timer
            decreaseTimer()
        }, 1000)
    } else {
        determineWinner({ player, enemy, timerId })
    }
}