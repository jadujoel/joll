import DrumMachineTrack from "./joll_DrumMachineTrack.js";
import Transport from "../joll_Transport.js";
import BeatScheduler from "../joll_BeatScheduler.js";
import { SCHEDULE_AHEAD } from "../joll_globals.js";

export class DrumMachineComponent 
{
    public sampleDirectory = "./sounds/drums/";
    public kickPath = `${this.sampleDirectory}kick.mp3`
    public snarePath = `${this.sampleDirectory}snare.mp3`
    public hihatPath = `${this.sampleDirectory}hihat.mp3`
    public cymbalPath = `${this.sampleDirectory}cymbal.mp3`
    
    public tracks: Array<DrumMachineTrack>;

    public kickTrack: DrumMachineTrack;
    public snareTrack: DrumMachineTrack;
    public hihatTrack: DrumMachineTrack;
    public cymbalTrack: DrumMachineTrack;

    public node:GainNode;

    private container: HTMLElement;
    private element: HTMLElement;
    private titleElement: HTMLElement;
    private beatDivisionContainer: HTMLElement;
    private beatDivisionSelectElement: HTMLSelectElement;

    private context: AudioContext;

    private transport:Transport;
    private beatScheduler:BeatScheduler;


    constructor (context: AudioContext, transport: Transport, container: HTMLElement) 
    {
        console.log(`Constructing Drum Sequencer`);
        
        this.context = context;
        this.transport = transport;
        this.container = container;

        this.element = document.createElement('div');
        this.element.className = "drum-machine";

        this.titleElement = document.createElement('H3');
        this.titleElement.innerText = "Drum Machine";
        this.element.appendChild(this.titleElement);

        // Create Beat division container
        this.beatDivisionContainer = document.createElement('div');
        this.beatDivisionContainer.className = "beat-division";
        
        const label = document.createElement('label');
        label.innerText = "Beat Division";

        this.beatDivisionSelectElement = <HTMLSelectElement> document.createElement('select');
        this.beatDivisionSelectElement.name = 'beat-division'

        const option1 = document.createElement('option');
        option1.value = "1.0";
        option1.innerText = "1/4";
        
        const option2 = document.createElement('option');
        option2.innerText = "1/8";
        option2.value = "0.5";
        option2.selected = true;

        const option3 = document.createElement('option');
        option3.innerText = "1/16";
        option3.value = "0.25";

        this.beatDivisionContainer.appendChild(label);
        this.beatDivisionSelectElement.appendChild(option1);
        this.beatDivisionSelectElement.appendChild(option2);
        this.beatDivisionSelectElement.appendChild(option3);
        this.beatDivisionContainer.appendChild(this.beatDivisionSelectElement);
        this.element.appendChild(this.beatDivisionContainer);

        // Schedule Audio Beats
        this.nextBeat = this.nextBeat.bind(this);
        this.beatScheduler = new BeatScheduler(this.transport);
        this.beatScheduler.addEventListener("nextbeat", this.nextBeat);

        this.beatScheduler.addBeatDivisionSelectElement(this.beatDivisionSelectElement);
        
        // Connect Nodes
        this.node = this.context.createGain();
        
        // Create Tracks
        this.kickTrack = new DrumMachineTrack(this.context, this.transport, this.element, this.node);
        this.kickTrack.addAndMakeVisible();
        this.kickTrack.setNumSequencerPads(16);
        this.kickTrack.setTitle("Kick");
        this.kickTrack.setSample(this.kickPath);

        this.snareTrack = new DrumMachineTrack(this.context, this.transport, this.element, this.node);
        this.snareTrack.addAndMakeVisible();
        this.snareTrack.setNumSequencerPads(16);
        this.snareTrack.setTitle("Snare");
        this.snareTrack.setSample(this.snarePath);

        this.hihatTrack = new DrumMachineTrack(this.context, this.transport, this.element, this.node);
        this.hihatTrack.addAndMakeVisible();
        this.hihatTrack.setNumSequencerPads(16);
        this.hihatTrack.setTitle("Hihat");
        this.hihatTrack.setSample(this.hihatPath);

        this.cymbalTrack = new DrumMachineTrack(this.context, this.transport, this.element, this.node);
        this.cymbalTrack.addAndMakeVisible();
        this.cymbalTrack.setNumSequencerPads(16);
        this.cymbalTrack.setTitle("Cymbal");
        this.cymbalTrack.setSample(this.cymbalPath);

        this.tracks = [this.kickTrack, this.snareTrack, this.hihatTrack, this.cymbalTrack];
    }


    public setNumSequencerPads (newNumberOfPads: number): void
    {
        this.tracks.forEach ( (track) => 
        { 
            track.setNumSequencerPads(newNumberOfPads) 
        } )
    }
    public addAndMakeVisible (): void  { this.container.appendChild(this.element); }
    
    public nextBeat (): void 
    { 
        const stime = this.beatScheduler.getNextBeatTime(); 
        const time = stime + SCHEDULE_AHEAD;
        console.log(`DrumMachine Next Beat at ${time}, beatsched: ${stime}, schedahead ${SCHEDULE_AHEAD}`);
        this.tracks.forEach ( (track) => 
        { 
            track.nextBeat(time); 
        } ) 
    }

    public removeSamplerTitles (): void
    {
        this.tracks.forEach( (track) => 
        {
            track.sampler.removeTitle();
        })
    }

}

export default DrumMachineComponent;