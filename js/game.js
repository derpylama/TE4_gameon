const DEBUG = window.location.search.includes("debug");


// Defines
const TargetFPS = 60;
let currentFPS = 0;
let deltaTime = 0;

const gameCanvas = document.getElementById("canvas");
const ctx = gameCanvas ? gameCanvas.getContext("2d") : null;


// Textures
const startBackgroundImg = new Texture("./assets/images/startmenu.png");
const playButtonImg = new Texture("./assets/images/play.png");
const borderImg = new Texture("./assets/images/border.png");
const gridBackgroundImg = new Texture("./assets/images/grid.png");
const invBackgroundImg = new Texture("./assets/images/inventory.png");
const tileVoid = new Texture("./assets/images/tiles/void.png");
const tileNonVoidAbove = new Texture("./assets/images/tiles/void-dirt.png");


// Instantiate
const grid = new Grid(10, 10, 800/10, (row, col) => {return (row === 0 ? new DisabledVoidTile_NonVoidAbove(tileNonVoidAbove) : new DisabledVoidTile(tileVoid));});
const inventoryGrid = new Grid(5, 3, 800/10, null);
const codeGrid = new Grid(5, 1, 800/10, null);

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
                GameLoop(grid);
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