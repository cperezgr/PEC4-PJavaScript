// Piece class: Represents a piece on the board
// NOTE: This class is already implemented for you. Use it in the Board class.
export class Piece {
    constructor(player, isKing = false) {
        this.player = player; // 'white' or 'black'
        this.isKing = isKing; // boolean
    }

    promote() {
        this.isKing = true;
    }
}

// Exercise 1: GameConfig (1p)
export class GameConfig {
    //Constructor con valores por defecto
    constructor() {
        this.size = 8;
        this.currentPlayer = 'white';
    }

    setSize(newSize) {
        let size = Math.floor(newSize);

        if (size < 4) {
            size = 4;
        } else if (size > 16) {
            size = 16;
        }

        this.size = size;
    }
    getPieceRows() {
        if (this.size < 8) {
            return 2;
        } else if (this.size <= 11) {
            return 3;
        } else {
            return 4;
        }
    }

    initialize() {
        this.currentPlayer = 'white';
    }

    switchPlayer() {
        this.currentPlayer =
            this.currentPlayer === 'white' ? 'black' : 'white';
    }
}

// Exercise 2: Board (1.5p)
export class Board {

    constructor(gameConfig) {
    }

    generate() {
    }

    getPiece(row, col) {
    }

    setPiece(row, col, piece) {
    }

    isEmpty(row, col) {
    }
}

// Exercise 3: GameLogic (3p)
class GameLogic {
    constructor(board, config) {
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
    }

    isValidCapture(fromRow, fromCol, toRow, toCol) {
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
    }

    checkGameOver() {
    }
}

export default GameLogic

// Exercise 4.1: UI (2 points)
export class UI {
    constructor(gameLogic, onRestart) {
    }

    setupSizeInput() {
    }

    setupRestartButton() {
    }

    renderBoard() {
    }

    // Exercise 4.2: UI (1.5 points)
    handleCellClick(row, col) {
    }

    showGameStatus(status) {
    }

    showCurrentPlayer() {
    }
}

// Exercise 5: Game (1 point)
export class Game {
    constructor() {
    }

    start() {
    }
}
