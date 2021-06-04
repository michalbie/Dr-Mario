"use strict";

const GameStatusNotification = class GameStatusNotification {
    constructor(gameStatusContainer) {
        this.gameStatusContainer = gameStatusContainer;
        this.image = this.gameStatusContainer.querySelector("img");

        this.gameStatusContainer.addEventListener("stageCompleted", this.showStageCompleted);
        this.gameStatusContainer.addEventListener("gameOver", this.showGameOver);
    }

    showStageCompleted = () => {
        this.image.src = "assets/sc.png";
        this.gameStatusContainer.style.visibility = "visible";

        setTimeout(() => {
            this.gameStatusContainer.style.visibility = "hidden";
            document.getElementById("game-board").dispatchEvent(new Event("prepareNextLevel"));
            document.getElementById("background-pattern").dispatchEvent(new Event("prepareNextLevel"));
            document.getElementById("level-number").dispatchEvent(new Event("prepareNextLevel"));
            document.getElementById("viruses-number").dispatchEvent(new Event("prepareNextLevel"));
        }, 5000);
    };

    showGameOver = () => {
        this.image.src = "assets/go.png";
        this.gameStatusContainer.style.visibility = "visible";
        document.getElementById("doctor-animation").src = "assets/go_dr.png";
    };
};

export { GameStatusNotification };
