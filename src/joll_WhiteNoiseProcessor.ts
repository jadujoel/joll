// white-noise-processor.js

export class WhiteNoiseProcessor extends AudioWorkletProcessor 
{
    override process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Map<string, Float32Array>): void 
	{
        const output = outputs[0]
    
		output.forEach(
			(channel: Float32Array) => 
			{
				for (let i = 0; i < channel.length; i++) 
				{
					channel[i] = Math.random() * 2 - 1
				}
			});
		// return true;
    }
}
  
registerProcessor('white-noise-processor', WhiteNoiseProcessor)

export default WhiteNoiseProcessor;