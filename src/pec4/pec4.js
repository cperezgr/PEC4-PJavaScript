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
        this.gameConfig = gameConfig;
        this.size = gameConfig.size;

        this.board = Array.from({ length: this.size }, () =>
            Array(this.size).fill(null)
        );
    }

    generate() {
        const rowsWithPieces = this.gameConfig.getPieceRows();

        // Crear tablero vacío
        this.board = Array.from({ length: this.size }, () =>
            Array(this.size).fill(null)
        );

        // Fichas negras (parte superior)
        for (let row = 0; row < rowsWithPieces; row++) {
            for (let col = 0; col < this.size; col++) {
                if ((row + col) % 2 !== 0) {
                    this.board[row][col] = new Piece('black', false);
                }
            }
        }

        // Fichas blancas (parte inferior)
        for (let row = this.size - rowsWithPieces; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if ((row + col) % 2 !== 0) {
                    this.board[row][col] = new Piece('white', false);
                }
            }
        }
    }

    //validación para los límites de filas o columnas
    isOutOfBounds(row, col) {
        return (
            row < 0 ||
            col < 0 ||
            row >= this.size ||
            col >= this.size
        );
    }

    getPiece(row, col) {
        if (this.isOutOfBounds(row, col)) {
            return null;
        }
        return this.board[row][col];
    }

    setPiece(row, col, piece) {
        this.board[row][col] = piece;
    }

    isEmpty(row, col) {
        return this.board[row][col] === null;
    }
}

// Exercise 3: GameLogic (3p)
class GameLogic {
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
