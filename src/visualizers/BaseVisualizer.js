import { DrawContext } from "../Constants.js";

export default class BaseVisualizer {
	/**
	 * Context used for drawing to the screen
	 * @type {DrawContext}
	 * @memberOf BaseVisualizer
	 */
	context = null;

	constructor(context) {
		this.context = context;
	}

	Initialize() {}

	/**
	 * Draws the data to the screen
	 * @param {Array<number>} data
	 * @memberOf BarVisualizer
	 */
	Draw(data){}
}	

export const info = {

};
