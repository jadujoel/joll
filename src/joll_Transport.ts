// import BeatScheduler from './joll_BeatScheduler.js';
// import TempoTrack from './joll_TempoTrack.js';
import Button from './joll_Button.js';
import { NAME } from './joll_globals.js';
import ScrollBox from './joll_ScrollBox.js';
import Component from './joll_Component.js';


export class Transport extends Component
{
    private tempo: number = 0;
    // private tempoTrack: TempoTrack;
    // private useTempoTrack = false;
    // private onplayCallbacks: Array<Function>;
    // private onstopCallbacks: Array<Function>;

    private isPlaying: boolean;
    private context: AudioContext;
    private playStartTime: number = 0;

    private playButton: Button;
    private scrollBox: ScrollBox;

    private playEvent: Event;
    private stopEvent: Event;
    private tempoChangeEvent: Event;

    constructor (context: AudioContext, container: HTMLElement) 
    {    
        super(container);
        this.context = context;



        // Dispatch a play / stop event when playbutton is clicked.
        this.playEvent = new Event('play');
        this.stopEvent = new Event('stop');
        this.tempoChangeEvent = new Event('tempochange');
        
        this.element.className = `${NAME}-transport`;
        
        // Add Tempo Input Component
        this.scrollBox = new ScrollBox(this.element);
        this.scrollBox.addClassNames("tempo");

        this.scrollBox.addValueChangedCallback( (value: number) =>  
        { 
            this.tempo = value 
            this.dispatchEvent(this.tempoChangeEvent);
        });

        this.scrollBox.setRange(40, 240);
        this.scrollBox.setDefaultValue(120);
        this.scrollBox.label.setPrefix("TEMPO");
        this.scrollBox.label.setSuffix("BPM");
        this.scrollBox.addAndMakeVisible();
        
        // Play
        this.isPlaying = false;
        
        this.playButton = new Button(this.element);
        this.playButton.setClassName(`${NAME}-transport-play`)
        this.playButton.addShortcut(' '); // Space bar triggers play
        this.playButton.addAndMakeVisible();


        this.playButton.addEventListener <"click"> ("click" , (event: Event): void =>
        {
            this.isPlaying = !this.isPlaying;
            this.dispatchEvent(this.isPlaying ? this.playEvent : this.stopEvent);
        });

        this.addEventListener <"play"> ("play", (event: Event): void => 
        {
            console.log("play")
            this.playStartTime = this.context.currentTime;
            if (this.context.state === "suspended") {
                this.context.resume();
            }
        });

        this.addEventListener ("stop", (event: Event): void => 
        {
            console.log("stop")
            if (this.context.state === "running") { 
                this.context.suspend(); 
            }
        });

    }

    public getTimePlayed (): number 
    {
        return this.context.currentTime - this.playStartTime;
    }

    public getTempo (): number 
    { 
        return this.tempo; 
    }
}

export default Transport;
