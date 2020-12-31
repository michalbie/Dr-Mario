import { PillController } from "./PillController.js";

("use strict");

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
        this.colorCells();

        this.PillController = new PillController(this);
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
};

export { Pill };
