const gridElement = document.getElementById('gameGrid');
const challengeTextElement = document.getElementById('challengeText');
const answerInputElement = document.getElementById('answerInput');
const submitButton = document.getElementById('submitAnswer');
const feedbackMessageElement = document.getElementById('feedbackMessage');
const timeLeftElement = document.getElementById('timeLeft');
const currentScoreElement = document.getElementById('currentScore');
const startGameButton = document.getElementById('startGame');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const restartGameButton = document.getElementById('restartGame');
const teamNameElement = document.getElementById('teamName');
const leaderboardContainer = document.getElementById('leaderboardContainer');
const finalMessageElement = document.getElementById('finalMessage');

let gridSize = 5; // 5x5 grid
let currentSquareIndex = 0;
let score = 0;
let timer;
let timeLeft = 180; // 3 minutes in seconds
let gameStarted = false;
let startTime; // To track the start time
let leaderboard = []; // To store leaderboard data

// Define your challenges here.
const challenges = [
    { question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "echo", type: "riddle" },
    { question: "What has an eye but cannot see?", answer: "needle", type: "riddle" },
    { question: "I have cities, but no houses; forests, but no trees; and water, but no fish. What am I?", answer: "map", type: "riddle" },
    { question: "What is full of holes but still holds water?", answer: "sponge", type: "riddle" },
    { question: "I am always in front of you but can’t be seen. What am I?", answer: "future", type: "riddle" },
    { question: "Bonus! +5 points instantly!", answer: "", type: "bonus" },
    { question: "What has to be broken before you can use it?", answer: "egg", type: "riddle" },
    { question: "What is always coming, but never arrives?", answer: "tomorrow", type: "riddle" },
    { question: "What can be caught, but not thrown?", answer: "cold", type: "riddle" },
    { question: "What question can you never answer yes to?", answer: "are you asleep yet", type: "riddle" },
    { question: "What has legs, but cannot walk?", answer: "table", type: "riddle" },
    { question: "What has to be broken before you can use it?", answer: "egg", type: "riddle" },
    { question: "What is always coming, but never arrives?", answer: "tomorrow", type: "riddle" },
    { question: "What can be caught, but not thrown?", answer: "cold", type: "riddle" },
    { question: "Bonus! +5 points instantly!", answer: "", type: "bonus" },
    { question: "What has an eye but cannot see?", answer: "needle", type: "riddle" },
    { question: "I have cities, but no houses; forests, but no trees; and water, but no fish. What am I?", answer: "map", type: "riddle" },
    { question: "What is full of holes but still holds water?", answer: "sponge", type: "riddle" },
    { question: "I am always in front of you but can’t be seen. What am I?", answer: "future", type: "riddle" },
    { question: "What question can you never answer yes to?", answer: "are you asleep yet", type: "riddle" },
    { question: "What has legs, but cannot walk?", answer: "table", type: "riddle" },
    { question: "What has to be broken before you can use it?", answer: "egg", type: "riddle" },
    { question: "What is always coming, but never arrives?", answer: "tomorrow", type: "riddle" },
    { question: "Bonus! +5 points instantly!", answer: "", type: "bonus" },
    { question: "What can be caught, but not thrown?", answer: "cold", type: "riddle" },
];

// Load leaderboard from localStorage if available
document.addEventListener('DOMContentLoaded', () => {
    const storedLeaderboard = localStorage.getItem('leaderboard');
    if (storedLeaderboard) {
        leaderboard = JSON.parse(storedLeaderboard);
    }
    initializeGrid();
    document.getElementById('startGame').style.display = 'block';
    leaderboardContainer.style.display = 'none';
    gameOverScreen.style.display = 'none';
});

function initializeGrid() {
    gridElement.innerHTML = '';
    for (let i = 0; i < gridSize * gridSize; i++) {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        square.dataset.index = i;
        gridElement.appendChild(square);
    }
}

function updateGridDisplay() {
    const squares = document.querySelectorAll('.grid-square');
    squares.forEach((square, index) => {
        square.classList.remove('current', 'solved');
        if (index < currentSquareIndex) {
            square.classList.add('solved');
            square.innerHTML = '&#10003;';
        }
        if (index === currentSquareIndex) {
            square.classList.add('current');
            square.textContent = '';
        } else if (!square.classList.contains('solved')) {
            square.textContent = '?';
        }
    });
}

