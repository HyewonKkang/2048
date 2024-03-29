function HTMLHandler(score, bestScore) {
    this.tileContainer = document.querySelector('.tile-container');
    this.scoreContainer = document.querySelector('.score');
    this.bestScoreContainer = document.querySelector('.best');
    this.messageContainer = document.querySelector('.game-message');

    this.updateScore({ score, bestScore });
}

HTMLHandler.prototype.createTile = function (pos) {
    const tile = document.createElement('div');
    tile.classList.add('tile', 'tile-0', `tile-pos-${pos}`);
    this.tileContainer.appendChild(tile);
    tile.textContent = 0;
    return tile;
};

HTMLHandler.prototype.updateScore = function (metadata) {
    this.scoreContainer.textContent = metadata.score;
    this.bestScoreContainer.textContent = metadata.bestScore;
};

HTMLHandler.prototype.clearMessage = function () {
    this.messageContainer.classList.remove('game-won');
    this.messageContainer.classList.remove('game-over');
};

HTMLHandler.prototype.resetScore = function () {
    this.scoreContainer.textContent = 0;
};

HTMLHandler.prototype.message = function (won) {
    let type = won ? 'game-won' : 'game-over';
    let message = won ? 'You win!' : 'Game over!';
    this.messageContainer.classList.add(type);
    this.messageContainer.getElementsByTagName('p')[0].textContent = message;
};

HTMLHandler.prototype.setTile = function (tile, val, pos, isNew = false, isMerged = false) {
    tile.textContent = val;
    const classes = ['tile', `tile-${val}`, `tile-pos-${pos}`];
    tile.className = '';
    isNew && classes.push('tile-new');
    isMerged && classes.push('tile-merge');
    tile.classList.add(...classes);
};
