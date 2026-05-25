import { BaseControl } from './base.control';

export class CheckboxControl extends BaseControl {
    public async check() {
        await this.getInteractableLocator().check();
    }

    public async uncheck() {
        await this.getInteractableLocator().uncheck();
    }

    public async isChecked(): Promise<boolean> {
        return await this.getInteractableLocator().isChecked();
    }
}
