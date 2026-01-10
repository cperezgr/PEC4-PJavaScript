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
    constructor(board, config) {
        this.board = board;
        this.config = config;
        this.selectedPiece = null;
        this.gameOver = false;
        this.winner = null;
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        if (!((toRow + toCol) % 2 === 1))
            return false;

        const piece = this.board.getPiece(fromRow, fromCol);
        if (!piece) return false;

        if (!this.board.isEmpty(toRow, toCol)) return false;

        const rowDiff = toRow - fromRow;
        const colDiff = Math.abs(toCol - fromCol);

        if (colDiff !== 1) return false;

        if (piece.isKing) {
            return Math.abs(rowDiff) === 1;
        }

        const forward = piece.player === 'white' ? -1 : 1;
        return rowDiff === forward;
    }

    isValidCapture(fromRow, fromCol, toRow, toCol) {
        if (!((toRow + toCol) % 2 === 1))
            return false;

        const piece = this.board.getPiece(fromRow, fromCol);
        if (!piece) return false;

        if (!this.board.isEmpty(toRow, toCol)) return false;

        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;

        if (Math.abs(rowDiff) !== 2 || Math.abs(colDiff) !== 2) return false;

        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;

        const middlePiece = this.board.getPiece(midRow, midCol);
        if (!middlePiece || middlePiece.player === piece.player) return false;

        if (piece.isKing) return true;

        const forward = (piece.player === 'white' ? -1 : 1);
        return rowDiff === 2 * forward;
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        if (this.gameOver) return false;

        const piece = this.board.getPiece(fromRow, fromCol);
        if (!piece) return false;

        if (piece.player !== this.config.currentPlayer) {
            return false;
        }

        const isCapture = this.isValidCapture(fromRow, fromCol, toRow, toCol);
        const isMove = this.isValidMove(fromRow, fromCol, toRow, toCol);

        if (!isCapture && !isMove) return false;

        if (isCapture) {
            const midRow = (fromRow + toRow) / 2;
            const midCol = (fromCol + toCol) / 2;
            this.board.setPiece(midRow, midCol, null);
        }

        this.board.setPiece(toRow, toCol, piece);
        this.board.setPiece(fromRow, fromCol, null);

        // Promoción
        if (!piece.isKing) {
            if (
                (piece.player === 'white' && toRow === 0) ||
                (piece.player === 'black' && toRow === this.board.size - 1)
            ) {
                piece.isKing = true;
            }
        }

        this.config.switchPlayer();
        return true;
    }

    checkGameOver() {

        //Antes de nada reseteo el estado
        this.gameOver = false;
        this.winner = null;

        let whitePieces = 0;
        let blackPieces = 0;

        // Cuento las fichas que hay blancas y negras
        for (let row = 0; row < this.board.size; row++) {
            for (let col = 0; col < this.board.size; col++) {
                const piece = this.board.getPiece(row, col);
                if (piece) {
                    if (piece.player === 'white') whitePieces++;
                    if (piece.player === 'black') blackPieces++;
                }
            }
        }

        // Si uno de los jugadores se queda sin fichas se acaba el juego
        if (whitePieces === 0 && blackPieces > 0) {
            this.gameOver = true;
            this.winner = 'black';
            return;
        }

        if (blackPieces === 0 && whitePieces > 0) {
            this.gameOver = true;
            this.winner = 'white';
            return;
        }

        // Si un jugador se queda sin poder realizar movimientos, se acaba el juego
        const player = this.config.currentPlayer;
        let hasMove = false;

        const directions = [
            [-1, -1], [-1, 1],
            [1, -1], [1, 1],
            [-2, -2], [-2, 2],
            [2, -2], [2, 2]
        ];

        for (let row = 0; row < this.board.size && !hasMove; row++) {
            for (let col = 0; col < this.board.size && !hasMove; col++) {
                const piece = this.board.getPiece(row, col);
                if (piece && piece.player === player) {
                    for (const [dr, dc] of directions) {
                        const tr = row + dr;
                        const tc = col + dc;

                        if (tr < 0 || tr >= this.board.size ||
                            tc < 0 || tc >= this.board.size) {
                            continue;
                        }

                        if (this.isValidMove(row, col, tr, tc) ||
                            this.isValidCapture(row, col, tr, tc)) {
                            hasMove = true;
                            break;
                        }
                    }
                }
            }
        }

        if (!hasMove) {
            this.gameOver = true;
            this.winner = player === 'white' ? 'black' : 'white';
        }
    }
}

export default GameLogic

