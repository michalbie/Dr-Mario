import { Pill } from "./Pill.js";

("use strict");

const PillsManager = class PillsManager {
    constructor() {
        this._cells = [];
        this.currentPill = null;
        this.isBoostPressed = false;
        this.oldPills = [];
    }

    set cells(newCells) {
        this._cells = newCells;
    }

    createNewPill = () => {
        if (this.currentPill != null) {
            this.oldPills.push(this.currentPill);
            this.clearComboedCells();
        }
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

    clearComboedCells = () => {
        const comboedCells = this.lookForCombos();

        this.oldPills.forEach((oldPill) => {
            if (comboedCells.includes(oldPill.pillCells.cell1)) {
                oldPill.pillCells.cell1 = null;
            } else if (comboedCells.includes(oldPill.pillCells.cell2)) {
                oldPill.pillCells.cell2 = null;
            }
        });

        comboedCells.forEach((comboCell) => {
            comboCell.style.backgroundColor = "";
        });
    };

    lookForCombos = () => {
        let currentCombo = { color: "unknown", amount: 0, comboCells: [] };
        let combosCells = [];

        const scanByRows = () => {
            for (let row = 0; row < 16; row++) {
                for (let column = 0; column < 8; column++) {
                    if (this._cells[row][column].style.backgroundColor == currentCombo.color) {
                        currentCombo.amount += 1;
                        currentCombo.comboCells.push(this._cells[row][column]);
                    } else if (currentCombo.amount >= 4) {
                        currentCombo.comboCells.forEach((comboCell) => {
                            combosCells.push(comboCell);
                        });
                        currentCombo.comboCells = [this._cells[row][column]];
                        currentCombo.color = this._cells[row][column].style.backgroundColor;
                        currentCombo.amount = 1;
                    } else if (this._cells[row][column].style.backgroundColor != "") {
                        currentCombo.comboCells = [this._cells[row][column]];
                        currentCombo.color = this._cells[row][column].style.backgroundColor;
                        currentCombo.amount = 1;
                    } else {
                        currentCombo.comboCells = [];
                        currentCombo.color = "unknown";
                        currentCombo.amount = 0;
                    }
                }
                if (currentCombo.amount >= 4) {
                    currentCombo.comboCells.forEach((comboCell) => {
                        combosCells.push(comboCell);
                    });
                }
                currentCombo.comboCells = [];
                currentCombo.color = "unknown";
                currentCombo.amount = 0;
            }
        };

        const scanByColumns = () => {
            for (let column = 0; column < 8; column++) {
                for (let row = 0; row < 16; row++) {
                    if (this._cells[row][column].style.backgroundColor == currentCombo.color) {
                        currentCombo.amount += 1;
                        currentCombo.comboCells.push(this._cells[row][column]);
                    } else if (currentCombo.amount >= 4) {
                        currentCombo.comboCells.forEach((comboCell) => {
                            combosCells.push(comboCell);
                        });
                        currentCombo.comboCells = [this._cells[row][column]];
                        currentCombo.color = this._cells[row][column].style.backgroundColor;
                        currentCombo.amount = 1;
                    } else if (this._cells[row][column].style.backgroundColor != "") {
                        currentCombo.comboCells = [this._cells[row][column]];
                        currentCombo.color = this._cells[row][column].style.backgroundColor;
                        currentCombo.amount = 1;
                    } else {
                        currentCombo.comboCells = [];
                        currentCombo.color = "unknown";
                        currentCombo.amount = 0;
                    }
                }
                if (currentCombo.amount >= 4) {
                    currentCombo.comboCells.forEach((comboCell) => {
                        combosCells.push(comboCell);
                    });
                }
                currentCombo.comboCells = [];
                currentCombo.color = "unknown";
                currentCombo.amount = 0;
            }
        };

        scanByRows();
        scanByColumns();

        return combosCells;
    };
};

export { PillsManager };
