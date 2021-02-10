import { Pill } from "./Pill.js";
import { Virus } from "./Virus.js";
import { scoreAPI, levelInfoAPI } from "../../globals.js";

("use strict");

const CellsManager = class CellsManager {
    constructor(gameBoard, levelNumber) {
        this._cells = [];
        this.gameBoard = gameBoard;
        this.currentPill = null;
        this.previewPill = null;
        this.isBoostPressed = false;
        this.oldPills = [];
        this.currentID = 0;
        this.colorVariants = ["br", "yl", "bl"];

        this.viruses = [];
        this.virusesNumber = 4 + levelNumber * 4;
        if (this.virusesNumber > 96) {
            this.virusesNumber = 96;
        }
        levelInfoAPI.virusesNumber = this.virusesNumber;
        this.currentScore = 0;

        this.isGameOver = false;
        this.isStageCompleted = false;
    }

    set cells(newCells) {
        this._cells = newCells;
    }

    createPreviewPill = () => {
        this.previewPill = new Pill(this._cells, this._cells[1][23], this._cells[1][24], this, this.currentID);
        this.currentID++;
    };

    createPill = () => {
        this.currentPill = this.previewPill;
        this.isBoostPressed = false;
    };

    prepareForNewPill = () => {
        if (this.currentPill != null) {
            this.oldPills.push(this.currentPill);
            this.clearComboedCells();
        } else {
            this.createViruses();
            this.createPreviewPill();
            this.createPill();
            document.getElementById("doctor-animation").dispatchEvent(new Event("sendPill"));
            setTimeout(this.createPreviewPill, 500);
        }
    };

    createViruses = () => {
        for (let i = 0; i < this.virusesNumber; i++) {
            let occupied = false;
            let randomHeight;
            let randomWidth;

            do {
                occupied = false;
                randomHeight = Math.floor(Math.random() * (22 - 10)) + 10;
                randomWidth = Math.floor(Math.random() * 8);

                for (let virusIndex = 0; virusIndex < this.viruses.length; virusIndex++) {
                    if (this.viruses[virusIndex].virusCell == this._cells[randomHeight][randomWidth]) {
                        occupied = true;
                        break;
                    }
                }
            } while (occupied == true);

            let newVirus = new Virus(this.cells, this._cells[randomHeight][randomWidth], this, this.colorVariants[i % this.colorVariants.length]);
            this.viruses.push(newVirus);
        }
    };

    addPillControlling = () => {
        document.addEventListener("keydown", (event) => {
            //event.preventDefault();
            switch (event.key) {
                case "ArrowDown":
                case "S":
                case "s":
                    let currentPosition = this.currentPill.PillController.currentPosition;
                    if (currentPosition.x1 >= 6 && currentPosition.x2 >= 6) {
                        this.isBoostPressed = true;
                        this.currentPill.currentFallingTime = 20;
                    }
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

        /*document.addEventListener("keyup", (event) => {
            if (event.key == "ArrowDown" || event.key == "S" || event.key == "s") {
                this.isBoostPressed = false;
                this.currentPill.currentFallingTime = this.currentPill.fallingTime;
            }
        });*/
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

        const checkIfStageCompleted = () => {
            for (let i = 0; i < this.viruses.length; i++) {
                if (this.viruses[i].virusCell != null) {
                    return false;
                }
            }
            return true;
        };

        const destroyViruses = () => {
            this.viruses.forEach((virus) => {
                if (comboedCells.includes(virus.virusCell)) {
                    let destroyCell = virus.virusCell;
                    virus.virusCell = null;
                    destroyCell.children[0].remove();
                    this.showDestroyAnimation(destroyCell, virus._color, "virus");
                    levelInfoAPI.virusesNumber -= 1;
                    document.getElementById("viruses-number").dispatchEvent(new Event("virusKilled"));

                    setTimeout(() => {
                        if (destroyCell.children.length > 0) destroyCell.children[0].remove();
                    }, 100);

                    scoreAPI.setCurrentScore(scoreAPI.currentScore + 100);
                    document.getElementById("current-score-container").dispatchEvent(scoreAPI.currentScoreUpdateEvent);
                    if (parseInt(scoreAPI.currentScore) > parseInt(scoreAPI.topScore)) {
                        scoreAPI.setTopScore(scoreAPI.currentScore);
                    }

                    let virusColorExists = false;
                    for (let i = 0; i < this.viruses.length; i++) {
                        if (this.viruses[i]._color == virus._color && this.viruses[i].virusCell != null) {
                            document.getElementById(`${virus._color}-virus`).dispatchEvent(new Event("singleVirusKilled"));
                            virusColorExists = true;
                            break;
                        }
                    }

                    if (!virusColorExists) {
                        document.getElementById(`${virus._color}-virus`).dispatchEvent(new Event("everyVirusKilled"));
                    }

                    if (checkIfStageCompleted()) this.isStageCompleted = true;
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
            if (this._cells[6][3].children.length > 0 || this._cells[6][4].children.length > 0) {
                this.isGameOver = true;
                this.previewPill.resetCellsColor();
                this.previewPill = null;
            }

            if (!this.isStageCompleted && !this.isGameOver) {
                this.createPill();
                document.getElementById("doctor-animation").dispatchEvent(new Event("sendPill"));
                setTimeout(this.createPreviewPill, 500);
            } else if (this.isStageCompleted) {
                levelInfoAPI.levelNumber += 1;
                document.getElementById("game-board").removeEventListener("playThrowPillAnimation", this.previewPill.PillController.animatePillThrow);
                document.getElementById("game-info").dispatchEvent(new Event("stageCompleted"));
            } else if (this.isGameOver) {
                document.getElementById("game-info").dispatchEvent(new Event("gameOver"));
            }
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
            for (let row = 0; row < 22; row++) {
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
                for (let row = 0; row < 22; row++) {
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
            for (let row = 21; row >= 0; row--) {
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
