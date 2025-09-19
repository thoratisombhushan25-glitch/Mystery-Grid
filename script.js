// Get all necessary HTML elements
const gridContainer = document.getElementById('grid-container');
const timeDisplay = document.getElementById('time-display');
const scoreDisplay = document.getElementById('score-display');
const challengeTypeText = document.getElementById('challenge-type');
const challengeText = document.getElementById('challenge-text');
const answerInput = document.getElementById('answer-input');
const submitButton = document.getElementById('submit-answer');
const gameOverScreen = document.getElementById('game-over-screen');
const finalMessage = document.getElementById('final-message');
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');

let currentSquareIndex = 0;
let score = 0;
let timeLeft = 180; // 3 minutes in seconds
let timerInterval;
const totalSquares = 25; // 5x5 grid
let teamName = '';
let shuffledChallenges = [];

// Fisher-Yates shuffle algorithm to randomize the array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to check for duplicate teams and start the game
function checkAndRegisterTeam() {
    const name = prompt("Please enter your team name:");
    if (!name) {
        alert("Team name is required to play.");
        return;
    }
    
    // Check if team has already participated
    let participatingTeams = JSON.parse(localStorage.getItem('participatingTeams')) || [];
    if (participatingTeams.includes(name)) {
        alert("Warning: This team has already participated. No new high score will be recorded.");
    } else {
        participatingTeams.push(name);
        localStorage.setItem('participatingTeams', JSON.stringify(participatingTeams));
    }
    teamName = name;
    initializeGame();
}

// Main game initialization function
function initializeGame() {
    // Reset all game variables
    currentSquareIndex = 0;
    score = 0;
    timeLeft = 180; 
    scoreDisplay.textContent = score;
    answerInput.value = '';
    
    // Hide game over screen and show the game
    gameOverScreen.classList.add('hidden');
    gridContainer.classList.remove('hidden');
    document.getElementById('challenge-display').classList.remove('hidden');
    
    // Clear and re-generate the grid
    gridContainer.innerHTML = '';
    for (let i = 0; i < totalSquares; i++) {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        square.dataset.index = i;
        gridContainer.appendChild(square);
    }

    // Shuffle challenges for a unique game experience
    shuffledChallenges = shuffleArray([...challenges]);

    updateGridVisuals();
    startTimer();
    loadChallenge();
}

// Function to visually update the grid
function updateGridVisuals() {
    const squares = document.querySelectorAll('.grid-square');
    squares.forEach((square, index) => {
        square.classList.remove('active', 'solved');
        if (index < currentSquareIndex) {
            square.classList.add('solved');
        } else if (index === currentSquareIndex) {
            square.classList.add('active');
        }
    });
}

// Function to start the game timer
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Function to load the next challenge
function loadChallenge() {
    if (currentSquareIndex >= totalSquares) {
        endGame();
        return;
    }
    const currentChallenge = shuffledChallenges[currentSquareIndex];
    challengeTypeText.textContent = currentChallenge.type;
    challengeText.textContent = currentChallenge.question;
    answerInput.value = '';
    answerInput.focus();
}

// Function to check if the user's answer is correct
function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const currentChallenge = shuffledChallenges[currentSquareIndex];
    
    // Handle answers that can be an array of correct options
    let isCorrect = false;
    if (Array.isArray(currentChallenge.answer)) {
        isCorrect = currentChallenge.answer.includes(userAnswer);
    } else {
        isCorrect = userAnswer === currentChallenge.answer.toLowerCase();
    }

    if (isCorrect) {
        correctSound.play();
        score += currentChallenge.points;
        scoreDisplay.textContent = score;

        // Apply penalties if it's a penalty square
        if (currentChallenge.isPenalty) {
            timeLeft = Math.max(0, timeLeft - currentChallenge.penaltyTime);
            alert(`Correct, but this was a penalty square! ${currentChallenge.penaltyTime} seconds deducted.`);
        } else {
            alert("Correct!");
        }

        currentSquareIndex++;
        updateGridVisuals();
        loadChallenge();
    } else {
        incorrectSound.play();
        alert("Incorrect. Try again!");
    }

    if (currentSquareIndex >= totalSquares) {
        endGame();
    }
}

// Function to end the game and display results
function endGame() {
    clearInterval(timerInterval);

    // Update and sort the leaderboard
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name: teamName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);

    // Truncate to top 10
    leaderboard = leaderboard.slice(0, 10);

    // Find the rank of the current team
    const teamRank = leaderboard.findIndex(team => team.name === teamName);

    // Display the appropriate message
    if (teamRank !== -1 && teamRank < 10) {
        finalMessage.textContent = `Congratulations, ${teamName}! You ranked in the top 10 with a score of ${score}!`;
    } else {
        finalMessage.textContent = `Thank you for participating, ${teamName}! Your final score is ${score}.`;
    }

    // Save the updated leaderboard to localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Hide game elements and show the end screen
    gridContainer.classList.add('hidden');
    document.getElementById('challenge-display').classList.add('hidden');
    gameOverScreen.classList.remove('hidden');

    // Display the leaderboard
    displayLeaderboard();
}

// Function to display the leaderboard
function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = ''; // Clear previous list
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
    leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `#${index + 1}: ${entry.name} - ${entry.score} points`;
        leaderboardList.appendChild(li);
    });

    document.getElementById('leaderboard-container').classList.remove('hidden');
}

// Event listeners
submitButton.addEventListener('click', checkAnswer);

// Start the game by checking for team name
checkAndRegisterTeam();
