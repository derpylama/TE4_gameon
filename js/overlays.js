class GameOverlay {
    constructor(texture) {
        if (typeof texture === 'string') {
            texture = new Texture(texture);
        }
        this.texture = texture;
    }
}

class GameOverOverlay extends GameOverlay {
    constructor() {
        super('./textures/overlays/gameover.png');
    }
}

class RealityIsWrongOverlay extends GameOverlay {
    constructor() {
        super('./textures/overlays/reality_is_wrong.png');
    }
}

class WonOverlay extends GameOverlay {
    constructor() {
        super('./textures/overlays/won.png');
    }
}

// triggerOverlay should also register a click handler using `registerClickHook`