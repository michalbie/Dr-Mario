"use strict";

const Virus = class Virus {
    constructor(cells, cell1, parent) {
        this._cells = cells;
        this.parent = parent;
        this.virusCell = cell1;
        this.colorVariations = this.parent.colorVariants;

        this._color = this._getRandomColor();
        this.colorCells();
    }

    _getRandomColor = () => {
        let randomColor = "";
        let randomColorIndex = Math.floor(Math.random() * parseInt(this.colorVariations.length));
        randomColor = this.colorVariations[randomColorIndex];
        return randomColor;
    };

    resetCellsColor = () => {
        if (this.virusCell != null) {
            this.virusCell.children[0].remove();
        }
    };

    colorCells = () => {
        let image = document.createElement("img");
        image.setAttribute("class", "cell-img");
        image.src = `../../../assets/covid_${this._color}.png`;
        if (this.virusCell != null) this.virusCell.appendChild(image);
    };
};

export { Virus };
