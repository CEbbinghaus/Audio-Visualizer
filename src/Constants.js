export class DrawContext{
	/**
	 * The width of the Canvas
	 * @type {number}
	 * @memberOf DrawContext
	 */
	width = 0;
	/**
	 * The Height of the Canvas
	 * @type {number}
	 * @memberOf DrawContext
	 */
	height = 0;

	/**
	 * Canvas Context used to interact with the screen
	 * @type {CanvasRenderingContext2D}
	 * @memberOf BaseVisualizer
	 */
	context = null;
	/**
	 * Canvas used for image processing
	 * @type {HTMLCanvasElement}
	 * @memberOf BaseVisualizer
	 */
	canvas = null;

	/**
	 * Creates a DrawContext from a html id
	 * @static
	 * @param {string} id
	 * @returns {DrawContext}
	 * @memberOf DrawContext
	 */
	static Initialize(id){
		const el = document.getElementById(id);

		if(!(el instanceof HTMLCanvasElement))
			throw new Error("Element ID was not a Canvas Element");

		const context = new DrawContext();

		context.width = el.width;
		context.height = el.height;
		context.canvas = el;
		context.context = el.getContext("2d");

		return context;
	}
}
