// Provide handling for images, renderings things and rendering objects of the "GameObject" class.
const checkerSize = (720/16)/2;

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

    // Render background image
    renderTexture(ctx, backgroundImg, 0, 0, 1280, 720);

    // Render grid by iterating
    for (let r = 0; r < gridData.length; r++) {
        for (let c = 0; c < gridData[r].length; c++) {
            const gameObj = gridData[r][c];
            if (gameObj != null) {
                const texture = gameObj.texture;

                // Each image is 16x16 but should be scaled to gridObj.getTileSize() => int
                ctx.imageSmoothingEnabled = false;
                renderTexture(ctx, texture, c * gridObj.getTileSize(), r * gridObj.getTileSize(), gridObj.getTileSize(), gridObj.getTileSize());
            } else {
                // Draw purple/black checkerboard for empty tiles
                drawCheckerboard(ctx, c * gridObj.getTileSize(), r * gridObj.getTileSize(), gridObj.getTileSize(), gridObj.getTileSize(), checkerSize);
            }
        }
    }
}