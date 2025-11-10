const TargetFPS = 60;
let currentFPS = 0;
let deltaTime = 0;

const gameCanvas = document.getElementById("canvas");
const ctx = gameCanvas ? gameCanvas.getContext("2d") : null;

const grid = new Grid(10, 10);

// Define loops
function GameLoop(grid) {
    //TODO: Things

    Update(ctx, grid);
    Render(ctx, grid);

    // Schedule the next frame
    requestAnimationFrame(GameLoop);
}

if (gameCanvas) {
    // call gameloop
    GameLoop(grid);
}