import { BoardManager } from "./modules/BoardManagement/BoardManager.js";
import { UIManager } from "./modules/UIManagement/UIManager.js";

("use strict");

const App = class App {
    constructor() {
        this.boardManager = new BoardManager(document.getElementById("game-board"));
        this.UIManager = new UIManager(document.getElementById("game-container"));
    }

    initializeApp = () => {
        this.UIManager.prepareLevel();
        this.boardManager.prepareBoard();
    };
};

const app = new App();
app.initializeApp();
