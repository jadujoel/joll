
export class RangedValue
{
    private value: number = 0;

    /** The minimum possible value. */
    private min: number = 0;

    /** The maximum possible value. */
    private max: number = 1;
    // private step: number = 0.001;

    constructor ()
    {

    }

    /** Update the value with checks in place. */
    public setValue (newValue: number): void
    {      
        /** Update the value to a value in allowed range. */
        this.value = Math.min( this.max, Math.max(this.min, newValue) )
    }


    public getValue (): number
    {
        return this.value;
    }

    /** What step size to use for the values, minimum of 0.001. */
    // public setStep (newStep: number) 
    // {
    //     this.step = (newStep > 0.001) ? newStep : 0.001;
    // }

    public setRange (newMinimum: number, newMaximum: number): void 
    {
        this.setMin(newMinimum);
        this.setMax(newMaximum);
    }

    public setMin (newMinimum: number): void 
    {
        this.min = newMinimum;
    }
    
    public setMax (newMaximum: number): void 
    {
        this.max = newMaximum;
    }
}

export default RangedValue;