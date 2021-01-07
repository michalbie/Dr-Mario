"use strict";
import { ScoreboardManager } from "./ScoreboardManager.js";
import { MagnifierManager } from "./MagnifierManager.js";
import { DoctorManager } from "./DoctorManager.js";

const UIManager = class UIManager {
    constructor(gameContainer) {
        this.gameContainer = gameContainer;
        this.backgroundPattern = document.getElementById("background-pattern");

        this.ScoreboardManager = new ScoreboardManager(document.getElementById("scoreboard-container"));
        this.MagnifierManager = new MagnifierManager(document.getElementById("magnifier-container"));
        this.DoctorManager = new DoctorManager(document.getElementById("doctor-animation"));
    }

    prepareLevel = () => {
        this.ScoreboardManager.initializeScoreboard();
    };
};

export { UIManager };
