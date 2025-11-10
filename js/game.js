const TargetFPS = 60;
let currentFPS = 0;
let deltaTime = 0;

const gameCanvas = document.getElementById("canvas");
const ctx = gameCanvas ? gameCanvas.getContext("2d") : null;

const grid = new Grid(10, 10, 720/16);

const backgroundImg = new Texture("./assets/images/background.png");

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