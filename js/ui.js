const existingUiElements = [];

class UIButton {
    constructor(x,y, width,height, texture, text, onClick, worksWhenOverlay = false, register=true, global=true) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.texture = texture;
        this.text = text;
        this.onClick = onClick;
        this.clickHandler = null;
        this.worksWhenOverlay = worksWhenOverlay;

        this.renderedState = null; // [x,y,width,height] of last render

        if (register) this._registerClick();
        if (global) existingUiElements.push(this);
    }

    _registerClick() {
        this.clickHandler = (x, y, type) => {
            x -= borderOffset[0];
            y -= borderOffset[1];
            let canvasBounds = canvas.getBoundingClientRect();
            x -= canvasBounds.left;
            y -= canvasBounds.top;

            if (x >= this.x && x <= this.x + this.width &&
                y >= this.y && y <= this.y + this.height) {
                if (this.onClick) {
                    this.onClick(x, y, type);
                }
            }
        };

        registerClickHook(this.clickHandler);

        if (this.worksWhenOverlay) {
            inputHooksDisableExclusions.push(this.clickHandler);
        }
    }

    _unregisterClick() {
        unregisterClickHook(this.clickHandler);
    }

    render(ctx) {
        renderTexture(ctx, this.texture, this.x, this.y, this.width, this.height);

        if (this.text !== null) {
            let text = this.text;
            let font = getFont();
            let align = "center";
            let color = "#ffffff";
            let fontSize = Math.floor(this.height / 2);
            let textX = this.x + (this.width / 2) + (fontSize/3)*2;
            let textY = this.y + (this.height / 2) + fontSize;

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
                if (text.xOffset !== undefined) {
                    textX += text.xOffset;
                }
                if (text.yOffset !== undefined) {
                    textY += text.yOffset;
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