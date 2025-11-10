const DEBUG = true;


// Defines
const TargetFPS = 60;
let currentFPS = 0;
let deltaTime = 0;

const gameCanvas = document.getElementById("canvas");
const ctx = gameCanvas ? gameCanvas.getContext("2d") : null;


// Textures
const backgroundImg = new Texture("./assets/images/background.png");
const tileVoid = new Texture("./assets/images/tiles/void.png");
const tileNonVoidAbove = new Texture("./assets/images/tiles/void-dirt.png");


// Instantiate
const grid = new Grid(10, 10, 800/10, (row, col) => {return (row === 0 ? new DisabledVoidTile_NonVoidAbove(tileNonVoidAbove) : new DisabledVoidTile(tileVoid));});

// Define loops
function GameLoop(grid) {
    //TODO: Things

    Update(ctx, grid);
    Render(ctx, grid);

    // Schedule the next frame
    requestAnimationFrame(
        () => GameLoop(grid)
    );
}

if (gameCanvas) {
    // call gameloop
    GameLoop(grid);
}