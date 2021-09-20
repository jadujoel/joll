import { Slider } from "../joll_Slider.js";
import { ADSR } from "../joll_Adsr.js";
import { SCHEDULE_AHEAD } from "../joll_globals.js";
import { waveTable } from "../wave-data.js";

export class DrumSynth 
{
    public node: OscillatorNode;
    private destination:AudioNode;
    
    private wave: PeriodicWave;
    private context: AudioContext;
    private adsr: ADSR;

    private container: HTMLElement;
    private element: HTMLDivElement;
    private titleElement: HTMLElement;

    private frequencySlider: Slider;

    private frequency = 440;

    private delay = -0.00;
    private muted = false;

    constructor (context:AudioContext, destination:AudioNode, container:HTMLElement) 
    {
        this.context = context;
        this.destination = destination;
        this.container = container;
        this.wave = context.createPeriodicWave(waveTable.real, waveTable.imag);
        this.node = this.context.createOscillator();

        // Create Dom Elements
        this.element = document.createElement("div");
        this.element.className = "drum-synth"

        this.titleElement = document.createElement("H3");
        this.titleElement.innerText = "Synth";
        
        this.element.appendChild(this.titleElement);

        this.frequencySlider = new Slider(this.element);
        this.frequencySlider.setText("Frequency: ");
        this.frequencySlider.setRange(20, 8000, 1);
        this.frequencySlider.setDefaultValue(this.frequency);
        this.frequencySlider.setValue(this.frequency);
        this.frequencySlider.setSuffix("Hz");
        this.frequencySlider.addEventListener('input', this.onfrequencyinput.bind(this));
        this.frequencySlider.addAndMakeVisible();

        this.adsr = new ADSR(this.context, this.element)

        // this.frequencyControl.addEventListener('input', this.onfrequencyinput.bind(this));
        this.onfrequencyinput();
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

    public hide (): void 
    {
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

    onfrequencyinput() {
        // this.frequency = this.frequencyControl.valueAsNumber;
        // this.updateFrequencyDisplay();
        this.node.frequency.linearRampToValueAtTime(this.frequencySlider.getValue(), this.context.currentTime + SCHEDULE_AHEAD + this.delay);
        this.frequency = this.frequencySlider.getValue();
    }

    // updateFrequencyDisplay() {
    //     this.frequencyDisplay.innerText = `${this.frequencyControl.value} Hz`;
    // }


    public play(time: number) {
        if (!this.muted) 
        {
            // const time = this.context.currentTime + SCHEDULE_AHEAD + this.delay;
            
            this.node = this.context.createOscillator();
            this.node.frequency.setValueAtTime(this.frequencySlider.getValue(), this.context.currentTime);
            this.node.setPeriodicWave(this.wave);
            this.node.start(time);
            this.adsr.schedule(time);
            this.node.connect(this.adsr.node).connect(this.destination);
            this.node.stop(time + 1.5)
        }

   }

    public setMaxFrequency (val: number) 
    {
        this.frequencySlider.setMax(val)
    }

    public setFrequency (freq: number) 
    {
        this.frequencySlider.setValue(freq);
        // this.frequencyControl.value = String(freq);
        this.onfrequencyinput();
    }

}

export default DrumSynth;