import { SCHEDULE_AHEAD } from "./joll_globals.js";
import Utils from "./joll_Utils.js";

export class ADSR {
    private context:   AudioContext;
    private container: HTMLElement;
    private element:   HTMLDivElement;
    
    private attackTimeLabel:  HTMLLabelElement;
    private decayTimeLabel:   HTMLLabelElement;
    private sustainTimeLabel: HTMLLabelElement;
    private sustainGainLabel: HTMLLabelElement;
    private releaseTimeLabel: HTMLLabelElement;

    private attackTimeValueElement:  HTMLSpanElement;
    private decayTimeValueElement:   HTMLSpanElement;
    private sustainTimeValueElement: HTMLSpanElement;
    private sustainGainValueElement: HTMLSpanElement;
    private releaseTimeValueElement: HTMLSpanElement;
    
    private attackTimeControl:  HTMLInputElement;
    private decayTimeControl:   HTMLInputElement;
    private sustainTimeControl: HTMLInputElement;
    private sustainGainControl: HTMLInputElement;
    private releaseTimeControl: HTMLInputElement;

    private attackTime  = 0.000
    private decayTime   = 0.020
    private sustainTime = 0.050;
    private sustainGainDecibel = 0;
    private sustainGainLinear = 1;
    private releaseTime = 0.050;

    private gainNode: GainNode;

    public node: GainNode;

    constructor(context:AudioContext, container:HTMLElement) {
        this.context = context;
        this.container = container;

        /** Create DOM elements */
        this.element = document.createElement('div');
        this.element.className = "adsr"
        this.element.innerHTML = "<H3>ADSR</H3>"
        this.container.appendChild(this.element); 

        this.attackTimeControl = document.createElement('input');
        this.attackTimeControl.type = "range";
        this.attackTimeControl.step = "0.001";
        this.attackTimeControl.defaultValue = String(this.attackTime);
        this.attackTimeControl.min = "0";
        this.attackTimeControl.max = "0.200";
        
        this.attackTimeLabel = document.createElement('label');
        this.attackTimeLabel.innerText = "Attack Time:"
        this.attackTimeValueElement = document.createElement('span');
        this.element.appendChild(this.attackTimeLabel);
        this.element.appendChild(this.attackTimeValueElement);
        this.element.appendChild(this.attackTimeControl);
        this.decayTimeControl = document.createElement('input');
        this.decayTimeControl.type = "range";
        this.decayTimeControl.step = "0.001";
        this.decayTimeControl.defaultValue = String(this.decayTime);
        this.decayTimeControl.min = "0.001";
        this.decayTimeControl.max = "0.200";

        this.decayTimeLabel = document.createElement('label');
        this.decayTimeLabel.innerText = "Decay Time:"
        this.decayTimeValueElement = document.createElement('span');
        this.element.appendChild(this.decayTimeLabel);
        this.element.appendChild(this.decayTimeValueElement);
        this.element.appendChild(this.decayTimeControl);

        this.sustainTimeControl = document.createElement('input');
        this.sustainTimeControl.type = "range";
        this.sustainTimeControl.step = "0.001";
        this.sustainTimeControl.defaultValue = String(this.sustainTime);
        this.sustainTimeControl.min = "0.001";
        this.sustainTimeControl.max = "0.200";

        this.sustainTimeLabel = document.createElement('label');
        this.sustainTimeLabel.innerText = "Sustain Time:"
        this.sustainTimeValueElement = document.createElement('span');
        this.element.appendChild(this.sustainTimeLabel);
        this.element.appendChild(this.sustainTimeValueElement);
        this.element.appendChild(this.sustainTimeControl);

        this.sustainGainControl = document.createElement('input');
        this.sustainGainControl.type = "range";
        this.sustainGainControl.step = "1";
        this.sustainGainControl.defaultValue = String(this.sustainGainDecibel);
        this.sustainGainControl.min = "-40";
        this.sustainGainControl.max = "0";
       
        this.sustainGainLabel = document.createElement('label');
        this.sustainGainLabel.innerText = "Sustain Amplitude:"
        this.sustainGainValueElement = document.createElement('span');
        this.element.appendChild(this.sustainGainLabel);
        this.element.appendChild(this.sustainGainValueElement);
        this.element.appendChild(this.sustainGainControl);

        this.releaseTimeControl = document.createElement('input');
        this.releaseTimeControl.type = "range";
        this.releaseTimeControl.step = "0.001";
        this.releaseTimeControl.defaultValue = String(this.releaseTime);
        this.releaseTimeControl.min = "0";
        this.releaseTimeControl.max = "0.200";
        
        this.releaseTimeLabel = document.createElement('label');
        this.releaseTimeLabel.innerText = "Release Time:"
        this.releaseTimeValueElement = document.createElement('span');
        this.element.appendChild(this.releaseTimeLabel);
        this.element.appendChild(this.releaseTimeValueElement);
        this.element.appendChild(this.releaseTimeControl);

        // Event Listeners
        this.attackTimeControl.addEventListener('input', this.onattacktimeinput.bind(this));
        this.decayTimeControl.addEventListener('input', this.ondecaytimeinput.bind(this));
        this.sustainTimeControl.addEventListener('input', this.onsustaintimeinput.bind(this));
        this.sustainGainControl.addEventListener('input', this.onsustaingaininput.bind(this));
        this.releaseTimeControl.addEventListener('input', this.onreleasetimeinput.bind(this));

        this.updateDisplayValues();

        this.gainNode = this.context.createGain();
        this.node = this.gainNode;
    }

