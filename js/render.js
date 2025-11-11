// The default size of each checker square
const checkerSize = (800/10)/2;

// Define offset to account for border texture, each txPx is 5* scrPx, we add 4 txPx offset in both directions
const borderOffset = [20, 20]; 

// Main texture class ensuring they are loaded
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

    getImage(_) {
        return this.image;
    }
}

// Animated texture class for handling frame-based animations
class AnimatedTexture {
    // Frames are an array of Texture objects or strings
    constructor(frames, frameDuration) {
        this.frames = frames.map(frame => {
            if (typeof frame === 'string') {
                return new Texture(frame);
            } else {
                return frame;
            }
        });

        this.frameDuration = frameDuration; // in milliseconds
        this.startTime = null;
    }

    isLoaded() {
        return this.frames.every(frame => frame.isLoaded());
    }

    getImage(cellContext={"row":null, "col":null}) {
        // First time call sets startTime
        // Then we use elapsed time to determine current frame according to frameDuration
        if (this.startTime === null) {
            this.startTime = Date.now();
        }
        const elapsed = Date.now() - this.startTime;
        const currentFrameIndex = Math.floor(elapsed / this.frameDuration) % this.frames.length;
        return this.frames[currentFrameIndex].getImage(cellContext);
    }
}

// Layered texture class for drawing multiple textures ontop of each other in order
class LayeredTexture {
    constructor(texturePaths) {
        // this.textures is an array of Texture/AnimatedTexture objects but accepts strings as well
        this.textures = texturePaths.map(path => {
            if (typeof path === 'string') {
                return new Texture(path);
            } else {
                return path;
            }
        });
    }

    isLoaded() {
        return this.textures.every(texture => texture.isLoaded());
    }

    getImage(cellContext={"row":null, "col":null}) {
        // return array of images
        return this.textures.map(texture => texture.getImage(cellContext));
    }
}

// DataDrivenTexture has `selector(selectBetween, cellContext) => <Texture/AnimatedTexture/LayeredTexture>`
//                   and [selectBetween] which is all textures to be selected between (given to ensure isLoaded safety)
class DataDrivenTexture {
    constructor(textureSelector, selectedBetween = []) {
        this.textureSelector = textureSelector;
        this.selectedBetween = selectedBetween;
    }

    isLoaded() {
        return this.selectedBetween.every(texture => texture.isLoaded());
    }

    getImage(cellContext={"row":null, "col":null}) {
        const selectedTexture = this.textureSelector(this.selectedBetween, cellContext);
        if (selectedTexture === null || selectedTexture === undefined) {
            return null;
        }
        return selectedTexture.getImage();
    }
}

function renderText(ctx, x, y, text, text_font, text_align, text_color="#ffffff") {
    ctx.fillStyle = text_color;
    ctx.font = text_font;
    ctx.textAlign = text_align;
    ctx.fillText(text, x, y);
}

class Text {
    constructor(x, y, text, text_font, text_align, text_color="#ffffff") {
        this.pos = new Position(x,y);
        this.text = text;
        this.text_font = text_font;
        this.text_align = text_align;
        this.text_color = text_color;
        this.active = true;
    }
    
    render(ctx) {
        if (this.active) {
            renderText(ctx, this.pos.x, this.pos.y, this.text, this.text_font, this.text_align, this.text_color);
        }
    }
}

