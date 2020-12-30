import { BoardGenerator } from "./BoardGenerator.js";
import { Pill } from "./Pill.js";

("use strict");

const BoardManager = class BoardManager {
	constructor(boardContainer) {
		this.boardGenerator = new BoardGenerator(boardContainer);
	}

	prepareBoard = () => {
		this.cells = this.boardGenerator.generateBoard();
		this.currentPill = new Pill();
	};

	create;
};

export { BoardManager };
