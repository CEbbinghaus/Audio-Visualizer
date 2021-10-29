import BaseAnalyzer from "./BaseAnalyzer.js";

export class WebAnalyzer extends BaseAnalyzer{

	/**
	 *
	 * @type {Uint8Array} array
	 * @memberOf WebAnalyzer
	 */
	spectrumArr = null;

	/**
	 *
	 * @type {number}
	 * @memberOf WebAnalyzer
	 */
	elementCount = -1;

	/**
	 * Audio Context that the Data will be visualized from
	 * @type {AudioContext}
	 * @memberOf WebAnalyzer
	 */
	context = null;

	/**
	 * The size of the Output array
	 * @type {number}
	 * @memberOf WebAnalyzer
	 */
	resultArraySize = -1;

	async GetUserInteraction(){
		return new Promise((res) => {
			window.onclick = () => {
				window.onclick = void 0;
				res();
			};
			window.onmousemove = () => {
				window.onmousemove = void 0;
				res();
			};
		})
	}

	/**
	 * Calculates the size of the output array to limit the range to 20-20kHz
	 * @param {AudioContext} context
	 * @param {AnalyserNode} analyser
	 *
	 * @memberOf WebAnalyzer
	 */
	CalculateResultArraySize(context, analyser){

		let total = context.sampleRate / 2;
		let arraySize = analyser.fftSize / 2;

		if(total < 20000)
			return arraySize;

		let rangePerElement = total / arraySize;

		let diff = total - 20000;

		let amountOfElements = (diff / rangePerElement) | 0; // Round down since this needs to be an even number

		return arraySize - amountOfElements;

	}

	async Initialize(){
		let HasSuccessfullyInitialized = false;

		while(!HasSuccessfullyInitialized){
			await this.GetUserInteraction();
			this.context = new AudioContext();

			HasSuccessfullyInitialized = this.context.state == "running";
		}



		let analyser = window.analyser = this.context.createAnalyser();
		analyser.smoothingTimeConstant = 0.7;

		this.resultArraySize = this.CalculateResultArraySize(this.context, analyser);

		const stream = await navigator.mediaDevices.getDisplayMedia({audio: true, video: true})

		let source = this.context.createMediaStreamSource(stream);
		source.connect(analyser);

		this.spectrumArr = new Uint8Array(
			(this.elementCount = analyser.frequencyBinCount)
		);
	}

	/**
	 *
	 * @returns {Array<number>} a 0-1 height array
	 * @memberOf WebAnalyzer
	 */
	ProcessSpectrum(){
		const processed = Array.from(this.spectrumArr);

		for(let i = 0; i < processed.length; ++i){
			let element = processed[i];
			element += processed[Math.max(0, i - 1)];
			element += processed[Math.min(processed.length, i + 1)];

			processed[i] = element / 3;

		}
		for(let i = 0; i < processed.length; ++i){
			processed[i] = processed[i] / 128.0;
		}

		return processed.slice(0, this.resultArraySize);
	}

	Tick(){
		analyser.getByteFrequencyData(this.spectrumArr);

		return this.ProcessSpectrum();
	}
}
