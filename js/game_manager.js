class GameManager {
    constructor(size = 4) {
        this.size = size;
        this.board = Array();
        this.numSet = Array();
        this.tileContainer = document.querySelector('.tile-container');
        this.over = false;

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
            tile.textContent = 0;
            tile.classList.add('tile');
            tile.classList.add(`tile-pos-${i}`);
            this.tileContainer.appendChild(tile);
            this.board.push(tile);
        }
    }

    restart() {
        this.clearBoard();
        this.generateNewNumber();
        this.generateNewNumber();
        this.applyChangedRows();
    }

    clearBoard() {
        this.numSet = Array(this.size * this.size).fill(0);
    }

    listen() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.slide();
                    this.combineRow();
                    this.slide();
                    this.generateNewNumber();
                    this.applyChangedRows();
                    break;
                case 'ArrowRight':
                    this.rotateClockwise();
                    this.rotateClockwise();
                    this.slide();
                    this.combineRow();
                    this.slide();
                    this.rotateClockwise();
                    this.rotateClockwise();
                    this.generateNewNumber();
                    this.applyChangedRows();
                    break;
                case 'ArrowUp':
                    this.rotateClockwise();
                    this.rotateClockwise();
                    this.rotateClockwise();
                    this.slide();
                    this.combineRow();
                    this.slide();
                    this.rotateClockwise();
                    this.generateNewNumber();
                    this.applyChangedRows();
                    break;
                case 'ArrowDown':
                    this.rotateClockwise();
                    this.slide();
                    this.combineRow();
                    this.slide();
                    this.rotateClockwise();
                    this.rotateClockwise();
                    this.rotateClockwise();
                    this.generateNewNumber();
                    this.applyChangedRows();
                    break;
                default:
                    break;
            }
        });

        this.bindButtonPress('.restart-button', this.restart);
    }

    generateNewNumber() {
        const randomValue = Math.random() < 0.9 ? 2 : 4;
        const randomTileIndex = Math.floor(Math.random() * this.board.length);
        if (this.numSet[randomTileIndex] == 0) {
            this.board[randomTileIndex].innerHTML = randomValue;
            this.numSet[randomTileIndex] = randomValue;
        } else this.generateNewNumber();
    }

    slide() {
        if (this.isGameTerminated()) return;
        for (let i = 0; i < this.size * this.size; i += 4) {
            let changedRow = this.slideRowLeft(this.numSet.slice(i, i + 4));

            this.numSet[i] = changedRow[0];
            this.numSet[i + 1] = changedRow[1];
            this.numSet[i + 2] = changedRow[2];
            this.numSet[i + 3] = changedRow[3];
        }
    }

    slideRowLeft(row) {
        let filteredTile = row.filter((tile) => tile);
        let numOfEmptyTiles = this.size - filteredTile.length;
        let zeros = Array(numOfEmptyTiles).fill(0);
        return filteredTile.concat(zeros);
    }

    combineRow() {
        for (let i = 0; i < this.size * this.size; i++) {
            if (this.numSet[i] === this.numSet[i + 1]) {
                let combinedTotal = this.numSet[i] + this.numSet[i + 1];
                this.numSet[i] = combinedTotal;
                this.numSet[i + 1] = 0;
            }
        }
    }

    rotateClockwise() {
        let tmp = Array(this.size * this.size).fill(0);
        for (let i = 0; i < this.size * this.size; i += 4) {
            tmp[this.size - 1 - i / this.size] = this.numSet[i];
            tmp[this.size - 1 - i / this.size + 4] = this.numSet[i + 1];
            tmp[this.size - 1 - i / this.size + 8] = this.numSet[i + 2];
            tmp[this.size - 1 - i / this.size + 12] = this.numSet[i + 3];
        }
        this.numSet = [...tmp];
    }

    applyChangedRows() {
        for (let i = 0; i < this.size * this.size; i++) {
            this.board[i].innerHTML = this.numSet[i];
        }
    }

    isGameTerminated() {
        return !this.numSet.includes(0) || this.over;
    }

    bindButtonPress(selector, fn) {
        const button = document.querySelector(selector);
        button.addEventListener('click', fn.bind(this));
        button.addEventListener('MSPointerUp', fn.bind(this));
    }
}
