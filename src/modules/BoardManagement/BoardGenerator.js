"use strict";

const BoardGenerator = class BoardGenerator {
	constructor(boardContainer) {
		this.boardContainer = boardContainer;
		this.width = 8;
		this.height = 16;
	}

	generateBoard = () => {
		let cells = [];
		for (let row = 0; row < this.height; row++) {
			for (let column = 0; column < this.width; column++) {
				let cell = this._createCell();
				cells.push(cell);
				this.boardContainer.appendChild(cell);
			}
		}
		return cells;
	};

	_createCell = () => {
		let cell = document.createElement(`div`);
		cell.setAttribute("class", "board-cell");
		return cell;
	};
};

export { BoardGenerator };
