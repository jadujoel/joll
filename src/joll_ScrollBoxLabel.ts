import Component from "./joll_Component.js"
import { NAME } from "./joll_globals.js";

export class ScrollBoxLabel extends Component
{
    public name: string = "ScrollBoxLabel";

    private numDecimalsToDisplay: number = 3;

    private prefix: HTMLSpanElement;
    public value: HTMLInputElement;
    private suffix: HTMLSpanElement;

    public valueComponent: Component;

    constructor (container: HTMLElement)
    {
        super(container, document.createElement('label'));

        this.element.classList.add(NAME, this.name);
        
        this.prefix = document.createElement('span');
        this.prefix.classList.add(NAME, this.name, "prefix");
        this.element.appendChild(this.prefix);
        console.log("Appending SCrollBoxLabel prefix");

        this.value = document.createElement('input');
        this.value.classList.add(NAME, this.name, "value");
        this.value.type = 'number';
        this.valueComponent = new Component(this.element, this.value);

        this.element.appendChild(this.value);
        
        this.suffix = document.createElement('span');
        this.suffix.classList.add(NAME, this.name, "suffix");
        this.element.appendChild(this.suffix);

        this.setValueEditable(true);

        // this.valueComponent.addShortcut('')
    }

    public setValueEditable (bool: boolean): void
    {
        if (bool === true)
        {
            this.value.style.userSelect = "all";
            this.value.contentEditable = "true";
        }
        else 
        {
            this.value.style.userSelect = "none";
            this.value.contentEditable = "false";
        }

    }

    public setRange (newMinimum: number | string, newMaximum: number | string): void
    {
        this.setMin(newMinimum);
        this.setMax(newMaximum)
    }

    public setMin (newMinimum: number | string)
    {
        this.value.min = <string> newMinimum;
    }
   
    public setMax (newMaximum: number | string)
    {
        this.value.max = <string> newMaximum;
    }

    public setValue (newValue: string | number): void
    {
        this.value.value = <string> newValue;
    }

    public setPrefix (newPrefix: string): void
    {
        this.prefix.innerText = newPrefix;
    }
    public setSuffix (newSuffix: string): void
    {
        this.suffix.innerText = newSuffix;
    }

    
}

export default ScrollBoxLabel;