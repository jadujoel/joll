import GainComponent from "../joll_GainComponent.js";
import DrumSampler from "./joll_DrumSampler.js";
import DrumSynth from "./joll_DrumSynth.js";
import Transport from "../joll_Transport.js";

export class DrumMachineTrack 
{
    public node: GainNode;
    public sampler: DrumSampler;
    public synth: DrumSynth;
    
    private destinationNode: AudioNode;    
    
    private context: AudioContext;
    private transport: Transport;

    private numNotes: number;
    private currentNote: number = 0;

    private numSequencePads: number = 8;

    private container: HTMLElement;
    private element: HTMLElement;
    private titleElement: HTMLElement;
    private drumTypeChooser: HTMLElement;
    private padContainer: HTMLElement;
    private effectContainer: HTMLElement;
    private currentElement: HTMLButtonElement;
    private buttonElements: NodeListOf<HTMLButtonElement>;

    private gainComponent: GainComponent;
    // private detuneSlider: Slider;


    private drumType: "sampler" | "synth" = "sampler";

    private useSynth: boolean;


    constructor(context: AudioContext, transport: Transport, container: HTMLElement, destinationNode: AudioNode, enableSynth?: boolean)
    {
        this.context = context;
        this.transport = transport;
        this.transport.addEventListener("stop", (event: Event) => this.currentNote = 0 );

        this.useSynth = enableSynth || false;

        this.container = container;
        this.destinationNode = destinationNode;

        this.node = context.createGain();

        this.element = document.createElement('div');
        this.element.className = 'drum-track';

        this.titleElement = document.createElement('H3');
        this.titleElement.className = "title";
        this.element.appendChild(this.titleElement);

        this.drumTypeChooser = document.createElement('button');
        if (enableSynth) 
        {
            this.drumType = "sampler";
            this.drumTypeChooser.innerText = "Sampler / Synth"
            this.drumTypeChooser.addEventListener('click', this.drumTypeChooserClick.bind(this));
            this.element.appendChild(this.drumTypeChooser);
        }

        this.padContainer = <HTMLDivElement> document.createElement('div');
        this.padContainer.className = "sequencer-pad-container";
        this.padContainer.classList.add("notes");
        this.element.appendChild(this.padContainer);

        // Construct Sequencer Pads
        var _button: HTMLButtonElement;
        for (let i = 0; i < this.numSequencePads; i++) {
            _button = <HTMLButtonElement> document.createElement('button');
            _button.className = "sequencer-pad";
            _button.setAttribute("role", "switch");
            _button.setAttribute("aria-checked", "false");
            this.padContainer.appendChild(_button);
        }
        this.buttonElements = <NodeListOf<HTMLButtonElement>> this.padContainer.childNodes;
        this.currentElement = this.buttonElements[0];
        this.addEventListenerForPads();
        
        this.numNotes = this.buttonElements.length;
        this.currentNote = 0;

        this.sampler = new DrumSampler(this.context, this.node, this.element);
        this.sampler.addAndMakeVisible();

        this.synth = new DrumSynth(this.context, this.node, this.element);
        if (enableSynth) {
            this.synth.addAndMakeVisible();
            this.synth.hideAndMute();
        }

        this.effectContainer = <HTMLDivElement> document.createElement('div');
        this.effectContainer.className = "fx";
        this.gainComponent = new GainComponent(this.context, this.effectContainer);
        this.gainComponent.addAndMakeVisible();
        this.element.appendChild(this.effectContainer);

        this.node.connect(this.gainComponent.node).connect(this.destinationNode);
    }

    public addAndMakeVisible (): void 
    {
        this.container.appendChild(this.element);
    }

    public setSample (newSample: string) 
    {
        this.sampler.setSample(newSample);
    }

    public setTitle (newTitle: string): void 
    {
        this.titleElement.innerText = newTitle;
    }

    public setNumSequencerPads (newNumPads: number): void 
    {
        this.numSequencePads = newNumPads;
        this.numNotes = newNumPads;
        this.constructSequencerPads();
    }

    public play (time: number) 
    {
        this.sampler.play(time);
        if (this.useSynth) {
            this.synth.play(time);
        }
    }


    public nextBeat ( nextBeatTime: number ) 
    {
        if (this.currentNoteShouldPlay()) { this.play( nextBeatTime ); }
        this.draw();
        this.iterateCurrentNote();
    }

    private constructSequencerPads (): void 
    {
        this.deleteSequencerPads();
        var _button: HTMLButtonElement;
        for (let i = 0; i < this.numSequencePads; i++) {
            _button = <HTMLButtonElement> document.createElement('button');
            _button.className = "sequencer-pad";
            _button.setAttribute("role", "switch");
            _button.setAttribute("aria-checked", "false");
            this.padContainer.appendChild(_button);
        }
        this.buttonElements = <NodeListOf<HTMLButtonElement>> this.padContainer.childNodes;
        this.currentElement = this.buttonElements[0];
        this.addEventListenerForPads();
    }

    private deleteSequencerPads (): void 
    {
        while (this.padContainer.lastElementChild) {
            this.padContainer.lastElementChild.remove();
        }        
    }

    private addEventListenerForPads (): void 
    {
        this.buttonElements.forEach((btn) => {
            btn.addEventListener("click", () => {
                btn.setAttribute("aria-checked",  
                (btn.getAttribute("aria-checked") === "true") ? "false" : "true")
            })
        })
    }

    private isChecked (element: HTMLButtonElement): Boolean 
    {
        return (element.getAttribute('aria-checked') === 'true')
    }

    private currentNoteShouldPlay ():Boolean 
    {
        return this.isChecked(this.buttonElements.item(this.currentNote));
    }

    private iterateCurrentNote (): void {
        this.currentNote++;
        if (this.currentNote === this.numNotes) { this.currentNote = 0; }
    }

    private draw (): void 
    {
        this.currentElement.classList.remove("playing-now")
        this.currentElement = this.buttonElements[this.currentNote]
        this.currentElement.classList.add("playing-now")
    }

    private drumTypeChooserClick (): void
    {
        if (this.drumType === "sampler") 
        {
            this.drumType = "synth";
            this.sampler.hideAndMute();
            this.synth.showAndUnmute();
            this.drumTypeChooser.innerText = "Synth / Sampler"
        }
        else 
        {
            this.drumType = "sampler";
            this.sampler.showAndUnmute();
            this.synth.hideAndMute();
            this.drumTypeChooser.innerText = "Sampler / Synth"
        }
    }
}

export default DrumMachineTrack;
