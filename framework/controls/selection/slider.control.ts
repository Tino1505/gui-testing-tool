import { BaseControl } from '../base/base.control';

export class SliderControl extends BaseControl {
    // Sliders usually involve complex drag and drop or setting value directly
    public async setValue(value: string) {
        const loc = await this['getWorkingLocator']();
        await loc.fill(value); // Some implementations allow fill, or we might need eval
    }
}
