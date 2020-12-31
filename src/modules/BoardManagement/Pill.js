"use strict";

const Pill = class Pill {
	constructor(cells, cell1, cell2, parent) {
		const _possibleVariations = ["#DAA520", "#B22222", "lightblue"];
		this.getPossibleVariations = () => {
			return _possibleVariations;
		};

		this.parent = parent;
		this._cells = cells;
		this.pillCells = { cell1: cell1, cell2: cell2 };

		this._colors = this._getRandomColors();

		this.fallingTime = 1000;
		this.currentFallingTime = this.fallingTime;
		this.didFell = false;

		this.orientation = "horizontal";
		this.currentPosition = this.getPillCellsPosition();
		this.yRange = this._getYRange();

		this.colorCells();
		this.startFalling();
	}

	_getRandomColors = () => {
		const colorVariations = this.getPossibleVariations();
		const randomColors = [];

		for (let i = 0; i < 2; i++) {
			let randomColorIndex = Math.abs(Math.round(Math.random() * colorVariations.length - 1));
			randomColors.push(colorVariations[randomColorIndex]);
		}
		return randomColors;
	};

	_getYRange = () => {
		const minY = Math.min(this.currentPosition.y1, this.currentPosition.y2);
		const maxY = minY + 1;

		return { min: minY, max: maxY };
	};

	resetCellsColor = () => {
		this.pillCells.cell1.style.backgroundColor = "";
		this.pillCells.cell2.style.backgroundColor = "";
	};

	colorCells = () => {
		this.pillCells.cell1.style.backgroundColor = this._colors[0];
		this.pillCells.cell2.style.backgroundColor = this._colors[1];
	};

	getPillCellsPosition = () => {
		const position = {};
		for (let i = 0; i < 16; i++) {
			if (this._cells[i].indexOf(this.pillCells.cell1) > -1) {
				position["x1"] = i;
				position["y1"] = this._cells[i].indexOf(this.pillCells.cell1);
			}
			if (this._cells[i].indexOf(this.pillCells.cell2) > -1) {
				position["x2"] = i;
				position["y2"] = this._cells[i].indexOf(this.pillCells.cell2);
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

		this.resetCellsColor();
		if (this.canBeMoved(newPosition)) {
			this.moveToPosition(newPosition, this.orientation);
			setTimeout(this.moveDown, this.currentFallingTime, "byMoving");
		} else {
			this.colorCells();
			this.didFell = true;
			this.stopFalling();
			if (this.parent.currentPill == this) {
				this.parent.createNewPill();
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
		this.resetCellsColor();

		if (this.canBeMoved(newPosition) && !this.didFell) {
			this.pillCells = { cell1: this._cells[x1][y1], cell2: this._cells[x2][y2] };
			this.orientation = orientation;
			const oldPosition = this.currentPosition;
			this.currentPosition = this.getPillCellsPosition();

			if (byWhat == "byMoving") {
				if (oldPosition.y1 < this.currentPosition.y1) {
					this.yRange.min += 1;
					this.yRange.max += 1;
				} else if (oldPosition.y1 > this.currentPosition.y1) {
					this.yRange.min -= 1;
					this.yRange.max -= 1;
				}
			}
		}
		this.colorCells();
	};

	canBeMoved = ({ x1, y1, x2, y2 }) => {
		if (x1 < 16 && x1 >= 0 && x2 < 16 && x2 >= 0 && y1 < 8 && y1 >= 0 && y2 < 8 && y2 >= 0) {
			if (this._cells[x1][y1].style.backgroundColor == "" && this._cells[x2][y2].style.backgroundColor == "") {
				return true;
			}
		}
		return false;
	};

	startFalling = () => {
		setTimeout(this.moveDown, this.currentFallingTime);
	};

	stopFalling = () => {
		clearInterval(this.fallingInterval);
	};
};

export { Pill };