// Helper to draw a checkerboard pattern instead of a texture
function drawCheckerboard(ctx, x, y, width, height, checkerSize, opacity=1.0, text=null) {
    for (let row = 0; row < height / checkerSize; row++) {
        for (let col = 0; col < width / checkerSize; col++) {
            if ((row + col) % 2 === 0) {
                ctx.fillStyle = `rgba(128, 0, 128, ${opacity})`; // Purple
            } else {
                ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`; // Black
            }

            let calcX = x + col * checkerSize;
            let calcY = y + row * checkerSize;

            calcX += borderOffset[0];
            calcY += borderOffset[1];

            ctx.fillRect(calcX, calcY, checkerSize, checkerSize);
        }
    }

    // If text provided, render it centered in the area
    if (text !== null) {
        const fontSize = Math.floor(Math.min(width, height) / 8);
        const textX = x + borderOffset[0] + (width / 2);
        const textY = y + borderOffset[1] + (height / 2) + (fontSize / 4); // Centered vertically

        renderText(
            ctx,
            textX,
            textY,
            text,
            `${fontSize}px Arial`,
            "center",
            "#ffffff"
        );
    }

}

// Handles if not loaded show purple/black checkerboard
function renderTexture(ctx, texture, x, y, width, height, cellContext={"row":null, "col":null}) {

    // Does cellContext have "className" property?
    let className = (cellContext && cellContext !== null && (cellContext.className ?? false)) ? (cellContext.className + " ") : "";

    if (texture.isLoaded()) {
        drawX = x + borderOffset[0];
        drawY = y + borderOffset[1];
        ctx.imageSmoothingEnabled = false;

        let textures = [];
        if (texture instanceof LayeredTexture) {
            textures = texture.getImage(cellContext);
        } else {
            textures.push(texture.getImage(cellContext));
        }

        for (const img of textures) {
            let $valid = true;
            if (img !== null) {
                try {
                    ctx.drawImage(img, drawX, drawY, width, height);
                } catch (e) {
                    $valid = false;
                }
            } else {
                $valid = false;
            }

            // If error drawing image, draw checkerboard instead
            if (!$valid) drawCheckerboard(ctx, x, y, width, height, checkerSize, 1.0, className + (DEBUG ? "Error": ""));
        }
    } else {
        // Draw purple/black checkerboard
        drawCheckerboard(ctx, x, y, width, height, checkerSize, 1.0, className + (DEBUG ? "Loading" : ""));
    }
}

// Function to render a grid object
function renderGrid(gridObj) {
    const pos = gridObj.getPos();
    const gridData = gridObj.getGrid();
    const gaps = gridObj.getGaps();

    // Render grid by iterating
    for (let r = 0; r < gridData.length; r++) {
        for (let c = 0; c < gridData[r].length; c++) {
            const gameObj = gridData[r][c];

            const calculatedOffset = gridObj.getOffset(r, c);

            let x = pos[0] + (c * gridObj.getTileSize()) + (c * gaps[0]) + calculatedOffset[0]
            let y = pos[1] + (r * gridObj.getTileSize()) + (r * gaps[1]) + calculatedOffset[1]

            if (gameObj !== null) {
                const texture = gameObj.texture;

                // Each image is 16x16 but should be scaled to gridObj.getTileSize() => int
                ctx.imageSmoothingEnabled = false;
                const cellContext = {"row": r, "col": c, "className": gameObj.constructor.name};
                renderTexture(ctx, texture, x, y, gridObj.getTileSize(), gridObj.getTileSize(), cellContext);
            }

            // If debug mode draw a border inside the tile
            if (DEBUG) {

                // Null => Checkerboard
                if (gameObj === null) {
                    // Draw purple/black checkerboard for empty tiles
                    drawCheckerboard(ctx, x, y, gridObj.getTileSize(), gridObj.getTileSize(), checkerSize, 0.5); // Should be 0.35
                }

                // Outlines
                ctx.strokeStyle = "red";
                ctx.lineWidth = 1;
                ctx.strokeRect(
                    x+borderOffset[0],
                    y+borderOffset[1],
                    gridObj.getTileSize(),
                    gridObj.getTileSize()
                );
            }

            // If gameObj is instance of or instance of descendant of CodeBlock, render its .text
            if (gameObj instanceof CodeBlock) {
                let text = gameObj.text;
                let font = "Arial";
                let align = "center";
                let color = "#ffffff";
                let fontSize = Math.floor(gridObj.getTileSize() / 4);
                const textX = x + borderOffset[0] + (gridObj.getTileSize() / 2);
                const textY = y + borderOffset[1] + (gridObj.getTileSize() / 2) + (fontSize / 4); // Centered vertically

                // If text is object check for fontSize, font, color, align fields
                if (typeof text === "object" && text !== null) {
                    if (text.fontSize !== undefined) {
                        fontSize = text.fontSize;
                    }
                    if (text.fontSizeOffset !== undefined) {
                        fontSize += text.fontSizeOffset;
                    }
                    if (text.font !== undefined) {
                        font = text.font;
                    }
                    if (text.color !== undefined) {
                        color = text.color;
                    }
                    if (text.align !== undefined) {
                        align = text.align;
                    }
                    if (text.text !== undefined) {
                        text = text.text;
                    }
                }

                renderText(
                    ctx,
                    textX,
                    textY,
                    text,
                    `${fontSize}px ${font}`,
                    align,
                    color
                );
            }
        }
    }
}

// Helper function to render overlays if set
function renderOverlays(ctx) {
    const currentOverlay = overlayer.getCurrentOverlay();
    if (currentOverlay !== null) {
        renderTexture(ctx, currentOverlay, borderOffset[0], borderOffset[1], 800, 800);
    }
}


// Main render function (called in loop)
function Render(ctx) {

    // Render backgrounds
    renderTexture(ctx, gridBackgroundImg, 0, 0, 800, 800);
    renderTexture(ctx, invBackgroundImg, 800, 0, 480, 800);

    // Render grid
    for (const gridObj of currentGrids) {
        renderGrid(gridObj);
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

    // If overlay render it on top
    renderOverlays(ctx);
}


function renderStartMenu(ctx) {
    // Render start menu background
    renderTexture(ctx, startBackgroundImg, 0, 0, 1320, 840);

    // Render play button centered of playButtonImg (64x64) inside the canvas (1320x840)
    renderTexture(ctx, playButtonImg, (1320/2)-(64/2), (840/2)-(64/2), 64, 64);
}