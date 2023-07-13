class GameManager {
    constructor(size = 4) {
        this.size = size;
        this.board = Array();
        this.numSet = Array();
        this.tileContainer = document.querySelector('.tile-container');
        this.scoreContainer = document.querySelector('.score');
        this.messageContainer = document.querySelector('.game-message');

        this.over = false;
        this.won = false;
        this.keepPlaying = false;
        this.score = 0;

        this.init();
        this.listen();
    }

    init() {
        this.createBoard();
        this.clearBoard();
        this.generateNewNumber();
        this.generateNewNumber();
    }

    createBoard() {
        for (let i = 0; i < this.size * this.size; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile', 'tile-0', `tile-pos-${i}`);
            this.tileContainer.appendChild(tile);
            this.board.push(tile);
        }
    }

    restart() {
        this.clearMessage();
        this.clearBoard();
        this.applyChangedRows();
        this.generateNewNumber();
        this.generateNewNumber();
        this.setup();
        this.actuate();
    }

    setup() {
        this.over = false;
        this.won = false;
        this.score = 0;
    }

    clearBoard() {
        this.numSet = Array(this.size * this.size).fill(0);
    }

    listen() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.move(0);
                    break;
                case 'ArrowRight':
                    this.move(1);
                    break;
                case 'ArrowDown':
                    this.move(2);
                    break;
                case 'ArrowLeft':
                    this.move(3);
                    break;
            }
        });

        this.bindButtonPress('.restart-button', this.restart);
        this.bindButtonPress('.retry-button', this.restart);
        this.bindButtonPress('.keep-playing-button', this.continueGame);
    }

    generateNewNumber() {
        if (!this.cellsAvailable()) return;
        const randomValue = Math.random() < 0.9 ? 2 : 4;
        const randomTileIndex = Math.floor(Math.random() * this.board.length);
        if (this.numSet[randomTileIndex] == 0) {
            this.board[randomTileIndex].textContent = randomValue;
            this.board[randomTileIndex].className = '';
            this.board[randomTileIndex].classList.add(
                'tile',
                `tile-${randomValue}`,
                `tile-pos-${randomTileIndex}`,
                'tile-new',
            );
            this.numSet[randomTileIndex] = randomValue;
        } else this.generateNewNumber();
    }

    move(dir) {
        if (this.isGameTerminated()) return;

        this.moveDir(dir);

        if (!this.movesAvailable()) {
            this.over = true;
        }

        if (this.checkWinCondition()) {
            this.won = true;
            this.message();
        }
        if (this.over) {
            this.message();
            return;
        }
        this.update();
    }

    moveDir(dir) {
        switch (dir) {
            case 0: // up
                this.rotateClockwise(3);
                this.slide();
                this.rotateClockwise(1);
                break;
            case 1: // right
                this.rotateClockwise(2);
                this.slide();
                this.rotateClockwise(2);
                break;
            case 2: // down
                this.rotateClockwise(1);
                this.slide();
                this.rotateClockwise(3);
                break;
            case 3: // left
                this.slide();
                break;
        }
    }

    slide() {
        for (let i = 0; i < this.size * this.size; i += 4) {
            let changedRow = this.slideRowLeft(this.numSet.slice(i, i + 4));
            let combinedRow = this.combineRow(changedRow);
            let result = this.slideRowLeft(combinedRow);
            this.numSet.splice(i, 4, ...result);
        }
    }

    slideRowLeft(row) {
        let filteredTile = row.filter((tile) => tile);
        let numOfEmptyTiles = this.size - filteredTile.length;
        let zeros = Array(numOfEmptyTiles).fill(0);
        return filteredTile.concat(zeros);
    }

    combineRow(row) {
        let merged = 0;
        for (let i = 0; i < this.size; i++) {
            if (row[i] === row[i + 1]) {
                let combinedTotal = row[i] + row[i + 1];
                row[i] = combinedTotal;
                merged += combinedTotal;
                row[i + 1] = 0;
            }
        }
        this.score += merged;
        this.scoreContainer.textContent = this.score;
        this.messageContainer = document.querySelector('.game-message');
        return row;
    }

    rotateClockwise(count) {
        const rotated = Array(this.size * this.size).fill(0);
        const n = this.size;
        for (let k = 0; k < count; k++) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    const newIndex = j * n + (n - i - 1);
                    rotated[newIndex] = this.numSet[i * n + j];
                }
            }
            this.numSet = rotated.slice();
        }
        this.numSet = rotated;
    }

    update() {
        this.applyChangedRows();
        this.generateNewNumber();
    }

    applyChangedRows() {
        for (let i = 0; i < this.size * this.size; i++) {
            let n = this.numSet[i];
            if (n) this.board[i].textContent = n;
            this.board[i].className = '';
            this.board[i].classList.add('tile', `tile-${n}`, `tile-pos-${i}`);
        }
    }

    isGameTerminated() {
        return this.over;
    }

    bindButtonPress(selector, fn) {
        const button = document.querySelector(selector);
        button.addEventListener('click', fn.bind(this));
        button.addEventListener('MSPointerUp', fn.bind(this));
    }

    movesAvailable() {
        return this.cellsAvailable() || this.slideAvailable();
    }

    cellsAvailable() {
        return this.numSet.includes(0);
    }

    slideAvailable() {
        for (let i = 0; i < this.size * this.size; i++) {
            if (this.numSet[i] == 0) return true;
            if (this.hasNeighbor(i)) return true;
        }
        return false;
    }

    hasNeighbor(idx) {
        let adjacent_cells = this.findAdjacentCells(idx);
        let val = this.numSet[idx];
        for (const cell_idx of adjacent_cells) {
            let compared = this.numSet[cell_idx];
            if (compared == val || compared == 0) return true;
        }

        return false;
    }

    findAdjacentCells(idx) {
        let adjacent_cells = [];
        let row = parseInt(idx / this.size);
        let col = idx % this.size;

        if (col > 0) adjacent_cells.push(idx - 1);
        if (col < this.size - 1) adjacent_cells.push(idx + 1);
        if (row > 0) adjacent_cells.push(idx - this.size);
        if (row < this.size - 1) adjacent_cells.push(idx + this.size);
        return adjacent_cells;
    }

    message() {
        let type = this.won ? 'game-won' : 'game-over';
        let message = this.won ? 'You win!' : 'Game over!';
        this.messageContainer.classList.add(type);
        this.messageContainer.getElementsByTagName('p')[0].textContent = message;
    }

    clearMessage() {
        this.messageContainer.classList.remove('game-won');
        this.messageContainer.classList.remove('game-over');
    }

    actuate() {
        this.scoreContainer.textContent = 0;
    }

    checkWinCondition() {
        return !this.won && this.numSet.includes(2048);
    }

    continueGame() {
        this.keepPlaying = true;
        this.clearMessage();
    }
}
