function Tile(value) {
    this.value = value;
    this.isMerged = false;
    this.element = null;
}

Tile.prototype.setElement = function (el) {
    this.element = el;
};

Tile.prototype.clearTile = function () {
    this.value = 0;
    this.isMerged = false;
};
