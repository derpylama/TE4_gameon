// Instantiate, func should return [gameGrid, codeGrid, inventoryGrid]
testLevel = new Level("test", () => {
    const gameGrid = new Grid(
        0, 0,   // Position in scrPx
        10, 10, // Rows x Cols
        800/10, // Tile Size, scrPx size of a cell
        null, // Func to generate default tiles, can be set null
        0, 0,   // Gaps in scrPx
        null // Func to generate offsets per tile [txpx, txpx], can be set null
    );
    const inventoryGrid = new Grid(
        846, 32.5,   // Position in scrPx
        4, 4, // Rows x Cols
        800/10, // Tile Size, scrPx size of a cell
        null, // Func to generate default tiles, can be set null
        16, 0,   // Gaps in scrPx
        null // Func to generate offsets per tile [txpx, txpx], can be set null
    );
    const codeGrid = new Grid(
        893, 393,   // Position in scrPx
        5, 4, // Rows x Cols
        800/10, // Tile Size, scrPx size of a cell
        null, // Func to generate default tiles, can be set null
        16, 0,   // Gaps in scrPx
        null // Func to generate offsets per tile [txpx, txpx], can be set null
    );

    return [gameGrid, codeGrid, inventoryGrid];
});