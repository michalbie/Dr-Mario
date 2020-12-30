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
		this.fallingIntervalTime = 200;
		this.didFell = false;
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
		const oldPosition = this.getPillCellsPosition();
		const newPosition = {
			x1: oldPosition.x1 + 1,
			y1: oldPosition.y1,
			x2: oldPosition.x2 + 1,
			y2: oldPosition.y2,
		};

		if (this.canBeMoved(newPosition)) {
			this.moveToPosition(newPosition);
		} else {
			this.didFell = true;
			this.stopFalling();
			if (this.parent.currentPill == this) {
				this.parent.createNewPill();
			}
		}
	};

	moveLeft = () => {
		const oldPosition = this.getPillCellsPosition();
		const newPosition = {
			x1: oldPosition.x1,
			y1: oldPosition.y1 - 1,
			x2: oldPosition.x2,
			y2: oldPosition.y2 - 1,
		};
		this.moveToPosition(newPosition);
	};

	moveRight = () => {
		const oldPosition = this.getPillCellsPosition();
		const newPosition = {
			x1: oldPosition.x1,
			y1: oldPosition.y1 + 1,
			x2: oldPosition.x2,
			y2: oldPosition.y2 + 1,
		};
		this.moveToPosition(newPosition);
	};

	moveToPosition = (newPosition) => {
		const { x1, y1, x2, y2 } = newPosition;
		this.resetCellsColor();

		if (this.canBeMoved(newPosition) && !this.didFell) {
			this.pillCells = { cell1: this._cells[x1][y1], cell2: this._cells[x2][y2] };
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
		this.fallingInterval = setInterval(this.moveDown, this.fallingIntervalTime);
	};

	stopFalling = () => {
		clearInterval(this.fallingInterval);
	};
};

export { Pill };
