import { BoardGenerator } from "./BoardGenerator.js";
import { CellsManager } from "./CellsManager.js";

("use strict");

const BoardManager = class BoardManager {
    constructor(boardContainer) {
        this.currentLevel = -1;
        this.boardContainer = boardContainer;
        this.BoardGenerator = new BoardGenerator(boardContainer);

        this.boardContainer.addEventListener("prepareNextLevel", this.prepareBoard);
    }

    prepareBoard = () => {
        this.currentLevel += 1;
        this.boardContainer.innerHTML = "";
        this.CellsManager = new CellsManager(this.boardContainer, this.currentLevel);
        this.cells = this.BoardGenerator.generateBoard();
        this.CellsManager.addPillControlling();
        this.CellsManager.cells = this.cells;
        this.CellsManager.prepareForNewPill();
        document.getElementById("magnifier").dispatchEvent(new Event("stageCompleted"));
    };
};

export { BoardManager };
