class LevelHandler {
    constructor() {
        this.levels = [];
        this.currentIndex = -1;
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

    loadAndRunLevel() {
        const level = this.levels[this.currentIndex];
        if (level) {
            return level.loadAndRun();
        }

        return [null, null, null];
    }

    getCurrentLevelIndex() {
        return this.currentIndex;
    }

    getCurrentLevelStrid() {
        const level = this.levels[this.currentIndex];
        return level ? level.strid : "?";
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