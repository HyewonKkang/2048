function Board(size) {
    this.tiles = Array();
    this.size = size;
    this.length = size * size;
    this.mergedScore = 0;

    this.clearBoard();
}

Board.prototype.clearBoard = function () {
    if (this.tiles.length == 0)
        this.tiles = Array.from({ length: this.size * this.size }, () => new Tile(0));
    else
        this.tiles = this.tiles.map((tile) => {
            tile.clearTile();
            return tile;
        });
};

Board.prototype.setTileValue = function (idx, val) {
    this.tiles[idx].value = val;
};

Board.prototype.getTileValue = function (idx) {
    return this.tiles[idx].value;
};

Board.prototype.isTileMerged = function (idx) {
    return this.tiles[idx].isMerged;
};

Board.prototype.addTile = function (idx, tile) {
    this.tiles[idx].setElement(tile);
};

Board.prototype.movesAvailable = function () {
    return this.cellsAvailable() || this.slideAvailable();
};

Board.prototype.cellsAvailable = function () {
    return this.hasCertainNumber(0);
};

Board.prototype.slideAvailable = function () {
    return this.tiles.some((_, i) => this.hasNeighbor(i));
};

Board.prototype.hasNeighbor = function (idx) {
    let adjacent_cells = this.findAdjacentCells(idx);
    let val = this.tiles[idx].value;
    return adjacent_cells.some((cell_idx) => {
        let compared = this.tiles[cell_idx].value;
        return compared === val || compared === 0;
    });
};

Board.prototype.hasCertainNumber = function (n) {
    return this.tiles.some((tile) => tile.value === n);
};

Board.prototype.findAdjacentCells = function (idx) {
    let adjacent_cells = [];
    let row = parseInt(idx / this.size);
    let col = idx % this.size;

    if (col > 0) adjacent_cells.push(idx - 1);
    if (col < this.size - 1) adjacent_cells.push(idx + 1);
    if (row > 0) adjacent_cells.push(idx - this.size);
    if (row < this.size - 1) adjacent_cells.push(idx + this.size);
    return adjacent_cells;
};

Board.prototype.slide = function (values) {
    for (let i = 0; i < this.size * this.size; i += 4) {
        let changedRow = this.slideRowLeft(values.slice(i, i + 4));
        let combinedRow = this.combineRow(changedRow);
        let result = this.slideRowLeft(combinedRow);
        values.splice(i, 4, ...result);
    }
    return values;
};

Board.prototype.slideRowLeft = function (row) {
    let filteredTile = row.filter((tile) => tile);
    let numOfEmptyTiles = this.size - filteredTile.length;
    let zeros = Array.from({ length: numOfEmptyTiles }, () => 0);
    return filteredTile.concat(zeros);
};

Board.prototype.combineRow = function (row) {
    let merged = 0;
    for (let i = 0; i < this.size - 1; i++) {
        if (row[i] === row[i + 1]) {
            let combinedTotal = row[i] + row[i + 1];
            row[i] = combinedTotal;
            merged += combinedTotal;
            row[i + 1] = 0;
            row[i].isMerged = true;
        }
    }
    this.mergedScore = merged;
    return row;
};

Board.prototype.rotateClockwise = function (count, values) {
    const rotated = Array(this.size * this.size).fill(0);
    const n = this.size;
    for (let k = 0; k < count; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const newIndex = j * n + (n - i - 1);
                rotated[newIndex] = values[i * n + j];
            }
        }
        values = rotated.slice();
    }
    values = rotated;
    return values;
};

Board.prototype.getTileValues = function () {
    return this.tiles.map((tile) => tile.value);
};

Board.prototype.setTileValues = function (values) {
    this.tiles.forEach((tile, i) => {
        tile.value = values[i];
    });
};

Board.prototype.getScore = function () {
    return this.mergedScore;
};
