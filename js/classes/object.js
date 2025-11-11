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
    constructor(texture, isGoal = false, isDeath = false) {
        super(texture);
        this.isGoal = isGoal;
        this.isDeath = isDeath;
    }

    getReff() {
        return gameGrid.getPosOfObj(this.self)
    }

    moveBy(rowDelta, colDelta) {
        const objCurrentPos = this.getReff();

        const newObjPosCheck = grid.getRelationalTile(objCurrentPos[0], objCurrentPos[1], rowDelta, colDelta);
        
        if (newObjPosCheck != false){
            grid.setRelationalTile(objCurrentPos[0], objCurrentPos[1], rowDelta, colDelta, this.self);
            grid.clearTile(objCurrentPos[0], objCurrentPos[1]);
        }
    }
}

class VoidTile extends GameTile {
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

class BeePlayerTile extends GameTile {
    constructor(direction) {
        super(tilePlayerBee);
        this.direction = direction;
    }
}

class BeehiveTile extends GameTile {
    constructor() {
        super(tileBeeHive);
    }
}

class LavaTile extends GameTile {
    constructor() {
        super(tileLava);
    }
}

// inte sten weman
class StoneTile extends GameTile {
    constructor() {
        super(tileStone);
    }
}