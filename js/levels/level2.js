// Instantiate, func should return [gameGrid, codeGrid, inventoryGrid]
level2 = new Level("level2", () => {
    // Get grids
    const [gameGrid, codeGrid, inventoryGrid] = instantiateGrids();


    // Inventory
    inventoryGrid.setTile(
        0, 0,
        new CodeBlockObject(
            "stone",
            {"text": "Stone", "color": "#ffde2c"},
            StoneTile
        )
    );
    inventoryGrid.setTile(
        0, 1,
        new CodeBlockAction(
            "move",
            {"text": "Move", "color": "#ffde2c"},
            ["object", "modifier"]
        )
    );
    inventoryGrid.setTile(
        0, 2,
        new CodeBlockModifier(
            "left",
            {"text": "Left", "color": "#000000"},
        )
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
    gameGrid.setTile(8,9, new DisabledVoidTile_NonVoidAboveBellowLeft());
    gameGrid.setTile(8,8, new LavaTile());
    gameGrid.setTile(9,8, new LavaTile());

    gameGrid.setTile(
        0, 0,
        new CodeBlockAction(
            "is",
            {"text": "Is", "fontSizeOffset": -4, "color": "#ffde2c"},
            ["object", "object"]
        )
    );
    gameGrid.setTile(
        9, 0,
        new CodeBlockObject(
            "stone",
            {"text": "Stone", "color": "#ffde2c"},
            StoneTile
        )
    );
    gameGrid.setTile(
        0, 9,
        new CodeBlockObject(
            "lava",
            {"text": "Lava", "color": "#ffde2c"},
            LavaTile
        )
    );

    gameGrid.setTile(9,9, new BeehiveTile());


    // Return the grids
    return [gameGrid, codeGrid, inventoryGrid];
});