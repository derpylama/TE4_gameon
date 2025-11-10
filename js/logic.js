// Click and input handling
const pressedInputs = [];
const lastClick = { "x": 0, "y": 0, "key": null }; // ex 100,100,left
const inputHooks = []; // Contains func(key, up/down)
const clickHooks = []; // Contains func(x,y,key

function registerInputHook(hook) {
    inputHooks.push(hook);
}

function registerClickHook(hook) {
    clickHooks.push(hook);
}

function unregisterInputHook(hook) {
    const index = inputHooks.indexOf(hook);
    if (index > -1) {
        inputHooks.splice(index, 1);
    }
}

function unregisterClickHook(hook) {
    const index = clickHooks.indexOf(hook);
    if (index > -1) {
        clickHooks.splice(index, 1);
    }
}

window.addEventListener("load", () => {
    document.addEventListener("keydown", (event) => {
        if (!pressedInputs.includes(event.key)) {
            pressedInputs.push(event.key);

            // Call input hooks
            for (const hook of inputHooks) {
                hook(event.key, "down");
            }
        }
    });

    document.addEventListener("keyup", (event) => {
        const index = pressedInputs.indexOf(event.key);
        if (index > -1) {
            pressedInputs.splice(index, 1);

            // Call input hooks
            for (const hook of inputHooks) {
                hook(event.key, "up");
            }
        }
    });

    document.addEventListener("mousedown", (event) => {
        lastClick.x = event.clientX;
        lastClick.y = event.clientY;
        lastClick.key = event.button; // 0: left, 1: middle, 2: right

        // Call click hooks
        for (const hook of clickHooks) {
            hook(lastClick.x, lastClick.y, lastClick.key);
        }
    });
});

function Update(ctx, grid) {}