import Slider from "./joll_Slider.js";

export class SliderVertical extends Slider
{
    constructor (container: HTMLElement)
    {
        super(container);
        this.control.setAttribute('orient', 'vertical');
        // this.control.setAttribute('type', 'range');

    }
}

export default SliderVertical;