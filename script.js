const gridElement = document.getElementById('gameGrid');
const challengeTextElement = document.getElementById('challengeText');
const answerInputElement = document.getElementById('answerInput');
const submitButton = document.getElementById('submitAnswer');
const feedbackMessageElement = document.getElementById('feedbackMessage');
const timeElapsedElement = document.getElementById('timeElapsed');
const currentScoreElement = document.getElementById('currentScore');
const startGameButton = document.getElementById('startGame');
const gameHeader = document.getElementById('gameHeader');

const gameOverScreen = document.getElementById('gameOverScreen');
const finalMessageElement = document.getElementById('finalMessage');
const finalScoreElement = document.getElementById('finalScore');
const timeTakenElement = document.getElementById('timeTaken');
const teamRankElement = document.getElementById('teamRank');

const leaderboardSection = document.getElementById('leaderboardSection');
const leaderboardTableBody = document.querySelector('#leaderboardTable tbody');

let gridSize = 5;
let currentSquareIndex = 0;
let score = 0;
let timer;
let timeElapsed = 0;
let teamName = '';

// The same challenges array from the previous code
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

function initializeGrid() {
    gridElement.innerHTML = '';
    for (let i = 0; i < challenges.length; i++) {
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
        } else if (index === currentSquareIndex) {
            square.classList.add('current');
            square.textContent = '';
        } else {
            square.textContent = '?';
        }
    });
}

function displayChallenge() {
    if (currentSquareIndex >= challenges.length) {
        endGame();
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

function startStopwatch() {
    timer = setInterval(() => {
        timeElapsed++;
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        timeElapsedElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function startGame() {
    startGameButton.style.display = 'none';
    gameOverScreen.style.display = 'none';
    leaderboardSection.style.display = 'none';
    gridElement.style.display = 'grid';
    gameHeader.style.display = 'flex';
    document.querySelector('.challenge-area').style.display = 'block';

    const promptText = "Enter your team name (2-3 members):";
    let enteredName = prompt(promptText);

    const teamHistory = getTeamHistory();
    const duplicateEntry = teamHistory.find(team => team.teamName.toLowerCase() === enteredName.toLowerCase());

    if (duplicateEntry) {
        // Log a notification for the host in the console
        console.warn(`[DUPLICATE ENTRY ALERT] The team name "${enteredName}" has been used before.`);
        window.alert(`Warning: The team name "${enteredName}" has already been used. A record has been made of this multiple entry.`);
    }

    teamName = enteredName || "Team Alpha";
    document.getElementById('teamName').textContent = teamName;
    
    currentSquareIndex = 0;
    score = 0;
    timeElapsed = 0;
    currentScoreElement.textContent = score;
    timeElapsedElement.textContent = "00:00";
    
    initializeGrid();
    updateGridDisplay();
    displayChallenge();
    startStopwatch();
}

function endGame() {
    clearInterval(timer);
    
    // Hide game elements
    gridElement.style.display = 'none';
    gameHeader.style.display = 'none';
    document.querySelector('.challenge-area').style.display = 'none';

    // Show game over screen
    gameOverScreen.style.display = 'block';
    finalScoreElement.textContent = score;
    timeTakenElement.textContent = `${Math.floor(timeElapsed / 60).toString().padStart(2, '0')}:${(timeElapsed % 60).toString().padStart(2, '0')}`;

    // Save team's result to leaderboard
    saveTeamResult(teamName, score, timeElapsed);

    // Load and display the leaderboard
    const rankedTeams = loadAndDisplayLeaderboard();

    // Determine and display final message and rank
    const myRank = rankedTeams.findIndex(team => team.teamName === teamName && team.score === score && team.completionTime === timeElapsed) + 1;
    teamRankElement.textContent = myRank;

    if (myRank <= 10) {
        finalMessageElement.textContent = "Congratulations!";
    } else {
        finalMessageElement.textContent = "Thank you for participating!";
    }
}

function getTeamHistory() {
    const teams = localStorage.getItem('mysteryGridLeaderboard');
    return teams ? JSON.parse(teams) : [];
}

function saveTeamResult(name, finalScore, finalTime) {
    const teamHistory = getTeamHistory();
    const newEntry = {
        teamName: name,
        score: finalScore,
        completionTime: finalTime,
        date: new Date().toISOString()
    };
    teamHistory.push(newEntry);
    localStorage.setItem('mysteryGridLeaderboard', JSON.stringify(teamHistory));
}

function loadAndDisplayLeaderboard() {
    const teamHistory = getTeamHistory();

    // Sort the teams: by score descending, then by time ascending
    teamHistory.sort((a, b) => {
        if (a.score !== b.score) {
            return b.score - a.score;
        }
        return a.completionTime - b.completionTime;
    });

    leaderboardTableBody.innerHTML = '';
    
    // Display top 10 teams
    const top10Teams = teamHistory.slice(0, 10);
    
    top10Teams.forEach((team, index) => {
        const row = leaderboardTableBody.insertRow();
        const rankCell = row.insertCell(0);
        const teamCell = row.insertCell(1);
        const scoreCell = row.insertCell(2);
        const timeCell = row.insertCell(3);

        rankCell.textContent = index + 1;
        teamCell.textContent = team.teamName;
        scoreCell.textContent = team.score;
        timeCell.textContent = `${Math.floor(team.completionTime / 60).toString().padStart(2, '0')}:${(team.completionTime % 60).toString().padStart(2, '0')}`;
    });
    
    leaderboardSection.style.display = 'block';
    return teamHistory; // Return the full sorted list to determine the team's rank
}

// Event Listeners
startGameButton.addEventListener('click', startGame);
submitButton.addEventListener('click', checkAnswer);
answerInputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

// Initial setup on page load
document.addEventListener('DOMContentLoaded', () => {
    // Hide game elements until start
    gridElement.style.display = 'none';
    gameHeader.style.display = 'none';
    document.querySelector('.challenge-area').style.display = 'none';
    gameOverScreen.style.display = 'none';
    leaderboardSection.style.display = 'none';
});
