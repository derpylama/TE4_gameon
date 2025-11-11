class CodeInterpreter {
    constructor(codeGrid) {
        this.codeGrid = codeGrid; // grid with code blocks
    }

    executeAllRows(newCodeGrid,context) { //context is what it needs to interect with the game ex it pretty much always needs the gamegrid to find objects to move/attack  (maybe needs ex "stones and gamegrid" if we say stone-attack-left)
        // Context includes the game grid and anything else (player, world, etc.)
        this.updateCodeGrid(newCodeGrid) // update codegrid
        console.log("Executing all rows in code grid...");
        for (let r = 0; r < this.codeGrid.getGrid().length; r++) {
            const row = this.codeGrid.getRow(r);
            this.executeRow(row, context);
        }
    }

    executeRow(blocks, context) {   //context is what it needs to interect with the game ex it pretty much always needs the gamegrid to find objects to move/attack  (maybe needs ex "stones and gamegrid" if we say stone-attack-left)  might also need ex "player" if we say player-attack-left
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            
            if (block instanceof CodeBlockAction) {
                const left = blocks[i - 1] ?? null;
                const right = blocks[i + 1] ?? null;
                const valid=block.validate([left, right]);
                switch(valid) {
                    case "valid":
                        block.execute(left, right, context);
                        break; //all good
                    case "executed":
                        console.log(`already executed action ${block.value}. Skipping.`);
                        break;
                    case "invalid":
                        console.log(`Invalid blocks for action ${block.value}.`);
                        //overlayer.showOverlayObj(overlayRealityIsWrong);
                        break;
                    default:
                        console.warn(`Unknown validation result '${valid}' for action ${block.value}. Skipping.`);
                        break;
                    
                }
            }
        }
    }
    updateCodeGrid(newCodeGrid) {
        this.codeGrid = newCodeGrid;
    }
}


 /*

//example usage
// Somewhere in game loop or UI handler:
const codegrid = new Grid(5, 5, 32, makeDefaultTile);
const interpreter = new CodeInterpreter(codegrid);

// On "Run" button press:
const context = {
    gameGrid: myGameGrid,     // where the actual world lives
    player: playerObject,
    entities: allEntities,
    level: currentLevel
};

interpreter.executeAllRows(context);

*/

/* 

another example usage


const codeGrid = new Grid(5, 5);
const gameGrid = new Grid(10, 10);
const interpreter = new CodeInterpreter(codeGrid);

interpreter.executeAllRows({
    gameGrid,
    player,
    world
});


*/