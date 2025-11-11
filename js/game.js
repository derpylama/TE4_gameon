const DEBUG = window.location.search.includes("debug");


// Defines
let lastTime = performance.now();
let startTime = lastTime;
let frameCount = 0;

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
const tilePlayerBee = new Texture("./assets/images/tiles/bee.png");
const tilePlayerBee2 = new Texture("./assets/images/tiles/bee2.png");
const tilePlayerBee3 = new Texture("./assets/images/tiles/bee3.png");
const tilePlayerBee4 = new Texture("./assets/images/tiles/bee4.png");
const tilePlayerBee5 = new Texture("./assets/images/tiles/bee5.png");
const tileBeeHive = new Texture("./assets/images/tiles/hive.png");
const tileLava = new Texture("./assets/images/tiles/lava.png");
const tileStone = new Texture("./assets/images/tiles/stone.png");

//MARK: Test
const tileAnimTest = new AnimatedTexture(
    [
        //"./assets/images/tiles/void.png",
        "./assets/images/tiles/bee.png",
        "./assets/images/tiles/bee2.png",
        "./assets/images/tiles/bee3.png",
        "./assets/images/tiles/bee4.png",
        "./assets/images/tiles/bee5.png",
        "./assets/images/tiles/bee4.png",
        "./assets/images/tiles/bee3.png",
        "./assets/images/tiles/bee2.png",
        "./assets/images/tiles/bee.png",
        //tileNonVoidAbove
    ],
    200 // Switch every 500ms
)

const tileLayeredTest = new LayeredTexture([
    tileAnimTest,
    "./assets/images/tiles/bee.png",
    "./assets/images/tiles/bee2.png",
    "./assets/images/tiles/bee3.png"
]);

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


// Overlays (rendered using `overlayer.showOverlayObj(<overlayObj>)`)
const onOverlayGameOverClickRestart = (x,y,type) => {console.log(x,y,type)};
const overlayGameOver = new Overlay(
    // Texture,         [ [ [x,y,width,height], function(x,y,type) ], ... ]
    overlayGameOverImg, [ [ [400-50,400-50,50,50], onOverlayGameOverClickRestart ] ] // 100x100 button centered
);
const overlayRealityIsWrong = new Overlay(
    overlayRealityIsWrongImg, []
);
const onOverlayWonClickContinue = (x,y,type) => {console.log(x,y,type)};
const overlayWon = new Overlay(
    // Texture,    [ [ [x,y,width,height], function(x,y,type) ], ... ]
    overlayWonImg, [ [ [400-50,400-50,50,50], onOverlayWonClickContinue ] ] // 100x100 button centered
);


// Sounds
audio.addSound("test.1", "./assets/audio/toot.mp3", false);
// audio.addSound("bg.music.1", "./assets/audio/backgroundMusic.wav", true, 0);
// audio.addSound("bg.music.2", "./assets/audio/spring-in-my-step.wav", true, 0);
audio.addPlaylist("bg.music", ["./assets/audio/backgroundMusic.wav", "./assets/audio/spring-in-my-step.wav"], true, 0);

// Instantiate
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

const gameGrid = new Grid(
    0, 0,   // Position in scrPx
    10, 10, // Rows x Cols
    800/10, // Tile Size, scrPx size of a cell
    null, // Func to generate default tiles, can be set null
    0, 0,   // Gaps in scrPx
    null // Func to generate offsets per tile [txpx, txpx], can be set null
);
const inventoryGrid = new Grid(
    846, 32.5,   // Position in scrPx
    4, 4, // Rows x Cols
    800/10, // Tile Size, scrPx size of a cell
    null, // Func to generate default tiles, can be set null
    16, 0,   // Gaps in scrPx
    hexagonOffsetMakerRight // Func to generate offsets per tile [txpx, txpx], can be set null
);
const codeGrid = new Grid(
    893, 393,   // Position in scrPx
    5, 4, // Rows x Cols
    800/10, // Tile Size, scrPx size of a cell
    null, // Func to generate default tiles, can be set null
    16, 0,   // Gaps in scrPx
    hexagonOffsetMakerLeft // Func to generate offsets per tile [txpx, txpx], can be set null
);




//MARK: Test codeblocks
codeBlockEntity1 = new CodeBlockObject("stone");
codeBlockEntity2 = new CodeBlockModifier("left");
codeBlockAction1 = new CodeBlockAction("move.to", ["object", "modifier"]); //also acceps "any"
gameGrid.setTile(1, 1, codeBlockEntity1);
gameGrid.setTile(1, 2, codeBlockAction1);
gameGrid.setTile(1, 3, codeBlockEntity2);


//test the code interpreter
const interpreter = new CodeInterpreter(gameGrid);

interpreter.executeAllRows({
    gameGrid
});

//MARK: End test codeblocks


// gameGrid.setTile(5,5, new GameTile(tileLayeredTest)); //MARK: Test

// gameGrid.setTile(1,4, new GameTile(tileDatadrivenTest)); //MARK: Test
// gameGrid.setTile(2,4, new GameTile(tileDatadrivenTest)); //
// gameGrid.setTile(2,3, new GameTile(tileDatadrivenTest)); //
// gameGrid.setTile(3,3, new GameTile(tileDatadrivenTest)); //

const playerObj = new BeePlayerTile(tilePlayerBee);

gameGrid.setTile(3,3, playerObj)

// Define loops
function GameLoop(gameGrid) {

    Update(ctx, gameGrid);
    Render(ctx, gameGrid);

    const [frameDelta, deltaTime, FPS, elapsed, avgFPS] = getTimeParams();
    if (DEBUG) renderText(ctx, 30, 40, `FPS ${FPS.toFixed(1)} (avg: ${avgFPS.toFixed(1)}) | fΔ ${frameDelta.toFixed(2)}ms | Δt ${deltaTime.toFixed(3)}s | elap ${elapsed.toFixed(1)}s`, "12px monospace", "left", "#00ff00");

    // Schedule the next frame
    requestAnimationFrame(
        () => GameLoop(gameGrid)
    );
}

// Function to start the game
function StartGame(gameGrid) {
    audio.playSound("bg.music");
    GameLoop(gameGrid);
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
                StartGame(gameGrid);
            }
        }
    }
    registerClickHook(startMenuClickHook);

    // Inner loop for start menu
    let startMenuLoop = () => {
        if (!inStartMenu) return;
    
        renderStartMenu(ctx);

        const [frameDelta, deltaTime, FPS, elapsed, avgFPS] = getTimeParams();
        if (DEBUG) renderText(ctx, 30, 40, `FPS ${FPS.toFixed(1)} (avg: ${avgFPS.toFixed(1)}) | fΔ ${frameDelta.toFixed(2)}ms | Δt ${deltaTime.toFixed(3)}s | elap ${elapsed.toFixed(1)}s`, "12px monospace", "left", "#00ff00");
        
        requestAnimationFrame(startMenuLoop);
    }
    requestAnimationFrame(startMenuLoop);
}