"use strict";

const scoreAPI = {
    currentScore: 0,
    topScore: window.localStorage.getItem("topScore"),
    currentScoreUpdateEvent: new Event("currentScoreChange"),
    topScoreUpdateEvent: new Event("topScoreChange"),

    getTopScore: () => {
        return topScore;
    },

    setTopScore: (score) => {
        window.localStorage.setItem("topScore", score);
        scoreAPI.topScore = score;
    },

    getCurrentScore: () => {
        return currentScore;
    },

    setCurrentScore: (score) => {
        scoreAPI.currentScore = score;
    },
};

const levelInfoAPI = {
    levelNumber: 0,
    virusesNumber: 4,
};

export { scoreAPI, levelInfoAPI };
