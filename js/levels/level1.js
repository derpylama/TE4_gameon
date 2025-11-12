// Instantiate, func should return [gameGrid, codeGrid, inventoryGrid]
level1 = new Level("level1", () => {
    // Get grids
    const [gameGrid, codeGrid, inventoryGrid] = instantiateGrids();


    // Add the global player to this levels game grid
    gameGrid.setTile(4,0, playerObj)


    // Open up code tiles
    codeGrid.setTile(0,0, null);
    codeGrid.setTile(0,1, null);
    codeGrid.setTile(0,2, null);


    // Place level tiles
    gameGrid.setTile(4,8, TileFactory("stone"));

    gameGrid.setTile(3,9, TileFactory("void_nonvoid_above_bellow_left"));
    gameGrid.setTile(5,9, TileFactory("void_nonvoid_above_bellow_left"));

    gameGrid.setTile(4,9, TileFactory("beehive"));

    gameGrid.setTile(
        3, 0,
        CodeBlockFactory("stone")
    );
    gameGrid.setTile(
        3, 6,
        CodeBlockFactory("left")
    );
    gameGrid.setTile(
        3, 7,
        CodeBlockFactory("right")
    );
    gameGrid.setTile(
        6, 5,
        CodeBlockFactory("move")
    );
    

    // Return the grids
    return [gameGrid, codeGrid, inventoryGrid];
});