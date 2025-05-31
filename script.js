const board = document.getElementById("board");
const statusText = document.getElementById("status");

const playerXScoreEl = document.getElementById("playerXScore");
const playerOScoreEl = document.getElementById("playerOScore");
const drawScoreEl = document.getElementById("drawScore");

let cells = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; 
let gameActive = true;
let mode = "ai"; // Default mode: AI

// Scores
let playerXScore = 0;
let playerOScore = 0;
let drawScore = 0;

// Mode selection
function changeMode() {
    mode = document.getElementById("mode").value;
    resetGame();
}

// Create the board
function createBoard() {
    board.innerHTML = "";
    cells.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        if (cell !== "") {
            cellDiv.textContent = cell;
            cellDiv.classList.add("taken");
        }
        cellDiv.addEventListener("click", () => makeMove(index));
        board.appendChild(cellDiv);
    });
}

// Handle player move
function makeMove(index) {
    if (!gameActive || cells[index] !== "") return;

    cells[index] = currentPlayer;
    createBoard();

    if (checkWinner()) {
        statusText.textContent = `${currentPlayer} wins!`;
        updateScore(currentPlayer);
        gameActive = false;
        return;
    }

    if (cells.every(cell => cell !== "")) {
        statusText.textContent = "It's a draw!";
        updateScore("Draw");
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (mode === "ai" && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}

// AI Move (Medium Difficulty)
function aiMove() {
    if (!gameActive) return;

    let bestMove = null;

    // 1️⃣ 70% Chance: AI tries to win
    if (Math.random() < 0.7) {
        bestMove = findWinningMove("O");
        if (bestMove !== null) {
            cells[bestMove] = "O";
            createBoard();
            statusText.textContent = "AI wins!";
            updateScore("O");
            gameActive = false;
            return;
        }
    }

    // 2️⃣ 80% Chance: AI blocks the player
    if (Math.random() < 0.8) {
        bestMove = findWinningMove("X");
        if (bestMove !== null) {
            cells[bestMove] = "O";
            createBoard();
            currentPlayer = "X";
            return;
        }
    }

    // 3️⃣ AI prefers center (60% chance)
    if (cells[4] === "" && Math.random() < 0.6) {
        cells[4] = "O";
        createBoard();
        currentPlayer = "X";
        return;
    }

    // 4️⃣ AI chooses a corner (50% chance)
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => cells[i] === "");
    if (availableCorners.length > 0 && Math.random() < 0.5) {
        let randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        cells[randomCorner] = "O";
        createBoard();
        currentPlayer = "X";
        return;
    }

    // 5️⃣ AI picks a random move
    let availableMoves = cells.map((cell, i) => (cell === "" ? i : null)).filter(i => i !== null);
    let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    cells[randomMove] = "O";
    createBoard();
    currentPlayer = "X";
}

// Function to check if a player can win in one move
function findWinningMove(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        let values = [cells[a], cells[b], cells[c]];

        if (values.filter(v => v === player).length === 2 && values.includes("")) {
            return pattern[values.indexOf("")];
        }
    }
    return null;
}

// Check for a winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
    }) ? currentPlayer : null;
}

// Update score
function updateScore(winner) {
    if (winner === "X") {
        playerXScore++;
        playerXScoreEl.textContent = playerXScore;
    } else if (winner === "O") {
        playerOScore++;
        playerOScoreEl.textContent = playerOScore;
    } else {
        drawScore++;
        drawScoreEl.textContent = drawScore;
    }
}

// Reset Game
function resetGame() {
    cells = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = "";
    createBoard();
}

createBoard();
