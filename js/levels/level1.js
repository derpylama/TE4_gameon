// Instantiate, func should return [gameGrid, codeGrid, inventoryGrid]
level1 = new Level("level1", () => {
    // Get grids
    const [gameGrid, codeGrid, inventoryGrid] = instantiateGrids();


    // Add the global player to this levels game grid
    gameGrid.setTile(4,0, playerObj)

    
    // Place level tiles
    gameGrid.setTile(4,8, new StoneTile());

    gameGrid.setTile(3,9, new DisabledVoidTile_NonVoidAboveBellowLeft());
    gameGrid.setTile(5,9, new DisabledVoidTile_NonVoidAboveBellowLeft());

    gameGrid.setTile(4,9, new BeehiveTile());

    gameGrid.setTile(
        3, 0,
        new CodeBlockObject(
            "stone",
            {"text": "Stone", "color": "#ffde2c"},
            StoneTile
        )
    );
    gameGrid.setTile(
        3, 6,
        new CodeBlockModifier(
            "left",
            {"text": "Left", "color": "#000000"},
        )
    );
    gameGrid.setTile(
        6, 5,
        new CodeBlockAction(
            "move.to",
            {"text": "MoveTo", "fontSizeOffset": -4, "color": "#ffde2c"},
            ["object", "modifier"]
        )
    );
    

    // Return the grids
    return [gameGrid, codeGrid, inventoryGrid];
});