export class SliderLabel 
{
    private control: HTMLInputElement;
    private container: HTMLElement;
    private element: HTMLElement;
    private labelElement: HTMLLabelElement; 
    private valueDisplayElement: HTMLOutputElement; 
    private suffix: string = "";

    constructor(container: HTMLElement, control: HTMLInputElement) 
    {
        this.container = container;
        this.control = control;

        this.element = document.createElement('div');
        this.element.className = "slider-label";
        this.container.appendChild(this.element);

        this.labelElement = document.createElement('label');

        this.valueDisplayElement = document.createElement('output');

        this.element.appendChild(this.labelElement);
        this.element.appendChild(this.valueDisplayElement);

        this.control.addEventListener('input', (() => { this.setValue(this.control.value)}).bind(this) );
    }

    public setValue (newValue: string | number): void 
    {
        this.valueDisplayElement.innerText = `${newValue} ${this.suffix}`
    }

    public setText (text: string): void 
    { 
        this.labelElement.textContent = text; 
    }

    public setSuffix (newSuffix: string): void 
    { 
        this.suffix = newSuffix; 
    }

}

export default SliderLabel;