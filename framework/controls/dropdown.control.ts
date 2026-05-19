import { BaseControl } from './base.control';

export class DropdownControl extends BaseControl {
    public async selectByText(text: string) {
        await this.getLocator().selectOption({ label: text });
    }

    public async selectByValue(value: string) {
        await this.getLocator().selectOption({ value: value });
    }
}
