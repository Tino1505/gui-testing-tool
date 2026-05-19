import { BaseControl } from './base.control';

export class TextBoxControl extends BaseControl {
    public async fill(text: string) {
        await this.getLocator().fill(text);
    }

    public async clear() {
        await this.getLocator().clear();
    }

    public async type(text: string, delayMs: number = 50) {
        await this.getLocator().pressSequentially(text, { delay: delayMs });
    }


}
