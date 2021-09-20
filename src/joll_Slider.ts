import SliderLabel from "./joll_SliderLabel.js";

export class Slider 
{
    protected container: HTMLElement;
    protected element: HTMLElement;
    protected control: HTMLInputElement;
    protected value: number = 0.5;
    protected defaultValue: number = 0.5;
    protected min: number = 0;
    protected max: number = 1;
    protected interval: number = 0.001;
    protected label: SliderLabel;

    constructor (container: HTMLElement, element?: HTMLElement) 
    {
        this.container = container;

        this.element = element || document.createElement('div');
        this.element.className = "joll slider";

        this.control = document.createElement('input');
        this.control.type = "range"
        this.control.min = String(this.min);
        this.control.max = String(this.max);
        this.control.defaultValue = String(this.defaultValue);
        this.control.step = String(this.interval);
        this.control.className = "joll";

        // Return To default value on double click
        this.control.addEventListener('dblclick', () =>
        {
            this.setValue(this.defaultValue);
        } )
        
        this.label = new SliderLabel(this.element, this.control);
        
        this.element.appendChild(this.control);
    }

    public setText(newText: string): void 
    { 
        this.label.setText(newText); 
    }
    
    public setSuffix(newText: string): void 
    { 
        this.label.setSuffix(newText); 
    }

    public setValue (newValue: number): void 
    {
        this.value = newValue;
        this.control.value = String(this.value);
        this.label.setValue(this.value)
        // fireEv
        // this.control.
    }

    public setDefaultValue (newValue: number): void 
    {
        this.defaultValue = newValue;
        this.control.defaultValue = String(this.defaultValue);
    }

    public setInterval (newInterval: number) 
    {
        this.interval = (newInterval > 0.001) ? newInterval : 0.001;
        this.control.step = String(this.interval);
    }

    public setRange (newMinimum: number, newMaximum: number, newInterval?: number): void 
    {
        if (typeof newInterval !== 'undefined') { this.setInterval(newInterval) };
        this.setMin(newMinimum);
        this.setMax(newMaximum);
    }

    public setMin (newMinimum: number): void 
    {
        this.min = newMinimum;
        this.control.min = String(newMinimum);
    }
    
    public setMax (newMaximum: number): void 
    {
        this.max = newMaximum;
        this.control.max = String(newMaximum);
    }

    public setTextValueSuffix (suffix: string): void 
    {
        this.setSuffix(suffix);
    }

    public addAndMakeVisible(): void 
    {
        this.control.dispatchEvent(new Event('input', { bubbles: true }));
        this.container.appendChild(this.element)
    }

    public getMax (): number { return this.max; }
    public getMin (): number { return this.min; }
    public getValue (): number { return this.control.valueAsNumber; }
    public getInterval (): number { return this.interval; }

    public addEventListener <K extends keyof HTMLElementEventMap> (type: K, listener: (this: HTMLInputElement, ev: Event) => any, options?: boolean | AddEventListenerOptions): void 
    {
        this.control.addEventListener(type, listener, options);
    }

}

export default Slider;