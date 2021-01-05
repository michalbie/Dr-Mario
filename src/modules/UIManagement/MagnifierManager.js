"use strict";

const MagnifierManager = class MagnifierManager {
    constructor(magnifier) {
        this.magnifierContainer = magnifier;
        this.magnifier = document.getElementById("magnifier");
        this.blueVirus = document.getElementById("bl-virus");
        this.brownVirus = document.getElementById("br-virus");
        this.yellowVirus = document.getElementById("yl-virus");

        this.initializeViruses();
    }

    initializeViruses = () => {
        this.blueVirus.addEventListener("singleVirusKilled", this.knockDownVirusAnimation);
        this.brownVirus.addEventListener("singleVirusKilled", this.knockDownVirusAnimation);
        this.yellowVirus.addEventListener("singleVirusKilled", this.knockDownVirusAnimation);

        this.blueVirus.addEventListener("everyVirusKilled", this.killVirusAnimation);
        this.brownVirus.addEventListener("everyVirusKilled", this.killVirusAnimation);
        this.yellowVirus.addEventListener("everyVirusKilled", this.killVirusAnimation);

        this.blueMoveInterval = this.moveVirusInCircle(this.blueVirus, 1);
        this.brownMoveInterval = this.moveVirusInCircle(this.brownVirus, 2);
        this.yellowMoveInterval = this.moveVirusInCircle(this.yellowVirus, 3);
        this.moveIntervalPaused = false;
    };

    moveVirusInCircle = (virus, position) => {
        var angle = Math.PI;

        if (position == 1) {
            angle = 1.2 * Math.PI;
        } else if (position == 2) {
            angle = Math.PI / 2;
        } else if (position == 3) {
            angle = 1.8 * Math.PI;
        }

        const rotate = () => {
            let radius = this.magnifier.height / 2 - 0.55 * (this.magnifier.height / 2);
            let originX = this.magnifier.width / 2 - 0.2 * (this.magnifier.height / 2);
            let originY = this.magnifier.height / 2 - 0.2 * (this.magnifier.height / 2);

            virus.style.top = radius * Math.sin(angle) + originX + "px";
            virus.style.left = radius * Math.cos(angle) + originY + "px";
            if (angle >= 360) {
                angle = 0;
            }
            angle += 0.2;
        };

        rotate();

        let interval = setInterval(() => {
            if (this.moveIntervalPaused == false) rotate(virus);
        }, 1000);

        return interval;
    };

    setKnockDownAnimation = (target) => {
        let color = target.id.split("-")[0];
        this.moveIntervalPaused = true;
        target.src = `../../../assets/magnifier/${color}/die.gif`;
    };

    canResumeMoving = () => {
        let dieRegex = /\/die.gif/g;
        let dyingNumber = 0;
        let blueVirusDying = dieRegex.test(this.blueVirus.src);
        let brownVirusDying = dieRegex.test(this.brownVirus.src);
        let yellowVirusDying = dieRegex.test(this.yellowVirus.src);

        if (blueVirusDying) dyingNumber += 1;
        if (brownVirusDying) dyingNumber += 1;
        if (yellowVirusDying) dyingNumber += 1;

        if (dyingNumber > 1) return false;
        return true;
    };

    knockDownVirusAnimation = (e) => {
        setTimeout(() => {
            if (this.canResumeMoving()) this.moveIntervalPaused = false;
            e.target.src = `../../../assets/magnifier/${color}/move.gif`;
            e.target.style.filter = "";
        }, 5000);

        e.target.style.filter = "contrast(150%)";
        this.setKnockDownAnimation(e.target);
    };

    killVirusAnimation = (e) => {
        setTimeout(() => {
            if (this.canResumeMoving()) this.moveIntervalPaused = false;
            e.target.src = ``;
            e.target.style.filter = "";
        }, 5000);

        e.target.style.filter = "contrast(150%)";
        this.setKnockDownAnimation(e.target);
    };
};

export { MagnifierManager };
