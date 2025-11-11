async function animateLevelReset(interpreter, Grids, playerObj, delay = 500) {
    console.log("Resetting level...");

    const gameGrid = Grids[0];
    const codeGrid = Grids[1];
    const inventoryGrid = Grids[2];

    const codeGridData = codeGrid.getGrid();

    // Move all code blocks to inventory
    for (let r = 0; r < codeGridData.length; r++) {
        for (let c = 0; c < codeGridData[r].length; c++) {
            const tile = codeGridData[r][c];
            if (tile instanceof CodeBlock) {
                const freeSpace = inventoryGrid.getFirstEmptyCell();
                if (!freeSpace) {
                    console.warn("Inventory full! Cannot move more codeblocks.");
                    continue;
                }


                inventoryGrid.setTile(freeSpace[0], freeSpace[1], tile);
                tile.executed = false;
                // Remove tile from codeGrid to avoid duplication
                codeGrid.clearTile(r, c);
            }
        }
    }


    // Save player position
    const playerPos = gameGrid.getPosOfObj(playerObj);

    // Find all code blocks in the grid
    const codeBlockPositions = [];
    const gridData = gameGrid.getGrid();
    for (let r = 0; r < gridData.length; r++) {
        for (let c = 0; c < gridData[r].length; c++) {
            const tile = gridData[r][c];
            if (tile instanceof CodeBlock) {
                codeBlockPositions.push({ row: r, col: c, tile });
            }
        }
    }

    while (interpreter.currentIndex > 0) {
        interpreter.undo({ gameGrid });

        // Ensure player stays
        if (!gameGrid.getTile(playerPos[0], playerPos[1])) {
            gameGrid.setTile(playerPos[0], playerPos[1], playerObj);
        }

        // Ensure code blocks stay
        for (const { row, col, tile } of codeBlockPositions) {
            gameGrid.setTile(row, col, tile);
        }

        // Check if something landed on the player
        const tileAtPlayer = gameGrid.getTile(playerPos[0], playerPos[1]);
        if (tileAtPlayer && !(tileAtPlayer instanceof BeePlayerTile)) {
            triggerGameOver("Crushed, stood where reality reset!");
            break;
        }

        await sleep(delay);
    }

    console.log("Level reset animation complete.");
    return true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
