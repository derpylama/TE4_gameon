//combtest

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



    // Main handler for when a new block is placed in the code grid hopefully works
    handleNewlyPlacedBlock(block, context) {
        if (!block) return;

        const pos = this.codeGrid.getPosOfObj(block);
        if (!pos) return;

        const [row, col] = pos;
        const neighbors = this.getHexNeighbors(row, col);
        const executed = new Set();

        if (block instanceof CodeBlockAction) {
            //Case 1: placed block IS an action
            this.tryExecuteFromAction(block, row, col, context, executed);
        } else {
            //Case 2: placed block IS NOT an action — check for nearby actions
            for (const { row: nr, col: nc } of neighbors) {
                const neighborTile = this.codeGrid.getTile(nr, nc);
                if (neighborTile instanceof CodeBlockAction) {
                    this.tryExecuteFromAction(neighborTile, nr, nc, context, executed, row, col);
                }
            }
        }
    }


    // Executes all valid directions from an Action block
    tryExecuteFromAction(actionBlock, row, col, context, executed, fromRow = null, fromCol = null) {
        const key = `${row},${col}`;
        if (executed.has(key)) return;
        executed.add(key);

        if (fromRow !== null && fromCol !== null) {
            // Triggered by nearby block
            const opposite = this.getOppositeTile(row, col, fromRow, fromCol);
            const fromIsLeft = this.isLeftOfAction(row, col, fromRow, fromCol);

            let left, right;
            if (fromIsLeft) {
                left = this.codeGrid.getTile(fromRow, fromCol);
                right = opposite ? this.codeGrid.getTile(opposite[0], opposite[1]) : null;
            } else {
                right = this.codeGrid.getTile(fromRow, fromCol);
                left = opposite ? this.codeGrid.getTile(opposite[0], opposite[1]) : null;
            }

            if (left && right) {
                const valid = actionBlock.validate([left, right]);
                if (valid === "valid") {
                    console.log(`Executing ${actionBlock.value} at (${row},${col})`);
                    actionBlock.execute(left, right, context);
                }
            }
        } else {
            // Triggered directly (newly placed action)
            const leftPriority = this.getLeftPriorityNeighbors(row, col);

            for (const { row: nr, col: nc } of leftPriority) {
                const neighbor = this.codeGrid.getTile(nr, nc);
                if (!neighbor) continue;

                const opposite = this.getOppositeTile(row, col, nr, nc);
                if (!opposite) continue;

                const oppositeTile = this.codeGrid.getTile(opposite[0], opposite[1]);
                if (!oppositeTile) continue;

                const valid = actionBlock.validate([neighbor, oppositeTile]);
                if (valid === "valid") {
                    console.log(`Executing ${actionBlock.value} at (${row},${col})`);
                    actionBlock.execute(neighbor, oppositeTile, context);
                }
            }
        }
    }



    // Returns 6 neighboring positions around a hex (depends on row offset)
    getHexNeighbors(row, col) {
        const isOffset = row % 2 !== 0; // odd-row offset
        const deltas = isOffset
            ? [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]] // odd row shifted right
            : [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]; // even row shifted left

        const neighbors = [];
        for (const [dr, dc] of deltas) {
            const nr = row + dr;
            const nc = col + dc;
            if (this.codeGrid.isinsideGrid(nr, nc)) {
                neighbors.push({ row: nr, col: nc });
            }
        }
        return neighbors;
    }


    // Given an action and a neighbor, find the tile opposite that neighbor
    getOppositeTile(actionRow, actionCol, fromRow, fromCol) {
        const dr = actionRow - fromRow;
        const dc = actionCol - fromCol;
        const oppositeRow = actionRow + dr;
        const oppositeCol = actionCol + dc;

        if (this.codeGrid.isinsideGrid(oppositeRow, oppositeCol)) {
            return [oppositeRow, oppositeCol];
        }
        return null;
    }
    isLeftOfAction(actionRow, actionCol, fromRow, fromCol) {
        const isOddRow = actionRow % 2 !== 0;

        // define what "left" means in each row offset style
        const leftOffsets = isOddRow
            ? [[-1, 0], [0, -1], [1, 0]]   // for odd rows: up-left, left, down-left
            : [[-1, -1], [0, -1], [1, -1]]; // for even rows: up-left, left, down-left (shifted)

        for (const [dr, dc] of leftOffsets) {
            if (fromRow === actionRow + dr && fromCol === actionCol + dc) {
                return true;
            }
        }
        return false;
    }

    getLeftPriorityNeighbors(row, col) {
        const isOdd = row % 2 !== 0;
        // define offset order top-left, left, bottom-left
        const order = isOdd
            ? [[-1, 0], [0, -1], [1, 0]]     // odd-row (right-shifted)
            : [[-1, -1], [0, -1], [1, -1]];  // even-row (left-shifted)

        const result = [];
        for (const [dr, dc] of order) {
            const nr = row + dr, nc = col + dc;
            if (this.codeGrid.isinsideGrid(nr, nc)) result.push({ row: nr, col: nc });
        }
        return result;
    }

}
