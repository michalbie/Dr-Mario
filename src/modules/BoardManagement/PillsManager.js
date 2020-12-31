import { Pill } from "./Pill.js";

("use strict");

const PillsManager = class PillsManager {
    constructor() {
        this._cells = [];
        this.isBoostPressed = false;
    }

    set cells(newCells) {
        this._cells = newCells;
    }

    createNewPill = () => {
        this.currentPill = new Pill(this._cells, this._cells[0][3], this._cells[0][4], this);
    };

    addKeyboardListeners = () => {
        document.addEventListener("keydown", (event) => {
            event.preventDefault();
            switch (event.key) {
                case "ArrowDown":
                case "S":
                case "s":
                    this.isBoostPressed = true;
                    this.currentPill.currentFallingTime = 20;
                    break;

                case "ArrowLeft":
                case "A":
                case "a":
                    if (!this.isBoostPressed) this.currentPill.PillController.moveLeft();
                    break;

                case "ArrowRight":
                case "D":
                case "d":
                    if (!this.isBoostPressed) this.currentPill.PillController.moveRight();
                    break;

                case "ArrowUp":
                case "W":
                case "w":
                    if (!this.isBoostPressed) this.currentPill.PillController.rotateLeft();
                    break;

                case "Shift":
                    if (!this.isBoostPressed) this.currentPill.PillController.rotateRight();
                    break;
            }
        });

        document.addEventListener("keyup", (event) => {
            if (event.key == "ArrowDown" || event.key == "S" || event.key == "s") {
                this.isBoostPressed = false;
                this.currentPill.currentFallingTime = this.currentPill.fallingTime;
            }
        });
    };
};

export { PillsManager };
