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
        if (!pressedInputs.includes(event.key.toLowerCase())) {
            pressedInputs.push(event.key.toLowerCase());

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
        const index = pressedInputs.indexOf(event.key.toLowerCase());
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

function triggerGameOver(reason = null) {
    audio.playSound("sfx.death");
    gameOver = true;
    overlayGameOver.setText("reason", "Reason: " + reason);
    overlayer.showOverlayObj(overlayGameOver);
}

function triggerGameWon() {
    audio.playSound("sfx.win");
    gameWon = true;
    overlayer.showOverlayObj(overlayWon);
}

function checkTile(tile) {
    if (tile.isWalkable) {
        return "walk";
    }
    else if (tile.isGoal){
        triggerGameWon();
        return "goal";
    }
    else if (tile.isDeath) {
        triggerGameOver("Your choices led to your demise.");
        return "death";
    }
    else if (tile instanceof CodeBlockAction || tile instanceof CodeBlockEntity || tile instanceof CodeBlockModifier){
        var inventoryGrid = currentGrids[2];
        var gameGrid = currentGrids[0];
        var freeSpace = inventoryGrid.getFirstEmptyCell();

        // if (!inventoryGrid.gridContains(tile)) {
        //     inventoryGrid.setTile(freeSpace[0], freeSpace[1], tile)
        // }
        inventoryGrid.setTile(freeSpace[0], freeSpace[1], tile)

        var tilePos = gameGrid.getPosOfObj(tile);
        gameGrid.clearTile(tilePos[0], tilePos[1]);
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
            maybePlayBeeSound();
            // Move once when key is first pressed
            const currentPlayerPos = grid.getPosOfObj(playerObj);
            const newPlayerPosCheck = grid.getRelationalTile(currentPlayerPos[0], currentPlayerPos[1], -1, 0);


            if (newPlayerPosCheck) {
                var tile = checkTile(newPlayerPosCheck)

                if (tile == "walk") {
                    // grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], -1, 0, playerObj);
                    // grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    playerObj.moveBy(-1,0);
                    
                    movedUpward = true; // prevent another move until key is released
                }
                else {
                    return;
                }
            } else {
                if (newPlayerPosCheck != false) {
                    // grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], -1, 0, playerObj);
                    // grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    playerObj.moveBy(-1,0);
                    
                    movedUpward = true; // prevent another move until key is released
                }
            }

        } 
        
        // Reset when key is released
        if (!isPressingW) {
            movedUpward = false;
        }

        if (isPressingS && !movedDown) {
            maybePlayBeeSound();
            // Move once when key is first pressed
            const currentPlayerPos = grid.getPosOfObj(playerObj);
            const newPlayerPosCheck = grid.getRelationalTile(currentPlayerPos[0], currentPlayerPos[1], 1, 0);

            if (newPlayerPosCheck) {
                var tile = checkTile(newPlayerPosCheck)

                if (tile == "walk") {
                    // grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], -1, 0, playerObj);
                    // grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    playerObj.moveBy(-1,0);
                    
                    movedUpward = true; // prevent another move until key is released
                }
            }else {
                if (newPlayerPosCheck != false) {
                    // grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], 1, 0, playerObj);
                    // grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    playerObj.moveBy(1,0);
                    
                    movedDown = true; // prevent another move until key is released
                }
            }

        } 
        
        // Reset when key is released
        if (!isPressingS) {
            movedDown = false;
        }

        if (isPressingA && !movedLeft) {
            maybePlayBeeSound();
            // Move once when key is first pressed
            const currentPlayerPos = grid.getPosOfObj(playerObj);
            const newPlayerPosCheck = grid.getRelationalTile(currentPlayerPos[0], currentPlayerPos[1], 0, -1);

            if (newPlayerPosCheck) {
                var tile = checkTile(newPlayerPosCheck)

                if (tile == "walk") {
                    // grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], -1, 0, playerObj);
                    // grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    playerObj.moveBy(-1,0);
                    
                    movedUpward = true; // prevent another move until key is released
                }
            }else{

                if (newPlayerPosCheck != false){
                    // grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], 0, -1, playerObj);
                    // grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    playerObj.moveBy(0,-1);
                    
                    movedLeft = true; // prevent another move until key is released
                }
            }

            
        } 
        
        // Reset when key is released
        if (!isPressingA) {
            movedLeft = false;
        }

        if (isPressingD && !movedRight) {
            maybePlayBeeSound();
            // Move once when key is first pressed
            const currentPlayerPos = grid.getPosOfObj(playerObj);
            const newPlayerPosCheck = grid.getRelationalTile(currentPlayerPos[0], currentPlayerPos[1], 0, 1);

            if (newPlayerPosCheck) {
                var tile = checkTile(newPlayerPosCheck)

                if (tile == "walk") {
                    // grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], -1, 0, playerObj);
                    // grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    playerObj.moveBy(-1,0);
                    
                    movedUpward = true; // prevent another move until key is released
                }
            } else {
                if (newPlayerPosCheck != false) {
                    // grid.setRelationalTile(currentPlayerPos[0], currentPlayerPos[1], 0, 1, playerObj);
                    // grid.clearTile(currentPlayerPos[0], currentPlayerPos[1]);
                    playerObj.moveBy(0,1);
                    
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

const inLevelClickHook = (x,y,type)=>{
    // Did we click on a Block inside the inventoryGrid?
    const inventoryGrid = currentGrids[2];
    const gridData = inventoryGrid.getGrid();

    x -= borderOffset[0];
    y -= borderOffset[1];

    // get canvas coords to adjust x,y
    const canvasBounds = gameCanvas.getBoundingClientRect();
    x -= canvasBounds.left;
    y -= canvasBounds.top;

    // Inventory select
    for (let r = 0; r < gridData.length; r++) {
        for (let c = 0; c < gridData[r].length; c++) {

            // Check if we clicked this cell
            if (
                inventoryGrid.cellRenderStates.has([r, c])
            ) {
                const renderedState = inventoryGrid.cellRenderStates.get([r, c]); // [x,y,width,height]

                // Bounds check
                if (x >= renderedState[0] && x <= renderedState[0] + renderedState[2] &&
                    y >= renderedState[1] && y <= renderedState[1] + renderedState[3]) {

                        // Check the block
                        const block = gridData[r][c];
                        if (block === null) continue;
                        
                        // console.log("Clicked on block at inventory [" + r + "," + c + "]");

                        // Click is inside this block
                        if (block instanceof CodeBlock) {
                            // console.log("Selecting codeblock:", block);
                            block.select();

                            audio.stopSound("ui.select");
                            audio.playSound("ui.select");

                            // Unselect all other codeblocks in the codeGrid
                            for (let r2 = 0; r2 < gridData.length; r2++) {
                                for (let c2 = 0; c2 < gridData[r2].length; c2++) {
                                    const otherBlock = gridData[r2][c2];
                                    if (otherBlock !== null && otherBlock !== block && otherBlock instanceof CodeBlock) {
                                        otherBlock.deselect();
                                    }
                                }
                            }
                        }
                }
            }
        }
    }

    // Codeblock grid click
    const codeGrid = currentGrids[1];
    const codeGridData = codeGrid.getGrid();
    for (let r3 = 0; r3 < codeGridData.length; r3++) {
        for (let c3 = 0; c3 < codeGridData[r3].length; c3++) {
            
            // Check for cellRenderStates([r3,c3])
            if (
                codeGrid.cellRenderStates.has([r3, c3])
            ) {
                const renderedState = codeGrid.cellRenderStates.get([r3, c3]); // [x,y,width,height]

                // Bounds check
                if (x >= renderedState[0] && x <= renderedState[0] + renderedState[2] &&
                    y >= renderedState[1] && y <= renderedState[1] + renderedState[3]) {

                    // Attempt to getTile on the codeGrid at this r,c and if not null, skip
                    const codeGridTile = codeGrid.getTile(r3, c3);
                    if (codeGridTile !== null) {
                        // Cell occupied, skip
                        continue;
                    }
                    
                    // Click is inside this cell
                    // Get the first block in the inventory that is selected
                    for (let r4 = 0; r4 < gridData.length; r4++) {
                        for (let c4 = 0; c4 < gridData[r4].length; c4++) {
                            const invBlock = gridData[r4][c4];
                            if (invBlock !== null && invBlock instanceof CodeBlock && invBlock.isSelected() === true) {
                                
                                // console.log that we attempt a move of invBlock at [r4,c4] to codeGrid at [r3,c3]
                                //console.log(`Attempting to move block from inventory [${r4},${c4}] to codeGrid [${r3},${c3}]`);

                                // Attempt to move the block
                                const toMoveTile = inventoryGrid.getTile(r4, c4);

                                toMoveTile.deselect();
                                toMoveTile.executed = false;

                                audio.stopSound("ui.moveCodeBlock");
                                audio.playSound("ui.moveCodeBlock");

                                inventoryGrid.clearTile(r4, c4);

                                codeGrid.setTile(r3, c3, toMoveTile);


                                // Interpret
                                executeInterpreter();
                            }
                        }
                    }
                }
            }

        }
    }
}