// Provide handling for images, renderings things and rendering objects of the "GameObject" class.

// Handles if not loaded show purple/black checkerboard
function renderTexture(ctx, texture, x, y, width, height) {
    if (texture.complete) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(texture, x, y, width, height);
    } else {
        // Draw purple/black checkerboard
        const checkerSize = 8;
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
}

function toTexture(texturePath) {
    const img = new Image();
    img.src = texturePath;
    return img;
}

function Render(ctx, grid) {
    const grid = grid.getGrid(); // 2D array

    // Render background image from ./assets/images/background.png
    const backgroundImg = new Image();
    backgroundImg.src = "./assets/images/background.png";

    renderTexture(ctx, backgroundImg, 0, 0, grid[0].length * grid.getTileSize(), grid.length * grid.getTileSize());

    // Render grid by iterating
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const gameObj = grid[r][c];
            if (gameObj) {
                const texture = gameObj.texture;

                // Each image is 16x16 but should be scaled to grid.getTileSize() => int
                ctx.imageSmoothingEnabled = false;
                renderTexture(ctx, texture, c * grid.getTileSize(), r * grid.getTileSize(), grid.getTileSize(), grid.getTileSize());
            }
        }
    }
}