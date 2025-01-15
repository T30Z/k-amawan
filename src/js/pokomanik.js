document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    const leftPlayer = document.getElementById('twin');
    const selectedTwinDiv = document.getElementById('selected-twin');
    const infoDiv = document.getElementById('info');
    const ball = document.querySelector('.ball');
    const leftPlayerElem = document.querySelector('.twin');
    const rightPlayerElem = document.querySelector('.deity');
    const court = document.querySelector('.court');
    const topCircle = document.querySelector('.celestial-ring-top');
    const bottomCircle = document.querySelector('.celestial-ring-bottom');
    const leftScoreElement = document.getElementById('left-score');
    const rightScoreElement = document.getElementById('right-score');
    const twinPlayingHeader = document.getElementById('twin-playing');
    // Added for deity label updates:
    const deityPlayingHeader = document.getElementById('deity-playing'); 

    // Constants
    const ballSpeed = 4;
    const winningScore = 13;
    const difficulty = {
        speed: 2,
        errorMargin: 10,
        reactionTime: 50,
        updateFrequency: 3
    };

    // State variables
    let ballX = court.clientWidth / 2;
    let ballY = court.clientHeight / 2;
    let ballDirectionX = ballSpeed;
    let ballDirectionY = ballSpeed;
    let leftPlayerY = court.clientHeight / 2 - leftPlayerElem.clientHeight / 2;
    let rightPlayerY = court.clientHeight / 2 - rightPlayerElem.clientHeight / 2;
    let leftScore = 0;
    let rightScore = 0;
    let initialTouchY = null;
    let gameStarted = false; // Flag to check if the game has started

    // Function to update scores
    function updateScore() {
        leftScoreElement.textContent = leftScore;
        rightScoreElement.textContent = rightScore;
    }

    // Function to reset the ball
    function resetBall() {
        ballX = court.clientWidth / 2;
        ballY = court.clientHeight / 2;
        ballDirectionX = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
        ballDirectionY = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    }

    // Function to handle strobe effect
    function triggerStrobe(side) {
        const strobeElement = document.querySelector(side === 'left' ? '.strobe-left' : '.strobe-right');
        strobeElement.classList.add('strobe-active');
        setTimeout(() => strobeElement.classList.remove('strobe-active'), 1500);
    }

    // Function to check collision with circles
    function checkCircleCollision() {
        const ballRect = ball.getBoundingClientRect();
        const ballCenterX = ballRect.left + ball.clientWidth / 2;
        const ballCenterY = ballRect.top + ball.clientHeight / 2;

        function isCollision(circleElement) {
            const circleRect = circleElement.getBoundingClientRect();
            const circleCenterX = circleRect.left + circleRect.width / 2;
            const circleCenterY = circleRect.top + circleRect.height / 2;
            const radius = circleRect.width / 2;

            const distX = ballCenterX - circleCenterX;
            const distY = ballCenterY - circleCenterY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            return distance < (radius + ball.clientWidth / 2);
        }

        // If ball collides with top circle => Right scores
        if (isCollision(topCircle)) {
            rightScore++;
            updateScore();
            triggerStrobe('right');
            if (rightScore >= winningScore) {
                alert("Xibalba wins with 13 points!");
                resetGame();
            } else {
                resetBall();
            }
        }

        // If ball collides with bottom circle => Left scores
        if (isCollision(bottomCircle)) {
            leftScore++;
            updateScore();
            triggerStrobe('left');
            if (leftScore >= winningScore) {
                alert("You win with 13 points!");
                // Switch from Xibalba to SOTX NA
                rightPlayerElem.src = "img/sotx-na.svg";
                deityPlayingHeader.textContent = "SOTX NA";

                resetGame();
            } else {
                resetBall();
            }
        }
    }

    // Function to reset the game
    function resetGame() {
        leftScore = 0;
        rightScore = 0;
        updateScore();
        resetBall();
    }

    // Function to update ball position
    function updateBallPosition() {
        ballX += ballDirectionX;
        ballY += ballDirectionY;

        // Bounce off top/bottom walls
        if (ballY <= 0 || ballY >= court.clientHeight - ball.clientHeight) {
            ballDirectionY *= -1;
        }

        // Check left paddle collision
        if (
            ballX <= leftPlayerElem.clientWidth &&
            ballY + ball.clientHeight >= leftPlayerY &&
            ballY <= leftPlayerY + leftPlayerElem.clientHeight
        ) {
            ballDirectionX *= -1;
            ballX = leftPlayerElem.clientWidth;
        }

        // Check right paddle collision
        if (
            ballX >= court.clientWidth - rightPlayerElem.clientWidth - ball.clientWidth &&
            ballY + ball.clientHeight >= rightPlayerY &&
            ballY <= rightPlayerY + rightPlayerElem.clientHeight
        ) {
            ballDirectionX *= -1;
            ballX = court.clientWidth - rightPlayerElem.clientWidth - ball.clientWidth;
        }

        // If ball goes off the left side => Right scores
        if (ballX < 0) {
            rightScore++;
            updateScore();
            triggerStrobe('right');
            if (rightScore >= winningScore) {
                alert("Right player wins with 13 points!");
                resetGame();
            } else {
                resetBall();
            }
        }

        // If ball goes off the right side => Left scores
        if (ballX > court.clientWidth - ball.clientWidth) {
            leftScore++;
            updateScore();
            triggerStrobe('left');
            if (leftScore >= winningScore) {
                alert("You win with 13 points!");
                // Switch from Xibalba to SOTX NA
                rightPlayerElem.src = "img/sotx-na.svg";
                deityPlayingHeader.textContent = "SOTX NA";

                resetGame();
            } else {
                resetBall();
            }
        }

        // Check ring collisions
        checkCircleCollision();

        // Update ball DOM position
        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
    }

    // Function to move left player
    function moveLeftPlayer(yPosition) {
        leftPlayerY = Math.max(
            0,
            Math.min(court.clientHeight - leftPlayerElem.clientHeight, yPosition)
        );
        leftPlayerElem.style.top = leftPlayerY + 'px';
    }

    // Function to move right player (AI)
    function moveRightPlayer() {
        const ballSpeed = Math.sqrt(ballDirectionX * ballDirectionX + ballDirectionY * ballDirectionY);
        const playerSpeed = ballSpeed;

        // Predict where the ball will be, roughly
        const predictedBallY = ballY + (ballDirectionY * difficulty.reactionTime / 1000) * 60;
        const centerPlayer = rightPlayerY + rightPlayerElem.clientHeight / 2;

        // Only move if the predicted position is beyond the AI’s "error margin"
        if (Math.abs(centerPlayer - predictedBallY) > difficulty.errorMargin) {
            if (centerPlayer < predictedBallY) {
                rightPlayerY = Math.min(
                    court.clientHeight - rightPlayerElem.clientHeight,
                    rightPlayerY + playerSpeed
                );
            } else if (centerPlayer > predictedBallY) {
                rightPlayerY = Math.max(0, rightPlayerY - playerSpeed);
            }
        }

        rightPlayerElem.style.top = rightPlayerY + 'px';
    }

    // Function to start the game
    function startGame() {
        if (!gameStarted) {
            gameStarted = true;
            gameLoop(); // Start the game loop
        }
    }

    // Event handlers for player selection
    document.getElementById('select-hunahpu').addEventListener('click', function () {
        leftPlayer.src = 'img/hunahpu.svg';
        selectedTwinDiv.innerText = 'You selected Hunahpu';
        infoDiv.style.display = 'none';
        twinPlayingHeader.textContent = 'Hunahpu';
        startGame(); // Start the game after selection
    });

    document.getElementById('select-xbalanque').addEventListener('click', function () {
        leftPlayer.src = 'img/xbalanque.svg';
        selectedTwinDiv.innerText = 'You selected Xbalanque';
        infoDiv.style.display = 'none';
        twinPlayingHeader.textContent = 'Xbalanque';
        startGame(); // Start the game after selection
    });

    // Mouse movement control for the left player
    document.addEventListener('mousemove', function (event) {
        if (gameStarted) {
            const rect = court.getBoundingClientRect();
            const mouseY = event.clientY - rect.top;
            moveLeftPlayer(mouseY - leftPlayerElem.clientHeight / 2);
        }
    });

    // Touch control for the left player
    document.addEventListener('touchstart', function (event) {
        if (gameStarted && event.target.closest('.court')) {
            initialTouchY = event.touches[0].clientY;
            event.preventDefault();
        }
    });

    document.addEventListener('touchmove', function (event) {
        if (gameStarted && initialTouchY !== null && event.target.closest('.court')) {
            const touchY = event.touches[0].clientY;
            const deltaY = touchY - initialTouchY;
            moveLeftPlayer(leftPlayerY + deltaY);
            initialTouchY = touchY;
            event.preventDefault();
        }
    });

    // Main game loop
    function gameLoop() {
        updateBallPosition();
        moveRightPlayer();
        requestAnimationFrame(gameLoop);
    }
});
