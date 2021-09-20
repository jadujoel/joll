export namespace Utils 
{
    export function gainToDecibels (gain: number) 
    {
        return Math.log10(gain) * 20;
    }

    export function decibelsToGain (decibels: number) 
    {
        return Math.pow(10, (decibels * 0.05));
    }

    export function isNumber(value: string | number): boolean
    {
        return ((value != null) 
            && (value !== '') 
            && !isNaN(Number(value.toString())));
    }

    export class Queue
    {
        public elements = new Array;
    
        public setElements <T> (elements: Array<T>): void {
            this.elements = [...elements];
        }
    
        public enqueue <T> (element: T): void 
        {
            this.elements.push(element);
        };
    
        public dequeue (): void 
        {
            return this.elements.shift();
        };
    
        public isEmpty (): boolean 
        {
            return this.elements.length == 0;
        };
    
        peek (): any 
        {
            return !this.isEmpty() ? this.elements[0] : undefined;
        };
    
        length (): number
        {
            return this.elements.length;
        }
    }
}

export default Utils;