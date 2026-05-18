import { BaseControl } from '../base/base.control';

export class DropdownControl extends BaseControl {
    public async selectByValue(value: string) {
        await this.getLocator().selectOption({ value: value });
    }

    public async selectByText(text: string) {
        await this.getLocator().selectOption({ label: text });
    }

    public async selectByIndex(index: number) {
        await this.getLocator().selectOption({ index: index });
    }

    public async executeAction(action: string, actualData: string, step: any, targetId: string): Promise<string> {
        if (action === "select") {
            await this.waitForVisible();
            await this.selectByText(String(actualData));
            return `Selected '${actualData}' from ${targetId}`;
        }
        
        return super.executeAction(action, actualData, step, targetId);
    }
}
