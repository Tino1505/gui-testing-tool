import { BaseControl } from './base.control';

export class CheckboxControl extends BaseControl {
    public async check() {
        await this.getLocator().check();
    }

    public async uncheck() {
        await this.getLocator().uncheck();
    }

    public async isChecked(): Promise<boolean> {
        return await this.getLocator().isChecked();
    }
}
