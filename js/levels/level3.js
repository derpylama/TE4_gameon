// Instantiate, func should return [gameGrid, codeGrid, inventoryGrid]
level3 = new Level("level3", () => {
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
    inventoryGrid.setTile(
        1, 0,
        CodeBlockFactory("lava")
    );
    inventoryGrid.setTile(
        1, 1,
        CodeBlockFactory("is")
    );
    inventoryGrid.setTile(
        1, 2,
        CodeBlockFactory("stone")
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
    gameGrid.setTile(4,4, TileFactory("stone"));
    gameGrid.setTile(9,9, TileFactory("beehive"));

    gameGrid.setTile(
        0, 0,
        CodeBlockFactory("game")
    );
    gameGrid.setTile(
        9, 0,
        CodeBlockFactory("meme")
    );


    // Return the grids
    return [gameGrid, codeGrid, inventoryGrid];
});