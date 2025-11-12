class Overlay {
    constructor(texture, clickAreas = null) { // clickAreas are [[[x, y, width, height],function(x,y,type)],...]
        this.texture = texture;
        this.clickAreas = clickAreas;
        this.texts = {};
    }

    getTexture() {
        return this.texture;
    }

    getClickAreas() {
        return this.clickAreas;
    }

    setText(key, text) {
        this.texts[key] = text;
    }

    additionalRenders(ctx) {
        if (this.texts.hasOwnProperty("reason")) {

            let text = this.texts["reason"] || "";

            let textX = 430;
            let textY = 560;
            let fontSize = 20;
            let font = getFont();
            let align = "center";
            let color = "#ff0000";

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

            renderText(ctx, textX, textY, text, `${fontSize}px ${font}`, align, color);
        }
    }
}

class OverlayHandler {
    constructor() {
        this.overlay = null;
        this.handler = null;
    }

    getCurrentOverlay() {
        return this.overlay;
    }

    clearHandlers() {
        if (this.handler !== null) {
            unregisterClickHook(this.handler);
            this.handler = null;
            inputHooksDisableExclusions = inputHooksDisableExclusions.filter(hook => hook !== this.handler);
        }
    }

    // Do note overlays are automatically offset by borderOffset when handling clicks and in rendering
    showOverlayObj(overlay) { // clickAreas are [[[x, y, width, height],function(x,y,type)],...]
        this.overlay = overlay;

        let clickAreas = overlay.getClickAreas();
        this.handler = (x,y,type)=>{
            if (clickAreas !== null) {
                for (const area of clickAreas) {
                    if (!Array.isArray(area) || area.length !== 2) continue;
                    let [ax, ay, aw, ah] = area[0];
                    ax += borderOffset[0];
                    ay += borderOffset[1];
                    x -= borderOffset[0];
                    y -= borderOffset[1];
                    const callback = area[1];
                    if (x >= ax && x <= ax + aw && y >= ay && y <= ay + ah) {
                        callback(x, y, type);
                    }
                }
            }
        };

        inputHooksDisableExclusions.push(this.handler);

        inputHooksDisabled = true;

        registerClickHook(this.handler);
    }

    hideOverlay() {
        this.overlay = null;
        inputHooksDisabled = false;
        this.clearHandlers();
    }
}