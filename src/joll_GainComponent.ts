import Slider from "./joll_Slider.js";
import { SCHEDULE_AHEAD } from "./joll_globals.js";
import Utils from "./joll_Utils.js";
import Component from "./joll_Component.js";

export class GainComponent extends Component
{
    private context: AudioContext;
    public slider: Slider;
    public node: GainNode;

    constructor (context: AudioContext, container: HTMLElement) 
    {
        super(container)
        this.context = context;
        this.element.className = "GainComponent";

        this.node = this.context.createGain();

        this.slider = new Slider(this.element);
        this.slider.setRange(-120, 12, 0.5);
        this.slider.setText("Gain: ")
        this.slider.setDefaultValue(0);
        this.slider.setValue(0);
        this.slider.setSuffix("dBFS");
        this.slider.addEventListener('input', this.updateGain.bind(this));
        this.slider.addAndMakeVisible();
    }

    private updateGain (): void {
        this.node.gain.linearRampToValueAtTime(Utils.decibelsToGain(this.slider.getValue()), this.context.currentTime + SCHEDULE_AHEAD);
    }

}

export default GainComponent;