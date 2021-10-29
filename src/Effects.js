import { DrawContext } from "./Constants.js";


export class EffectOptions{
	Fade = new function(){
		this.Enabled = false;
		this.Amount = 0;
	};
}

export const AllEffects = {
	PreRender: [
		Fade,
	],
	PostRender: []
}

/**
 * Creates a slowly fading effect
 * @param {DrawContext} context
 * @param {EffectOptions} options
 * @export
 */
export function Fade(context, options){
	let ctx = context.context;

	if(!options.Fade.Enabled)
		ctx.clearRect(0, 0, context.width, context.height);

	ctx.save();
	ctx.globalAlpha = options.Fade.Amount;
	ctx.globalCompositeOperation = "copy";
	ctx.drawImage(
		context.canvas,
		0,
		0,
		context.width,
		context.height,
		0,
		0,
		context.width,
		context.height
	);
	ctx.restore();
}
