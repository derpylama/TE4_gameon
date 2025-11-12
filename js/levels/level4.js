// Instantiate, func should return [gameGrid, codeGrid, inventoryGrid]
level4 = new Level("level4", () => {
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
    inventoryGrid.setTile(
        1, 3,
        CodeBlockFactory("game")
    );
    inventoryGrid.setTile(
        2, 0,
        CodeBlockFactory("meme")
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

    // Return the grids
    return [gameGrid, codeGrid, inventoryGrid];
});