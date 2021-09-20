
export class Inactive {
    time: any;
    timeoutTime: number;
    eventTypes: Array<string> = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    public oninactive: Function;
    public onactive: Function;

    constructor(timeoutTime:number, oninactive:Function, onactive:Function) {
        this.oninactive = oninactive;
        this.onactive = onactive;
        this.timeoutTime = timeoutTime;
        this.update();
    }

    update (): void 
    {
        window.addEventListener('load', () => 
        {
            clearTimeout(this.time);
            this.time = setTimeout(this.oninactive, this.timeoutTime);
        }, true);

        this.eventTypes.forEach(
            
            (e) => 
            { 
                document.addEventListener(e, 
                    
                    () => 
                    { 
                        clearTimeout(this.time);
                        this.time = setTimeout(this.oninactive, this.timeoutTime);
                        this.onactive();
                    }, 
                    true
                );
            });   
    }
};

export default Inactive;