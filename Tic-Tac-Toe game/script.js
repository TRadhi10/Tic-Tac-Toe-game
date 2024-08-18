const board = document.getElementById('board');
const status = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
let currentPlayer = 'X';
let gameActive = true;

// Winning combinations
const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkWinner() {
    const cells = document.querySelectorAll('.cell');
    for (let combo of winningCombination) {
        const [a, b, c] = combo;
        if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
            return cells[a].textContent;
        }
    }
    return [...cells].every(cell => cell.textContent) ? 'Tie' : null;
}

function bestMove() {
    const cells = document.querySelectorAll('.cell');

    // Check if AI can win
    for (let combo of winningCombination) {
        const [a, b, c] = combo;
        if (cells[a].textContent === 'O' && cells[b].textContent === 'O' && !cells[c].textContent) {
            return c;
        }
        if (cells[a].textContent === 'O' && cells[c].textContent === 'O' && !cells[b].textContent) {
            return b;
        }
        if (cells[b].textContent === 'O' && cells[c].textContent === 'O' && !cells[a].textContent) {
            return a;
        }
    }

    // Block player win
    for (let combo of winningCombination) {
        const [a, b, c] = combo;
        if (cells[a].textContent === 'X' && cells[b].textContent === 'X' && !cells[c].textContent) {
            return c;
        }
        if (cells[a].textContent === 'X' && cells[c].textContent === 'X' && !cells[b].textContent) {
            return b;
        }
        if (cells[b].textContent === 'X' && cells[c].textContent === 'X' && !cells[a].textContent) {
            return a;
        }
    }

    // Occasionally make a random move instead of optimal
    if (Math.random() < 0.2) {  // 20% chance to make a random move
        const availableCells = [...cells].map((cell, index) => !cell.textContent ? index : null).filter(index => index !== null);
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    }

    // Take center if available
    if (!cells[4].textContent) {
        return 4;
    }

    // Take a random corner if available
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => !cells[index].textContent);
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take a random available cell
    const availableCells = [...cells].map((cell, index) => !cell.textContent ? index : null).filter(index => index !== null);
    return availableCells[Math.floor(Math.random() * availableCells.length)];
}

function handleClick(event) {
    if (!gameActive || event.target.textContent || currentPlayer === 'O') return;

    event.target.textContent = currentPlayer;
    const winner = checkWinner();

    if (winner) {
        status.textContent = winner === 'Tie' ? 'It\'s a Tie!' : `${winner} Wins!`;
        gameActive = false;
    } else {
        currentPlayer = 'O';
        status.textContent = `Player O's turn`;
        setTimeout(computerMove, 500); // Delay for computer move
    }
}

function computerMove() {
    if (!gameActive || currentPlayer !== 'O') return;

    const cells = document.querySelectorAll('.cell');
    const moveIndex = bestMove();
    cells[moveIndex].textContent = 'O';
    const winner = checkWinner();

    if (winner) {
        status.textContent = winner === 'Tie' ? 'It\'s a Tie!' : `${winner} Wins!`;
        gameActive = false;
    } else {
        currentPlayer = 'X';
        status.textContent = `Player X's turn`;
    }
}

function resetGame() {
    document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
    status.textContent = "Player X's turn";
    currentPlayer = 'X';
    gameActive = true;
}

board.addEventListener('click', handleClick);
resetBtn.addEventListener('click', resetGame);
