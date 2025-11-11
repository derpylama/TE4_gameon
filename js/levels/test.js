// Instantiate, func should return [gameGrid, codeGrid, inventoryGrid]
testLevel = new Level("test", () => {
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
            ["object", "move_modifier"]
        )
    );
    inventoryGrid.setTile(
        0, 2,
        new CodeBlockMoveModifier(
            "left",
            {"text": "Left", "color": "#000000"},
        )
    );
    inventoryGrid.setTile(
        0, 3,
        new CodeBlockMoveModifier(
            "right",
            {"text": "Right", "color": "#000000"},
        )
    );
    inventoryGrid.setTile(
        1, 0,
        new CodeBlockModifier(
            "meme",
            {"text": "Meme", "color": "#000000"},
        )
    );
    inventoryGrid.setTile(
        1, 1,
        new CodeBlockObject(
            "game",
            {"text": "Game"},
        )
    );
    inventoryGrid.setTile(
        1, 2,
        new CodeBlockStateModifier(
            "reset",
            {"text": "Reset", "color": "#000000"},
        )
    );
    inventoryGrid.setTile(
        1, 3,
        new CodeBlockStateModifier(
            "over",
            {"text": "Over", "color": "#000000"},
        )
    );
    inventoryGrid.setTile(
        2, 0,
        new CodeBlockStateModifier(
            "won",
            {"text": "Won", "color": "#000000"},
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
    gameGrid.setTile(3,3, new StoneTile());

    gameGrid.setTile(
        0, 0,
        new CodeBlockAction(
            "is",
            {"text": "Is", "fontSizeOffset": -4, "color": "#ffde2c"},
            ["object", "any"]
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