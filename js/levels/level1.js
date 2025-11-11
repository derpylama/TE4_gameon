// Instantiate, func should return [gameGrid, codeGrid, inventoryGrid]
level1 = new Level("level1", () => {
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

    //MARK: Test codeblocks
    codeBlockEntity1 = new CodeBlockObject("stone", "Stone", StoneTile);
    codeBlockEntity2 = new CodeBlockModifier("left", "Left");
    codeBlockAction1 = new CodeBlockAction("move.to", "MoveTo", ["object", "modifier"]); //also acceps "any"
    codeGrid.setTile(0, 0, codeBlockEntity1);
    codeGrid.setTile(0, 1, codeBlockAction1);
    codeGrid.setTile(0, 2, codeBlockEntity2);

    //MARK: End test codeblocks


    // gameGrid.setTile(5,5, new GameTile(tileLayeredTest)); //MARK: Test

    // gameGrid.setTile(1,4, new GameTile(tileDatadrivenTest)); //MARK: Test
    // gameGrid.setTile(2,4, new GameTile(tileDatadrivenTest)); //
    // gameGrid.setTile(2,3, new GameTile(tileDatadrivenTest)); //
    // gameGrid.setTile(3,3, new GameTile(tileDatadrivenTest)); //

    // gameGrid.setTile(3,3, new BeePlayerTile(tilePlayerBee))

    // gameGrid.setTile(2,3, new BeehiveTile())
    // gameGrid.setTile(4,4, new LavaTile())

    // gameGrid.setTile(3,2, new StoneTile());


    gameGrid.setTile(4,0, playerObj)

    gameGrid.setTile(4,8, new StoneTile());

    gameGrid.setTile(3,9, new VoidTile());
    gameGrid.setTile(5,9, new VoidTile());

    gameGrid.setTile(4,9, new BeehiveTile());

    gameGrid.setTile(3,0, codeBlockEntity1);
    gameGrid.setTile(3,6, codeBlockEntity2);
    gameGrid.setTile(6,5, codeBlockAction1);



    return [gameGrid, codeGrid, inventoryGrid];
});