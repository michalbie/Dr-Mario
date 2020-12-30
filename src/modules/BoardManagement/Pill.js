"use strict";

const Pill = class Pill {
	constructor() {
		const _possibleVariations = ["red", "yellow", "lightblue"];
		this.getPossibleVariations = () => {
			return _possibleVariations;
		};

		this.position = { row: 0, column: 4 };
		this._colors = this._getRandomColors();
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
};

export { Pill };
