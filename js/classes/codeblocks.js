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



class CodeBlockAction extends CodeBlock {
    constructor(value, text, adjacentCodeBlocksCanBe = ["any", "any"]) {
        super(tileCodeblockAction, value, text);
        this.adjacentCodeBlocksCanBe = adjacentCodeBlocksCanBe; // e.g., ["object", "modifier"]   what left and rigth codeblocks can be 
        this.executed = false;
    }

    validate(adjacentBlocks) {
        if(this.executed){
            return false; //already executed
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
            console.warn("Unknown expected type in CodeBlockAction validation:", expectedType);
            return false; // unknown type keyword
        };

        const [leftType, rightType] = this.adjacentCodeBlocksCanBe;
        return isValid(left, leftType) && isValid(right, rightType);
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
    "move.to": (left, right, context) => {
         console.log("move.to action called with:", left, right, context);
        // return true;

        const gridData = context.gameGrid.getGrid();

        for (let r = 0; r < gridData.length; r++) {
            for (let c = 0; c < gridData[r].length; c++) {
                const block = gridData[r][c];
                if (block && block instanceof left.linkedClass) {
                    switch(right.value) {
                        case "up":
                            block.moveBy(-1, 0);
                            break;
                        case "down":
                            block.moveBy(1, 0);
                            break;
                        case "left":
                            block.moveBy(0, -1);
                            break;
                        case "right":
                            block.moveBy(0, 1);
                            break;
                        default:
                            console.warn(`Invalid direction '${right.value}' for move.to action.`);
                            return false;
                    }
                }
            }
        }
    },
    "is": (left, right, context) => {
        console.log("is action called with:", left, right, context);

        const gridData = context.gameGrid.getGrid();

        for (let r = 0; r < gridData.length; r++) {
            for (let c = 0; c < gridData[r].length; c++) {
                const block = gridData[r][c];
                if (block && block instanceof left.linkedClass) {
                    if (left instanceof CodeBlockObject && right instanceof CodeBlockObject) {
                        let pos=context.gameGrid.getPosOfObj(block);

                        context.gameGrid.setTile(pos[0], pos[1], new right.linkedClass()); 
                    }
                    else{
                        switch(right.value) {
                            case "win":

                                break;

                            default:
                                console.warn(`Invalid direction '${right.value}' for move.to action.`);
                                return false;
                        }
                    }
                }
            }
        }

    },



};

//IMPORTANT theses are not Available Actions theses are just for example to see how to use them
//Not done yet
//You need to make the actual actions and add them to the registry for them to work
//Also you need to make sure the codeblock action values match the registry keys

/*
//Example usage:
"move.to": (left, right, context) => {
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