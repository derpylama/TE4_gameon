// Returns a ready made tile with default options
function CodeBlockFactory(value) {
    switch (value) {
        case "bee":
            return new CodeBlockObject(
                "bee",
                {"text": "Bee", "color": "#ffde2c"},
                BeePlayerTile
            );

        case "stone":
            return new CodeBlockObject(
                "stone",
                {"text": "Stone", "color": "#ffde2c", "fontSizeOffset": -2},
                StoneTile
            );

        case "lava":
            return new CodeBlockObject(
                "lava",
                {"text": "Lava", "color": "#ffde2c"},
                LavaTile
            );

        case "beehive":
            return new CodeBlockObject(
                "beehive",
                {"text": "BeeHive", "color": "#ffde2c", "fontSizeOffset": -6},
                BeehiveTile
            );

        case "game":
            return new CodeBlockObject(
                "game",
                {"text": "Game", "color": "#ffde2c"},
                null
            );

        case "deco_stump":
            return new CodeBlockObject(
                "deco_stump",
                {"text": "D:Stump", "color": "#8B4513", "fontSizeOffset": -7},
                DecoStumpTile
            );
        
        case "deco_trash":
            return new CodeBlockObject(
                "deco_trash",
                {"text": "D:Trash", "color": "#808080", "fontSizeOffset": -7},
                DecoTrashTile
            );

        case "deco_rock":
            return new CodeBlockObject(
                "deco_rock",
                {"text": "D:Rock", "color": "#A9A9A9", "fontSizeOffset": -6},
                DecoRockTile
            );

        case "deco_rock_alt":
            return new CodeBlockObject(
                "deco_rock_alt",
                {"text": "D:RockAlt", "color": "#696969", "fontSizeOffset": -9},
                DecoRockAltTile
            );

        case "deco_grass":
            return new CodeBlockObject(
                "deco_grass",
                {"text": "D:Grass", "color": "#228B22", "fontSizeOffset": -7},
                DecoGrassTile
            );

        case "deco_flower_patch":
            return new CodeBlockObject(
                "deco_flower_patch",
                {"text": "D:FlowerPatch", "color": "#FF69B4", "fontSizeOffset": -13},
                DecoFlowerPatchTile
            );
        
        case "deco_bush":
            return new CodeBlockObject(
                "deco_bush",
                {"text": "D:Bush", "color": "#006400", "fontSizeOffset": -6},
                DecoBushTile
            );
        
        case "deco_flower_bush":
            return new CodeBlockObject(
                "deco_flower_bush",
                {"text": "D:FlowerBush", "color": "#FF1493", "fontSizeOffset": -12},
                DecoFlowerBushTile
            );

        case "move":
            return new CodeBlockAction(
                "move",
                {"text": "Move", "color": "#ffde2c"},
                ["object", "move_modifier"]
            );

        case "is":
            return new CodeBlockAction(
                "is",
                {"text": "Is", "fontSizeOffset": -4, "color": "#ffde2c"},
                ["object", "any"]
            );

        case "left":
            return new CodeBlockMoveModifier(
                "left",
                {"text": "Left", "color": "#000000"},
            );

        case "right":
            return new CodeBlockMoveModifier(
                "right",
                {"text": "Right", "color": "#000000"},
            );

        case "up":
            return new CodeBlockMoveModifier(
                "up",
                {"text": "Up", "color": "#000000"},
            );
        
        case "down":
            return new CodeBlockMoveModifier(
                "down",
                {"text": "Down", "color": "#000000"},
            );

        case "win":
            return new CodeBlockMoveModifier(
                "win",
                {"text": "Win", "color": "#000000"},
            );

        case "death":
            return new CodeBlockMoveModifier(
                "death",
                {"text": "Death", "color": "#000000"},
            );

        case "meme":
            return new CodeBlockModifier(
                "meme",
                {"text": "Meme", "color": "#000000"},
            );
        
        case "safe":
            return new CodeBlockModifier(
                "safe",
                {"text": "Safe", "color": "#000000"},
            );

        case "walkable":
            return new CodeBlockModifier(
                "walkable",
                {"text": "Walkable", "color": "#000000", "fontSizeOffset": -6},
            );

        case "reset":
            return new CodeBlockModifier(
                "reset",
                {"text": "Reset", "color": "#000000", "fontSizeOffset": -2},
            );

        case "over":
            return new CodeBlockModifier(
                "over",
                {"text": "Over", "color": "#000000"},
            );

        case "won":
            return new CodeBlockModifier(
                "won",
                {"text": "Won", "color": "#000000"},
            );

        case "not_win":
            return new CodeBlockModifier(
                "not_win",
                {"text": "NotWin", "color": "#000000", "fontSizeOffset": -3},
            );

        case "safe":
            return new CodeBlockModifier(
                "safe",
                {"text": "Safe", "color": "#000000"},
            );

        case "solid":
            return new CodeBlockModifier(
                "solid",
                {"text": "Solid", "color": "#000000", "fontSizeOffset": -2},
            );

        default:
            console.error(`CodeBlockFactory: Unknown code block value '${value}'`);
            return null;
    }
}

function TileFactory(tile) {
    switch (tile) {
        case "void":
            return new DisabledVoidTile_NonVoidAbove();
        
        case "void_nonvoid_above":
            return new DisabledVoidTile_NonVoidAbove();
        
        case "void_nonvoid_above_bellow_left":
            return new DisabledVoidTile_NonVoidAboveBellowLeft();
        
        case "bee_player":
            return new BeePlayerTile();
        
        case "beehive":
            return new BeehiveTile();
        
        case "lava":
            return new LavaTile();
        
        case "stone":
            return new StoneTile();
        
        case "deco_stump":
            return new DecoStumpTile();
        
        case "deco_trash":
            return new DecoTrashTile();
        
        case "deco_rock":
            return new DecoRockTile();
        
        case "deco_rock_alt":
            return new DecoRockAltTile();
        
        case "deco_grass":
            return new DecoGrassTile();
        
        case "deco_flower_patch":
            return new DecoFlowerPatchTile();
        
        case "deco_bush":
            return new DecoBushTile();

        case "deco_flower_bush":
            return new DecoFlowerBushTile();
    }
}