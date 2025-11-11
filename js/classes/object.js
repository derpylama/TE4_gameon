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

        
        this.renderedState = null;
    }

    getId() {
        return this.id;
    }

    setRenderedState(x,y,width,height) {
        this.renderedState = [x,y,width,height];
    }

    getRenderedState() {
        return this.renderedState;
    }

    resetRenderedState() {
        this.renderedState = null;
    }
}

class GameTile extends GameObject {
    constructor(texture, isGoal = false, isDeath = false, isWalkable = false) {
        super(texture);
        this.isGoal = isGoal;
        this.isDeath = isDeath;
        this.isWalkable = isWalkable;
    }

    getReff() {
        return currentGrids[0].getPosOfObj(this);
        
    }

    moveBy(rowDelta, colDelta) {
        const objCurrentPos = this.getReff();

        const newObjPosCheck = currentGrids[0].getRelationalTile(objCurrentPos[0], objCurrentPos[1], rowDelta, colDelta);
        
        if (newObjPosCheck != false){
            currentGrids[0].setRelationalTile(objCurrentPos[0], objCurrentPos[1], rowDelta, colDelta, this);
            currentGrids[0].clearTile(objCurrentPos[0], objCurrentPos[1]);
        }
    }

    setIsGoal(isGoal) {
        this.isGoal = isGoal;
    }

    setIsDeath(isDeath) {
        this.isDeath = isDeath;
    }

    setIsWalkable(isWalkable) {
        this.isWalkable = isWalkable;
    }
}

class VoidTile extends GameTile {
    constructor(texture) {
        super(texture);
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

class DisabledVoidTile_NonVoidAboveBellowLeft extends VoidTile {
    constructor() {
        super(tileNonVoidAboveBellowLeft);
    }
}

class BeePlayerTile extends GameTile {
    constructor(direction) {
        super(tileAnimBee);
        this.direction = direction;
    }
}

class BeehiveTile extends GameTile {
    constructor() {
        super(tileBeeHive, true);
    }
}

class LavaTile extends GameTile {
    constructor() {
        super(tileAnimLava, false, true);
    }
}

// inte sten weman
class StoneTile extends GameTile {
    constructor() {
        super(tileStone, false, false, false);
    }
}