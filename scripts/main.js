var playerCanvas = document.getElementById('snake-player'),
    playerCtx = playerCanvas.getContext('2d'),
    foodCanvas = document.getElementById('food-layer'),
    foodCtx = foodCanvas.getContext('2d'),
    i,
    rows = 20,
    cols = 40;

var segSize = 12,
    snakeLength = 4,
    moovingStep = 3,
    WIDTH = cols * segSize,
    HEIGHT = rows * segSize,
    dirs = {
        'l': { x: -moovingStep, y: 0 },
        'r': { x: +moovingStep, y: 0 },
        'u': { x: 0, y: -moovingStep },
        'd': { x: 0, y: +moovingStep }
    },
    deltas = {
        'l': { x: -1, y: 0 },
        'r': { x: +1, y: 0 },
        'u': { x: 0, y: -1 },
        'd': { x: 0, y: +1 }
    };

playerCanvas.width = WIDTH;
playerCanvas.height = HEIGHT;
foodCanvas.width = WIDTH;
foodCanvas.height = HEIGHT;


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function isCollide(obj1, obj2) {
    var isXcolide = obj1.x < (obj2.x + segSize) && obj2.x < (obj1.x + segSize) ? true : false;
    var isYcolide = obj1.y < (obj2.y + segSize) && obj2.y < (obj1.y + segSize) ? true : false;

    return isXcolide && isYcolide ? true : false;
}

function checkForCollision(obj, arr) {
    var len = arr.length
    for (var i = 0; i < len; i += 1) {
        if (isCollide(obj, arr[i])) {
            return i;
        }
    }
    return false;
}

function boundaryCheck(snakeHead) {
    var x = snakeHead.x,
        y = snakeHead.y;

    return x < 0 || x > WIDTH || y < 0 || y > HEIGHT;
}

function checkForChangingPoints() {
    if (changingPoints.length) {
        for (var i = 0; i < changingPoints.length; i += 1) {
            changingPoints[i].snIndex += 1;
        }
    }
}

function checkForEatenFood(snakeHead, food) {
    var eatenFoodInd = checkForCollision(snakeHead, food);
    if (eatenFoodInd) {
        // var x = food[eatenFoodInd].x,
        //     y = food[eatenFoodInd].y;

        // foodCtx.clearRect(x - 5, y - 5, (x + segSize + 10), (y + segSize + 10));

        var foodSeg = getNewSegment(getRandomInt(WIDTH - segSize), getRandomInt(HEIGHT - segSize)),
            snakeTail = snake[0],
            snakeSeg = {
                x: snakeTail.x + -(segSize * deltas[snakeTail.dir].x),
                y: snakeTail.y + -(segSize * deltas[snakeTail.dir].y),
                size: segSize,
                dir: snakeTail.dir,
                newSegm: true
            };
        snake.unshift(snakeSeg);
        checkForChangingPoints();
        food.splice(eatenFoodInd, 1, foodSeg);
        foodCtx.clearRect(0, 0, WIDTH, HEIGHT);
        drawFood(food);
    }
}

function checkForBodyCollision(snake) {
    var head = snake[snake.length - 1],
        body = snake.slice(0, snake.length - 2),
        isBodyCollide = checkForCollision(head, body);

    if (isBodyCollide !== false) {
        return true;
    }
    return false;
}

function chekcForEndOfGame(snake) {
    var head = snake[snake.length - 1],
        isBodyCollide = checkForBodyCollision(snake);

    // console.log(isBodyCollide);

    if (isBodyCollide || boundaryCheck(head)) {
        return true;
    }
    return false;
}

function gameOver() {
    playerCtx.clearRect(0, 0, WIDTH, HEIGHT);
    playerCtx.fillStyle = 'red';
    playerCtx.font = '52px bold Consolas';

    playerCtx.fillText('Game over', 100, 120);
    document.getElementById('end-song').play();
}

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

