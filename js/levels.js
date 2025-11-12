class LevelHandler {
    constructor() {
        this.levels = [];
        this.currentIndex = -1;

        this.loadHooks = []; // Load hooks are functions taking (levelIndex) as argument
        this.unloadHooks = []; // Unload hooks are functions taking (levelIndex) as argument
    }

    registerLoadHook(hook) {
        this.loadHooks.push(hook);
    }

    unregisterLoadHook(hook) {
        const index = this.loadHooks.indexOf(hook);
        if (index > -1) {
            this.loadHooks.splice(index, 1);
        }
    }

    registerUnloadHook(hook) {
        this.unloadHooks.push(hook);
    }

    unregisterUnloadHook(hook) {
        const index = this.unloadHooks.indexOf(hook);
        if (index > -1) {
            this.unloadHooks.splice(index, 1);
        }
    }

    registerLevel(level) {
        this.levels.push(level);
        return this.levels.length - 1; // return index of the newly added level
    }

    unregisterLevelByIndex(index) {
        if (index >= 0 && index < this.levels.length) {
            this.levels.splice(index, 1);
        }
    }

    unregisterLevel(level) {
        const index = this.levels.indexOf(level);
        this.unregisterLevelByIndex(index);
    }

    setCurrentLevelByIndex(index) {
        if (index >= 0 && index < this.levels.length) {
            this.currentIndex = index;
        }
    }

    setCurrentLevel(level) {
        const index = this.levels.indexOf(level);
        this.setCurrentLevelByIndex(index);
    }

    _callLoadHooks() {
        for (const hook of this.loadHooks) {
            hook(this.currentIndex);
        }
    }

    _callUnloadHooks() {
        for (const hook of this.unloadHooks) {
            hook(this.currentIndex);
        }
    }

    loadAndRunLevel() {
        const level = this.levels[this.currentIndex];
        if (level) {
            this._callUnloadHooks();
            let res = level.loadAndRun();
            this._callLoadHooks();

            // console.log every single id in everysingle grid
            if (DEBUG) {
                res.forEach((grid, index) => {
                    switch (index) {
                        case 0:
                            var gridAssumedName = "Game Grid";
                            break;
                        case 1:
                            var gridAssumedName = "Code Grid";
                            break;
                        case 2:
                            var gridAssumedName = "Inventory Grid";
                            break;
                        default:
                            var gridAssumedName = "Unknown Grid";
                    }
                    console.log(`Grid ${gridAssumedName} (${index}) contents:`);
                    const gridData = grid.getGrid();
                    for (let r = 0; r < gridData.length; r++) {
                        for (let c = 0; c < gridData[r].length; c++) {
                            const tile = gridData[r][c];
                            if (tile !== null) {
                                console.log("  " + tile.constructor.name + "@" + tile.getId());
                            }
                        }
                    }
                });
            }

            return res;
        }

        return [null, null, null];
    }

    setLoadAndRunLevelByIndex(index) {
        this.setCurrentLevelByIndex(index);
        return this.loadAndRunLevel();
    }

    setLoadAndRunLevel(level) {
        this.setCurrentLevel(level);
        return this.loadAndRunLevel();
    }

    getCurrentLevelIndex() {
        return this.currentIndex;
    }

    getCurrentLevelStrid() {
        const level = this.levels[this.currentIndex];
        return level ? level.strid : "?";
    }

    getCurrentLevel() {
        return this.levels[this.currentIndex];
    }

    setLoadAndRunNextLevel() {
        if (this.currentIndex + 1 < this.levels.length) {
            this.currentIndex += 1;
            return this.loadAndRunLevel();
        }
        return [null, null, null];
    }
}

class Level {
    // initiator should be function() => [gameGrid, codeGrid, inventoryGrid]
    constructor(strid, initiator) {
        this.strid = strid;
        this.initiator = initiator;
    }

    loadAndRun() {
        return this.initiator();   
    }
}