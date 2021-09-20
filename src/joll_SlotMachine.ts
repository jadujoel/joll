import BufferLoader from "./joll_BufferLoader.js";
import { SCHEDULE_AHEAD } from "./joll_globals.js";

export class SlotMachine 
{
    public node: AudioBufferSourceNode;
    private bufferLoader: BufferLoader;
    private context: AudioContext;

    // cant create enums here for some reason
    private event = {
        bigwinend: 0,
        bigwinloop: 1,
        largewin: 2,
        reelspin: 3,
        smallwin: 4,
        spinbuttonclick: 5,
    }

    private audioPaths: Array<string> = [
        "./sounds/bigwinend.wav",
        "./sounds/bigwinloop.wav",
        "./sounds/largewin.wav",
        "./sounds/reelspin.wav",
        "./sounds/smallwin.wav",
        "./sounds/spinButtonClick.wav"
    ];

    constructor (context: AudioContext) {
        this.context = context;
        this.bufferLoaderFinished = this.bufferLoaderFinished.bind(this);
        this.bufferLoader = new BufferLoader(this.context, this.audioPaths, this.bufferLoaderFinished);
        this.bufferLoader.load()
        this.node = context.createBufferSource(); // To shut up null warning.
    }
    
    public play (action: number) {
        this.node = this.context.createBufferSource();
        this.node.buffer = this.bufferLoader.bufferList[action];
        this.node.connect(this.context.destination);
        this.node.start(this.context.currentTime + SCHEDULE_AHEAD)
    }
    
    public playBigwinEnd (): void { this.play(this.event.bigwinend) }
    public playBigwinLoop (): void { this.play(this.event.bigwinloop) }
    public playLargewin (): void { this.play(this.event.largewin) }
    public playReelspin (): void { this.play(this.event.reelspin) }
    public playSmallwin (): void { this.play(this.event.smallwin) }
    public playSpinButtonClick (): void { this.play(this.event.spinbuttonclick) }

    private bufferLoaderFinished () 
    {
        console.log(`Finished loading SlotMachine Audio into buffers.`)
    }
}