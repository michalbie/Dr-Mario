"use strict";

const UIManager = class UIManager {
    constructor(gameContainer) {
        console.log(gameContainer);
        this.gameContainer = gameContainer;
        this.backgroundPattern = document.getElementById("background-pattern");
    }

    prepareLevel = () => {
        //this.initializeBackgroundPattern();
    };
};

export { UIManager };
