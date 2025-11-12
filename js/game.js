const DEBUG = window.location.search.includes("debug");
const GLOSSY = window.location.search.includes("glossy");
var MEME = window.location.search.includes("meme");

const CAN_MOVE_ACTION_INTO_ANY_WALKABLE = true;

// Defines
let lastTime = performance.now();
let startTime = lastTime;
let frameCount = 0;
var currentGrids = [null, null, null]; // [gameGrid, codeGrid, inventoryGrid]
var interpreter = null; // CodeInterpreter
var resetAnimStarted = null;
var gameWon = false;
var gameOver = false;

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


// Textures
const startBackgroundImg = new Texture("./assets/images/startmenu.png");
const playButtonImg = new Texture("./assets/images/icons/play.png");
const borderImg = new Texture("./assets/images/border.png");
const gridBackgroundImg = new Texture("./assets/images/grid.png");
const invBackgroundImg = new Texture("./assets/images/inventory.png");
const invBackgroundImgLastDrawPass = new Texture("./assets/images/inventory_lastDrawPass.png");

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
const tileBeeHiveTx = new Texture("./assets/images/tiles/hive.png");
const tileBeeHiveMemeTx = new Texture("./assets/images/tiles/trash.png");
const tileLava = new Texture("./assets/images/tiles/lava.png");
const tileLava2 = new Texture("./assets/images/tiles/lava2.png");
const tileLava3 = new Texture("./assets/images/tiles/lava3.png");
const tileLava4 = new Texture("./assets/images/tiles/lava4.png");
const tileLava5 = new Texture("./assets/images/tiles/lava5.png");
const tileLava6 = new Texture("./assets/images/tiles/lava6.png");
const tileLava7 = new Texture("./assets/images/tiles/lava7.png");
const tileLava8 = new Texture("./assets/images/tiles/lava7.png");
const tileStoneTx = new Texture("./assets/images/tiles/stone.png");
const tileStoneMemeTx = new Texture("./assets/images/tiles/sten_the_weman.png");

const tileStump = new Texture("./assets/images/tiles/stump.png");
const tileTrash = new Texture("./assets/images/tiles/trash.png");
const tileRock = new Texture("./assets/images/tiles/rock.png");
const tileRockAlt = new Texture("./assets/images/tiles/rock_alt.png");
const tileFlowerPatch = new Texture("./assets/images/tiles/flower_patch.png");
const tileGrass = new Texture("./assets/images/tiles/grass.png");
const tileBush = new Texture("./assets/images/tiles/bush.png");
const tileFlowerBush = new Texture("./assets/images/tiles/bush_flower.png");

const tileCodeblockSelectedTx = new Texture("./assets/images/codeblocks/selected.png");
const tileCodeblockIgnoredTx = new Texture("./assets/images/codeblocks/ignored.png");
const tileCodeblockEmptyTx = new Texture("./assets/images/codeblocks/empty.png");
const tileCodeblockDisabledTx = new Texture("./assets/images/codeblocks/disabled1.png");
const tileCodeblockDisabledAltTx = new Texture("./assets/images/codeblocks/disabled2.png");

const tileCodeblockDisabledGlossyTx = new Texture("./assets/images/codeblocks/disabled1_glossy.png");

const tileCodeblockObjectTx = new Texture("./assets/images/codeblocks/object.png");
const tileCodeblockModifierTx = new Texture("./assets/images/codeblocks/modifier.png");
const tileCodeblockActionTx = new Texture("./assets/images/codeblocks/action.png");

