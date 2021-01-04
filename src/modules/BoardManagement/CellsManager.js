import { Pill } from "./Pill.js";
import { Virus } from "./Virus.js";

("use strict");

const CellsManager = class CellsManager {
    constructor() {
        this._cells = [];
        this.currentPill = null;
        this.isBoostPressed = false;
        this.oldPills = [];
        this.currentID = 0;
        this.colorVariants = ["br", "yl", "bl"];

        this.viruses = [];
        this.virusesNumber = 3;
    }

    set cells(newCells) {
        this._cells = newCells;
    }

    createNewPill = () => {
        if (this.currentPill != null) {
            this.oldPills.push(this.currentPill);
            this.clearComboedCells();
        } else {
            this.createViruses();
            this.currentPill = new Pill(this._cells, this._cells[0][3], this._cells[0][4], this, this.currentID);
            this.currentID++;
        }
    };

    createViruses = () => {
        for (let i = 0; i < this.virusesNumber; i++) {
            let occupied = false;
            let randomHeight;
            let randomWidth;

            do {
                occupied = false;
                randomHeight = Math.floor(Math.random() * (16 - 5)) + 5;
                randomWidth = Math.floor(Math.random() * (8 - 1)) + 1;

                for (let virusIndex = 0; virusIndex < this.viruses.length; virusIndex++) {
                    if (this.viruses[virusIndex].virusCell == this._cells[randomHeight][randomWidth]) {
                        occupied = true;
                        break;
                    }
                }
            } while (occupied == true);

            let newVirus = new Virus(this.cells, this._cells[randomHeight][randomWidth], this);
            this.viruses.push(newVirus);
        }
    };

    addKeyboardListeners = () => {
        document.addEventListener("keydown", (event) => {
            //event.preventDefault();
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
        const pillsToRemove = [];

        const destroyCells = () => {
            this.oldPills.forEach((oldPill) => {
                if (comboedCells.includes(oldPill.pillCells.cell1)) {
                    let destroyedCell = oldPill.pillCells.cell1;
                    oldPill.pillCells.cell1 = null;

                    if (oldPill.pillCells.cell2 == null) {
                        pillsToRemove.push(oldPill);
                    }

                    oldPill.resetCellsColor();
                    oldPill.colorCells();
                    destroyedCell.children[0].remove();
                    this.showDestroyAnimation(destroyedCell, oldPill._colors[0], "pill");
                }
                if (comboedCells.includes(oldPill.pillCells.cell2)) {
                    let destroyedCell = oldPill.pillCells.cell2;
                    oldPill.pillCells.cell2 = null;

                    if (oldPill.pillCells.cell1 == null) {
                        pillsToRemove.push(oldPill);
                    }

                    oldPill.resetCellsColor();
                    oldPill.colorCells();
                    destroyedCell.children[0].remove();
                    this.showDestroyAnimation(destroyedCell, oldPill._colors[1], "pill");
                }
            });

            comboedCells.forEach((comboCell) => {
                setTimeout(() => {
                    if (comboCell.children.length > 0) comboCell.children[0].remove();
                }, 100);
            });
        };

        const destroyViruses = () => {
            this.viruses.forEach((virus) => {
                if (comboedCells.includes(virus.virusCell)) {
                    let destroyCell = virus.virusCell;
                    virus.virusCell = null;
                    destroyCell.children[0].remove();
                    this.showDestroyAnimation(destroyCell, virus._color, "virus");

                    setTimeout(() => {
                        if (destroyCell.children.length > 0) destroyCell.children[0].remove();
                    }, 100);
                }
            });
        };

        const removeEmptyCells = () => {
            pillsToRemove.forEach((removedPill) => {
                this.oldPills.splice(this.oldPills.indexOf(removedPill), 1);
            });
        };

        destroyCells();
        destroyViruses();
        removeEmptyCells();

        if (comboedCells.length > 0) {
            setTimeout(this.startFalling, 100);
        } else {
            this.currentPill = new Pill(this._cells, this._cells[0][3], this._cells[0][4], this, this.currentID);
            this.currentID++;
        }
    };

    lookForCombos = () => {
        let currentCombo = { color: "unknown", amount: 0, comboCells: [] };
        let combosCells = [];

        const getCellColor = (cell) => {
            let cellColor = null;
            for (let i = 0; i < this.oldPills.length; i++) {
                if (this.oldPills[i].pillCells.cell1 == cell) {
                    cellColor = this.oldPills[i]._colors[0];
                    return cellColor;
                } else if (this.oldPills[i].pillCells.cell2 == cell) {
                    cellColor = this.oldPills[i]._colors[1];
                    return cellColor;
                }
            }

            for (let i = 0; i < this.viruses.length; i++) {
                if (this.viruses[i].virusCell == cell) {
                    cellColor = this.viruses[i]._color;
                    return cellColor;
                }
            }
        };

        const resetCurrentCombo = () => {
            currentCombo.comboCells = [];
            currentCombo.color = "unknown";
            currentCombo.amount = 0;
        };

        const scanCell = (row, column) => {
            if (getCellColor(this._cells[row][column]) == currentCombo.color) {
                currentCombo.amount += 1;
                currentCombo.comboCells.push(this._cells[row][column]);
            } else if (currentCombo.amount >= 4) {
                currentCombo.comboCells.forEach((comboCell) => {
                    combosCells.push(comboCell);
                });
                currentCombo.comboCells = [this._cells[row][column]];
                currentCombo.color = getCellColor(this._cells[row][column]);
                currentCombo.amount = 1;
            } else if (this._cells[row][column].children.length != 0) {
                currentCombo.comboCells = [this._cells[row][column]];
                currentCombo.color = getCellColor(this._cells[row][column]);
                currentCombo.amount = 1;
            } else {
                resetCurrentCombo();
            }
        };

        const scanByRows = () => {
            for (let row = 0; row < 16; row++) {
                for (let column = 0; column < 8; column++) {
                    scanCell(row, column);
                }

                if (currentCombo.amount >= 4) {
                    currentCombo.comboCells.forEach((comboCell) => {
                        combosCells.push(comboCell);
                    });
                }
                resetCurrentCombo();
            }
        };

        const scanByColumns = () => {
            for (let column = 0; column < 8; column++) {
                for (let row = 0; row < 16; row++) {
                    scanCell(row, column);
                }

                if (currentCombo.amount >= 4) {
                    currentCombo.comboCells.forEach((comboCell) => {
                        combosCells.push(comboCell);
                    });
                }
                resetCurrentCombo();
            }
        };

        scanByRows();
        scanByColumns();

        return combosCells;
    };

    showDestroyAnimation = (cell, color, who) => {
        let destroyAnimationName = who == "pill" ? "o" : "x";
        let image = document.createElement("img");
        image.setAttribute("class", "cell-img");
        image.src = `../../../assets/${color}_${destroyAnimationName}.png`;
        cell.appendChild(image);
    };

    startFalling = () => {
        let fellOnce = true;

        const triggerFalling = () => {
            let pillsOrdered = getPillsOrder();
            fellOnce = false;
            pillsOrdered.forEach((pill) => {
                let didFell = pill.PillController.fallDown();
                if (didFell == true) fellOnce = true;
            });

            if (fellOnce === true) {
                setTimeout(triggerFalling, 70);
            } else {
                this.clearComboedCells();
            }
        };

        const getPillsOrder = () => {
            let pillsOrdered = [];
            for (let row = 15; row >= 0; row--) {
                for (let column = 0; column < 8; column++) {
                    if (this._cells[row][column].children.length != 0) {
                        for (let i = 0; i < this.oldPills.length; i++) {
                            if (this.oldPills[i].pillCells.cell1 == this._cells[row][column] || this.oldPills[i].pillCells.cell2 == this._cells[row][column]) {
                                if (!pillsOrdered.includes(this.oldPills[i])) {
                                    pillsOrdered.push(this.oldPills[i]);
                                }
                                break;
                            }
                        }
                    }
                }
            }
            return pillsOrdered;
        };

        setTimeout(triggerFalling, 70);
    };
};

export { CellsManager };
