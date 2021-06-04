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

        this.fallingTime = 650;
        this.currentFallingTime = 30;
        this.didFell = false;

        this.PillController = new PillController(this);
        this._setTextures();
        this.colorCells();
    }

    _setTextures = () => {
        let image1 = document.createElement("img");
        let image2 = document.createElement("img");
        image1.setAttribute("class", "cell-img");
        image2.setAttribute("class", "cell-img");

        let orientation1 = "left";
        let orientation2 = "right";

        if (this.PillController.orientation == "horizontal") {
            if (this.PillController.currentPosition.y1 > this.PillController.currentPosition.y2) {
                orientation1 = "right";
                orientation2 = "left";
            }
        } else {
            if (this.PillController.currentPosition.x1 < this.PillController.currentPosition.x2) {
                orientation1 = "up";
                orientation2 = "down";
            } else {
                orientation1 = "down";
                orientation2 = "up";
            }
        }

        if (this.pillCells.cell1 != null && this.pillCells.cell2 != null) {
            image1.src = `assets/${this._colors[0]}_${orientation1}.png`;
            image2.src = `assets/${this._colors[1]}_${orientation2}.png`;
        } else if (this.pillCells.cell1 != null) {
            image1.src = `assets/${this._colors[0]}_dot.png`;
        } else if (this.pillCells.cell2 != null) {
            image2.src = `assets/${this._colors[1]}_dot.png`;
        }

        if (this.pillCells.cell1 != null) this.pillCells.cell1.appendChild(image1);
        if (this.pillCells.cell2 != null) this.pillCells.cell2.appendChild(image2);
    };

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
        if (this.pillCells.cell1 != null) {
            if (this.pillCells.cell1.children[0]) this.pillCells.cell1.children[0].remove();
        }
        if (this.pillCells.cell2 != null) {
            if (this.pillCells.cell2.children[0]) this.pillCells.cell2.children[0].remove();
        }
    };

    colorCells = () => {
        if (this.pillCells.cell1 != null && this.pillCells.cell2 != null) {
            if (this.pillCells.cell1.children.length == 0 && this.pillCells.cell2.children.length == 0) {
                this._setTextures();
            }
        } else if (this.pillCells.cell1 != null) {
            if (this.pillCells.cell1.children.length == 0) {
                this._setTextures();
            }
        } else if (this.pillCells.cell2 != null) {
            if (this.pillCells.cell2.children.length == 0) {
                this._setTextures();
            }
        }
    };
};

export { Pill };