// Exercise 4.1: UI (2 points)
export class UI {
    constructor(gameLogic, onRestart) {

        this.gameLogic = gameLogic; // instancia de GameLogic pasada por parámetro
        this.gameBoard = document.getElementById('game-board');
        this.onRestart = typeof onRestart === 'function' ? onRestart : () => { };
        this.controlsDiv = null; // se creará en setupSizeInput

        // Inicialización de controles de UI
        this.setupSizeInput();
        this.setupRestartButton();

    }


    setupSizeInput() {

        // Contenedor principal
        const container = document.querySelector('.container');
        if (!container) return; // si no existe, evitamos errores en tests/DOM

        // Crear/reutilizar div de controles
        if (!this.controlsDiv || !document.body.contains(this.controlsDiv)) {
            this.controlsDiv = document.createElement('div');
            this.controlsDiv.classList.add('controls');
            container.appendChild(this.controlsDiv);
        }


        // Si ya existe el input, no se crea un duplicado. 
        const existingInput = document.getElementById('board-size');
        const existingLabel = document.querySelector('label[for="board-size"]');
        if (existingInput) {
            // Si el input existe pero no está bajo controlsDiv, lo movemos
            if (!this.controlsDiv.contains(existingInput)) {
                // Colocar primero el label (si existe) y luego el input
                if (existingLabel && !this.controlsDiv.contains(existingLabel)) {
                    this.controlsDiv.appendChild(existingLabel);
                }
                this.controlsDiv.appendChild(existingInput);
            }
            // Ya está todo, no crear nada más
            return;
        }

        // Label para el input de tamaño
        const label = document.createElement('label');
        label.textContent = 'Board size: ';
        label.htmlFor = 'board-size';

        // Input de tamaño
        const input = document.createElement('input');
        input.id = 'board-size';
        input.type = 'number';
        input.min = '4';
        input.max = '16';
        input.value = '8';

        // Añadir al contenedor de controles
        this.controlsDiv.appendChild(label);
        this.controlsDiv.appendChild(input);

    }

    setupRestartButton() {

        // Me aseguro de que existe el contenedor de controles y que está en el DOM
        if (!this.controlsDiv || !document.body.contains(this.controlsDiv)) {
            this.setupSizeInput();
        }

        // Si ya existe el botón de inicio lo reutilizo; si no, lo creo
        let button = document.getElementById('restart');
        if (!button) {
            button = document.createElement('button');
            button.id = 'restart';
            button.textContent = 'Restart Match';
        }

        // Evento click único (sobrescribe handlers anteriores)
        button.onclick = () => {
            const status = document.getElementById('game-status');
            if (status) status.remove();
            const current = document.getElementById('current-player');
            if (current) current.remove();

            // Ejecutar callback proporcionado
            this.onRestart();
        };

        // Asegurar que el botón está en el contenedor de controles
        if (!this.controlsDiv.contains(button)) {
            this.controlsDiv.appendChild(button);
        }

    }


    renderBoard() {
        //Limpiar tablero
        if (!this.gameBoard) return;
        this.gameBoard.innerHTML = '';

        //Clases del tablero
        this.gameBoard.classList.add('game-board', 'checkerboard');

        const size = this.gameLogic.board.size;

        //Ajustar columnas del grid al tamaño actual del tablero porque al probar el tablero en
        //distintos tamaños al de por defecto, se descuadraban
        this.gameBoard.style.display = 'grid';
        this.gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        this.gameBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        // Si el CSS define un gap, lo puedes mantener o ajustar
        // this.gameBoard.style.gap = '2px'; // si quieres

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');

                // color alterno
                if ((row + col) % 2 === 1) {
                    cell.classList.add('dark');
                } else {
                    cell.classList.add('light');
                }

                // dataset
                cell.dataset.row = String(row);
                cell.dataset.col = String(col);

                // pieza si existe
                const piece = this.gameLogic.board.getPiece(row, col);
                if (piece) {
                    const pieceDiv = document.createElement('div');
                    pieceDiv.classList.add('piece');
                    pieceDiv.classList.add(piece.player === 'white' ? 'white' : 'black');
                    if (piece.isKing) pieceDiv.classList.add('king');
                    cell.appendChild(pieceDiv);
                }

                // seleccionado
                if (
                    this.gameLogic.selectedPiece &&
                    this.gameLogic.selectedPiece.row === row &&
                    this.gameLogic.selectedPiece.col === col
                ) {
                    cell.classList.add('selected');
                }

                // manejador de click (se implementará en 4.2)
                cell.addEventListener('click', () => this.handleCellClick(row, col));

                this.gameBoard.appendChild(cell);
            }
        }

        // Mostrar jugador actual (se implementará en 4.2)
        this.showCurrentPlayer();
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
