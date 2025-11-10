// Each GameObject have a unique id they exists in bellow set
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

class GameTile extends GameObject {
    constructor(texture, isGoal, isDeath) {
        super(texture);
        this.isGoal = isGoal;
        this.isDeath = isDeath;
    }
}

class VoidTile extends GameObject {
    constructor() {
        super("./assets/images/tiles/void.png");
    }
}

class DisabledVoidTile extends VoidTile {
    constructor() {
        super(tileVoid);
    }
}

class DisabledVoidTile_NonVoidAbove extends VoidTile {
    constructor() {
        super(tileNonVoidAbove);
    }
}

class BeePlayerTile extends GameObject {
    constructor(direction) {
        super(tilePlayerBee);
        this.direction = direction;
    }
}

class BeehiveTile extends GameObject {
    constructor() {
        super(tileBeeHive);
    }
}

class LavaTile extends GameObject {
    constructor() {
        super(tileLava);
    }
}

// inte sten weman
class StoneTile extends GameObject {
    constructor() {
        super(tileStone);
    }
}