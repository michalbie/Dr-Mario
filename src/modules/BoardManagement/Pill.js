import { PillController } from "./PillController.js";

("use strict");

const Pill = class Pill {
    constructor(cells, cell1, cell2, parent, id) {
        this.parent = parent;

        this._possibleVariations = this.parent.colorVariants;

        this.id = id;
        this._cells = cells;
        this.pillCells = { cell1: cell1, cell2: cell2 };

        this._colors = this._getRandomColors();

        this.fallingTime = 800;
        this.currentFallingTime = this.fallingTime;
        this.didFell = false;
        this.colorCells();

        this.PillController = new PillController(this);
    }

    _getRandomColors = () => {
        const randomColors = [];
        for (let i = 0; i < 2; i++) {
            let randomColorIndex = Math.floor(Math.random() * parseInt(this._possibleVariations.length));
            randomColors.push(this._possibleVariations[randomColorIndex]);
        }
        return randomColors;
    };

    _getColorVariations = () => {
        return this._possibleVariations;
    };

    resetCellsColor = () => {
        if (this.pillCells.cell1 != null) this.pillCells.cell1.style.backgroundColor = "";
        if (this.pillCells.cell2 != null) this.pillCells.cell2.style.backgroundColor = "";
    };

    colorCells = () => {
        if (this.pillCells.cell1 != null) this.pillCells.cell1.style.backgroundColor = this._colors[0];
        if (this.pillCells.cell2 != null) this.pillCells.cell2.style.backgroundColor = this._colors[1];
    };
};

export { Pill };
