"use strict";

const Virus = class Virus {
    constructor(cells, cell1, parent) {
        this._cells = cells;
        this.parent = parent;
        this.virusCell = cell1;
        this.colorVariations = this.parent.colorVariants;

        this._color = this._getRandomColor();
        console.log(this.virusCell, this._color);
        this.virusCell.style.border = "2px solid red";
        this.colorCells();
    }

    _getRandomColor = () => {
        let randomColor = "";
        let randomColorIndex = Math.floor(Math.random() * parseInt(this.colorVariations.length));
        randomColor = this.colorVariations[randomColorIndex];
        return randomColor;
    };

    resetCellsColor = () => {
        if (this.virusCell != null) this.virusCell.style.backgroundColor = "";
    };

    colorCells = () => {
        if (this.virusCell != null) this.virusCell.style.backgroundColor = this._color;
    };
};

export { Virus };
