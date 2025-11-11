

class CodeInterpreter {
    constructor(codeGrid) {
        this.codeGrid = codeGrid; // grid with code blocks
    }

    executeAllRows(context) { //context is what it needs to interect with the game ex it pretty much always needs the gamegrid to find objects to move/attack  (maybe needs ex "stones and gamegrid" if we say stone-attack-left)
        // Context includes the game grid and anything else (player, world, etc.)
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

                if (!block.validate([left, right])) {
                    console.warn(`Invalid syntax near ${block.value}`);
                    continue;
                }

                block.execute(left, right, context);
            }
        }
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