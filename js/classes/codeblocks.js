class CodeBlock extends GameObject {
    constructor(texture, value) {
        super(texture);
        this.value = value;
        this.predecessor = predecessor;
        this.successor = successor;
    }
}

class CodeBlockObject extends CodeBlock {
    constructor(texture, value) {
        super(texture, value);
    }
}
class CodeBlockAction extends CodeBlock {
    constructor(texture, value, predecessor = null, successor = null) {
        super(texture, value);
        this.predecessor = predecessor;
        this.successor = successor;
    }
    
}