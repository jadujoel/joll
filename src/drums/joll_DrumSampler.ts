import { Slider } from "../joll_Slider.js";
import { BufferLoader } from "../joll_BufferLoader.js";
import { SCHEDULE_AHEAD } from "../joll_globals.js";
import DrumMachineTrack from "./joll_DrumMachineTrack.js";

export class DrumSampler 
{
    public node: AudioBufferSourceNode;
    private destination: AudioNode;
    
    private buffer: AudioBuffer;
    private context: AudioContext;
    
    private container: HTMLElement;
    private element: HTMLElement;
    private titleElement: HTMLElement;
    private sampleSelectorButton: HTMLButtonElement;
    private sampleSelectorInput: HTMLInputElement;
    private sampleLabel: HTMLLabelElement;

    private detuneSlider: Slider;
    private bufferLoader: BufferLoader;
    
    private sampleURL: string = "";
    private sampleFilename: string = "";
    
    private detuneAmount: number = 0;

    private muted: boolean = false;

    constructor (context:AudioContext, destination: AudioNode, container: HTMLElement) 
    {
        this.context = context;
        this.container = container;
        this.destination = destination;
        this.node = this.context.createBufferSource();

        this.bufferLoader = new BufferLoader(this.context);
        this.bufferLoader.setOnload(this.bufferLoaderFinished.bind(this));
        this.buffer = this.bufferLoader.getFirstBuffer();

        this.element = document.createElement('div');
        this.element.className = "drum-sampler";

        this.titleElement = document.createElement('H3');
        this.element.appendChild(this.titleElement);
        this.setTitle("Sampler"); 

        this.sampleSelectorButton = document.createElement('button');
        this.sampleSelectorButton.innerText = "Select Sample";

        this.sampleSelectorInput = document.createElement('input');
        this.sampleSelectorInput.type = "file";
        this.sampleSelectorInput.accept = "audio/*";
        this.sampleSelectorInput.setAttribute('data-buttonText', "Select Sample...");

        this.sampleSelectorInput.addEventListener('change', this.handleFiles.bind(this));
        this.sampleSelectorButton.addEventListener('click', this.sampleSelectorButtonClicked.bind(this));

        this.sampleLabel = document.createElement('label');

        this.element.appendChild(this.sampleSelectorButton);
        this.element.appendChild(this.sampleLabel);

        this.detuneSlider = new Slider(this.element);
        this.detuneSlider.setText("Detune: ");
        this.detuneSlider.setRange(-12000, 12000, 1);
        this.detuneSlider.setDefaultValue(0);
        this.detuneSlider.setValue(0);
        this.detuneSlider.addEventListener('input', this.updateDetune.bind(this));
        this.detuneSlider.setSuffix("cents");
        this.detuneSlider.addAndMakeVisible();

   

    }

    public setTitle (newTitle: string): void 
    {
        this.titleElement.innerText = newTitle;
    }

    public removeTitle (): void
    {
        this.element.removeChild(this.titleElement);
    }

    public setSample (newSampleURL: string, fname?: string): void 
    {
        console.log("Setting new sample");   
        if (fname === undefined) {
            this.sampleFilename = this.urlToFilename(newSampleURL);
        }     
        this.sampleURL = newSampleURL; 
        this.bufferLoader.addSample(this.sampleURL);
        this.sampleLabel.innerText = this.sampleFilename;
    }

    public addAndMakeVisible (): void 
    {
        this.container.appendChild(this.element);
    }

    public hideAndMute (): void 
    {
        this.hide();
        this.mute();
    }

    public showAndUnmute (): void
    {
        this.show();
        this.unmute();
    }

    public hide (): void {
        this.element.style.visibility = "hidden";
        this.element.style.display = "none";
    }

    public mute (): void 
    {
        this.muted = true;
    }

    public show (): void 
    {
        this.element.style.visibility = "initial";
        this.element.style.display = "initial";
    }

    public unmute (): void 
    {
        this.muted = false;
    }

    public play (time: number): void 
    {
        if (!this.muted) 
        {
            this.node = this.context.createBufferSource();
            this.node.buffer = this.buffer;
            this.node.detune.value = this.detuneAmount;
            this.node.connect(this.destination);
            this.node.start(time);
            // this.node.start(time | this.context.currentTime + SCHEDULE_AHEAD)
        }
    }

    private sampleSelectorButtonClicked (): void 
    {
        console.log("sampleSelectorButtonClicked")
        this.sampleSelectorInput.click();
    }

    private urlToFilename (url: string): string 
    {
        url = url.substring(url.lastIndexOf('/') + 1);
        return url.substring(url.lastIndexOf('\\') + 1);
    }

    private handleFiles (event): void 
    {
        var files = event.target.files;        
        this.sampleURL = URL.createObjectURL(files[0]);
        this.sampleFilename = this.urlToFilename(this.sampleSelectorInput.value);
        this.setSample(this.sampleURL, this.sampleFilename);
    }
    
    private bufferLoaderFinished(): void 
    {
        console.log(`Finished loading sample: ${this.sampleURL}`);
        this.buffer = this.bufferLoader.getLastBuffer();;
    }

    private updateDetune (): void 
    {
        this.detuneAmount = this.detuneSlider.getValue();
        this.node.detune.linearRampToValueAtTime(this.detuneSlider.getValue(), this.context.currentTime + SCHEDULE_AHEAD);
    }

}

export default DrumSampler;