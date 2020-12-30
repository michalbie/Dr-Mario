import { BoardManager } from "./modules/BoardManagement/BoardManager.js";

("use strict");

const App = class App {
	constructor() {
		this.boardManager = new BoardManager(document.getElementById("game-board"));
	}

	initializeApp = () => {
		this.boardManager.prepareBoard();
	};
};

const app = new App();
app.initializeApp();
