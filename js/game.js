const DEBUG = window.location.search.includes("debug");


// Defines
let lastTime = performance.now();
let startTime = lastTime;
let frameCount = 0;
var currentGrids = [null, null, null]; // [gameGrid, codeGrid, inventoryGrid]
var interpreter = null; // CodeInterpreter
var resetAnimStarted = null;

function getTimeParams() {
    const now = performance.now();
    const frameDelta = now - lastTime;   // ms since last frame
    const deltaTime = frameDelta / 1000; // seconds
    const FPS = 1000 / frameDelta;       // instantaneous FPS
    frameCount++;
    const elapsed = (now - startTime) / 1000; // total seconds since start
    const avgFPS = frameCount / elapsed;      // true average FPS
    lastTime = now;

    return [frameDelta, deltaTime, FPS, elapsed, avgFPS];
}

const gameCanvas = document.getElementById("canvas");
const ctx = gameCanvas ? gameCanvas.getContext("2d") : null;


// Systems
const _volumeSlider = document.getElementById("volumeSlider");
const audio = new SoundHandler(parseInt(_volumeSlider.value, 10));
const overlayer = new OverlayHandler();
const levels = new LevelHandler();

// UI Elements
const iconTrash = new Texture("./assets/images/icons/trash.png");
const iconTrashActive = new Texture("./assets/images/icons/trash_active.png");
const resetButton = new UIButton(
    830, 740, 64, 64,
    new DataDrivenTexture(
        (_, cellContext) => {
            // If resetAnimStarted is null set it to now else check if time has passed
            const now = Date.now();
            if (now - resetAnimStarted >= 500) {
                resetAnimStarted = null;
                return iconTrash;
            }

            return iconTrashActive;
        }
    ),
    {"text": "Reset", "fontSize": 15, "yOffset": 13, "color": "#FFFFFF"},
    (x,y,type) => {
        resetAnimStarted = Date.now();
    
        // Reset overlays
        overlayer.hideOverlay();
    
        // Get current player position
        let pos = currentGrids[0].getPosOfObj(playerObj);
    
        // Reload current level
        currentGrids = levels.setLoadAndRunLevel(levels.getCurrentLevel());
    
        // Is there something there already die?
        const existingTile = currentGrids[0].getTile(pos[0], pos[1]);
        if (existingTile !== null && !(existingTile instanceof BeePlayerTile)) {
            triggerGameOver("Crushed, stood where reality reset!");
        }
    
        // Reset player position
        playerObj.moveTo(pos[0], pos[1]);
    },
    true // Works with overlay open
);

// Textures
const startBackgroundImg = new Texture("./assets/images/startmenu.png");
const playButtonImg = new Texture("./assets/images/play.png");
const borderImg = new Texture("./assets/images/border.png");
const gridBackgroundImg = new Texture("./assets/images/grid.png");
const invBackgroundImg = new Texture("./assets/images/inventory.png");

const overlayGameOverImg = new Texture("./assets/images/overlays/gameover.png");
const overlayRealityIsWrongImg = new Texture("./assets/images/overlays/reality_is_wrong.png");
const overlayWonImg = new Texture("./assets/images/overlays/won.png");

const tileVoid = new Texture("./assets/images/tiles/void.png");
const tileNonVoidAbove = new Texture("./assets/images/tiles/void-dirt.png");
const tileNonVoidAboveBellowLeft = new Texture("./assets/images/tiles/void-dirt-3-sides.png");
const tilePlayerBee = new Texture("./assets/images/tiles/bee.png");
const tilePlayerBee2 = new Texture("./assets/images/tiles/bee2.png");
const tilePlayerBee3 = new Texture("./assets/images/tiles/bee3.png");
const tilePlayerBee4 = new Texture("./assets/images/tiles/bee4.png");
const tilePlayerBee5 = new Texture("./assets/images/tiles/bee5.png");
const tilePlayerBee5Blink = new Texture("./assets/images/tiles/bee5_blink.png");
const tileBeeHive = new Texture("./assets/images/tiles/hive.png");
const tileLava = new Texture("./assets/images/tiles/lava.png");
const tileLava2 = new Texture("./assets/images/tiles/lava2.png");
const tileLava3 = new Texture("./assets/images/tiles/lava3.png");
const tileLava4 = new Texture("./assets/images/tiles/lava4.png");
const tileLava5 = new Texture("./assets/images/tiles/lava5.png");
const tileLava6 = new Texture("./assets/images/tiles/lava6.png");
const tileLava7 = new Texture("./assets/images/tiles/lava7.png");
const tileLava8 = new Texture("./assets/images/tiles/lava7.png");
const tileStone = new Texture("./assets/images/tiles/stone.png");

