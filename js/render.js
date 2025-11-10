// Provide handling for images, renderings things and rendering objects of the "GameObject" class.
const checkerSize = (800/10)/2;

const borderOffset = [20, 20]; // Each txPx is 5* scrPx, we add 4 txPx offset in both directions

class Texture {
    constructor(texturePath) {
        this.image = new Image();
        this.image.src = texturePath;
        this.loaded = false;

        if (this.image.complete) {
            this.loaded = true;
        } else {
            this.image.onload = () => {
                this.loaded = true;
            };
        }
    }

    isLoaded() {
        return this.loaded;
    }

    getImage() {
        return this.image;
    }
}

function drawCheckerboard(ctx, x, y, width, height, checkerSize) {
    for (let row = 0; row < height / checkerSize; row++) {
        for (let col = 0; col < width / checkerSize; col++) {
            if ((row + col) % 2 === 0) {
                ctx.fillStyle = "#800080"; // Purple
            } else {
                ctx.fillStyle = "#000000"; // Black
            }
            ctx.fillRect(x + col * checkerSize, y + row * checkerSize, checkerSize, checkerSize);
        }
    }
}

// Handles if not loaded show purple/black checkerboard
function renderTexture(ctx, texture, x, y, width, height) {
    x += borderOffset[0];
    y += borderOffset[1];
    if (texture.isLoaded()) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(texture.getImage(), x, y, width, height);
    } else {
        // Draw purple/black checkerboard
        drawCheckerboard(ctx, x, y, width, height, checkerSize);
    }
}

function Render(ctx, gridObj) {
    const gridData = gridObj.getGrid();
    const gaps = gridObj.getGaps();

    // Render backgrounds
    renderTexture(ctx, gridBackgroundImg, 0, 0, 800, 800);
    renderTexture(ctx, invBackgroundImg, 800, 0, 480, 800);

    // Render grid by iterating
    for (let r = 0; r < gridData.length; r++) {
        for (let c = 0; c < gridData[r].length; c++) {
            const gameObj = gridData[r][c];
            if (gameObj != null) {
                const texture = gameObj.texture;

                // Each image is 16x16 but should be scaled to gridObj.getTileSize() => int
                ctx.imageSmoothingEnabled = false;
                renderTexture(ctx, texture, (c * gridObj.getTileSize())+(c * gaps[0]), (r * gridObj.getTileSize())+(r * gaps[1]), gridObj.getTileSize(), gridObj.getTileSize());
            } else {
                // Draw purple/black checkerboard for empty tiles
                drawCheckerboard(ctx, (c * gridObj.getTileSize())+(c * gaps[0]), (r * gridObj.getTileSize())+(r * gaps[1]), gridObj.getTileSize(), gridObj.getTileSize(), checkerSize);
            }

            // If debug mode draw a border inside the tile
            if (DEBUG) {
                ctx.strokeStyle = "red";
                ctx.lineWidth = 1;
                ctx.strokeRect((c * gridObj.getTileSize()) + borderOffset[0] + (c * gaps[0]), (r * gridObj.getTileSize()) + borderOffset[1] + (r * gaps[1]), gridObj.getTileSize(), gridObj.getTileSize());
            }
        }
    }

    // Render border
    renderTexture(ctx, borderImg, 0-borderOffset[0], 0-borderOffset[1], 1320, 840);

    // If debug draw a purple border around the 800x800 grid and then one for 800,0 > 1280,800
    if (DEBUG) {
        ctx.strokeStyle = "hotpink";
        ctx.lineWidth = 4;
        ctx.strokeRect(borderOffset[0], borderOffset[1], 800, 800);
        ctx.strokeRect(800 + borderOffset[0], borderOffset[1], 480, 800);
    }
}