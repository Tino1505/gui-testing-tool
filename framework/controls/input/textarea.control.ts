import { BaseControl } from '../base/base.control';

export class TextAreaControl extends BaseControl {
    public async fill(text: string) {
        const loc = await this['getWorkingLocator']();
        await loc.fill(text);
    }

    public async clear() {
        const loc = await this['getWorkingLocator']();
        await loc.fill('');
    }
}
