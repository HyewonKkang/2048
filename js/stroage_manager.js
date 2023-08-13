function StorageManager() {
    this.bestScoreKey = 'bestScore';
    this.storage = window.localStorage;

    this.initScore();
}

StorageManager.prototype.initScore = function () {
    if (this.storage.getItem(this.bestScoreKey) === null) {
        this.setBestScore(0);
    }
};

StorageManager.prototype.getBestScore = function () {
    return this.storage.getItem(this.bestScoreKey);
};

StorageManager.prototype.setBestScore = function (score) {
    this.storage.setItem(this.bestScoreKey, score);
};
