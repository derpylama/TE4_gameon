class CodeBlock extends GameObject {
    constructor(texture, value, text) {
        super(texture);
        this.text = text || "";
        this.value = value;

        this.selected = false;
    }

    select() {
        this.selected = true;
    }

    deselect() {
        this.selected = false;
    }

    isSelected() {
        return this.selected;
    }
}

class CodeBlockEntity extends CodeBlock {
    constructor(texture, value, text) {
        super(texture, value, text);
    }
}


class CodeBlockObject extends CodeBlockEntity {
    constructor(value, text, linkedClass) {
        super(tileCodeblockObject, value, text);
        this.linkedClass = linkedClass;
    }
}

class CodeBlockModifier extends CodeBlockEntity {
    constructor(value, text) {
        super(tileCodeblockModifier, value, text);
    }
}

class CodeBlockStateModifier extends CodeBlockModifier {
    constructor(value, text) {
        super(value, text);
    }
}

class CodeBlockMoveModifier extends CodeBlockModifier {
    constructor(value, text) {
        super(value, text);
    }
}



class CodeBlockAction extends CodeBlock {
    constructor(value, text, adjacentCodeBlocksCanBe = ["any", "any"]) {
        super(tileCodeblockAction, value, text);
        this.adjacentCodeBlocksCanBe = adjacentCodeBlocksCanBe; // e.g., ["object", "modifier"]   what left and rigth codeblocks can be 
        this.executed = false; //maybe change executed
    }

    validate(adjacentBlocks) {
        if(this.executed){
            return "executed"; //already executed
        }
        if (adjacentBlocks.length !== 2 || adjacentBlocks.includes(null)) {
            console.log("CodeBlockAction validation requires exactly two adjacent blocks.");
            return "missing";
        }

        const [left, right] = adjacentBlocks;

        // helper function to check one side
        const isValid = (block, expectedType) => {
            if (expectedType === "any") {
                return block instanceof CodeBlockEntity;
            }
            if (expectedType === "object") {
                return block instanceof CodeBlockObject;
            }
            if (expectedType === "modifier") {
                return block instanceof CodeBlockModifier;
            }
            if (expectedType === "state_modifier") {
                return block instanceof CodeBlockStateModifier;
            }
            if (expectedType === "move_modifier") {
                return block instanceof CodeBlockMoveModifier;
            }
            console.warn("Unknown expected type in CodeBlockAction validation:", expectedType);
            return false; // unknown type keyword
        };

        const [leftType, rightType] = this.adjacentCodeBlocksCanBe;
        if (isValid(left, leftType) && isValid(right, rightType)) {
            return "valid";
        }
        else{
            return "invalid";
        }
    }

    execute(left, right, context) {
        const handler = ActionRegistry[this.value];
        if (handler) {
            const result = handler(left, right, context);
            if (result === false) {
                console.warn(`Action '${this.value}' failed during execution.`);
            }
            this.executed=true;
        } else {
            console.warn(`No action handler registered for '${this.value}'`);
        }
    }
    isexecuted(){
        return this.executed;
    }
}