const tileCodeblockSelectedTx = new Texture("./assets/images/codeblocks/selected.png");
const tileCodeblockIgnoredTx = new Texture("./assets/images/codeblocks/ignored.png");
const tileCodeblockEmptyTx = new Texture("./assets/images/codeblocks/empty.png");
const tileCodeblockObjectTx = new Texture("./assets/images/codeblocks/object.png");
const tileCodeblockModifierTx = new Texture("./assets/images/codeblocks/modifier.png");
const tileCodeblockActionTx = new Texture("./assets/images/codeblocks/action.png");

//MARK: Test
const tileAnimBee = new AnimatedTexture(
    [
        "./assets/images/tiles/bee.png",

        "./assets/images/tiles/bee2.png",
        "./assets/images/tiles/bee3.png",
        "./assets/images/tiles/bee4.png",
        "./assets/images/tiles/bee5.png",
        "./assets/images/tiles/bee4.png",
        "./assets/images/tiles/bee3.png",
        "./assets/images/tiles/bee2.png",

        "./assets/images/tiles/bee.png",

        "./assets/images/tiles/bee2.png",
        "./assets/images/tiles/bee3.png",
        "./assets/images/tiles/bee4.png",
        "./assets/images/tiles/bee5_blink1.png",
        "./assets/images/tiles/bee4_blink.png",
        "./assets/images/tiles/bee4.png",
        "./assets/images/tiles/bee3.png",
        "./assets/images/tiles/bee2.png",

        "./assets/images/tiles/bee.png",
    ],
    170 // Switch every 500ms
)

const tileAnimLava = new AnimatedTexture(
    [
        //"./assets/images/tiles/void.png",
        "./assets/images/tiles/lava.png",
        "./assets/images/tiles/lava2.png",
        "./assets/images/tiles/lava3.png",
        "./assets/images/tiles/lava4.png",
        "./assets/images/tiles/lava5.png",
        "./assets/images/tiles/lava6.png",
        "./assets/images/tiles/lava7.png",
        "./assets/images/tiles/lava8.png",

        //tileNonVoidAbove
    ],
    800 // Switch every 500ms
)

const tileCodeblockOverlay = new DataDrivenTexture(
    (_, cellContext) => {
        const codeBlock = cellContext.grid.getTile(cellContext.row, cellContext.col);
        //console.log("Checking: [" + cellContext.row + ", " + cellContext.col + "] -> " + codeBlock.constructor.name + "@" + codeBlock.getId() + " (selected=" + codeBlock.isSelected() + ")");

        if (codeBlock.isSelected() === true) {
            return tileCodeblockSelectedTx;
        } else if (codeBlock instanceof CodeBlockAction && codeBlock.executed === true) {
            return tileCodeblockIgnoredTx;
        } else {
            return tileCodeblockEmptyTx;
        }
    }
);

const tileCodeblockObject = new LayeredTexture([
    tileCodeblockObjectTx,
    tileCodeblockOverlay
]);
const tileCodeblockModifier = new LayeredTexture([
    tileCodeblockModifierTx,
    tileCodeblockOverlay
]);
const tileCodeblockAction = new LayeredTexture([
    tileCodeblockActionTx,
    tileCodeblockOverlay
]);

// const tileLayeredTest = new LayeredTexture([
//     tileAnimBee,
//     "./assets/images/tiles/bee.png",
//     "./assets/images/tiles/bee2.png",
//     "./assets/images/tiles/bee3.png"
// ]);

// const tileDatadrivenTest = new DataDrivenTexture(
//     (_, cellContext) => {
//         // cellContext can be null or object with row and col where col/row can be null too
//         if (cellContext !== null && cellContext.row && cellContext.col) {
//             const above = gameGrid.getTile(cellContext.row - 1, cellContext.col);
            
//             // check if above is not null and above is instance of or instance of subclass of VoidTile
//             if (above === null || above instanceof VoidTile) {
//                 return tileNonVoidAbove;
//             } else {
//                 return tileVoid;
//             }
//         }
//     }
// )

var gameWon = false
var gameOver = false

// Overlays (rendered using `overlayer.showOverlayObj(<overlayObj>)`)
const onOverlayGameOverClickRestart = () => {
    window.location.reload();
};
const overlayGameOver = new Overlay(
    // Texture,         [ [ [x,y,width,height], function(x,y,type) ], ... ]
    overlayGameOverImg, [ [ [300,455, 200,50], onOverlayGameOverClickRestart ] ] // 100x100 button centered
);

const overlayRealityIsWrong = new Overlay(
    overlayRealityIsWrongImg, []
);

const onOverlayWonClickContinue = (x,y,type) => {
    currentGrids = levels.setLoadAndRunLevel(level2);
    overlayer.hideOverlay();
    gameWon = false;
};
const overlayWon = new Overlay(
    // Texture,    [ [ [x,y,width,height], function(x,y,type) ], ... ]
    overlayWonImg, [ [ [300,455, 200,50], onOverlayWonClickContinue ] ] // 100x100 button centered
);


