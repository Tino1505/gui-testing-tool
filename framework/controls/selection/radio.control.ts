import { BaseControl } from '../base/base.control';

export class RadioControl extends BaseControl {
    public async select() {
        await this.getLocator().check();
    }

    public async isSelected(): Promise<boolean> {
        return await this.getLocator().isChecked();
    }
}
