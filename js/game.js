const DEBUG = window.location.search.includes("debug");


// Defines
const TargetFPS = 60;
let currentFPS = 0;
let deltaTime = 0;

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
const tileBeeHive = new Texture("./assets/images/tiles/hive.png");
const tileLava = new Texture("./assets/images/tiles/lava.png");
const tileStone = new Texture("./assets/images/tiles/stone.png");

//MARK: Test
// const tileAnimTest = new AnimatedTexture(
//     [
//         "./assets/images/tiles/void.png",
//         tileNonVoidAbove
//     ],
//     500 // Switch every 500ms
// )

// const tileLayeredTest = new LayeredTexture([
//     tileAnimTest,
//     "./assets/images/tiles/bee.png"
// ]);


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
// let hexagonOffsetMaker = (row, col) => {
//     return [(row % 2 === 0 ? 0 : -((800/10)/2)), 0];
// };

// let generateVoids = (row, col) => {
//     return (row === 0 ? new DisabledVoidTile_NonVoidAbove(tileNonVoidAbove) : new DisabledVoidTile(tileVoid));
// };

const gameGrid = new Grid(
    10, 10, // Rows x Cols
    800/10, // Tile Size, scrPx size of a cell
    null, // Func to generate default tiles, can be set null
    0, 0,   // Gaps in scrPx
    null // Func to generate offsets per tile [txpx, txpx], can be set null
);
const inventoryGrid = new Grid(4, 4, 800/10, null);
const codeGrid = new Grid(4, 5, 800/10, null);

// gameGrid.setTile(5,5, new GameTile(tileLayeredTest)); //MARK: Test

// Define loops
function GameLoop(gameGrid) {
    //TODO: Things

    Update(ctx, gameGrid);
    Render(ctx, gameGrid);

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
        requestAnimationFrame(startMenuLoop);
    }
    requestAnimationFrame(startMenuLoop);
}