// import mEventEmitter from "./joll_mEventEmitter.js";
import Component from "./joll_Component.js";
import Transport from "./joll_Transport.js";
import { NAME } from './joll_globals.js';


export class BeatScheduler extends Component {
    public transport: Transport;

    private timerId?: number;
    private secondsPerBeat: number = 1;
    private nextBeatTime: number = 0.0;
    private updateFrequency: number = 100; // milliseconds 

    private beatDivisionSelectElement: HTMLSelectElement = document.createElement('select'); 
    private beatDivision: number = 4;
    private beatCount: number = 0; // Read in play & stop event listener.

    private nextBeatEvent: Event;

    constructor(transport: Transport) 
    {
        super(document.createElement('div'));
        this.transport = transport;
        
        this.element.classList.add(NAME, "beatscheduler");

        this.nextBeatEvent = new Event("nextbeat");
        
        this.whilePlaying = this.whilePlaying.bind(this); 
        this.updateSecondsPerBeat = this.updateSecondsPerBeat.bind(this);

        this.transport.addEventListener("play", (event: Event) => 
        {
            console.log("Beatscheduler Play");
            // window.clearInterval(this.timerId);
            
            // window.requestAnimationFrame(() => this.timerId = window.setInterval(this.whilePlaying, this.updateFrequency));
            this.beatCount = 0;
            this.nextBeatTime = this.transport.getTimePlayed() + this.secondsPerBeat;
            this.timerId = window.setInterval(this.whilePlaying, this.updateFrequency);     
        });

        this.transport.addEventListener("stop", (event: Event) =>
        {
            console.log("Stopping beat-scheduler")
            window.clearInterval(this.timerId);
            // window.clearTimeout(this.timerId);
            // this.beatCount = 0;
            // this.nextBeatTime = 0;
        });

        this.transport.addEventListener("tempochange", (event: Event) => 
        {
            this.updateSecondsPerBeat();
        });

        this.addEventListener("nextbeat", (event: Event) =>
        {
            this.nextBeatTime += this.secondsPerBeat;
            this.beatCount += 1;
        });
        
    }

    private whilePlaying (): void 
    {
        while (this.nextBeatTime < this.transport.getTimePlayed()) 
        {
            this.dispatchEvent(this.nextBeatEvent);
        }
    }


    public getNextBeatTime (): number
    {
        return this.nextBeatTime;
    }

    public setBeatDivision (val: number): void  { this.beatDivision = val; }

    public addBeatDivisionSelectElement (element: HTMLSelectElement): void 
    {
        this.beatDivisionSelectElement = element;
        this.beatDivision = Number(this.beatDivisionSelectElement.value);        
        this.beatDivisionSelectElement.addEventListener('change', () => 
        {
            this.beatDivision = Number(this.beatDivisionSelectElement.value);
            this.updateSecondsPerBeat();
        })
        this.beatDivisionSelectElement.dispatchEvent(new Event("change")); // Dispatch event once to update values on creation
    }

    private updateSecondsPerBeat (): void
    {
        console.log("Update Seconds Per Beat");
        this.secondsPerBeat = 60.0 / this.transport.getTempo() * this.beatDivision;
        console.log(this.secondsPerBeat);
    }


}

export default BeatScheduler;