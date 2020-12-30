import { BoardGenerator } from "./BoardGenerator.js";
import { PillsManager } from "./PillsManager.js";
import { Pill } from "./Pill.js";

("use strict");

const BoardManager = class BoardManager {
	constructor(boardContainer) {
		this.boardContainer = boardContainer;
		this.BoardGenerator = new BoardGenerator(boardContainer);
		this.PillsManager = new PillsManager();
	}

	prepareBoard = () => {
		this.cells = this.BoardGenerator.generateBoard();
		this.PillsManager.addKeyboardListeners();
		this.PillsManager.cells = this.cells;
		this.PillsManager.createNewPill();
	};
};

export { BoardManager };
