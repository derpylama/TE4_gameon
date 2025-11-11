class CodeInterpreter {
    constructor(codeGrid) {
        this.codeGrid = codeGrid;   // The grid containing code blocks
        this.history = [];          // Array of snapshots (full grid copies)
        this.currentIndex = -1;     // Tracks the current position in history
    }

    // Update the code grid reference
    updateCodeGrid(newCodeGrid) {
        this.codeGrid = newCodeGrid;
    }

    // Execute all rows in the code grid
    executeAllRows(newCodeGrid, context) {
        this.updateCodeGrid(newCodeGrid);

        // Execute each row
        for (let r = 0; r < this.codeGrid.getGrid().length; r++) {
            const row = this.codeGrid.getRow(r);
            this.executeRow(row, context);
        }
    }

    // Execute a single row of code blocks
    executeRow(blocks, context) {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (block instanceof CodeBlockAction) {
                const left = blocks[i - 1] ?? null;
                const right = blocks[i + 1] ?? null;
                const valid = block.validate([left, right]);

                switch (valid) {
                    case "valid":
                        block.execute(left, right, context);
                        this.recordState(context.gameGrid);
                        break;
                    case "missing":
                    case "executed":
                        console.log(`Skipping action ${block.value}.`);
                        break;
                    case "invalid":
                        console.log(`Invalid action ${block.value}.`);
                        overlayer.showOverlayObj(overlayRealityIsWrong);
                        break;
                    default:
                        console.warn(`Unknown validation '${valid}' for ${block.value}`);
                        break;
                }
            }
        }
    }

    initRecordState(gameGrid) {
        // Clear all previous history
        this.history = [];
        this.currentIndex = -1;

        // Record the initial state
        const snapshot = [];

        const grid = gameGrid.getGrid();
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                const tile = grid[r][c];
                if (tile && !(tile instanceof CodeBlock) && !(tile instanceof BeePlayerTile)) {
                    snapshot.push({
                        row: r,
                        col: c,
                        tile: this.cloneTile(tile)
                    });
                }
            }
        }

        this.history.push(snapshot);
        this.currentIndex = 0; // first snapshot is at index 0
    }

    recordState(gameGrid) {
        // Remove future states if we've undone
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        // Sparse snapshot: only store tiles that matter
        const snapshot = [];

        const grid = gameGrid.getGrid();
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                const tile = grid[r][c];
                if (tile && !(tile instanceof CodeBlock) && !(tile instanceof BeePlayerTile)) {
                    snapshot.push({
                        row: r,
                        col: c,
                        tile: this.cloneTile(tile)
                    });
                }
            }
        }

        this.history.push(snapshot);
        this.currentIndex++;
    }

    // Restore from sparse snapshot
    restore(gameGrid, snapshot) {
        // Optional: clear all tiles first, or only overwrite
        gameGrid.clearGrid();

        snapshot.forEach(({ row, col, tile }) => {
            gameGrid.setTile(row, col, this.cloneTile(tile));
        });
    }


    // Clone a tile while preserving its class/prototype
    cloneTile(tile) {
        const copy = Object.create(Object.getPrototypeOf(tile));
        Object.assign(copy, tile);
        if (tile.texture) copy.texture = tile.texture; // reuse texture reference
        return copy;
    }

    // Undo the last execution
    undo(context) {
        if (this.currentIndex <= 0) return;
        this.currentIndex--;
        this.restore(context.gameGrid, this.history[this.currentIndex]);
    }

    // Redo the last undone execution
    redo(context) {
        if (this.currentIndex >= this.history.length - 1) return;
        this.currentIndex++;
        this.restore(context.gameGrid, this.history[this.currentIndex]);
    }
}
