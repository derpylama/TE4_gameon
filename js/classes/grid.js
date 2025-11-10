class Grid {
    // cellSize is pixels
    constructor(rows, cols, cellSize = 32, defaultTileMaker = null, xGap = 0, yGap = 0) {
        // Initialize a 2D array to represent the grid
        this.grid = [];
        for (let r = 0; r < rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < cols; c++) {
                this.grid[r][c] = defaultTileMaker === null ? null : defaultTileMaker(r,c);
            }
        }

        this.cellSize = cellSize;
        this.xGap = xGap;
        this.yGap = yGap;
    }

    getGaps() {
        return [this.xGap, this.yGap];
    }

    getTileSize() {
        return this.cellSize;
    }

    getPosOfObj(gameObj) {
        // ensure they have the same id attribute
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                const cellObj = this.grid[r][c];
                if (cellObj && cellObj.getId() === gameObj.getId()) {
                    return { "row": r, "col": c };
                }
            }
        }  
    }

    getTile(row, col) {
        return this.grid[row][col];
    }

    // To check the tile one above 0,0 call (0,0, -1, 0)
    // Returns null for OOB
    getRelationalTile(row, col, rowDelta = 0, colDelta = 0) {
        const newRow = row + rowDelta;
        const newCol = col + colDelta;

        // Check bounds
        if (newRow < 0 || newRow >= this.grid.length || newCol < 0 || newCol >= this.grid[0].length) {
            return null; // Out of bounds
        }

        return this.grid[newRow][newCol];
    }

    clearTile(row, col) {
        this.grid[row][col] = null;
    }

    clearRelationalTile(row, col, rowDelta = 0, colDelta = 0) {
        const newRow = row + rowDelta;
        const newCol = col + colDelta;

        // Check bounds
        if (newRow < 0 || newRow >= this.grid.length || newCol < 0 || newCol >= this.grid[0].length) {
            return; // Out of bounds
        }

        this.grid[newRow][newCol] = null;
    }

    setTile(row, col, gameObj) {
        this.grid[row][col] = gameObj;
    }

    setRelationalTile(row, col, rowDelta = 0, colDelta = 0, gameObj) {
        const newRow = row + rowDelta;
        const newCol = col + colDelta;

        // Check bounds
        if (newRow < 0 || newRow >= this.grid.length || newCol < 0 || newCol >= this.grid[0].length) {
            return; // Out of bounds
        }

        this.grid[newRow][newCol] = gameObj;
    }

    clearGrid() {
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                this.grid[r][c] = null;
            }
        }
    }

    getGrid() {
        return this.grid;
    }
}