import { NAME } from "./joll_globals.js";
import Component from "./joll_Component.js";
import ScrollBoxLabel from "./joll_ScrollBoxLabel.js";
import RangedValue from "./joll_RangedValue.js";
import Utils from "./joll_Utils.js";

/**
 * Behaves simlarly to a vertical slider, but without the graphics of a slider.
 * You click the element and drag the mouse to change values.
 */
export class ScrollBox extends Component
{
    public name: string = "ScrollBox";

    /** Mouse is pressed. */
    private isdown: boolean = false;

    /** Moseposition Y coordinate.  */
    private y: number = 0;
    
    /** Current value. */
    public value: RangedValue = new RangedValue();

    private step: number = 0.001;

    /** The default value. */
    private defaultValue: number = 0.5;

    /** Callbacks to run when the value is changed */
    private onvaluechangedCallbacks: Array<Function> = [];

    public label: ScrollBoxLabel;

    private dblclickListener;
    // private eventListenerDoubleClick: EventListener;

    // private eventValueChanged: CustomEvent;

    constructor (container: HTMLElement)
    {
        super(container);

        /* Style this element. */
        this.element.classList.add(NAME, this.name);
        this.element.style.cursor = "pointer";
        this.element.style.userSelect = "none";

        /* Create elements to display values */
        this.label = new ScrollBoxLabel(this.element);
        this.label.addAndMakeVisible();

        /* Add Event Listeners */
        this.label.value.addEventListener('keydown', 
        
            (event: KeyboardEvent): void => 
            {                   
                if (event.defaultPrevented) 
                {
                    return; // Do nothing if the event was already processed  
                }

                /** Deselect the element and set value to typed value. */
                if (!Utils.isNumber(event.key))
                {
                    this.setValue(this.label.value.valueAsNumber);
                    this.label.value.blur();
                }
                
                console.log('Value Changed, event:')

            });

        this.element.addEventListener('mousedown', 

            (e: MouseEvent): void => {
                this.isdown = true;
                this.y = e.clientY;
            });

        /** Update value when element is pressed and then mouse is moved up / down. */
        document.body.addEventListener('mousemove',

            (e: MouseEvent): void => {
                if (this.isdown) {
                    const change =  this.y - e.clientY;
                    this.setValue(this.value.getValue() + change);
                    this.y = e.clientY;
                }
            });

        window.addEventListener('mouseup', 
        
            (e: MouseEvent): void => {
                this.isdown = false;
            });

        this.dblclickListener = 

            (ev: KeyboardEvent): void => 
            { 
                this.setValue(this.defaultValue);
            } 

        this.setValue(this.defaultValue);
    }

    /** Add or remove the doubleclick listener. */
    public doubleClickSetsDefaultValue (bool = true): void
    {
        if (bool) 
        {
            /** Set the value to default on double-click. */
            this.element.addEventListener ('dblclick', this.dblclickListener)
        }
        else
        {
            this.element.removeEventListener ('dblclick', this.dblclickListener)
        }
    }

    public setRange (newMinimum: number, newMaximum: number): void 
    {
        this.value.setRange(newMinimum, newMaximum);
        this.label.setRange(newMinimum, newMaximum);
    }

    /** Update the current value and run potentially attached callbacks. 
     * Should be changed to event emitter?? */
    public setValue (newValue: number): void 
    {
        this.value.setValue(newValue);
        this.label.setValue(this.value.getValue());
        this.runValueChangedCallbacks();
    }

    /** The callback will recieve the updated value as sole parameter. */
    public addValueChangedCallback (callback: Function): void 
    {
        this.onvaluechangedCallbacks.push(callback);
    }

    private runValueChangedCallbacks (): void
    {
        this.onvaluechangedCallbacks.forEach ( 
            (callback: Function): void => 
            {
                callback(this.value.getValue());
            })
    } 

    /** Updates the value to be set when double-clicking. */
    public setDefaultValue (newValue: number): void 
    {
        this.defaultValue = newValue;
        this.setValue(newValue);
    }

    /** What step size to use for the values, minimum of 0.001. */
    public setStep (newStep: number) 
    {
        this.step = (newStep > 0.001) ? newStep : 0.001;
    }


}

export default ScrollBox;