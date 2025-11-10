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
    constructor(value) {
        super("./assets/images/codeblocks/action.png", value);
    }
    
    validate(adjacentBlocks) { //array of two blocks  left, right    each action needs to be between two entities  ex:  (entity - action - entity), (stone - moveto - left)
        const [left, right] = adjacentBlocks;
        return (
            left instanceof CodeBlockEntity &&
            right instanceof CodeBlockEntity
        );
    }
}