//left is the codeblock on the left of the action block   
//right is the one on the right
//context is what it needs to interect with the game ex it pretty much always needs the gamegrid to find objects to move/attack  (maybe needs ex "stones and gamegrid" if we say stone-attack-left)
const ActionRegistry = {  
    "move": (left, right, context) => {
        const gridData = context.gameGrid.getGrid();

        for (let r = 0; r < gridData.length; r++) {
            for (let c = 0; c < gridData[r].length; c++) {
                const block = gridData[r][c];

                let validBlock = false;
                try {
                    validBlock = block instanceof left.linkedClass;
                } catch (e) {}

                if (block && validBlock) {

                    let deltas = [0,0]

                    switch(right.value) {
                        case "up":
                            deltas = [-1,0];
                            break;
                        case "down":
                            deltas = [1,0];
                            break;
                        case "left":
                            deltas = [0,-1];
                            break;
                        case "right":
                            deltas = [0,1];
                            break;
                        default:
                            overlayer.showOverlayObj(overlayRealityIsWrong);
                            console.warn(`Invalid direction '${right.value}' for move action.`);
                            return false;
                    }

                    const existing = context.gameGrid.getRelationalTile(r, c, deltas[0], deltas[1]);

                    let moveableInto = true;
                    if (existing !== null && existing !== false && existing !== undefined) {
                        moveableInto = (CAN_MOVE_ACTION_INTO_ANY_WALKABLE) ? existing.getIsWalkable() : !(existing instanceof VoidTile);
                    }

                    if (existing === null || moveableInto || existing instanceof BeehiveTile || existing === playerObj) {
                        block.moveBy(deltas[0], deltas[1]);
                    }

                    if (existing !== null && existing === playerObj) {
                        if (block instanceof StoneTile && MEME) {
                            triggerGameOver("You where crushed by WEMAN!");
                        } else {
                            triggerGameOver("You where crushed!");
                        }
                    }
                    if (existing !== null && existing instanceof BeehiveTile) {
                        triggerGameOver("You killed everyone!");
                    }
                }
            }
        }
    },
    
    "is": (left, right, context) => {

        let handled = false;

        // Validate+Execute: Specials: Object to Modifier
        if (left instanceof CodeBlockObject && right instanceof CodeBlockModifier) {
            
            let combinedValue = left.value + ";" + right.value;
            switch(combinedValue) {
                case "game;over":
                    triggerGameOver("Bad game design!");
                    handled = true;
                    break;

                case "game;death":
                    triggerGameOver("Bad game design!");
                    handled = true;
                    break;

                case "game;won":
                    triggerGameWon();
                    handled = true;
                    break;

                case "game;win":
                    triggerGameWon();
                    handled = true;
                    break;

                case "game;reset":
                    onGameReset();
                    handled = true;
                    break;

                case "game;meme":
                    if (MEME) {
                        triggerGameOver("Too much meme!");
                    } else {
                        MEME = true;
                    }
                    return true;

                default:
                    // Not handled
                    break;
            }
        }

        // Validate: Object to Object
        if (left instanceof CodeBlockObject && right instanceof CodeBlockObject) {
            handled = true;
        }

        // Validate: Object to Modifier
        if (left instanceof CodeBlockObject && right instanceof CodeBlockModifier) {
            if ([
                "win",
                "won",
                "not_win",
                "death",
                "over",
                "safe",
                "walkable",
                "solid"
            ].includes(right.value)) {
                handled = true;
            }
        }

        // Execute
        if (handled) {

            const gridData = context.gameGrid.getGrid();

            for (let r = 0; r < gridData.length; r++) {
                for (let c = 0; c < gridData[r].length; c++) {

                    const block = gridData[r][c];

                    let validBlock = false;

                    try {
                        validBlock = block instanceof left.linkedClass;
                    } catch (e) {}


                    // Since left is the affected make sure it matches
                    if (block && validBlock) {

                        // Execute: Object to Object
                        if (left instanceof CodeBlockObject && right instanceof CodeBlockObject) {
                            let pos = context.gameGrid.getPosOfObj(block);

                            try {
                                context.gameGrid.setTile(pos[0], pos[1], new right.linkedClass()); 
                            } catch (e) {
                                console.warn(`Failed to transform object: ${e}`);
                            }
                        }

                        // Execute: Object to Modifier
                        if (left instanceof CodeBlockObject && right instanceof CodeBlockModifier) {

                            switch(right.value) {
                                case "win":
                                    block.setIsGoal(true);
                                    break;

                                case "won":
                                    block.setIsGoal(true);
                                    break;

                                case "not_win":
                                    block.setIsGoal(false);
                                    break;
                                
                                case "death":
                                    block.setIsDeath(true);
                                    break;
                                
                                case "over":
                                    context.gameGrid.setTile(r, c, new DisabledVoidTile());
                                    break;
                                
                                case "safe":
                                    block.setIsDeath(false);
                                    break;
                                
                                case "walkable":
                                    block.setIsWalkable(true);
                                    break;

                                case "solid":
                                    block.setIsWalkable(false);
                                    break;

                                default:
                                    // Not handled
                                    break;
                            }
                        }
                    }
                }
            }

        } else {
            overlayer.showOverlayObj(overlayRealityIsWrong);
            return false;
        }

    },

};

//IMPORTANT theses are not Available Actions theses are just for example to see how to use them
//Not done yet
//You need to make the actual actions and add them to the registry for them to work
//Also you need to make sure the codeblock action values match the registry keys

/*
//Example usage:
"move": (left, right, context) => {
    const { gameGrid } = context;

    if (left && right && left.canMove) {
        const direction = right.value;
        left.move(direction, gameGrid); // update position in the *game grid*
    }
},
"attack": (left, right, context) => {
    if (left && right) {
        left.attack(right, context);
    }
},
*/