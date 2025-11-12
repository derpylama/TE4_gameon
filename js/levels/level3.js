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

    codeGrid.setTile(2,0, null);
    codeGrid.setTile(2,1, null);
    codeGrid.setTile(2,2, null);


    // Add the global player to this levels game grid
    gameGrid.setTile(0,2, playerObj)

    
    // Place level tiles
    gameGrid.setTile(0,3, TileFactory("deco_stump"));
    gameGrid.setTile(1,2, TileFactory("deco_stump"));
    gameGrid.setTile(0,1, TileFactory("stone"));

    gameGrid.setTile(8,8, TileFactory("deco_stump"));
    gameGrid.setTile(8,9, TileFactory("deco_stump"));
    gameGrid.setTile(9,8, TileFactory("deco_stump"));
    gameGrid.setTile(9,9, TileFactory("beehive"));

    gameGrid.setTile(0,8, TileFactory("deco_stump"));
    gameGrid.setTile(1,8, TileFactory("deco_stump"));
    gameGrid.setTile(1,9, TileFactory("lava"));

    gameGrid.setTile(4,7, CodeBlockFactory("deco_stump"));

    gameGrid.setTile(0,9, CodeBlockFactory("up"));

    gameGrid.setTile(5,7, CodeBlockFactory("walkable"));

    gameGrid.setTile(9,0, CodeBlockFactory("move"));


    // Return the grids
    return [gameGrid, codeGrid, inventoryGrid];
});