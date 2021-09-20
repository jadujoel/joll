declare type AudioParamDescriptor = any;

interface AudioWorkletProcessor 
{
	readonly port: MessagePort;
	process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Map<string, Float32Array>): void;
}

declare var AudioWorkletProcessor: 
{
	prototype: AudioWorkletProcessor;
	new(options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
}

declare function registerProcessor ( name: string, 
	processorCtor: (new (options?: AudioWorkletNodeOptions) => AudioWorkletProcessor) 
	& { parameterDescriptors?: AudioParamDescriptor[]; } ): undefined;
