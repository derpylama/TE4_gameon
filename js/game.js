const DEBUG = window.location.search.includes("debug");


// Defines
const TargetFPS = 60;
let currentFPS = 0;
let deltaTime = 0;

const gameCanvas = document.getElementById("canvas");
const ctx = gameCanvas ? gameCanvas.getContext("2d") : null;


// Textures
const borderImg = new Texture("./assets/images/border.png");
const gridBackgroundImg = new Texture("./assets/images/grid.png");
const invBackgroundImg = new Texture("./assets/images/inventory.png");
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