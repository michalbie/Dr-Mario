"use strict";

const PillController = class PillController {
    constructor(pill) {
        this.pill = pill;
        this.orientation = "horizontal";
        this.currentPosition = this.getPillCellsPosition();
        this.yRange = this._getYRange();

        document.getElementById("game-board").addEventListener("playThrowPillAnimation", () => {
            this.animatePillThrow();
        });
    }

    _getYRange = () => {
        const minY = Math.min(this.currentPosition.y1, this.currentPosition.y2);
        const maxY = minY + 1;

        return { min: minY, max: maxY };
    };

    getPillCellsPosition = () => {
        const position = {};
        for (let i = 0; i < 22; i++) {
            if (this.pill._cells[i].indexOf(this.pill.pillCells.cell1) > -1) {
                position["x1"] = i;
                position["y1"] = this.pill._cells[i].indexOf(this.pill.pillCells.cell1);
            }
            if (this.pill._cells[i].indexOf(this.pill.pillCells.cell2) > -1) {
                position["x2"] = i;
                position["y2"] = this.pill._cells[i].indexOf(this.pill.pillCells.cell2);
            }
        }
        return position;
    };

    moveDown = () => {
        const newPosition = {
            x1: this.currentPosition.x1 + 1,
            y1: this.currentPosition.y1,
            x2: this.currentPosition.x2 + 1,
            y2: this.currentPosition.y2,
        };

        this.pill.resetCellsColor();
        if (this.canBeMoved(newPosition)) {
            this.pill.colorCells();
            this.moveToPosition(newPosition, this.orientation);
            setTimeout(this.moveDown, this.pill.currentFallingTime, "byFalling");
        } else {
            this.pill.colorCells();
            this.pill.didFell = true;
            this.stopFalling();
            if (this.pill.parent.currentPill == this.pill) {
                this.pill.parent.prepareNewPill();
            }
        }
    };

    moveLeft = (isForAnimation) => {
        const newPosition = {
            x1: this.currentPosition.x1,
            y1: this.currentPosition.y1 - 1,
            x2: this.currentPosition.x2,
            y2: this.currentPosition.y2 - 1,
        };
        if (isForAnimation) this.moveToPosition(newPosition, this.orientation, "byMoving", true);
        else this.moveToPosition(newPosition, this.orientation, "byMoving", false);
    };

    moveRight = () => {
        const newPosition = {
            x1: this.currentPosition.x1,
            y1: this.currentPosition.y1 + 1,
            x2: this.currentPosition.x2,
            y2: this.currentPosition.y2 + 1,
        };
        this.moveToPosition(newPosition, this.orientation, "byMoving");
    };

    rotateLeft = (isForAnimation) => {
        let newPosition = {};
        if (this.orientation == "horizontal") {
            if (this.currentPosition.y1 < this.currentPosition.y2) {
                newPosition = {
                    x1: this.currentPosition.x1,
                    y1: this.currentPosition.y1,
                    x2: this.currentPosition.x2 - 1,
                    y2: this.currentPosition.y2 - 1,
                };
            } else {
                newPosition = {
                    x1: this.currentPosition.x1 - 1,
                    y1: this.currentPosition.y1 - 1,
                    x2: this.currentPosition.x2,
                    y2: this.currentPosition.y2,
                };
            }
            if (isForAnimation) {
                this.moveToPosition(newPosition, "vertical", "byRotation", true);
            } else {
                this.moveToPosition(newPosition, "vertical", "byRotation", false);
            }
        } else {
            if (this.currentPosition.x1 > this.currentPosition.x2) {
                if (this.currentPosition.y1 == this.yRange.min) {
                    newPosition = {
                        x1: this.currentPosition.x1,
                        y1: this.currentPosition.y1 + 1,
                        x2: this.currentPosition.x2 + 1,
                        y2: this.currentPosition.y2,
                    };
                } else if (this.currentPosition.y1 == this.yRange.max) {
                    newPosition = {
                        x1: this.currentPosition.x1,
                        y1: this.currentPosition.y1,
                        x2: this.currentPosition.x2 + 1,
                        y2: this.currentPosition.y2 - 1,
                    };
                }
            } else {
                if (this.currentPosition.y1 == this.yRange.min) {
                    newPosition = {
                        x1: this.currentPosition.x1 + 1,
                        y1: this.currentPosition.y1,
                        x2: this.currentPosition.x2,
                        y2: this.currentPosition.y2 + 1,
                    };
                } else if (this.currentPosition.y1 == this.yRange.max) {
                    newPosition = {
                        x1: this.currentPosition.x1 + 1,
                        y1: this.currentPosition.y1 - 1,
                        x2: this.currentPosition.x2,
                        y2: this.currentPosition.y2,
                    };
                }
            }
            if (isForAnimation) {
                this.moveToPosition(newPosition, "horizontal", "byRotation", true);
            } else {
                this.moveToPosition(newPosition, "horizontal", "byRotation", false);
            }
        }
    };

    rotateRight = () => {
        let newPosition = {};
        if (this.orientation == "horizontal") {
            if (this.currentPosition.y1 < this.currentPosition.y2) {
                newPosition = {
                    x1: this.currentPosition.x1 - 1,
                    y1: this.currentPosition.y1 + 1,
                    x2: this.currentPosition.x2,
                    y2: this.currentPosition.y2,
                };
            } else {
                newPosition = {
                    x1: this.currentPosition.x1,
                    y1: this.currentPosition.y1,
                    x2: this.currentPosition.x2 - 1,
                    y2: this.currentPosition.y2 + 1,
                };
            }
            this.moveToPosition(newPosition, "vertical", "byRotation");
        } else {
            if (this.currentPosition.x1 > this.currentPosition.x2) {
                if (this.currentPosition.y1 == this.yRange.min) {
                    newPosition = {
                        x1: this.currentPosition.x1,
                        y1: this.currentPosition.y1,
                        x2: this.currentPosition.x2 + 1,
                        y2: this.currentPosition.y2 + 1,
                    };
                } else if (this.currentPosition.y1 == this.yRange.max) {
                    newPosition = {
                        x1: this.currentPosition.x1,
                        y1: this.currentPosition.y1 - 1,
                        x2: this.currentPosition.x2 + 1,
                        y2: this.currentPosition.y2,
                    };
                }
            } else {
                if (this.currentPosition.y1 == this.yRange.min) {
                    newPosition = {
                        x1: this.currentPosition.x1 + 1,
                        y1: this.currentPosition.y1 + 1,
                        x2: this.currentPosition.x2,
                        y2: this.currentPosition.y2,
                    };
                } else if (this.currentPosition.y1 == this.yRange.max) {
                    newPosition = {
                        x1: this.currentPosition.x1 + 1,
                        y1: this.currentPosition.y1,
                        x2: this.currentPosition.x2,
                        y2: this.currentPosition.y2 - 1,
                    };
                }
            }
            this.moveToPosition(newPosition, "horizontal", "byRotation");
        }
    };

    moveToPosition = (newPosition, orientation, byWhat, isAnimating) => {
        const { x1, y1, x2, y2 } = newPosition;

        if (x1 == 6 || x2 == 6) {
            this.pill.currentFallingTime = this.pill.fallingTime;
        } else if (x1 < 6 || x2 < 6) {
            this.pill.currentFallingTime = 30;
        }

        this.pill.resetCellsColor();

        if (this.canBeMoved(newPosition, isAnimating) && !this.pill.didFell) {
            this.pill.pillCells = { cell1: this.pill._cells[x1][y1], cell2: this.pill._cells[x2][y2] };
            this.orientation = orientation;
            const oldPosition = this.currentPosition;
            this.currentPosition = this.getPillCellsPosition();

            if (byWhat == "byMoving") {
                if (oldPosition.y1 < this.currentPosition.y1 && this.yRange.max < 7) {
                    this.yRange.min += 1;
                    this.yRange.max += 1;
                } else if (oldPosition.y1 > this.currentPosition.y1 && this.yRange.min > 0) {
                    this.yRange.min -= 1;
                    this.yRange.max -= 1;
                }
            }
        }
        this.pill.colorCells();
    };

    canBeMoved = ({ x1, y1, x2, y2 }, isAnimation) => {
        if (isAnimation) return true;

        if (x1 < 22 && x1 >= 0 && x2 < 22 && x2 >= 0 && y1 < 8 && y1 >= 0 && y2 < 8 && y2 >= 0) {
            if ((x1 < 6 || x2 < 6) && x1 > 1 && x2 > 1) {
                if (y1 >= 3 && y1 <= 4 && y2 >= 3 && y2 <= 4) {
                    return true;
                }
                return false;
            } else if (x1 <= 1 || x2 <= 1) {
                return false;
            }
            if (this.pill._cells[x1][y1].children.length == 0 && this.pill._cells[x2][y2].children.length == 0) {
                return true;
            }
        }
        return false;
    };

    fallDown = () => {
        let fellOnce = false;
        if (this.pill.pillCells.cell1 != null && this.pill.pillCells.cell2 == null) {
            if (this.currentPosition.x1 < 21 && this.pill._cells[this.currentPosition.x1 + 1][this.currentPosition.y1].children.length == 0) {
                this.pill.resetCellsColor();
                this.pill.pillCells.cell1 = this.pill._cells[this.currentPosition.x1 + 1][this.currentPosition.y1];
                this.currentPosition = this.getPillCellsPosition();
                this.pill.colorCells();
                fellOnce = true;
            }
        } else if (this.pill.pillCells.cell2 != null && this.pill.pillCells.cell1 == null) {
            if (this.currentPosition.x2 < 21 && this.pill._cells[this.currentPosition.x2 + 1][this.currentPosition.y2].children.length == 0) {
                this.pill.resetCellsColor();
                this.pill.pillCells.cell2 = this.pill._cells[this.currentPosition.x2 + 1][this.currentPosition.y2];
                this.currentPosition = this.getPillCellsPosition();
                this.pill.colorCells();
                fellOnce = true;
            }
        } else if (this.pill.pillCells.cell1 != null && this.pill.pillCells.cell2 != null) {
            const newPosition = {
                x1: this.currentPosition.x1 + 1,
                y1: this.currentPosition.y1,
                x2: this.currentPosition.x2 + 1,
                y2: this.currentPosition.y2,
            };
            this.pill.resetCellsColor();
            if (this.canBeMoved(newPosition)) {
                this.pill.pillCells.cell1 = this.pill._cells[this.currentPosition.x1 + 1][this.currentPosition.y1];
                this.pill.pillCells.cell2 = this.pill._cells[this.currentPosition.x2 + 1][this.currentPosition.y2];
                this.currentPosition = this.getPillCellsPosition();
                fellOnce = true;
            }
            this.pill.colorCells();
        }

        if (fellOnce) {
            return true;
        }

        return false;
    };

    animatePillThrow = () => {
        let numberOfRolls = 20;

        const rotateAndMoveLeft = () => {
            this.rotateLeft(true);
            this.moveLeft(true);
            numberOfRolls -= 1;

            if (numberOfRolls > 0) {
                setTimeout(rotateAndMoveLeft, 20);
            } else {
                this.startFalling();
            }
        };

        setTimeout(rotateAndMoveLeft, 200);
    };

    startFalling = () => {
        setTimeout(this.moveDown, this.pill.currentFallingTime);
    };

    stopFalling = () => {
        clearInterval(this.pill.fallingInterval);
    };
};

export { PillController };
