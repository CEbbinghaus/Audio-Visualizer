import { Time } from "../index.js";
import BaseVisualizer from "./BaseVisualizer.js";

export default class BarVisualizer extends BaseVisualizer {
	/**
	 *
	 * @type {number}
	 * @memberOf BarVisualizer
	 */
	delayAmount = 0;

	useColor = false;
	colorSpeed = 1;

	_hue = 0;

	Initialize() {
		let gradient = ctx.createLinearGradient(0, 0, 0, 200);

		gradient.addColorStop(1, "#ADD8E6");
		gradient.addColorStop(0.65, "#576D74");
		gradient.addColorStop(0.45, "#FFAA00");
		gradient.addColorStop(0, "#FF0000");

		ctx.fillStyle = gradient;
	}

	Draw(data) {
		let ctx = this.context.context;


		// ctx.save();
		// ctx.globalAlpha = 1 - this.delayAmount;
		// ctx.fillStyle = "#fff";
		// ctx.fillRect(0, 0, this.context.width, this.context.height);
		// ctx.restore();

		let array = data;
		// for (var i = 0; i < array.length; i++) {

		// 	ctx.fillRect(
		// 		i * 2,
		// 		this.context.height - array[i],
		// 		2,
		// 		this.context.height
		// 	);
		// }
		if(this.useColor){
			this._hue = (this._hue + (this.colorSpeed * Time.DeltaTime)) % 360;
			ctx.strokeStyle = `hsl(${this._hue}, 70%, 60%)`;
		}

		var x = 0;
		var sliceWidth = this.context.width / array.length;
		ctx.beginPath();
		for (var i = 0; i < array.length; i++) {
			var v = array[i];

			var y = this.context.height / 2 - v * (this.context.height / 4);

			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		ctx.lineTo(this.context.width, this.context.height / 2);
		ctx.stroke();
	}
}
