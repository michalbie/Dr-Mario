import { levelInfoAPI } from "../../globals.js";

("use strict");

const LevelInfoManager = class LevelInfoManager {
    constructor(infoContainer) {
        this.infoContainer = infoContainer;
        this.levelNumberContainer = document.getElementById("level-number");
        this.virusesNumberContainer = document.getElementById("viruses-number");

        this.initializeInfo();
    }

    initializeInfo = () => {
        const createDigit = () => {
            let digitContainer = document.createElement("div");
            digitContainer.setAttribute("class", "digit");
            let image = document.createElement("img");
            image.src = "assets/digits/0.png";
            digitContainer.appendChild(image);
            return digitContainer;
        };

        for (let i = 0; i < 2; i++) {
            let levelDigit = createDigit();
            let virusDigit = createDigit();
            this.levelNumberContainer.appendChild(levelDigit);
            this.virusesNumberContainer.appendChild(virusDigit);
        }

        this.updateLevelNumber();
        this.updateVirusesNumber();

        this.levelNumberContainer.addEventListener("prepareNextLevel", () => {
            this.updateLevelNumber();
        });

        this.virusesNumberContainer.addEventListener("prepareNextLevel", () => {
            this.updateVirusesNumber();
        });

        this.virusesNumberContainer.addEventListener("virusKilled", () => {
            this.updateVirusesNumber();
        });
    };

    updateLevelNumber = () => {
        let currentLevelNumber = levelInfoAPI.levelNumber;
        let stringTemplate = currentLevelNumber.toString();
        stringTemplate = stringTemplate.padStart(2, 0);
        let digits = this.levelNumberContainer.querySelectorAll(".digit");

        for (let i = 0; i < 2; i++) {
            digits[i].querySelector("img").src = `assets/digits/${stringTemplate[i]}.png`;
        }
    };

    updateVirusesNumber = () => {
        let currentVirusesNumber = levelInfoAPI.virusesNumber;
        let stringTemplate = currentVirusesNumber.toString();
        stringTemplate = stringTemplate.padStart(2, 0);
        let digits = this.virusesNumberContainer.querySelectorAll(".digit");

        for (let i = 0; i < 2; i++) {
            digits[i].querySelector("img").src = `assets/digits/${stringTemplate[i]}.png`;
        }
    };
};

export { LevelInfoManager };
