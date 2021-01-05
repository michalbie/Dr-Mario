import { scoreAPI } from "../../globals.js";

("use strict");

const ScoreboardManager = class ScoreboardManager {
    constructor(scoreboardContainer) {
        this.scoreboardContainer = scoreboardContainer;
        this.topScoreContainer = scoreboardContainer.querySelector("#top-score-container");
        this.currentScoreContainer = scoreboardContainer.querySelector("#current-score-container");
    }

    initializeScoreboard = () => {
        const createDigit = () => {
            let digitContainer = document.createElement("div");
            digitContainer.setAttribute("class", "digit");
            let image = document.createElement("img");
            image.src = "../../../assets/digits/0.png";
            digitContainer.appendChild(image);
            return digitContainer;
        };

        for (let i = 0; i < 7; i++) {
            let topScoreDigit = createDigit();
            let currentScoreDigit = createDigit();
            this.topScoreContainer.appendChild(topScoreDigit);
            this.currentScoreContainer.appendChild(currentScoreDigit);
        }

        this.updateTopScore();

        this.topScoreContainer.addEventListener("topScoreChange", () => {
            this.updateTopScore();
        });

        this.currentScoreContainer.addEventListener("currentScoreChange", () => {
            this.updateCurrentScore();
        });
    };

    updateTopScore = () => {
        let topScore = scoreAPI.topScore;
        let stringTemplate = topScore.toString();
        stringTemplate = stringTemplate.padStart(7, 0);
        let digits = this.topScoreContainer.querySelectorAll(".digit");

        for (let i = 0; i < 7; i++) {
            digits[i].querySelector("img").src = `../../../assets/digits/${stringTemplate[i]}.png`;
        }
    };

    updateCurrentScore = () => {
        let currentScore = scoreAPI.currentScore;
        let stringTemplate = currentScore.toString();
        stringTemplate = stringTemplate.padStart(7, 0);
        let digits = this.currentScoreContainer.querySelectorAll(".digit");

        for (let i = 0; i < 7; i++) {
            digits[i].querySelector("img").src = `../../../assets/digits/${stringTemplate[i]}.png`;
        }
    };
};

export { ScoreboardManager };
