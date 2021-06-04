"use strict";

const Virus = class Virus {
    constructor(cells, cell1, parent, color) {
        this._cells = cells;
        this.parent = parent;
        this.virusCell = cell1;

        this._color = color;
        this.colorCells();
    }

    resetCellsColor = () => {
        if (this.virusCell != null) {
            this.virusCell.children[0].remove();
        }
    };

    colorCells = () => {
        let image = document.createElement("img");
        image.setAttribute("class", "cell-img");
        image.src = `assets/covid_${this._color}.png`;
        if (this.virusCell != null) this.virusCell.appendChild(image);
    };
};

export { Virus };