const tileCodeblockObjectGlossyTx = new Texture("./assets/images/codeblocks/object_glossy.png");
const tileCodeblockModifierGlossyTx = new Texture("./assets/images/codeblocks/modifier_glossy.png");
const tileCodeblockActionGlossyTx = new Texture("./assets/images/codeblocks/action_glossy.png");

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
    //MARK: Maybe this can always use inventory grid? (currentGrids[2])
    (_, cellContext) => {
        const codeBlock = cellContext.grid.getTile(cellContext.row, cellContext.col);
        if (codeBlock === null || codeBlock === undefined || codeBlock === false) {
            return tileCodeblockEmptyTx;
        }

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

const tileStone = new DataDrivenTexture(
    (_, cellContext) => {
        return MEME ? tileStoneMemeTx : tileStoneTx;
    }
);

const tileBeeHive = new DataDrivenTexture(
    (_, cellContext) => {
        return MEME ? tileBeeHiveMemeTx : tileBeeHiveTx;
    }
);

const tileCodeblockObject = new LayeredTexture([
    GLOSSY ? tileCodeblockObjectGlossyTx : tileCodeblockObjectTx,
    tileCodeblockOverlay
]);
const tileCodeblockModifier = new LayeredTexture([
    GLOSSY ? tileCodeblockModifierGlossyTx : tileCodeblockModifierTx,
    tileCodeblockOverlay
]);
const tileCodeblockAction = new LayeredTexture([
    GLOSSY ? tileCodeblockActionGlossyTx : tileCodeblockActionTx,
    tileCodeblockOverlay
]);

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
    currentGrids = levels.setLoadAndRunNextLevel();
    overlayer.hideOverlay();
    gameWon = false;
};
const overlayWon = new Overlay(
    // Texture,    [ [ [x,y,width,height], function(x,y,type) ], ... ]
    overlayWonImg, [ [ [300,455, 200,50], onOverlayWonClickContinue ] ] // 100x100 button centered
);


// Fonts
let loadedFonts = [];
async function loadFont(font) {
    try {
        await font.load();
        document.fonts.add(font);
        loadedFonts.push(font.family);
        console.log(`Font "${font.family}" loaded successfully.`);
    } catch (error) {
        console.error(`Failed to load font "${font.family}":`, error);
    }
}
function getFont() {
    // Is yosterr loaded? if so return "Yosterr", else return "Arial"
    return loadedFonts.includes("Yosterr") ? "Yosterr" : "Arial";
}
const fontYosterr = new FontFace("Yosterr", "url('./assets/font/yosterr/font.ttf')");
loadFont(fontYosterr);

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

audio.addSound("ui.moveCodeBlock", "./assets/audio/click.mp3");

audio.addSound("ui.click", "./assets/audio/click.mp3");
audio.addSound("ui.clickReset", "./assets/audio/click_reset.mp3");
audio.addSound("ui.select", "./assets/audio/click.mp3");

// Helpers for levels
function instantiateGrids() {
    let hexagonOffsetMakerRight = (row, _) => {
        rowOffset = (row % 2 === 0 ? 0 : ((800/10)/2) + 8);
        return [rowOffset, (-7*row)+(-1*row)];
    };
    let hexagonOffsetMakerLeft = (row, _) => {
        rowOffset = (row % 2 === 0 ? 0 : -((800/10)/2) - 8);
        return [rowOffset, (-7*row)+(-1*row)];
    };

    // let generateVoids = (row, col) => {
    //     return (row === 0 ? new DisabledVoidTile_NonVoidAbove(tileNonVoidAbove) : new DisabledVoidTile(tileVoid));
    // };

    let fillCodeGridWithDisabled = (row, col) => {
        return new GameTile(GLOSSY ? tileCodeblockDisabledGlossyTx : tileCodeblockDisabledTx);
    };

    const _gameGrid = new Grid(
        0, 0,   // Position in scrPx
        10, 10, // Rows x Cols
        800/10, // Tile Size, scrPx size of a cell
        null, // Func to generate default tiles, can be set null
        0, 0,   // Gaps in scrPx
        null // Func to generate offsets per tile [txpx, txpx], can be set null
    );
    const _inventoryGrid = new Grid(
        846, 32.5,   // Position in scrPx
        4, 4, // Rows x Cols
        800/10, // Tile Size, scrPx size of a cell
        null, // Func to generate default tiles, can be set null
        16, 0,   // Gaps in scrPx
        hexagonOffsetMakerRight // Func to generate offsets per tile [txpx, txpx], can be set null
    );
    const _codeGrid = new Grid(
        893, 393,   // Position in scrPx
        5, 4, // Rows x Cols
        800/10, // Tile Size, scrPx size of a cell
        fillCodeGridWithDisabled, // Func to generate default tiles, can be set null
        16, 0,   // Gaps in scrPx
        hexagonOffsetMakerLeft // Func to generate offsets per tile [txpx, txpx], can be set null
    );

    return [_gameGrid, _codeGrid, _inventoryGrid];
}


