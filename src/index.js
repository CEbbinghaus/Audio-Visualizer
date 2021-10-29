import BaseAnalyzer from "./analyzers/BaseAnalyzer.js";
import { DrawContext } from "./Constants.js";
import { ConstructAnalyzer } from "./ConstructAnalyzer.js";
import BarVisualizer from "./visualizers/BarVisualizer.js";
import BaseVisualizer from "./visualizers/BaseVisualizer.js";
import "./Modal.js";
import {AllEffects, EffectOptions } from "./Effects.js";

export class Time{
	static DeltaTime = 0;
	static TotalTime = 0;
	static Scale = 1;
	static UnscaledTime = 0;
	static UnscaledTotal = 0;

	static _lastTime = 0;

	static Update(currentTime){
		const diff = currentTime - this._lastTime;
		this._lastTime = currentTime;

		const diffS = diff / 1000;

		const scaledDiff = diffS * this.Scale;

		this.DeltaTime = scaledDiff;
		this.TotalTime += scaledDiff;

		this.UnscaledTime = diffS;
		this.UnscaledTotal += diffS
	}
}

window.Time = Time;


class Options{

	/**
	 * @type {EffectOptions}
	 * @memberOf Options
	 */
	Effects = new EffectOptions();

	VisualizerOptions = null;

}


class Visualizer{

	/**
	 * Drawing context of the Application
	 * @type {DrawContext}
	 * @memberOf Visualizer
	 */
	defaultContext = null;

	/**
	 * Canvas that the Visualizer is drawing to
	 * @type {HTMLCanvasElement}
	 * @memberOf Visualizer
	 */
	canvas = null

	/**
	 * Analyzer to supply the data array
	 * @type {BaseAnalyzer}
	 * @memberOf Visualizer
	 */
	analyzer = null;

	/**
	 * Visualizer to visualize the data
	 * @type {BaseVisualizer}
	 * @memberOf Visualizer
	 */
	visualizer = null;

	/**
	 * All options to influence the appearance of the visualizer
	 * @type {Options}
	 * @memberOf Visualizer
	 */
	options = new Options();

	constructor(){
		window.onresize = this.Resize.bind(this);
		this.analyzer = ConstructAnalyzer();

		//TODO: Remove and replace with Visualizer Loading

		this.Initialize().then(this.Tick.bind(this, 0));
	}

	async Initialize(){
		this.defaultContext = new DrawContext();
		this.defaultContext.canvas = document.getElementById("VisualizerCanvas");

		this.defaultContext.context = this.defaultContext.canvas.getContext("2d");
		this.Resize();

		this.visualizer = new BarVisualizer(this.defaultContext);

		await this.analyzer.Initialize();
	}

	Resize(){
		const width = window.innerWidth;
		const height = window.innerHeight;

		this.defaultContext.width = this.defaultContext.canvas.width = width;
		this.defaultContext.height = this.defaultContext.canvas.height = height;
	}

	/**
	 *
	 *
	 * @param {number} currentTime
	 *
	 * @memberOf Visualizer
	 */
	Tick(currentTime){
		Time.Update(currentTime);

		const data = this.analyzer && this.analyzer.Tick();

		this.defaultContext.context.save();


		if(data){
			for(let effect of AllEffects.PreRender){
				effect.apply(null, [this.defaultContext, this.options.Effects]);
			}
			this.visualizer && this.visualizer.Draw(data);
			for(let effect of AllEffects.PostRender){
				effect.apply(null, [this.defaultContext, this.options.Effects]);
			}
		}

		this.defaultContext.context.restore();

		window.requestAnimationFrame(this.Tick.bind(this));
	}
}

console.log("Hello World!");
window.onload = function(){
	window.sim = window.Visualizer = new Visualizer();
}
