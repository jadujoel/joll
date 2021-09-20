export class ToggleButton
{
    protected container;
    protected labelEl: HTMLLabelElement;
    protected textEl: HTMLSpanElement;
    protected checkboxEl: HTMLInputElement;
    protected visualEl: HTMLSpanElement;

    constructor (container: HTMLElement) 
    {
        this.container = container;

        this.labelEl = document.createElement("label") as HTMLLabelElement;
        this.textEl = document.createElement("span") as HTMLSpanElement;
        this.checkboxEl = document.createElement("input");
        this.checkboxEl.setAttribute("type", "checkbox");
        this.visualEl = document.createElement("span") as HTMLSpanElement;
        
        this.labelEl.appendChild(this.textEl);
        this.labelEl.appendChild(this.checkboxEl);
        this.labelEl.appendChild(this.visualEl);

        this.labelEl.className = "joll-toggle-button-label"
        this.textEl.className = "joll-toggle-button-text"
        this.checkboxEl.className = "joll-toggle-button-checkbox"
        this.visualEl.className = "joll-toggle-button-visual"

    }  

    add (): void 
    {
        this.container.appendChild(this.labelEl);
    }

}

export default ToggleButton;