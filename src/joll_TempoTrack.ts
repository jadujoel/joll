import Utils from "./joll_Utils.js";

export class TempoTrack 
{
    tempoList = [
        { "position": [1,  1,  1, 1], "bpm": 79.7384, "SMPTE": "01:00:00:00.00" },
        { "position": [5,  1,  1, 1], "bpm": 80.1336, "SMPTE": "01:00:12:00.79" },
        { "position": [9,  1,  1, 1], "bpm": 79.5696, "SMPTE": "01:00:24:00.39" },
        { "position": [13, 1,  1, 1], "bpm": 82.6713, "SMPTE": "01:00:36:02.09" },
        { "position": [14, 1,  1, 1], "bpm": 79.2618, "SMPTE": "01:00:38:24.55" },
        { "position": [17, 1,  1, 1], "bpm": 80.0875, "SMPTE": "01:00:48:01.62" },
        { "position": [19, 1,  1, 1], "bpm": 80.5184, "SMPTE": "01:00:54:01.49" },
        { "position": [23, 1,  1, 1], "bpm": 79.8309, "SMPTE": "01:01:05:24.55" },
        { "position": [25, 1,  1, 1], "bpm": 79.5696, "SMPTE": "01:01:12:00.00" }
    ]

    private tempoQueue: Utils.Queue;
    
    private position: Array<number> = [];
    private bpm:number = 120;
    private smpte:string = "01:00:00:00.00";
    
    private beatsPerBar = 4;
    private nextTempoEntry: any;

    private beatCount:number = 1;
    private bar:number = 1;
    private beat:number = 1;
    private eigth:number = 1;
    private sixteenth:number = 1;

    constructor () 
    {
        this.tempoQueue = new Utils.Queue;
        this.tempoQueue.setElements(this.tempoList);
        this.next();
    }

    public getNextTempo (beatCount: number): number 
    {
        this.beatCount = beatCount;
        if (this.shouldGetNextEntry()) { this.next() }
        return this.bpm;
    }

    private next(): void 
    {
        console.log("Next tempo")
        this.nextTempoEntry = this.tempoQueue.dequeue();
        this.position = this.nextTempoEntry.position;
        this.bpm = this.nextTempoEntry.bpm;
        this.smpte = this.nextTempoEntry.SMPTE; 
    }

    public onstop(): void
    {
        console.log("Resetting Tempo Track.")
        this.tempoQueue.setElements(this.tempoList)
    }

    private shouldGetNextEntry (): boolean 
    {
        this.bar = 1 + Math.floor(this.beatCount / this.beatsPerBar);
        if(this.tempoQueue.peek() === undefined) {
            this.tempoQueue.setElements(this.tempoList); 
        }
        return (this.tempoQueue.peek().position[0] === this.bar);
    }
}

export default TempoTrack;