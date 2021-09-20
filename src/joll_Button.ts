import Component from "./joll_Component.js";

export class Button extends Component
{
    // private element: HTMLelement;
    protected spanElement: HTMLSpanElement;
    protected isChecked: boolean = false;

    protected _isOver: boolean = false;
    protected _isDown: boolean = false;
    protected _isChecked: boolean = false;

    constructor (container: HTMLElement) 
    {
        super(container, document.createElement('button'));

        this.spanElement = document.createElement<"span">("span") as HTMLSpanElement;       
        this.element.appendChild(this.spanElement);
        this.container.appendChild(this.element);

        this.element.setAttribute("role", "switch");

        this.addEventListener("click", () => 
        { 
            this._isChecked = !(this.element.getAttribute("aria-checked") === "true");
            this.element.setAttribute("aria-checked", String(this._isChecked));
        });

        this.element.setAttribute("aria-checked", "false");
        
        this.setClassName("joll button");

        this.element.onmouseover = () => { this._isOver = true; }
        this.element.onmouseout = () => { this._isOver = false; }
        this.element.onclick = () => { this._isDown = true; }
        this.element.onmouseup = () => { this._isDown = false; }
    }  

    /** Returns true if the button is currently being held down.
        @see _isOver
    */
    public isDown (): boolean { return this._isDown; }

    /** Returns true if the mouse is currently over the button.
        This will be also be true if the button is being held down.
        @see _isDown
    */
    public isOver (): boolean { return this._isOver; } 
    
    
    public override setText (newText: string): void
    {
        this.spanElement.innerText = newText;
    }

    public override setClassName (newClassName: string)
    {
        this.element.className = newClassName;
    }

    public setClickingTogglesState (bool?: boolean)
    {

    }


}

export default Button;