function generateFood(count) {
    var food = [];

    for (i = 0; i < count; i += 1) {
        var newSeg = getNewSegment(getRandomInt(WIDTH - segSize), getRandomInt(HEIGHT - segSize));
        food.push(newSeg);
    }

    return food;
}

var snake = generateSnake();
var food = generateFood(10);
var changingPoints = [];

// console.log(food[0]);

function drawSnake(snake) {
    playerCtx.clearRect(0, 0, WIDTH, HEIGHT);
    playerCtx.fillStyle = 'black';
    for (i = snake.length - 1; i >= 0; i -= 1) {
        snake[i].x = snake[i].x + dirs[snake[i].dir].x;
        snake[i].y = snake[i].y + dirs[snake[i].dir].y;
        playerCtx.fillRect(snake[i].x, snake[i].y, snake[i].size, snake[i].size);
    }
    if (changingPoints.length) {
        for (var i = 0; i < changingPoints.length; i += 1) {
            playerCtx.fillRect(changingPoints[i].x, changingPoints[i].y, snake[i].size, snake[i].size);
        }
    }
}

function drawFood(food) {
    foodCtx.fillStyle = 'yellowgreen';
    for (i = 0; i < food.length; i += 1) {
        foodCtx.fillRect(food[i].x, food[i].y, segSize, segSize);
    }
}

var snakeSpeed = 6,
    countFrames = 0;

drawFood(food);



function gameLoop() {

    if (countFrames % snakeSpeed === 0) {
        if (changingPoints.length) {
            var removeChangingPoint = false;
            for (var i = 0; i < changingPoints.length; i += 1) {
                var ind = changingPoints[i].snIndex,
                    x = changingPoints[i].x,
                    y = changingPoints[i].y,
                    dir = changingPoints[i].dir;

                if (ind === snake.length - 1) {
                    snake[ind].dir = dir;
                }

                if (snake[ind - 1].x === x && snake[ind - 1].y === y) {
                    // debugger;
                    snake[ind - 1].dir = dir;
                    changingPoints[i].snIndex -= 1;
                    // console.log(`cp length: ${changingPoints.length}`);
                    // for (var j = 0; j < snake.length; j += 1) {
                    //     console.log(j + ':');
                    //     console.log(snake[j]);
                    // }
                }

                if (changingPoints[i].snIndex === 0) {
                    removeChangingPoint = true;
                }
            }

            if (removeChangingPoint) {
                changingPoints.splice(0, 1);
                removeChangingPoint = false;
            }
        }
        // drawFood(food);
        drawSnake(snake);
        checkForEatenFood(snake[snake.length - 1], food);
        if (chekcForEndOfGame(snake)) {
            gameOver();
            return;
        }
        // var m1 = 0;
        // if (snake.length > snakeLength) {
        //     for (i = 0; i < snake.length; i += 1) {
        //         console.log(i + ':');
        //         console.log(snake[i]);
        //     }
        //     m1 += 1;
        //     if (m1 === 3) {
        //         return;
        //     }
        // };
    }

    countFrames += 1;
    window.requestAnimationFrame(gameLoop);
}

gameLoop();

// window.addEventListener("keydown", checkKeyPressed, false);

// function checkKeyPressed(e) {
//     if (e.keyCode == "65") {
//         alert("The 'a' key is pressed.");
//     }
// }

window.addEventListener("keydown", function(ev) {
    var x = ev.keyCode,
        dir;
    // console.log(x);

    switch (x) {
        case 37:
            dir = 'l';
            break;
        case 38:
            dir = 'u';
            break;
        case 39:
            dir = 'r';
            break;
        case 40:
            dir = 'd';
            break;
        default:
            break;
    }

    if (snake[snake.length - 1].dir === dir) {
        return;
    }

    var newChangingPoint = {
        'x': snake[snake.length - 1].x,
        'y': snake[snake.length - 1].y,
        'dir': dir,
        'snIndex': snake.length - 1
    }

    changingPoints.push(newChangingPoint);
    // console.log(dir);

});