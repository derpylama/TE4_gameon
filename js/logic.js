// Click and input handling
const pressedInputs = []; // Contains keys that are currently pressed
const lastClick = { "x": 0, "y": 0, "key": null }; // ex 100,100,left
const inputHooks = []; // Contains func(key, up/down)
const clickHooks = []; // Contains func(x,y,key

var inputHooksDisabled = false;
var inputHooksDisableExclusions = [];

// Register/Unregister functions for hooks
function registerInputHook(hook) {
    inputHooks.push(hook);
}

function registerClickHook(hook) {
    clickHooks.push(hook);
}

function unregisterInputHook(hook) {
    const index = inputHooks.indexOf(hook);
    if (index > -1) {
        inputHooks.splice(index, 1);
    }
}

function unregisterClickHook(hook) {
    const index = clickHooks.indexOf(hook);
    if (index > -1) {
        clickHooks.splice(index, 1);
    }
}

// Register event listeners
window.addEventListener("load", () => {
    document.addEventListener("keydown", (event) => {
        if (!pressedInputs.includes(event.key)) {
            pressedInputs.push(event.key);

            // Call input hooks
            for (const hook of inputHooks) {
                if (inputHooksDisabled && !inputHooksDisableExclusions.includes(hook)) {
                    continue;
                }
                hook(event.key, "down");
            }
        }
    });

    document.addEventListener("keyup", (event) => {
        const index = pressedInputs.indexOf(event.key);
        if (index > -1) {
            pressedInputs.splice(index, 1);

            // Call input hooks
            for (const hook of inputHooks) {
                if (inputHooksDisabled && !inputHooksDisableExclusions.includes(hook)) {
                    continue;
                }
                hook(event.key, "up");
            }
        }
    });

    document.addEventListener("mousedown", (event) => {
        lastClick.x = event.clientX;
        lastClick.y = event.clientY;
        lastClick.key = event.button; // 0: left, 1: middle, 2: right

        // Call click hooks
        for (const hook of clickHooks) {
            if (inputHooksDisabled && !inputHooksDisableExclusions.includes(hook)) {
                continue;
            }
            hook(lastClick.x, lastClick.y, lastClick.key);
        }
    });
});

var gameWon = false
var gameOver = false

function checkTile(tile){
    if (tile.isWalkable) {
        return "walk";
    }
    else if (tile.isGoal){
        audio.playSound("sfx.win");
        gameWon = true;
        overlayer.showOverlayObj(overlayWon);
        return "goal";
    }
    else if (tile.isDeath){
        audio.playSound("sfx.death");
        gameOver = true;
        overlayer.showOverlayObj(overlayGameOver);
        return "death";
    }
    else if (tile instanceof CodeBlockAction || tile instanceof CodeBlockEntity || tile instanceof CodeBlockModifier){
        console.log("ye")
    }
}


var movedUpward = false;
var movedLeft = false;
var movedRight = false;
var movedDown = false;

// Main update function (called in loop)
function Update(ctx, grid) {
    const isPressingW = pressedInputs.includes("w");
    const isPressingS = pressedInputs.includes("s");
    const isPressingD = pressedInputs.includes("d");
    const isPressingA = pressedInputs.includes("a");

    if (!gameOver && !gameWon) {
        if (isPressingW && !movedUpward) {
            // Move once when key is first pressed
            const currentPlayerPos = grid.getPosOfObj(playerObj);
            const newPlayerPosCheck = grid.getRelationalTile(currentPlayerPos[0], currentPlayerPos[1], -1, 0);


            if (newPlayerPosCheck) {
                var tile = checkTile(newPlayerPosCheck)

                if (tile == "walk") {
                    grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], -1, 0, playerObj);
                    grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    
                    movedUpward = true; // prevent another move until key is released
                }
                else {
                    return;
                }
            } else {
                if (newPlayerPosCheck != false) {
                    grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], -1, 0, playerObj);
                    grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    
                    movedUpward = true; // prevent another move until key is released
                }
            }

        } 
        
        // Reset when key is released
        if (!isPressingW) {
            movedUpward = false;
        }

        if (isPressingS && !movedDown) {
            // Move once when key is first pressed
            const currentPlayerPos = grid.getPosOfObj(playerObj);
            const newPlayerPosCheck = grid.getRelationalTile(currentPlayerPos[0], currentPlayerPos[1], 1, 0);

            if (newPlayerPosCheck) {
                var tile = checkTile(newPlayerPosCheck)

                if (tile == "walk") {
                    grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], -1, 0, playerObj);
                    grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    
                    movedUpward = true; // prevent another move until key is released
                }
            }else {
                if (newPlayerPosCheck != false) {
                    grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], 1, 0, playerObj);
                    grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    
                    movedDown = true; // prevent another move until key is released
                }
            }

        } 
        
        // Reset when key is released
        if (!isPressingS) {
            movedDown = false;
        }

        if (isPressingA && !movedLeft) {
            // Move once when key is first pressed
            const currentPlayerPos = grid.getPosOfObj(playerObj);
            const newPlayerPosCheck = grid.getRelationalTile(currentPlayerPos[0], currentPlayerPos[1], 0, -1);

            if (newPlayerPosCheck) {
                var tile = checkTile(newPlayerPosCheck)

                if (tile == "walk") {
                    grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], -1, 0, playerObj);
                    grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    
                    movedUpward = true; // prevent another move until key is released
                }
            }else{

                if (newPlayerPosCheck != false){
                    grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], 0, -1, playerObj);
                    grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    
                    movedLeft = true; // prevent another move until key is released
                }
            }

            
        } 
        
        // Reset when key is released
        if (!isPressingA) {
            movedLeft = false;
        }

        if (isPressingD && !movedRight) {
            // Move once when key is first pressed
            const currentPlayerPos = grid.getPosOfObj(playerObj);
            const newPlayerPosCheck = grid.getRelationalTile(currentPlayerPos[0], currentPlayerPos[1], 0, 1);

            if (newPlayerPosCheck) {
                var tile = checkTile(newPlayerPosCheck)

                if (tile == "walk") {
                    grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], -1, 0, playerObj);
                    grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    
                    movedUpward = true; // prevent another move until key is released
                }
            } else {
                if (newPlayerPosCheck != false) {
                    grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], 0, 1, playerObj);
                    grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    
                    movedRight = true; // prevent another move until key is released
                    
                }
            }

        } 
        
        // Reset when key is released
        if (!isPressingD) {
            movedRight = false;
        }
    }
}

function executeInterpreter() {
    interpreter.executeAllRows(currentGrids[1], { //execute code on updates  //move to only trigger when a codeblock is moved
        "gameGrid": currentGrids[0],
    });    
}