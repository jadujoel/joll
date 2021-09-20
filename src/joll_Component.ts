export class Component 
{
    /** The element that this component will be a child of. */
    public container: HTMLElement;

    /** The main element of this Component. */
    public element: HTMLElement;

    constructor(container: HTMLElement, element?: HTMLElement)
    {
        this.container = container;
        this.element = element || document.createElement('div') as HTMLDivElement;
    }

    public add (): void 
    {
        this.container.appendChild(this.element);
    }

    public addAndMakeVisible (): void 
    {
        this.add();
    }

    /** Hide the component using CSS. */
    public hide (): void {
        this.element.style.visibility = "hidden";
        this.element.style.display = "none";
    }

    /** Show the component using CSS. */
    public show (): void 
    {
        this.element.style.visibility = "initial";
        this.element.style.display = "initial";
    }

    public setClassName (newClassName: string): void 
    {
        this.element.className = newClassName;
    }

    public addClassNames (...tokens: string[]): void 
    {
        this.element.classList.add(...tokens);
    }

    public removeClassNames (...tokens: string[]): void
    {
        this.element.classList.remove(...tokens)
    }

    public replaceClassName (oldToken: string, newToken: string): void 
    {
        this.element.classList.replace(oldToken, newToken);
    }

    /** Set the main element inner text. */
    public setText (newText: string): void
    {
        this.element.innerText = newText;
    }

    // public triggerClick (): void
    // {
    //     console.log("Clicked.")
    //     this.element.dispatchEvent(new Event('click', { bubbles: true }));
    // }

    /** Assigns a shortcut key to trigger a click on the Component. */
    public addShortcut (key: string, type: string = 'click', bubbles = true): void
    {
        document.addEventListener("keypress", 

            (event: KeyboardEvent): void => 
            {
                if (event.key === key) 
                {
                    this.element.dispatchEvent(new Event(type, { bubbles: bubbles }));
                }
            }

        );
    }

    public clearShortcuts(): void
    {

    }

    // void setTooltip (const String& newTooltip) override;

    /** Add event listener to the main element of this component. */
    public addEventListener <K extends keyof HTMLElementEventMap>
    (   type: K | string, 
        listener: (this: HTMLElement, ev: Event) => any | EventListenerOrEventListenerObject, 
        options?: boolean | AddEventListenerOptions ): void 
    {
        this.element.addEventListener(type, listener, options);
    }

    // removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    // removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;


    /** Dispatch Event from this component. */
    public dispatchEvent (event: Event)
    {
        this.element.dispatchEvent(event);
    }

}

export default Component;