// Register levels
const playerObj = new BeePlayerTile(tilePlayerBee);
levels.registerLevel(testLevel);
levels.registerLevel(level1);
levels.registerLevel(level2);
levels.registerLevel(level3);

let startLevel = level1;


// UI Elements
const onGameReset = (x=-1,y=-1,type=-1) => {
    if (type > -1) {
        audio.stopSound("ui.clickReset");
        audio.playSound("ui.clickReset")
    };

    MEME = window.location.search.includes("meme");

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
}
const iconTrash = new Texture("./assets/images/icons/trash.png");
const iconTrashActive = new Texture("./assets/images/icons/trash_active.png");
const resetButton = new UIButton(
    835, 740, 64, 64,
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
    onGameReset,
    true // Works with overlay open
);

let startMenuSize = 80;
const startMenuButton = new UIButton(
    // centered in canvas (1320x840)
    (1320/2) - (startMenuSize/2), ((840/3)*2) - (startMenuSize/2), startMenuSize, startMenuSize,
    playButtonImg,
    null,
    (x,y,type) => {

        audio.playSound("ui.click");

        if (type === 0) {
            // Start game
            startMenuButton._unregisterClick();
            inStartMenu = false;
            StartGame(startLevel);
        }
    },
    true,
    false,
    false
);

new UIText(855, 40, {"text":"Inventory", "color":"#ffff00"});
new UIText(855, 395, {"text":"Code Area", "color":"#ffff00"});


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
    if (DEBUG) renderText(ctx, 30, 40, `FPS ${FPS.toFixed(1)} (avg: ${avgFPS.toFixed(1)}) | fΔ ${frameDelta.toFixed(2)}ms | Δt ${deltaTime.toFixed(3)}s | elap ${elapsed.toFixed(1)}s | frames ${frameCount}st | lvl ${levels.getCurrentLevelStrid()} (${levels.getCurrentLevelIndex()}) | Modes Enabled: ${MEME ? "Meme; " : ""}${GLOSSY ? "Glossy; " : ""}| MoveActToAnyWalkable: ${CAN_MOVE_ACTION_INTO_ANY_WALKABLE ? "YES" : "NO"}`, "12px monospace", "left", "#00ff00");

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

    // Inner loop for start menu
    let startMenuLoop = () => {
        if (!inStartMenu) return;
    
        renderStartMenu(ctx);

        const [frameDelta, deltaTime, FPS, elapsed, avgFPS] = getTimeParams();
        if (DEBUG) renderText(ctx, 30, 40, `FPS ${FPS.toFixed(1)} (avg: ${avgFPS.toFixed(1)}) | fΔ ${frameDelta.toFixed(2)}ms | Δt ${deltaTime.toFixed(3)}s | elap ${elapsed.toFixed(1)}s | frames ${frameCount}st | Modes Enabled: ${MEME ? "Meme; " : ""}${GLOSSY ? "Glossy; " : ""}| MoveActToAnyWalkable: ${CAN_MOVE_ACTION_INTO_ANY_WALKABLE ? "YES" : "NO"}`, "12px monospace", "left", "#00ff00");
        
        requestAnimationFrame(startMenuLoop);
    }

    startMenuButton._registerClick();

    requestAnimationFrame(startMenuLoop);
}