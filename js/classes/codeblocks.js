class CodeBlock extends GameObject {
    constructor(texture, value) {
        super(texture);
        this.value = value;
    }
}

class CodeBlockEntity extends CodeBlock {
    constructor(texture, value) {
        super(texture, value);
    }
}


class CodeBlockObject extends CodeBlockEntity {
    constructor(value) {
        super("./assets/images/codeblocks/object.png", value);
    }
}

class CodeBlockModifier extends CodeBlockEntity {
    constructor(value) {
        super("./assets/images/codeblocks/modifier.png", value);
    }
}



class CodeBlockAction extends CodeBlock {
    constructor(value, adjacentCodeBlocksCanBe = ["any", "any"]) {
        super("./assets/images/codeblocks/action.png", value);
        this.adjacentCodeBlocksCanBe = adjacentCodeBlocksCanBe; // e.g., ["object", "modifier"]   what left and rigth codeblocks can be 
    }

    validate(adjacentBlocks) {
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
}