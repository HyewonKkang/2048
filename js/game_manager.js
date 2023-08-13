function GameManager(size = 4, InputManager, HTMLHandler, StorageManager) {
    this.size = size;
    this.board = new Board(size);
    this.over = false;
    this.won = false;
    this.keepPlaying = false;
    this.score = 0;

    this.inputManager = new InputManager();
    this.storageManager = new StorageManager();
    this.htmlHandler = new HTMLHandler(this.score, this.storageManager.getBestScore());

    this.inputManager.on('move', this.move.bind(this));
    this.inputManager.on('restart', this.restart.bind(this));
    this.inputManager.on('keepPlaying', this.continueGame.bind(this));

    this.init();
}

GameManager.prototype.init = function () {
    this.board.clearBoard();
    this.createBoard();
    this.generateNewNumber();
    this.generateNewNumber();
};

GameManager.prototype.createBoard = function () {
    for (let i = 0; i < this.size * this.size; i++) {
        const tile = this.htmlHandler.createTile(i);
        this.board.addTile(i, tile);
    }
};

GameManager.prototype.restart = function () {
    this.htmlHandler.clearMessage();
    this.board.clearBoard();
    this.applyChangedRows();
    this.generateNewNumber();
    this.generateNewNumber();
    this.setup();
};

GameManager.prototype.setup = function () {
    this.over = false;
    this.won = false;
    this.score = 0;
    this.htmlHandler.resetScore();
};

GameManager.prototype.generateNewNumber = function () {
    if (!this.board.cellsAvailable()) return;
    const randomValue = Math.random() < 0.9 ? 2 : 4;
    const randomTileIndex = Math.floor(Math.random() * this.board.length);
    if (this.board.getTileValue(randomTileIndex) == 0) {
        this.htmlHandler.setTile(
            this.board.tiles[randomTileIndex].element,
            randomValue,
            randomTileIndex,
            true,
        );
        this.board.setTileValue(randomTileIndex, randomValue);
    } else this.generateNewNumber();
};

GameManager.prototype.move = function (dir) {
    if (this.isGameTerminated()) return;

    this.moveDir(dir);
    this.calcScore();
    this.updateStorageScore();
    this.htmlHandler.updateScore({
        score: this.score,
        bestScore: this.storageManager.getBestScore(),
    });

    if (!this.board.movesAvailable()) {
        this.over = true;
        this.htmlHandler.message(false);
        this.inputManager.preventEvents();
        return;
    }

    if (this.checkWinCondition()) {
        this.won = true;
        this.htmlHandler.message(true);
        this.inputManager.preventEvents();
    }

    this.update();
};

GameManager.prototype.calcScore = function () {
    this.score += this.board.getScore();
};

GameManager.prototype.moveDir = function (dir) {
    this.board.setup();
    let tileValues = this.board.getTileValues();
    switch (dir) {
        case 0: // up
            tileValues = pipe(
                this.rotate.bind(this, 3),
                this.slide.bind(this),
                this.rotate.bind(this, 1),
            )(tileValues);
            break;
        case 1: // right
            tileValues = pipe(
                this.rotate.bind(this, 2),
                this.slide.bind(this),
                this.rotate.bind(this, 2),
            )(tileValues);
            break;
        case 2: // down
            tileValues = pipe(
                this.rotate.bind(this, 1),
                this.slide.bind(this),
                this.rotate.bind(this, 3),
            )(tileValues);
            break;
        case 3: // left
            tileValues = this.board.slide(tileValues);
            break;
    }
    this.board.setTileValues(tileValues);
};

GameManager.prototype.rotate = function (count, values) {
    return this.board.rotateClockwise(count, values);
};

GameManager.prototype.slide = function (values) {
    return this.board.slide(values);
};

GameManager.prototype.update = function () {
    this.applyChangedRows();
    this.generateNewNumber();
};

GameManager.prototype.applyChangedRows = function () {
    for (let i = 0; i < this.size * this.size; i++) {
        let n = this.board.getTileValue(i);
        this.htmlHandler.setTile(
            this.board.tiles[i].element,
            n,
            i,
            false,
            this.board.isTileMerged(i) ? true : false,
        );
    }
};

GameManager.prototype.updateStorageScore = function () {
    if (this.storageManager.getBestScore() < this.score) {
        this.storageManager.setBestScore(this.score);
    }
};

GameManager.prototype.isGameTerminated = function () {
    return this.over;
};

GameManager.prototype.checkWinCondition = function () {
    return !this.won && this.board.hasCertainNumber(2048);
};

GameManager.prototype.continueGame = function () {
    this.keepPlaying = true;
    this.htmlHandler.clearMessage();
};
