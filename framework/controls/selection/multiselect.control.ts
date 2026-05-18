import { BaseControl } from '../base/base.control';

export class MultiSelectControl extends BaseControl {
    public async selectValues(values: string[]) {
        const loc = await this['getWorkingLocator']();
        await loc.selectOption(values);
    }
}
