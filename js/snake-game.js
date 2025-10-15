// Snake Game JavaScript
let canvas, ctx;
let snake = [];
let food = {};
let direction = 'right';
let gameRunning = false;
let gameLoop;
let score = 0;
const gridSize = 20;
const tileCountX = 15; // 300px / 20px = 15 tiles
const tileCountY = 10; // 200px / 20px = 10 tiles

// Window dragging variables
let isWindowDragging = false;
let windowDragOffset = { x: 0, y: 0 };

// Game functions
function testOpenGame() {
    const gameWindow = document.getElementById('miniGame');
    if (gameWindow) {
        gameWindow.style.display = 'block';
        initGame();
        initWindowDragging();
    }
}

function closeGame() {
    document.getElementById('miniGame').style.display = 'none';
    stopGame();
}

function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    resetGame();
}

function resetGame() {
    snake = [
        {x: 7, y: 7},
        {x: 6, y: 7},
        {x: 5, y: 7}
    ];
    direction = 'right';
    score = 0;
    document.getElementById('score').textContent = score;
    console.log('Resetting game, snake length:', snake.length);
    generateFood();
    console.log('Food after reset:', food);
    draw();
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gameLoop = setInterval(gameUpdate, 200);
    }
}

function pauseGame() {
    if (gameRunning) {
        gameRunning = false;
        clearInterval(gameLoop);
    } else {
        startGame();
    }
}

function stopGame() {
    gameRunning = false;
    clearInterval(gameLoop);
}

function generateFood() {
    // Simple approach: try random positions until we find a free one
    let attempts = 0;
    let newFood;
    
    do {
        newFood = {
            x: Math.floor(Math.random() * tileCountX),
            y: Math.floor(Math.random() * tileCountY)
        };
        attempts++;
        
        // If we can't find a free spot after 50 attempts, just place it anywhere
        if (attempts > 50) {
            console.log('Too many attempts, placing food at random position');
            break;
        }
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    food = newFood;
    console.log('Food generated at:', food.x, food.y, 'after', attempts, 'attempts');
}

function gameUpdate() {
    if (!gameRunning) return;
    
    updateSnake();
    checkCollision();
    checkFood();
    draw();
}

function updateSnake() {
    const head = {x: snake[0].x, y: snake[0].y};
    
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    snake.unshift(head);
}

function checkCollision() {
    const head = snake[0];
    
    // Teleport through walls
    if (head.x < 0) head.x = tileCountX - 1;
    if (head.x >= tileCountX) head.x = 0;
    if (head.y < 0) head.y = tileCountY - 1;
    if (head.y >= tileCountY) head.y = 0;
    
    // Update head position
    snake[0] = head;
    
    // Self collision (check only after teleportation)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
}

function checkFood() {
    const head = snake[0];
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        console.log('Food eaten! Score:', score, 'Snake length:', snake.length);
        generateFood();
        // Don't remove tail - snake grows!
    } else {
        snake.pop(); // Only remove tail when NOT eating
    }
}

function draw() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#0f0';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
    
    // Draw food - always draw it
    ctx.fillStyle = '#f00';
    if (food && typeof food.x === 'number' && typeof food.y === 'number') {
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    } else {
        // If food is invalid, generate new one
        console.log('Food is invalid, regenerating...');
        generateFood();
        if (food && typeof food.x === 'number' && typeof food.y === 'number') {
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
        }
    }
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    alert(`Игра окончена! Счет: ${score}`);
}

// Keyboard controls
document.addEventListener('keydown', function(e) {
    if (!gameRunning) return;
    
    // Prevent page scrolling when using arrow keys in game
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
    
    switch(e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const gameIcon = document.querySelector('.desktop-icon');
    if (gameIcon) {
        gameIcon.onclick = testOpenGame;
    }
});

// Window dragging functions
function initWindowDragging() {
    const gameWindow = document.getElementById('miniGame');
    const windowHeader = gameWindow.querySelector('.mini-game-header');
    
    if (windowHeader) {
        windowHeader.addEventListener('mousedown', startDrag);
        windowHeader.style.cursor = 'move';
    }
    
    document.addEventListener('mousemove', windowDrag);
    document.addEventListener('mouseup', stopWindowDrag);
}

function startDrag(e) {
    const gameWindow = document.getElementById('miniGame');
    isWindowDragging = true;
    
    // Get current position before changing to fixed
    const rect = gameWindow.getBoundingClientRect();
    windowDragOffset.x = e.clientX - rect.left;
    windowDragOffset.y = e.clientY - rect.top;
    
    // Set position to fixed and maintain current visual position
    gameWindow.style.position = 'fixed';
    gameWindow.style.left = rect.left + 'px';
    gameWindow.style.top = rect.top + 'px';
    gameWindow.style.zIndex = '1001';
    gameWindow.classList.add('dragging');
    e.preventDefault();
}

function windowDrag(e) {
    if (!isWindowDragging) return;
    
    const gameWindow = document.getElementById('miniGame');
    const x = e.clientX - windowDragOffset.x;
    const y = e.clientY - windowDragOffset.y;
    
    // Keep window within viewport
    const maxX = window.innerWidth - gameWindow.offsetWidth;
    const maxY = window.innerHeight - gameWindow.offsetHeight;
    
    gameWindow.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    gameWindow.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
}

function stopWindowDrag() {
    if (isWindowDragging) {
        const gameWindow = document.getElementById('miniGame');
        gameWindow.classList.remove('dragging');
        isWindowDragging = false;
    }
}

// Export functions to global scope
window.testOpenGame = testOpenGame;
window.closeGame = closeGame;
window.startGame = startGame;
window.pauseGame = pauseGame;
window.resetGame = resetGame;
