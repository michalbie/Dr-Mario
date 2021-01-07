"use strict";

const BackgroundManager = class BackgroundManager {
    constructor(background) {
        this.background = background;
        this.currentDeg = 0;

        this.background.addEventListener("prepareNextLevel", this.changeBackgroundColor);
    }

    changeBackgroundColor = () => {
        this.currentDeg += 30;
        this.background.style.filter = `hue-rotate(${this.currentDeg}deg)`;
    };
};

export { BackgroundManager };
