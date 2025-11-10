const DEBUG = window.location.search.includes("debug");


// Defines
const TargetFPS = 60;
let currentFPS = 0;
let deltaTime = 0;

const gameCanvas = document.getElementById("canvas");
const ctx = gameCanvas ? gameCanvas.getContext("2d") : null;


// Systems
const audio = new SoundHandler();


// Textures
const startBackgroundImg = new Texture("./assets/images/startmenu.png");
const playButtonImg = new Texture("./assets/images/play.png");
const borderImg = new Texture("./assets/images/border.png");
const gridBackgroundImg = new Texture("./assets/images/grid.png");
const invBackgroundImg = new Texture("./assets/images/inventory.png");
const tileVoid = new Texture("./assets/images/tiles/void.png");
const tileNonVoidAbove = new Texture("./assets/images/tiles/void-dirt.png");


// Sounds
audio.addSound("test.1", "./assets/audio/toot.mp3", false);
// audio.addSound("bg.music.1", "./assets/audio/backgroundMusic.wav", true, 0);
// audio.addSound("bg.music.2", "./assets/audio/spring-in-my-step.wav", true, 0);
audio.addPlaylist("bg.music", ["./assets/audio/backgroundMusic.wav", "./assets/audio/spring-in-my-step.wav"], true, 0);


// Instantiate
const gameGrid = new Grid(10, 10, 800/10, (row, col) => {return (row === 0 ? new DisabledVoidTile_NonVoidAbove(tileNonVoidAbove) : new DisabledVoidTile(tileVoid));});
const inventoryGrid = new Grid(5, 3, 800/10, null);
const codeGrid = new Grid(5, 1, 800/10, null);

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

function StartGame(gameGrid) {
    audio.playSound("bg.music");
    GameLoop(gameGrid);
}

if (gameCanvas) {
    // call gameloop
    //GameLoop(grid);

    // Start menu
    var inStartMenu = true;

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

    let startMenuLoop = () => {
        if (!inStartMenu) return;
        renderStartMenu(ctx)
        requestAnimationFrame(startMenuLoop);
    }
    requestAnimationFrame(startMenuLoop);
}