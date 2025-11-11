class Grid {
    // Rows and Cols are in number of cells
    // cellSize is in scrPx
    // defaultTileMaker is a function that takes (row, col) and returns a GameObject to fill the cell with, or null for empty when initing
    // xGap and yGap are in scrPx
    // offsetMaker is a function that takes (row, col) and returns [xOffset, yOffset] both in txpx
    constructor(x, y, rows, cols, cellSize = 32, defaultTileMaker = null, xGap = 0, yGap = 0, offsetMaker = null) {
        // Initialize a 2D array to represent the grid
        this.grid = [];
        for (let r = 0; r < rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < cols; c++) {
                this.grid[r][c] = defaultTileMaker === null ? null : defaultTileMaker(r,c);
            }
        }
        this.defaultTileMaker = defaultTileMaker;

        this.cellSize = cellSize;
        this.xGap = xGap;
        this.yGap = yGap;
        this.offsetMaker = offsetMaker;
        this.x = x;
        this.y = y;
    }

    // Getter for [x, y] position of the grid in scrPx
    getPos() {
        return [this.x, this.y];
    }

    // Getter for [xGap, yGap] both in scrPx
    getGaps() {
        return [this.xGap, this.yGap];
    }

    // Getter for offset [xOffset, yOffset] both in txpx
    getOffset(row, col) {
        if (this.offsetMaker) {
            return this.offsetMaker(row, col);
        } else {
            return [0, 0];
        }
    }

    // Getter for tile size in scrPx
    getTileSize() {
        return this.cellSize;
    }

    // Get the [row, col] of a game object in the grid or null if not found
    getPosOfObj(gameObj) {
        // ensure they have the same id attribute
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                const cellObj = this.grid[r][c];
                if (cellObj && cellObj.getId() === gameObj.getId()) {
                    return [r, c];
                }
            }
        }

        return null;
    }

    // Get the tile at (row, col) or null for OOB or empty
    // If the tile is out of bounds return false
    getTile(row, col) {
        // Check bounds
        if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length) {
            return false; // Out of bounds
        }

        return this.grid[row][col];
    }

    // Gets the tile at a relative position, returns null for OOB or empty
    // To check the tile one above 0,0 call (0,0, -1, 0)
    // If the tile is out of bounds return false
    getRelationalTile(row, col, rowDelta = 0, colDelta = 0) {
        const newRow = row + rowDelta;
        const newCol = col + colDelta;

        
        // Check bounds
        if (newRow < 0 || newRow >= this.grid.length || newCol < 0 || newCol >= this.grid[0].length) {
            return false; // Out of bounds
        }
        
        return this.getTile(newRow, newCol);
    }

    // Clears the tile at (row, col) returning true if successful, false if OOB
    // If the tile is out of bounds return false
    clearTile(row, col) {
        // Check bounds
        if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length) {
            return false; // Out of bounds
        }

        this.grid[row][col] = null;

        return true;
    }

    // Clears the tile at a relative position, returns false if OOB else true
    // To clear the tile one above 0,0 call (0,0, -1, 0)
    clearRelationalTile(row, col, rowDelta = 0, colDelta = 0) {
        const newRow = row + rowDelta;
        const newCol = col + colDelta;

        // Check bounds
        if (newRow < 0 || newRow >= this.grid.length || newCol < 0 || newCol >= this.grid[0].length) {
            return false; // Out of bounds
        }

        this.grid[newRow][newCol] = null;

        return true;
    }

    // Overwrites the tile at (row, col) with gameObj
    setTile(row, col, gameObj) {
        this.grid[row][col] = gameObj;
    }

    // Overwrites the tile at a relative position
    // returns false if the position is out of bounds
    // To set the tile one above 0,0 call (0,0, -1, 0)
    setRelationalTile(row, col, rowDelta = 0, colDelta = 0, gameObj) {
        const newRow = row + rowDelta;
        const newCol = col + colDelta;

        // Check bounds
        if (newRow < 0 || newRow >= this.grid.length || newCol < 0 || newCol >= this.grid[0].length) {
            return false; // Out of bounds
        }


        this.grid[newRow][newCol] = gameObj;
    }

    // Clears the entire grid, filling with default tiles or null
    clearGrid() {
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                this.grid[r][c] = this.defaultTileMaker === null ? null : this.defaultTileMaker(r,c);
            }
        }
    }

    getFirstEmptyCell() {
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                if (this.grid[r][c] == null) {
                    return [r, c]
                }
            }
        }
    }

    gridContains(obj) {
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[r].length; c++) {
                if (this.grid[r][c] == obj) {
                    return true;
                }
            }
        }
        return false;
    }

    // Getter for the entire grid as 2D array
    getGrid() {
        return this.grid;
    }

    getRow(row) { //test for validator might change later
        if (row < 0 || row >= this.grid.length) {
            return null; // or null, if you prefer signaling an invalid row
        }
        return [...this.grid[row]];
    }
}