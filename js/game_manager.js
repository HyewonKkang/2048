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
            tile.classList.add('tile', `tile-pos-${i}`);
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
                case 'ArrowUp':
                    this.moveDir(0);
                    break;
                case 'ArrowRight':
                    this.moveDir(1);
                    break;
                case 'ArrowDown':
                    this.moveDir(2);
                    break;
                case 'ArrowLeft':
                    this.moveDir(3);
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
        this.update();
    }

    slide() {
        if (this.isGameTerminated()) return;
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
        for (let i = 0; i < this.size; i++) {
            if (row[i] === row[i + 1]) {
                let combinedTotal = row[i] + row[i + 1];
                row[i] = combinedTotal;
                row[i + 1] = 0;
            }
        }
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
        this.generateNewNumber();
        this.applyChangedRows();
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
