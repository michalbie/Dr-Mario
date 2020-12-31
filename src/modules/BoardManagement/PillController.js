"use strict";

const PillController = class PillController {
    constructor(pill) {
        this.pill = pill;
        this.orientation = "horizontal";
        this.currentPosition = this.getPillCellsPosition();
        this.yRange = this._getYRange();

        this.startFalling();
    }

    _getYRange = () => {
        const minY = Math.min(this.currentPosition.y1, this.currentPosition.y2);
        const maxY = minY + 1;

        return { min: minY, max: maxY };
    };

    getPillCellsPosition = () => {
        const position = {};
        for (let i = 0; i < 16; i++) {
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
            this.moveToPosition(newPosition, this.orientation);
            setTimeout(this.moveDown, this.pill.currentFallingTime, "byFalling");
        } else {
            this.pill.colorCells();
            this.pill.didFell = true;
            this.stopFalling();
            if (this.pill.parent.currentPill == this.pill) {
                this.pill.parent.createNewPill();
            }
        }
    };

    moveLeft = () => {
        const newPosition = {
            x1: this.currentPosition.x1,
            y1: this.currentPosition.y1 - 1,
            x2: this.currentPosition.x2,
            y2: this.currentPosition.y2 - 1,
        };
        this.moveToPosition(newPosition, this.orientation, "byMoving");
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

    rotateLeft = () => {
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
            this.moveToPosition(newPosition, "vertical", "byRotation");
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
            this.moveToPosition(newPosition, "horizontal", "byRotation");
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

    moveToPosition = (newPosition, orientation, byWhat) => {
        const { x1, y1, x2, y2 } = newPosition;
        this.pill.resetCellsColor();

        if (this.canBeMoved(newPosition) && !this.pill.didFell) {
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

    canBeMoved = ({ x1, y1, x2, y2 }) => {
        if (x1 < 16 && x1 >= 0 && x2 < 16 && x2 >= 0 && y1 < 8 && y1 >= 0 && y2 < 8 && y2 >= 0) {
            if (this.pill._cells[x1][y1].style.backgroundColor == "" && this.pill._cells[x2][y2].style.backgroundColor == "") {
                return true;
            }
        }
        return false;
    };

    startFalling = () => {
        setTimeout(this.moveDown, this.pill.currentFallingTime);
    };

    stopFalling = () => {
        clearInterval(this.pill.fallingInterval);
    };
};

export { PillController };
