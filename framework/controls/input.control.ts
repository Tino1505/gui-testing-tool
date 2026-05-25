import { BaseControl } from './base.control';

export class TextBoxControl extends BaseControl {
    public async fill(text: string) {
        await this.getInteractableLocator().fill(text);
    }

    public async clear() {
        await this.getInteractableLocator().clear();
    }

    public async type(text: string, delayMs: number = 50) {
        await this.getInteractableLocator().pressSequentially(text, { delay: delayMs });
    }


}
