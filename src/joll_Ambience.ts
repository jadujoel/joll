import BufferLoader from "./joll_BufferLoader.js";
import Transport from "./joll_Transport.js";
import { SCHEDULE_AHEAD } from "./joll_globals.js";
import Utils from "./joll_Utils.js";
import Inactive from "./joll_Inactive.js";

export class Ambience 
{
    filePath: string;
    bufferLoader: BufferLoader;
    node: AudioBufferSourceNode;
    lowpass: BiquadFilterNode;
    gainNode: GainNode;
    context: AudioContext;
    transport: Transport;
    inactive: Inactive;
    isInactive = false;

    gain = 1;
    duckingAmountDecibel = 14;
    duckingAttackTime = 0.2;
    duckingReleaseTime = 2;
    
    inactiveElement= <HTMLInputElement> document.getElementById("ambience-inactive");
    gainElement = <HTMLInputElement> document.getElementById("ambience-gain");
    duckingAttackTimeElement = <HTMLInputElement> document.getElementById("ambience-ducking-attack-time");
    duckingReleaseTimeElement = <HTMLInputElement> document.getElementById("ambience-ducking-release-time");
    duckingAmountElement = <HTMLInputElement> document.getElementById("ambience-ducking-amount");
    
    inactiveElementValue = <HTMLSpanElement> document.getElementById("ambience-inactive-value");
    gainValueElement = <HTMLSpanElement> document.getElementById("ambience-gain-value");
    duckingAttackTimeValueElement = <HTMLSpanElement> document.getElementById("ambience-ducking-attack-time-value");
    duckingReleaseTimeValueElement = <HTMLSpanElement> document.getElementById("ambience-ducking-release-time-value");
    duckingAmountValueElement = <HTMLSpanElement> document.getElementById("ambience-ducking-amount-value");

    constructor (context:AudioContext, transport:Transport, soundfilePath:string) 
    {
        this.transport = transport;
        this.context = context;
        this.filePath = soundfilePath;
        this.bufferLoader = new BufferLoader(this.context, [this.filePath], this.bufferLoaderFinished);
        this.bufferLoader.load();

        this.node = context.createBufferSource();

        this.lowpass = context.createBiquadFilter();
        this.lowpass.frequency.value = 20000;

        this.gainNode = context.createGain();

        this.inactive = new Inactive(60000, this.oninactive.bind(this), this.onactive.bind(this));
        this.inactiveElement.addEventListener("input", this.updateInactiveTime.bind(this));
        this.updateInactiveTime();

        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);

        this.addInputListeners();

        this.transport.addEventListener("play", this.play);
        this.transport.addEventListener("stop", this.stop);
    }

    setGainDisplay (value: number) 
    {
        this.gainValueElement.innerText = `${value} dB`
    }

    private addInputListeners (): void
    {
        const updateGain = () => {
            this.gain = this.gainElement.valueAsNumber;
            this.gainValueElement.innerText = `${Math.round(Utils.gainToDecibels(this.gain))} dB`            
            this.gainNode.gain.exponentialRampToValueAtTime(this.gain, this.context.currentTime + SCHEDULE_AHEAD) 
        }

        const updateDuckingAmount = () => {
            this.duckingAmountDecibel = this.duckingAmountElement.valueAsNumber;
            this.duckingAmountValueElement.innerText = `${this.duckingAmountDecibel} dB`;
        }
        const updateAttackTime = () => {
            this.duckingAttackTime = this.duckingAttackTimeElement.valueAsNumber;
            this.duckingAttackTimeValueElement.innerText = `${this.duckingAttackTime} sec.`;
        }

        const updateReleaseTime = () => {
            this.duckingReleaseTime = this.duckingReleaseTimeElement.valueAsNumber;
            this.duckingReleaseTimeValueElement.innerText = `${this.duckingReleaseTime} sec.`;
        }

        updateGain();
        updateDuckingAmount();
        updateAttackTime();
        updateReleaseTime();

        this.gainElement.addEventListener("input", () => { 
            updateGain();
        })

        this.duckingAmountElement.addEventListener("input", () => {
            updateDuckingAmount();
        });

        this.duckingAttackTimeElement.addEventListener("input", () => {
            updateAttackTime();
        });

        this.duckingReleaseTimeElement.addEventListener("input", () => {
           updateReleaseTime();
        });

    }

    public duck (seconds: number) 
    {
        console.log("Ambience Ducking")
        const currentGain = this.gain;
        const targetGain = Utils.decibelsToGain(Utils.gainToDecibels(currentGain) - this.duckingAmountDecibel);
        this.gainNode.gain.setTargetAtTime(
            targetGain, 
            this.context.currentTime + SCHEDULE_AHEAD, 
            this.duckingAttackTime
        )
        
        this.gainNode.gain.setTargetAtTime(currentGain, this.context.currentTime + SCHEDULE_AHEAD + seconds, this.duckingReleaseTime)
    }

    private updateInactiveTime(): void 
    {
        this.inactive.timeoutTime = this.inactiveElement.valueAsNumber * 1000;
        this.inactive.update();
        this.inactiveElementValue.innerText = `${this.inactiveElement.value} Seconds`;
        
    }

    public oninactive(): void 
    {
        console.log("User inactive")
        this.lowpass.frequency.setTargetAtTime(500, this.context.currentTime + SCHEDULE_AHEAD, 5)
        this.isInactive = true; 
    }

    public onactive (): void 
    {
        if (this.isInactive) {
            console.log("User active again.")
            this.isInactive = false;
            this.lowpass.frequency.setTargetAtTime(20000, this.context.currentTime + SCHEDULE_AHEAD, 5)
        }
    }

    public bufferLoaderFinished = e => {
        console.log(`Finished loading ambience into buffer.`)
    }

    public play () 
    {
        console.log("Playing Ambience")
        this.node = this.context.createBufferSource();
        this.node.buffer = this.bufferLoader.bufferList[0];
        this.node.loop = true;

        this.node.connect(this.lowpass);
        this.lowpass.connect(this.gainNode)
        this.gainNode.connect(this.context.destination);
        
        this.node.start(this.context.currentTime + SCHEDULE_AHEAD);
        // console.log(this.lowpass.frequency);
    }

    public stop () 
    {
        this.node.stop(this.context.currentTime + SCHEDULE_AHEAD);
    }
}

export default Ambience;