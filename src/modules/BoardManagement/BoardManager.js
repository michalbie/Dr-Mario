import { BoardGenerator } from "./BoardGenerator.js";
import { CellsManager } from "./CellsManager.js";

("use strict");

const BoardManager = class BoardManager {
    constructor(boardContainer) {
        this.boardContainer = boardContainer;
        this.BoardGenerator = new BoardGenerator(boardContainer);
        this.CellsManager = new CellsManager(boardContainer);
    }

    prepareBoard = () => {
        this.cells = this.BoardGenerator.generateBoard();
        this.CellsManager.addKeyboardListeners();
        this.CellsManager.cells = this.cells;
        this.CellsManager.prepareNewPill();
    };
};

export { BoardManager };
