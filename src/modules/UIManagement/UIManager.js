"use strict";
import { ScoreboardManager } from "./ScoreboardManager.js";

const UIManager = class UIManager {
    constructor(gameContainer) {
        this.gameContainer = gameContainer;
        this.backgroundPattern = document.getElementById("background-pattern");

        this.ScoreboardManager = new ScoreboardManager(document.getElementById("scoreboard-container"));
    }

    prepareLevel = () => {
        this.ScoreboardManager.initializeScoreboard();
    };
};

export { UIManager };