    public schedule(time?: number) {
        var _time = time || this.context.currentTime;
        _time += SCHEDULE_AHEAD;
        let startTime = _time;
        
        // Reset Gain
        this.gainNode.gain.cancelScheduledValues(_time);
        this.gainNode.gain.setValueAtTime(0, _time);
        
        // Attack Phase
        this.gainNode.gain.setTargetAtTime(1, startTime, this.attackTime); 
        
        // Decay Phase
        startTime += this.attackTime;
        this.gainNode.gain.setTargetAtTime(this.sustainGainLinear, startTime, this.decayTime); 
        
        // Release Phase
        startTime += (this.decayTime + this.sustainTime);
        this.gainNode.gain.setTargetAtTime(0, startTime, this.releaseTime)
    }

    private updateDisplayValues() {
        this.setAttackTimeDisplayValue(this.attackTimeControl.valueAsNumber);
        this.setDecayTimeDisplayValue(this.decayTimeControl.valueAsNumber);    
        this.setSustainTimeDisplayValue(this.sustainTimeControl.valueAsNumber);
        this.setSustainGainDisplayValue(this.sustainGainControl.valueAsNumber); 
        this.setReleaseTimeDisplayValue(this.releaseTimeControl.valueAsNumber); 
    }

    private createInputElement(): HTMLInputElement
    {
        const element = <HTMLInputElement> document.createElement('input');
        return element;
    }

    onattacktimeinput(): void
    { 
        this.setAttackTime(this.attackTimeControl.valueAsNumber); 
        this.setAttackTimeDisplayValue(this.attackTime);
    }

    ondecaytimeinput(): void
    { 
        this.setDecayTime(this.decayTimeControl.valueAsNumber); 
        this.setDecayTimeDisplayValue(this.decayTimeControl.valueAsNumber);    
    }

    onsustaintimeinput(): void
    { 
        this.setSustainTime(this.sustainTimeControl.valueAsNumber); 
        this.setSustainTimeDisplayValue(this.sustainTimeControl.valueAsNumber);
    }

    onsustaingaininput(): void 
    { 
        this.setSustainGainDecibel(this.sustainGainControl.valueAsNumber); 
        this.setSustainGainDisplayValue(this.sustainGainControl.valueAsNumber); 
    }

    onreleasetimeinput(): void 
    { 
        this.setReleaseTime(this.releaseTimeControl.valueAsNumber); 
        this.setReleaseTimeDisplayValue(this.releaseTimeControl.valueAsNumber); 
    }


    setSustainGainDecibel(gainDecibel:number) 
    { 
        this.sustainGainDecibel = gainDecibel;
        this.sustainGainLinear = Utils.decibelsToGain(gainDecibel);
    }

    setSustainGainLinear(gainLinear:number) 
    { 
        this.sustainGainLinear = gainLinear; 
        this.sustainGainDecibel = Utils.gainToDecibels(gainLinear);
    }

    setAttackTime(time: number): void { this.attackTime = time; }
    setDecayTime(time: number): void { this.decayTime = time; }
    setSustainTime(time: number): void { this.sustainTime = time; }
    setReleaseTime(time: number): void { this.releaseTime = time; }

    setAttackTimeDisplayValue(val: number): void  { this.attackTimeValueElement.innerText = `${Math.round(val*1000)} ms` }
    setDecayTimeDisplayValue(val: number): void   { this.decayTimeValueElement.innerText  = `${Math.round(val*1000)} ms` }
    setReleaseTimeDisplayValue(val: number): void { this.releaseTimeValueElement.innerText = `${Math.round(val*1000)} ms` }
    setSustainTimeDisplayValue(val: number): void { this.sustainTimeValueElement.innerText = `${Math.round(val*1000)} ms` }
    setSustainGainDisplayValue(val: number): void { this.sustainGainValueElement.innerText = `${val} dB` }
}

export default ADSR;