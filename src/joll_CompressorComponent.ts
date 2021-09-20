import Slider from "./joll_Slider.js";
import { SCHEDULE_AHEAD } from "./joll_globals.js";

export class CompressorComponent 
{
    private context: AudioContext;
    private container: HTMLElement;
    private element: HTMLElement;
    private titleElement: HTMLElement;

    private thresholdSlider: Slider;
    private ratioSlider: Slider;
    private attackSlider: Slider;
    private releaseSlider: Slider;
    private kneeSlider: Slider;

    public node: DynamicsCompressorNode;
    // public input: DynamicsCompressorNode;
    public output: DynamicsCompressorNode;

    constructor (context: AudioContext, container: HTMLElement) 
    {
        this.context = context;
        this.container = container;

        this.node = this.context.createDynamicsCompressor();
        
        this.element = document.createElement('div');
        this.element.className = "compressor"
        
        this.titleElement = document.createElement('h3');
        this.titleElement.innerText = "Compressor";
        this.element.appendChild(this.titleElement);

        this.thresholdSlider = new Slider(this.element);
        this.thresholdSlider.addEventListener('input', this.updateThreshold.bind(this));
        this.thresholdSlider.setText("Threshold: ");
        this.thresholdSlider.setSuffix("dBFS")
        this.thresholdSlider.setRange(-100, 0, 1);
        this.thresholdSlider.setDefaultValue(0);
        this.thresholdSlider.setValue(-12);
        this.thresholdSlider.addAndMakeVisible();

        this.ratioSlider = new Slider(this.element);
        this.ratioSlider.addEventListener('input', this.updateRatio.bind(this));
        this.ratioSlider.setText("Ratio: ");
        this.ratioSlider.setRange(1, 20, 1);
        this.ratioSlider.setDefaultValue(4);
        this.ratioSlider.setValue(4);
        this.ratioSlider.addAndMakeVisible();

        this.attackSlider = new Slider(this.element);
        this.attackSlider.addEventListener('input', this.updateAttack.bind(this));
        this.attackSlider.setText("Attack: ");
        this.attackSlider.setSuffix("ms")
        this.attackSlider.setRange(1, 200, 1);
        this.attackSlider.setDefaultValue(4);
        this.attackSlider.setValue(4);
        this.attackSlider.addAndMakeVisible();

        this.releaseSlider = new Slider(this.element);
        this.releaseSlider.addEventListener('input', this.updateRelease.bind(this));
        this.releaseSlider.setText("Release: ");
        this.releaseSlider.setSuffix("ms")
        this.releaseSlider.setRange(1, 200, 1);
        this.releaseSlider.setDefaultValue(40);
        this.releaseSlider.setValue(40);
        this.releaseSlider.addAndMakeVisible();

        this.kneeSlider = new Slider(this.element);
        this.kneeSlider.addEventListener('input', this.updateKnee.bind(this));
        this.kneeSlider.setText("Knee: ");
        this.kneeSlider.setRange(0, 40, 1);
        this.kneeSlider.setDefaultValue(30);
        this.kneeSlider.setValue(30);
        this.kneeSlider.addAndMakeVisible();

        this.output = this.node;
    }

    public addAndMakeVisible (): void 
    {
        this.container.appendChild(this.element);
    }

    public setTitle (newTitle: string): void
    {
        this.titleElement.innerText = newTitle;
    }

    private updateThreshold (): void 
    {
        this.node.threshold.setTargetAtTime(this.thresholdSlider.getValue(), this.context.currentTime + SCHEDULE_AHEAD, 0.02);
    }

    private updateRatio (): void 
    {
        this.node.ratio.setTargetAtTime(this.ratioSlider.getValue(), this.context.currentTime + SCHEDULE_AHEAD, 0.02);;
    }

    private updateAttack (): void 
    {
        this.node.attack.setTargetAtTime(this.attackSlider.getValue() / 1000, this.context.currentTime + SCHEDULE_AHEAD, 0.02);
    }

    private updateRelease (): void 
    {
        this.node.release.setTargetAtTime(this.releaseSlider.getValue() / 1000, this.context.currentTime + SCHEDULE_AHEAD, 0.02);
    }

    private updateKnee (): void 
    {
        this.node.knee.setTargetAtTime(this.kneeSlider.getValue(), this.context.currentTime + SCHEDULE_AHEAD, 0.02);
    }

}

export default CompressorComponent;