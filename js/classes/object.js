const assignedIds = new Set();

class GameObject {
    constructor(textureOrPath) {
        // If string call toTexture
        if (typeof textureOrPath === "string") {
            this.texture = new Texture(textureOrPath);
        } else {
            this.texture = textureOrPath;
        }

        // assign random id
        let proposedId = self.crypto.randomUUID();
        // while id is in assignedIds, generate new id
        while (assignedIds.has(proposedId)) {
            proposedId = self.crypto.randomUUID();
        }
        this.id = proposedId;
    }

    getId() {
        return this.id;
    }
}

class CodeBlock extends GameObject {
    constructor(texture, type, name, predecessor = null, successor = null) {
        super(texture);
        this.type = type;
        this.name = name;
        this.predecessor = predecessor;
        this.successor = successor;
    }
}

class GameTile extends GameObject {
    constructor(texture, isGoal, isDeath) {
        super(texture);
        this.isGoal = isGoal;
        this.isDeath = isDeath;
    }
}

class VoidTile extends GameObject {
    constructor(texture) {
        super(texture);
    }
}

class DisabledVoidTile extends VoidTile {
    constructor(texture) {
        super(texture);
    }
}

class DisabledVoidTile_NonVoidAbove extends VoidTile {
    constructor(texture) {
        super(texture);
    }
}

class BeePlayerTile extends GameObject {
    constructor(texture, direction) {
        super(texture);
        this.direction = direction;
    }
}

class BeehiveTile extends GameObject {
    constructor(texture) {
        super(texture);
    }
}

class LavaTile extends GameObject {
    constructor(texture) {
        super(texture);
    }
}

// inte sten weman
class StoneTile extends GameObject {
    constructor(texture) {
        super(texture);
    }
}