function displayChallenge() {
    if (currentSquareIndex >= challenges.length) {
        endGame(true); // Game completed
        return;
    }

    const currentChallenge = challenges[currentSquareIndex];
    challengeTextElement.textContent = currentChallenge.question;
    answerInputElement.value = '';
    feedbackMessageElement.textContent = '';
    answerInputElement.focus();

    if (currentChallenge.type === "bonus") {
        score += 5;
        currentScoreElement.textContent = score;
        feedbackMessageElement.textContent = "Bonus! +5 points!";
        setTimeout(() => {
            currentSquareIndex++;
            updateGridDisplay();
            displayChallenge();
        }, 1000);
    }
}

function checkAnswer() {
    const userAnswer = answerInputElement.value.trim().toLowerCase();
    const currentChallenge = challenges[currentSquareIndex];

    if (currentChallenge.type === "bonus") {
        return;
    }

    if (userAnswer === currentChallenge.answer.toLowerCase()) {
        score += 10;
        currentScoreElement.textContent = score;
        feedbackMessageElement.textContent = "Correct! +10 points!";
        currentSquareIndex++;
        updateGridDisplay();
        setTimeout(displayChallenge, 500);
    } else {
        feedbackMessageElement.textContent = "Wrong attempt. Try again!";
    }
    answerInputElement.value = '';
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeLeftElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame(false); // Time's up
        }
    }, 1000);
}

function startGame() {
    gameStarted = true;
    startGameButton.style.display = 'none';
    gameOverScreen.style.display = 'none';
    leaderboardContainer.style.display = 'none';
    gridElement.style.display = 'grid';
    document.querySelector('.challenge-area').style.display = 'block';

    const team = prompt("Enter your team name (2-3 players):");
    teamNameElement.textContent = team || "Team Alpha";

    currentSquareIndex = 0;
    score = 0;
    timeLeft = 180;
    startTime = new Date(); // Record start time
    currentScoreElement.textContent = score;
    timeLeftElement.textContent = "03:00";
    feedbackMessageElement.textContent = '';

    initializeGrid();
    updateGridDisplay();
    displayChallenge();
    startTimer();
}

function endGame(completed) {
    gameStarted = false;
    clearInterval(timer);
    
    // Calculate time taken
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // in seconds

    // Save score to leaderboard
    const teamName = teamNameElement.textContent;
    leaderboard.push({
        team: teamName,
        score: score,
        date: new Date().toLocaleDateString(),
        timeTaken: timeTaken,
        completed: completed
    });

    // Sort and truncate leaderboard to top 10
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score; // Higher score first
        }
        return a.timeTaken - b.timeTaken; // Faster time first
    });
    leaderboard = leaderboard.slice(0, 10);

    // Save to localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Show game over screen
    challengeTextElement.textContent = "Game Over!";
    answerInputElement.style.display = 'none';
    submitButton.style.display = 'none';
    feedbackMessageElement.textContent = '';
    gridElement.style.display = 'none';
    document.querySelector('.challenge-area').style.display = 'none';

    gameOverScreen.style.display = 'block';
    finalScoreElement.textContent = score;

    // Check rank and show personalized message
    const myRank = leaderboard.findIndex(entry => entry.team === teamName) + 1;

    if (myRank > 0 && myRank <= 10) {
        finalMessageElement.textContent = "Congratulations! You made it to the Top 10!";
        finalMessageElement.style.color = '#28a745';
    } else {
        finalMessageElement.textContent = "Thank you for participating!";
        finalMessageElement.style.color = '#6c757d';
    }

    // Display the leaderboard
    displayLeaderboard();
}

function displayLeaderboard() {
    leaderboardContainer.innerHTML = '<h2>Top 10 Teams</h2>';
    const list = document.createElement('ol');
    leaderboard.forEach((entry, index) => {
        const listItem = document.createElement('li');
        const timeString = new Date(entry.timeTaken * 1000).toISOString().substr(11, 8); // Format seconds into HH:MM:SS
        const completionStatus = entry.completed ? ' (Completed)' : '';
        listItem.textContent = `${entry.team}: ${entry.score} points, Time: ${timeString}${completionStatus}`;
        list.appendChild(listItem);
    });
    leaderboardContainer.appendChild(list);
    leaderboardContainer.style.display = 'block';
}

function restartGame() {
    answerInputElement.style.display = 'block';
    submitButton.style.display = 'block';
    startGame();
}

// Event Listeners
startGameButton.addEventListener('click', startGame);
submitButton.addEventListener('click', checkAnswer);
answerInputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && gameStarted) {
        checkAnswer();
    }
});
restartGameButton.addEventListener('click', restartGame);
