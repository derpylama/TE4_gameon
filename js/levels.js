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

    setLoadAndRunNextLevel() {
        
        if ((this.currentIndex + 1) in this.levels) {
            this.setLoadAndRunLevelByIndex( this.currentIndex +1 );
        }
        else{
            window.location.reload();
        }
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