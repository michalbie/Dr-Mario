import { Pill } from "./Pill.js";

("use strict");

const PillsManager = class PillsManager {
	constructor() {
		this._cells = [];
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
				case "ArrowLeft":
				case "A":
				case "a":
					this.currentPill.moveLeft();
					break;

				case "ArrowRight":
				case "D":
				case "d":
					this.currentPill.moveRight();
					break;

				case "ArrowUp":
				case "W":
				case "w":
					console.log("skr3");
					break;

				case "Shift":
					console.log("skr4");
					break;

				case "ArrowDown":
				case "S":
				case "s":
					console.log("skr5");
					break;
			}
		});
	};
};

export { PillsManager };