// Sounds
audio.addSound("test.1", "./assets/audio/toot.mp3", false);
// audio.addSound("bg.music.1", "./assets/audio/backgroundMusic.wav", true, 0);
audio.addSound("bg.realityIsWrong", "./assets/audio/spring-in-my-step.wav");
audio.addPlaylist("bg.music", ["./assets/audio/arvids_fina_bakrundsmusik.mp3", "./assets/audio/into_the_tempel.mp3"], true,);
audio.addPlaylist("sfx.stone", ["./assets/audio/stone_1.wav", "./assets/audio/stone_2.wav", "./assets/audio/stone_3.wav", "./assets/audio/stone_4.wav"]);
audio.addSound("sfx.lavaDeath", "./assets/audio/lava_death.wav");
audio.addPlaylist("sfx.win", ["./assets/audio/win_1.mp3", "./assets/audio/win_2.mp3", "./assets/audio/win_3.mp3"]);
audio.addSound("sfx.death", "./assets/audio/game_die_1.mp3");
audio.addPlaylist("sfx.bee", ["./assets/audio/bee_1.wav", "./assets/audio/bee_2.wav"]);

// Register levels
const playerObj = new BeePlayerTile(tilePlayerBee);
levels.registerLevel(testLevel);
levels.registerLevel(level1);
levels.registerLevel(level2);

// Define loops
function GameLoop() {
    const [gameGrid, codeGrid, inventoryGrid] = currentGrids;

    if (!gameGrid || !codeGrid || !inventoryGrid) {
        console.error("GameLoop: One or more grids are null.");
        return;
    }

    Update(ctx, gameGrid);
    Render(ctx, gameGrid);

    const [frameDelta, deltaTime, FPS, elapsed, avgFPS] = getTimeParams();
    if (DEBUG) renderText(ctx, 30, 40, `FPS ${FPS.toFixed(1)} (avg: ${avgFPS.toFixed(1)}) | fΔ ${frameDelta.toFixed(2)}ms | Δt ${deltaTime.toFixed(3)}s | elap ${elapsed.toFixed(1)}s | frames ${frameCount}st | lvl ${levels.getCurrentLevelStrid()} (${levels.getCurrentLevelIndex()})`, "12px monospace", "left", "#00ff00");

    // Schedule the next frame
    requestAnimationFrame(
        () => GameLoop()
    );
}

// Function to start the game
function StartGame(level) {
    frameCount = 0;
    startTime = performance.now();

    audio.playSound("bg.music");

    levels.registerLoadHook((_) => {
        registerClickHook(inLevelClickHook);
    });

    levels.registerUnloadHook((_) => {
        unregisterClickHook(inLevelClickHook);
    });


    currentGrids = levels.setLoadAndRunLevel(level);

    // console.log every single id in everysingle grid
    // currentGrids.forEach((grid, index) => {
    //     console.log(`Grid ${index} contents:`);
    //     const gridData = grid.getGrid();
    //     for (let r = 0; r < gridData.length; r++) {
    //         for (let c = 0; c < gridData[r].length; c++) {
    //             const tile = gridData[r][c];
    //             if (tile !== null) {
    //                 console.log(tile.constructor.name + "@" + tile.getId());
    //             }
    //         }
    //     }
    // });

    // Code interpreter
    interpreter = new CodeInterpreter(currentGrids[1]); // codeGrid

    executeInterpreter();

    GameLoop();
}

function maybePlayBeeSound() {
    const chance = 0.12;

    if (Math.random() < chance) {
        audio.stopSound("sfx.bee");
        audio.playSound("sfx.bee");
    }
}

// If we got a canvas run the game
if (gameCanvas) {
    // Start menu
    var inStartMenu = true;

    // Click hook for start menu play button
    let startMenuClickHook = (x,y,type) => {
        if (type === 0) {
            // Check if click is inside play button
            const buttonX = (1320/2) - (64/2);
            const buttonY = (840/2) - (64/2);
            if (x >= buttonX && x <= buttonX + 64*1.33 && y >= buttonY && y <= buttonY + 64*1.33) {
                // Start game
                inStartMenu = false;
                unregisterClickHook(startMenuClickHook);
                StartGame(testLevel);
            }
        }
    }
    registerClickHook(startMenuClickHook);

    // Inner loop for start menu
    let startMenuLoop = () => {
        if (!inStartMenu) return;
    
        renderStartMenu(ctx);

        const [frameDelta, deltaTime, FPS, elapsed, avgFPS] = getTimeParams();
        if (DEBUG) renderText(ctx, 30, 40, `FPS ${FPS.toFixed(1)} (avg: ${avgFPS.toFixed(1)}) | fΔ ${frameDelta.toFixed(2)}ms | Δt ${deltaTime.toFixed(3)}s | elap ${elapsed.toFixed(1)}s | frames ${frameCount}st`, "12px monospace", "left", "#00ff00");
        
        requestAnimationFrame(startMenuLoop);
    }
    requestAnimationFrame(startMenuLoop);
}