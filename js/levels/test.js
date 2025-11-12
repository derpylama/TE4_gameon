// Instantiate, func should return [gameGrid, codeGrid, inventoryGrid]
testLevel = new Level("test", () => {
    // Get grids
    const [gameGrid, codeGrid, inventoryGrid] = instantiateGrids();


    // Inventory
    inventoryGrid.setTile(
        0, 0,
        CodeBlockFactory("bee")
    );
    inventoryGrid.setTile(
        0, 1,
        CodeBlockFactory("stone")
    );
    inventoryGrid.setTile(
        0, 2,
        CodeBlockFactory("lava")
    );
    inventoryGrid.setTile(
        0, 3,
        CodeBlockFactory("beehive")
    );
    inventoryGrid.setTile(
        0, 4,
        CodeBlockFactory("game")
    );

    // deco_stump D:Stump DecoStumpTile -7
    // deco_trash D:Trash DecoTrashTile -7
    // deco_rock D:Rock DecoRockTile -6
    // deco_rock_alt D:RockAlt DecoRockAltTile -9
    // deco_grass D:Grass DecoGrassTile -7
    // deco_flower_patch D:FlowerPatch DecoFlowerPatchTile -13
    // deco_bush D:Bush DecoBushTile -6
    // deco_flower_bush D:FlowerBush DecoFlowerBushTile -12

    inventoryGrid.setTile(
        1, 0,
        CodeBlockFactory("move")
    );
    inventoryGrid.setTile(
        1, 1,
        CodeBlockFactory("is")
    );
    inventoryGrid.setTile(
        1, 2,
        CodeBlockFactory("left")
    );
    inventoryGrid.setTile(
        1, 3,
        CodeBlockFactory("right")
    );
    inventoryGrid.setTile(
        2, 0,
        CodeBlockFactory("up")
    );
    inventoryGrid.setTile(
        2, 1,
        CodeBlockFactory("down")
    );
    inventoryGrid.setTile(
        2, 2,
        CodeBlockFactory("win")
    );
    inventoryGrid.setTile(
        2, 3,
        CodeBlockFactory("death")
    );
    inventoryGrid.setTile(
        2, 4,
        CodeBlockFactory("meme")
    );
    inventoryGrid.setTile(
        3, 0,
        CodeBlockFactory("safe")
    );
    inventoryGrid.setTile(
        3, 1,
        CodeBlockFactory("walkable")
    );
    inventoryGrid.setTile(
        3, 2,
        CodeBlockFactory("reset")
    );
    inventoryGrid.setTile(
        3, 3,
        CodeBlockFactory("over")
    );

    // won Won # insta win wen game is else is alias to win
    // not_win NotWin -3 # removes isGoal
    // death Death -2
    // safe Safe # removes isDeath
    // solid Solid -2 # removes isWalkable


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
    
    codeGrid.setTile(3,0, null);
    codeGrid.setTile(3,1, null);
    codeGrid.setTile(3,2, null);
    
    codeGrid.setTile(4,0, null);
    codeGrid.setTile(4,1, null);
    codeGrid.setTile(4,2, null);


    // Add the global player to this levels game grid
    gameGrid.setTile(5,4, playerObj)

    
    // Place level tiles
    gameGrid.setTile(8,9, TileFactory("void_nonvoid_above_bellow_left"));
    gameGrid.setTile(8,8, TileFactory("lava"));
    gameGrid.setTile(9,8, TileFactory("lava"));
    gameGrid.setTile(3,3, TileFactory("stone"));
    gameGrid.setTile(5,5, TileFactory("deco_stump"));
    gameGrid.setTile(2,4, TileFactory("deco_rock"));

    gameGrid.setTile(
        9, 0,
        new CodeBlockObject(
            "stone",
            {"text": "Stone", "color": "#ffde2c", "fontSizeOffset": -2},
            StoneTile
        )
    );

    gameGrid.setTile(9,9, new BeehiveTile());


    // Return the grids
    return [gameGrid, codeGrid, inventoryGrid];
});