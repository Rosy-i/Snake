var canvas = document.getElementById('snake-game'),
    ctx = canvas.getContext('2d'),
    i,
    rows = 30,
    cols = 60;


var segSize = 12,
    snakeLength = 3,
    moovingStep = 3,
    dirs = {
        'l': { x: moovingStep, y: 0 },
        'r': { x: moovingStep, y: 0 },
        'u': { x: 0, y: moovingStep },
        'd': { x: 0, y: moovingStep }
    };
canvas.width = cols * segSize;
canvas.height = rows * segSize;

function getNewSegment(x, y) {
    return {
        x: x,
        y: y,
        size: segSize,
        dir: 'r'
    }
}

function generateSnake() {
    var snake = [];

    for (i = 0; i < snakeLength; i += 1) {
        var newSeg = getNewSegment(i * segSize, ((rows / 2) - 1) * segSize);
        snake.push(newSeg);
    }

    return snake;
}

var snake = generateSnake();

function drawSnake(snake) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < snake.length; i += 1) {
        snake[i].x = snake[i].x + dirs[snake[i].dir].x;
        snake[i].y = snake[i].y + dirs[snake[i].dir].y;
        ctx.fillRect(snake[i].x, snake[i].y, snake[i].size, snake[i].size);
    }
}

var snakeSpeed = 8,
    countFrames = 0;


function gameLoop() {

    if (countFrames % snakeSpeed === 0) {
        drawSnake(snake);
    }

    countFrames += 1;
    window.requestAnimationFrame(gameLoop);
}

gameLoop()