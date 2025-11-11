// Instantiate, func should return [gameGrid, codeGrid, inventoryGrid]
level2 = new Level("level2", () => {
    let hexagonOffsetMakerRight = (row, _) => {
        rowOffset = (row % 2 === 0 ? 0 : ((800/10)/2) + 8);
        return [rowOffset, (-7*row)+(-1*row)];
    };
    let hexagonOffsetMakerLeft = (row, _) => {
        rowOffset = (row % 2 === 0 ? 0 : -((800/10)/2) - 8);
        return [rowOffset, (-7*row)+(-1*row)];
    };

    // let generateVoids = (row, col) => {
    //     return (row === 0 ? new DisabledVoidTile_NonVoidAbove(tileNonVoidAbove) : new DisabledVoidTile(tileVoid));
    // };

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
        hexagonOffsetMakerRight // Func to generate offsets per tile [txpx, txpx], can be set null
    );
    const codeGrid = new Grid(
        893, 393,   // Position in scrPx
        5, 4, // Rows x Cols
        800/10, // Tile Size, scrPx size of a cell
        null, // Func to generate default tiles, can be set null
        16, 0,   // Gaps in scrPx
        hexagonOffsetMakerLeft // Func to generate offsets per tile [txpx, txpx], can be set null
    );


    codeBlockEntity1 = new CodeBlockObject(
        "stone",
        {"text": "Stone", "color": "#ffde2c"},
        StoneTile
    );
    codeBlockEntity2 = new CodeBlockModifier(
        "left",
        {"text": "Left", "color": "#000000"},
    );
    codeBlockAction1 = new CodeBlockAction(
        "move.to",
        {"text": "MoveTo", "fontSizeOffset": -4, "color": "#ffde2c"},
        ["object", "modifier"]
    );
    codeBlockAction2 = new CodeBlockAction(
        "is",
        {"text": "Is", "fontSizeOffset": -4, "color": "#ffde2c"},
        ["object", "object"]
    );
    codeBlockEntity3 = new CodeBlockObject(
        "lava",
        {"text": "Lava", "color": "#ffde2c"},
        ["object", "object"]
    );
    

    inventoryGrid.setTile(0, 0, codeBlockEntity1);
    inventoryGrid.setTile(0, 1, codeBlockAction1);
    inventoryGrid.setTile(0, 2, codeBlockEntity2);

    gameGrid.setTile(5,4, playerObj)

    gameGrid.setTile(8,9, new DisabledVoidTile_NonVoidAbove());
    gameGrid.setTile(8,8, new LavaTile());
    gameGrid.setTile(9,8, new LavaTile());

    gameGrid.setTile(0, 0, codeBlockAction2);
    gameGrid.setTile(9, 0, codeBlockEntity1);
    gameGrid.setTile(0, 9, codeBlockEntity3);

    gameGrid.setTile(9,9, new BeehiveTile());

    return [gameGrid, codeGrid, inventoryGrid];
});