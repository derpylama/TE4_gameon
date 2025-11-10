class Overlay {
    constructor(texture, clickAreas = null) { // clickAreas are [[[x, y, width, height],function(x,y,type)],...]
        this.texture = texture;
        this.clickAreas = clickAreas;
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
    showOverlay(texture, clickAreas = null) { // clickAreas are [[[x, y, width, height],function(x,y,type)],...]
        this.overlay = texture;

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

    showOverlayObj(overlay) {
        this.showOverlay(overlay.texture, overlay.clickAreas);
    }

    hideOverlay() {
        this.overlay = null;
        inputHooksDisabled = false;
        this.clearHandlers();
    }
}