import Utils from "./joll_Utils.js";
import { SCHEDULE_AHEAD } from "./joll_globals.js";

export class RisingNoise {
    whiteNoiseNode?: AudioWorkletNode; // ? to suppress null warning since initialized in promise.
    context: AudioContext;
    filter: BiquadFilterNode;
    gainNode: GainNode;
    currentGain: number = 1;
    fadeinTime: number = 0.8;
    fadeoutTime: number = 0.6;

    constructor(context:AudioContext) {
        this.context = context;

        this.filter = this.context.createBiquadFilter();
        this.filter.type = "bandpass";
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.filter);
        
        this.context.audioWorklet.addModule('./audio-worklet-processors.js').then(() => {
            this.whiteNoiseNode = new AudioWorkletNode(this.context, 'white-noise-processor');
            this.whiteNoiseNode.connect(this.gainNode);
        }, (e) => { console.log(`couldn't load white Noise node :( ${e}`) })

        this.setGain(1.0);
        this.filter.frequency.setValueAtTime(200, this.context.currentTime);
    }

    setGain(val:number) {
        this.currentGain = val;
        this.gainNode.gain.exponentialRampToValueAtTime(val, this.context.currentTime + SCHEDULE_AHEAD + 0.2)
    }

    setGainDecibel(val:number) {
        this.setGain(Utils.decibelsToGain(val));
    }

    play() {
        console.log(`play rising noise ${this.currentGain}`)
        this.filter.frequency.cancelScheduledValues(this.context.currentTime);
        this.gainNode.gain.cancelScheduledValues(this.context.currentTime);
        this.filter.frequency.setValueAtTime(200, this.context.currentTime);
        // this.setGain(this.currentGain);
        const playTimeSeconds = 5; 
        this.filter.frequency.setTargetAtTime(2800, this.context.currentTime + SCHEDULE_AHEAD, playTimeSeconds);
        this.filter.connect(this.context.destination);
        this.fadein();
    }

    stop() {
        this.fadeout()
    }

    fadein() {
        this.gainNode.gain.setTargetAtTime(this.currentGain, this.context.currentTime + SCHEDULE_AHEAD, this.fadeinTime);
    }

    fadeout() {
        this.gainNode.gain.setTargetAtTime(Utils.decibelsToGain(-160), this.context.currentTime, this.fadeoutTime);
        setTimeout(this.fadeoutend.bind(this), (this.fadeoutTime + 1 + SCHEDULE_AHEAD) * 1000);
    }

    fadeoutend() {
        // console.log("FadeoutEnd")
        // this.filter.disconnect();
        // this.filter.frequency.setValueAtTime(200, this.context.currentTime);
    }
}