// Instantiate, func should return [gameGrid, codeGrid, inventoryGrid]
level2 = new Level("level2", () => {
    // Get grids
    const [gameGrid, codeGrid, inventoryGrid] = instantiateGrids();


    // Inventory
    inventoryGrid.setTile(
        0, 0,
        CodeBlockFactory("stone")
    );
    inventoryGrid.setTile(
        0, 1,
        CodeBlockFactory("move")
    );
    inventoryGrid.setTile(
        0, 2,
        CodeBlockFactory("left")
    );
    inventoryGrid.setTile(
        0, 3,
        CodeBlockFactory("right")
    );


    // Open up code tiles
    codeGrid.setTile(0,0, null);
    codeGrid.setTile(0,1, null);
    codeGrid.setTile(0,2, null);

    codeGrid.setTile(1,0, null);
    codeGrid.setTile(1,1, null);
    codeGrid.setTile(1,2, null);


    // Add the global player to this levels game grid
    gameGrid.setTile(5,4, playerObj)

    
    // Place level tiles
    gameGrid.setTile(8,9, TileFactory("void_nonvoid_above_bellow_left"));
    gameGrid.setTile(8,8, TileFactory("lava"));
    gameGrid.setTile(9,8, TileFactory("lava"));
    gameGrid.setTile(9,9, TileFactory("beehive"));

    gameGrid.setTile(
        0, 0,
        CodeBlockFactory("is")
    );
    gameGrid.setTile(
        9, 0,
        CodeBlockFactory("stone")
    );
    gameGrid.setTile(
        0, 9,
        CodeBlockFactory("lava")
    );


    // Return the grids
    return [gameGrid, codeGrid, inventoryGrid];
});